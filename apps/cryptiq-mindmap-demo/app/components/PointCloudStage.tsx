'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as React from 'react'
// three types are optional in this workspace; import at runtime only
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as THREE from 'three'

type PointCloudStageProps = {
  sceneId?: string
  colorUrl?: string
  depthUrl?: string
  depthRgUrl?: string
  zScale?: number
  pointSize?: number
  stride?: number
  perspective?: boolean
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

// Load RG-packed depth (R=hi, G=lo) and reconstruct to Uint16Array
function usePackedDepth(url: string | null): {
  data16: Uint16Array | null
  width: number
  height: number
} {
  const [state, setState] = React.useState<{
    data16: Uint16Array | null
    width: number
    height: number
  }>({ data16: null, width: 0, height: 0 })

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
        const src = imageData.data
        const out = new Uint16Array(img.width * img.height)
        for (let i = 0, p = 0; p < out.length; i += 4, p++) {
          const hi = src[i]
          const lo = src[i + 1]
          out[p] = (hi << 8) | lo
        }
        setState({ data16: out, width: img.width, height: img.height })
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
  depth16,
  stride = 2,
  zScale = 1.0,
  pointSize = 1.5,
}: {
  colorImage: { data: ImageData; width: number; height: number }
  depth16: { data16: Uint16Array; width: number; height: number }
  stride?: number
  zScale?: number
  pointSize?: number
}) {
  const geomRef = React.useRef<unknown>(null)
  const matRef = React.useRef<THREE.ShaderMaterial | null>(null)

  // Build point positions/colors once inputs available
  const { positions, colors } = React.useMemo(() => {
    const cw = colorImage.width
    const ch = colorImage.height
    const dw = depth16.width
    const dh = depth16.height
    const w = Math.min(cw, dw)
    const h = Math.min(ch, dh)
    const col = colorImage.data.data
    const dep16 = depth16.data16

    const xs: number[] = []
    const cs: number[] = []
    for (let y = 0; y < h; y += stride) {
      for (let x = 0; x < w; x += stride) {
        // Jittered sampling to break scanlines
        const jx = stride > 1 ? (Math.random() - 0.5) * 0.9 * stride : 0
        const jy = stride > 1 ? (Math.random() - 0.5) * 0.9 * stride : 0
        const sx = Math.min(w - 1, Math.max(0, Math.round(x + jx)))
        const sy = Math.min(h - 1, Math.max(0, Math.round(y + jy)))
        const p = sy * w + sx
        const d01 = 1.0 - dep16[p] / 65535.0
        const z = (d01 - 0.5) * 2.0 * zScale * 50.0
        // Center XY around origin
        const nx = (sx / w) * 2 - 1
        const ny = (sy / h) * 2 - 1
        const px = nx * w
        const py = -ny * h
        xs.push(px, py, z)
        // Color sampling
        const ci = (sy * w + sx) * 4
        cs.push(col[ci] / 255.0, col[ci + 1] / 255.0, col[ci + 2] / 255.0)
      }
    }
    const positions = new Float32Array(xs)
    const colors = new Float32Array(cs)
    return { positions, colors }
  }, [colorImage, depth16, stride, zScale])

  React.useEffect(() => {
    const g = geomRef.current as { computeBoundingSphere?: () => void } | null
    if (!g) return
    if (typeof g.computeBoundingSphere === 'function') g.computeBoundingSphere()
  }, [positions, colors])

  // Animate time uniform for gentle drift
  useFrame((_, dt) => {
    if (!matRef.current) return
    const u = matRef.current.uniforms as any
    u.uTime.value += dt
  })

  return (
    <points frustumCulled={true} renderOrder={1}>
      <bufferGeometry ref={geomRef}>
        {/* position attribute */}
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        {/* color attribute */}
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      {/* Custom shader for particle size/alpha and gentle drift; additive blending */}
      <shaderMaterial
        ref={matRef as any}
        args={[{
          uniforms: {
            uTime: { value: 0 },
            uZScale: { value: zScale },
            uBaseSize: { value: pointSize },
          },
          vertexShader: `
            uniform float uTime;
            uniform float uZScale;
            uniform float uBaseSize;
            attribute vec3 color;
            varying vec3 vColor;

            // simple 2D hash noise
            float hash12(vec2 p) {
              vec3 p3  = fract(vec3(p.xyx) * 0.1031);
              p3 += dot(p3, p3.yzx + 33.33);
              return fract((p3.x + p3.y) * p3.z);
            }

            void main() {
              vColor = color;
              vec3 p = position;
              // subtle drift in screen plane
              float n = hash12(p.xy * 0.007 + uTime * 0.05);
              float ang = n * 6.28318;
              vec2 jitter = vec2(cos(ang), sin(ang)) * 0.8; // pixels
              p.xy += jitter;

              vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
              gl_Position = projectionMatrix * mvPosition;

              // size by luma (using vertex color) and approximate depth
              float luma = dot(vColor, vec3(0.299, 0.587, 0.114));
              float nearFactor = clamp(1.0 / max(1e-3, -mvPosition.z * 0.0025), 0.6, 2.5);
              float size = uBaseSize * mix(0.7, 1.6, luma) * nearFactor;
              gl_PointSize = size;
            }
          `,
          fragmentShader: `
            precision highp float;
            varying vec3 vColor;
            void main() {
              // soft circular sprite
              vec2 uv = gl_PointCoord - 0.5;
              float r = length(uv);
              float alpha = smoothstep(0.6, 0.15, r);
              gl_FragColor = vec4(vColor, alpha);
            }
          `,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }]} 
      />
    </points>
  )
}

