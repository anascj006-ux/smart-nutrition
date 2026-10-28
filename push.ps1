$env:Path = "$env:LOCALAPPDATA\github-copilot-git-2.53.0-4\cmd;" + $env:Path
Write-Host "Pushing Smart Nutrition to GitHub..." -ForegroundColor Green
git push -u origin main
