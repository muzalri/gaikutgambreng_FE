# Instalasi Axios untuk Frontend

Jika axios belum terinstall, silakan install dengan salah satu cara berikut:

## Cara 1: Menggunakan CMD (Recommended)
```cmd
cd z:\Kulyeah\gaikut_gambreng\react_alihsan\gaikutgambreng_FE
npm install axios
```

## Cara 2: Menggunakan PowerShell (dengan Set Execution Policy)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
cd z:\Kulyeah\gaikut_gambreng\react_alihsan\gaikutgambreng_FE
npm install axios
```

## Cara 3: Manual add ke package.json
Tambahkan axios ke dependencies di package.json:
```json
"dependencies": {
  "axios": "^1.6.0",
  ...
}
```
Kemudian jalankan:
```cmd
npm install
```

## Verifikasi
Setelah instalasi, pastikan axios muncul di `node_modules` dan tercantum di `package.json`.
