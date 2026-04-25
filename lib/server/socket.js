import { Server as ServerIO } from 'socket.io';

export const SOCKET_PATH = '/api/socket';

export function ensureSocketServer(res) {
  if (!res.socket.server.io) {
    res.socket.server.io = new ServerIO(res.socket.server, { path: SOCKET_PATH });
  }
  return res.socket.server.io;
}

export function getSocketServer(res) {
  return res.socket?.server?.io || null;
}
