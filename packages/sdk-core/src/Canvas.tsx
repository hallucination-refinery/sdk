import { ReactNode } from 'react'
import { Canvas as ThreeCanvas } from '@react-three/fiber'
import { useCanvas } from './CanvasProvider'

export interface CanvasProps {
  children: ReactNode
  width?: number | string
  height?: number | string
  className?: string
  camera?: any
  gl?: any
  style?: React.CSSProperties
}

/**
 * Canvas component that integrates with CanvasProvider state
 * Allows custom content while maintaining sdk-core state management
 */
export function Canvas({
  children,
  width = '100%',
  height = '100vh',
  className,
  camera,
  gl,
  style,
  ...props
}: CanvasProps) {
  const { state } = useCanvas()

  return (
    <div className={className} style={{ width, height }}>
      <ThreeCanvas
        camera={camera}
        gl={gl}
        style={{
          background: state.theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
          ...style
        }}
        {...props}
      >
        {children}
      </ThreeCanvas>
    </div>
  )
}