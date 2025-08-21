#!/usr/bin/env node
import fs from 'node:fs'
const p = process.argv[2]
const text = fs.readFileSync(p, 'utf8')
const count = text.split('\n').filter((l) => l.startsWith('v ')).length
console.log(String(count))