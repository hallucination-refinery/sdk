'use client'

import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'

const FG = dynamic(() => import('@/components/CrypticAnimusScene'), { ssr: false })

// Mock graph data with 213 nodes (simplified version)
const mockGraph213 = {
  nodes: Array.from({ length: 213 }, (_, i) => ({
    id: `n${i + 1}`,
    label: `Node ${i + 1}`,
    type: 'concept',
    metadata: { cluster: i % 5 === 0 ? 'research' : 'personal' },
  })),
  links: Array.from({ length: 300 }, (_, i) => ({
    source: `n${(i % 213) + 1}`,
    target: `n${((i + 1) % 213) + 1}`,
    sign: i % 2 === 0 ? '+' : '-',
  })),
}

export default function FGRepro() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Canvas>
        <FG data={mockGraph213} />
      </Canvas>
    </div>
  )
}
