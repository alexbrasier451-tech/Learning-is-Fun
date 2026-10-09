param([string]$Filter = '')
$ErrorActionPreference = 'Stop'
$backupStart = [System.Diagnostics.ProcessStartInfo]::new()
$backupStart.FileName = 'C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$backupStart.WorkingDirectory = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$backupStart.UseShellExecute = $false
$backupStart.CreateNoWindow = $true
$backupStart.RedirectStandardOutput = $true
$backupStart.RedirectStandardError = $true
foreach ($backupKey in @($backupStart.Environment.Keys)) { if ($backupKey -ieq 'PATH') { $backupStart.Environment.Remove($backupKey) | Out-Null } }
$backupStart.Environment['Path'] = 'C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback;C:\Windows\system32;C:\Windows'
$backupRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('learning-is-fun-backup-' + [guid]::NewGuid().ToString('N'))
$backupStart.Environment['BACKUP_VERIFY_ROOT'] = $backupRoot
$backupStart.Environment['NODE_DISABLE_COMPILE_CACHE'] = '1'
Write-Output ('Verification root: ' + $backupRoot)
foreach ($backupArgument in @('node_modules/@playwright/test/cli.js', 'test', '--config', 'tests/fixtures/backup-roundtrip.config.ts')) { $backupStart.ArgumentList.Add($backupArgument) }
if ($Filter) { $backupStart.ArgumentList.Add('--grep'); $backupStart.ArgumentList.Add($Filter) }
$backupProcess = [System.Diagnostics.Process]::Start($backupStart)
$backupErrors = $backupProcess.StandardError.ReadToEndAsync()
while ($null -ne ($backupLine = $backupProcess.StandardOutput.ReadLine())) { Write-Output $backupLine }
$backupProcess.WaitForExit()
$backupErrors.Result
exit $backupProcess.ExitCode
