export default async function teardown() {
  await fetch('http://127.0.0.1:5186/playtest/__wp04-adult-close', { method: 'POST' }).catch(() => {});
}
