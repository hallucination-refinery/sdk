import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Cryptiq Mindmap'
  const text = searchParams.get('text') || 'Composite archetypes'

  // Minimal SVG OG placeholder (replace with Satori/canvas later)
  const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0a1022"/><text x="60" y="200" font-size="64" fill="#2bc7ff" font-family="Arial,sans-serif">${title}</text><text x="60" y="300" font-size="36" fill="#cfe8ff" font-family="Arial,sans-serif">${text}</text></svg>`
  return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml' } })
}
