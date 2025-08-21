#!/usr/bin/env node
import fs from 'node:fs'

const a = JSON.parse(
  fs.readFileSync('.clmem/artifacts/w02/acceptance/brain-acceptance.json', 'utf8')
)

const ok =
  a.meshLoaded &&
  a.interactionsBound &&
  a.particles === 500 &&
  a.vertexCount >= 35000 &&
  a.vertexCount <= 50000 &&
  a.firstFrameMs <= 2000

console.log(JSON.stringify({ acceptancePassed: !!ok, metrics: a }, null, 2))