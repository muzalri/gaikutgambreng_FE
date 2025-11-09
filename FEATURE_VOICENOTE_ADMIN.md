# Fitur Penilaian Voice Note Admin

## 📋 Deskripsi
Halaman admin untuk mengelola dan menilai rekaman bacaan Al-Qur'an (Voice Note) dari santri yang mendaftar.

## ✨ Fitur Utama

### 1. **Sidebar Menu**
- ✅ Menu "Voice Note" ditambahkan di AdminSidebar
- Icon: Microphone (FaMicrophone)
- Path: `/admin/voicenote`
- Accessible untuk role: `admin` dan `user`

### 2. **Filter & Search**
- **Filter Angkatan:** Dropdown mengambil data dari `angkatan_dropdown` model
- **Filter Status Penilaian:** 
  - Semua Status
  - Belum Dinilai
  - Sudah Dinilai
- **Search:** Cari berdasarkan nama santri atau asal sekolah
- Auto-reload data saat filter berubah

### 3. **Dashboard Statistics**
- **Total Voice Note:** Jumlah semua rekaman
- **Belum Dinilai:** Counter untuk status "Belum Dinilai" (yellow badge)
- **Sudah Dinilai:** Counter untuk status "Sudah Dinilai" (green badge)

### 4. **Tabel Data Voice Note**
Kolom:
- No (auto-increment dengan pagination)
- Santri (nama_lengkap)
- Angkatan
- Asal Sekolah
- Audio (audio player inline)
- Status (badge: Belum Dinilai / Sudah Dinilai)
- Nilai (0-100 atau "-" jika belum dinilai)
- Aksi (Nilai/Edit, Hapus)

### 5. **Penilaian Voice Note**
Modal penilaian berisi:
- **Info Santri:** Nama, Angkatan, Asal Sekolah
- **Audio Player:** Untuk mendengarkan rekaman
- **Form Input:**
  - Nilai (0-100) - Required
  - Catatan Penilaian (textarea) - Optional
- **Actions:** Simpan / Batal

### 6. **Pagination**
- Default: 10 items per page
- Navigation: Previous/Next buttons
- Info: "Menampilkan X sampai Y dari Z hasil"

## 🔧 Technical Details

### Files Created/Modified:

#### 1. AdminSidebar.jsx
```javascript
// Added FaMicrophone icon
import { FaMicrophone } from "react-icons/fa";

// Added menu item
{
  label: "Voice Note",
  icon: <FaMicrophone />,
  path: "/admin/voicenote",
  roles: ["admin", "user"],
}
```

#### 2. VoiceNote.jsx (NEW)
Path: `src/pages/Admin/VoiceNote.jsx`

**State Management:**
- `voiceNotes` - List of voice notes
- `angkatanOptions` - Dropdown options from angkatan_dropdown
- `filters` - angkatan, status_penilaian, search
- `pagination` - page, limit, total, totalPages
- `showModal` - Modal visibility
- `selectedVN` - Selected voice note for grading
- `penilaianData` - nilai, catatan_penilaian

**API Calls:**
- `VoiceNoteService.getAll(params)` - Fetch with filters
- `VoiceNoteService.updatePenilaian(id, data)` - Submit grade
- `VoiceNoteService.delete(id)` - Delete voice note
- `PendaftaranService.getAngkatanDropdown()` - Get angkatan options

#### 3. App.jsx
```javascript
// Import
import VoiceNote from "./pages/Admin/VoiceNote";

// Route
<Route
  path="/admin/voicenote"
  element={
    <ProtectedRoute>
      <VoiceNote />
    </ProtectedRoute>
  }
/>
```

## 🎯 User Flow

### Admin menilai Voice Note:
1. Login sebagai admin
2. Klik menu "Voice Note" di sidebar
3. Gunakan filter untuk menyaring data (opsional):
   - Pilih angkatan tertentu
   - Filter status penilaian
   - Search nama/sekolah
4. Lihat list voice notes dalam tabel
5. Dengarkan rekaman via audio player
6. Klik tombol "Nilai" atau "Edit"
7. Modal penilaian muncul:
   - Dengarkan rekaman lagi
   - Input nilai (0-100)
   - Tambahkan catatan (opsional)
   - Klik "Simpan Penilaian"
8. Data terupdate, status berubah "Sudah Dinilai"

### Admin hapus Voice Note:
1. Klik tombol "Hapus" pada row
2. Konfirmasi penghapusan
3. Data terhapus dari database

## 📊 Database Integration

### Model: VoiceNote
Fields yang digunakan:
- `id` - Primary key
- `id_santri` - Foreign key to santri
- `angkatan` - Filter by angkatan
- `nama_lengkap` - Display name
- `asal_sekolah` - Display info
- `file_path` - Audio file location
- `surat` - Default: "Yunus 71-78"
- `nilai` - Grade (0-100)
- `catatan_penilaian` - Admin's comment
- `status_penilaian` - "Belum Dinilai" / "Sudah Dinilai"
- `dinilai_oleh` - Admin ID who graded
- `tanggal_penilaian` - Grading date

### Model: AngkatanDropdown
Digunakan untuk filter angkatan dropdown.

## 🎨 UI/UX Features

### Color Coding:
- **Blue Card:** Total voice notes
- **Yellow Card:** Belum dinilai (warning)
- **Green Card:** Sudah dinilai (success)
- **Yellow Badge:** Status "Belum Dinilai"
- **Green Badge:** Status "Sudah Dinilai"

### Responsive Design:
- Grid layout untuk filters (1 col mobile, 4 cols desktop)
- Responsive table dengan horizontal scroll
- Mobile-friendly pagination

### Loading States:
- Spinner saat fetch data
- Empty state dengan icon dan pesan
- Disabled buttons saat loading

### Audio Player:
- Inline audio player di table
- Full-width audio player di modal
- Support multiple audio formats (mp3, wav, ogg, m4a)
- Auto-encode URI untuk handle spasi dan special characters

## ⚠️ Important Notes

1. **Audio Path:** File path sudah dinormalisasi (relative path)
2. **Authentication:** Protected route - requires admin login
3. **Validation:** Nilai harus 0-100
4. **Pagination:** Auto-reset ke page 1 saat filter berubah
5. **Real-time Update:** Data refresh setelah submit penilaian atau delete

## 🧪 Testing Checklist

- [ ] Menu Voice Note muncul di sidebar
- [ ] Filter angkatan load dari database
- [ ] Filter status penilaian bekerja
- [ ] Search nama/sekolah bekerja
- [ ] Audio player bisa play file
- [ ] Modal penilaian muncul dengan data benar
- [ ] Submit penilaian berhasil update database
- [ ] Status badge berubah setelah dinilai
- [ ] Delete voice note berhasil
- [ ] Pagination bekerja dengan benar
- [ ] Responsive di mobile dan desktop

---
**Created:** November 9, 2025  
**Feature:** Admin Voice Note Grading System
