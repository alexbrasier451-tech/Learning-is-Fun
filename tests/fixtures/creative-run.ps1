param([string]$Filter = '', [string]$Project = '')
$ErrorActionPreference = 'Stop'
$creativeStart = [System.Diagnostics.ProcessStartInfo]::new()
$creativeStart.FileName = 'C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$creativeStart.WorkingDirectory = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$creativeStart.UseShellExecute = $false
$creativeStart.CreateNoWindow = $true
$creativeStart.RedirectStandardOutput = $true
$creativeStart.RedirectStandardError = $true
foreach ($creativeKey in @($creativeStart.Environment.Keys)) { if ($creativeKey -ieq 'PATH') { $creativeStart.Environment.Remove($creativeKey) | Out-Null } }
$creativeStart.Environment['Path'] = 'C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback;C:\Windows\system32;C:\Windows'
$creativeRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('learning-is-fun-creative-' + [guid]::NewGuid().ToString('N'))
$creativeStart.Environment['CREATIVE_VERIFY_ROOT'] = $creativeRoot
$creativeStart.Environment['NODE_DISABLE_COMPILE_CACHE'] = '1'
Write-Output ('Verification root: ' + $creativeRoot)
foreach ($creativeArgument in @('node_modules/@playwright/test/cli.js', 'test', '--config', 'tests/fixtures/creative.config.ts')) { $creativeStart.ArgumentList.Add($creativeArgument) }
if ($Filter) { $creativeStart.ArgumentList.Add('--grep'); $creativeStart.ArgumentList.Add($Filter) }
if ($Project) { $creativeStart.ArgumentList.Add('--project'); $creativeStart.ArgumentList.Add($Project) }
$creativeProcess = [System.Diagnostics.Process]::Start($creativeStart)
$creativeErrors = $creativeProcess.StandardError.ReadToEndAsync()
while ($null -ne ($creativeLine = $creativeProcess.StandardOutput.ReadLine())) { Write-Output $creativeLine }
$creativeProcess.WaitForExit()
$creativeErrors.Result
exit $creativeProcess.ExitCode
