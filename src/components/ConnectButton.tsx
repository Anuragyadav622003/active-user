'use client';

import { useSocket } from '@/context/SocketContext';

export const ConnectButton = () => {
  const { connectUser } = useSocket();

  const handleConnect = () => {
    let userId = localStorage.getItem('userId');

    if (!userId) {
      userId = `user_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('userId', userId);
    }

    connectUser(userId);
  };

  return (
    <button
      onClick={handleConnect}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
    >
      Connect as User
    </button>
  );
};
