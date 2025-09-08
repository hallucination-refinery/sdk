import { useEffect, useRef } from 'react'

export default function DoodleCanvas({ onEnd }: { onEnd?(canvas: HTMLCanvasElement): void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)

  const start = (x: number, y: number) => {
    drawing.current = true
    last.current = { x, y }
  }

  const move = (x: number, y: number) => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!drawing.current || !ctx || !last.current) return
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 16
    const { x: lx, y: ly } = last.current
    ctx.beginPath()
    ctx.moveTo(lx, ly)
    const mx = (lx + x) / 2
    const my = (ly + y) / 2
    ctx.quadraticCurveTo(lx, ly, mx, my)
    ctx.stroke()
    last.current = { x, y }
  }

  const end = () => {
    drawing.current = false
    last.current = null
  }

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    // Initialize white background and black stroke for deterministic input
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = '#000'
    }

    const rect = () => canvas.getBoundingClientRect()

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault()
      canvas.setPointerCapture(e.pointerId)
      const r = rect()
      start(e.clientX - r.left, e.clientY - r.top)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!drawing.current) return
      e.preventDefault()
      const r = rect()
      move(e.clientX - r.left, e.clientY - r.top)
    }
    const onPointerUp = (e: PointerEvent) => {
      e.preventDefault()
      end()
      onEnd?.(canvas)
    }

    canvas.addEventListener('pointerdown', onPointerDown, { passive: false })
    canvas.addEventListener('pointermove', onPointerMove, { passive: false })
    canvas.addEventListener('pointerup', onPointerUp, { passive: false })

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
    }
  }, [onEnd])

  return (
    <canvas
      ref={ref}
      width={280}
      height={280}
      style={{ touchAction: 'none', position: 'relative', zIndex: 1 }}
    />
  )
}
