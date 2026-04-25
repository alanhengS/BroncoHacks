import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new ServerIO(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }
  res.end();
}

export function getSocketServer(res) {
  if (res.socket.server.io) {
    return res.socket.server.io;
  }
  return null;
}