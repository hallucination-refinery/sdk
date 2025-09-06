import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cryptiq Mind Map Demo',
  description: 'Interactive mind map visualization with 1000+ nodes',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        style={{
          '--font-display': 'Anton, sans-serif',
          '--font-mono': '"IBM Plex Mono", monospace',
          background: '#000',
        } as CSSProperties}
      >
        {/* Background brain is mounted per-page to avoid SSR ordering issues */}
        {children}
      </body>
    </html>
  )
}
