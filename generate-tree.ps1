# PowerShell script: Generate directory tree structure for key project folders
# Usage: .\generate-tree.ps1

# Generate directory tree for key folders without files in the deepest level folders
# Generate app tree
tree app /A | findstr /v /r /c:"^|   |   |   |   " > temp_app_tree.txt

# Generate src tree
tree src /A | findstr /v /r /c:"^|   |   |   |   " > temp_src_tree.txt

# Generate assets tree
tree assets /A | findstr /v /r /c:"^|   |   |   |   " > temp_assets_tree.txt

# Generate hooks tree
tree hooks /A | findstr /v /r /c:"^|   |   |   |   " > temp_hooks_tree.txt

# Generate constants tree
tree constants /A | findstr /v /r /c:"^|   |   |   |   " > temp_constants_tree.txt

# Generate components tree
tree components /A | findstr /v /r /c:"^|   |   |   |   " > temp_components_tree.txt

# Generate stores tree
tree stores /A | findstr /v /r /c:"^|   |   |   |   " > temp_stores_tree.txt

# Generate services tree
tree services /A | findstr /v /r /c:"^|   |   |   |   " > temp_services_tree.txt

# Combine all trees
Get-Content temp_app_tree.txt, temp_src_tree.txt, temp_assets_tree.txt, temp_hooks_tree.txt, temp_constants_tree.txt, temp_components_tree.txt, temp_stores_tree.txt, temp_services_tree.txt | Out-File temp_tree.txt

# Read the generated file content
$content = Get-Content temp_tree.txt

# Add header information before content
$header = @"
---
alwaysApply: true
---
"@

# Combine header and content
$finalContent = $header + "`r`n" + ($content -join "`r`n")

# Write final file to .cursor/rules/ directory
$finalContent | Out-File -FilePath ".cursor/rules/project.mdc" -Encoding UTF8

# Clean up temporary files
Remove-Item temp_tree.txt, temp_app_tree.txt, temp_src_tree.txt, temp_assets_tree.txt, temp_hooks_tree.txt, temp_constants_tree.txt, temp_components_tree.txt, temp_stores_tree.txt, temp_services_tree.txt

Write-Host "Directory tree has been generated to .cursor/rules/project.mdc file" -ForegroundColor Green
Write-Host "Including: app, src, assets, hooks, constants, components, stores, services directories" -ForegroundColor Yellow
Write-Host "Files in deepest level folders are excluded for cleaner structure" -ForegroundColor Cyan
