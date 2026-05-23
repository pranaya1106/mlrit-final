const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

cloudinary.config({
  cloud_name: 'dtmde1fyn',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const REPO_ROOT = path.join(__dirname, '..');

const VIDEOS = [
  { file: 'homepage/sports.mp4',      publicId: 'mlrit/videos/sports' },
  { file: 'homepage/av1.mp4',         publicId: 'mlrit/videos/av1' },
  { file: 'homepage/av2.mp4',         publicId: 'mlrit/videos/av2' },
  { file: 'homepage/av3.mp4',         publicId: 'mlrit/videos/av3' },
  { file: 'homepage/inno.mp4',        publicId: 'mlrit/videos/inno' },
  { file: 'assets/events-bg.mp4',     publicId: 'mlrit/videos/events-bg' },
  { file: 'departments/dept.mp4',     publicId: 'mlrit/videos/dept' },
  { file: 'hero2.mp4',                publicId: 'mlrit/videos/hero2' },
  { file: 'placements/place vid.mp4', publicId: 'mlrit/videos/placements' },
];

function uploadLarge(filePath, options) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(filePath, options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

async function main() {
  const manifest = {};

  for (const { file, publicId } of VIDEOS) {
    const absPath = path.join(REPO_ROOT, file);

    if (!fs.existsSync(absPath)) {
      console.log(`⚠️  ${file} — not found on disk, skipping`);
      continue;
    }

    try {
      const result = await uploadLarge(absPath, {
        resource_type: 'video',
        public_id: publicId,
        chunk_size: 6000000,
        overwrite: true,
      });
      console.log(`✅ ${publicId} — ${result.secure_url}`);
      manifest[file] = result.secure_url;
    } catch (err) {
      console.log(`❌ ${file} — ${err.message}`);
    }
  }

  const manifestPath = path.join(__dirname, 'video-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written to scripts/video-manifest.json`);
}

main();
