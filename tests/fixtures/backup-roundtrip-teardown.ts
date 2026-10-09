export default async function teardown() { await fetch('http://127.0.0.1:5181/playtest/__wp04-backup-close', { method: 'POST' }); }
