import fs from 'fs/promises'
import path from 'path'

async function cleanup(dir: string): Promise<void> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.name.includes('\n')) {
        console.log(`Deleting: ${fullPath}`)
        await fs.rm(fullPath, { recursive: true, force: true })
      } else if (entry.isDirectory()) {
        await cleanup(fullPath)
      }
    }
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      console.error(`Error processing ${dir}:`, error)
    }
  }
}

const targetDir = path.resolve(process.cwd(), 'components')

console.log(`Starting cleanup in: ${targetDir}`)
cleanup(targetDir)
  .then(() => console.log('Cleanup complete.'))
  .catch((err) => console.error('Cleanup failed:', err))
