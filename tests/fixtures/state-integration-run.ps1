param([string]$Filter = '', [string]$Project = '')
$ErrorActionPreference = 'Stop'
$stateStart = [System.Diagnostics.ProcessStartInfo]::new()
$stateStart.FileName = 'C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$stateStart.WorkingDirectory = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$stateStart.UseShellExecute = $false
$stateStart.CreateNoWindow = $true
$stateStart.RedirectStandardOutput = $true
$stateStart.RedirectStandardError = $true
foreach ($stateKey in @($stateStart.Environment.Keys)) { if ($stateKey -ieq 'PATH') { $stateStart.Environment.Remove($stateKey) | Out-Null } }
$stateStart.Environment['Path'] = 'C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback;C:\Windows\system32;C:\Windows'
$stateRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('learning-is-fun-state-' + [guid]::NewGuid().ToString('N'))
$stateStart.Environment['STATE_VERIFY_ROOT'] = $stateRoot
$stateStart.Environment['NODE_DISABLE_COMPILE_CACHE'] = '1'
Write-Output ('Verification root: ' + $stateRoot)
foreach ($stateArgument in @('node_modules/@playwright/test/cli.js', 'test', '--config', 'tests/fixtures/state-integration.config.ts')) { $stateStart.ArgumentList.Add($stateArgument) }
if ($Filter) { $stateStart.ArgumentList.Add('--grep'); $stateStart.ArgumentList.Add($Filter) }
if ($Project) { $stateStart.ArgumentList.Add('--project'); $stateStart.ArgumentList.Add($Project) }
$stateProcess = [System.Diagnostics.Process]::Start($stateStart)
$stateErrors = $stateProcess.StandardError.ReadToEndAsync()
while ($null -ne ($stateLine = $stateProcess.StandardOutput.ReadLine())) { Write-Output $stateLine }
$stateProcess.WaitForExit()
$stateErrors.Result
exit $stateProcess.ExitCode