function FitOrtho({
  contentWidth,
  contentHeight,
  margin = 0.98,
}: {
  contentWidth: number
  contentHeight: number
  margin?: number
}) {
  const { camera, size } = useThree()
  React.useEffect(() => {
    const ortho = camera as {
      isOrthographicCamera?: boolean
      zoom?: number
      updateProjectionMatrix?: () => void
      position?: { set?: (x: number, y: number, z: number) => void }
    }
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
    depthRgUrl,
    zScale = 2.5,
    pointSize = 2.0,
    stride = 1,
    perspective = false,
  } = props
  const base = sceneId ? `/assets/pointclouds/${sceneId}` : null
  const colorUrl = colorUrlProp ?? (base ? `${base}/color.png` : null)
  const depthUrl = depthUrlProp ?? (base ? `${base}/depth16.png` : null)
  const depthRg = depthRgUrl ?? (base ? `${base}/depth_rg.png` : null)

  const color = useImageData(colorUrl)
  const packed = usePackedDepth(depthRg)
  const depth = useImageData(depthUrl)

  const depth16From8 = React.useMemo(() => {
    if (!depth.data) return null
    const w = depth.width
    const h = depth.height
    const src = depth.data.data
    const out = new Uint16Array(w * h)
    for (let i = 0, p = 0; p < out.length; i += 4, p++) out[p] = src[i] * 257
    return { data16: out, width: w, height: h }
  }, [depth.data, depth.width, depth.height])

  const readyPacked = !!color.data && !!packed.data16 && color.width > 0 && packed.width > 0
  const readyFallback = !!color.data && !!depth16From8

  return (
    <Canvas
      orthographic={!perspective}
      camera={
        perspective
          ? { position: [0, 0, 1200], fov: 55, near: 0.1, far: 5000 }
          : { position: [0, 0, 1000], near: -10000, far: 10000, zoom: 1 }
      }
      gl={{ antialias: true, alpha: true }}
    >
      {!perspective && (readyPacked || readyFallback) && (
        <FitOrtho contentWidth={color.width} contentHeight={color.height} />
      )}
      <ambientLight intensity={1} />
      <directionalLight position={[2, 3, 4]} intensity={0.6} />
      {readyPacked ? (
        <PointsMesh
          colorImage={{ data: color.data!, width: color.width, height: color.height }}
          depth16={{ data16: packed.data16!, width: packed.width, height: packed.height }}
          stride={stride}
          zScale={zScale}
          pointSize={pointSize}
        />
      ) : (
        readyFallback && (
          <PointsMesh
            colorImage={{ data: color.data!, width: color.width, height: color.height }}
            depth16={depth16From8!}
            stride={stride}
            zScale={zScale}
            pointSize={pointSize}
          />
        )
      )}
      <OrbitControls enableDamping dampingFactor={0.1} />
    </Canvas>
  )
}
