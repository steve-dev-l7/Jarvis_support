import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import ConversationPanel from './components/ConversationPanel';
import Contact from './components/Contact';
import GoldenParticles from './components/GoldenParticles';
import AuthModal from './components/AuthModal';
import { useState } from 'react';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <GoldenParticles />
      <Navbar onLoginClick={() => setIsAuthModalOpen(true)} />
      
      <main>
        <Hero onGetStartedClick={() => setIsAuthModalOpen(true)} />
        <Features />
        <About />
        <ConversationPanel />
        <Contact />
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <footer className="py-12 px-6 border-t border-white/5 bg-[#050505] text-center">
        <div className="max-w-7xl mx-auto">
          <div className="text-2xl font-orbitron font-black text-gold mb-4 tracking-tighter">JARVIS</div>
          <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
            The ultimate AI companion for your mobile device. Elevating your intelligence, one command at a time.
          </p>
          <div className="flex items-center justify-center gap-6 mb-8">
            <a href="#" className="text-white/40 hover:text-gold transition-colors">Twitter</a>
            <a href="#" className="text-white/40 hover:text-gold transition-colors">Discord</a>
            <a href="#" className="text-white/40 hover:text-gold transition-colors">LinkedIn</a>
          </div>
          <p className="text-white/20 text-xs">
            © 2026 Jarvis AI Assistant. All rights reserved. Designed for excellence.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
