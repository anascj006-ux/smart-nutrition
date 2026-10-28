@echo off
echo ==============================================
echo Pushing Smart Nutrition to GitHub...
echo ==============================================
set "PATH=%LOCALAPPDATA%\github-copilot-git-2.53.0-4\cmd;%PATH%"
git push -u origin main
echo ==============================================
echo Done!
pause
