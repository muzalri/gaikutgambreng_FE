import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";
import SantriService from "../../services/SantriService";
import BerkasService from "../../services/BerkasService";

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
                      Data Santri
                    </h3>
                    <p className="mb-4 text-sm text-center text-slate-500">
                      Berikut Ditampilkan Data Santri dan Berkas Pendaftarannya
                    </p>
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative">
                        <div
                          className="w-24 h-24 overflow-hidden rounded-full border-4 border-white shadow cursor-pointer"
                          onClick={handleAvatarClick}
                        >
                          <img
                            src={
                              selectedSantri?.avatar ||
                              "/assets/hero/profile-placeholder.png"
                            }
                            alt="avatar"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        {showAvatarMenu && (
                          <div className="absolute left-1/2 z-10 mt-2 w-32 -translate-x-1/2 rounded-lg bg-white shadow-lg border border-slate-200">
                            <button
                              className="block w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-100"
                              onClick={handleEditPhoto}
                            >
                              Edit Foto
                            </button>
                            <button
                              className="block w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-100"
                              onClick={handleViewPhoto}
                            >
                              Lihat Foto
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handlePhotoChange}
                        />
                      </div>
                    </div>
                    {showImageView && (
                      <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
                        onClick={() => setShowImageView(false)}
                      >
                        <img
                          src={
                            selectedSantri?.avatar ||
                            "/assets/hero/profile-placeholder.png"
                          }
                          alt="avatar"
                          className="max-h-[80vh] max-w-[90vw] rounded-xl border-4 border-white shadow-lg"
                        />
                      </div>
                    )}
                    {modalLoading ? (
                      <div className="py-12 text-center">Memuat...</div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm text-slate-600">
                              Nama
                            </label>
                            <div className="p-3 mt-1 bg-slate-50 rounded">
                              {selectedSantri?.nama_lengkap || "-"}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-slate-600">
                              Asal Sekolah Dasar/Madrasah Ibtidaiyah
                            </label>
                            <div className="p-3 mt-1 bg-slate-50 rounded">
                              {selectedSantri?.asal_sekolah || "-"}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-slate-600">
                              Email
                            </label>
                            <div className="p-3 mt-1 bg-slate-50 rounded">
                              {selectedSantri?.email || "-"}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-slate-600">
                              No. Telp
                            </label>
                            <div className="p-3 mt-1 bg-slate-50 rounded">
                              {selectedSantri?.no_telp || "-"}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-slate-600">
                              Alamat
                            </label>
                            <div className="p-3 mt-1 bg-slate-50 rounded">
                              {selectedSantri?.alamat || "-"}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-slate-600">
                              Angkatan
                            </label>
                            <div className="p-3 mt-1 bg-slate-50 rounded">
                              {selectedSantri?.angkatan || "-"}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
                          {(selectedSantri?.berkas?.length > 0
                            ? selectedSantri.berkas
                            : [
                                "Surat Pernyataan Taat Peraturan",
                                "Fotokopi Rapor Kelas",
                                "Fotokopi Ijazah (Menyusul)",
                                "Fotokopi KTP Orang Tua",
                                "Fotokopi Kartu Keluarga",
                                "Fotokopi Akta Kelahiran",
                                "Pas Foto 4x6 Latar Biru (4 Lembar)",
                                "Surat Keterangan Bebas TBC & Hepatitis",
                              ]
                          ).map((label, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded"
                            >
                              <div className="text-sm text-slate-700">
                                {typeof label === "string"
                                  ? label
                                  : label.label}
                              </div>
                              <div className="flex items-center gap-3">
                                <button className="px-3 py-1 text-sm font-semibold text-emerald-700 bg-emerald-100 rounded-full">
                                  Lihat
                                </button>
                                <div className="text-sm text-slate-500">
                                  {typeof label === "string"
                                    ? "KTP_ORTU.PDF"
                                    : label.filename || ""}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-8">
                          <button className="px-8 py-3 text-white rounded-full bg-teal-700 shadow">
                            Konfirmasi
                          </button>
                        </div>
                      </>
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
