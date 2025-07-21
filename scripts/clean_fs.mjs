import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function cleanup(dir: string): Promise<void> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.name.includes('\n')) {
        console.log(`Deleting: ${fullPath}`);
        await fs.rm(fullPath, { recursive: true, force: true });
      } else if (entry.isDirectory()) {
        await cleanup(fullPath);
      }
    }
  } catch (error) {
    // Ignore errors for directories that might have been deleted as part of a parent
    if (error.code !== 'ENOENT') {
      console.error(`Error processing ${dir}:`, error);
    }
  }
}

const projectRoot = path.resolve(__dirname, '..');
const targetDir = path.join(projectRoot, 'components');

console.log(`Starting cleanup in: ${targetDir}`);
cleanup(targetDir)
  .then(() => console.log('Cleanup complete.'))
  .catch(err => console.error('Cleanup failed:', err));
 