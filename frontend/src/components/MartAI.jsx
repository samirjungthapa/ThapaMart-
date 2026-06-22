import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../store/api.js';
import { playClick, playSuccess } from '../utils/audio.js';

const MartAI = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I am your ThapaMart Personal Stylist. What premium pieces can I help you find today?" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    playClick();
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // AI logic response
    setTimeout(async () => {
      let replyText = "I see! Let me check our premium collections for that...";
      let recommendedProducts = [];

      try {
        // Simple NLP Keyword matching
        const normalized = userMsg.toLowerCase();
        let query = '';
        if (normalized.includes('watch') || normalized.includes('time')) query = 'watch';
        else if (normalized.includes('shirt') || normalized.includes('tshirt') || normalized.includes('clothing')) query = 'shirt';
        else if (normalized.includes('bag') || normalized.includes('leather')) query = 'bag';
        else if (normalized.includes('shoe') || normalized.includes('sneaker')) query = 'shoes';
        else if (normalized.includes('ring') || normalized.includes('gold')) query = 'ring';

        if (query) {
          const { data } = await api.get('/products', { params: { search: query, limit: 3 } });
          recommendedProducts = data.products || [];
          if (recommendedProducts.length > 0) {
            replyText = `Based on your request, I highly recommend checking out these premium ${query} selections:`;
          } else {
            replyText = `I couldn't find active listings for "${query}" right now, but check out our other collections in the Shop page!`;
          }
        } else {
          // Fallback popular products
          const { data } = await api.get('/products', { params: { limit: 2 } });
          recommendedProducts = data.products || [];
          replyText = "I'm your stylistic assistant! Try asking me for 'watches', 'shirts', 'leather bags' or check out these featured styles:";
        }
      } catch (err) {
        replyText = "I ran into a small connectivity hiccup, but feel free to search directly in our Shop tab!";
      }

      setIsTyping(false);
      playSuccess();
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: replyText, products: recommendedProducts },
      ]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Chat Trigger */}
      <motion.button
        onClick={() => { playClick(); setIsOpen(true); }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 90,
          background: '#000000',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '50%',
          width: '3.5rem',
          height: '3.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        }}
      >
        <MessageSquare size={20} />
      </motion.button>

      {/* Chat Widget Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              position: 'fixed',
              bottom: '6.5rem',
              right: '2rem',
              width: '100%',
              maxWidth: '380px',
              height: '500px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid #E5E7EB',
              borderRadius: '1rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 350,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding: '1rem 1.25rem', background: '#09090B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} style={{ color: '#D4AF37' }} />
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                    MartAI Stylist
                  </h4>
                  <span style={{ fontSize: '0.65rem', color: '#10B981', fontWeight: 600 }}>● Online</span>
                </div>
              </div>
              <button onClick={() => { playClick(); setIsOpen(false); }} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Message Area */}
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.8rem',
                      lineHeight: 1.4,
                      background: msg.sender === 'user' ? '#000000' : '#F3F4F6',
                      color: msg.sender === 'user' ? '#FFFFFF' : '#09090B',
                      borderBottomRightRadius: msg.sender === 'user' ? '0' : '0.75rem',
                      borderBottomLeftRadius: msg.sender === 'ai' ? '0' : '0.75rem',
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* Recommended Products UI */}
                  {msg.products && msg.products.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem', width: '100%' }}>
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id || prod._id}
                          onClick={() => { playClick(); setIsOpen(false); navigate(`/products/${prod.id || prod._id}`); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem',
                            background: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                          }}
                        >
                          <img src={prod.images[0]} alt="" style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                          <div style={{ flexGrow: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prod.title}</p>
                            <p style={{ fontSize: '0.7rem', color: '#71717A', margin: 0 }}>Rs. {Number(prod.price).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', gap: '0.25rem', padding: '0.5rem', background: '#F3F4F6', borderRadius: '0.5rem', width: '3rem', justifyContent: 'center' }}>
                  <span className="animate-bounce" style={{ width: '4px', height: '4px', background: '#71717A', borderRadius: '50%' }}></span>
                  <span className="animate-bounce" style={{ width: '4px', height: '4px', background: '#71717A', borderRadius: '50%', animationDelay: '0.2s' }}></span>
                  <span className="animate-bounce" style={{ width: '4px', height: '4px', background: '#71717A', borderRadius: '50%', animationDelay: '0.4s' }}></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} style={{ borderTop: '1px solid #E5E7EB', padding: '0.75rem', display: 'flex', gap: '0.5rem', background: '#FFFFFF' }}>
              <input
                type="text"
                placeholder="Ask about premium products..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ flexGrow: 1, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '9999px', padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#09090B', outline: 'none' }}
              />
              <button
                type="submit"
                style={{
                  background: '#000000',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50%',
                  width: '2.2rem',
                  height: '2.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MartAI;
