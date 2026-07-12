import { io } from 'socket.io-client';

// Initially null, will be initialized on demand
export let socket = null;

export const initiateSocket = (roomId, username, cartItems, onUsers, onCartUpdate, onItemView, onMessage) => {
  socket = io('http://127.0.0.1:5000');

  socket.emit('join-room', { roomId, username });

  socket.on('room-users', onUsers);
  socket.on('cart-updated', onCartUpdate);
  socket.on('item-viewed', onItemView);
  socket.on('new-message', onMessage);

  // Broadcast initial cart
  socket.emit('update-cart', { roomId, cartItems });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
