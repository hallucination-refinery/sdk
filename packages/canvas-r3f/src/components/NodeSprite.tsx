import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export interface NodeSpriteProps {
  text: string
  position?: [number, number, number]
  scale?: [number, number, number] | number
  color?: string
  fontSize?: number
  fontFamily?: string
  backgroundColor?: string
  backgroundOpacity?: number
  padding?: number
  visible?: boolean
  opacity?: number
}

function createTextTexture(
  text: string,
  options: {
    color: string
    fontSize: number
    fontFamily: string
    backgroundColor: string
    backgroundOpacity: number
    padding: number
  }
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  
  // Set font and measure text
  const font = `${options.fontSize}px ${options.fontFamily}`
  context.font = font
  const metrics = context.measureText(text)
  
  // Calculate canvas size with padding
  const textWidth = metrics.width
  const textHeight = options.fontSize
  const canvasWidth = Math.ceil(textWidth + options.padding * 2)
  const canvasHeight = Math.ceil(textHeight + options.padding * 2)
  
  // Set canvas size (power of 2 for better GPU performance)
  canvas.width = Math.pow(2, Math.ceil(Math.log2(canvasWidth)))
  canvas.height = Math.pow(2, Math.ceil(Math.log2(canvasHeight)))
  
  // Clear and setup context
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.font = font
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  
  // Draw background if specified
  if (options.backgroundOpacity > 0) {
    context.fillStyle = options.backgroundColor
    context.globalAlpha = options.backgroundOpacity
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.globalAlpha = 1.0
  }
  
  // Draw text
  context.fillStyle = options.color
  context.fillText(text, canvas.width / 2, canvas.height / 2)
  
  // Create texture
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  
  return texture
}

export function NodeSprite({
  text,
  position = [0, 0, 0],
  scale = 1,
  color = '#ffffff',
  fontSize = 48,
  fontFamily = 'Arial, sans-serif',
  backgroundColor = '#000000',
  backgroundOpacity = 0.5,
  padding = 16,
  visible = true,
  opacity = 1
}: NodeSpriteProps) {
  const spriteRef = useRef<THREE.Sprite>(null)
  
  // Create texture
  const texture = useMemo(() => {
    return createTextTexture(text, {
      color,
      fontSize,
      fontFamily,
      backgroundColor,
      backgroundOpacity,
      padding
    })
  }, [text, color, fontSize, fontFamily, backgroundColor, backgroundOpacity, padding])
  
  // Clean up texture on unmount
  useMemo(() => {
    return () => {
      texture.dispose()
    }
  }, [texture])
  
  // Calculate scale - ensure it's a tuple type
  const spriteScale: [number, number, number] = Array.isArray(scale) 
    ? [scale[0], scale[1], scale[2] ?? 1] 
    : [scale, scale, 1]
  
  return (
    <sprite
      ref={spriteRef}
      position={position}
      scale={spriteScale}
      visible={visible}
    >
      <spriteMaterial
        map={texture as any}
        transparent={true}
        opacity={opacity}
        depthWrite={false}
        depthTest={true}
      />
    </sprite>
  )
}