# Bounded Windows browser activation diagnosis — 9 October 2026

**Result:** both unchanged browser executables still fail before browser startup. Native tracing localizes failure to their private side-by-side assembly bindings. Windows Common Controls resolves, the vendor private manifests exist and validate directly, and case sensitivity/filename casing is not the cause. No supported app-local correction is established by this evidence, so no setup change is proposed or applied. The deeper reason native probing rejects the present private assemblies remains unresolved.

Only this workspace evidence document was written. No product/shared configuration/dependency, Git/shared status, vendor binary/manifest, registry, admin setting, security policy or machine runtime was changed. No MSI/updater/reinstall attempt, browser-version change, remote gateway or engine substitution occurred. The controller's pending human Chrome-install/open question remains unchanged. Other workers' browser installations and ports 5182/5183 were not modified or used.

## Starting evidence and exact binaries

Read BROWSER-CAPABILITY.md and its official Stable Chrome for Testing addendum. The previous native `14001`/SideBySide event 33 evidence named Chrome's `155.0.8059.39` assembly and Firefox's `mozglue` assembly, but the deeper loader trace had not been inspected.

This continuation uses existing binaries only; it does not select a new version. Chrome's Stable provenance was established on 8 October in that retained handoff, not refreshed or promoted to a claim that this version is still current at a later play session.

| Browser | Existing executable | File metadata | Unchanged SHA-256 |
|---|---|---|---|
| Official Stable CfT retained candidate | `C:\Users\alexb\AppData\Local\ms-playwright\cft-stable-155.0.8059.39\chrome-win64\chrome.exe` | 155.0.8059.39, 4537856 bytes | `b3750f3977e4c179e80b8fcb66d5919ca6c0a6525c2f5066f7e40e1becfcd083` |
| Project-matched Firefox | `C:\Users\alexb\AppData\Local\ms-playwright\firefox-1555\firefox\firefox.exe` | 157.0, 1140736 bytes | `c949e57fba9a65ab6c434a76e32d2c72eb43f8b99a7c48ee7e927a4fad4b2a36` |

These hashes match the earlier retained evidence. **Actual running version for either browser: NONE.** Metadata is not a launch result.

## Native tracing succeeded without a setup change

Normal-user `require_escalated` execution reports `PC\alexb`; no administrator/UAC elevation or policy adjustment was requested. `sxstrace.exe /?` was available; `mt.exe` was not found on the inspected command path.

Started one temporary side-by-side trace:

```text
C:\Windows\System32\sxstrace.exe Trace -logfile:<task-temp>\activation.etl -nostop
```

It returned exit 0 and "Tracing started". Only after that success, ran one neutral Playwright launch probe for each unchanged executable. Chrome explicitly used `chromiumSandbox: true`, `channel: 'chrome'` and its exact CfT executable. Firefox used the matched default Firefox executable with no sandbox-disabling option. Playwright generated fresh temporary profiles for both. Each failed `browserType.launch: spawn UNKNOWN` before its neutral `<h1>` probe could execute. No browser listening port was opened.

Stopped only the trace successfully started by this command in `finally` cleanup, then parsed it:

```text
C:\Windows\System32\sxstrace.exe Stoptrace
C:\Windows\System32\sxstrace.exe Parse -logfile:<task-temp>\activation.etl -outfile:<task-temp>\activation.txt
```

Raw files retained under `C:\Users\alexb\AppData\Local\Temp\learning-is-fun-activation-diagnosis-01a11d98`:

| File | SHA-256 |
|---|---|
| activation.etl | `e3742982cacc906d43b8804c19b9823987815fe40de0d997e43bb54fe50d42fd` |
| activation.txt (14421 bytes) | `d76cc673f4eea1c3cda8bbf514cecb0024cec478593b7e2ea8477ce727c5a72c` |

Parsed trace last-write time: 03:12:34 BST on 9 October 2026. The trace was stopped; no ongoing tracing session was left by this command. No workspace debug.log was generated.

## Earliest failing native checkpoint

Both activation contexts report processor architecture AMD64, cultures en-GB/en/en-US, and the correct browser application directory. They parse the executable's embedded manifest and resolve the shared Common Controls dependency through Windows servicing policy:

```text
Post policy assembly identity is Microsoft.Windows.Common-Controls,processorArchitecture="AMD64",publicKeyToken="6595b64144ccf1df",type="win32",version="6.0.26100.9278".
Manifest found at C:\WINDOWS\WinSxS\manifests\amd64_microsoft.windows.common-controls_6595b64144ccf1df_6.0.26100.9278_none_3e0d1ba8e3303201.manifest.
```

Thus this trace does not support installing a machine-wide Common Controls/C-runtime package as the remedy. No such install was attempted.

The first unresolved dependency in Chrome is its private assembly:

```text
Reference: 155.0.8059.39,language="&#x2a;",type="win32",version="155.0.8059.39"
Attempt to probe manifest at <chrome-dir>\155.0.8059.39.DLL.
Attempt to probe manifest at <chrome-dir>\155.0.8059.39.MANIFEST.
Attempt to probe manifest at <chrome-dir>\155.0.8059.39\155.0.8059.39.DLL.
Attempt to probe manifest at <chrome-dir>\155.0.8059.39\155.0.8059.39.MANIFEST.
Did not find manifest for culture Neutral.
ERROR: Cannot resolve reference 155.0.8059.39,language="&#x2a;",type="win32",version="155.0.8059.39".
ERROR: Activation Context generation failed.
```

