export default async function teardown() {
  await fetch('http://127.0.0.1:5179/playtest/__wp04-close-fixture', { method: 'POST' });
}
