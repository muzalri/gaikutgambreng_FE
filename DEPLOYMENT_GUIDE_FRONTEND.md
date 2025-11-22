# Frontend Deployment Guide - React App

## 📋 Prerequisites

- ✅ Backend sudah running di `https://backend.pesantrenalihsanbekasi.or.id/`
- ✅ cPanel hosting dengan PHP support (untuk static hosting)
- ✅ SSL Certificate aktif untuk domain frontend

## 🚀 Step 1: Build Production

### Di Local (Windows):

1. **Install dependencies** (jika belum):
```powershell
cd z:\Kulyeah\gaikut_gambreng\react_alihsan\gaikutgambreng_FE
npm install
```

2. **Build untuk production**:
```powershell
npm run build
```

3. **Verifikasi build berhasil**:
   - Folder `build/` akan dibuat
   - Cek ada file `build/index.html`
   - Cek ada folder `build/static/`

## 📦 Step 2: Prepare Files untuk Upload

File yang perlu di-upload ke hosting:
```
✅ build/index.html
✅ build/static/ (semua isi folder)
✅ build/asset-manifest.json
✅ build/manifest.json
✅ build/robots.txt
✅ build/favicon.ico
✅ build/logo192.png, logo512.png (jika ada)
✅ public/.htaccess (sudah dibuat)
```

## 🌐 Step 3: Upload ke cPanel

### Opsi A: Via File Manager cPanel

1. **Login ke cPanel** domain frontend
2. **Buka File Manager**
3. **Navigate ke `public_html/`** (atau folder domain Anda)
4. **Upload semua isi folder `build/`**:
   - Upload `index.html`
   - Upload folder `static/` beserta isinya
   - Upload file lainnya
5. **Upload `.htaccess`** dari folder `public/`
6. **Set permissions** (biasanya sudah otomatis):
   - Files: 644
   - Folders: 755

### Opsi B: Via FTP/SFTP

1. **Buka FTP Client** (FileZilla, WinSCP, dll)
2. **Connect ke hosting**:
   - Host: ftp.yourdomain.com
   - Username: cpanel username
   - Password: cpanel password
   - Port: 21 (FTP) atau 22 (SFTP)
3. **Upload semua isi folder `build/`** ke `public_html/`
4. **Upload `.htaccess`**

### Opsi C: Via ZIP Upload (Tercepat)

1. **Compress folder build**:
```powershell
# Di folder gaikutgambreng_FE
Compress-Archive -Path build\* -DestinationPath frontend-build.zip
```

2. **Upload `frontend-build.zip` via File Manager**
3. **Extract di `public_html/`**
4. **Upload `.htaccess` terpisah**
5. **Hapus file `.zip`**

## ⚙️ Step 4: Configure Backend CORS

Backend harus allow domain frontend. Update `.env` di backend:

```env
# Di backend: .env
CLIENT_URL=https://www.pesantrenalihsanbekasi.or.id
```

Atau jika subdomain:
```env
CLIENT_URL=https://pesantrenalihsanbekasi.or.id
```

Restart backend setelah update CORS.

## 🔍 Step 5: Testing

### Test di Browser:

1. **Buka domain frontend**: `https://www.pesantrenalihsanbekasi.or.id`
2. **Test routing**: Klik link navigasi, URL harus berubah tanpa reload
3. **Test API calls**: Login, fetch data, dll
4. **Cek console**: Tidak ada CORS error
5. **Test di berbagai browser**: Chrome, Firefox, Safari, Edge

### Test API Connection:

Buka console browser (F12), jalankan:
```javascript
// Test API endpoint
fetch('https://backend.pesantrenalihsanbekasi.or.id/api/test')
  .then(r => r.json())
  .then(d => console.log('API Response:', d))
  .catch(e => console.error('API Error:', e));
```

## 🐛 Troubleshooting

### 1. Blank Page / White Screen
**Penyebab**: Path assets salah
**Solusi**: 
- Cek apakah semua file di `static/` ter-upload
- Cek `.htaccess` ada di folder yang sama dengan `index.html`
- Cek console browser untuk error 404

### 2. 404 Error pada Refresh
**Penyebab**: `.htaccess` tidak aktif atau salah konfigurasi
**Solusi**:
- Pastikan `.htaccess` ada di root public_html
- Pastikan mod_rewrite enabled di server (biasanya sudah default)
- Test dengan akses langsung route: `domain.com/admin/dashboard`

### 3. CORS Error
**Penyebab**: Backend belum allow domain frontend
**Solusi**:
```env
# Update di backend .env
CLIENT_URL=https://www.pesantrenalihsanbekasi.or.id
```
Restart backend.

### 4. Mixed Content Warning (HTTP/HTTPS)
**Penyebab**: Request ke HTTP dari HTTPS
**Solusi**:
- Pastikan `.env.production` menggunakan `https://` untuk API_URL
- Force HTTPS di `.htaccess` sudah aktif
- Cek SSL certificate valid untuk kedua domain

### 5. Images/Assets Not Loading
**Penyebab**: Path tidak sesuai
**Solusi**:
- Pastikan `REACT_APP_SERVER_URL` di `.env.production` correct
- Cek network tab browser untuk path yang dipanggil
- Pastikan backend folder `uploads/` accessible

## 📝 Post-Deployment Checklist

- [ ] Frontend accessible via domain
- [ ] React Router working (no 404 on refresh)
- [ ] API calls successful (no CORS error)
- [ ] Login/Authentication working
- [ ] Images loading correctly
- [ ] Google OAuth working (if applicable)
- [ ] SSL certificate valid (green padlock)
- [ ] Mobile responsive testing
- [ ] Performance check (Lighthouse score)

## 🔄 Update/Redeploy

Untuk update di kemudian hari:

1. **Pull latest code**
2. **Make changes**
3. **Build ulang**: `npm run build`
4. **Upload hanya file yang berubah** atau overwrite semua
5. **Clear browser cache**: `Ctrl + Shift + R`

## 🎯 Production URLs

- **Frontend**: https://www.pesantrenalihsanbekasi.or.id
- **Backend API**: https://backend.pesantrenalihsanbekasi.or.id/api
- **Backend Health**: https://backend.pesantrenalihsanbekasi.or.id/api/health

## 📞 Support

Jika ada masalah:
1. Cek console browser untuk error
2. Cek network tab untuk failed requests
3. Test backend endpoint langsung via browser atau Postman
4. Hubungi hosting support jika issue server configuration

---

**Status Deployment:**
- ⬜ Build production
- ⬜ Upload ke hosting
- ⬜ Configure CORS
- ⬜ Testing
- ⬜ Production ready ✅
