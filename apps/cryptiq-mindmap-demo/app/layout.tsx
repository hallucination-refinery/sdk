import type { Metadata } from 'next'
import { Anton, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const displayFont = Anton({ variable: '--font-display', weight: '400', subsets: ['latin'] })
const monoFont = IBM_Plex_Mono({
  variable: '--font-mono',
  weight: ['400', '500'],
  subsets: ['latin'],
})

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
        className={`${displayFont.variable} ${monoFont.variable}`}
        style={{ background: '#000' }}
      >
        {/* Background brain is mounted per-page to avoid SSR ordering issues */}
        {children}
      </body>
    </html>
  )
}
