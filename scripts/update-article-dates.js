const fs = require('fs');
const path = require('path');

const start = new Date(2026, 2, 12); // 12 Mar 2026 (month is 0-based)
const end = new Date(2026, 5, 14);   // 14 Jun 2026

function randomDate(start, end) {
  const diff = end.getTime() - start.getTime();
  const offset = Math.floor(Math.random() * (diff + 1));
  return new Date(start.getTime() + offset);
}

function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function updateFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error('Skip (invalid JSON):', filePath);
      return false;
    }

    const dateProps = ['date', 'publishedAt', 'published_at', 'createdAt', 'created_at'];
    const prop = dateProps.find(p => Object.prototype.hasOwnProperty.call(parsed, p));
    const newDate = formatDate(randomDate(start, end));
    if (prop) parsed[prop] = newDate;
    else parsed['date'] = newDate;

    fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2) + '\n', 'utf8');
    console.log('Updated:', filePath, '->', newDate);
    return true;
  } catch (err) {
    console.error('Error:', filePath, err.message);
    return false;
  }
}

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(name => {
    const filePath = path.join(dir, name);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (name.endsWith('.json')) {
      results.push(filePath);
    }
  });
  return results;
}

const roots = ['src/content/posts', 'src/content/p1', 'content/posts', 'content/p1', 'src/content'];
let updated = 0;
let touched = [];
roots.forEach(r => {
  const dir = path.join(process.cwd(), r);
  const files = walk(dir);
  files.forEach(f => {
    if (updateFile(f)) {
      updated++;
      touched.push(f);
    }
  });
});

console.log('\nDone. Files updated:', updated);
if (touched.length) console.log(touched.join('\n'));
