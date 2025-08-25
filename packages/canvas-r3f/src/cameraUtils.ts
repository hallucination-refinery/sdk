import * as THREE from 'three'

/**
 * Calculates world units per pixel for stable sizing across zoom levels
 * Used to maintain consistent visual size of particles/spheres during camera movements
 */
export function worldUnitsPerPixel(
  camera: THREE.Camera,
  targetDepth: number = 50,
  screenHeight: number = window.innerHeight
): number {
  if (camera instanceof THREE.PerspectiveCamera) {
    const fovRadians = (camera.fov * Math.PI) / 180
    const height = 2 * targetDepth * Math.tan(fovRadians / 2)
    return height / screenHeight
  } else if (camera instanceof THREE.OrthographicCamera) {
    return (camera.top - camera.bottom) / screenHeight
  }
  
  // Fallback for unknown camera types
  return 1
}

/**
 * Calculate target world radius for a given pixel size at target depth
 * Ensures particles maintain consistent visual size across zoom levels
 */
export function worldRadiusForPixelSize(
  camera: THREE.Camera,
  targetPixelSize: number,
  targetDepth: number = 50
): number {
  const unitsPerPixel = worldUnitsPerPixel(camera, targetDepth)
  return unitsPerPixel * targetPixelSize * 0.5
}

/**
 * Clamp scale values to prevent dramatic size changes on small zoom perturbations
 * Used to implement size stability requirement (variance < ±10%)
 */
export function clampInstanceScale(
  currentScale: number,
  baseScale: number,
  maxVariance: number = 0.1
): number {
  const minScale = baseScale * (1 - maxVariance)
  const maxScale = baseScale * (1 + maxVariance)
  return Math.max(minScale, Math.min(maxScale, currentScale))
}