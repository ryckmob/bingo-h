import { Server as IOServer, Socket } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithServer extends NetSocket {
  server: SocketServer;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const socket = res.socket as SocketWithServer;

  if (!socket.server.io) {
    const io = new IOServer(socket.server, { path: '/api/socket' });
    socket.server.io = io;

    io.on('connection', (s: Socket) => {
      s.emit('msg', 'Servidor: Hello World!');
      s.on('msg', (data: string) => io.emit('msg', 'Eco do servidor: ' + data));
    });
  }

  res.end();
}
