import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 bg-gold/5 border-y border-gold/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold gold-text-gradient mb-8 leading-tight">Beyond a Simple App - <br/> Your Digital Companion.</h2>
          <p className="text-xl text-white/80 leading-relaxed mb-6">
            Jarvis isn't just code. It's an intelligent companion meticulously designed to integrate seamlessly into your life. With advanced voice recognition and neural processing, it understands context, intent, and preference.
          </p>
          <p className="text-white/60 leading-relaxed">
            Our mission is to provide the most sophisticated, secure, and intuitive AI assistance available on mobile devices. From hands-free control to proactive smart replies, Jarvis is always one step ahead.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="flex-1 relative"
        >
          <div className="aspect-square rounded-full border-2 border-gold/10 p-12 relative animate-spin-slow">
             <div className="absolute inset-0 border-t-2 border-gold rounded-full" />
             <div className="w-full h-full rounded-full border-2 border-gold/20 flex items-center justify-center">
                 <div className="w-1/2 h-1/2 bg-gold/20 rounded-full blur-2xl animate-pulse" />
             </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
             <div className="text-6xl font-orbitron font-black text-gold">AI</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
