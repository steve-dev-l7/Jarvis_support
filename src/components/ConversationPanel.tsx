import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Bug, Send, CornerDownRight, User, Lock, Trash2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const OWNER_EMAIL = 'ktsakthi1945@gmail.com';

interface Reply {
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
  replies: Reply[];
}

const ConversationPanel: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newType, setNewType] = useState<'request' | 'bug'>('request');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();
  const isOwner = user?.email === OWNER_EMAIL;
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'community_threads'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data: Thread[] = snapshot.docs.map(d => {
        const raw = d.data();
        return {
          id: d.id,
          title: raw.title,
          type: raw.type,
          author: raw.author,
          authorEmail: raw.authorEmail,
          authorPhoto: raw.authorPhoto,
          text: raw.text,
          timestamp: raw.createdAt instanceof Timestamp
            ? raw.createdAt.toDate().toLocaleString()
            : raw.timestamp || '',
          replies: raw.replies || []
        };
      });
      setThreads(data);
    });
    unsubRef.current = unsub;
    return () => unsub();
  }, []);

  const handleSubmitThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle.trim() || !newText.trim()) return;

    await addDoc(collection(db, 'community_threads'), {
      title: newTitle.trim(),
      type: newType,
      author: user.displayName || 'Anonymous',
      authorEmail: user.email || null,
      authorPhoto: user.photoURL || null,
      text: newText.trim(),
      timestamp: new Date().toLocaleString(),
      createdAt: serverTimestamp(),
      replies: []
    });

    setNewTitle('');
    setNewText('');
  };

  const handleReply = async (threadId: string) => {
    const text = replyText[threadId]?.trim();
    if (!user || !text) return;

    const reply: Reply = {
      id: Date.now().toString(),
      author: user.displayName || 'Anonymous',
      authorEmail: user.email || undefined,
      authorPhoto: user.photoURL || undefined,
      text,
      timestamp: new Date().toLocaleString()
    };

    await updateDoc(doc(db, 'community_threads', threadId), {
      replies: arrayUnion(reply)
    });

    setReplyText({ ...replyText, [threadId]: '' });
  };

  const handleDeleteThread = async (threadId: string) => {
    if (!isOwner) return;
    setDeletingId(threadId);
    await deleteDoc(doc(db, 'community_threads', threadId));
    setDeletingId(null);
  };

  const handleDeleteReply = async (thread: Thread, replyId: string) => {
    if (!isOwner) return;
    const updated = thread.replies.filter(r => r.id !== replyId);
    await updateDoc(doc(db, 'community_threads', thread.id), {
      replies: updated
    });
  };

  return (
    <section id="community" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-orbitron font-bold gold-text-gradient mb-4">Public Community Board</h2>
        <p className="text-white/60">Share ideas, report bugs, and join the Jarvis community — live across all devices.</p>
        {isOwner && (
          <div className="mt-3 inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
            <Shield size={12} /> Owner Mode Active — Delete Access Enabled
          </div>
        )}
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

      {/* Live Threads */}
      <div className="space-y-6">
        <AnimatePresence>
          {threads.map((thread) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="glass p-8 rounded-2xl border-white/5 relative group"
            >
              {/* Owner Delete Thread Button */}
              {isOwner && (
                <button
                  onClick={() => handleDeleteThread(thread.id)}
                  disabled={deletingId === thread.id}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  title="Delete thread (Owner only)"
                >
                  <Trash2 size={16} />
                </button>
              )}

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
                      {thread.authorEmail === OWNER_EMAIL && (
                        <span className="bg-gold/20 text-gold text-[10px] px-2 py-0.5 rounded-full border border-gold/30 font-bold tracking-tighter uppercase">Owner</span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${thread.type === 'bug' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {thread.type}
                      </span>
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
                  <div key={reply.id} className="pt-2 relative group/reply">
                    <div className="flex items-center gap-2 text-gold-dark mb-1">
                      <CornerDownRight size={14} className="opacity-50" />
                      {reply.authorPhoto ? (
                        <img src={reply.authorPhoto} alt={reply.author} className="w-5 h-5 rounded-full border border-gold/20" />
                      ) : (
                        <User size={12} className="opacity-50" />
                      )}
                      <span className="text-xs font-bold">{reply.author}</span>
                      {reply.authorEmail === OWNER_EMAIL && (
                        <span className="bg-gold/10 text-gold text-[8px] px-1.5 py-0 rounded-full border border-gold/20 font-bold uppercase">Owner</span>
                      )}
                      <span className="text-[10px] opacity-30">{reply.timestamp}</span>
                      {isOwner && (
                        <button
                          onClick={() => handleDeleteReply(thread, reply.id)}
                          className="ml-auto p-1 rounded bg-red-500/0 text-red-400 hover:bg-red-500/20 transition-all opacity-0 group-hover/reply:opacity-100"
                          title="Delete reply"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
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

        {threads.length === 0 && (
          <div className="text-center py-20 text-white/20">
            <MessageSquare size={40} className="mx-auto mb-4 opacity-20" />
            <p>No posts yet. Be the first to post!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ConversationPanel;
