'use client'

import { useEffect, useState } from 'react'

export default function Draw3DPage() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 500)
    return () => clearTimeout(t)
  }, [])
  return (
    <main className="relative flex h-full w-full flex-col md:flex-row">
      <div className="flex flex-1 items-center justify-center bg-black text-white">
        <span>Canvas Placeholder</span>
      </div>
      <div className="flex flex-1 items-center justify-center bg-gray-900 text-white">
        <span>3D View Placeholder</span>
      </div>
      <div className="absolute left-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
        {ready ? 'Ready' : 'Loading...'}
      </div>
    </main>
  )
}

