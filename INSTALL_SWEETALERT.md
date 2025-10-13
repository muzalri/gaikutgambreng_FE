# Install SweetAlert2

## Cara Install

### Gunakan CMD (bukan PowerShell):

```cmd
cd Z:\Kulyeah\gaikut_gambreng\react_alihsan\gaikutgambreng_FE
npm install sweetalert2
```

### Atau tambahkan manual ke package.json:

Buka `package.json` dan tambahkan di dependencies:

```json
"dependencies": {
  "sweetalert2": "^11.10.0",
  ...
}
```

Lalu jalankan:
```cmd
npm install
```

## Verifikasi

Setelah instalasi, pastikan `sweetalert2` muncul di:
1. `node_modules` folder
2. `package.json` di bagian dependencies

## Testing

Setelah install, coba login dengan kredensial salah untuk melihat SweetAlert2 beraksi!

### Test Cases:

1. **Email/Password kosong** → Alert warning
2. **Email/Password salah** → Alert error merah
3. **Login berhasil** → Alert success hijau + auto redirect
4. **Server tidak jalan** → Alert error koneksi
