# NeuroFlow Deploy Helper - Add this to your PowerShell profile
# Run: notepad $PROFILE and paste this content

function Deploy-Vercel {
    $buildsFile = "E:\50-59 Media\51 Cloud\51.03 GDrive\builds.txt"
    $output = vercel deploy 2>&1 | Tee-Object -Variable result
    $url = ($result | Select-String 'https://neuroflow.*vercel.app').Matches.Value
    if ($url) {
        $entry = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm')] $url"
        Add-Content -Path $buildsFile -Value $entry
        Write-Host "`n✅ Saved: $entry" -ForegroundColor Green
    }
}

Set-Alias vd Deploy-Vercel
