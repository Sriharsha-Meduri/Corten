"""
Corten inference engine (onnxruntime-only).

Runs the trained YOLOv8 ONNX model directly through ONNX Runtime (no torch or
ultralytics), so the runtime footprint stays small (~150 MB) and fits a 512 MB
host. Handles letterbox preprocessing, decoding, and class-aware NMS by hand.
"""
import os
import ast

import cv2
import numpy as np
import onnxruntime as ort

CONF_THRESHOLD = 0.40      # minimum class confidence to keep a detection
IOU_THRESHOLD = 0.45       # NMS IoU threshold
INPUT_SIZE = 416           # model input is 416x416
CRITICAL_CONF = 0.70       # >= this is treated as high severity

_DEFAULT_MODEL = os.path.join(os.path.dirname(__file__), "..", "models", "corten_v1.onnx")
_FALLBACK_NAMES = {0: "Deframe", 1: "Dent", 2: "Hole", 3: "Minor-Dent", 4: "Rust"}


class CortenEngine:
    def __init__(self, model_path: str | None = None):
        path = os.path.abspath(model_path or _DEFAULT_MODEL)
        self.session = ort.InferenceSession(path, providers=["CPUExecutionProvider"])
        self.input_name = self.session.get_inputs()[0].name

        meta = self.session.get_modelmeta().custom_metadata_map
        try:
            self.names = ast.literal_eval(meta.get("names", ""))
            assert isinstance(self.names, dict)
        except (ValueError, SyntaxError, AssertionError):
            self.names = _FALLBACK_NAMES
        print(f"Corten engine loaded: {path}")
        print(f"Classes: {self.names}")

    def _color_for(self, conf: float):
        # BGR colours for OpenCV drawing.
        if conf >= CRITICAL_CONF:
            return (0, 0, 255)      # red    - high severity
        if conf >= CONF_THRESHOLD:
            return (0, 255, 255)    # yellow - moderate
        return (0, 255, 0)          # green  - low

    @staticmethod
    def _letterbox(img, size=INPUT_SIZE, color=(114, 114, 114)):
        """Resize keeping aspect ratio, pad to a square. Returns padded image,
        scale ratio, and (dw, dh) padding offsets."""
        h, w = img.shape[:2]
        r = min(size / h, size / w)
        nw, nh = int(round(w * r)), int(round(h * r))
        resized = cv2.resize(img, (nw, nh), interpolation=cv2.INTER_LINEAR)
        canvas = np.full((size, size, 3), color, dtype=np.uint8)
        dw, dh = (size - nw) // 2, (size - nh) // 2
        canvas[dh:dh + nh, dw:dw + nw] = resized
        return canvas, r, dw, dh

    def scan(self, frame):
        """Detect damage on a single BGR frame.

        Returns (annotated_frame, detections) where detections is a list of
        {"class": str, "conf": float, "bbox_xyxy": [x1, y1, x2, y2]}.
        """
        h0, w0 = frame.shape[:2]
        canvas, r, dw, dh = self._letterbox(frame)

        # Preprocess: BGR->RGB, 0-1, HWC->CHW, add batch.
        blob = cv2.cvtColor(canvas, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
        blob = np.ascontiguousarray(blob.transpose(2, 0, 1)[None])

        # Inference. Output is [1, 4+num_classes, num_anchors] (YOLOv8 layout).
        out = self.session.run(None, {self.input_name: blob})[0]
        preds = out[0].T  # -> [num_anchors, 4+num_classes]

        boxes_xywh = preds[:, :4]
        class_scores = preds[:, 4:]
        class_ids = np.argmax(class_scores, axis=1)
        confs = class_scores[np.arange(class_scores.shape[0]), class_ids]

        keep = confs >= CONF_THRESHOLD
        boxes_xywh, confs, class_ids = boxes_xywh[keep], confs[keep], class_ids[keep]

        annotated = frame.copy()
        detections = []

        if len(boxes_xywh):
            # xywh (centre, 416 space) -> xyxy, then undo letterbox to original coords.
            cx, cy, ww, hh = boxes_xywh.T
            x1 = (cx - ww / 2 - dw) / r
            y1 = (cy - hh / 2 - dh) / r
            x2 = (cx + ww / 2 - dw) / r
            y2 = (cy + hh / 2 - dh) / r
            x1 = np.clip(x1, 0, w0); x2 = np.clip(x2, 0, w0)
            y1 = np.clip(y1, 0, h0); y2 = np.clip(y2, 0, h0)

            # Class-aware NMS via a per-class coordinate offset (standard trick).
            offset = class_ids * (max(h0, w0) + 1)
            rects = np.stack([x1 + offset, y1 + offset, x2 - x1, y2 - y1], axis=1).tolist()
            idxs = cv2.dnn.NMSBoxes(rects, confs.tolist(), CONF_THRESHOLD, IOU_THRESHOLD)

            for i in np.array(idxs).flatten():
                conf = float(confs[i])
                cls_name = self.names.get(int(class_ids[i]), str(int(class_ids[i])))
                bx1, by1, bx2, by2 = int(x1[i]), int(y1[i]), int(x2[i]), int(y2[i])
                color = self._color_for(conf)

                label = f"{cls_name.capitalize()} ({int(conf * 100)}%)"
                cv2.rectangle(annotated, (bx1, by1), (bx2, by2), color, 2)
                (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                cv2.rectangle(annotated, (bx1, by1 - 24), (bx1 + tw, by1), color, -1)
                cv2.putText(annotated, label, (bx1, by1 - 6),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)

                detections.append({
                    "class": cls_name,
                    "conf": conf,
                    "bbox_xyxy": [float(bx1), float(by1), float(bx2), float(by2)],
                })

        return annotated, detections
