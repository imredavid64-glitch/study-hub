// Installer checksums endpoint.
// GitHub release-asset downloads do not send CORS headers, so the browser
// cannot fetch the Study-Hub-checksums-*.txt sidecars directly. This endpoint
// reads them server-side (GitHub API -> signed asset URL) and returns the
// parsed { filename: sha256 } map for the latest release. The app's Downloads
// tab uses it to show official checksums and verify downloaded installers.
const RELEASES_URL = 'https://api.github.com/repos/imredavid64-glitch/study-hub-installers/releases/latest';
const { checkRequest } = require('../lib/guard');

module.exports = async function checksumsEndpoint(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Content-Type', 'application/json');
  // Checksums change only when a release is re-published; cache at the edge.
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const denied = await checkRequest(req, { maxPerMinute: 60 });
  if (denied) {
    res.status(403).json({ error: denied });
    return;
  }

  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const rel = await fetch(RELEASES_URL, { headers: { 'User-Agent': 'study-hub', 'Accept': 'application/vnd.github+json' } });
    if (!rel.ok) throw new Error('release fetch HTTP ' + rel.status);
    const release = await rel.json();

    const checksums = {};
    const sidecars = (release.assets || []).filter(a => /^Study-Hub-checksums-.*\.txt$/i.test(a.name || ''));
    await Promise.all(sidecars.map(async a => {
      try {
        const ar = await fetch(
          'https://api.github.com/repos/imredavid64-glitch/study-hub-installers/releases/assets/' + a.id,
          { headers: { 'Accept': 'application/octet-stream', 'User-Agent': 'study-hub' } }
        );
        if (!ar.ok) return;
        const text = await ar.text();
        for (const line of text.split('\n')) {
          const m = line.trim().match(/^([0-9a-f]{64})\s+\*?(.+)$/i);
          // sha256sum writes '<hash> *<name>' for binary files — strip the '*'
          // so the key matches the release asset name exactly.
          if (m) checksums[m[2].trim()] = m[1].toLowerCase();
        }
      } catch (e) { /* one sidecar failing must not fail the whole request */ }
    }));

    res.status(200).json({ tag: release.tag_name || null, checksums });
  } catch (e) {
    res.status(502).json({ error: 'Checksums unavailable: ' + (e && e.message ? e.message : e) });
  }
};
