import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Mic, Volume2, VolumeX, Image, Loader, Shirt, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice.js';
import api from '../store/api.js';
import { playClick, playSuccess } from '../utils/audio.js';

const MartAI = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector(s => s.cart);
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'outfit'
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I am your ThapaMart Personal Stylist. What premium pieces can I help you find today?" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Text to Speech voice reader
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Select a premium sounding voice if available
      const voices = window.speechSynthesis.getVoices();
      const EnglishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en'));
      if (EnglishVoice) utterance.voice = EnglishVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start speech to text
  const handleStartListening = () => {
    playClick();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback mockup
      setIsListening(true);
      setTimeout(() => {
        setInput("Show me premium black leather watches");
        setIsListening(false);
      }, 1500);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInput(speechToText);
    };

    recognition.start();
  };

  // Handle Drag & Drop / Visual Search mockup
  const handleVisualSearch = async (fileName) => {
    setIsTyping(true);
    setMessages(prev => [...prev, { sender: 'user', text: `[Visual Search Upload: ${fileName}] 📸` }]);
    
    setTimeout(async () => {
      let replyText = "Analyzing visual features... Matching items found in our Premium footwear collection! 👟";
      let recommendedProducts = [];
      try {
        const { data } = await api.get('/products', { params: { search: 'shoes', limit: 2 } });
        recommendedProducts = data.products || [];
      } catch (err) {
        replyText = "Visual search processed. Check out these recommended top matching selections:";
      }
      
      setIsTyping(false);
      playSuccess();
      setMessages(prev => [...prev, { sender: 'ai', text: replyText, products: recommendedProducts }]);
      if (isTtsEnabled) speakText(replyText);
    }, 2000);
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
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
      let isNegotiated = false;

      try {
        // Simple NLP Keyword matching
        const normalized = userMsg.toLowerCase();
        let query = '';
        
        // Bargaining/Haggling NLP detection
        if (normalized.includes('discount') || normalized.includes('cheap') || normalized.includes('deal') || normalized.includes('coupon') || normalized.includes('bargain') || normalized.includes('negotiate') || normalized.includes('price') || normalized.includes('haggle') || normalized.includes('off')) {
          isNegotiated = true;
          if (normalized.includes('30') || normalized.includes('40') || normalized.includes('50') || normalized.includes('half') || normalized.includes('30%') || normalized.includes('50%')) {
            replyText = "Oh, a 30% to 50% discount is quite steep for our premium curated collection! But since you're a serious shopper, let's meet in the middle. I can unlock a special 15% off discount code: use 'HAGGLE15' at checkout! 🤝";
          } else if (normalized.includes('20') || normalized.includes('20%')) {
            replyText = "20% is slightly above my authority level, but I can compromise! Let's do an exclusive 12% off. Use coupon code 'HAGGLE12' to save on your order! 🎁";
          } else {
            replyText = "I normally cannot discount our curated luxury goods, but I really like your vibe! How about I give you a special 10% off coupon code? Use 'BARGAIN10' at checkout! 😉";
          }
          // Attach popular products as suggestions
          const { data } = await api.get('/products', { params: { limit: 2 } });
          recommendedProducts = data.products || [];
        } else if (normalized.includes('watch') || normalized.includes('time')) query = 'watch';
        else if (normalized.includes('shirt') || normalized.includes('tshirt') || normalized.includes('clothing')) query = 'shirt';
        else if (normalized.includes('bag') || normalized.includes('leather')) query = 'bag';
        else if (normalized.includes('shoe') || normalized.includes('sneaker') || normalized.includes('footwear')) query = 'shoes';
        else if (normalized.includes('ring') || normalized.includes('gold')) query = 'ring';

        if (!isNegotiated) {
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
      if (isTtsEnabled) speakText(replyText);
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* TTS Toggle Button */}
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setIsTtsEnabled(!isTtsEnabled);
                  }}
                  title={isTtsEnabled ? "Mute Voice Assistant" : "Unmute Voice Assistant"}
                  style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer', opacity: isTtsEnabled ? 1 : 0.4 }}
                >
                  {isTtsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                <button onClick={() => { playClick(); setIsOpen(false); }} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Tab Bar */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', background: '#FFFFFF' }}>
              <button 
                type="button"
                onClick={() => { playClick(); setActiveTab('chat'); }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'chat' ? '2px solid #000' : '2px solid transparent',
                  cursor: 'pointer',
                  color: activeTab === 'chat' ? '#000' : '#71717A'
                }}
              >
                Chat Assistant
              </button>
              <button 
                type="button"
                onClick={() => { playClick(); setActiveTab('outfit'); }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'outfit' ? '2px solid #000' : '2px solid transparent',
                  cursor: 'pointer',
                  color: activeTab === 'outfit' ? '#000' : '#71717A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <Shirt size={13} /> Outfit Planner
              </button>
            </div>

            {activeTab === 'outfit' ? (
              <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#F9FAFB' }}>
                <div style={{ background: '#FFFFFF', padding: '1rem', border: '1px solid #E5E7EB', borderRadius: '0.75rem' }}>
                  <h5 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#09090B', margin: '0 0 0.5rem 0' }}>
                    👗 AI Styling Report
                  </h5>
                  <p style={{ fontSize: '0.72rem', color: '#52525B', margin: 0, lineHeight: 1.4 }}>
                    {cartItems.length > 0 ? (
                      `You have ${cartItems.length} item(s) in your bag. Our AI suggests matching these with coordinates from the Thapa Luxury Footwear & Accessories lines to elevate your styling profile.`
                    ) : (
                      "Your shopping bag is currently empty. Explore our pre-curated designer outfit combination to get a head start on elite Nepalese style!"
                    )}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Recommended Combinations
                  </span>

                  {[
                    {
                      id: 'style-pair-1',
                      title: 'Luxury Gold Chronograph Watch',
                      price: 24999,
                      image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=300&q=80',
                      styleWith: 'Best paired with formal blazers or casual linen shirts.'
                    },
                    {
                      id: 'style-pair-2',
                      title: 'Premium Leather Chelsea Boots',
                      price: 18500,
                      image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=300&q=80',
                      styleWith: 'Complements tailored trousers or raw denim jeans.'
                    }
                  ].map(pair => (
                    <div 
                      key={pair.id}
                      style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}
                    >
                      <img src={pair.image} alt="" style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <h6 style={{ fontSize: '0.75rem', fontWeight: 850, color: '#09090B', margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {pair.title}
                        </h6>
                        <p style={{ fontSize: '0.65rem', color: '#10B981', fontWeight: 600, margin: '0 0 4px 0' }}>
                          Rs. {pair.price.toLocaleString()}
                        </p>
                        <p style={{ fontSize: '0.65rem', color: '#71717A', margin: 0, fontStyle: 'italic', lineHeight: 1.2 }}>
                          {pair.styleWith}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          playSuccess();
                          dispatch(addToCart({
                            product: pair.id,
                            title: pair.title,
                            price: pair.price,
                            image: pair.image,
                            quantity: 1,
                            stock: 5
                          }));
                          alert(`${pair.title} added to shopping bag!`);
                        }}
                        style={{
                          background: '#000000',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Message Area with Drag and Drop Support */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleVisualSearch(e.dataTransfer.files[0].name);
                    }
                  }}
                  style={{ 
                    flexGrow: 1, 
                    overflowY: 'auto', 
                    padding: '1rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem', 
                    position: 'relative'
                  }}
                >
                  {isDragging && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '2px dashed #000',
                      borderRadius: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: '#000'
                    }}>
                      <Image size={32} className="animate-bounce mb-2" />
                      <span>Drop product image for Visual Search</span>
                    </div>
                  )}

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

                {/* Input Footer with STT & Visual trigger options */}
                <form onSubmit={handleSend} style={{ borderTop: '1px solid #E5E7EB', padding: '0.75rem', display: 'flex', gap: '0.5rem', background: '#FFFFFF', alignItems: 'center' }}>
                  
                  {/* Voice recognition / Mic trigger */}
                  <button
                    type="button"
                    onClick={handleStartListening}
                    style={{
                      background: isListening ? '#EF4444' : '#F3F4F6',
                      color: isListening ? '#FFFFFF' : '#09090B',
                      border: 'none',
                      borderRadius: '50%',
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                    title="Voice Search"
                  >
                    {isListening ? (
                      <span style={{ display: 'flex', gap: '2px' }}>
                        <span className="animate-pulse bg-white w-1.5 h-1.5 rounded-full" />
                        <span className="animate-pulse bg-white w-1.5 h-1.5 rounded-full" style={{ animationDelay: '0.2s' }} />
                      </span>
                    ) : (
                      <Mic size={14} />
                    )}
                  </button>

                  {/* Visual search trigger button */}
                  <label
                    style={{
                      background: '#F3F4F6',
                      color: '#09090B',
                      borderRadius: '50%',
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="Visual Search File Upload"
                  >
                    <Image size={14} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleVisualSearch(e.target.files[0].name);
                        }
                      }}
                      style={{ display: 'none' }} 
                    />
                  </label>

                  <input
                    type="text"
                    placeholder={isListening ? "Listening..." : "Ask about premium products..."}
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
              </>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MartAI;
