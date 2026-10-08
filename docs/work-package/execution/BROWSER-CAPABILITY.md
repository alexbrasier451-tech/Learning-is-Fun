# Browser capability continuation — 8 October 2026

The final addendum corrects the worker's earlier categorical exclusion of Chrome for Testing: the controller accepts Google's official current Stable Chrome for Testing as a branded Chrome route. That route was investigated below; its Windows launch still failed, and configuration remains unchanged.

Chrome stable D1 and version-matched Playwright Firefox D3 remain unavailable for launch. This bounded continuation established concrete Windows failure evidence and tried two supported recovery paths. Neither browser has an observed running version. Later mandatory published D1/D3 sessions still require action; other engines cannot substitute for them.

## Scope and user context

Controller authorized browser installation/launch recovery only, no product/config changes, delegation, chat messages or commits. Only this evidence document was written in the workspace. This continues WP01-01A capability setup; its earlier handoff remains historical evidence.

The earlier Chrome install, Firefox launch and short-environment retry already used `require_escalated`, which executes as the normal interactive account here. This continuation explicitly compared identities:

- Ordinary sandbox: `PC\CodexSandboxOffline`.
- `require_escalated`: `PC\alexb`.
- Both expose `C:\Users\alexb` as USERPROFILE and execute as 64-bit processes.

Therefore the earlier gaps were not resolved merely by repeating the same operations outside the sandbox. No execution policy, signing protection, antivirus setting, global Git configuration or other security policy was altered. Normal-user execution does not imply an administrator token.

## Chrome stable D1

Read the recent Windows Application log with provider `MsiInstaller`. The previous Playwright enterprise MSI attempt has specific evidence at 23:26:39 BST:

```text
Event 11925: Product: Google Chrome -- Error 1925. You do not have sufficient privileges to complete this installation for all users of the machine. Log on as administrator and then retry this installation.
Event 1033: Product Name: Google Chrome. Product Version: 155.0.8059.40. Manufacturer: Google LLC. Installation success or error status: 1603.
```

`155.0.8059.40` is failed MSI product metadata, not a running browser version. The enterprise MSI route was not repeated.

