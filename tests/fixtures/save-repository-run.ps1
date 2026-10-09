param([string]$Project = '', [string]$Filter = '')
$ErrorActionPreference = 'Stop'
$repoCheckStart = [System.Diagnostics.ProcessStartInfo]::new()
$repoCheckStart.FileName = 'C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$repoCheckStart.WorkingDirectory = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$repoCheckStart.UseShellExecute = $false
$repoCheckStart.CreateNoWindow = $true
$repoCheckStart.RedirectStandardOutput = $true
$repoCheckStart.RedirectStandardError = $true
foreach ($repoCheckKey in @($repoCheckStart.Environment.Keys)) {
  if ($repoCheckKey -ieq 'PATH') { $repoCheckStart.Environment.Remove($repoCheckKey) | Out-Null }
}
$repoCheckStart.Environment['Path'] = 'C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback;C:\Windows\system32;C:\Windows'
$repoCheckRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('learning-is-fun-repository-' + [guid]::NewGuid().ToString('N'))
$repoCheckStart.Environment['REPOSITORY_VERIFY_ROOT'] = $repoCheckRoot
Write-Output ('Verification root: ' + $repoCheckRoot)
foreach ($repoCheckArgument in @('node_modules/@playwright/test/cli.js', 'test', '--config', 'tests/fixtures/save-repository.config.ts')) {
  $repoCheckStart.ArgumentList.Add($repoCheckArgument)
}
if ($Project) { $repoCheckStart.ArgumentList.Add('--project'); $repoCheckStart.ArgumentList.Add($Project) }
if ($Filter) { $repoCheckStart.ArgumentList.Add('--grep'); $repoCheckStart.ArgumentList.Add($Filter) }
$repoCheckProcess = [System.Diagnostics.Process]::Start($repoCheckStart)
$repoCheckErr = $repoCheckProcess.StandardError.ReadToEndAsync()
while ($null -ne ($repoCheckLine = $repoCheckProcess.StandardOutput.ReadLine())) { Write-Output $repoCheckLine }
$repoCheckProcess.WaitForExit()
$repoCheckErr.Result
exit $repoCheckProcess.ExitCode
