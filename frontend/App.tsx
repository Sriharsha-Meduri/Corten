import React, { useState, useEffect } from 'react';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import { useScrollReveal } from './hooks/useScrollReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import About from './components/About';
import Footer from './components/Footer';
import Analyse from './components/Analyse';

class ShaderErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

type Page = 'home' | 'analyse';

const getPage = (): Page =>
  window.location.hash === '#analyse' ? 'analyse' : 'home';

const App: React.FC = () => {
  useScrollReveal();
  const [page, setPage] = useState<Page>(getPage);

  useEffect(() => {
    const onHash = () => setPage(getPage());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <>
      {/* Fixed animated background */}
      <ShaderErrorBoundary>
        <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
          <ShaderGradientCanvas
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            pixelDensity={1}
            fov={45}
          >
            <ShaderGradient
              animate="on"
              brightness={0.55}
              cAzimuthAngle={270}
              cDistance={0.5}
              cPolarAngle={180}
              cameraZoom={15.1}
              color1="#0d2b52"
              color2="#7a1414"
              color3="#0b5f62"
              envPreset="city"
              grain="on"
              lightType="env"
              positionX={-0.1}
              positionY={0}
              positionZ={0}
              reflection={0.4}
              rotationX={0}
              rotationY={130}
              rotationZ={70}
              shader="defaults"
              type="sphere"
              uAmplitude={3.2}
              uDensity={0.8}
              uFrequency={5.5}
              uSpeed={0.25}
              uStrength={0.3}
              uTime={0}
              wireframe={false}
            />
          </ShaderGradientCanvas>
        </div>
      </ShaderErrorBoundary>

      {/* Page content */}
      <div className="relative z-10 min-h-screen text-ink font-sans selection:bg-accent-light selection:text-accent">
        <Navbar currentPage={page} />
        {page === 'home' && (
          <main>
            <Hero />
            <HowItWorks />
            <Features />
            <About />
            <Footer />
          </main>
        )}
        {page === 'analyse' && <Analyse />}
      </div>
    </>
  );
};

export default App;
