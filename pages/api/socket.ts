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
    bodyParser: false, // obrigatório para WebSocket
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const socket = res.socket as SocketWithServer;

  if (!socket.server.io) {
    console.log('🔌 Criando novo servidor Socket.IO...');
    const io = new IOServer(socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
    });
    socket.server.io = io;

    io.on('connection', (s) => {
      console.log('🟢 Cliente conectado:', s.id);

      s.emit('msg', 'Servidor: conexão estabelecida!');

      s.on('msg', (data: string) => {
        console.log('📩 Mensagem recebida:', data);
        io.emit('msg', 'Eco do servidor: ' + data);
      });

      s.on('disconnect', () => {
        console.log('🔴 Cliente desconectado:', s.id);
      });
    });
  }

  res.end();
}
