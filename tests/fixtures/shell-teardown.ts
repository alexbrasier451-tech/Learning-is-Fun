export default async function teardown() {
  try {
    await fetch('http://127.0.0.1:5195/playtest/__d3-shell-close', {
      method: 'POST', signal: AbortSignal.timeout(3000),
    });
  } catch { /* Already stopped or Playwright will close its owned server. */ }
}
