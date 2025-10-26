'use client'

import * as React from 'react'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error }: ErrorPageProps) {
  React.useEffect(() => {
    try {
      console.error('[PC] mount-error', {
        message: error?.message ?? null,
        stack: error?.stack ?? null,
        digest: error?.digest ?? null,
      })
    } catch {
      /* noop */
    }
  }, [error])

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
    </div>
  )
}
