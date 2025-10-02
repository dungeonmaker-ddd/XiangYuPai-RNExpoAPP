# Fix import paths in auth store files

$file1 = "stores\authModule\useAuthStore.ts"
$file2 = "stores\authModule\useAuthData.ts"

Write-Host "Fixing import paths..."

# Fix useAuthStore.ts
$content1 = Get-Content $file1 -Raw -Encoding UTF8
$content1 = $content1 -replace "from '../../src/screens/AuthModule/constants'", "from '../../src/features/AuthModule/LoginMainPage/constants'"
$content1 = $content1 -replace "from '../../src/screens/AuthModule/types'", "from '../../src/features/AuthModule/LoginMainPage/types'"
$content1 | Set-Content $file1 -Encoding UTF8 -NoNewline

# Fix useAuthData.ts  
$content2 = Get-Content $file2 -Raw -Encoding UTF8
$content2 = $content2 -replace "from '../../src/screens/AuthModule/constants'", "from '../../src/features/AuthModule/LoginMainPage/constants'"
$content2 = $content2 -replace "from '../../src/screens/AuthModule/types'", "from '../../src/features/AuthModule/types'"
$content2 | Set-Content $file2 -Encoding UTF8 -NoNewline

Write-Host "Done! Now run: npx expo start -c"
