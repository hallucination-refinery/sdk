'use client'

import { useEffect } from 'react'
import { getFormationId, labels } from './labelMap'

export default function Draw3DPage() {
  useEffect(() => {
    console.log('sample labels', labels.slice(0, 3))
    console.log('frontal lobe ->', getFormationId('frontal lobe'))
    console.log('unknown ->', getFormationId('not-a-real-label'))
  }, [])

  return <main />
}
