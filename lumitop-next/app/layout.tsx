import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import Chatbot from '@/components/chat/Chatbot';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lumitop Store | Premium Sunset Lamp',
  description: 'Experience the magic of golden hour anytime with the Lumitop Sunset Projection LED Lamp.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`/* ${'inter.className'} */ flex flex-col min-h-screen bg-gray-100`}>
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
        <CartDrawer />
        <Chatbot />
      </body>
    </html>
  );
}
