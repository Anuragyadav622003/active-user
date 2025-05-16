'use client';

import { useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { ActiveUsers } from '@/components/ActiveUser';
import { ConnectButton } from '@/components/ConnectButton';

export default function Home() {
  const { connectUser } = useSocket();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      connectUser(userId);
    }
  }, [connectUser]);

  return (
    <main className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
          E-Learning Platform
        </h1>
        <ActiveUsers />
      </header>

      <section className="max-w-md mx-auto mt-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Connect to see real-time active users.
          </p>
          <ConnectButton />
        </div>
      </section>
    </main>
  );
}
