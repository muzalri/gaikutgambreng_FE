# Refactoring AdminHeader Component

## Perubahan yang Dilakukan

### 1. **Komponen AdminHeader (BARU!)** ✅
**File:** `src/components/AdminHeader.jsx`

Komponen header yang reusable untuk semua halaman admin dengan fitur:
- ✅ Sticky header dengan gradient teal
- ✅ Logo pesantren
- ✅ Nama admin dinamis dari backend (localStorage)
- ✅ Avatar admin
- ✅ Link ke halaman profil (klik nama/avatar)
- ✅ Hover effect untuk interaksi yang lebih baik

**Kode:**
```jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminService from "../services/AdminService";

export default function AdminHeader() {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const admin = AdminService.getCurrentAdmin();
    setAdminData(admin);
  }, []);

  const adminName = adminData?.nama || "Admin";
  const adminAvatar = "/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between w-full px-10 py-5 text-white shadow bg-gradient-to-r from-teal-800 to-teal-600">
      <div className="flex items-center gap-3">
        <img src="/assets/logo3.png" alt="Logo" className="h-8" />
      </div>
      <Link 
        to="/admin/profil" 
        className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer"
      >
        <span className="font-semibold">Halo, {adminName}</span>
        <img
          src={adminAvatar}
          alt="Admin"
          className="object-cover w-8 h-8 border-2 border-white rounded-full"
        />
      </Link>
    </header>
  );
}
```

---

### 2. **Refactoring Semua Halaman Admin** ✅

Semua halaman admin telah diupdate untuk menggunakan `AdminHeader` component:

#### ✅ AdminDashboard.jsx
**Perubahan:**
- Import `AdminHeader`
- Hapus state `adminData`, `loading`, `adminName`, `adminAvatar`
- Hapus fungsi `handleLogout` (sudah ada di sidebar)
- Hapus hardcoded `<header>` element
- Gunakan `<AdminHeader />` component
- Simplified `useEffect` hanya untuk cek login

**Before:**
```jsx
const [adminData, setAdminData] = useState(null);
const [loading, setLoading] = useState(true);
const handleLogout = async () => { ... }

<header className="sticky top-0...">
  {/* Hardcoded header dengan logout button */}
</header>
```

**After:**
```jsx
import AdminHeader from "../../components/AdminHeader";

<AdminHeader />
```

---

#### ✅ Santri.jsx
**Perubahan:**
- Import `AdminHeader`
- Hapus state `adminData`, `adminName`
- Hapus fungsi `handleLogout`
- Hapus hardcoded `<header>` element
- Gunakan `<AdminHeader />` component
- Tambah check login di `useEffect`

**Before:**
```jsx
const [adminData, setAdminData] = useState(null);
const handleLogout = async () => { ... }
const adminName = adminData?.nama || "Admin";

<header>...</header>
```

**After:**
```jsx
import AdminHeader from "../../components/AdminHeader";

useEffect(() => {
  if (!AdminService.isLoggedIn()) {
    navigate("/admin");
    return;
  }
  fetchSantri();
}, [navigate]);

<AdminHeader />
```

---

#### ✅ Pendidik.jsx
**Perubahan sama seperti Santri.jsx**

---

#### ✅ Artikel.jsx
**Perubahan:**
- Import `AdminHeader` dan dependencies yang diperlukan
- Tambah `useNavigate` dari react-router-dom
- Import `AdminService`
- Tambah check login di `useEffect`
- Hapus hardcoded `<header>` element
- Gunakan `<AdminHeader />` component

**Before:**
```jsx
import React from "react";
import AdminSidebar from "../../components/AdminSidebar";

<header>
  <a href="/admin/profil">...</a>
</header>
```

**After:**
```jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";

React.useEffect(() => {
  if (!AdminService.isLoggedIn()) {
    navigate("/admin");
    return;
  }
}, [navigate]);

<AdminHeader />
```

---

#### ✅ PPDB.jsx
**Perubahan sama seperti Santri.jsx**

---

#### ✅ Profil.jsx
**Perubahan:**
- Import `AdminHeader`
- Hapus state `adminAvatar` (tidak digunakan lagi)
- Hapus hardcoded `<header>` element
- Gunakan `<AdminHeader />` component
- Data admin tetap fetch dari backend untuk ditampilkan di halaman profil

**Before:**
```jsx
const adminAvatar = "/assets/teachers/...";

<header className="sticky top-0...">
  <span>Halo, {adminName}</span>
  <img src={adminAvatar} />
</header>
```

