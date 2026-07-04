import React from 'react';
import { ScanLine, Mail, Github, Linkedin } from 'lucide-react';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Features',     href: '#features'     },
      { label: 'Technology',   href: '#technology'   },
    ],
  },
  {
    title: 'Detection Labels',
    links: [
      { label: 'Hole',      href: '#features' },
      { label: 'Dent',      href: '#features' },
      { label: 'Deframe',   href: '#features' },
      { label: 'Mini-Dent', href: '#features' },
      { label: 'Rust',      href: '#features' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About',         href: '#technology' },
      { label: 'Contact',       href: '#contact'    },
      { label: 'Try Now',  href: '#contact'    },
    ],
  },
];

const Footer: React.FC = () => (
  <footer id="contact" className="border-t border-white/8 pt-16 pb-10 px-6 md:px-12"
    style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}>
    <div className="max-w-7xl mx-auto">

      {/* Top row */}
      <div className="grid md:grid-cols-4 gap-10 mb-14">

        {/* Brand column */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 bg-[#7eb8da] rounded-lg flex items-center justify-center">
              <ScanLine size={14} className="text-[#0d1117]" />
            </div>
            <span className="text-lg font-semibold text-[#F5F0E8] font-display">
              Cor<span className="text-[#7eb8da]">ten</span>
            </span>
          </div>
          <p className="text-sm text-[#D4CFC8]/50 leading-relaxed mb-6">
            Real-time container damage detection using edge AI. Built for ports, logistics, and shipping yards.
          </p>
          <div className="flex gap-3">
            {[Mail, Github, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-[#D4CFC8]/40 hover:text-[#7eb8da] hover:border-[#7eb8da]/30 transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {footerLinks.map(({ title, links }) => (
          <div key={title}>
            <div className="text-[10px] font-mono text-[#D4CFC8]/35 tracking-widest uppercase mb-4">{title}</div>
            <ul className="flex flex-col gap-2.5">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-sm text-[#D4CFC8]/55 hover:text-white transition-colors duration-200">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact CTA strip */}
      <div className="rounded-2xl p-8 mb-10 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ background: 'rgba(126,184,218,0.06)', backdropFilter: 'blur(12px)' }}>
        <div>
          <h3 className="font-display text-2xl text-[#F5F0E8] tracking-tight mb-1">Ready to automate your inspection?</h3>
          <p className="text-sm text-[#D4CFC8]/55">Get a live demo configured for your port or facility.</p>
        </div>
        <button onClick={() => { window.location.hash = 'analyse'; window.scrollTo({ top: 0 }); }}
          className="flex-shrink-0 bg-white hover:bg-white/90 text-[#1a1a1a] px-7 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-px shadow-md shadow-white/15">
          Try Now →
        </button>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-t border-white/8 pt-6">
        <p className="text-xs text-[#D4CFC8]/30 font-mono">© 2026 Corten. All rights reserved.</p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" style={{ animation: 'cd-pulse 1.8s infinite' }} />
          <span className="text-xs font-mono text-[#D4CFC8]/30">System Active · All cameras operational</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
