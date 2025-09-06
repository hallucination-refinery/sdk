import type { Metadata } from 'next'
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
      <body style={{ background: '#000' }}>
        {/* Background brain is mounted per-page to avoid SSR ordering issues */}
        {children}
      </body>
    </html>
  )
}
