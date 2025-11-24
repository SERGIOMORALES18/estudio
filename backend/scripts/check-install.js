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
    // Avoid executing the internal npm.cmd path directly on Windows because
    // spawning the .cmd file by absolute path can fail with EINVAL in some
    // environments. Return the plain 'npm' command and let the OS resolve
    // it (npm -> npm.cmd) via the PATH, which is more robust.
  } catch (e) {
    // ignore
  }
  return 'npm';
}

if (!fs.existsSync(nodeModules)) {
  console.log('node_modules not found. Running npm install in', root);
  // If the parent npm provided an execpath, run npm via the current node
  // executable and the npm CLI script. This is reliable even when 'npm'
  // is not present in PATH for child processes.
  let res;
  if (process.env.npm_execpath) {
    const npmCli = process.env.npm_execpath;
    res = spawnSync(process.execPath, [npmCli, 'install'], { cwd: root, stdio: 'inherit' });
  } else {
    const npmCmd = findNpmCommand();
    res = spawnSync(npmCmd, ['install'], { cwd: root, stdio: 'inherit' });
  }
  if (res.error) {
    console.error('npm install failed:', res.error);
    process.exit(1);
  }
} else {
  // quick message to confirm setup
  console.log('Dependencies already installed.');
}
