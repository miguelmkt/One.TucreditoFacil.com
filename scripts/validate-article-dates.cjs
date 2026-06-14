const fs = require('fs');
const path = require('path');

const start = new Date(2026, 2, 12);
const end = new Date(2026, 5, 14);

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(name => {
    const filePath = path.join(dir, name);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) results = results.concat(walk(filePath));
    else if (name.endsWith('.json')) results.push(filePath);
  });
  return results;
}

const roots = ['src/content/posts', 'src/content/p1', 'content/posts', 'content/p1', 'src/content'];
const all = new Set();
roots.forEach(r => {
  const dir = path.join(process.cwd(), r);
  walk(dir).forEach(f => all.add(f));
});

let total = 0;
let missing = 0;
let outOfRange = 0;
const samples = [];

for (const file of Array.from(all)) {
  total++;
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(raw);
    const dateProps = ['date', 'publishedAt', 'published_at', 'createdAt', 'created_at'];
    const prop = dateProps.find(p => Object.prototype.hasOwnProperty.call(parsed, p));
    if (!prop) {
      missing++;
      samples.push({file, issue: 'missing-date'});
      continue;
    }
    const d = new Date(parsed[prop]);
    if (isNaN(d.getTime())) {
      outOfRange++;
      samples.push({file, issue: 'invalid-date', value: parsed[prop]});
      continue;
    }
    if (d < start || d > end) {
      outOfRange++;
      samples.push({file, issue: 'out-of-range', value: parsed[prop]});
    }
  } catch (err) {
    samples.push({file, issue: 'error', error: err.message});
  }
}

console.log('Total files scanned:', total);
console.log('Missing date fields:', missing);
console.log('Invalid/out-of-range dates:', outOfRange);
if (samples.length) {
  console.log('\nExamples:');
  samples.slice(0, 20).forEach(s => console.log(JSON.stringify(s)));
}
