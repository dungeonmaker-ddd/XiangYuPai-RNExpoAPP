@echo off
echo === 启动 Expo 开发服务器 ===
echo.
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0start-expo.ps1"
pause

