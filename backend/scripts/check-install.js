const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// This script checks if node_modules exists in the backend root and runs `npm install` if missing.
// Usage: node scripts/check-install.js (called from package.json script)

const root = path.resolve(__dirname, '..');
const nodeModules = path.join(root, 'node_modules');

function findNpmCommand() {
  // Prefer npm next to the running node executable (works when Node is installed but PATH not updated)
  try {
    const nodeDir = path.dirname(process.execPath);
    if (process.platform === 'win32') {
      const candidate = path.join(nodeDir, 'npm.cmd');
      if (fs.existsSync(candidate)) return candidate;
    }
  } catch (e) {
    // ignore
  }
  // Fallback to plain 'npm' (will fail if not in PATH)
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

if (!fs.existsSync(nodeModules)) {
  console.log('node_modules not found. Running npm install in', root);
  const npmCmd = findNpmCommand();
  const res = spawnSync(npmCmd, ['install'], { cwd: root, stdio: 'inherit' });
  if (res.error) {
    console.error('npm install failed:', res.error);
    process.exit(1);
  }
} else {
  // quick message to confirm setup
  console.log('Dependencies already installed.');
}
