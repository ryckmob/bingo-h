// /pages/api/socket.ts
import { Server as IOServer } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithServer extends NetSocket {
  server: SocketServer;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const socket = res.socket as SocketWithServer;

  // Cria o servidor apenas se ainda não existir
  if (!socket.server.io) {
    console.log('🔌 Criando servidor Socket.IO global...');
    const io = new IOServer(socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
    });
    socket.server.io = io;

    io.on('connection', (s) => {
      console.log('🟢 Cliente conectado', s.id);
      s.emit('msg', 'Servidor pronto!');

      s.on('msg', (data) => io.emit('msg', data));
    });
  }

  res.end();
}
