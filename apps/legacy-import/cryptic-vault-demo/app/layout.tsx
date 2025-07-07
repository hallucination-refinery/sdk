import type { Metadata } from 'next';
import './globals.css';
import { InteractionProvider } from '@refinery/interaction';

export const metadata: Metadata = {
  title: 'Cryptic Vault - Privacy-First Memory Visualization',
  description: '3D visualization of encrypted memory constellation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <InteractionProvider>{children}</InteractionProvider>
      </body>
    </html>
  );
}
