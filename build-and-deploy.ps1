# Quick Build & Deploy Script for Frontend
# Run this in PowerShell before uploading to hosting

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FRONTEND BUILD - Production Ready" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.production exists
if (-Not (Test-Path ".env.production")) {
    Write-Host "ERROR: .env.production not found!" -ForegroundColor Red
    Write-Host "Please create .env.production file first." -ForegroundColor Red
    exit 1
}

Write-Host "[1/5] Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node -v
Write-Host "      ✓ Node.js version: $nodeVersion" -ForegroundColor Green
Write-Host ""

Write-Host "[2/5] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "      ✗ npm install failed!" -ForegroundColor Red
    exit 1
}
Write-Host "      ✓ Dependencies installed" -ForegroundColor Green
Write-Host ""

Write-Host "[3/5] Building production bundle..." -ForegroundColor Yellow
$env:GENERATE_SOURCEMAP="false"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "      ✗ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "      ✓ Build completed successfully" -ForegroundColor Green
Write-Host ""

Write-Host "[4/5] Copying .htaccess to build folder..." -ForegroundColor Yellow
Copy-Item "public\.htaccess" "build\.htaccess" -Force
Write-Host "      ✓ .htaccess copied" -ForegroundColor Green
Write-Host ""

Write-Host "[5/5] Creating deployment package..." -ForegroundColor Yellow
if (Test-Path "frontend-deploy.zip") {
    Remove-Item "frontend-deploy.zip" -Force
}
Compress-Archive -Path "build\*" -DestinationPath "frontend-deploy.zip"
Write-Host "      ✓ Deployment package created: frontend-deploy.zip" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ BUILD COMPLETED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Upload 'frontend-deploy.zip' to cPanel File Manager" -ForegroundColor White
Write-Host "2. Extract to public_html/ (or your domain folder)" -ForegroundColor White
Write-Host "3. Delete the .zip file after extraction" -ForegroundColor White
Write-Host "4. Test: https://www.pesantrenalihsanbekasi.or.id" -ForegroundColor White
Write-Host ""
Write-Host "Files in build folder:" -ForegroundColor Cyan
Get-ChildItem -Path "build" -Name | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
Write-Host ""
Write-Host "Deployment package size:" -ForegroundColor Cyan
$zipSize = (Get-Item "frontend-deploy.zip").Length / 1MB
Write-Host "  $([math]::Round($zipSize, 2)) MB" -ForegroundColor Gray
Write-Host ""
