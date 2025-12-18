# scripts/git-cycle.ps1

# 1. Current branch
$featureBranch = (git rev-parse --abbrev-ref HEAD).Trim()

if ($featureBranch -eq "main" -or $featureBranch -eq "master") {
    Write-Host "You are on $featureBranch. This script is for feature branches only." -ForegroundColor Red
    exit 1
}

Write-Host "Current feature branch: $featureBranch`n"
git status

# 2. Commit everything
$commitMsg = Read-Host "Commit message"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    Write-Host "Empty commit message. Aborting." -ForegroundColor Red
    exit 1
}

git add -A
git commit -m $commitMsg

# 3. Push (handle first push vs later pushes)
git rev-parse --abbrev-ref "$featureBranch@{upstream}" 2>$null
if ($LASTEXITCODE -eq 0) {
    git push
} else {
    git push -u origin $featureBranch
}

# 4. Figure out main branch name
git show-ref --verify --quiet refs/heads/main
if ($LASTEXITCODE -eq 0) {
    $mainBranch = "main"
} else {
    git show-ref --verify --quiet refs/heads/master
    if ($LASTEXITCODE -eq 0) {
        $mainBranch = "master"
    } else {
        Write-Host "No local 'main' or 'master' branch found. Aborting." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Using main branch: $mainBranch`n"

# 5. Update main and merge
git checkout $mainBranch
git pull origin $mainBranch

git merge --no-ff $featureBranch
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nMerge failed (probably conflicts)." -ForegroundColor Red
    Write-Host "Fix conflicts, then run:"
    Write-Host "  git add ."
    Write-Host "  git commit"
    Write-Host "  git push origin $mainBranch"
    exit $LASTEXITCODE
}

git push origin $mainBranch

# 6. New branch
$newBranch = ""
while ([string]::IsNullOrWhiteSpace($newBranch)) {
    $newBranch = Read-Host "Name for new branch (cannot be empty)"
}

git checkout -b $newBranch
Write-Host "Done. Now on '$newBranch' based on '$mainBranch'." -ForegroundColor Green
