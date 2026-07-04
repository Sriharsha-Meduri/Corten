import React from 'react';
import { Cpu, Zap, ShieldCheck, Globe } from 'lucide-react';

const techStack = [
  { label: 'Model',      value: 'YOLOv5',   icon: Cpu        },
  { label: 'Latency',    value: '< 50ms inference',    icon: Zap        },
  { label: 'Edge HW',    value: 'Jetson Nano / Orin',  icon: ShieldCheck },
  { label: 'Protocol',   value: 'WebSocket / gRPC',    icon: Globe      },
];

const metrics = [
  { val: '98.7%', label: 'mAP Detection Accuracy' },
  { val: '5',     label: 'Damage Classes'          },
  { val: '<50ms', label: 'End-to-End Latency'      },
  { val: '30+',   label: 'Frames Per Second'       },
];

const About: React.FC = () => (
  <section id="technology" className="py-24 px-6 md:px-12">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">

        {/* Left: Text */}
        <div>
          <div className="fade-left inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5 border border-white/12 text-[11px] font-mono text-[#7eb8da]/70 tracking-widest uppercase"
            style={{ background: 'rgba(126,184,218,0.06)' }}>
            Technology
          </div>
          <h2 className="fade-left fade-up-d1 font-display text-4xl md:text-5xl text-[#F5F0E8] tracking-tight leading-tight mb-6">
            Built for the<br />Edge. Built for Speed.
          </h2>
          <p className="fade-left fade-up-d2 text-[#D4CFC8]/65 leading-relaxed mb-6">
            Corten runs entirely on edge hardware, with no round-trip to the cloud. A custom-trained YOLO model loaded directly on a Jetson device processes live camera frames in real time, streaming structured detection events to your operator dashboard over WebSocket.
          </p>
          <p className="fade-left fade-up-d3 text-[#D4CFC8]/65 leading-relaxed mb-10">
            Designed for port operators, logistics hubs, and shipping yards, any environment where you need to inspect containers at scale without slow manual processes.
          </p>

          {/* Tech stack chips */}
          <div className="fade-left fade-up-d4 grid grid-cols-2 gap-3">
            {techStack.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl p-3.5 border border-white/8 group hover:border-white/15 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border border-[#73bfc4]/20"
                  style={{ background: 'rgba(115,191,196,0.08)' }}>
                  <Icon size={14} className="text-[#73bfc4]" />
                </div>
                <div>
                  <div className="text-[9px] font-mono text-[#D4CFC8]/40 tracking-widest uppercase">{label}</div>
                  <div className="text-[12px] font-semibold text-[#F5F0E8] mt-0.5">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Metrics card */}
        <div className="fade-right">
          <div className="rounded-2xl p-8 border border-white/10"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {metrics.map(({ val, label }) => (
                <div key={label} className="text-center">
                  <div className="font-display text-4xl text-[#F5F0E8] tracking-tight mb-1">{val}</div>
                  <div className="text-[11px] font-mono text-[#D4CFC8]/45 tracking-wider uppercase">{label}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="text-[10px] font-mono text-[#D4CFC8]/40 tracking-widest uppercase mb-4">Detection Pipeline</div>
              <div className="flex flex-col gap-2">
                {[
                  { step: 'Camera Frame Capture',     ms: '0ms',   color: '#73bfc4' },
                  { step: 'Edge Preprocessing',        ms: '+8ms',  color: '#7eb8da' },
                  { step: 'YOLO Inference',            ms: '+32ms', color: '#7eb8da' },
                  { step: 'WebSocket Broadcast',       ms: '+5ms',  color: '#73bfc4' },
                  { step: 'Dashboard Render',          ms: '+4ms',  color: '#73bfc4' },
                ].map(({ step, ms, color }) => (
                  <div key={step} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                      <span className="text-[12px] text-[#D4CFC8]/65">{step}</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#D4CFC8]/40">{ms}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-1">
                  <span className="text-[12px] font-semibold text-[#F5F0E8]">Total End-to-End</span>
                  <span className="text-[12px] font-mono text-[#7eb8da] font-bold">&lt; 50ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
);

export default About;
