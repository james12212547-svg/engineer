import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Trash2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CHAT_DB_NAME = 'TeamChatDB';
const CHAT_STORE = 'messages';

const initChatDB = () => new Promise((resolve, reject) => {
  const req = indexedDB.open(CHAT_DB_NAME, 1);
  req.onupgradeneeded = e => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains(CHAT_STORE)) {
      db.createObjectStore(CHAT_STORE, { keyPath: 'id', autoIncrement: true });
    }
  };
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

const getMessages = async () => {
  const db = await initChatDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CHAT_STORE, 'readonly');
    const req = tx.objectStore(CHAT_STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
};

const saveMessage = async (msg) => {
  const db = await initChatDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CHAT_STORE, 'readwrite');
    tx.objectStore(CHAT_STORE).add(msg);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const deleteMessage = async (id) => {
  const db = await initChatDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CHAT_STORE, 'readwrite');
    tx.objectStore(CHAT_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const AVATARS = ['👷', '🔧', '⚡', '❄️', '☀️', '🛠️'];
const AVATAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

const TeamChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sender, setSender] = useState(localStorage.getItem('chatSender') || '');
  const [senderSet, setSenderSet] = useState(!!localStorage.getItem('chatSender'));
  const [avatar] = useState(() => {
    const stored = localStorage.getItem('chatAvatar');
    if (stored) return JSON.parse(stored);
    const idx = Math.floor(Math.random() * AVATARS.length);
    const av = { emoji: AVATARS[idx], color: AVATAR_COLORS[idx] };
    localStorage.setItem('chatAvatar', JSON.stringify(av));
    return av;
  });
  const bottomRef = useRef();

  useEffect(() => {
    loadMessages();
    // Poll every 3 seconds for new messages (simulates real-time on same device)
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    const msgs = await getMessages();
    setMessages(msgs);
  };

  const handleSetSender = (e) => {
    e.preventDefault();
    if (!sender.trim()) return;
    localStorage.setItem('chatSender', sender.trim());
    setSenderSet(true);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = {
      text: input.trim(),
      sender: sender,
      avatarEmoji: avatar.emoji,
      avatarColor: avatar.color,
      timestamp: new Date().toISOString(),
    };
    await saveMessage(msg);
    setInput('');
    loadMessages();
  };

  const handleDelete = async (id) => {
    await deleteMessage(id);
    loadMessages();
    toast.success('ลบข้อความแล้ว');
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' · ' + d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  };

  const isMine = (msg) => msg.sender === sender;

  if (!senderSet) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="equipment-card" style={{ padding: '2.5rem', maxWidth: '400px', width: '100%', border: '1px solid var(--accent-primary)', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
        <h2 style={{ marginBottom: '0.5rem' }}>ยินดีต้อนรับสู่แชททีม</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>กรุณากรอกชื่อของคุณก่อนเข้าห้องแชท</p>
        <form onSubmit={handleSetSender}>
          <input
            value={sender}
            onChange={e => setSender(e.target.value)}
            placeholder="ชื่อช่างหรือชื่อเล่นของคุณ..."
            autoFocus
            style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '1rem', textAlign: 'center' }}
          />
          <button type="submit" style={{ width: '100%', padding: '0.85rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            เข้าสู่ห้องแชท →
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 8rem)', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageCircle size={32} /> แชททีมช่าง
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            คุณเข้าในชื่อ <strong style={{ color: 'var(--accent-primary)' }}>{avatar.emoji} {sender}</strong>
            <button onClick={() => { localStorage.removeItem('chatSender'); setSenderSet(false); }} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '0.5rem' }}>เปลี่ยนชื่อ</button>
          </p>
        </div>
        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '0.82rem', color: '#f59e0b', maxWidth: '280px' }}>
          ⚠️ ข้อความเก็บในอุปกรณ์นี้เท่านั้น ถ้าต้องการแชทข้ามอุปกรณ์ต้องต่อ Firebase
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', gap: '0.5rem' }}>
            <MessageCircle size={48} style={{ opacity: 0.3 }} />
            <p>ยังไม่มีข้อความ เริ่มคุยกันได้เลย!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const mine = isMine(msg);
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: mine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '0.75rem' }}>
                {/* Avatar */}
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: msg.avatarColor || '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  {msg.avatarEmoji || '👷'}
                </div>
                <div style={{ maxWidth: '70%' }}>
                  {!mine && <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '0.3rem', paddingLeft: '0.5rem' }}>{msg.sender}</div>}
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      background: mine ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                      color: mine ? 'white' : 'var(--text-primary)',
                      padding: '0.75rem 1rem',
                      borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      fontSize: '0.95rem',
                      lineHeight: '1.5',
                      border: mine ? 'none' : '1px solid var(--border-color)',
                      wordBreak: 'break-word'
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '0.3rem', textAlign: mine ? 'right' : 'left', paddingLeft: mine ? 0 : '0.5rem', paddingRight: mine ? '0.5rem' : 0 }}>
                      {formatTime(msg.timestamp)}
                      {mine && (
                        <button onClick={() => handleDelete(msg.id)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', marginLeft: '0.5rem', padding: 0, verticalAlign: 'middle' }}>
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="พิมพ์ข้อความ..."
          style={{ flex: 1, padding: '0.9rem 1.25rem', borderRadius: '12px', fontSize: '1rem' }}
          autoFocus
        />
        <button type="submit" disabled={!input.trim()}
          style={{ background: input.trim() ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: input.trim() ? 'white' : 'var(--text-tertiary)', border: 'none', padding: '0.9rem 1.25rem', borderRadius: '12px', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold', transition: 'all 0.2s' }}>
          <Send size={18} /> ส่ง
        </button>
      </form>
    </div>
  );
};

export default TeamChat;