Firefox fails at the equivalent private assembly checkpoint:

```text
Reference: mozglue,language="&#x2a;",type="win32",version="1.0.0.0"
Attempt to probe manifest at <firefox-dir>\mozglue.DLL.
Attempt to probe manifest at <firefox-dir>\mozglue.MANIFEST.
Attempt to probe manifest at <firefox-dir>\mozglue\mozglue.DLL.
Attempt to probe manifest at <firefox-dir>\mozglue\mozglue.MANIFEST.
Did not find manifest for culture Neutral.
ERROR: Cannot resolve reference mozglue,language="&#x2a;",type="win32",version="1.0.0.0".
ERROR: Activation Context generation failed.
```

The actual native failure is therefore private assembly binding, before browser code, profiles, rendering or Playwright transport. The trace does not expose a more specific rejection reason for the present candidate files; it never records parsing either candidate during dependency resolution.

Microsoft's [assembly search sequence](https://learn.microsoft.com/en-us/windows/win32/sbscs/assembly-searching-sequence) describes private assembly probing in the executable folder and assembly-named subfolders. The trace follows those locations. Its documentation distinguishes DLL-embedded and standalone assembly manifests; this is not evidence that every present file will bind successfully on this host.

## Ruled-out file/casing and manifest hypotheses

Read-only `fsutil.exe file queryCaseSensitiveInfo` reports **disabled** for both exact browser leaf directories. Native/.NET file-existence checks return true for both lowercase vendor spellings and uppercase spellings used by the loader:

```text
Chrome: 155.0.8059.39.manifest => true; 155.0.8059.39.MANIFEST => true
Firefox: mozglue.dll => true; mozglue.DLL => true
```

No case-sensitivity flag was changed. Consequently copying/renaming files solely for uppercase spelling is not an evidenced correction.

A read-only PE resource-table parser inspected the existing files, without executing or modifying them:

| File/resource | Bytes | Observed content |
|---|---|---|
| chrome.exe RT_MANIFEST 24 / ID 1 / language 1033 | 1132 | `asInvoker`; Common Controls dependency; private 155.0.8059.39 dependency |
| chrome_elf.dll RT_MANIFEST 24 / ID 2 / language 1033 | 314 | `asInvoker` trust manifest; not the standalone version assembly identity |
| firefox.exe RT_MANIFEST 24 / ID 1 / language 1033 | 1692 | Firefox identity; `asInvoker`; Common Controls and mozglue dependencies |
| mozglue.dll RT_MANIFEST 24 / ID 2 / language 1033 | 248 | Private identity name mozglue/version 1.0.0.0/type win32; file mozglue.dll |

Chrome's existing 226-byte standalone `155.0.8059.39.manifest` declares its matching private identity and `chrome_elf.dll`; its hash remains `31a1d0f869558d7472b705c0b9e2e2904719182160ab14928cc73a5891c224a0`. The archive inventory already showed this original manifest. `mozglue.dll` remains hash `552ebda93b13633e3382382ffebf4d37adbc0138df94ee85ac1dd6240b4fb470`.

Direct [CreateActCtxW](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-createactctxw) diagnostics supplied existing sources and the exact assembly directory. Successful handles were released immediately; no activation was applied to browser launches. Results:

| Existing source | Flags/input | Native result |
|---|---|---|
| Chrome standalone private manifest | AssemblyDirectory valid | ready |
| Firefox mozglue.dll embedded ID 2 | AssemblyDirectory + ResourceName valid | ready |
| Chrome executable embedded ID 1 | same exact browser directory | fails 14001 |
| Firefox executable embedded ID 1 | same exact browser directory | fails 14001 |

This demonstrates direct Windows parsing/activation-context creation for each private manifest. It does **not** demonstrate dependency binding or a successful browser launch. The separation between direct private-source success and executable-source binding failure is the unresolved checkpoint.

Read-only alternate-stream inventory found only `:$DATA` for Chrome's standalone manifest and Firefox's mozglue.dll, with no Zone.Identifier on those candidate files. No unblocking or signing change was made. Their reported unsigned status remains metadata; this trace does not identify signing enforcement as the cause.

## Safe-action decision and remaining limits

No supported reversible app-local correction is established. In particular, the evidence does not justify:

- Changing directory case sensitivity, adding case-only copies, or reinstalling files already present.
- Editing resource IDs, assembly identities, vendor manifests/binaries, or adding speculative sidecars/rearranged assembly folders.
- Changing registry/SxS policy, security settings, administrator configuration, or installing machine-wide runtimes.

No exact corrective action is submitted as proven, and no setup mutation was made. Any further host/vendor investigation must explain why dependency resolution rejects a private source that validates directly; this report does not claim that a directory move, manifest patch, new browser version or runtime install would fix it.

The accepted D1 gate remains pending a genuine current Stable Chrome launch and later published game session. D3 remains pending matched Firefox launch on an accepted host; the previously permitted free Ubuntu Actions route has not been executed here. The pending human Chrome installation/open response is neither changed nor assumed. No game acceptance or broader browser matrix result follows from this diagnosis.
