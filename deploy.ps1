#!/usr/bin/env pwsh
# deploy.ps1 - Deploy to Vercel and save preview URL

$outputDir = "E:\50-59 Media\51 Cloud\51.03 GDrive"
$outputFile = Join-Path $outputDir "neuroflow-preview-url.txt"

# Run vercel deploy and capture output
$output = vercel deploy 2>&1 | Out-String

# Extract the preview URL (looks like: https://neuroflow-task-planner-xxx.vercel.app)
if ($output -match '(https://neuroflow-task-planner-[a-z0-9]+-jscns-projects\.vercel\.app)') {
    $previewUrl = $matches[1]
    
    # Create timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    # Write to file
    @"
NeuroFlow Preview URL
=====================
URL: $previewUrl
Deployed: $timestamp
"@ | Out-File -FilePath $outputFile -Encoding UTF8
    
    Write-Host "`n✅ Preview URL saved to: $outputFile" -ForegroundColor Green
    Write-Host "📋 URL: $previewUrl" -ForegroundColor Cyan
} else {
    Write-Host "⚠️ Could not extract preview URL from deployment output" -ForegroundColor Yellow
}

# Also show the original output
Write-Host "`n$output"
