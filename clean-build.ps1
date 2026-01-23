# Script untuk membersihkan cache dan rebuild Next.js

Write-Host "Membersihkan cache Next.js..." -ForegroundColor Yellow

# Hapus folder .next jika ada
if (Test-Path .next) {
    Write-Host "Menghapus folder .next..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
}

# Hapus node_modules/.cache jika ada
if (Test-Path node_modules\.cache) {
    Write-Host "Menghapus node_modules/.cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
}

Write-Host "Cache berhasil dibersihkan!" -ForegroundColor Green
Write-Host ""
Write-Host "Sekarang jalankan: npm run build" -ForegroundColor Cyan
