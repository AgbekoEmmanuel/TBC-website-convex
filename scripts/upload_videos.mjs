import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ConvexHttpClient } from "convex/browser";
import https from "https";
import dotenv from "dotenv";

dotenv.config({ path: 'apps/admin/.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const convexUrl = process.env.VITE_CONVEX_URL;
const client = new ConvexHttpClient(convexUrl);

async function uploadFile(filePath) {
  const fileName = path.basename(filePath);
  console.log(`📤 Uploading ${fileName}...`);

  const uploadUrl = await client.mutation("storage:generateUploadUrl", {});
  const url = new URL(uploadUrl);

  return new Promise((resolve, reject) => {
    const stats = fs.statSync(filePath);
    const readStream = fs.createReadStream(filePath);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': stats.size
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', async () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const { storageId } = JSON.parse(data);
          const publicUrl = await client.query("storage:getUrl", { storageId });
          resolve(publicUrl);
        } else {
          reject(new Error(`Status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    readStream.pipe(req);
  });
}

async function main() {
  try {
    const introPath = path.join(root, 'apps/website/src/assets/about/Church New Intro 2026.mp4');
    const storyPath = path.join(root, 'apps/website/src/assets/about/VideoEditor_Poster LED (19).mp4');

    const introUrl = await uploadFile(introPath);
    console.log(`✅ Intro URL: ${introUrl}`);
    
    const storyUrl = await uploadFile(storyPath);
    console.log(`✅ Story URL: ${storyUrl}`);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

main();
