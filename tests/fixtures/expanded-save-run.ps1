param([string]$Filter = '', [string]$OutputRoot = '', [string]$StarterSource = '')
$ErrorActionPreference = 'Stop'
$expandedStart = [System.Diagnostics.ProcessStartInfo]::new()
$expandedStart.FileName = 'C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$expandedStart.WorkingDirectory = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$expandedStart.UseShellExecute = $false
$expandedStart.CreateNoWindow = $true
$expandedStart.RedirectStandardOutput = $true
$expandedStart.RedirectStandardError = $true
foreach ($expandedKey in @($expandedStart.Environment.Keys)) { if ($expandedKey -ieq 'PATH') { $expandedStart.Environment.Remove($expandedKey) | Out-Null } }
$expandedStart.Environment['Path'] = 'C:\Users\alexb\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Windows\system32;C:\Windows'
if (!$OutputRoot) { $OutputRoot = Join-Path $expandedStart.WorkingDirectory 'artifacts/wp04-07a' }
$expandedRoot = Join-Path ([IO.Path]::GetFullPath($OutputRoot)) ('verify-' + [guid]::NewGuid().ToString('N'))
$expandedStart.Environment['EXPANDED_VERIFY_ROOT'] = $expandedRoot
if ($StarterSource) { $expandedStart.Environment['EXPANDED_STARTER_SOURCE'] = (Resolve-Path -LiteralPath $StarterSource).Path }
$expandedStart.Environment['NODE_DISABLE_COMPILE_CACHE'] = '1'
Write-Output ('Verification root: ' + $expandedRoot)
$expandedCli = & $expandedStart.FileName -e 'process.stdout.write(require.resolve("@playwright/test/cli", { paths: [process.argv[1]] }))' $expandedStart.WorkingDirectory
if ($LASTEXITCODE -ne 0) { throw 'Installed Playwright CLI resolution failed.' }
foreach ($expandedArgument in @($expandedCli, 'test', '--config', 'tests/fixtures/expanded-save.config.ts')) { $expandedStart.ArgumentList.Add($expandedArgument) }
if ($Filter) { $expandedStart.ArgumentList.Add('--grep'); $expandedStart.ArgumentList.Add($Filter) }
$expandedProcess = [System.Diagnostics.Process]::Start($expandedStart)
$expandedErrors = $expandedProcess.StandardError.ReadToEndAsync()
while ($null -ne ($expandedLine = $expandedProcess.StandardOutput.ReadLine())) { Write-Output $expandedLine }
$expandedProcess.WaitForExit()
$expandedErrors.Result
exit $expandedProcess.ExitCode
