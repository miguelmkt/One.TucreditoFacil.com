const fs = require('fs');
const path = require('path');

function findSitemaps() {
  const results = [];
  const walkDirs = ['public', 'dist'];
  walkDirs.forEach(base => {
    const dir = path.join(process.cwd(), base);
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir, { withFileTypes: true });
    files.forEach(f => {
      if (f.isFile() && f.name.startsWith('sitemap') && f.name.endsWith('.xml')) {
        results.push(path.join(dir, f.name));
      }
      if (f.isDirectory()) {
        const sub = path.join(dir, f.name);
        const subFiles = fs.readdirSync(sub, { withFileTypes: true });
        subFiles.forEach(sf => {
          if (sf.isFile() && sf.name.startsWith('sitemap') && sf.name.endsWith('.xml')) results.push(path.join(sub, sf.name));
        });
      }
    });
  });
  return results;
}

function stripTags(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const out = content
      .replace(/<lastmod>[\s\S]*?<\/lastmod>\s*/g, '')
      .replace(/<changefreq>[\s\S]*?<\/changefreq>\s*/g, '')
      .replace(/<priority>[\s\S]*?<\/priority>\s*/g, '');

    if (out !== content) {
      fs.writeFileSync(filePath, out, 'utf8');
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error processing', filePath, e.message);
    return false;
  }
}

function main() {
  const sitemaps = findSitemaps();
  if (sitemaps.length === 0) {
    console.log('No sitemap files found.');
    return;
  }

  let total = 0;
  sitemaps.forEach(s => {
    const changed = stripTags(s);
    console.log(s, 'changed:', changed);
    if (changed) total++;
  });

  console.log('Sitemaps processed:', sitemaps.length, 'files modified:', total);
}

main();
