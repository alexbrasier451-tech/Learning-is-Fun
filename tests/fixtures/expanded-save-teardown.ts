export default async function teardown() {
  await fetch('http://127.0.0.1:5247/playtest/__expanded-close', { method: 'POST' }).catch(() => {});
}
