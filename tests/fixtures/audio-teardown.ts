export default async function teardown() {
  try { await fetch('http://127.0.0.1:5184/playtest/__wp02-audio-close', { method: 'POST' }); } catch { /* Already stopped. */ }
}
