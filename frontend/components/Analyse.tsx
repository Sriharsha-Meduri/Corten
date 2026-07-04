import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Image, Film, Radio, Upload, Play, RefreshCw, Wifi, WifiOff, Camera } from 'lucide-react';

// ─── API base ────────────────────────────────────────────────────────────────
// Configurable via VITE_API_URL; falls back to the local backend.
const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000';

// ─── Types & helpers ─────────────────────────────────────────────────────────
interface Detection { label: string; confidence: number; color: string; count: number; }
interface RawDet { class: string; conf: number; }

// Consistent colour per damage class, reused across every tab.
const LABEL_COLORS: Record<string, string> = {
  HOLE: '#FF3B3B', DENT: '#ff810a', DEFRAME: '#FF3B3B',
  'MINOR-DENT': '#FFD60A', 'MINI-DENT': '#FFD60A', RUST: '#ff810a',
};
const colorFor = (label: string) => LABEL_COLORS[label.toUpperCase()] || '#7eb8da';

// Collapse raw {class, conf} detections into per-label aggregates (avg conf + count).
const aggregate = (dets: RawDet[]): Detection[] => {
  const map = new Map<string, { sum: number; count: number }>();
  for (const d of dets) {
    const key = (d.class || '').toUpperCase();
    const cur = map.get(key) || { sum: 0, count: 0 };
    cur.sum += d.conf; cur.count += 1;
    map.set(key, cur);
  }
  return Array.from(map.entries())
    .map(([label, { sum, count }]) => ({ label, confidence: Math.round((sum / count) * 100), color: colorFor(label), count }))
    .sort((a, b) => b.confidence - a.confidence);
};

