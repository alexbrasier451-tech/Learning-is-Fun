param([string]$Filter = '', [string]$Project = '')
$ErrorActionPreference = 'Stop'
$adultStart = [System.Diagnostics.ProcessStartInfo]::new()
$adultStart.FileName = 'C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$adultStart.WorkingDirectory = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$adultStart.UseShellExecute = $false
$adultStart.CreateNoWindow = $true
$adultStart.RedirectStandardOutput = $true
$adultStart.RedirectStandardError = $true
foreach ($adultKey in @($adultStart.Environment.Keys)) { if ($adultKey -ieq 'PATH') { $adultStart.Environment.Remove($adultKey) | Out-Null } }
$adultStart.Environment['Path'] = 'C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback;C:\Windows\system32;C:\Windows'
$adultRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('learning-is-fun-adult-' + [guid]::NewGuid().ToString('N'))
$adultStart.Environment['ADULT_VERIFY_ROOT'] = $adultRoot
$adultStart.Environment['NODE_DISABLE_COMPILE_CACHE'] = '1'
Write-Output ('Verification root: ' + $adultRoot)
foreach ($adultArgument in @('node_modules/@playwright/test/cli.js', 'test', '--config', 'tests/fixtures/adult-profiles.config.ts')) { $adultStart.ArgumentList.Add($adultArgument) }
if ($Filter) { $adultStart.ArgumentList.Add('--grep'); $adultStart.ArgumentList.Add($Filter) }
if ($Project) { $adultStart.ArgumentList.Add('--project'); $adultStart.ArgumentList.Add($Project) }
$adultProcess = [System.Diagnostics.Process]::Start($adultStart)
$adultErrors = $adultProcess.StandardError.ReadToEndAsync()
while ($null -ne ($adultLine = $adultProcess.StandardOutput.ReadLine())) { Write-Output $adultLine }
$adultProcess.WaitForExit()
$adultErrors.Result
exit $adultProcess.ExitCode
