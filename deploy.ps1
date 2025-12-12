#!/usr/bin/env pwsh
# Deploy to Vercel and save preview URL

$buildsFile = "E:\50-59 Media\51 Cloud\51.03 GDrive\builds.txt"

# Run vercel deploy
Write-Host "Deploying to Vercel..." -ForegroundColor Cyan
$output = & vercel deploy 2>&1
Write-Host $output

# Extract preview URL from output
$match = [regex]::Match($output, 'https://neuroflow-task-planner-[a-z0-9]+-jscns-projects\.vercel\.app')
if ($match.Success) {
    $url = $match.Value
    $entry = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm')] NeuroFlow: $url"
    Add-Content -Path $buildsFile -Value $entry -Encoding UTF8
    Write-Host "`n✅ Saved to builds.txt: $entry" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Could not extract URL from output" -ForegroundColor Yellow
}
