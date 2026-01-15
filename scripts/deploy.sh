#!/bin/bash

# Script deployment untuk VPS
# Script ini akan dijalankan di VPS untuk update aplikasi

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Konfigurasi
PROJECT_DIR="/var/www/website-profile"  # Sesuaikan dengan path di VPS Anda
BRANCH="main"  # atau "master" sesuai branch Anda
NODE_ENV="production"

# Navigate to project directory
cd $PROJECT_DIR

echo "📦 Pulling latest changes from Git..."
git fetch origin
git reset --hard origin/$BRANCH

echo "📥 Installing dependencies..."
npm ci --production=false

echo "🔨 Building application..."
npm run build

echo "🔄 Restarting application..."
# Jika menggunakan PM2
if command -v pm2 &> /dev/null; then
    pm2 restart website-profile || pm2 start npm --name "website-profile" -- start
    echo "✅ Application restarted with PM2"
else
    # Jika tidak menggunakan PM2, restart dengan systemd atau method lain
    echo "⚠️  PM2 not found. Please restart your application manually."
fi

echo "✨ Deployment completed successfully!"