**After:**
```jsx
import AdminHeader from "../../components/AdminHeader";

<AdminHeader />
```

---

## Keuntungan Refactoring

### 🎯 Code Reusability
- ✅ Header code hanya ada di 1 tempat (AdminHeader.jsx)
- ✅ Tidak ada duplikasi kode header di setiap halaman
- ✅ Lebih mudah maintenance

### 🔄 Consistency
- ✅ Semua halaman admin memiliki header yang sama persis
- ✅ Nama admin selalu dinamis dari backend
- ✅ Link profil konsisten di semua halaman

### 🧹 Clean Code
- ✅ Hapus state yang tidak perlu (`adminData`, `loading` di setiap halaman)
- ✅ Hapus fungsi `handleLogout` duplikat (sudah ada di sidebar)
- ✅ Setiap halaman lebih fokus ke konten utama

### 🚀 Performance
- ✅ Tidak ada multiple fetch admin data di setiap halaman
- ✅ AdminHeader fetch sekali dari localStorage
- ✅ Lebih ringan dan cepat

### 🛡️ Security
- ✅ Semua halaman memiliki check login yang konsisten
- ✅ Redirect ke login jika session habis

---

## Alur Penggunaan

### 1. Klik Profil di Header
1. User klik **nama admin** atau **avatar** di header (semua halaman)
2. React Router navigate ke `/admin/profil`
3. Halaman Profil fetch data terbaru dari backend
4. Tampilkan detail lengkap admin

### 2. Logout
1. User klik tombol **"Keluar"** di sidebar (bukan di header)
2. AdminSidebar memanggil `AdminService.logout()`
3. Clear localStorage
4. Redirect ke `/admin` (login page)

---

## Struktur File

```
src/
├── components/
│   ├── AdminHeader.jsx       ← NEW (reusable header component)
│   ├── AdminSidebar.jsx      ← UPDATED (logout button functional)
│   └── ProtectedRoute.jsx
├── pages/
│   └── Admin/
│       ├── AdminDashboard.jsx  ← UPDATED (use AdminHeader)
│       ├── AdminLogin.jsx
│       ├── Santri.jsx          ← UPDATED (use AdminHeader)
│       ├── Pendidik.jsx        ← UPDATED (use AdminHeader)
│       ├── Artikel.jsx         ← UPDATED (use AdminHeader)
│       ├── PPDB.jsx            ← UPDATED (use AdminHeader)
│       └── Profil.jsx          ← UPDATED (use AdminHeader)
└── services/
    └── AdminService.js
```

---

## Testing Checklist

### ✅ Header Component
- [ ] Header tampil di semua halaman admin
- [ ] Nama admin dinamis sesuai yang login
- [ ] Logo tampil dengan benar
- [ ] Avatar tampil dengan benar

### ✅ Link Profil
- [ ] Klik nama admin → redirect ke `/admin/profil`
- [ ] Klik avatar → redirect ke `/admin/profil`
- [ ] Hover effect berfungsi (opacity change)

### ✅ Halaman Profil
- [ ] Data admin fetch dari backend
- [ ] Tampilkan nama, email, telepon, role, deskripsi
- [ ] Fallback ke localStorage jika fetch gagal
- [ ] Button "Kembali ke Dashboard" berfungsi

### ✅ Logout
- [ ] Tombol logout hanya ada di sidebar (tidak di header)
- [ ] Klik logout → clear session → redirect ke login
- [ ] Tidak bisa akses halaman admin setelah logout

### ✅ Protected Routes
- [ ] Semua halaman admin redirect ke login jika belum login
- [ ] Session check konsisten di semua halaman

---

## Migration Guide (Jika Ada Halaman Admin Baru)

Untuk menambahkan halaman admin baru, ikuti pattern ini:

```jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";

export default function NewAdminPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    if (!AdminService.isLoggedIn()) {
      navigate("/admin");
      return;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminHeader />
      <div className="flex">
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
          <AdminSidebar activeMenu="MenuName" />
        </div>
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            {/* Your page content here */}
          </main>
        </div>
      </div>
    </div>
  );
}
```

---

## API Endpoints yang Digunakan

### Get Admin Profile
```
GET /api/admin/profile/:id

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "nama": "Admin Pusat",
    "email": "admin@gaikut.com",
    "no_telp": "081234567890",
    "role": "Super Admin",
    "isi": "Administrator utama sistem"
  }
}
```

### Logout
```
POST /api/admin/logout

Response:
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

Dokumentasi dibuat: **15 Oktober 2025**
