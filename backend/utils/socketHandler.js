export const handleSockets = (io) => {
  const rooms = {}; // Keep track of active rooms and their users

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join a collaborative room
    socket.on('join-room', ({ roomId, username }) => {
      socket.join(roomId);
      
      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }
      
      // Prevent duplicates
      if (!rooms[roomId].find(u => u.username === username)) {
        rooms[roomId].push({ id: socket.id, username });
      }
      
      console.log(`👤 User ${username} joined room ${roomId}`);
      
      // Notify everyone in the room
      io.to(roomId).emit('room-users', rooms[roomId]);
    });

    // Broadcast cart update
    socket.on('update-cart', ({ roomId, cartItems }) => {
      socket.to(roomId).emit('cart-updated', cartItems);
    });

    // Broadcast active item view
    socket.on('view-item', ({ roomId, username, product }) => {
      socket.to(roomId).emit('item-viewed', { username, product });
    });

    // Broadcast cursor movement (micro-interaction)
    socket.on('cursor-move', ({ roomId, username, x, y }) => {
      socket.to(roomId).emit('cursor-moved', { username, x, y });
    });

    // Chat messaging
    socket.on('send-message', ({ roomId, username, text }) => {
      io.to(roomId).emit('new-message', { username, text, timestamp: new Date() });
    });

    // Leave room / disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      
      for (const roomId in rooms) {
        rooms[roomId] = rooms[roomId].filter(u => u.id !== socket.id);
        io.to(roomId).emit('room-users', rooms[roomId]);
        
        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
        }
      }
    });
  });
};
