import React from 'react';
import { Camera, Cpu, FileText } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: Camera,
    title: 'Mount Edge Camera',
    desc: 'Install high-resolution cameras at inspection gates. Our system supports multi-angle setups and connects to Jetson Nano or similar edge hardware for on-device inference.',
    chip: 'Hardware Setup',
  },
  {
    num: '02',
    icon: Cpu,
    title: 'AI Detects in Real Time',
    desc: 'A fine-tuned YOLO model runs directly on the edge device, classifying five damage types — Hole, Dent, Deframe, Mini-dent, and Rust — with confidence scores in under 50ms.',
    chip: 'YOLO · Edge AI',
  },
  {
    num: '03',
    icon: FileText,
    title: 'Instant Alerts & Reports',
    desc: 'Detection results stream over WebSocket to your dashboard in real time. Operators receive severity scores, timestamped logs, and exportable inspection reports automatically.',
    chip: 'WebSocket · Reports',
  },
];

const HowItWorks: React.FC = () => (
  <section id="how-it-works" className="py-24 px-6 md:px-12">
    <div className="max-w-7xl mx-auto">

      {/* Section header */}
      <div className="mb-16">
        <div className="fade-up inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5 border border-white/12 text-[11px] font-mono text-[#7eb8da]/70 tracking-widest uppercase"
          style={{ background: 'rgba(126,184,218,0.06)' }}>
          How It Works
        </div>
        <h2 className="fade-up fade-up-d1 font-display text-4xl md:text-5xl text-[#F5F0E8] tracking-tight leading-tight max-w-lg">
          From Camera<br />to Alert in Seconds.
        </h2>
      </div>

      {/* Steps */}
      <div className="grid md:grid-cols-3 gap-6 relative">
        {/* Connector line (desktop) */}
        <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px"
          style={{ background: 'linear-gradient(to right, rgba(126,184,218,0.0), rgba(126,184,218,0.25), rgba(126,184,218,0.0))' }} />

        {steps.map(({ num, icon: Icon, title, desc, chip }, i) => (
          <div key={num} className={`fade-up fade-up-d${i + 1} relative rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:border-white/20 group`}
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}>
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-[#7eb8da]/25"
                style={{ background: 'rgba(126,184,218,0.1)' }}>
                <Icon size={18} className="text-[#7eb8da]" />
              </div>
              <span className="font-display text-5xl text-[#F5F0E8]/8 leading-none select-none group-hover:text-[#F5F0E8]/12 transition-colors">
                {num}
              </span>
            </div>
            <div className="mb-2">
              <span className="text-[10px] font-mono text-[#73bfc4]/70 tracking-widest uppercase">{chip}</span>
            </div>
            <h3 className="font-display text-xl text-[#F5F0E8] mb-3 tracking-tight">{title}</h3>
            <p className="text-sm text-[#D4CFC8]/65 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
