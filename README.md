# ??? VisionGuardAI: Local-First Autonomous Inspection

**VisionGuardAI** is a high-speed, local-first computer vision ecosystem designed to run directly on warehouse hardware (NVIDIA Jetson Nano) to detect container damages (Holes, Dents, and Deframes) with zero dependency on external cloud latency.

---

## ?? The Bottlenecks We Solve

| **Costly** | **Risky** | **Toxic** |
| :--- | :--- | :--- |
| **Slow & Manual** | **Human Error** | **High Emissions** |
| Inspection takes minutes per container, leading to vessel delays and high demurrage charges (?3k - 8k/day). | Missed structural damage, broken seals, or unsafe stacking causes disputes & insurance claims. | Idle cranes, trucks, and vessels waiting for manual clearances waste fuel and heavily increase CO2. |

---

## ?? Smart AI. Instant Results.

### What is VisionGuard?
An intelligent computer vision platform that automates real-time inspection of containers, seals, stacking conditions, and warehouse quality using existing CCTV infrastructure.

### ?? The Workflow
1.  **?? Capture:** Live HD feeds from fixed CCTV or mobile cameras on pallets and yards.
2.  **?? Detect:** AI instantly identifies dents, rust, broken seals, leaks, and bad stacking.
3.  **?? Decide:** Auto-approves compliant containers. Flags anomalies for quick human review.
4.  **?? Report:** Generates digital logs + bounding box images for integration with existing TOS like **CARGOES**.

---

## ?? Key Features

-   ?? **Real-Time Overlays:** Clear bounding box overlays on live feeds with high-confidence scores.
-   ?? **Automated Reports:** PDF & dashboard reports auto-generated with AI remarks & visual evidence.
-   ?? **TOS Integration:** Seamless plug-and-play with existing Terminal Operating Systems (**CARGOES**).
-   ?? **Edge Ready:** Optimized models for **NVIDIA Jetson** for sub-50ms latency in remote yards.
-   ??? **Multi-Purpose:** Container damage, seal checks, safe stacking, and warehouse QC in one.
-   ?? **Sustainable:** Less idle time = lower fuel usage & smaller CO2 footprint.

---

## ??? System Architecture

The project is split into two high-performance local modules:

### 1. The Local API (The Coordinator)
*   **Tech:** FastAPI + Uvicorn + Python.
*   **Role:** Runs on your local workstation or a central warehouse server.
*   **Function:** Handles heavy batch processing for uploaded videos and high-resolution images using the YOLO ONNX model.

### 2. The Edge Engine (NVIDIA Jetson Nano)
*   **Tech:** TensorRT + OpenCV.
*   **Role:** The "on-site" muscle connected directly to CCTV/USB cameras.
*   **Optimization:** Uses TensorRT (`.engine`) with FP16 precision to achieve real-time detection at 25+ FPS directly on the Jetson’s Maxwell GPU.

---

## ??? Local Installation & Setup

### 1. Prerequisites
-   Python 3.9+
-   Node.js 18+
-   NVIDIA JetPack 4.6+ (For Jetson Nano users)

### 2. Backend Setup (Local Server)
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## ?? Performance Metrics (Local)

| Metric | Local Workstation (CPU/GPU) | Jetson Nano (TensorRT) |
| :--- | :--- | :--- |
| **Inference Latency** | ~150ms | **~38ms** |
| **Real-time FPS** | 6-10 FPS | **28 FPS** |
| **Privacy** | 100% Data remains Local | 100% Data remains Local |

---
OUR DEMO LINK: visionguardai.vercel.app

*Developed for the **DP World Hackathon 2026**.*
