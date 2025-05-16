'use client';

import { useSocket } from '@/context/SocketContext';
import { FiUsers } from 'react-icons/fi';

export const ActiveUsers = () => {
  const { activeUsers } = useSocket();

  return (
    <div className="flex items-center gap-2 bg-indigo-50 dark:bg-gray-800 rounded-full px-4 py-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <div className="flex items-center gap-1">
        <FiUsers className="text-indigo-600 dark:text-indigo-300" />
        <span className="text-sm font-medium text-indigo-800 dark:text-gray-300">
          {activeUsers.toLocaleString()} online
        </span>
      </div>
    </div>
  );
};
