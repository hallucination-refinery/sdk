import * as THREE from 'three'

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

export function tweenCamera({
  camera,
  to,
  durationMs = 1000,
  easing = easeInOutCubic,
  cancelRef,
}: TweenCameraParams) {
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
