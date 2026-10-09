param([string]$Filter = '', [string]$Project = '')
$ErrorActionPreference = 'Stop'
$hallStart = [System.Diagnostics.ProcessStartInfo]::new()
$hallStart.FileName = 'C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$hallStart.WorkingDirectory = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$hallStart.UseShellExecute = $false
$hallStart.CreateNoWindow = $true
$hallStart.RedirectStandardOutput = $true
$hallStart.RedirectStandardError = $true
foreach ($hallKey in @($hallStart.Environment.Keys)) { if ($hallKey -ieq 'PATH') { $hallStart.Environment.Remove($hallKey) | Out-Null } }
$hallStart.Environment['Path'] = 'C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback;C:\Windows\system32;C:\Windows'
$hallRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('learning-is-fun-hall-' + [guid]::NewGuid().ToString('N'))
$hallStart.Environment['HALL_VERIFY_ROOT'] = $hallRoot
$hallStart.Environment['NODE_DISABLE_COMPILE_CACHE'] = '1'
Write-Output ('Verification root: ' + $hallRoot)
foreach ($hallArgument in @('node_modules/@playwright/test/cli.js', 'test', '--config', 'tests/fixtures/local-leaderboard.config.ts')) { $hallStart.ArgumentList.Add($hallArgument) }
if ($Filter) { $hallStart.ArgumentList.Add('--grep'); $hallStart.ArgumentList.Add($Filter) }
if ($Project) { $hallStart.ArgumentList.Add('--project'); $hallStart.ArgumentList.Add($Project) }
$hallProcess = [System.Diagnostics.Process]::Start($hallStart)
$hallErrors = $hallProcess.StandardError.ReadToEndAsync()
while ($null -ne ($hallLine = $hallProcess.StandardOutput.ReadLine())) { Write-Output $hallLine }
$hallProcess.WaitForExit()
$hallErrors.Result
exit $hallProcess.ExitCode
