export default async function teardown() {
  await fetch('http://127.0.0.1:5182/playtest/__wp04-state-close', { method: 'POST' }).catch(() => {});
}
