import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cryptic Vault - Privacy-First Memory Visualization',
  description: '3D visualization of encrypted memory constellation',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  )
}
