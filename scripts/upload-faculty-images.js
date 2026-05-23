const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

cloudinary.config({
  cloud_name: 'dyhhtgodn',
  api_key: process.env.CLOUDINARY_API_KEY_2,
  api_secret: process.env.CLOUDINARY_API_SECRET_2,
});

const REPO_ROOT = path.join(__dirname, '..');
const IMAGES_ROOT = path.join(REPO_ROOT, 'departments', 'images');
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (EXTS.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

function publicIdFor(absPath) {
  const rel = path.relative(REPO_ROOT, absPath);
  const noExt = rel.replace(/\.[^.]+$/, '');
  return noExt.replace(/^departments\/images\//, 'mlrit/faculty/');
}

function uploadOne(filePath, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        resource_type: 'image',
        public_id: publicId,
        overwrite: true,
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { fetch_format: 'auto', quality: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
}

async function main() {
  const files = walk(IMAGES_ROOT);
  console.log(`Found ${files.length} images.\n`);

  const manifest = {};
  let ok = 0, fail = 0;

  for (const abs of files) {
    const rel = path.relative(REPO_ROOT, abs);
    const publicId = publicIdFor(abs);
    try {
      const res = await uploadOne(abs, publicId);
      console.log(`✅ ${publicId} — ${res.secure_url}`);
      manifest[rel] = res.secure_url;
      ok++;
    } catch (err) {
      console.log(`❌ ${rel} — ${err.message}`);
      fail++;
    }
  }

  const manifestPath = path.join(__dirname, 'faculty-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nDone. ${ok} succeeded, ${fail} failed.`);
  console.log(`Manifest: scripts/faculty-manifest.json`);
}

main();
