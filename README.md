<h1 align="center">Corten</h1>

<p align="center"><strong>Real-time container damage detection at the edge.</strong></p>

<p align="center">
  A computer-vision system that inspects shipping containers for structural damage (Holes, Dents, Rust, Deframe, and Minor-dents) from images, video, or a live camera feed. A fine-tuned YOLO model runs on edge hardware (NVIDIA Jetson) with sub-50ms inference, streaming results to an operator dashboard.
</p>

<p align="center">
  <a href="https://cortenai.vercel.app">Live Demo</a>
  &nbsp;·&nbsp;
  <a href="https://corten-backend.onrender.com/docs">API Docs</a>
</p>

---

## Why

Manual container inspection at ports is slow, inconsistent, and expensive. A single missed structural defect can lead to disputes, insurance claims, and vessel delays. Corten automates the inspection: point a camera at a container and it flags damage in real time, with confidence scores and severity tiers, using existing CCTV or a handheld device.

## Features

- **Five-class detection:** Hole, Dent, Deframe, Minor-Dent, and Rust, each with a severity tier (critical, moderate, or minor).
- **Three analysis modes:** single image, frame-by-frame video, and a live webcam feed, all served by the same model.
- **Edge-ready:** a fine-tuned YOLO model exported to ONNX. Runs on CPU for development and on Jetson (TensorRT/FP16) for 30+ FPS in the field.
- **Lightweight backend:** pure ONNX Runtime inference with no torch dependency, so it runs in about 150 MB of RAM and fits a free-tier host.
- **Annotated output:** bounding boxes with class labels and confidence colour coding, returned as ready-to-display images.
- **Operator dashboard:** a clean React UI with detection results, severity scoring, and an activity log.

## Detection classes

| Class | Severity | Description |
| :--- | :--- | :--- |
| Hole | Critical | Structural punctures and perforations |
| Deframe | Critical | Frame misalignment or structural warping |
| Dent | Moderate | Surface depressions from impact |
| Rust | Moderate | Corrosion and oxidation |
| Minor-Dent | Minor | Small, shallow dents logged for audit |

## Tech stack

**Backend:** Python, FastAPI, ONNX Runtime, OpenCV, NumPy (no torch, pure ONNX inference, ~150 MB footprint)
**Frontend:** React 19, TypeScript, Vite, Tailwind CSS
**Model:** a YOLO detector fine-tuned on a custom container-damage dataset, exported to ONNX (416x416 input, 5 classes)

## Architecture

```
                 image / video / webcam frame
  React frontend  ───────────────────────────▶  FastAPI backend
  (Vite, TS)      ◀───────────────────────────  (ONNX Runtime + OpenCV)
                 annotated image + detections            │
                                                         ▼
                                                  corten_v1.onnx (YOLO)
```

The backend loads the ONNX model once into a shared `CortenEngine` and exposes:

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET`  | `/` , `/health` | Health check |
| `POST` | `/predict` | Single image, returns annotated image plus detections |
| `POST` | `/predict-video-frames` | Video, returns per-frame detections, summary, annotated gallery |
| `POST` | `/analyze` | Single image, returns a compact summary payload |

---

## Getting started

### Prerequisites
- Python 3.10 or newer
- Node.js 18 or newer

### 1. Backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS / Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn src.main:app --reload --port 8000
```

The API is now live at `http://localhost:8000` (open `/docs` for the interactive Swagger UI).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`, go to **Analyse**, and upload a container image.

> The frontend talks to `http://localhost:8000` by default. To point it elsewhere,
> copy `.env.example` to `.env` and set `VITE_API_URL`.

### Docker (backend)

```bash
cd backend
docker build -t corten-backend .
docker run -p 8000:8000 corten-backend
```

## Deployment

The live demo runs the frontend on Vercel and the backend on Render:

- **Frontend (Vercel):** root directory `frontend`, with `VITE_API_URL` set to the backend URL.
- **Backend (Render):** root directory `backend`, Docker runtime. Reads `$PORT` automatically.

## Model training

The full training pipeline (dataset prep, fine-tuning, evaluation, and ONNX export) is documented in [`model_training.ipynb`](model_training.ipynb).

## Project structure

```
Corten/
├── backend/
│   ├── src/
│   │   ├── engine.py     # CortenEngine: ONNX inference + annotation
│   │   └── main.py       # FastAPI app and endpoints
│   ├── models/
│   │   └── corten_v1.onnx
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── components/       # Hero, Features, Analyse, dashboard, etc.
│   ├── App.tsx
│   └── index.html
├── model_training.ipynb
└── README.md
```

## License

MIT, see [LICENSE](LICENSE).