// ─── Shared: Dropzone ────────────────────────────────────────────────────────
const Dropzone: React.FC<{ accept: string; onFile: (f: File) => void; icon: React.ReactNode; label: string; sub: string; }> =
  ({ accept, onFile, icon, label, sub }) => {
    const [drag, setDrag] = useState(false);
    const ref = useRef<HTMLInputElement>(null);
    const handle = (f?: File) => { if (f) onFile(f); };
    return (
      <div
        onClick={() => ref.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
        className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-12 cursor-pointer transition-all duration-300"
        style={{
          minHeight: 320,
          borderColor: drag ? 'rgba(126,184,218,0.5)' : 'rgba(255,255,255,0.12)',
          background: drag ? 'rgba(126,184,218,0.06)' : 'rgba(255,255,255,0.02)',
        }}
      >
        <input ref={ref} type="file" accept={accept} className="hidden" onChange={e => handle(e.target.files?.[0])} />
        <div className="w-14 h-14 rounded-2xl border border-[#7eb8da]/20 flex items-center justify-center mb-5"
          style={{ background: 'rgba(126,184,218,0.07)' }}>
          {icon}
        </div>
        <p className="text-[#F5F0E8]/65 font-medium mb-1 text-center">{label}</p>
        <p className="text-[11px] font-mono text-[#D4CFC8]/35 text-center">{sub}</p>
        <div className="mt-5 flex items-center gap-2 rounded-full px-4 py-1.5 border border-white/10"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <Upload size={12} className="text-[#7eb8da]/60" />
          <span className="text-[11px] text-[#D4CFC8]/50">Browse files</span>
        </div>
      </div>
    );
  };

// ─── Shared: Results Panel ───────────────────────────────────────────────────
const ResultsPanel: React.FC<{ results: Detection[] | null; scanning: boolean; progress: number; emptyMsg: string }> =
  ({ results, scanning, progress, emptyMsg }) => (
    <div className="rounded-2xl border border-white/10 overflow-hidden h-full"
      style={{ background: 'rgba(14,20,32,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="px-4 py-3 border-b border-white/8 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: results ? '#22c55e' : 'rgba(212,207,200,0.25)' }} />
        <span className="text-[10px] font-mono text-[#D4CFC8]/45 tracking-widest uppercase">Detection Results</span>
      </div>
      <div className="p-4">
        {scanning && (
          <div className="py-4">
            <p className="text-[11px] font-mono text-[#7eb8da]/55 tracking-wider text-center mb-3">Running YOLO inference…</p>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full bg-[#7eb8da] transition-all duration-75" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-center mt-2 text-[11px] font-mono text-[#7eb8da]/45">{progress}%</p>
          </div>
        )}
        {!scanning && !results && (
          <p className="text-[12px] text-[#D4CFC8]/30 text-center py-10">{emptyMsg}</p>
        )}
        {results && !scanning && results.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            <p className="text-[12px] text-[#22c55e]/80 text-center">No damage detected. Container looks clean.</p>
          </div>
        )}
        {results && !scanning && results.length > 0 && (
          <div className="flex flex-col gap-3">
            {results.map(({ label, confidence, color, count }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                    <span className="text-[11px] font-mono text-[#D4CFC8]">{label}</span>
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded" style={{ background: `${color}1a`, color }}>×{count}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold" style={{ color }}>{confidence}%</span>
                </div>
                <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${confidence}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

// ─── Tab 1: Image Scanning ───────────────────────────────────────────────────
const ImageScanning: React.FC = () => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Detection[] | null>(null);

  const handleFile = (f: File) => {
    setImgUrl(URL.createObjectURL(f));
    setFile(f);
    setResults(null);
    setProgress(0);
  };

  const runScan = async () => {
    if (!file) return;
    setScanning(true);
    setResults(null);
    setProgress(0);
    let iv: ReturnType<typeof setInterval> | null = null;
    try {
      let p = 0;
      iv = setInterval(() => { p += 7 + Math.floor(Math.random() * 8); setProgress(Math.min(p, 95)); }, 40);

      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_URL}/predict`, { method: 'POST', body: form });
      if (iv) clearInterval(iv);
      setProgress(100);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data.image_data) setImgUrl(`data:image/jpeg;base64,${data.image_data}`);
      setResults(Array.isArray(data.detections) ? aggregate(data.detections) : []);
    } catch (e) {
      if (iv) clearInterval(iv);
      setResults(null);
      alert('Detection failed: ' + (e instanceof Error ? e.message : e) + `\n\nIs the backend running at ${API_URL}?`);
    } finally {
      setScanning(false);
      setProgress(100);
    }
  };

  const reset = () => { setImgUrl(null); setFile(null); setResults(null); setProgress(0); };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        {!imgUrl ? (
          <Dropzone accept="image/*" onFile={handleFile} icon={<Image size={22} className="text-[#7eb8da]/55" />}
            label="Drop an image or click to upload" sub="PNG · JPG · WEBP · up to 20 MB" />
        ) : (
          <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: 'rgba(10,14,22,0.85)' }}>
            <div className="relative">
              <img src={imgUrl} alt="preview" className="w-full object-contain max-h-[460px]" />
              {scanning && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute left-0 right-0 h-0.5"
                    style={{ top: `${progress}%`, background: 'rgba(126,184,218,0.7)', boxShadow: '0 0 14px 3px rgba(126,184,218,0.35)', transition: 'top 0.04s linear' }} />
                  <div className="absolute inset-0"
                    style={{ background: `linear-gradient(to bottom, rgba(126,184,218,0.04) ${progress}%, transparent ${progress}%)` }} />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/8" style={{ background: 'rgba(14,20,32,0.9)' }}>
              <button onClick={reset} className="text-[11px] font-mono text-[#D4CFC8]/40 hover:text-[#D4CFC8] transition-colors flex items-center gap-1.5">
                <RefreshCw size={11} /> Change image
              </button>
              <button onClick={runScan} disabled={scanning}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-50"
                style={{ background: scanning ? 'rgba(126,184,218,0.12)' : 'white', color: scanning ? '#7eb8da' : '#1a1a1a' }}>
                {scanning
                  ? <><RefreshCw size={13} className="animate-spin" /> Scanning…</>
                  : <><Play size={13} /> {results ? 'Re-scan' : 'Scan Image'}</>}
              </button>
            </div>
          </div>
        )}
      </div>
      <ResultsPanel results={results} scanning={scanning} progress={progress}
        emptyMsg={imgUrl ? 'Press "Scan Image" to run detection' : 'Upload an image to begin'} />
    </div>
  );
};

// ─── Tab 2: Video Processing ─────────────────────────────────────────────────
const VideoProcessing: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFile = (f: File) => {
    setVideoUrl(URL.createObjectURL(f));
    setFile(f); setDone(false); setProgress(0); setResult(null); setError(null);
  };

  const runProcess = async () => {
    if (!file) return;
    setProcessing(true); setDone(false); setProgress(0); setResult(null); setError(null);
    let iv: ReturnType<typeof setInterval> | null = null;
    try {
      let p = 0;
      iv = setInterval(() => { p += 2 + Math.floor(Math.random() * 4); setProgress(Math.min(p, 95)); }, 60);

      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_URL}/predict-video-frames`, { method: 'POST', body: form });
      if (iv) clearInterval(iv);
      setProgress(100);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data);
      setDone(true);
    } catch (e) {
      if (iv) clearInterval(iv);
      setError('Video detection failed: ' + (e instanceof Error ? e.message : e) + `. Is the backend running at ${API_URL}?`);
    } finally {
      setProcessing(false);
      setProgress(100);
    }
  };

  const reset = () => { setVideoUrl(null); setFile(null); setDone(false); setProgress(0); setResult(null); setError(null); };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        {!videoUrl
          ? <Dropzone accept="video/*" onFile={handleFile} icon={<Film size={22} className="text-[#7eb8da]/55" />} label="Drop a video or click to upload" sub="MP4 · MOV · AVI · up to 500 MB" />
          : (
            <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: 'rgba(10,14,22,0.85)' }}>
              <div className="relative">
                <video src={videoUrl} className="w-full max-h-[400px] object-contain" controls />
                {processing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                    style={{ background: 'rgba(10,14,22,0.7)', backdropFilter: 'blur(3px)' }}>
                    <div className="font-display text-5xl text-[#7eb8da] mb-2">{progress}<span className="text-2xl text-[#7eb8da]/50">%</span></div>
                    <p className="text-[11px] font-mono text-[#7eb8da]/50 tracking-wider">Processing frames…</p>
                  </div>
                )}
                {done && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1"
                    style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.28)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                    <span className="text-[10px] font-mono text-[#22c55e] tracking-wider">Analysis Complete</span>
                  </div>
                )}
              </div>

              {(processing || done) && (
                <div className="px-4 py-2 border-t border-white/8" style={{ background: 'rgba(14,20,32,0.9)' }}>
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full transition-all duration-100" style={{ width: `${progress}%`, background: done ? '#22c55e' : '#7eb8da' }} />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between px-4 py-3 border-t border-white/8" style={{ background: 'rgba(14,20,32,0.9)' }}>
                <button onClick={reset} className="text-[11px] font-mono text-[#D4CFC8]/40 hover:text-[#D4CFC8] transition-colors flex items-center gap-1.5">
                  <RefreshCw size={11} /> Change video
                </button>
                <button onClick={runProcess} disabled={processing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-50"
                  style={{ background: processing ? 'rgba(126,184,218,0.12)' : 'white', color: processing ? '#7eb8da' : '#1a1a1a' }}>
                  {processing
                    ? <><RefreshCw size={13} className="animate-spin" /> Processing…</>
                    : <><Play size={13} /> {done ? 'Re-process' : 'Process Video'}</>}
                </button>
              </div>

              {/* Annotated frame gallery */}
              {done && result?.gallery?.length > 0 && (
                <div className="p-4 border-t border-white/8">
                  <span className="text-[10px] font-mono text-[#D4CFC8]/45 tracking-widest uppercase">Annotated Frames</span>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {result.gallery.map((g: any, i: number) => (
                      <div key={i} className="relative rounded-lg overflow-hidden border border-white/8">
                        <img src={`data:image/jpeg;base64,${g.detected}`} alt={`frame ${i}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 text-[9px] font-mono px-1 py-0.5 rounded bg-black/60 text-[#7eb8da]">{g.second}s · {g.detections_count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
      </div>

      {/* Right panel */}
      <div className="flex flex-col gap-4">
        {error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm p-4 text-center">{error}</div>
        )}
        {done && result ? (
          <>
            <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(14,20,32,0.85)' }}>
              <div className="px-4 py-3 border-b border-white/8">
                <span className="text-[10px] font-mono text-[#D4CFC8]/45 tracking-widest uppercase">Summary</span>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#D4CFC8]/50">Frames Processed</span>
                  <span className="text-[12px] font-mono text-[#F5F0E8]">{result.frames_processed}</span>
                </div>
                {result.summary && Object.entries(result.summary).map(([label, count]: any) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-[11px] text-[#D4CFC8]/50 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: colorFor(label) }} />{label}
                    </span>
                    <span className="text-[12px] font-mono text-[#F5F0E8]">{count}</span>
                  </div>
                ))}
                {result.summary && Object.keys(result.summary).length === 0 && (
                  <span className="text-[11px] text-[#22c55e]/80">No damage detected across sampled frames.</span>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(14,20,32,0.85)' }}>
              <div className="px-4 py-3 border-b border-white/8">
                <span className="text-[10px] font-mono text-[#D4CFC8]/45 tracking-widest uppercase">Detections by Frame</span>
              </div>
              <div className="p-4 flex flex-col gap-2.5 max-h-64 overflow-y-auto">
                {result.detections_by_frame && result.detections_by_frame.map((frame: any, idx: number) => (
                  <div key={idx} className="text-[11px] text-[#D4CFC8]/70">
                    <span className="font-mono text-[#7eb8da]">Frame {idx + 1}:</span> {frame.length ? frame.map((d: any) => `${d.class} (${(d.conf * 100).toFixed(0)}%)`).join(', ') : 'No detections'}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-white/8 flex flex-col items-center justify-center text-center p-8"
            style={{ minHeight: 280, background: 'rgba(255,255,255,0.02)' }}>
            <Film size={28} className="text-[#D4CFC8]/18 mb-3" />
            <p className="text-[12px] text-[#D4CFC8]/30 leading-relaxed">Upload a video and press "Process Video" to run frame-by-frame damage detection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Tab 3: Live Camera Detection ────────────────────────────────────────────
const LiveStreaming: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [annotated, setAnnotated] = useState<string | null>(null);
  const [results, setResults] = useState<Detection[]>([]);
  const [fps, setFps] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const loopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busyRef = useRef(false);
  const runningRef = useRef(false);

  const stop = useCallback(() => {
    runningRef.current = false;
    if (loopRef.current) clearTimeout(loopRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setConnected(false);
    setConnecting(false);
    setFps(0);
    setAnnotated(null);
    setResults([]);
  }, []);

  // Capture one frame, send to /predict, update overlay. Then schedule the next.
  const tick = useCallback(async () => {
    if (!runningRef.current) return;
    const video = videoRef.current, canvas = canvasRef.current;
    if (video && canvas && video.videoWidth && !busyRef.current) {
      busyRef.current = true;
      const t0 = performance.now();
      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')!.drawImage(video, 0, 0);
        const blob: Blob | null = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.8));
        if (blob) {
          const form = new FormData();
          form.append('file', blob, 'frame.jpg');
          const res = await fetch(`${API_URL}/predict`, { method: 'POST', body: form });
          if (res.ok) {
            const data = await res.json();
            if (data.image_data) setAnnotated(`data:image/jpeg;base64,${data.image_data}`);
            setResults(Array.isArray(data.detections) ? aggregate(data.detections) : []);
            setFps(Math.max(1, Math.round(1000 / (performance.now() - t0))));
          }
        }
      } catch {
        // Transient frame error; keep the loop alive.
      } finally {
        busyRef.current = false;
      }
    }
    if (runningRef.current) loopRef.current = setTimeout(tick, 500);
  }, []);

  const start = async () => {
    setError(null);
    setConnecting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      runningRef.current = true;
      setConnected(true);
      setConnecting(false);
      loopRef.current = setTimeout(tick, 300);
    } catch (e) {
      setConnecting(false);
      setError('Could not access camera. Grant permission and use https or localhost.');
    }
  };

  // Clean up the camera on unmount.
  useEffect(() => () => stop(), [stop]);

  return (
    <div className="flex flex-col gap-6">
      {/* Control bar */}
      <div className="rounded-2xl border border-white/10 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ background: 'rgba(14,20,32,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="w-8 h-8 rounded-lg border border-[#7eb8da]/20 flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(126,184,218,0.06)' }}>
            {connected ? <Wifi size={14} className="text-[#22c55e]" /> : <WifiOff size={14} className="text-[#D4CFC8]/30" />}
          </div>
          <span className="text-sm font-mono text-[#D4CFC8]/70">
            {connected ? 'Live camera feed, detecting in real time' : 'Use your device camera for live container inspection'}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {connected && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#22c55e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" style={{ animation: 'cd-pulse 1.2s infinite' }} />
              {fps} FPS
            </div>
          )}
          <button onClick={connected ? stop : start} disabled={connecting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-50"
            style={{ background: connected ? 'rgba(255,59,59,0.1)' : 'white', color: connected ? '#FF3B3B' : '#1a1a1a', border: connected ? '1px solid rgba(255,59,59,0.22)' : 'none' }}>
            {connecting
              ? <><RefreshCw size={13} className="animate-spin" /> Starting…</>
              : connected
              ? <><WifiOff size={13} /> Stop</>
              : <><Camera size={13} /> Start Camera</>}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm p-4 text-center">{error}</div>
      )}

      {/* Hidden raw video + capture canvas */}
      <video ref={videoRef} playsInline muted className="hidden" />
      <canvas ref={canvasRef} className="hidden" />

      {!connected && !connecting && !error && (
        <div className="rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center py-24 gap-4" style={{ background: 'rgba(255,255,255,0.01)' }}>
          <div className="w-14 h-14 rounded-2xl border border-[#7eb8da]/12 flex items-center justify-center" style={{ background: 'rgba(126,184,218,0.04)' }}>
            <Radio size={22} className="text-[#7eb8da]/25" />
          </div>
          <p className="text-[#D4CFC8]/30 text-sm text-center max-w-xs">Press Start Camera to run live detection on your webcam feed.</p>
        </div>
      )}

      {connected && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-2xl overflow-hidden border border-white/10" style={{ background: 'rgba(10,14,22,0.85)' }}>
            {annotated
              ? <img src={annotated} alt="live detection" className="w-full object-contain max-h-[460px]" />
              : <div className="flex items-center justify-center py-32 text-[#7eb8da]/50 text-sm font-mono">Warming up…</div>}
          </div>
          <ResultsPanel results={results} scanning={false} progress={100} emptyMsg="Scanning live feed…" />
        </div>
      )}
    </div>
  );
};

// ─── Main Analyse Page ────────────────────────────────────────────────────────
type TabId = 'image' | 'video' | 'live';
const TABS: { id: TabId; label: string; Icon: React.FC<{ size?: number; className?: string }> }[] = [
  { id: 'image', label: 'Image Scanning',   Icon: Image },
  { id: 'video', label: 'Video Processing', Icon: Film  },
  { id: 'live',  label: 'Live Camera',       Icon: Radio },
];

const Analyse: React.FC = () => {
  const [tab, setTab] = useState<TabId>('image');

  return (
    <section className="pt-28 pb-16 px-6 md:px-12 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5 border border-white/12 text-[11px] font-mono text-[#7eb8da]/70 tracking-widest uppercase"
            style={{ background: 'rgba(126,184,218,0.06)' }}>
            Analysis Tools
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-[#F5F0E8] tracking-tight leading-tight mb-3">Analyse</h1>
          <p className="text-[#D4CFC8]/55 leading-relaxed max-w-xl text-base">
            Upload images or videos, or run your live camera feed. The YOLO model detects and classifies container damage in real time.
          </p>
        </div>

        <div className="flex gap-1.5 mb-8 p-1 rounded-xl border border-white/8 w-fit" style={{ background: 'rgba(14,20,32,0.6)', backdropFilter: 'blur(12px)' }}>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: tab === id ? 'rgba(126,184,218,0.14)' : 'transparent',
                color: tab === id ? '#7eb8da' : 'rgba(212,207,200,0.45)',
                border: tab === id ? '1px solid rgba(126,184,218,0.22)' : '1px solid transparent',
              }}>
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {tab === 'image' && <ImageScanning />}
        {tab === 'video' && <VideoProcessing />}
        {tab === 'live' && <LiveStreaming />}
      </div>
    </section>
  );
};

export default Analyse;
