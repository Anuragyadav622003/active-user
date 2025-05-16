import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SocketProvider } from '@/context/SocketContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Active Users Demo',
  description: 'Real-time user tracking with Socket.IO',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}