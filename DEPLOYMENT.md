# Panduan Deployment ke VPS

Dokumen ini menjelaskan cara setup automatic deployment dari GitHub ke VPS.

## Prerequisites

1. VPS dengan akses SSH
2. Node.js dan npm terinstall di VPS
3. Git terinstall di VPS
4. PM2 untuk process management (opsional tapi direkomendasikan)
5. Repository GitHub sudah dibuat

## Setup Awal di VPS

### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (jika belum ada)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (untuk process management)
sudo npm install -g pm2

# Install Git (jika belum ada)
sudo apt install git -y
```

### 2. Clone Repository ke VPS

```bash
# Buat directory untuk aplikasi
sudo mkdir -p /var/www
cd /var/www

# Clone repository (ganti dengan URL repo Anda)
git clone https://github.com/username/website-profile.git
cd website-profile

# Install dependencies
npm install

# Build aplikasi
npm run build
```

### 3. Setup PM2 untuk Production

```bash
# Start aplikasi dengan PM2
pm2 start npm --name "website-profile" -- start

# Setup PM2 untuk auto-start saat reboot
pm2 startup
pm2 save
```

### 4. Setup Nginx (Opsional - untuk reverse proxy)

```bash
# Install Nginx
sudo apt install nginx -y

# Buat konfigurasi Nginx
sudo nano /etc/nginx/sites-available/website-profile
```

Tambahkan konfigurasi berikut:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/website-profile /etc/nginx/sites-enabled/

# Test konfigurasi
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 5. Setup SSL dengan Let's Encrypt (Opsional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Setup SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Setup GitHub Actions

### 1. Generate SSH Key untuk VPS

Di VPS, jalankan:

```bash
# Generate SSH key (jika belum ada)
ssh-keygen -t ed25519 -C "github-actions-deploy"

# Copy public key ke authorized_keys
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys

# Tampilkan private key (untuk di-copy ke GitHub Secrets)
cat ~/.ssh/id_ed25519
```

### 2. Setup GitHub Secrets

1. Buka repository GitHub Anda
2. Pergi ke **Settings** > **Secrets and variables** > **Actions**
3. Klik **New repository secret**
4. Tambahkan secrets berikut:

   - `VPS_HOST`: IP address atau domain VPS Anda (contoh: `123.456.789.0` atau `vps.yourdomain.com`)
   - `VPS_USER`: Username SSH (biasanya `root` atau username lain)
   - `VPS_SSH_KEY`: Private SSH key yang sudah di-generate (paste seluruh isi file `~/.ssh/id_ed25519`)
   - `VPS_PORT`: Port SSH (default: `22`)
   - `VPS_DEPLOY_PATH`: Path ke project di VPS (contoh: `/var/www/website-profile`)

### 3. Setup Environment Variables

Jika aplikasi memerlukan environment variables, buat file `.env.production` di VPS:

```bash
cd /var/www/website-profile
nano .env.production
```

Tambahkan variabel yang diperlukan:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
# Tambahkan variabel lain yang diperlukan
```

## Cara Kerja

1. **Push ke GitHub**: Ketika Anda push code ke branch `main` atau `master`
2. **GitHub Actions Trigger**: Workflow akan otomatis ter-trigger
3. **Build di GitHub**: Aplikasi akan di-build di GitHub Actions runner
4. **Deploy ke VPS**: Melalui SSH, GitHub Actions akan:
   - Pull latest code dari GitHub
   - Install dependencies
   - Build aplikasi
   - Restart aplikasi dengan PM2

## Manual Deployment

Jika ingin deploy secara manual tanpa push ke GitHub:

```bash
# Di VPS, jalankan script deployment
cd /var/www/website-profile
bash scripts/deploy.sh
```

Atau secara manual:

```bash
cd /var/www/website-profile
git pull origin main
npm ci
npm run build
pm2 restart website-profile
```

## Troubleshooting

### PM2 tidak restart aplikasi

```bash
# Cek status PM2
pm2 status

# Cek logs
pm2 logs website-profile

# Restart manual
pm2 restart website-profile
```

### Permission Error

```bash
# Pastikan user memiliki permission untuk directory
sudo chown -R $USER:$USER /var/www/website-profile
```

### Port sudah digunakan

```bash
# Cek port yang digunakan
sudo lsof -i :3000

# Kill process jika perlu
sudo kill -9 <PID>
```

### Build Error

```bash
# Clear cache dan rebuild
rm -rf .next
npm run build
```

## Monitoring

### PM2 Monitoring

```bash
# Monitor aplikasi
pm2 monit

# Cek logs real-time
pm2 logs website-profile --lines 50

# Cek status
pm2 status
```

### System Resources

```bash
# Cek penggunaan CPU dan Memory
htop

# Cek disk space
df -h
```

## Backup

Disarankan untuk membuat backup sebelum deployment:

```bash
# Backup directory project
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/website-profile

# Atau backup dengan Git tag
git tag backup-$(date +%Y%m%d)
git push origin --tags
```

## Catatan Penting

1. **Security**: Pastikan SSH key disimpan dengan aman di GitHub Secrets
2. **Environment Variables**: Jangan commit file `.env` ke repository
3. **Database**: Jika menggunakan database, pastikan migration dijalankan saat deployment
4. **Testing**: Test deployment di staging environment terlebih dahulu
5. **Rollback**: Selalu siapkan plan untuk rollback jika terjadi masalah
