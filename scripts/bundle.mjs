import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function bundle() {
  const distDir = path.join(root, 'dist');
  const websiteDist = path.join(root, 'apps/website/dist');
  const adminDist = path.join(root, 'apps/admin/dist');

  console.log('🚀 Starting bundle process...');

  // 1. Clean root dist
  await fs.emptyDir(distDir);
  console.log('✅ Cleaned dist/ directory');

  // 2. Copy website dist to root dist
  if (await fs.pathExists(websiteDist)) {
    await fs.copy(websiteDist, distDir);
    console.log('✅ Copied website to dist/');
  } else {
    console.error('❌ Website dist not found! Run npm run build:website first.');
    process.exit(1);
  }

  // 3. Copy admin dist to root dist/admin
  const adminDest = path.join(distDir, 'admin');
  if (await fs.pathExists(adminDist)) {
    await fs.copy(adminDist, adminDest);
    console.log('✅ Copied admin to dist/admin/');
  } else {
    console.error('❌ Admin dist not found! Run npm run build:admin first.');
    process.exit(1);
  }

  console.log('🎉 Bundle complete! Ready for deployment.');
}

bundle().catch(err => {
  console.error('❌ Bundle failed:', err);
  process.exit(1);
});
