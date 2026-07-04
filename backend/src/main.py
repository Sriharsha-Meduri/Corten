"""
Corten backend API.

FastAPI service that wraps the CortenEngine and exposes the endpoints the
frontend consumes:

  GET  /                      health check
  GET  /health                health check
  POST /predict               single image  -> annotated image + detections
  POST /predict-video-frames  short video   -> per-frame detections + summary
  POST /analyze               single image  -> compact summary payload

All heavy inference is delegated to a single shared CortenEngine instance so
the model is loaded only once.
"""
import os
import base64
import tempfile

import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from src.engine import CortenEngine

app = FastAPI(title="Corten API", version="1.0.0")

# CORS: allow local dev origins plus an optional deployed frontend URL.
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        FRONTEND_URL,
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = CortenEngine()

# Cap video processing so an over-long clip can't hang the server.
MAX_VIDEO_FRAMES = 120


def _read_image(data: bytes):
    arr = np.frombuffer(data, np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)


def _encode_jpg(frame) -> str:
    ok, buffer = cv2.imencode(".jpg", frame)
    if not ok:
        raise ValueError("Failed to encode image")
    return base64.b64encode(buffer).decode("utf-8")


@app.get("/")
def root():
    return {"status": "Corten API online"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    img = _read_image(await file.read())
    if img is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image data"})

    annotated, detections = engine.scan(img)
    return {
        "image_data": _encode_jpg(annotated),
        "detections": detections,
        "count": len(detections),
        "total_issues": len(detections),
    }


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    """Compact payload: kept for compatibility with the enterprise dashboard view."""
    img = _read_image(await file.read())
    if img is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image data"})

    annotated, detections = engine.scan(img)
    return {
        "status": "success",
        "total_issues": len(detections),
        "details": [{"class": d["class"], "conf": d["conf"]} for d in detections],
        "image_data": _encode_jpg(annotated),
    }


@app.post("/predict-video-frames")
async def predict_video_frames(file: UploadFile = File(...)):
    """Sample the uploaded clip frame by frame, run detection, and return a
    summary plus per-frame detections and an annotated gallery."""
    suffix = os.path.splitext(file.filename or "")[1] or ".mp4"
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        tmp.write(await file.read())
        tmp.close()

        cap = cv2.VideoCapture(tmp.name)
        if not cap.isOpened():
            return JSONResponse(status_code=400, content={"error": "Could not read video"})

        fps = cap.get(cv2.CAP_PROP_FPS) or 24
        total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
        # Sample ~1 frame every third of a second to keep the payload light.
        step = max(1, int(fps // 3))

        detections_by_frame = []
        gallery = []
        summary: dict[str, int] = {}
        processed = 0
        idx = 0

        while processed < MAX_VIDEO_FRAMES:
            ok, frame = cap.read()
            if not ok:
                break
            if idx % step == 0:
                annotated, detections = engine.scan(frame)
                detections_by_frame.append(detections)
                for d in detections:
                    summary[d["class"]] = summary.get(d["class"], 0) + 1
                gallery.append({
                    "second": round(idx / fps, 2),
                    "detected": _encode_jpg(annotated),
                    "detections_count": len(detections),
                })
                processed += 1
            idx += 1

        cap.release()
        return {
            "status": "success",
            "frames_processed": processed,
            "total_frames": total,
            "summary": summary,
            "detections_by_frame": detections_by_frame,
            "gallery": gallery,
        }
    finally:
        try:
            os.remove(tmp.name)
        except OSError:
            pass


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
