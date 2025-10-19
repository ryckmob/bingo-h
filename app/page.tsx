'use client';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | undefined;

export default function SocketPage(): JSX.Element {
  const [msg, setMsg] = useState<string>('');
  const [resp, setResp] = useState<string>('');

  useEffect(() => {
    socket = io({
      path: '/api/socket',
    });
  
    socket.on('connect', () => console.log('✅ Conectado ao servidor'));
    socket.on('msg', (data) => setResp(data));
  
    return () => {
      socket?.disconnect();
    };
  }, []);
  

  const enviarMensagem = (): void => {
    if (!msg.trim()) return;
    socket?.emit('msg', msg);
    setMsg('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Chat com Socket.IO</h1>
      <div className="flex w-full max-w-md mb-4">
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Digite algo..."
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={enviarMensagem}
          className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition"
        >
          Enviar
        </button>
      </div>
      <div className="w-full max-w-md p-4 bg-white rounded-md shadow">
        <p className="text-gray-700">Recebido: {resp}</p>
      </div>
    </div>
  );
}
