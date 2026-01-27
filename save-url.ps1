# Quick save - run this AFTER vercel deploy
# Usage: .\save-url.ps1 "https://your-preview-url"

param([string]$url)

$buildsFile = "E:\50-59 Media\51 Cloud\51.03 GDrive\builds.txt"
$entry = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm')] WeekFlux: $url"
Add-Content -Path $buildsFile -Value $entry
Write-Host "✅ Saved: $entry" -ForegroundColor Green
