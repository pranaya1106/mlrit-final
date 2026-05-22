const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

cloudinary.config({
  cloud_name: 'dtmde1fyn',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const REPO_ROOT = path.join(__dirname, '..');

// kind: 'svg' | 'placement' | 'image'
const TARGETS = [
  // NIRF logos (SVG)
  { file: 'nirf/aicte.svg',         publicId: 'mlrit/nirf/aicte',        kind: 'svg' },
  { file: 'nirf/arha.svg',          publicId: 'mlrit/nirf/arha',         kind: 'svg' },
  { file: 'nirf/dataquest.svg',     publicId: 'mlrit/nirf/dataquest',    kind: 'svg' },
  { file: 'nirf/gte.svg',           publicId: 'mlrit/nirf/gte',          kind: 'svg' },
  { file: 'nirf/gyaanvigyan.svg',   publicId: 'mlrit/nirf/gyaanvigyan',  kind: 'svg' },
  { file: 'nirf/naac.svg',          publicId: 'mlrit/nirf/naac',         kind: 'svg' },
  { file: 'nirf/nba.svg',           publicId: 'mlrit/nirf/nba',          kind: 'svg' },
  { file: 'nirf/the week.svg',      publicId: 'mlrit/nirf/the-week',     kind: 'svg' },

  // Placement logos (jpg/png) — capped to 320 wide
  { file: 'placements/p1.jpg',  publicId: 'mlrit/placements/p1',  kind: 'placement' },
  { file: 'placements/p2.jpg',  publicId: 'mlrit/placements/p2',  kind: 'placement' },
  { file: 'placements/p3.jpg',  publicId: 'mlrit/placements/p3',  kind: 'placement' },
  { file: 'placements/p4.jpg',  publicId: 'mlrit/placements/p4',  kind: 'placement' },
  { file: 'placements/p5.jpg',  publicId: 'mlrit/placements/p5',  kind: 'placement' },
  { file: 'placements/p6.jpg',  publicId: 'mlrit/placements/p6',  kind: 'placement' },
  { file: 'placements/p7.png',  publicId: 'mlrit/placements/p7',  kind: 'placement' },
  { file: 'placements/p8.png',  publicId: 'mlrit/placements/p8',  kind: 'placement' },
  { file: 'placements/p9.png',  publicId: 'mlrit/placements/p9',  kind: 'placement' },
  { file: 'placements/p10.png', publicId: 'mlrit/placements/p10', kind: 'placement' },
  { file: 'placements/p11.png', publicId: 'mlrit/placements/p11', kind: 'placement' },
  { file: 'placements/p12.png', publicId: 'mlrit/placements/p12', kind: 'placement' },
  { file: 'placements/p13.png', publicId: 'mlrit/placements/p13', kind: 'placement' },
  { file: 'placements/p14.png', publicId: 'mlrit/placements/p14', kind: 'placement' },
  { file: 'placements/p15.png', publicId: 'mlrit/placements/p15', kind: 'placement' },
  { file: 'placements/p16.png', publicId: 'mlrit/placements/p16', kind: 'placement' },

  // Other
  { file: 'departments/images/freshman/radhika-devi.jpg', publicId: 'mlrit/faculty/freshman/radhika-devi', kind: 'image' },
  { file: 'homepage/research/images/research-portfolio.png', publicId: 'mlrit/static/research-portfolio', kind: 'image' },
];

function optsFor(kind, publicId) {
  const base = { resource_type: 'image', public_id: publicId, overwrite: true };
  if (kind === 'svg') return base;
  if (kind === 'placement') {
    return {
      ...base,
      transformation: [
        { width: 320, crop: 'limit' },
        { fetch_format: 'auto', quality: 'auto' },
      ],
    };
  }
  return {
    ...base,
    transformation: [{ fetch_format: 'auto', quality: 'auto' }],
  };
}

function uploadOne(filePath, options) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, options, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

function optimizeUrl(url, kind) {
  // strip /v\d+/ segment and (for non-SVG) inject f_auto,q_auto
  const m = url.match(/(.+\/image\/upload\/)v\d+\/(.+)$/);
  if (!m) return url;
  if (kind === 'svg') {
    return `${m[1]}${m[2]}`;
  }
  return `${m[1]}f_auto,q_auto/${m[2]}`;
}

async function main() {
  const manifest = {};
  let ok = 0, fail = 0;

  for (const { file, publicId, kind } of TARGETS) {
    const abs = path.join(REPO_ROOT, file);
    if (!fs.existsSync(abs)) {
      console.log(`⚠️  ${file} — not found, skipping`);
      continue;
    }
    try {
      const res = await uploadOne(abs, optsFor(kind, publicId));
      const url = optimizeUrl(res.secure_url, kind);
      manifest[file] = url;
      console.log(`✅ ${publicId} — ${url}`);
      ok++;
    } catch (err) {
      console.log(`❌ ${file} — ${err.message}`);
      fail++;
    }
  }

  const manifestPath = path.join(__dirname, 'static-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n${ok} succeeded, ${fail} failed.`);
  console.log(`Manifest: scripts/static-manifest.json`);
}

main();
