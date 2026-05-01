const fs = require('fs');
const path = require('path');

function checkDist() {
  const distPath = path.resolve(__dirname, '..', 'dist');
  if (!fs.existsSync(distPath)) {
    console.error('dist/ not found — build may have failed');
    process.exit(2);
  }

  const index = path.join(distPath, 'index.html');
  if (!fs.existsSync(index)) {
    console.error('index.html missing in dist/');
    process.exit(2);
  }

  console.log('dist/ exists and contains index.html — smoke check passed');
}

try {
  checkDist();
  process.exit(0);
} catch (err) {
  console.error('Smoke check failed', err);
  process.exit(2);
}
