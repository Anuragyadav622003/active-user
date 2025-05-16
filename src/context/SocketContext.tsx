'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  activeUsers: number;
  connectUser: (userId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  activeUsers: 0,
  connectUser: () => {},
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const newSocket = io('https://active-user.vercel.app/', {
      autoConnect: false,
      withCredentials: true,
    });

    newSocket.on('active-users', (data: { count: number }) => {
      setActiveUsers(data.count);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const connectUser = (userId: string) => {
    if (!socket) return;
    
    // If socket is not connected, connect it
    if (!socket.connected) {
      socket.connect();
    }
    
    // Make sure we only register the connect event listener once
    socket.off('connect');
    socket.on('connect', () => {
      socket.emit('authenticate', userId);
    });
    
    // If socket is already connected, authenticate immediately
    if (socket.connected) {
      socket.emit('authenticate', userId);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, activeUsers, connectUser }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
