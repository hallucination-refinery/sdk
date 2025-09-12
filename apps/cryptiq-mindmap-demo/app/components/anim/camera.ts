'use client'

import type { PerspectiveCamera } from 'three'

export function tweenCamera(
  camera: PerspectiveCamera,
  position: [number, number, number] = [0, 0, 5],
  lookAt: [number, number, number] = [0, 0, 0]
) {
  camera.position.set(...position)
  camera.lookAt(...lookAt)
}
