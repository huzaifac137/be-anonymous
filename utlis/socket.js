import {io} from "socket.io-client";

let socket;

export const initiateSocket = () => {
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL , {transports : ["websocket"]}); // Replace with your server URL

  socket.on('connect', () => {
   console.log('Socket connected');
  });

  // Add more event listeners and handlers as needed

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log('Socket disconnected');
  }
};

export const getSocket = () => {
  return socket;
};