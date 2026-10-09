param([string]$Filter = '', [string]$Project = '')
$ErrorActionPreference = 'Stop'
$audioStart = [System.Diagnostics.ProcessStartInfo]::new()
$audioStart.FileName = 'C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$audioStart.WorkingDirectory = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$audioStart.UseShellExecute = $false
$audioStart.CreateNoWindow = $true
$audioStart.RedirectStandardOutput = $true
$audioStart.RedirectStandardError = $true
foreach ($audioKey in @($audioStart.Environment.Keys)) { if ($audioKey -ieq 'PATH') { $audioStart.Environment.Remove($audioKey) | Out-Null } }
$audioStart.Environment['Path'] = 'C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Windows\system32;C:\Windows'
$audioRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('learning-is-fun-audio-' + [guid]::NewGuid().ToString('N'))
$audioStart.Environment['AUDIO_VERIFY_ROOT'] = $audioRoot
$audioStart.Environment['NODE_DISABLE_COMPILE_CACHE'] = '1'
Write-Output ('Verification root: ' + $audioRoot)
foreach ($audioArgument in @('node_modules/@playwright/test/cli.js', 'test', '--config', 'tests/fixtures/audio.config.ts')) { $audioStart.ArgumentList.Add($audioArgument) }
if ($Filter) { $audioStart.ArgumentList.Add('--grep'); $audioStart.ArgumentList.Add($Filter) }
if ($Project) { $audioStart.ArgumentList.Add('--project'); $audioStart.ArgumentList.Add($Project) }
$audioProcess = [System.Diagnostics.Process]::Start($audioStart)
$audioErrors = $audioProcess.StandardError.ReadToEndAsync()
while ($null -ne ($audioLine = $audioProcess.StandardOutput.ReadLine())) { Write-Output $audioLine }
$audioProcess.WaitForExit()
$audioErrors.Result
exit $audioProcess.ExitCode
