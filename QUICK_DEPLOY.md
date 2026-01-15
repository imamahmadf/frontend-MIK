# 🚀 Quick Start Deployment

Panduan cepat untuk setup automatic deployment dari GitHub ke VPS.

## ⚡ Setup Cepat (5 Menit)

### 1. Setup di VPS (Sekali Saja)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
cd /var/www
sudo git clone https://github.com/username/website-profile.git
cd website-profile
sudo chown -R $USER:$USER .

# Install & Build
npm install
npm run build

# Start dengan PM2
pm2 start npm --name "website-profile" -- start
pm2 startup
pm2 save
```

### 2. Generate SSH Key untuk GitHub Actions

```bash
# Di VPS, generate SSH key
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""

# Copy public key ke authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Tampilkan private key (COPY INI)
cat ~/.ssh/github_actions
```

### 3. Setup GitHub Secrets

1. Buka: **GitHub Repo** → **Settings** → **Secrets and variables** → **Actions**
2. Klik **New repository secret**
3. Tambahkan secrets berikut:

| Secret Name       | Value                         | Contoh                                   |
| ----------------- | ----------------------------- | ---------------------------------------- |
| `VPS_HOST`        | IP atau domain VPS            | `123.456.789.0` atau `vps.example.com`   |
| `VPS_USER`        | Username SSH                  | `root` atau `ubuntu`                     |
| `VPS_SSH_KEY`     | Private SSH key (dari step 2) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VPS_PORT`        | Port SSH (opsional)           | `22`                                     |
| `VPS_DEPLOY_PATH` | Path project di VPS           | `/var/www/website-profile`               |

### 4. Setup Environment Variables di VPS

```bash
cd /var/www/website-profile
nano .env.production
```

Tambahkan:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

### 5. Test Deployment

1. Push perubahan ke branch `main` atau `master`
2. Cek GitHub Actions: **Actions** tab di repository
3. Jika berhasil, aplikasi akan otomatis ter-update di VPS

## 🔧 Troubleshooting

### Deployment Gagal

```bash
# Cek logs di VPS
cd /var/www/website-profile
pm2 logs website-profile

# Cek status
pm2 status

# Manual restart
pm2 restart website-profile
```

### Permission Error

```bash
sudo chown -R $USER:$USER /var/www/website-profile
```

### Port Sudah Digunakan

```bash
# Cek port 3000
sudo lsof -i :3000

# Kill process jika perlu
sudo kill -9 <PID>
```

## 📚 Dokumentasi Lengkap

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk dokumentasi lengkap.
