import React from 'react';
import DashboardMockup from './DashboardMockup';
import { Camera } from 'lucide-react';

const stats = [
  { val: '98.7%', label: 'Detection Accuracy' },
  { val: '<50ms', label: 'Inference Latency'  },
  { val: '5',     label: 'Damage Labels'      },
  { val: '24/7',  label: 'Live Monitoring'    },
];

const Hero: React.FC = () => (
  <section id="hero" className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 px-6 md:px-12">
    <div className="max-w-7xl mx-auto w-full">

      {/* Eyebrow */}
      <div className="fade-up mb-7">
        <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 border border-white/15"
          style={{ background: 'rgba(126,184,218,0.08)', backdropFilter: 'blur(8px)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#73bfc4]" style={{ animation: 'cd-pulse 1.8s infinite' }} />
          <span className="text-xs font-mono text-[#73bfc4] tracking-widest uppercase">Industrial AI · Real-Time Vision</span>
        </div>
      </div>

      {/* Headline */}
      <h1 className="fade-up fade-up-d1 font-display text-5xl md:text-7xl lg:text-[82px] leading-[0.94] tracking-tight text-[#F5F0E8] mb-6 max-w-4xl">
        See Every Defect.<br />
        <span className="text-[#7eb8da]">The Moment</span> It Appears.
      </h1>

      {/* Sub */}
      <p className="fade-up fade-up-d2 text-lg md:text-xl text-[#D4CFC8]/80 leading-relaxed max-w-2xl mb-10">
        AI-powered container damage detection. Multi-label YOLO vision identifies Holes, Dents, Rust, and Deformations — live, with confidence scores, from edge hardware.
      </p>

      {/* CTAs */}
      <div className="fade-up fade-up-d3 flex flex-wrap gap-4 mb-14">
        <button className="bg-white hover:bg-white/90 text-[#1a1a1a] px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-px shadow-lg shadow-white/20">
          Try Now →
        </button>
        <button className="flex items-center gap-2 text-[#F5F0E8] px-6 py-3 rounded-full text-sm font-medium border border-white/15 transition-all duration-200 hover:bg-white/8"
          style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.06)' }}>
          <Camera size={14} />
          Watch Live Feed
        </button>
      </div>

      {/* Stats */}
      <div className="fade-up fade-up-d4 flex flex-wrap gap-8 mb-16 border-t border-white/10 pt-8">
        {stats.map(({ val, label }) => (
          <div key={label}>
            <div className="font-display text-3xl text-[#F5F0E8] tracking-tight">{val}</div>
            <div className="text-[11px] text-[#D4CFC8]/50 font-mono tracking-widest uppercase mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Dashboard Mockup */}
      <div className="fade-scale">
        <DashboardMockup />
      </div>
    </div>
  </section>
);

export default Hero;
