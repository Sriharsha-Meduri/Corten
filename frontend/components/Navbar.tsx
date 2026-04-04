import React, { useState, useEffect } from 'react';
import { Menu, X, ScanLine } from 'lucide-react';

interface NavbarProps { currentPage: 'home' | 'analyse'; }

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const homeLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features',     href: '#features'     },
    { label: 'Technology',   href: '#technology'   },
  ];

  const goHome    = () => { window.location.hash = ''; window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); };
  const goAnalyse = () => { window.location.hash = 'analyse'; window.scrollTo({ top: 0 }); setMobileMenuOpen(false); };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/40 backdrop-blur-xl py-3 border-b border-white/10' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">

        {/* Logo */}
        <button onClick={goHome} className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-7 h-7 bg-[#7eb8da] rounded-lg flex items-center justify-center shadow-md shadow-[#7eb8da]/25">
            <ScanLine size={14} className="text-[#0d1117]" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-[#F5F0E8] font-display">
            Container<span className="text-[#7eb8da]">AI</span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {currentPage === 'home' && homeLinks.map(({ label, href }) => (
            <a key={label} href={href}
              className="text-sm text-[#D4CFC8] hover:text-white transition-colors duration-200">
              {label}
            </a>
          ))}
          {currentPage === 'home' && <div className="w-px h-4 bg-white/15" />}
          <button
            onClick={currentPage === 'home' ? goAnalyse : goHome}
            className="text-sm font-medium transition-colors duration-200"
            style={{ color: currentPage === 'analyse' ? '#7eb8da' : 'rgba(212,207,200,0.75)' }}>
            {currentPage === 'home' ? 'Analyse →' : '← Home'}
          </button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {currentPage === 'home' && (
            <button
              onClick={goAnalyse}
              className="bg-white hover:bg-white/90 text-[#1a1a1a] px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-px shadow-md shadow-white/20">
              Try Analyse
            </button>
          )}
          {currentPage === 'analyse' && (
            <button
              onClick={goHome}
              className="bg-white/10 hover:bg-white/15 text-[#F5F0E8] px-5 py-2.5 rounded-full text-sm font-medium border border-white/12 transition-all duration-200">
              ← Back to Home
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg">
            {mobileMenuOpen
              ? <X size={20} className="text-[#F5F0E8]" />
              : <Menu size={20} className="text-[#F5F0E8]" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/85 backdrop-blur-xl border-b border-white/10 px-6 py-5 flex flex-col gap-1">
          {currentPage === 'home' && homeLinks.map(({ label, href }) => (
            <a key={label} href={href} onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-sm text-[#D4CFC8] hover:text-white transition-colors">
              {label}
            </a>
          ))}
          <button onClick={currentPage === 'home' ? goAnalyse : goHome}
            className="mt-3 w-full bg-white text-[#1a1a1a] py-3 rounded-full text-sm font-semibold">
            {currentPage === 'home' ? 'Try Analyse' : '← Back to Home'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;