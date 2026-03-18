import { useState, useEffect } from 'react';
import { MessageSquare, Bug, Send, CornerDownRight, User, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface Comment {
  id: string;
  author: string;
  authorEmail?: string;
  authorPhoto?: string;
  text: string;
  timestamp: string;
}

interface Thread {
  id: string;
  title: string;
  type: 'request' | 'bug';
  author: string;
  authorEmail?: string;
  authorPhoto?: string;
  text: string;
  timestamp: string;
  replies: Comment[];
}

const ConversationPanel: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newType, setNewType] = useState<'request' | 'bug'>('request');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const { user } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('jarvis_threads');
    if (saved) {
      setThreads(JSON.parse(saved));
    } else {
      // Initial mock data
      const initial: Thread[] = [
        {
          id: '1',
          title: 'Add support for dark mode in app',
          type: 'request',
          author: 'Steve',
          text: 'I love the app but a full dark mode would be amazing.',
          timestamp: new Date().toLocaleString(),
          replies: [
            { id: '1-1', author: 'Dev Jarvis', text: 'Great idea! Working on it.', timestamp: new Date().toLocaleString() }
          ]
        }
      ];
      setThreads(initial);
      localStorage.setItem('jarvis_threads', JSON.stringify(initial));
    }
  }, []);

  const saveThreads = (updated: Thread[]) => {
    setThreads(updated);
    localStorage.setItem('jarvis_threads', JSON.stringify(updated));
  };

  const handleSubmitThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle || !newText) return;

    const thread: Thread = {
      id: Date.now().toString(),
      title: newTitle,
      type: newType,
      author: user.displayName || 'Anonymous',
      authorEmail: user.email || undefined,
      authorPhoto: user.photoURL || undefined,
      text: newText,
      timestamp: new Date().toLocaleString(),
      replies: []
    };

    saveThreads([thread, ...threads]);
    setNewTitle('');
    setNewText('');
  };

  const handleReply = (threadId: string) => {
    const text = replyText[threadId];
    if (!user || !text) return;

    const updated = threads.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          replies: [...t.replies, {
            id: Date.now().toString(),
            author: user.displayName || 'Anonymous',
            authorEmail: user.email || undefined,
            authorPhoto: user.photoURL || undefined,
            text,
            timestamp: new Date().toLocaleString()
          }]
        };
      }
      return t;
    });

    saveThreads(updated);
    setReplyText({ ...replyText, [threadId]: '' });
  };

  return (
    <section id="community" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-orbitron font-bold gold-text-gradient mb-4">Public Conversation</h2>
        <p className="text-white/60">Share your ideas, report bugs, and join the Jarvis community.</p>
      </div>

      {/* New Post Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-2xl mb-12 gold-shadow overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-2 h-full bg-gold" />
        <h3 className="text-xl font-orbitron font-semibold mb-6 flex items-center gap-2">
          <MessageSquare className="text-gold" /> Create New Post
        </h3>

        {!user ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
             <div className="p-4 bg-gold/10 rounded-full text-gold">
                <Lock size={32} />
             </div>
             <p className="text-white/60 font-medium tracking-wide">Authentication Required to contribute</p>
             <p className="text-xs text-white/30 truncate max-w-xs">Login from the top navbar to post requests or report bugs.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitThread} className="space-y-4">
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setNewType('request')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${newType === 'request' ? 'bg-gold text-black font-bold' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
              >
                Request
              </button>
              <button 
                type="button"
                onClick={() => setNewType('bug')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${newType === 'bug' ? 'bg-red-500 text-white font-bold' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
              >
                Bug Report
              </button>
            </div>
            <input 
              type="text" 
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
            />
            <textarea 
              placeholder="Share your thoughts..."
              rows={3}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all resize-none"
            />
            <button type="submit" className="bg-gold text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
              <Send size={18} /> Post to Public Board
            </button>
          </form>
        )}
      </motion.div>

      {/* Threads List */}
      <div className="space-y-6">
        <AnimatePresence>
          {threads.map((thread) => (
            <motion.div 
              key={thread.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-8 rounded-2xl border-white/5 relative group"
            >
              <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {thread.authorPhoto ? (
                      <img src={thread.authorPhoto} alt={thread.author} className="w-10 h-10 rounded-full border border-gold/30" />
                    ) : (
                      <div className={`p-2 rounded-lg ${thread.type === 'bug' ? 'bg-red-500/20 text-red-500' : 'bg-gold/20 text-gold'}`}>
                        {thread.type === 'bug' ? <Bug size={20} /> : <MessageSquare size={20} />}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-semibold">{thread.title}</h4>
                        {thread.authorEmail === 'ktsakthi1945@gmail.com' && (
                          <span className="bg-gold/20 text-gold text-[10px] px-2 py-0.5 rounded-full border border-gold/30 font-bold tracking-tighter uppercase">Owner</span>
                        )}
                      </div>
                      <p className="text-xs text-white/40 flex items-center gap-1">
                        <User size={12} /> {thread.author} • {thread.timestamp}
                      </p>
                    </div>
                  </div>
              </div>
              <p className="text-white/80 mb-6 pl-11">{thread.text}</p>

              {/* Replies */}
              <div className="pl-11 space-y-4 border-l border-white/10 ml-5">
                {thread.replies.map((reply) => (
                  <div key={reply.id} className="pt-2">
                    <div className="flex items-center gap-2 text-gold-dark mb-1">
                      <CornerDownRight size={14} className="opacity-50" />
                      {reply.authorPhoto ? (
                        <img src={reply.authorPhoto} alt={reply.author} className="w-5 h-5 rounded-full border border-gold/20" />
                      ) : (
                        <User size={12} className="opacity-50" />
                      )}
                      <span className="text-xs font-bold">{reply.author}</span>
                      {reply.authorEmail === 'ktsakthi1945@gmail.com' && (
                        <span className="bg-gold/10 text-gold text-[8px] px-1.5 py-0 rounded-full border border-gold/20 font-bold uppercase">Owner</span>
                      )}
                      <span className="text-[10px] opacity-30">{reply.timestamp}</span>
                    </div>
                    <p className="text-sm text-white/70">{reply.text}</p>
                  </div>
                ))}

                {/* Reply Input */}
                {user ? (
                  <div className="mt-4 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Write a reply..."
                      value={replyText[thread.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [thread.id]: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && handleReply(thread.id)}
                    />
                    <button 
                      onClick={() => handleReply(thread.id)}
                      className="p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold hover:text-black transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                ) : (
                  <p className="mt-4 text-[10px] text-white/20 italic tracking-wider uppercase">Login to reply</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ConversationPanel;
