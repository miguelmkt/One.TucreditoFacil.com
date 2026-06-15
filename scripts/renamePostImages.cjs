#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const postsDir = path.resolve(process.cwd(), 'src/content/posts');

if (!fs.existsSync(postsDir)) {
  console.error('Posts directory not found:', postsDir);
  process.exit(1);
}

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.json'));

const posts = files
  .map((file) => {
    const filePath = path.join(postsDir, file);
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const json = JSON.parse(raw);
      return { file, filePath, json };
    } catch (e) {
      console.error('Skipping', file, 'parse error:', e.message);
      return null;
    }
  })
  .filter(Boolean);

// Only update posts that already have an image (non-empty) and aren't already pointing to /imagens/img-post/
const postsWithImage = posts.filter(
  (p) => typeof p.json.image === 'string' && p.json.image.trim() !== '' && !p.json.image.includes('/imagens/img-post/'),
);

if (postsWithImage.length === 0) {
  console.log('Nenhum post com imagem encontrado para atualizar.');
  process.exit(0);
}

// Sort by date if available, oldest first, fallback to filename
postsWithImage.sort((a, b) => {
  const ad = a.json.date ? new Date(a.json.date).getTime() : 0;
  const bd = b.json.date ? new Date(b.json.date).getTime() : 0;
  if (ad && bd) return ad - bd;
  if (ad) return -1;
  if (bd) return 1;
  return a.file.localeCompare(b.file);
});

let counter = 1;
const updated = [];
for (const p of postsWithImage) {
  const newImage = `/imagens/img-post/${counter}.png`;
  p.json.image = newImage;
  fs.writeFileSync(p.filePath, JSON.stringify(p.json, null, 2) + '\n', 'utf8');
  updated.push({ file: p.file, image: newImage });
  counter++;
}

console.log(`Atualizados ${updated.length} posts:`);
for (const u of updated) console.log(' -', u.file, '->', u.image);
console.log('Concluído.');
