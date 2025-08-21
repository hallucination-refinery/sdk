import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'

export async function POST(request: NextRequest) {
  try {
    const metrics = await request.json()
    
    // Create directory if it doesn't exist
    const filePath = join(process.cwd(), '.clmem/artifacts/w03/acceptance/brain-acceptance.json')
    await mkdir(dirname(filePath), { recursive: true })
    
    // Write metrics to file
    await writeFile(filePath, JSON.stringify(metrics, null, 2))
    
    console.log('[Acceptance Reporter] Metrics received:', metrics)
    
    return NextResponse.json({ success: true, metrics })
  } catch (error) {
    console.error('[Acceptance Reporter] Error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}