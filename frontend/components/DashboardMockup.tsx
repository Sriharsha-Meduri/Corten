import React from 'react';

interface BBoxProps {
  x: number; y: number; w: number; h: number;
  color: string; label: string; conf: number;
}

const BBox: React.FC<BBoxProps> = ({ x, y, w, h, color, label, conf }) => {
  const bl = 14;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity={0.08} />
      <path d={`M${x},${y+bl} L${x},${y} L${x+bl},${y}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d={`M${x+w-bl},${y} L${x+w},${y} L${x+w},${y+bl}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d={`M${x},${y+h-bl} L${x},${y+h} L${x+bl},${y+h}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d={`M${x+w-bl},${y+h} L${x+w},${y+h} L${x+w},${y+h-bl}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <rect x={x} y={y - 22} width={label.length * 7.5 + 46} height={20} rx={3} fill={color} fillOpacity={0.92} />
      <text x={x + 5} y={y - 8} fill="#fff" fontSize="10" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">{label}</text>
      <text x={x + label.length * 7.5 + 8} y={y - 8} fill="rgba(255,255,255,0.75)" fontSize="10" fontFamily="monospace">{conf}%</text>
    </g>
  );
};

const labelRows = [
  { name: 'HOLE',      count: 0, active: false, color: '#22c55e', severity: 'CLEAR'    },
  { name: 'DENT',      count: 2, active: true,  color: '#ff810a', severity: 'MODERATE' },
  { name: 'DEFRAME',   count: 0, active: false, color: '#22c55e', severity: 'CLEAR'    },
  { name: 'MINI-DENT', count: 1, active: true,  color: '#FFD60A', severity: 'MINOR'    },
  { name: 'RUST',      count: 3, active: true,  color: '#ff810a', severity: 'MODERATE' },
];

const logEntries = [
  { time: '14:02:31', type: 'RUST',      msg: 'Rust patch · East panel',  conf: 94,   color: '#ff810a' },
  { time: '14:02:18', type: 'DENT',      msg: 'Surface dent · Top rail',  conf: 78,   color: '#ff810a' },
  { time: '14:02:05', type: 'MINI-DENT', msg: 'Minor dent · Door corner', conf: 65,   color: '#FFD60A' },
  { time: '14:01:52', type: 'CLEAR',     msg: 'No defects in frame',       conf: null, color: '#22c55e' },
];

const DashboardMockup: React.FC = () => (
  <div className="w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-black/60"
    style={{ background: 'rgba(10,14,22,0.92)', backdropFilter: 'blur(20px)' }}>

    {/* Header */}
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10"
      style={{ background: 'rgba(14,20,32,0.9)' }}>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[10px] font-mono text-[#7eb8da]/60 tracking-widest uppercase">Corten</span>
        <span className="text-white/20">|</span>
        <span className="text-[11px] font-mono text-[#F5F0E8]">ID: <span className="text-[#7eb8da]">CN-7702</span></span>
        <span className="text-white/20">|</span>
        <span className="flex items-center gap-1.5 text-[11px] font-mono text-[#22c55e]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block" style={{ animation: 'cd-pulse 1.8s infinite' }} />
          LIVE
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-4">
        <span className="text-[10px] font-mono text-[#D4CFC8]/50">14:02:34</span>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5,6,7,8,9,10].map(i => (
            <div key={i} className="w-1.5 h-3 rounded-sm" style={{
              background: i <= 3 ? '#22c55e' : i <= 7 ? '#ff810a' : i <= 10 && i > 7 ? 'rgba(255,59,59,0.3)' : 'rgba(255,255,255,0.1)',
              opacity: i <= 7 ? 1 : 0.25
            }} />
          ))}
          <span className="text-[11px] font-mono text-[#ff810a] ml-1">72%</span>
        </div>
      </div>
    </div>

    {/* Body */}
    <div className="flex" style={{ height: '400px' }}>

      {/* Video Feed */}
      <div className="flex-1 relative overflow-hidden" style={{ minWidth: 0 }}>
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 rounded px-2 py-1"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B3B]" style={{ animation: 'cd-pulse 1.2s infinite' }} />
          <span className="text-[9px] font-mono text-white/60 tracking-wider">CAM-01 · GATE-A</span>
        </div>
        <svg viewBox="0 0 560 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="vid-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d1117" />
              <stop offset="100%" stopColor="#111520" />
            </linearGradient>
            <pattern id="rib-h" x="0" y="0" width="560" height="32" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="560" y2="0" stroke="#1a1e28" strokeWidth="1"/>
              <line x1="0" y1="16" x2="560" y2="16" stroke="#161921" strokeWidth="0.5"/>
            </pattern>
            <pattern id="rib-v" x="0" y="0" width="28" height="400" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="400" stroke="#1a1e28" strokeWidth="0.5"/>
            </pattern>
            <radialGradient id="vig" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
            </radialGradient>
          </defs>
          <rect width="560" height="400" fill="url(#vid-bg)" />
          <rect width="560" height="400" fill="url(#rib-h)" />
          <rect width="560" height="400" fill="url(#rib-v)" opacity="0.5" />
          <rect width="560" height="400" fill="url(#vig)" />
          <rect x="8" y="8" width="544" height="384" fill="none" stroke="rgba(126,184,218,0.12)" strokeWidth="1" strokeDasharray="6 4" />
          <BBox x={55}  y={60}  w={165} h={125} color="#ff810a" label="DENT"      conf={78} />
          <BBox x={270} y={42}  w={205} h={150} color="#ff810a" label="RUST"      conf={94} />
          <BBox x={358} y={230} w={120} h={90}  color="#FFD60A" label="MINI-DENT" conf={65} />
          {/* Scan line */}
          <rect x="0" y="0" width="560" height="2" fill="rgba(126,184,218,0.3)"
            style={{ animation: 'scanline 4s linear infinite' }} />
          {/* Bottom meta bar */}
          <rect x="0" y="372" width="560" height="28" fill="rgba(0,0,0,0.6)" />
          <text x="12" y="390" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="monospace">CAM-01 · GATE-A · 14:02:34 UTC+5:30</text>
          <circle cx="528" cy="386" r="4" fill="#FF3B3B">
            <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <text x="518" y="390" textAnchor="end" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="monospace">REC</text>
        </svg>
      </div>

      {/* Label Monitor Sidebar */}
      <div className="w-52 flex-shrink-0 border-l border-white/10 flex flex-col"
        style={{ background: 'rgba(14,20,32,0.85)' }}>
        <div className="px-4 py-2.5 border-b border-white/10">
          <span className="text-[9px] font-mono text-[#7eb8da]/60 tracking-widest uppercase">Damage Monitor</span>
        </div>
        <div className="flex-1 px-3 py-2 flex flex-col gap-1.5">
          {labelRows.map(({ name, count, active, color, severity }) => (
            <div key={name} className="flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors" style={{
              background: active ? `${color}13` : 'rgba(255,255,255,0.02)',
              border: `1px solid ${active ? color + '28' : 'rgba(255,255,255,0.06)'}`,
            }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                background: color,
                boxShadow: active ? `0 0 6px ${color}` : 'none'
              }} />
              <span className="text-[10px] font-mono text-[#D4CFC8] flex-1 tracking-wide">{name}</span>
              <span className="text-[11px] font-mono font-bold" style={{ color }}>{count}</span>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                background: `${color}1a`, color, border: `1px solid ${color}28`
              }}>{severity}</span>
            </div>
          ))}
        </div>
        <div className="px-3 py-3 border-t border-white/10">
          <div className="text-[9px] font-mono text-[#D4CFC8]/45 tracking-widest uppercase mb-2">Overall Health</div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full" style={{
              width: '72%',
              background: 'linear-gradient(to right, #22c55e 0%, #ff810a 60%, #ff3b3b 100%)'
            }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] font-mono text-[#ff810a]">72% · MODERATE</span>
            <span className="text-[9px] font-mono text-[#D4CFC8]/35">CN-7702</span>
          </div>
        </div>
      </div>
    </div>

    {/* Activity Log */}
    <div className="border-t border-white/10" style={{ background: 'rgba(10,14,22,0.95)' }}>
      <div className="px-5 py-2 flex items-center gap-2 border-b border-white/5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#7eb8da]" />
        <span className="text-[9px] font-mono text-[#7eb8da]/55 tracking-widest uppercase">Activity Log</span>
      </div>
      <div className="px-5 py-2 flex flex-col gap-1.5">
        {logEntries.map((entry, i) => (
          <div key={i} className="flex items-baseline gap-3">
            <span className="text-[10px] font-mono text-[#D4CFC8]/35 flex-shrink-0">{entry.time}</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded flex-shrink-0" style={{
              background: `${entry.color}1a`, color: entry.color
            }}>{entry.type}</span>
            <span className="text-[11px] text-[#D4CFC8]/55 truncate">{entry.msg}</span>
            {entry.conf && (
              <span className="text-[10px] font-mono text-[#D4CFC8]/30 ml-auto flex-shrink-0">{entry.conf}%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DashboardMockup;
