import { motion } from 'framer-motion';
import { Mic, MessageSquare, Smartphone, Languages, Star, ExternalLink } from 'lucide-react';

const features = [
  {
    title: "Voice Wake Word",
    description: "Activate Jarvis instantly with “Hey Jarvis”. Requires a Picovoice AccessKey for offline detection.",
    icon: Mic,
    color: "gold",
    link: {
      text: "Get AccessKey",
      url: "https://console.picovoice.ai/login"
    }
  },
  {
    title: "Advanced AI Models",
    description: "Powered by Jarvis R-1 (Big Model) for complex tasks and Jarvis 3 (Small Model) for speed.",
    icon: MessageSquare,
    color: "gold"
  },
  {
    title: "Phone Control",
    description: "Make calls, send SMS automatically through voice.",
    icon: Smartphone,
    color: "gold"
  },
  {
    title: "Neural Translation",
    description: "Translate voice or text in real-time with Firebase ML Kit.",
    icon: Languages,
    color: "gold"
  },
  {
    title: "Glow Animation",
    description: "Show futuristic screen animations even on the lock screen.",
    icon: Star,
    color: "gold"
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-orbitron font-bold gold-text-gradient mb-4">Core Capabilities</h2>
        <p className="text-white/60">Explore the advanced features that make Jarvis the ultimate assistant.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-8 rounded-3xl border-white/5 group hover:border-gold/30 transition-all hover:-translate-y-2"
          >
            <div className="w-12 h-12 bg-gold/10 text-gold rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <feature.icon size={24} />
            </div>
            <h3 className="text-xl font-orbitron font-semibold mb-3 group-hover:text-gold transition-colors">{feature.title}</h3>
            <p className="text-white/60 leading-relaxed mb-6">{feature.description}</p>
            
            {feature.link && (
              <a 
                href={feature.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gold font-bold text-sm hover:underline"
              >
                {feature.link.text} <ExternalLink size={14} />
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