Google documents separate [single-user and machine-wide installation](https://chromium.googlesource.com/chromium/src/+/main/chrome/installer/setup/README.md), and its [installation troubleshooting](https://support.google.com/chrome/answer/6315198?hl=en) links to a [single-user installer page](https://www.google.com/chrome/?standalone=1&system=false). Used the official vendor bootstrap endpoint as a distinct normal-user route:

```powershell
Invoke-WebRequest -Uri 'https://dl.google.com/chrome/install/latest/chrome_installer.exe' -OutFile <task-temp>/ChromeSetup.exe
Get-AuthenticodeSignature -LiteralPath <task-temp>/ChromeSetup.exe
Start-Process -FilePath <task-temp>/ChromeSetup.exe -ArgumentList '/silent','/install' -WindowStyle Hidden -PassThru
```

The installer was launched only after Authenticode validation reported `Valid` and signer `Google LLC`. Exact retained file:

```text
C:\Users\alexb\AppData\Local\Temp\learning-is-fun-browser-recovery-01a11d98\ChromeSetup.exe
Bytes: 13288376
SHA-256: 1ccd2f93c9b530f0e65039864f03c3d3febf5489348952234637a3f2c84071ca
Product: Google Installer (x86)
OriginalFilename: UpdaterSetup.exe
Installer metadata version: 156.0.8067.0
```

The normal-user installer exited `75003`. Its log at `C:\Users\alexb\AppData\Local\Google\GoogleUpdater\updater.log` identifies the failure stage:

```text
23:47:50.197 Setup succeeded.
23:47:50.202 ::CoCreateInstance failed: {855A08CD-5D0D-5B97-B8E7-D8824DD16360}: 80040154
23:47:50.204 ::CoCreateInstance failed: {547E9AEF-8043-5D26-879F-01E7664192DC}: 80040154
23:47:50.205 Updater registration failed: 75035
23:47:50.205 Updater error: 75003.
23:47:50.298 UpdaterMain (--install) returned 75003.
```

This establishes an updater registration/COM activation failure after setup, not a successful Chrome install. The log also records creation of a normal-user updater wake task. Vendor installation therefore left updater files/task state even though Chrome is absent; no manual registry/task repair or cleanup was attempted. The signed installer remains in the task-specific temporary folder for diagnosis.

The installer also generated a 592-byte workspace `debug.log` at 23:47:49–23:47:50 BST. Its command line names this exact temporary ChromeSetup.exe and Chrome app GUID `{8A69D345-D564-463C-AFF1-A69D9E530F96}`, and records `Metainstaller WMain returning: 75003`. This confirms the bootstrap was targeting Chrome. That task-generated log was removed after capture; pre-existing workspace files were preserved.

Final executable inventory checked all standard locations and found none:

- `C:\Program Files\Google\Chrome\Application\chrome.exe`
- `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`
- `C:\Users\alexb\AppData\Local\Google\Chrome\Application\chrome.exe`

D1 actual launch version: **NONE**. Further action needs successful vendor installation/updater recovery under an appropriate user/admin context, followed by `chromium.launch({channel:'chrome'})` and actual published D1 play. The precise underlying reason for the updater's COM registration failure was not established. No privilege escalation prompt, global-policy adjustment or replacement with Chrome for Testing was used.

## Matched Playwright Firefox D3

The project remains pinned to `@playwright/test` 1.64.0, whose `browsers.json` expects Firefox revision 1555/version 157.0. No project dependency or browser-version pin changed.

A native .NET `Process.Start` of the existing exact executable with `--version`, `UseShellExecute=false`, `CreateNoWindow=true`, under `PC\alexb`, revealed more than Node's generic `spawn UNKNOWN`:

```text
Native Win32 error: 14001
The application has failed to start because its side-by-side configuration is incorrect.
```

The PE metadata is valid x64 structure (`MZ`, `PE\0\0`, machine `8664`). Windows SideBySide event 33 at 23:46:56 BST identifies the dependent assembly:

```text
Activation context generation failed for "C:\Users\alexb\AppData\Local\ms-playwright\firefox-1555\firefox\firefox.exe".
Dependent Assembly mozglue,language="&#x2a;",type="win32",version="1.0.0.0" could not be found.
```

`mozglue.dll` exists (656896 bytes); the message is an assembly activation failure, not proof that the DLL file itself is absent. No external `.manifest` files were found in that Firefox directory. Authenticode reports NotSigned for the patched Firefox executable; this alone was not treated as the cause or grounds for weakening signing controls.

The new assembly evidence justified one supported fresh reinstall, unlike the previously attempted unchanged launch/environment retries. Verified the exact target as `C:\Users\alexb\AppData\Local\ms-playwright\firefox-1555` before invoking the project-local CLI:

```powershell
& <bundled-node> node_modules/@playwright/test/cli.js install --force firefox
```

Executed under `PC\alexb`; exit 0. Downloaded the official Playwright CDN archive `https://cdn.playwright.dev/dbazure/download/playwright/builds/firefox/1555/firefox-win64.zip`, retaining revision 1555/version 157.0. The CLI also refreshed FFmpeg 1013 and installed Winldd 1007. This was an installer-managed replacement of the matched browser, not a manual binary or manifest patch.

The single post-install Playwright launch still failed:

```text
browserType.launch: spawn UNKNOWN
<launching> C:\Users\alexb\AppData\Local\ms-playwright\firefox-1555\firefox\firefox.exe -no-remote -headless -profile <temporary Playwright profile> -juggler-pipe -silent
```

Windows SideBySide event 33 at 23:48:36 BST repeats the same unresolved `mozglue` dependent-assembly activation failure after the fresh install. The temporary profile name is incidental and is not a product path.

Final retained binary evidence:

| File | Size/version metadata | SHA-256 |
|---|---|---|
| `firefox-1555/firefox/firefox.exe` | 1140736 bytes; 157.0 | `c949e57fba9a65ab6c434a76e32d2c72eb43f8b99a7c48ee7e927a4fad4b2a36` |
| `firefox-1555/firefox/mozglue.dll` | 656896 bytes | `552ebda93b13633e3382382ffebf4d37adbc0138df94ee85ac1dd6240b4fb470` |

D3 actual launch version: **NONE**. `157.0` is distribution/file metadata only. Further action requires resolution of the matched archive/host side-by-side assembly activation, then a genuine Playwright Firefox launch and published D3 session. A deeper Windows `sxstrace`/upstream packaging investigation is a possible next diagnostic, but was not pursued beyond this bounded capability continuation. No edited assembly manifest, security bypass, alternate Firefox version or relabelled engine was supplied.

## Result and limits

| Mode | New recovery outcome | Observed running version | Later play action |
|---|---|---|---|
| D1 stable Chrome | All-users MSI privileges identified; signed per-user install fails updater registration | NONE | Vendor installer/updater recovery, branded launch and published D1 session |
| D3 matched Firefox | Native activation cause identified; fresh exact-revision reinstall does not resolve it | NONE | Resolve mozglue activation, matched launch and published D3 session |

Existing Edge/Chromium/WebKit launch evidence remains in WP01-01A-HANDOFF; it was not repeated or promoted to D1/D3 evidence. No gameplay, audio, physical-device, child, publication or complete matrix acceptance is established here. Stopped after supported recovery failed with concrete causes rather than repeating the same approach.

A final normal-user read-only Git status invocation reported repository ownership mismatch because `.git` is owned by `PC\CodexSandboxOffline`; no global `safe.directory` setting was added. Workspace verification uses the ordinary sandbox context. This does not affect the browser failure conclusions.

## Addendum — official current Stable Chrome for Testing route

The controller clarified that the signed package requires current stable branded Chrome, not specifically updater-installed Chrome. The earlier worker handoff's instruction categorically excluding Chrome for Testing was an added restriction, not a signed requirement. This addendum supersedes that restriction. The earlier Playwright-bundled `156.0.8078.4` browser is not relabelled Stable; the route here selects Google's current **Stable** distribution independently.

Google describes [Chrome for Testing](https://developer.chrome.com/docs/automation-and-testing/chrome-for-testing) as a Chrome flavor for automation, distributed through the Chrome release process without automatic updates. Its [official channel API](https://github.com/GoogleChromeLabs/chrome-for-testing#json-api-endpoints) distinguishes Stable/Beta/Dev/Canary and supplies platform downloads. Read two official current sources, requiring agreement before download:

- [last-known-good-versions-with-downloads.json](https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json), selecting `channels.Stable.downloads.chrome` with platform `win64`.
- [LATEST_RELEASE_STABLE](https://googlechromelabs.github.io/chrome-for-testing/LATEST_RELEASE_STABLE).

Provenance fetched at 22:54:07 UTC / 23:54:07 BST on 8 October 2026:

```text
Manifest timestamp: 2026-10-08T18:27:00.281Z
Channel: Stable
Version from both endpoints: 155.0.8059.39
Revision: 1697595
Official download: https://storage.googleapis.com/chrome-for-testing-public/155.0.8059.39/win64/chrome-win64.zip
Archive size: 207197429 bytes
Archive SHA-256: 59ab2a6e99bde9c0bc180414988394f9f5355a0d3764c704151ee8ecea235c7e
```

This is Google's current available Stable CfT at that fetch, selected from live channel data; it is not a permanent older-version pin. The earlier failed updater MSI product metadata was `155.0.8059.40`, which is a different distribution's metadata and is not silently equated with this CfT version. Any later play session must refresh current Stable provenance rather than assume this retained version remains current.

Downloaded the official HTTPS URL and used `Expand-Archive` into a new exact cache target, refusing overwrite of any existing directory:

```text
Archive: C:\Users\alexb\AppData\Local\Temp\learning-is-fun-browser-recovery-01a11d98\chrome-stable-155.0.8059.39-win64.zip
Extracted root: C:\Users\alexb\AppData\Local\ms-playwright\cft-stable-155.0.8059.39
Executable: C:\Users\alexb\AppData\Local\ms-playwright\cft-stable-155.0.8059.39\chrome-win64\chrome.exe
File ProductName/FileDescription: Google Chrome for Testing
File ProductVersion: 155.0.8059.39
Executable size: 4537856 bytes
Executable architecture: x64 (PE machine 8664)
Executable SHA-256: b3750f3977e4c179e80b8fcb66d5919ca6c0a6525c2f5066f7e40e1becfcd083
Authenticode: NotSigned
```

An initially added signature preflight stopped before launch because this vendor distribution reports NotSigned. The signed requirements do not require an Authenticode-signed CfT executable; the subsequent normal launch retained the signature observation and left Windows signing protections unchanged. No file unblocking, signing-policy changes, manual manifest changes or security-control overrides were used. Archive extraction/install-cache changes are external browser setup only; no product/configuration files changed.

Actual launch attempt used project Playwright 1.64.0 under `PC\alexb`:

```ts
await chromium.launch({
  channel: 'chrome',
  executablePath: 'C:/Users/alexb/AppData/Local/ms-playwright/cft-stable-155.0.8059.39/chrome-win64/chrome.exe',
  chromiumSandbox: true,
});
```

The planned neutral mouse/keyboard/focus probe at 1366 × 768 could not execute: Playwright returned `browserType.launch: spawn UNKNOWN` before a browser was created. Native .NET `Process.Start` with this executable and `--version` then returned Win32 `14001`, stating its side-by-side configuration is incorrect. SideBySide event 33 at 23:55:40 and 23:55:59 BST gives the specific assembly:

```text
Activation context generation failed for "...\cft-stable-155.0.8059.39\chrome-win64\chrome.exe".
Dependent Assembly 155.0.8059.39,language="&#x2a;",type="win32",version="155.0.8059.39" could not be found.
```

Checked the original ZIP inventory and extracted directory: `chrome-win64/155.0.8059.39.manifest` exists in both, 226 bytes; the extracted manifest declares assembly name/version `155.0.8059.39` and `chrome_elf.dll`. `chrome.dll` and `chrome_elf.dll` also exist. The manifest SHA-256 is `31a1d0f869558d7472b705c0b9e2e2904719182160ab14928cc73a5891c224a0`. This rules out the simple hypothesis that extraction omitted the named manifest. It does not establish the deeper activation-context cause. Stopped this bounded route without patching vendor files or changing Windows protection.

**Observed running Stable CfT version: NONE.** `155.0.8059.39` is current official channel provenance and file metadata only. D1 remains pending an actual launch and later published play; this addendum makes no game acceptance claim.

### Configuration adapter proposal — not applied

If independently approved, keep project name `D1-Chrome`, browserName `chromium`, channel `chrome`, viewport 1366 × 768, published URL validation and isolated contexts. Add an explicit optional `PLAYTEST_CHROME_EXECUTABLE` adapter to D1's `launchOptions.executablePath`; leave normal installed-channel selection in place when the variable is absent. Validate any supplied path as absolute/existing and retain the session's official Stable provenance plus actual `browser.version()`. No silent alternate-engine fallback or fixed version/path should be baked into the repository.

Indicative D1-only option shape:

```ts
launchOptions: process.env.PLAYTEST_CHROME_EXECUTABLE
  ? { executablePath: process.env.PLAYTEST_CHROME_EXECUTABLE, chromiumSandbox: true }
  : undefined
```

This is a proposal, not a committed/configured adapter or successful Windows route. Current `playwright.config.ts` still selects the ordinary installed Chrome channel and has not changed. An independently reviewed non-Windows host may also be useful if the Windows activation failures remain unresolved.

D3 may use the package-matched Playwright Firefox on free Ubuntu GitHub Actions later, as the controller permits; no Ubuntu run occurred here, no Firefox version changed, and no additional Windows Firefox repair was attempted. Required D1/D3 published observations remain separate later work.
