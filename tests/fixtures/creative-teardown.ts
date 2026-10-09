export default async function teardown() {
  await fetch('http://127.0.0.1:5187/playtest/__wp02-creative-close', { method: 'POST' }).catch(() => {});
}
