import React from 'react';
import { Wifi, Layers, Activity, BarChart2, Clock, MonitorPlay } from 'lucide-react';

const damageLabels = [
  { name: 'Hole',      desc: 'Structural punctures and perforations — highest severity.',               color: '#FF3B3B', severity: 'CRITICAL',  icon: '⬡' },
  { name: 'Dent',      desc: 'Surface depressions from impact. May compromise container integrity.',   color: '#ff810a', severity: 'MODERATE',  icon: '◈' },
  { name: 'Deframe',   desc: 'Frame misalignment or structural warping — structural failure risk.',    color: '#FF3B3B', severity: 'CRITICAL',  icon: '▣' },
  { name: 'Mini-Dent', desc: 'Small, shallow dents with minimal structural impact. Logged for audit.', color: '#FFD60A', severity: 'MINOR',    icon: '◉' },
  { name: 'Rust',      desc: 'Corrosion and oxidation. Indicates long-term exposure or coating failure.', color: '#ff810a', severity: 'MODERATE', icon: '◍' },
];

const systemFeatures = [
  { icon: MonitorPlay, title: 'Live Video Feed',       desc: 'High-frame-rate canvas rendering straight from edge camera with zero-copy pipeline.' },
  { icon: Wifi,        title: 'WebSocket Streaming',   desc: 'Real-time bidirectional data transfer. Detections appear on your screen the instant the model fires.' },
  { icon: Clock,       title: 'Timestamped Activity Log', desc: 'Every detection is logged with timestamp, container ID, label, and confidence score for audits.' },
  { icon: Layers,      title: 'Multi-Camera Support',  desc: 'Switch between multiple camera angles. Monitor front, rear, and side panels simultaneously.' },
  { icon: BarChart2,   title: 'Severity Scoring',      desc: 'Composite health score computed from label types and instance counts. Exportable per inspection.' },
  { icon: Activity,    title: 'Confidence Overlays',   desc: 'Each bounding box shows model confidence %. Filter detections below a configurable threshold.' },
];

const Features: React.FC = () => (
  <section id="features" className="py-24 px-6 md:px-12">
    <div className="max-w-7xl mx-auto">

      {/* Section header */}
      <div className="mb-16">
        <div className="fade-up inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5 border border-white/12 text-[11px] font-mono text-[#7eb8da]/70 tracking-widest uppercase"
          style={{ background: 'rgba(126,184,218,0.06)' }}>
          Detection System
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h2 className="fade-up fade-up-d1 font-display text-4xl md:text-5xl text-[#F5F0E8] tracking-tight leading-tight max-w-sm">
            One System.<br />Five Critical Labels.
          </h2>
          <p className="fade-up fade-up-d2 text-sm text-[#D4CFC8]/60 leading-relaxed max-w-sm">
            Every detectable damage type carries a severity tier. Traffic-light logic drives instant visual alerts for operators.
          </p>
        </div>
      </div>

      {/* Damage label cards */}
      <div className="grid md:grid-cols-5 gap-4 mb-14">
        {damageLabels.map(({ name, desc, color, severity, icon }, i) => (
          <div key={name} className={`fade-up fade-up-d${i + 1} rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group`}
            style={{
              background: `${color}0d`,
              borderColor: `${color}28`,
              boxShadow: `0 0 0 0 ${color}00`,
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 8px 32px ${color}22`)}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}>
            <div className="text-2xl mb-4" style={{ color }}>{icon}</div>
            <div className="mb-1">
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded tracking-wider"
                style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>
                {severity}
              </span>
            </div>
            <h3 className="font-display text-lg text-[#F5F0E8] tracking-tight mt-2 mb-2">{name}</h3>
            <p className="text-[12px] text-[#D4CFC8]/55 leading-relaxed">{desc}</p>
            <div className="mt-4 h-0.5 rounded-full w-8 transition-all duration-300 group-hover:w-full" style={{ background: color }} />
          </div>
        ))}
      </div>

      {/* System features grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {systemFeatures.map(({ icon: Icon, title, desc }, i) => (
          <div key={title} className={`fade-up fade-up-d${(i % 3) + 1} rounded-xl p-5 border border-white/8 flex gap-4 group hover:border-white/15 transition-all duration-300`}
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center border border-[#73bfc4]/20 mt-0.5"
              style={{ background: 'rgba(115,191,196,0.08)' }}>
              <Icon size={16} className="text-[#73bfc4]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#F5F0E8] mb-1 tracking-tight">{title}</h4>
              <p className="text-[12px] text-[#D4CFC8]/55 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
