# 启动 Expo 开发服务器
# 确保加载最新的环境变量

Write-Host "=== Expo 启动脚本 ===" -ForegroundColor Cyan
Write-Host ""

# 刷新环境变量
$env:ANDROID_HOME = [Environment]::GetEnvironmentVariable("ANDROID_HOME", "Machine")
$env:ANDROID_SDK_ROOT = [Environment]::GetEnvironmentVariable("ANDROID_SDK_ROOT", "Machine")
$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$env:Path = "$machinePath;$userPath"

# 显示 Android SDK 配置
Write-Host "Android SDK 配置:" -ForegroundColor Yellow
Write-Host "  ANDROID_HOME: $env:ANDROID_HOME" -ForegroundColor Green

# 验证 adb
$adbVersion = & adb version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ adb 已就绪" -ForegroundColor Green
} else {
    Write-Host "  ✗ adb 未找到" -ForegroundColor Red
}

Write-Host ""
Write-Host "正在启动 Expo..." -ForegroundColor Cyan
Write-Host ""

# 启动 Expo
npm run start

