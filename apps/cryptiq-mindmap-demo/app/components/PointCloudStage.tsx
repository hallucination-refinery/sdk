'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as React from 'react'

type PointCloudStageProps = {
  sceneId?: string
  colorUrl?: string
  depthUrl?: string
  zScale?: number
  pointSize?: number
  stride?: number
}

function useImageData(url: string | null): {
  data: ImageData | null
  width: number
  height: number
} {
  const [state, setState] = React.useState<{
    data: ImageData | null
    width: number
    height: number
  }>({
    data: null,
    width: 0,
    height: 0,
  })

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!url) return
      try {
        const res = await fetch(url, { cache: 'force-cache' })
        const blob = await res.blob()
        const img = await createImageBitmap(blob)
        if (cancelled) return
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) return
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        setState({ data: imageData, width: img.width, height: img.height })
      } catch {
        // noop
      }
    })()
    return () => {
      cancelled = true
    }
  }, [url])

  return state
}

function PointsMesh({
  colorImage,
  depthImage,
  stride = 2,
  zScale = 1.0,
  pointSize = 1.5,
}: {
  colorImage: { data: ImageData; width: number; height: number }
  depthImage: { data: ImageData; width: number; height: number }
  stride?: number
  zScale?: number
  pointSize?: number
}) {
  const geomRef = React.useRef<unknown>(null)

  // Build point positions/colors once inputs available
  const { positions, colors } = React.useMemo(() => {
    const cw = colorImage.width
    const ch = colorImage.height
    const dw = depthImage.width
    const dh = depthImage.height
    const w = Math.min(cw, dw)
    const h = Math.min(ch, dh)
    const col = colorImage.data.data
    const dep = depthImage.data.data

    const xs: number[] = []
    const cs: number[] = []
    for (let y = 0; y < h; y += stride) {
      for (let x = 0; x < w; x += stride) {
        const i = (y * w + x) * 4
        // Depth: browser decodes 16-bit PNG to 8-bit; use the R channel as normalized depth
        const d01 = 1.0 - dep[i] / 255.0 // invert so brighter is farther
        const z = (d01 - 0.5) * 2.0 * zScale * 50.0
        // Center XY around origin
        const nx = (x / w) * 2 - 1
        const ny = (y / h) * 2 - 1
        const px = nx * w
        const py = -ny * h
        xs.push(px, py, z)
        // Color sampling
        cs.push(col[i] / 255.0, col[i + 1] / 255.0, col[i + 2] / 255.0)
      }
    }
    const positions = new Float32Array(xs)
    const colors = new Float32Array(cs)
    return { positions, colors }
  }, [colorImage, depthImage, stride, zScale])

  React.useEffect(() => {
    const g = geomRef.current as { computeBoundingSphere?: () => void } | null
    if (!g) return
    if (typeof g.computeBoundingSphere === 'function') g.computeBoundingSphere()
  }, [positions, colors])

  return (
    <points frustumCulled={true} renderOrder={1}>
      <bufferGeometry ref={geomRef}>
        {/* position attribute */}
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        {/* color attribute */}
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={pointSize}
        vertexColors={true}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  )
}

function FitOrtho({ contentWidth, contentHeight, margin = 0.98 }: { contentWidth: number; contentHeight: number; margin?: number }) {
  const { camera, size } = useThree()
  React.useEffect(() => {
    const ortho = camera as { isOrthographicCamera?: boolean; zoom?: number; updateProjectionMatrix?: () => void; position?: { set?: (x: number, y: number, z: number) => void } }
    if (!ortho || !ortho.isOrthographicCamera) return
    const zx = size.width / contentWidth
    const zy = size.height / contentHeight
    const zoom = Math.min(zx, zy) * margin
    if (typeof ortho.zoom === 'number') ortho.zoom = zoom
    if (typeof ortho.updateProjectionMatrix === 'function') ortho.updateProjectionMatrix()
    if (ortho.position && typeof ortho.position.set === 'function') ortho.position.set(0, 0, 1000)
  }, [camera, size.width, size.height, contentWidth, contentHeight, margin])
  return null
}

export default function PointCloudStage(props: PointCloudStageProps) {
  const {
    sceneId,
    colorUrl: colorUrlProp,
    depthUrl: depthUrlProp,
    zScale = 1.0,
    pointSize = 1.5,
    stride = 2,
  } = props
  const base = sceneId ? `/assets/pointclouds/${sceneId}` : null
  const colorUrl = colorUrlProp ?? (base ? `${base}/color.png` : null)
  const depthUrl = depthUrlProp ?? (base ? `${base}/depth16.png` : null)

  const color = useImageData(colorUrl)
  const depth = useImageData(depthUrl)

  const ready = !!color.data && !!depth.data && color.width > 0 && depth.width > 0

  return (
    <Canvas orthographic camera={{ position: [0, 0, 1000], near: -10000, far: 10000, zoom: 1 }} gl={{ antialias: true, alpha: true }}>
      {ready && <FitOrtho contentWidth={color.width} contentHeight={color.height} />}
      <ambientLight intensity={1} />
      <directionalLight position={[2, 3, 4]} intensity={0.6} />
      {ready && (
        <PointsMesh
          colorImage={{ data: color.data!, width: color.width, height: color.height }}
          depthImage={{ data: depth.data!, width: depth.width, height: depth.height }}
          stride={stride}
          zScale={zScale}
          pointSize={pointSize}
        />
      )}
      <OrbitControls enableDamping dampingFactor={0.1} />
    </Canvas>
  )
}
