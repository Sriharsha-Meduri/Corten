# 🦾 Container Damage Detection System (DP World Hackathon)

A high-performance AI-powered system for automated container damage inspection. This project uses **YOLOv8** for real-time detection of common container defects like **holes, dents, rust, and deframing** from images and video feeds.

## 🚀 Key Features

- 🖼️ **Image Scanning:** Upload container photos for instant damage localization and classification.
- 📹 **Video Analytics:** Frame-by-frame analysis with a **Comparison Gallery** (CCTV Raw vs. AI Analysis).
- 📡 **Live Streaming:** Support for WebSocket/RTSP stream integration (Real-time monitoring).
- ⚡ **Modern UI:** Built with React, Tailwind CSS, and Framer Motion for a premium dashboard experience.

---

## 🏗️ Project Structure

```text
DP WORLD HACKATHON/
├── backend/                # Flask API (Python)
│   ├── app.py              # Main Flask server & YOLO inference logic
│   ├── models/             # Contains 'best.onnx' (YOLO model weights)
│   └── requirements.txt    # Python dependencies
├── frontend/               # React Dashboard (Vite + TypeScript)
│   ├── src/                # App logic and entry point
│   ├── components/         # Modular UI (Analyse, Hero, Navbar, etc.)
│   ├── public/             # Static assets
│   └── package.json        # Node.js dependencies
└── README.md               # You are here!
```

---

## 🛠️ Local Setup Instructions

### 1. Prerequisites

- **Python 3.9+**
- **Node.js 18+**
- **Git**

### 2. Backend Setup (Flask)

```powershell
# Navigate to backend
cd backend

# Create a virtual environment
python -m venv .venv
.\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

_The API will start running at `http://localhost:10000`._

### 3. Frontend Setup (React)

Open a **new terminal**:

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

_The dashboard will be available at `http://localhost:5173`._

---

## 🧠 AI Model Details

- **Framework:** Ultralytics YOLOv8
- **Export Format:** ONNX (Optimized for CPU/GPU inference)
- **Classes Detected:**
  - `HOLE`
  - `DENT`
  - `DEFRAME`
  - `MINI-DENT`
  - `RUST`

---

## 🌐 Deployment

- **Frontend:** Can be deployed to **Vercel** or **Netlify**.
- **Backend:** Can be deployed to **Render**, **Railway**, or any Docker-compatible hosting.
- **AI Inference:** For production, use a machine with at least 4GB RAM to handle video frame extraction efficiently.

---

## 🤝 Team

Developed for the **DP World Hackathon**.
