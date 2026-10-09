export default async function teardown() {
  await fetch('http://127.0.0.1:5185/playtest/__wp05-hall-close', { method: 'POST' }).catch(() => {});
}
