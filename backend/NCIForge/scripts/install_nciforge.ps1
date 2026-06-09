param(
    [string]$PythonExe = "",
    [ValidateSet("local", "global")]
    [string]$Scope = "local",
    [ValidateSet("cpu", "gpu", "skip")]
    [string]$Torch = "cpu",
    [ValidateSet("auto", "yes", "no")]
    [string]$External = "auto",
    [string]$Venv = ""
)

$ErrorActionPreference = "Stop"

function Get-PythonCommand {
    $candidates = @(
        @{ Command = "py"; Args = @("-3") },
        @{ Command = "python"; Args = @() },
        @{ Command = "python3"; Args = @() }
    )

    foreach ($candidate in $candidates) {
        if (Get-Command $candidate.Command -ErrorAction SilentlyContinue) {
            return $candidate
        }
    }

    $paths = @(
        "$env:LOCALAPPDATA\Programs\Python\Python*\python.exe",
        "$env:ProgramFiles\Python*\python.exe",
        "${env:ProgramFiles(x86)}\Python*\python.exe"
    )

    foreach ($pathPattern in $paths) {
        $match = Get-ChildItem -Path $pathPattern -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($match) {
            return @{ Command = $match.FullName; Args = @() }
        }
    }

    throw "Python 3 was not found. Install Python or add it to PATH, then run this script again."
}

if (-not $PythonExe) {
    $python = Get-PythonCommand
    $PythonExe = $python.Command
    $PythonArgs = $python.Args
} else {
    $PythonArgs = @()
}

$Installer = Join-Path $PSScriptRoot "install_nciforge_cli.py"
$InstallArgs = @($Installer, "--yes", "--scope", $Scope, "--torch", $Torch, "--external", $External)
if ($Venv) {
    $InstallArgs += @("--venv", $Venv)
}

& $PythonExe @PythonArgs @InstallArgs
