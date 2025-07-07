'use client';

import dynamic from 'next/dynamic';

// Dynamic import for Three.js components to avoid SSR issues
const CrypticVaultScene = dynamic(
  () => import('@/components/CrypticVaultScene'),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-cryptic text-lg animate-pulse">
          Loading Memory Vault...
        </div>
      </div>
    ),
  },
);

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <CrypticVaultScene />
    </main>
  );
}
