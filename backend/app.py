
import base64
import os
import tempfile
import cv2
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from ultralytics import YOLO


app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "best.onnx")
model = YOLO(MODEL_PATH, task="detect")


@app.post("/predict-video-frames")
def predict_video_frames():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    video_file = request.files['file']
    # 1. Save to temp file
    tfile = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
    video_file.save(tfile.name)
    cap = cv2.VideoCapture(tfile.name)
    fps = cap.get(cv2.CAP_PROP_FPS) or 24
    output_gallery = []
    # 2. Extract 1 frame per second for 3 seconds
    for sec in range(3):
        frame_id = int(fps * sec)
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_id)
        ret, frame = cap.read()
        if not ret:
            break
        # --- ORIGINAL FRAME (Base64) ---
        _, buffer_orig = cv2.imencode('.jpg', frame)
        orig_base64 = base64.b64encode(buffer_orig).decode('utf-8')
        # --- PROCESSED FRAME (AI Inference) ---
        results = model.predict(source=frame, conf=0.40, imgsz=416, verbose=False)
        annotated_frame = results[0].plot()
        _, buffer_proc = cv2.imencode('.jpg', annotated_frame)
        proc_base64 = base64.b64encode(buffer_proc).decode('utf-8')
        # Store in gallery
        output_gallery.append({
            "second": sec,
            "original": orig_base64,
            "detected": proc_base64,
            "detections_count": len(results[0].boxes)
        })
    cap.release()
    os.remove(tfile.name)
    return jsonify({
        "status": "success",
        "gallery": output_gallery
    })

import base64
import os

import cv2
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from ultralytics import YOLO


app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "best.onnx")
model = YOLO(MODEL_PATH, task="detect")


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/predict")
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    img_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)
    if img is None:
        return jsonify({"error": "Invalid image data"}), 400

    results = model.predict(source=img, conf=0.40, imgsz=416, verbose=False)
    annotated_img = results[0].plot()

    encoded_ok, buffer = cv2.imencode(".jpg", annotated_img)
    if not encoded_ok:
        return jsonify({"error": "Failed to encode output image"}), 500

    img_base64 = base64.b64encode(buffer).decode("utf-8")

    detections = []
    boxes = results[0].boxes
    if boxes is not None:
        for box in boxes:
            cls_id = int(box.cls[0])
            detections.append(
                {
                    "class": model.names[cls_id],
                    "conf": float(box.conf[0]),
                    "bbox_xyxy": [float(v) for v in box.xyxy[0].tolist()],
                }
            )

    return jsonify(
        {
            "image_data": img_base64,
            "detections": detections,
            "count": len(detections),
        }
    )


# ─── Video Detection Endpoint ───────────────────────────────────────────────
@app.post("/predict_video")
def predict_video():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400


    # Save video temporarily (ensure /tmp exists on all OS)
    tmp_dir = os.path.join(os.path.dirname(__file__), "tmp")
    os.makedirs(tmp_dir, exist_ok=True)
    temp_path = os.path.join(tmp_dir, file.filename)
    file.save(temp_path)

    cap = cv2.VideoCapture(temp_path)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    detections_by_frame = []
    summary = {}
    processed = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        # Run YOLO detection
        results = model.predict(source=frame, conf=0.40, imgsz=416, verbose=False)
        frame_detections = []
        boxes = results[0].boxes
        if boxes is not None:
            for box in boxes:
                cls_id = int(box.cls[0])
                label = model.names[cls_id]
                conf = float(box.conf[0])
                frame_detections.append({
                    "class": label,
                    "conf": conf,
                    "bbox_xyxy": [float(v) for v in box.xyxy[0].tolist()],
                })
                # Count per class
                summary[label] = summary.get(label, 0) + 1
        detections_by_frame.append(frame_detections)
        processed += 1
        # For demo, limit to first 100 frames for speed
        if processed >= 100:
            break
    cap.release()
    os.remove(temp_path)




if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
