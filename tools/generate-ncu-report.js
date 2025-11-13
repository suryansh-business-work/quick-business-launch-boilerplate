#!/usr/bin/env node
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS = ['.', 'astro-website', 'react-app', 'node-api'];
const OUT_FILE = path.join(__dirname, 'ncu-report.json');

function runForProject(p) {
  return new Promise((resolve) => {
    const cwd = path.join(ROOT, p);
    // Run npx with the latest npm-check-updates and output jsonUpgraded
    const cmd = 'npx npm-check-updates@latest --jsonUpgraded --packageFile package.json';
    exec(cmd, { cwd, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        // If ncu exits with code >0 it may still output useful JSON; try parse stdout
        if (!stdout || stdout.trim() === '') {
          return resolve({ project: p, error: stderr || err.message, upgrades: {} });
        }
      }

      try {
        const data = stdout && stdout.trim() ? JSON.parse(stdout) : {};
        resolve({ project: p, upgrades: data });
      } catch (e) {
        resolve({ project: p, error: 'Failed to parse ncu output', raw: stdout });
      }
    });
  });
}

async function main() {
  const results = {};
  for (const p of PROJECTS) {
    // Only run if package.json exists
    const pkgPath = path.join(ROOT, p, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      results[p] = { error: 'package.json not found' };
      continue;
    }
    process.stdout.write(`Checking ${p}... `);
    /* eslint-disable no-await-in-loop */
    const res = await runForProject(p);
    results[p] = res.error ? { error: res.error, raw: res.raw } : { upgrades: res.upgrades };
    console.log('done');
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify({ generated: new Date().toISOString(), results }, null, 2));
  console.log(`Wrote report to ${OUT_FILE}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
