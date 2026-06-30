param(
  [string]$RootJson = "tmp/notion/root.json",
  [string]$CasesDir = "tmp/notion/cases",
  [string]$OutputDir = "content/notion",
  [string]$PublicDir = "public",
  [string]$AssetsSubdir = "notion-assets"
)

$ErrorActionPreference = "Stop"

function Fail($Message) {
  Write-Host "ERROR: $Message" -ForegroundColor Red
  exit 1
}

Write-Host "Notion v2 sync started..." -ForegroundColor Cyan

if (-not (Test-Path -LiteralPath $RootJson)) {
  Fail "Root dump not found: $RootJson"
}

if (-not (Test-Path -LiteralPath $CasesDir)) {
  Fail "Cases directory not found: $CasesDir"
}

$caseFiles = Get-ChildItem -LiteralPath $CasesDir -Filter *.json -File -ErrorAction SilentlyContinue
if (-not $caseFiles -or $caseFiles.Count -eq 0) {
  Fail "No case dumps (*.json) found in: $CasesDir"
}

if (-not (Test-Path -LiteralPath $OutputDir)) {
  New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

if (-not (Test-Path -LiteralPath $PublicDir)) {
  New-Item -ItemType Directory -Path $PublicDir -Force | Out-Null
}

Write-Host "Using dumps:" -ForegroundColor DarkGray
Write-Host "  root:  $RootJson"
Write-Host "  cases: $CasesDir ($($caseFiles.Count) files)"

$cmd = @(
  "scripts/notion-to-content.mjs",
  $RootJson,
  $CasesDir,
  $OutputDir,
  $PublicDir,
  $AssetsSubdir
)

& node @cmd
if ($LASTEXITCODE -ne 0) {
  Fail "Node sync script failed with exit code $LASTEXITCODE"
}

Write-Host ""
Write-Host "Done. Generated content in '$OutputDir' and assets in '$PublicDir/$AssetsSubdir'." -ForegroundColor Green
