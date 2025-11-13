import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import { getImageUrl } from "../../config/api";
import AdminService from "../../services/AdminService";
import SantriService from "../../services/SantriService";
import BerkasService from "../../services/BerkasService";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

export default function Santri() {
  const navigate = useNavigate();
  const [santriList, setSantriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  // Modal state
  const [viewModal, setViewModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showImageView, setShowImageView] = useState(false);
  const fileInputRef = useRef();

  // Form state untuk tambah santri
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    no_telp: "",
    alamat: "",
    asal_sekolah: "",
    angkatan: "",
    avatar: null,
  });
  const [preview, setPreview] = useState(null);

  const getDocumentsFromSelectedBerkas = () => {
    const b = selectedSantri?.berkas_detail || {};
    const docs = [
      { key: 'kartu_keluarga', label: 'Kartu Keluarga' },
      { key: 'akta_kelahiran', label: 'Akta Kelahiran' },
      { key: 'rapor', label: 'Rapor Kelas 5' },
      { key: 'surat_kematian', label: 'Surat Kematian' },
      { key: 'foto_santri', label: 'Pas Foto 4x6' },
      { key: 'sertifikat_hafalan', label: 'Sertifikat Hafalan' },
      { key: 'sertifikat_penghargaan', label: 'Sertifikat Penghargaan' },
    ];
    
    // Filter hanya dokumen yang benar-benar diunggah (field tidak null/kosong)
    return docs
      .filter((d) => b[d.key]) // Hanya ambil yang ada datanya
      .map((d) => {
        const rawPath = b[d.key];
        const normalized = rawPath ? `/${String(rawPath).replace(/\\\\/g, '/').replace(/^\/?/, '')}` : '';
        return {
          ...d,
          path: rawPath || '',
          url: rawPath ? getImageUrl(normalized) : '',
          filename: rawPath ? normalized.split('/').pop() : '',
          exists: Boolean(rawPath)
        };
      });
  };

  const getExt = (filename = '') => (filename.split('.').pop() || '').toLowerCase();
  const isImageExt = (ext) => ['png','jpg','jpeg','webp','gif'].includes(ext);
  const isPdfExt = (ext) => ext === 'pdf';

  const handleViewDocument = async (doc) => {
    if (!doc?.exists || !doc?.url) {
      await Swal.fire({ title: 'Tidak tersedia', text: 'Dokumen belum diunggah.', icon: 'info' });
      return;
    }
    const ext = getExt(doc.filename || doc.path || '');
    if (isImageExt(ext)) {
      await Swal.fire({
        title: doc.label,
        imageUrl: doc.url,
        imageAlt: doc.filename || 'Preview',
        width: 720,
        confirmButtonColor: '#0f766e',
        confirmButtonText: 'Tutup',
      });
      return;
    }
    if (isPdfExt(ext)) {
      window.open(doc.url, '_blank', 'noopener,noreferrer');
      return;
    }
    await Swal.fire({
      icon: 'info',
      title: 'Preview Tidak Tersedia',
      text: 'Format file ini tidak dapat di-preview. File akan dibuka di tab baru.',
      confirmButtonColor: '#0f766e'
    });
    window.open(doc.url, '_blank', 'noopener,noreferrer');
  };

  const openViewModal = async (santri) => {
    setViewModal(true);
    setModalLoading(true);
    setSelectedSantri(null);
    try {
      // Ambil data berkas milik santri untuk diisi ke modal
      const berkasResp = await BerkasService.getAll({ id_santri: santri.id, limit: 1000 });
      const berkasList = berkasResp?.data || [];

      // Pilih berkas dengan prioritas: Diterima > tahapan tertinggi > terbaru
      const sorted = [...berkasList].sort((a, b) => {
        const statusScore = (x) => (x?.status === 'Diterima' ? 2 : 0) + (x?.tahapan || 0);
        const byStatusTahap = statusScore(b) - statusScore(a);
        if (byStatusTahap !== 0) return byStatusTahap;
        const aTime = new Date(a?.created_at || 0).getTime();
        const bTime = new Date(b?.created_at || 0).getTime();
        return bTime - aTime;
      });
      const chosen = sorted[0] || null;

      if (chosen) {
        const enriched = {
          ...santri,
          // Override dengan data dari berkas yang disubmit
          nama_lengkap: chosen.nama_lengkap || santri.nama_lengkap || santri.nama,
          asal_sekolah: chosen.asal_sekolah ?? santri.asal_sekolah,
          alamat: chosen.alamat ?? santri.alamat,
          no_telp: chosen.no_telp ?? santri.no_telp,
          angkatan: chosen.angkatan || santri.angkatan,
          jenis_kelamin: chosen.jenis_kelamin,
          tempat_lahir: chosen.tempat_lahir,
          tanggal_lahir: chosen.tanggal_lahir,
          // Simpan ringkasan berkas yang penting
          berkas_detail: chosen,
        };
        setSelectedSantri(enriched);
      } else {
        setSelectedSantri(santri);
      }
    } catch (e) {
      setSelectedSantri(santri);
    } finally {
      setModalLoading(false);
    }
  };

  const closeViewModal = () => {
    setViewModal(false);
    setSelectedSantri(null);
    setShowAvatarMenu(false);
    setShowImageView(false);
  };

  const openAddModal = () => {
    setAddModal(true);
    setFormData({
      nama: "",
      email: "",
      no_telp: "",
      alamat: "",
      asal_sekolah: "",
      angkatan: "",
      avatar: null,
    });
    setPreview(null);
  };

  const closeAddModal = () => {
    setAddModal(false);
    setFormData({
      nama: "",
      email: "",
      no_telp: "",
      alamat: "",
      asal_sekolah: "",
      angkatan: "",
      avatar: null,
    });
    setPreview(null);
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    setShowAvatarMenu((v) => !v);
  };

  const handleEditPhoto = () => {
    setShowAvatarMenu(false);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleViewPhoto = () => {
    setShowAvatarMenu(false);
    setShowImageView(true);
  };

  const handlePhotoChange = (e) => {
    // TODO: upload logic
    setShowAvatarMenu(false);
    // Optionally update selectedSantri.avatar with preview
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama || !formData.email) {
      alert("Nama dan email harus diisi!");
      return;
    }

    try {
      // TODO: Implement create santri API call
      console.log("Creating santri:", formData);
      alert("Santri berhasil ditambahkan!");
      closeAddModal();
      fetchSantri(); // Refresh data
    } catch (error) {
      console.error("Error creating santri:", error);
      alert("Gagal menambahkan santri");
    }
  };

  useEffect(() => {
    // Check if admin is logged in
    if (!AdminService.isLoggedIn()) {
      navigate("/admin");
      return;
    }

    // Fetch data santri
    fetchSantri();
  }, [navigate]);

  const fetchSantri = async () => {
    try {
      setLoading(true);
      // Ambil semua berkas lalu filter yang diterima atau tahapan >= 5
      const berkasResp = await BerkasService.getAll({ limit: 1000 });
      const berkasList = berkasResp?.data || [];
      // Kumpulkan opsi tahun/angkatan dari field angkatan pada berkas
      const yearSet = new Set();
      const acceptedBySantri = new Map();
      for (const b of berkasList) {
        const eligible = (b?.status === 'Diterima') || ((b?.tahapan || 0) >= 5);
        if (eligible && b?.id_santri) {
          const angkatanValue = b?.angkatan ? String(b.angkatan) : null;
          if (angkatanValue) yearSet.add(angkatanValue);
          // Simpan angkatan dan nama_lengkap dari Berkas untuk santri terkait
          if (!acceptedBySantri.has(b.id_santri)) {
            acceptedBySantri.set(b.id_santri, {
              angkatan: b.angkatan || '-',
              nama_lengkap: b.nama_lengkap || null,
              tahun_masuk: angkatanValue || null,
            });
          }
        }
      }
      // Set opsi tahun/angkatan (urut desc berdasarkan angka yang terdeteksi)
      const extractYearNum = (val) => {
        const m = String(val).match(/\d{4}/);
        return m ? parseInt(m[0], 10) : null;
      };
      const sortedOptions = Array.from(yearSet).sort((a, b) => {
        const na = extractYearNum(a);
        const nb = extractYearNum(b);
        if (na && nb) return nb - na;
        if (na && !nb) return -1;
        if (!na && nb) return 1;
        return String(b).localeCompare(String(a));
      });
      setYearOptions(sortedOptions);

      // Ambil semua santri, lalu filter hanya yang ada di acceptedBySantri
      const response = await SantriService.getAllSantri();
      if (response.success) {
        const all = response.data || [];
        const filtered = all
          .filter((s) => acceptedBySantri.has(s.id))
          .map((s) => {
            const info = acceptedBySantri.get(s.id) || {};
            return { ...s, angkatan: info.angkatan, nama_lengkap: info.nama_lengkap, tahun_masuk: info.tahun_masuk };
          });
        setSantriList(filtered);
      }
    } catch (error) {
      console.error("Error fetching santri:", error);
      alert("Gagal mengambil data santri");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchKeyword.trim()) {
      fetchSantri();
      return;
    }

    try {
      setLoading(true);
      // Lakukan pencarian santri terlebih dahulu
      const response = await SantriService.searchSantri(searchKeyword);
      const searched = response.success ? (response.data || []) : [];

      // Ambil berkas untuk menentukan siapa yang diterima/tahapan 5
      const berkasResp = await BerkasService.getAll({ limit: 1000 });
      const berkasList = berkasResp?.data || [];
      const acceptedBySantri = new Map();
      for (const b of berkasList) {
        const eligible = (b?.status === 'Diterima') || ((b?.tahapan || 0) >= 5);
        if (eligible && b?.id_santri) {
          if (!acceptedBySantri.has(b.id_santri)) {
            acceptedBySantri.set(b.id_santri, {
              angkatan: b.angkatan || '-',
              nama_lengkap: b.nama_lengkap || null,
            });
          }
        }
      }

      const filtered = searched
        .filter((s) => acceptedBySantri.has(s.id))
        .map((s) => {
          const info = acceptedBySantri.get(s.id) || {};
          return { ...s, angkatan: info.angkatan, nama_lengkap: info.nama_lengkap };
        });
      setSantriList(filtered);
    } catch (error) {
      // Jika backend tidak tersedia, gunakan data dummy dengan filter
      console.warn("Backend tidak tersedia, menggunakan data dummy");
      const dummyData = [
        {
          id: 1,
          nama: "Ahmad Fauzi",
          email: "ahmad.fauzi@email.com",
          asal_sekolah: "SD Al-Ihsan",
          alamat: "Jl. Merdeka No. 123",
          angkatan: "2024",
          foto: "/assets/hero/profile-placeholder.png",
          created_at: "2024-01-15T10:00:00Z"
        },
        {
          id: 2,
          nama: "Siti Nurhaliza",
          email: "siti.nurhaliza@email.com",
          asal_sekolah: "MI Al-Falah",
          alamat: "Jl. Pendidikan No. 456",
          angkatan: "2024",
          foto: "/assets/hero/profile-placeholder.png",
          created_at: "2024-01-16T10:00:00Z"
        }
      ];
      const filteredData = dummyData.filter(santri => 
        santri.nama.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        santri.email.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setSantriList(filteredData);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = async () => {
    try {
      Swal.fire({
        title: 'Memproses...',
        text: 'Sedang mengumpulkan data santri',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Ambil data lengkap untuk semua santri yang akan di-export
      const santriToExport = selectedYear 
        ? santriList.filter(s => String(s.tahun_masuk || '') === String(selectedYear))
        : santriList;

      // Ambil berkas detail untuk setiap santri
      const enrichedData = await Promise.all(
        santriToExport.map(async (santri) => {
          try {
            // Ambil berkas detail
            const berkasResp = await BerkasService.getAll({ id_santri: santri.id, limit: 1000 });
            const berkasList = berkasResp?.data || [];

            // Pilih berkas dengan prioritas: Diterima > tahapan tertinggi > terbaru
            const sorted = [...berkasList].sort((a, b) => {
              const statusScore = (x) => (x?.status === 'Diterima' ? 2 : 0) + (x?.tahapan || 0);
              const byStatusTahap = statusScore(b) - statusScore(a);
              if (byStatusTahap !== 0) return byStatusTahap;
              const aTime = new Date(a?.created_at || 0).getTime();
              const bTime = new Date(b?.created_at || 0).getTime();
              return bTime - aTime;
            });
            const berkas = sorted[0] || {};

            // Generate document URLs
            const baseUrl = 'http://localhost:5000';
            const docs = [
              { key: 'kartu_keluarga', label: 'Kartu Keluarga' },
              { key: 'akta_kelahiran', label: 'Akta Kelahiran' },
              { key: 'rapor', label: 'Rapor Kelas 5' },
              { key: 'surat_kematian', label: 'Surat Kematian' },
              { key: 'foto_santri', label: 'Pas Foto 4x6' },
              { key: 'sertifikat_hafalan', label: 'Sertifikat Hafalan' },
              { key: 'sertifikat_penghargaan', label: 'Sertifikat Penghargaan' },
            ];

            const documentUrls = {};
            docs.forEach(doc => {
              if (berkas[doc.key]) {
                const normalized = `/${String(berkas[doc.key]).replace(/\\\\/g, '/').replace(/^\/?/, '')}`;
                documentUrls[doc.label] = `${baseUrl}${normalized}`;
              } else {
                documentUrls[doc.label] = '-';
              }
            });

            return {
              // Data Pribadi
              'Nama Lengkap': berkas.nama_lengkap || santri.nama_lengkap || santri.nama || '-',
              'Jenis Kelamin': berkas.jenis_kelamin || '-',
              'Tempat Lahir': berkas.tempat_lahir || '-',
              'Tanggal Lahir': berkas.tanggal_lahir ? new Date(berkas.tanggal_lahir).toLocaleDateString('id-ID') : '-',
              'Alamat': berkas.alamat || santri.alamat || '-',
              'No. Telp/WA': berkas.no_telp || santri.no_telp || '-',
              'Asal Sekolah/Madrasah': berkas.asal_sekolah || santri.asal_sekolah || '-',
              'Hafalan Al-Qur\'an': berkas.hafalan_quran || '-',
              'Angkatan': berkas.angkatan || santri.angkatan || '-',
              
              // Data Orang Tua
              'Nama Ayah': berkas.nama_ayah || '-',
              'Pekerjaan Ayah': berkas.pekerjaan_ayah || '-',
              'Penghasilan Ayah': berkas.penghasilan_ayah || '-',
              'Nama Ibu': berkas.nama_ibu || '-',
              'Pekerjaan Ibu': berkas.pekerjaan_ibu || '-',
              'Penghasilan Ibu': berkas.penghasilan_ibu || '-',
              'No. Telp Orang Tua': berkas.no_telp_ortu || '-',
              'Status Anak': berkas.status_anak || '-',
              'Jumlah Tanggungan': berkas.jumlah_tanggungan || '-',
              'Kesediaan Sekolah Ortu': berkas.kesediaan_sekolah_ortu || '-',
              
              // Data Ekonomi Keluarga
              'Status Kepemilikan Rumah': berkas.status_kepemilikan_rumah || '-',
              'Luas Tanah & Bangunan': berkas.luas_tanah_bangunan || '-',
              'Kepemilikan Kendaraan': berkas.kepemilikan_kendaraan || '-',
              
              // Link Dokumen
              'Link Kartu Keluarga': documentUrls['Kartu Keluarga'],
              'Link Akta Kelahiran': documentUrls['Akta Kelahiran'],
              'Link Rapor Kelas 5': documentUrls['Rapor Kelas 5'],
              'Link Surat Kematian': documentUrls['Surat Kematian'],
              'Link Pas Foto 4x6': documentUrls['Pas Foto 4x6'],
              'Link Sertifikat Hafalan': documentUrls['Sertifikat Hafalan'],
              'Link Sertifikat Penghargaan': documentUrls['Sertifikat Penghargaan'],
            };
          } catch (error) {
            console.error(`Error fetching berkas for santri ${santri.id}:`, error);
            return {
              'Nama Lengkap': santri.nama_lengkap || santri.nama || '-',
              'Jenis Kelamin': '-',
              'Tempat Lahir': '-',
              'Tanggal Lahir': '-',
              'Alamat': santri.alamat || '-',
              'No. Telp/WA': santri.no_telp || '-',
              'Asal Sekolah/Madrasah': santri.asal_sekolah || '-',
              'Hafalan Al-Qur\'an': '-',
              'Angkatan': santri.angkatan || '-',
              'Nama Ayah': '-',
              'Pekerjaan Ayah': '-',
              'Penghasilan Ayah': '-',
              'Nama Ibu': '-',
              'Pekerjaan Ibu': '-',
              'Penghasilan Ibu': '-',
              'No. Telp Orang Tua': '-',
              'Status Anak': '-',
              'Jumlah Tanggungan': '-',
              'Kesediaan Sekolah Ortu': '-',
              'Status Kepemilikan Rumah': '-',
              'Luas Tanah & Bangunan': '-',
              'Kepemilikan Kendaraan': '-',
              'Link Kartu Keluarga': '-',
              'Link Akta Kelahiran': '-',
              'Link Rapor Kelas 5': '-',
              'Link Surat Kematian': '-',
              'Link Pas Foto 4x6': '-',
              'Link Sertifikat Hafalan': '-',
              'Link Sertifikat Penghargaan': '-',
            };
          }
        })
      );

      // Buat worksheet dari data
      const ws = XLSX.utils.json_to_sheet(enrichedData);

      // Set column widths
      const colWidths = [
        { wch: 25 }, // Nama Lengkap
        { wch: 15 }, // Jenis Kelamin
        { wch: 20 }, // Tempat Lahir
        { wch: 15 }, // Tanggal Lahir
        { wch: 30 }, // Alamat
        { wch: 15 }, // No. Telp/WA
        { wch: 25 }, // Asal Sekolah
        { wch: 20 }, // Hafalan
        { wch: 15 }, // Angkatan
        { wch: 25 }, // Nama Ayah
        { wch: 20 }, // Pekerjaan Ayah
        { wch: 20 }, // Penghasilan Ayah
        { wch: 25 }, // Nama Ibu
        { wch: 20 }, // Pekerjaan Ibu
        { wch: 20 }, // Penghasilan Ibu
        { wch: 15 }, // No. Telp Ortu
        { wch: 15 }, // Status Anak
        { wch: 18 }, // Jumlah Tanggungan
        { wch: 25 }, // Kesediaan Sekolah
        { wch: 25 }, // Status Kepemilikan Rumah
        { wch: 25 }, // Luas Tanah
        { wch: 30 }, // Kepemilikan Kendaraan
        { wch: 50 }, // Link KK
        { wch: 50 }, // Link Akta
        { wch: 50 }, // Link Rapor
        { wch: 50 }, // Link Surat Kematian
        { wch: 50 }, // Link Foto
        { wch: 50 }, // Link Sertifikat Hafalan
        { wch: 50 }, // Link Sertifikat Penghargaan
      ];
      ws['!cols'] = colWidths;

      // Buat workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data Santri');

      // Generate filename dengan timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `Data_Santri_${selectedYear || 'Semua'}_${timestamp}.xlsx`;

      // Download file
      XLSX.writeFile(wb, filename);

      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Data berhasil di-export ke ${filename}`,
        confirmButtonColor: '#0f766e'
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat export data',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminHeader />
      <div className="flex">
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
          <AdminSidebar activeMenu="Santri" />
        </div>
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            <section className="p-10 bg-[#f5f6fa] min-h-screen">
              {/* Search bar and filter row above card, aligned with title */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="mb-2 text-3xl font-bold text-slate-900">
                    Santri
                  </h2>
                  <span className="block font-medium text-slate-500">
                    Santri
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="px-6 py-2 font-semibold text-white bg-teal-700 rounded-full shadow-md hover:bg-teal-800 transition"
                    onClick={openAddModal}
                  >
                    Tambah
                  </button>
                  <button
                    className="px-6 py-2 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-md hover:bg-teal-50 transition flex items-center gap-2"
                    onClick={handleExportToExcel}
                    title="Export ke Excel"
                  >
                    <svg 
                      width="20" 
                      height="20" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Excel
                  </button>
                  <div className="relative">
                    <select className="px-6 py-2 pr-10 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                      <option value="">Semua</option>
                      {yearOptions.map((y) => (
                        <option key={y} value={String(y)}>{y}</option>
                      ))}
                    </select>
                    <span className="absolute text-teal-700 transform -translate-y-1/2 pointer-events-none right-4 top-1/2">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 8l4 4 4-4" />
                      </svg>
                    </span>
                  </div>
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder="Cari nama, email, alamat..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="px-6 py-2 font-semibold border-2 border-teal-700 rounded-full text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all pr-10"
                    />
                    <button
                      type="submit"
                      className="absolute right-4 top-2.5 text-teal-700"
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
              {/* Card and table */}
              <div className="p-8 bg-white border shadow rounded-2xl border-slate-100">
                {/* Tabel data santri */}
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="text-slate-700 font-bold text-base">
                        <th className="py-3 px-4">NO</th>
                        <th className="py-3 px-4">Nama</th>
                        <th className="py-3 px-4">Angkatan</th>
                        <th className="py-3 px-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan="4"
                            className="py-8 text-center text-slate-500"
                          >
                            Loading...
                          </td>
                        </tr>
                      ) : (selectedYear ? santriList.filter(s => String(s.tahun_masuk || '') === String(selectedYear)) : santriList).length === 0 ? (
                        <tr>
                          <td
                            colSpan="4"
                            className="py-8 text-center text-slate-500"
                          >
                            Tidak ada data santri
                          </td>
                        </tr>
                      ) : (
                        (selectedYear ? santriList.filter(s => String(s.tahun_masuk || '') === String(selectedYear)) : santriList).map((santri, i) => (
                          <tr
                            key={santri.id}
                            className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                          >
                            <td className="py-3 px-4">{i + 1}</td>
                            <td className="py-3 px-4">{santri.nama_lengkap}</td>
                            <td className="py-3 px-4">
                              {santri.angkatan || "-"}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                className="bg-teal-700 text-white px-4 py-1 rounded-full font-semibold hover:bg-teal-800 transition"
                                onClick={() => openViewModal(santri)}
                              >
                                Lihat
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button className="px-2 py-1 rounded bg-slate-100 text-slate-700">
                    &lt;
                  </button>
                  <span className="px-2">1</span>
                  <button className="px-2 py-1 rounded bg-slate-100 text-slate-700">
                    &gt;
                  </button>
                </div>
              </div>
              {/* View Modal */}
              {viewModal && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-30">
                  <div className="relative w-full max-w-3xl p-8 mx-auto mt-5 mb-12 bg-white shadow-lg rounded-2xl">
                    <button
                      className="absolute text-2xl top-6 right-6 text-slate-400 hover:text-teal-700"
                      onClick={closeViewModal}
                      aria-label="Tutup"
                    >
                      &#10005;
                    </button>
                    <h3 className="text-2xl font-extrabold text-center">
                      Data Berkas Santri
                    </h3>
                    <p className="mb-6 text-sm text-center text-slate-500">
                      Periksa kembali berkas santri untuk informasi lengkap.
                    </p>

                    {modalLoading ? (
                      <div className="py-16 text-center">Memuat...</div>
                    ) : (
                      <div>
                        {/* Data Pribadi Calon Santri */}
                        <div className="mb-6">
                          <h4 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">
                            📋 Data Pribadi Calon Santri
                          </h4>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Nama Lengkap</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.nama_lengkap || selectedSantri?.nama_lengkap || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Jenis Kelamin</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.jenis_kelamin || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Tempat Lahir</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.tempat_lahir || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Tanggal Lahir</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.tanggal_lahir ? new Date(selectedSantri.berkas_detail.tanggal_lahir).toLocaleDateString('id-ID') : "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Alamat</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.alamat || selectedSantri?.alamat || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">No. Telp/WA</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.no_telp || selectedSantri?.no_telp || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Asal Sekolah/Madrasah</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.asal_sekolah || selectedSantri?.asal_sekolah || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Hafalan Al-Qur'an</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.hafalan_quran || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Angkatan</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.angkatan || selectedSantri?.angkatan || "Angkatan 1"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Data Orang Tua */}
                        <div className="mb-6">
                          <h4 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">
                            👨‍👩‍👧 Data Orang Tua
                          </h4>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Nama Ayah</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.nama_ayah || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Pekerjaan Ayah</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.pekerjaan_ayah || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Penghasilan Ayah</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.penghasilan_ayah || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Nama Ibu</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.nama_ibu || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Pekerjaan Ibu</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.pekerjaan_ibu || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Penghasilan Ibu</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.penghasilan_ibu || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">No. Telp Orang Tua</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.no_telp_ortu || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Status Anak</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.status_anak || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Jumlah Tanggungan</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.jumlah_tanggungan || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Kesediaan Sekolah Ortu</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.kesediaan_sekolah_ortu || "-"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Data Ekonomi Keluarga */}
                        <div className="mb-6">
                          <h4 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">
                            🏠 Data Ekonomi Keluarga
                          </h4>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Status Kepemilikan Rumah</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.status_kepemilikan_rumah || "-"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-600">Luas Tanah & Bangunan</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.luas_tanah_bangunan || "-"}
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-sm font-semibold text-slate-600">Kepemilikan Kendaraan</label>
                              <div className="p-3 mt-1 bg-slate-50 rounded">
                                {selectedSantri?.berkas_detail?.kepemilikan_kendaraan || "-"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Dokumen Berkas */}
                        <div className="mb-6">
                          <h4 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">
                            📄 Dokumen Berkas
                          </h4>

                          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                            {getDocumentsFromSelectedBerkas().length > 0 ? (
                              getDocumentsFromSelectedBerkas().map((doc, idx) => {
                                // Tentukan styling berdasarkan jenis dokumen (sama dengan PPDB.jsx)
                                let colorClass = '';
                                let svgPath = '';
                                
                                if (doc.key === 'kartu_keluarga') {
                                  colorClass = 'text-purple-700 bg-purple-50 hover:bg-purple-100';
                                  svgPath = 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
                                } else if (doc.key === 'akta_kelahiran') {
                                  colorClass = 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100';
                                  svgPath = 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z';
                                } else if (doc.key === 'rapor') {
                                  colorClass = 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100';
                                  svgPath = 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253';
                                } else if (doc.key === 'surat_kematian') {
                                  colorClass = 'text-gray-700 bg-gray-50 hover:bg-gray-100';
                                  svgPath = 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
                                } else if (doc.key === 'foto_santri') {
                                  colorClass = 'text-blue-700 bg-blue-50 hover:bg-blue-100';
                                  svgPath = 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z';
                                } else if (doc.key === 'sertifikat_hafalan') {
                                  colorClass = 'text-green-700 bg-green-50 hover:bg-green-100';
                                  svgPath = 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z';
                                } else if (doc.key === 'sertifikat_penghargaan') {
                                  colorClass = 'text-pink-700 bg-pink-50 hover:bg-pink-100';
                                  svgPath = 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7';
                                }
                                
                                return (
                                  <div
                                    key={idx}
                                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition rounded-lg cursor-pointer hover:shadow ${colorClass}`}
                                    onClick={() => handleViewDocument(doc)}
                                  >
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={svgPath} />
                                    </svg>
                                    <span>{doc.label}</span>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="col-span-4 text-center py-8 text-slate-400">
                                Tidak ada dokumen yang diunggah
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Add Modal */}
              {addModal && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-30">
                  <div className="relative w-full max-w-3xl p-8 mx-auto mt-5 mb-12 bg-white shadow-lg rounded-2xl">
                    <button
                      className="absolute text-2xl top-6 right-6 text-slate-400 hover:text-teal-700"
                      onClick={closeAddModal}
                      aria-label="Tutup"
                    >
                      &#10005;
                    </button>
                    <h3 className="text-2xl font-extrabold text-center">
                      Tambah Santri
                    </h3>
                    <p className="mb-4 text-sm text-center text-slate-500">
                      Silakan lengkapi data santri baru
                    </p>

                    <form onSubmit={handleSubmit}>
                      {/* Avatar Upload */}
                      <div className="flex flex-col items-center mb-6">
                        <div className="relative">
                          <div
                            className="w-24 h-24 overflow-hidden rounded-full border-4 border-white shadow cursor-pointer"
                            onClick={handleImageClick}
                          >
                            {preview ? (
                              <img
                                src={preview}
                                alt="preview"
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-slate-100">
                                <span className="text-2xl text-slate-400">
                                  +
                                </span>
                              </div>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </div>
                      </div>

                      {/* Form Fields - Same layout as view modal */}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm text-slate-600">
                            Nama <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="nama"
                            value={formData.nama}
                            onChange={handleFormInputChange}
                            placeholder="Masukkan nama lengkap"
                            className="w-full p-3 mt-1 bg-slate-50 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-600">
                            Asal Sekolah Dasar/Madrasah Ibtidaiyah
                          </label>
                          <input
                            type="text"
                            name="asal_sekolah"
                            value={formData.asal_sekolah}
                            onChange={handleFormInputChange}
                            placeholder="Masukkan asal sekolah"
                            className="w-full p-3 mt-1 bg-slate-50 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-600">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormInputChange}
                            placeholder="Masukkan email"
                            className="w-full p-3 mt-1 bg-slate-50 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-600">
                            No. Telp
                          </label>
                          <input
                            type="tel"
                            name="no_telp"
                            value={formData.no_telp}
                            onChange={handleFormInputChange}
                            placeholder="Masukkan nomor telepon"
                            className="w-full p-3 mt-1 bg-slate-50 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-600">
                            Alamat
                          </label>
                          <input
                            type="text"
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleFormInputChange}
                            placeholder="Masukkan alamat"
                            className="w-full p-3 mt-1 bg-slate-50 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-600">
                            Angkatan
                          </label>
                          <input
                            type="text"
                            name="angkatan"
                            value={formData.angkatan}
                            onChange={handleFormInputChange}
                            placeholder="Masukkan angkatan"
                            className="w-full p-3 mt-1 bg-slate-50 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                          />
                        </div>
                      </div>

                      {/* Berkas Pendaftaran Section */}
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-slate-700 mb-4">
                          Berkas Pendaftaran
                        </h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {[
                            "Surat Pernyataan Taat Peraturan",
                            "Fotokopi Rapor Kelas",
                            "Fotokopi Ijazah (Menyusul)",
                            "Fotokopi KTP Orang Tua",
                            "Fotokopi Kartu Keluarga",
                            "Fotokopi Akta Kelahiran",
                            "Pas Foto 4x6 Latar Biru (4 Lembar)",
                            "Surat Keterangan Bebas TBC & Hepatitis",
                          ].map((label, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded"
                            >
                              <div className="text-sm text-slate-700">
                                {label}
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  className="px-3 py-1 text-sm font-semibold text-emerald-700 bg-emerald-100 rounded-full hover:bg-emerald-200 transition"
                                >
                                  Upload
                                </button>
                                <div className="text-sm text-slate-500">
                                  Belum ada file
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="flex items-center justify-center gap-6 mt-8">
                        <button
                          type="submit"
                          className="px-8 py-3 text-white rounded-full bg-teal-700 shadow hover:bg-teal-800 transition"
                        >
                          Tambah Santri
                        </button>
                        <button
                          type="button"
                          onClick={closeAddModal}
                          className="px-8 py-3 text-slate-600 rounded-full bg-slate-100 shadow hover:bg-slate-200 transition"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
