import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, ChevronDown } from 'lucide-react';

interface HeroProps {
  onGetStartedClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStartedClick }) => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 blur-[120px] rounded-full -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/5 text-gold text-sm font-medium mb-8"
        >
          <Zap size={14} className="fill-gold" />
          <span>The Next Generation of AI Assistance</span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-orbitron font-black mb-6 tracking-tighter">
          JARVIS
        </h1>
        
        <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          Experience the pinnacle of mobile intelligence. A professional, secure, and stunning companion designed for those who demand excellence.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={onGetStartedClick}
            className="bg-gold text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 gold-shadow"
          >
            <Cpu size={20} /> Get Started Free
          </button>
        </div>
      </motion.div>

      {/* Stats/Badges */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-24 max-w-3xl w-full"
      >
        <div className="text-center">
          <div className="text-3xl font-orbitron font-bold text-gold mb-1 underline decoration-gold/30 underline-offset-4">99%</div>
          <p className="text-xs text-white/40 uppercase tracking-widest">Accuracy</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-orbitron font-bold text-gold mb-1 underline decoration-gold/30 underline-offset-4">0.1s</div>
          <p className="text-xs text-white/40 uppercase tracking-widest">Latency</p>
        </div>
        <div className="hidden md:block text-center">
          <div className="text-3xl font-orbitron font-bold text-gold mb-1 underline decoration-gold/30 underline-offset-4">256-bit</div>
          <p className="text-xs text-white/40 uppercase tracking-widest">AES Encryption</p>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 text-white/20"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
};

export default Hero;
