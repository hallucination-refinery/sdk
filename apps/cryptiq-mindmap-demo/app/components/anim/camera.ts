import * as THREE from 'three'

const FIT_EPSILON = 1e-6

function isVector3(value: unknown): value is THREE.Vector3 {
  return Boolean(value) && typeof value === 'object' && (value as THREE.Vector3).isVector3 === true
}

export type TweenCameraParams = {
  camera: THREE.PerspectiveCamera
  to: { position: [number, number, number]; lookAt: [number, number, number] }
  durationMs?: number
  easing?: (t: number) => number
  cancelRef?: { current: boolean }
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Computes the perspective camera distance required to contain a bounding sphere.
 *
 * Trig derivation:
 *   At distance `d`, the half-viewport height is `d * tan(fov / 2)`.
 *   To fit a sphere of radius `r`, ensure `r <= d * tan(fov / 2)` → `d >= r / tan(fov / 2)`.
 *   Horizontal fit uses `tan(fov / 2) * aspect`, so take the tighter (max) constraint.
 */
export type FitPerspective = (
  fovDeg: number,
  radius: number,
  aspect: number,
  margin?: number
) => number

export const fitPerspective: FitPerspective = (
  fovDeg,
  radius,
  aspect,
  margin = 1.1,
) => {
  const safeFovDeg = Math.min(179.999, Math.max(1e-3, fovDeg))
  const safeAspect = Math.max(FIT_EPSILON, aspect)
  const safeMargin = Math.max(0, margin)
  const paddedRadius = Math.max(0, radius) * safeMargin
  if (paddedRadius === 0) return 0

  const halfFovRad = THREE.MathUtils.degToRad(safeFovDeg) * 0.5
  const tanHalfVertical = Math.tan(halfFovRad)
  const tanHalfHorizontal = tanHalfVertical * safeAspect
  const verticalDistance = tanHalfVertical > FIT_EPSILON ? paddedRadius / tanHalfVertical : Infinity
  const horizontalDistance = tanHalfHorizontal > FIT_EPSILON ? paddedRadius / tanHalfHorizontal : Infinity
  const distance = Math.max(verticalDistance, horizontalDistance)

  if (process.env.NODE_ENV !== 'production') {
    if (!Number.isFinite(distance)) {
      console.warn('[camera] fitPerspective produced invalid distance', {
        fovDeg,
        radius,
        aspect,
        margin,
        distance,
      })
    } else if (fovDeg !== safeFovDeg || aspect !== safeAspect || margin !== safeMargin) {
      console.warn('[camera] fitPerspective clamped inputs', {
        fovDeg,
        safeFovDeg,
        aspect,
        safeAspect,
        margin,
        safeMargin,
      })
    }
  }

  return distance
}

/**
 * Applies {@link fitPerspective} to a Three.js perspective camera, moving it along its
 * current view ray so the given bounding radius fits inside the frustum.
 */
export function applyPerspectiveFit(
  camera: THREE.PerspectiveCamera,
  radius: number,
  margin = 1.1
) {
  const distance = fitPerspective(camera.fov, radius, camera.aspect, margin)
  if (distance <= 0) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[camera] applyPerspectiveFit skipped due to non-positive distance', {
        distance,
        radius,
        margin,
      })
    }
    return distance
  }

  const data = camera.userData as {
    fitTarget?: THREE.Vector3
    target?: THREE.Vector3
    fitDistance?: number
  }

  let target: THREE.Vector3
  if (isVector3(data?.fitTarget)) target = data.fitTarget.clone()
  else if (isVector3(data?.target)) target = data.target.clone()
  else target = new THREE.Vector3()

  const direction = target.clone().sub(camera.position)
  if (direction.lengthSq() < FIT_EPSILON) {
    camera.getWorldDirection(direction)
    if (direction.lengthSq() < FIT_EPSILON) direction.set(0, 0, -1)
    target = camera.position.clone().add(direction)
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[camera] applyPerspectiveFit using fallback target at look direction')
    }
  } else {
    direction.normalize()
  }

  const offset = direction.clone().multiplyScalar(distance)
  const newPosition = target.clone().sub(offset)
  camera.position.copy(newPosition)
  camera.lookAt(target)
  camera.updateProjectionMatrix()

  data.fitTarget = target.clone()
  data.fitDistance = distance

  return distance
}

/**
 * Computes a normalization scale for depth buffers based on a bounding sphere radius.
 *
 * Values smaller than one retain their proportional scale, while larger radii are
 * clamped to avoid excessively small depth precision values.
 */
export type DepthNormScaleFromRadius = (radius: number) => number

export const depthNormScaleFromRadius: DepthNormScaleFromRadius = (radius) => {
  return 1 / Math.max(1, radius)
}

export type TweenCamera = (params: TweenCameraParams) => Promise<void>

export const tweenCamera: TweenCamera = ({
  camera,
  to,
  durationMs = 1000,
  easing = easeInOutCubic,
  cancelRef,
}) => {
  const fromPos = camera.position.clone()
  const fromLook = camera
    .position
    .clone()
    .add(camera.getWorldDirection(new THREE.Vector3()))
  const toPos = new THREE.Vector3(...to.position)
  const toLook = new THREE.Vector3(...to.lookAt)

  return new Promise<void>((resolve) => {
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      if (cancelRef?.current) {
        cancelAnimationFrame(raf)
        resolve()
        return
      }
      const t = Math.min(1, (now - start) / durationMs)
      const k = easing(t)

      const pos = fromPos.clone().lerp(toPos, k)
      const look = fromLook.clone().lerp(toLook, k)

      camera.position.copy(pos)
      camera.lookAt(look.x, look.y, look.z)
      camera.updateProjectionMatrix()

      if (t < 1) {
        raf = requestAnimationFrame(step)
      } else {
        resolve()
      }
    }
    raf = requestAnimationFrame(step)
  })
}

export async function zoomOutAndIn(camera: THREE.PerspectiveCamera, cancelRef?: { current: boolean }) {
  const startPos = camera.position.clone()
  const startLook = startPos.clone().add(camera.getWorldDirection(new THREE.Vector3()))

  // zoom out
  const outPos = startPos.clone().multiplyScalar(2)
  const outLook = startLook.clone().multiplyScalar(2)
  await tweenCamera({
    camera,
    to: { position: [outPos.x, outPos.y, outPos.z], lookAt: [outLook.x, outLook.y, outLook.z] },
    durationMs: 800,
    cancelRef,
  })

  // zoom into stub next node
  await tweenCamera({
    camera,
    to: { position: [1, 0, 2], lookAt: [0, 0, 0] },
    durationMs: 800,
    cancelRef,
  })
}
