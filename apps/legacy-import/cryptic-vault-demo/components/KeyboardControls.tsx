'use client'

import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function KeyboardControls() {
  const { camera } = useThree()
  const keys = useRef<Set<string>>(new Set())
  const velocity = useRef(new THREE.Vector3())

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase())

      // Special actions
      if (e.key === ' ') {
        e.preventDefault()
        // Auto-zoom to brain view
        animateCameraTo(new THREE.Vector3(0, 0, 3500))
      } else if (e.key.toLowerCase() === 'r') {
        // Reset camera
        animateCameraTo(new THREE.Vector3(0, 0, 100))
      } else if (e.key.toLowerCase() === 'h') {
        // Hippocampus easter egg (to be implemented)
        console.log('Hippocampus easter egg!')
      } else if (e.key === 'Escape') {
        // Clear highlights
        window.dispatchEvent(new CustomEvent('clearHighlights'))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.key.toLowerCase())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [camera])

  const animateCameraTo = (target: THREE.Vector3) => {
    const startPos = camera.position.clone()
    const startTime = Date.now()
    const duration = 1000

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic

      camera.position.lerpVectors(startPos, target, eased)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  useFrame((_, delta) => {
    if (!camera) return

    // Reset velocity
    velocity.current.set(0, 0, 0)

    // WASD / Arrow key movement
    const moveSpeed = 50 * delta

    if (keys.current.has('w') || keys.current.has('arrowup')) {
      velocity.current.y += moveSpeed
    }
    if (keys.current.has('s') || keys.current.has('arrowdown')) {
      velocity.current.y -= moveSpeed
    }
    if (keys.current.has('a') || keys.current.has('arrowleft')) {
      velocity.current.x -= moveSpeed
    }
    if (keys.current.has('d') || keys.current.has('arrowright')) {
      velocity.current.x += moveSpeed
    }

    // Q/E for zoom
    const zoomSpeed = 100 * delta
    if (keys.current.has('q')) {
      velocity.current.z += zoomSpeed
    }
    if (keys.current.has('e')) {
      velocity.current.z -= zoomSpeed
    }

    // Apply velocity
    camera.position.add(velocity.current)

    // Enforce camera bounds
    camera.position.z = Math.max(10, Math.min(5000, camera.position.z))
  })

  return null
}
