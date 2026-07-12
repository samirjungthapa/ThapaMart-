import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiShare2, FiMessageSquare, FiCopy, FiCheck, FiSend, FiX, FiRefreshCw } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setCartItems } from '../store/slices/cartSlice.js';
import { playClick, playSuccess } from '../utils/audio.js';
import { socket, initiateSocket, disconnectSocket } from '../utils/socket.js';

const CollaborativeShop = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.cart);
  const user = useSelector(state => state.auth?.userInfo) || { name: 'Guest' };
  
  const [isOpen, setIsOpen] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [activePartnerProduct, setActivePartnerProduct] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (joined && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Connect to Sockets when room joined
  const joinRoom = (selectedRoomId) => {
    if (!selectedRoomId) return;
    playClick();

    initiateSocket(
      selectedRoomId,
      user.name || 'Anonymous',
      cartItems,
      (roomUsers) => setUsers(roomUsers),
      (newCartItems) => dispatch(setCartItems(newCartItems)),
      ({ username, product }) => {
        setActivePartnerProduct({ username, product });
        setTimeout(() => setActivePartnerProduct(null), 8000);
      },
      (msg) => setMessages((prev) => [...prev, msg])
    );

    setRoomId(selectedRoomId);
    setJoined(true);
    localStorage.setItem('coShopRoomId', selectedRoomId);
    playSuccess();
  };

  const createRoom = () => {
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    joinRoom(randomId);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !socket) return;
    
    socket.emit('send-message', {
      roomId,
      username: user.name || 'Guest',
      text: chatInput.trim()
    });
    setChatInput('');
  };

  // Sync cart when cartItems change locally
  useEffect(() => {
    if (joined && socket) {
      socket.emit('update-cart', { roomId, cartItems });
    }
  }, [cartItems, joined, roomId]);

  const copyLink = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const leaveRoom = () => {
    disconnectSocket();
    setJoined(false);
    setUsers([]);
    setMessages([]);
    setRoomId('');
    localStorage.removeItem('coShopRoomId');
    playClick();
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => { playClick(); setIsOpen(true); }}
        className="fixed bottom-24 right-2 z-40 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full p-3.5 shadow-premium flex items-center justify-center border border-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiUsers size={20} />
        {joined && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-black text-white animate-pulse">
            {users.length}
          </span>
        )}
      </motion.button>

      {/* Floating Partner Notification */}
      <AnimatePresence>
        {activePartnerProduct && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-40 right-4 z-50 max-w-sm bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-glass flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white">
              <img src={activePartnerProduct.product.images?.[0] || activePartnerProduct.product.image} alt="" className="object-cover w-full h-full" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{activePartnerProduct.username} is viewing</p>
              <h5 className="text-xs font-semibold text-white truncate max-w-[180px]">{activePartnerProduct.product.title || activePartnerProduct.product.name}</h5>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collaborative Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950 z-[200] backdrop-blur-xs"
            />

            {/* Sidebar content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-100 dark:border-slate-800 z-[300] flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg">
                    <FiUsers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Shop with Friends</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Real-time cart & chat sync</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-grow overflow-y-auto p-5 flex flex-col justify-between">
                {!joined ? (
                  /* Join room flow */
                  <div className="space-y-6 my-auto max-w-xs mx-auto text-center">
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-slate-950 dark:text-white">Co-Shopping Lounge</h4>
                      <p className="text-xs text-slate-500">Create a temporary session, share your unique room ID, and build your cart together in real time.</p>
                    </div>

                    <button
                      onClick={createRoom}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-extrabold shadow-premium hover:scale-[1.02] transition-transform"
                    >
                      Start New Session
                    </button>

                    <div className="flex items-center my-4">
                      <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                      <span className="px-3 text-[10px] text-slate-400 font-bold uppercase">or join existing</span>
                      <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="ENTER ROOM ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                        className="flex-grow px-3 py-2 text-center text-xs font-mono font-bold tracking-wider rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
                      />
                      <button
                        onClick={() => joinRoom(roomId)}
                        className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:opacity-90"
                      >
                        Join
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Active session flow */
                  <div className="flex flex-col h-full space-y-4">
                    {/* Connection details */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Session Room</span>
                        <span className="text-sm font-mono font-black text-indigo-500">{roomId}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={copyLink}
                          className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl text-xs flex items-center gap-1.5 text-slate-600 dark:text-white"
                        >
                          {copied ? <FiCheck className="text-emerald-500" /> : <FiCopy />}
                          <span>{copied ? 'Copied' : 'Copy ID'}</span>
                        </button>
                        <button
                          onClick={leaveRoom}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs"
                        >
                          Leave
                        </button>
                      </div>
                    </div>

                    {/* Active users */}
                    <div>
                      <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Connected Shoppers ({users.length})</h5>
                      <div className="flex flex-wrap gap-2">
                        {users.map((u, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-medium"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            {u.username}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Collaborative Chat */}
                    <div className="flex-grow flex flex-col border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20">
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 text-slate-500">
                        <FiMessageSquare size={14} />
                        <span className="text-xs font-semibold">Live Lounge Chat</span>
                      </div>

                      {/* Messages list */}
                      <div className="flex-grow overflow-y-auto p-4 space-y-3 max-h-[220px]">
                        {messages.length === 0 ? (
                          <p className="text-[11px] text-slate-400 text-center my-8">Start the conversation... Share thoughts on items in your cart!</p>
                        ) : (
                          messages.map((msg, i) => {
                            const isMe = msg.username === (user.name || 'Guest');
                            return (
                              <div
                                key={i}
                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                              >
                                <span className="text-[9px] text-slate-400 font-bold mb-0.5">{msg.username}</span>
                                <div className={`p-2.5 rounded-2xl max-w-[80%] text-xs ${
                                  isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
                                }`}>
                                  {msg.text}
                                </div>
                              </div>
                            );
                          })
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input form */}
                      <form onSubmit={handleSend} className="p-2 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 bg-white dark:bg-slate-900">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="flex-grow px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none text-slate-800 dark:text-white"
                        />
                        <button
                          type="submit"
                          className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500"
                        >
                          <FiSend size={12} />
                        </button>
                      </form>
                    </div>

                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      💡 Your cart additions, quantities, and removals are now synchronized in real time with everyone in this room.
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CollaborativeShop;
export { socket };
