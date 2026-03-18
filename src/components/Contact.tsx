import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Send, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-4xl mx-auto">
      <div className="glass p-12 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-3xl -z-10" />
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-orbitron font-bold gold-text-gradient mb-4">Get in Touch</h2>
          <p className="text-white/60">Have a question or a custom requirement? Our team is here to help.</p>
        </div>

        {submitted ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <CheckCircle size={80} className="text-gold mb-6" />
            <h3 className="text-2xl font-bold mb-2">Message Received!</h3>
            <p className="text-white/60">We'll get back to you shortly, Steve.</p>
            <button 
                onClick={() => setSubmitted(false)}
                className="mt-8 text-gold font-bold hover:underline"
            >
                Send another message
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/40 ml-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Steve"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all placeholder:text-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/40 ml-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="steve@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all placeholder:text-white/10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/40 ml-2">Message</label>
              <textarea 
                required
                rows={5}
                placeholder="How can we help you today?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all resize-none placeholder:text-white/10"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-gold text-black py-5 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 gold-shadow group"
            >
              <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Send Secure Message
            </button>
          </form>
        ) }

        <div className="mt-16 flex flex-wrap items-center justify-center gap-12 text-white/40">
           <div className="flex items-center gap-2 hover:text-gold transition-colors">
              <Mail size={18} />
              <span>support@jarvis-gold.ai</span>
           </div>
           <div className="flex items-center gap-2 hover:text-gold transition-colors">
              <MessageCircle size={18} />
              <span>Live Support Chat</span>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
