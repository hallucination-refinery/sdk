'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export type EdgeEnd = { pos: THREE.Vector3; color?: string }

type EdgeLinesProps = {
  start: THREE.Vector3 | null
  ends: EdgeEnd[]
  normal: THREE.Vector3 | null
  maxK?: number
  ttlMs?: number
  thickness?: number
  reducedMotion?: boolean
}

type PoolItem = {
  mesh: THREE.Mesh
  expiresAt: number
  inUse: boolean
}

export default function EdgeLines({
  start,
  ends,
  normal,
  maxK = 6,
  ttlMs = 1500,
  thickness = 0.5,
  reducedMotion = false,
}: EdgeLinesProps) {
  const groupRef = useRef<THREE.Group>(null)
  const pool = useRef<PoolItem[]>([])

  // Initialize a small pool of tube meshes
  useMemo(() => {
    const items: PoolItem[] = []
    for (let i = 0; i < maxK; i++) {
      const geom = new THREE.TubeGeometry(
        new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3()),
        2,
        thickness,
        8,
        false
      )
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        depthTest: true,
        depthWrite: false,
      })
      const mesh = new THREE.Mesh(geom, mat)
      mesh.visible = false
      items.push({ mesh, expiresAt: 0, inUse: false })
    }
    pool.current = items
  }, [maxK, thickness])

  // Attach pool meshes to group on first render
  useEffect(() => {
    const g = groupRef.current
    if (!g || g.children.length > 0) return
    for (const item of pool.current) g.add(item.mesh)
  }, [])

  // Helper to (re)build a tube geometry for a curve
  function buildCurveGeometry(points: THREE.Vector3[], radius: number): THREE.TubeGeometry {
    const curve = new THREE.CatmullRomCurve3(points)
    const geom = new THREE.TubeGeometry(curve, 32, radius, 8, false)
    return geom
  }

  // Update edges when inputs change
  useEffect(() => {
    const g = groupRef.current
    if (!g || !start || !normal) return
    // Mark all as free; they will fade out if not reused
    const now = performance.now()
    for (const item of pool.current) item.inUse = false

    const P = start.clone()
    const dir = normal.clone().normalize()
    const K = Math.min(maxK, ends.length)

    for (let i = 0; i < K; i++) {
      const target = ends[i]
      const Q = target.pos.clone()
      const M = P.clone().add(Q).multiplyScalar(0.5)
      const d = P.distanceTo(Q)
      const off = Math.max(4, d * 0.18)
      const c1 = P.clone().lerp(M, 0.35).add(dir.clone().multiplyScalar(off))
      const c2 = M.clone().lerp(Q, 0.35).add(dir.clone().multiplyScalar(-off))
      const pts = [P, c1, c2, Q]

      const item = pool.current[i]
      const mat = item.mesh.material as THREE.MeshBasicMaterial
      const newGeom = buildCurveGeometry(pts, thickness)
      item.mesh.geometry.dispose()
      item.mesh.geometry = newGeom
      mat.color.set(target.color || '#9bb7ff')
      mat.opacity = reducedMotion ? 1 : 0
      item.mesh.visible = true
      item.inUse = true
      item.expiresAt = now + ttlMs
    }

    // Any remaining items not in use: begin fade out
    for (let i = K; i < pool.current.length; i++) {
      const item = pool.current[i]
      if (!item.mesh.visible) continue
      item.inUse = false
      item.expiresAt = now + 250 // quick fade
    }
  }, [start, ends, normal, maxK, ttlMs, thickness, reducedMotion])

  // Animate opacity and lifetime
  useFrame(() => {
    const now = performance.now()
    for (const item of pool.current) {
      const mat = item.mesh.material as THREE.MeshBasicMaterial
      if (!item.mesh.visible) continue
      const tRemain = item.expiresAt - now
      if (tRemain <= 0) {
        mat.opacity = 0
        item.mesh.visible = false
        continue
      }
      if (reducedMotion) {
        // Hold fully opaque until fade window (last 250ms)
        const fadeMs = 250
        mat.opacity = tRemain < fadeMs ? Math.max(0, tRemain / fadeMs) : 1
      } else {
        // Ease-in first 200ms, ease-out last 250ms
        const lifeTotal = ttlMs
        const sinceStart = lifeTotal - tRemain
        const fadeOutMs = 250
        const fadeInMs = 200
        let a = 1
        if (sinceStart < fadeInMs) a = sinceStart / fadeInMs
        if (tRemain < fadeOutMs) a = Math.min(a, Math.max(0, tRemain / fadeOutMs))
        mat.opacity = a
      }
    }
  })

  // Cleanup
  useEffect(() => {
    return () => {
      for (const item of pool.current) {
        item.mesh.geometry.dispose()
        ;(item.mesh.material as THREE.Material).dispose()
      }
    }
  }, [])

  return <group ref={groupRef} />
}
