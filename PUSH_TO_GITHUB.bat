@echo off
cd /d "%~dp0"
echo ==============================================
echo   Pushing Viral Mia to GitHub (rnraihan/viralmia)
echo ==============================================
echo.
echo [1/2] Syncing latest auto-posts from GitHub...
git pull --rebase origin main
echo.
echo [2/2] Pushing updates to GitHub and Cloudflare...
git push -u origin main
echo.
echo ==============================================
echo   Done! Cloudflare is now deploying updates.
echo ==============================================
pause
