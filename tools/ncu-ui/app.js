async function fetchReport() {
  const res = await fetch('/report.json');
  return res.json();
}

function render(report) {
  const meta = document.getElementById('meta');
  const content = document.getElementById('content');
  meta.innerHTML = `<div>Generated: ${report.generated || 'n/a'}</div>`;
  content.innerHTML = '';
  const results = report.results || {};
  const keys = Object.keys(results);
  if (!keys.length) {
    content.innerHTML = '<div class="empty">No report data found. Run the report generator.</div>';
    return;
  }
  for (const k of keys) {
    const entry = results[k];
    const section = document.createElement('div');
    section.className = 'project';
    const h = document.createElement('h3');
    h.textContent = k;
    section.appendChild(h);

    if (entry.error) {
      const e = document.createElement('div');
      e.className = 'empty';
      e.textContent = `Error: ${entry.error}`;
      section.appendChild(e);
      content.appendChild(section);
      continue;
    }

    const upgrades = entry.upgrades || {};
    const pkgs = Object.keys(upgrades);
    if (!pkgs.length) {
      const e = document.createElement('div');
      e.className = 'empty';
      e.textContent = 'No upgrades found';
      section.appendChild(e);
      content.appendChild(section);
      continue;
    }

    for (const pkg of pkgs) {
      const row = document.createElement('div');
      row.className = 'pkg';
      const left = document.createElement('strong');
      left.textContent = pkg;
      const val = document.createElement('span');
      val.innerHTML = `<span class="upgraded">${upgrades[pkg]}</span>`;
      row.appendChild(left);
      row.appendChild(val);
      section.appendChild(row);
    }

    content.appendChild(section);
  }
}

document.getElementById('refresh').addEventListener('click', async () => {
  // run server-side regeneration is not implemented here; instruct user
  alert('Run `npm run ncu:report` in the repo root to regenerate, then refresh this page.');
});

fetchReport().then(render).catch((e) => {
  document.getElementById('content').innerHTML = `<div class="empty">Failed to load report: ${e.message}</div>`;
});
