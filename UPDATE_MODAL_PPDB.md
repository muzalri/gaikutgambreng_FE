# Update Modal Data Berkas Santri di PPDB

## 📋 Perubahan yang Dilakukan

### 1. **Import VoiceNoteService**
Menambahkan import untuk mengakses API voice note:
```jsx
import VoiceNoteService from "../../services/VoiceNoteService";
```

### 2. **State Management**
Menambahkan state untuk menyimpan data voice note:
```jsx
const [selectedVoiceNote, setSelectedVoiceNote] = useState(null);
```

### 3. **Update Fungsi `openModal`**
Menambahkan fetch voice note data berdasarkan `id_santri`:
```jsx
// Fetch voice note data
try {
  const vnResponse = await VoiceNoteService.getAll({ id_santri: santriId });
  const voiceNotes = vnResponse?.data?.voiceNotes || vnResponse?.data || [];
  if (voiceNotes.length > 0) {
    setSelectedVoiceNote(voiceNotes[0]); // Ambil voice note pertama
  }
} catch (e) {
  console.error("Error fetching voice note:", e);
  setSelectedVoiceNote(null);
}
```

### 4. **Redesign Modal Content**
Modal sekarang dibagi menjadi beberapa section dengan styling yang lebih informatif:

#### 📋 Data Pribadi Calon Santri
- Nama Lengkap
- Jenis Kelamin
- Tempat Lahir
- Tanggal Lahir
- Alamat
- No. Telp/WA
- Asal Sekolah/Madrasah
- Hafalan Al-Qur'an
- Angkatan
- Tahapan

#### 👨‍👩‍👧 Data Orang Tua
- Nama Ayah & Ibu
- Pekerjaan Ayah & Ibu
- Penghasilan Ayah & Ibu
- No. Telp Orang Tua
- Status Anak (Yatim/Piatu atau Orangtua Lengkap)
- Jumlah Tanggungan
- Kesediaan Sekolah Orang Tua

#### 🏠 Data Ekonomi Keluarga
- Status Kepemilikan Rumah
- Luas Tanah & Bangunan
- Kepemilikan Kendaraan

#### 🎤 Penilaian Voice Note (Bacaan Al-Qur'an)
- Surat yang dibaca (default: Yunus 71-78)
- Nilai (dengan color coding: hijau ≥80, kuning ≥60, merah <60)
- Status Penilaian (Sudah Dinilai/Belum Dinilai)
- Catatan Penilaian
- Tanggal Dinilai
- Audio Player untuk mendengarkan rekaman

#### 📄 Dokumen Berkas
- Semua dokumen yang sudah diupload dengan status dan preview

## 🎨 UI/UX Improvements

### Color Coding untuk Nilai Voice Note
```jsx
className={`p-3 mt-1 rounded font-bold text-center ${
  selectedVoiceNote.nilai >= 80 
    ? 'bg-green-100 text-green-700' 
    : selectedVoiceNote.nilai >= 60 
      ? 'bg-yellow-100 text-yellow-700' 
      : 'bg-red-100 text-red-700'
}`}
```

### Status Badge
- **Sudah Dinilai**: `bg-teal-100 text-teal-700`
- **Belum Dinilai**: `bg-orange-100 text-orange-700`

### Audio Player Integration
```jsx
<audio controls className="w-full">
  <source src={`http://localhost:5000/${encodeURI(selectedVoiceNote.file_path)}`} />
  Browser Anda tidak mendukung pemutar audio.
</audio>
```

## 📊 Data yang Ditampilkan

### Dari Model Berkas
Semua field dari model `Berkas.js` sekarang ditampilkan di modal:
- Data pribadi santri (10 fields)
- Data orang tua (10 fields)
- Data ekonomi keluarga (3 fields)
- Dokumen berkas (11 dokumen)

### Dari Model VoiceNote
Semua field dari model `VoiceNote.js` ditampilkan:
- `surat` - Surat yang dibaca
- `nilai` - Nilai penilaian (0-100)
- `catatan_penilaian` - Catatan dari penilai
- `status_penilaian` - Status (Sudah Dinilai/Belum Dinilai)
- `tanggal_penilaian` - Tanggal dinilai
- `file_path` - Audio rekaman dengan player

## 🔄 API Calls

### Fetch Santri Data
```javascript
const resp = await SantriService.getSantriById(santriId);
```

### Fetch Berkas Detail
```javascript
const berkasDetail = await BerkasService.getById(berkasId);
```

### Fetch Voice Note Data (NEW)
```javascript
const vnResponse = await VoiceNoteService.getAll({ id_santri: santriId });
```

## ✅ Fitur Tambahan

1. **Conditional Rendering**: Voice note section hanya muncul jika ada data voice note
2. **Date Formatting**: Tanggal lahir dan tanggal penilaian diformat ke bahasa Indonesia
3. **Empty State Handling**: Tampilkan "-" untuk field yang kosong
4. **Responsive Design**: Layout grid yang responsive untuk mobile dan desktop
5. **Section Headers**: Header dengan emoji untuk memudahkan navigasi visual

## 🎯 Benefits

- ✅ Admin dapat melihat **semua data** calon santri dalam satu modal
- ✅ Tidak perlu berpindah halaman untuk cek nilai voice note
- ✅ Data terorganisir dengan baik dalam section-section
- ✅ Visual feedback dengan color coding untuk nilai
- ✅ Audio player langsung di modal untuk review bacaan
- ✅ Informasi lengkap untuk membuat keputusan terima/tolak

## 🚀 Testing

Untuk test fitur ini:
1. Login sebagai admin
2. Buka halaman PPDB
3. Klik "Lihat" pada salah satu pendaftar
4. Modal akan menampilkan:
   - ✅ Semua data pribadi dari berkas
   - ✅ Data orang tua lengkap
   - ✅ Data ekonomi keluarga
   - ✅ Nilai voice note (jika sudah dinilai)
   - ✅ Audio player untuk mendengarkan rekaman
   - ✅ Semua dokumen berkas

---
**Updated:** November 9, 2025  
**Feature:** Enhanced PPDB Modal with Complete Berkas Data and Voice Note Integration
