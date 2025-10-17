import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";
import PendidikService from "../../services/PendidikService";

export default function Pendidik() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const fotoInputRef = useRef();
  const [viewModal, setViewModal] = useState(false);
  const [selectedPendidik, setSelectedPendidik] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showImageView, setShowImageView] = useState(false);
  const avatarInputRef = useRef();

  // Data dummy untuk tabel pendidik
  const pendidikData = [
    {
      id: 1,
      nama: "Ust. Heru Kusuma",
      email: "heru.kusuma@alihsan.sch.id",
      no_telp: "081234567890",
      peran: "Penanggung Jawab",
      nip: "J04032311001",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 2,
      nama: "Ust. Muhibbul Umam Thalib, Lc",
      email: "muhibbul.thalib@alihsan.sch.id",
      no_telp: "081234567891",
      peran: "Mudir Pesantren",
      nip: "J04032311002",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 3,
      nama: "Ust. Danu Sabdo, M.Pd",
      email: "danu.sabdo@alihsan.sch.id",
      no_telp: "081234567892",
      peran: "Kesantrian",
      nip: "J04032311003",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 4,
      nama: "Ust. Hudzaifah, BA.",
      email: "hudzaifah@alihsan.sch.id",
      no_telp: "081234567893",
      peran: "Bag. Bahasa",
      nip: "J04032311004",
      avatar:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 5,
      nama: "Ust. Luthfi",
      email: "luthfi@alihsan.sch.id",
      no_telp: "081234567894",
      peran: "Bag. Tahfidz",
      nip: "J04032311005",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 6,
      nama: "Ust. Reza",
      email: "reza@alihsan.sch.id",
      no_telp: "081234567895",
      peran: "Koordinator Musyrif",
      nip: "J04032311006",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 7,
      nama: "Ust. Fajar",
      email: "fajar@alihsan.sch.id",
      no_telp: "081234567896",
      peran: "Musyrif",
      nip: "J04032311007",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 8,
      nama: "Ust. Najib",
      email: "najib@alihsan.sch.id",
      no_telp: "081234567897",
      peran: "Musyrif",
      nip: "J04032311008",
      avatar:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
    },
  ];

  const openViewModal = async (id) => {
    setViewModal(true);
    setLoading(true);
    setSelectedPendidik(null);
    setShowAvatarMenu(false);
    setShowImageView(false);
    try {
      // Menggunakan data dummy
      const data = pendidikData.find((pendidik) => pendidik.id === id);
      if (data) {
        setSelectedPendidik(data);
      } else {
        setSelectedPendidik({
          nama: "-",
          email: "-",
          no_telp: "-",
          peran: "-",
          nip: "-",
        });
      }
    } catch (err) {
      console.error("Gagal mengambil data pendidik", err);
      setSelectedPendidik({
        nama: "-",
        email: "-",
        no_telp: "-",
        peran: "-",
        nip: "-",
      });
    } finally {
      setLoading(false);
    }
  };

  const closeViewModal = () => {
    setViewModal(false);
    setSelectedPendidik(null);
    setShowAvatarMenu(false);
    setShowImageView(false);
  };

  // Tambah foto logic
  const handleFotoClick = () => {
    if (fotoInputRef.current) fotoInputRef.current.click();
  };
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  // Edit/view foto in view modal
  const handleAvatarClick = (e) => {
    e.stopPropagation();
    setShowAvatarMenu((v) => !v);
  };
  const handleEditAvatar = () => {
    setShowAvatarMenu(false);
    if (avatarInputRef.current) avatarInputRef.current.click();
  };
  const handleViewAvatar = () => {
    setShowAvatarMenu(false);
    setShowImageView(true);
  };
  const handleAvatarChange = (e) => {
    // TODO: upload logic
    setShowAvatarMenu(false);
    // Optionally update selectedPendidik.avatar with preview
  };

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
          <AdminSidebar activeMenu="Pendidik" />
        </div>
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            <section className="p-10 bg-[#f5f6fa] min-h-screen">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    Pendidik
                  </h2>
                  <span className="font-medium text-slate-500">Pendidik</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="px-6 py-2 font-semibold text-white bg-teal-700 rounded-full shadow-md"
                    onClick={() => setShowModal(true)}
                  >
                    Tambah
                  </button>
                  <div className="relative">
                    <select className="px-6 py-2 pr-10 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400">
                      <option>Semua</option>
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
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari..."
                      className="px-6 py-2 pr-10 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <span className="absolute text-teal-700 transform -translate-y-1/2 right-4 top-1/2">
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
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabel Data Pendidik */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          NO
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Nama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          NIP
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Peran
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {pendidikData.map((pendidik, index) => (
                        <tr key={pendidik.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900">
                              {pendidik.nama}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-500">
                              {pendidik.nip}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                              {pendidik.peran}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => openViewModal(pendidik.id)}
                              className="bg-teal-700 text-white px-4 py-1 rounded-full font-semibold hover:bg-teal-800 transition"
                            >
                              Lihat
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Tambah Tenaga Pendidik */}
              {showModal && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-30">
                  <div className="relative w-full max-w-lg p-8 mx-auto mt-5 mb-12 bg-white shadow-lg rounded-2xl">
                    <button
                      className="absolute text-2xl top-6 right-6 text-slate-400 hover:text-teal-700"
                      onClick={() => setShowModal(false)}
                      aria-label="Tutup"
                    >
                      &#10005;
                    </button>
                    <h3 className="mb-2 text-2xl font-bold text-center">
                      Tambah Tenaga Pendidik
                    </h3>
                    <p className="mb-6 text-base text-center text-slate-500">
                      Silakan lengkapi data berikut untuk menambah tenaga
                      pendidik Pesantren Al Ihsan Bekasi yang baru.
                    </p>
                    <form className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-slate-700 mb-1">
                        Foto
                      </span>
                      <div className="flex items-center justify-center w-full mb-2">
                        <div
                          className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-slate-200 hover:border-teal-600"
                          onClick={handleFotoClick}
                        >
                          {fotoPreview ? (
                            <img
                              src={fotoPreview}
                              alt="Preview"
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-slate-400">Pilih Foto</span>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fotoInputRef}
                          className="hidden"
                          onChange={handleFotoChange}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Nama
                      </span>
                      <input
                        type="text"
                        placeholder="Masukkan Nama Lengkap..."
                        className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        No Telepon
                      </span>
                      <input
                        type="text"
                        placeholder="Masukkan No Telepon..."
                        className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        Email
                      </span>
                      <input
                        type="email"
                        placeholder="Masukkan Email..."
                        className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        Peran
                      </span>
                      <input
                        type="text"
                        placeholder="Masukkan Peran..."
                        className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        Kata Sandi
                      </span>
                      <input
                        type="password"
                        placeholder="Masukkan Kata Sandi..."
                        className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="w-1/2 py-3 mx-auto mt-4 font-semibold text-white bg-teal-700 rounded-full shadow"
                      >
                        Konfirmasi
                      </button>
                    </form>
                  </div>
                </div>
              )}
              {/* View modal for Pendidik (uses same styling as other admin modals) */}
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
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative">
                        <div
                          className="w-24 h-24 overflow-hidden rounded-full border-4 border-white shadow cursor-pointer"
                          onClick={handleAvatarClick}
                        >
                          <img
                            src={
                              selectedPendidik?.avatar ||
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
                              onClick={handleEditAvatar}
                            >
                              Edit Foto
                            </button>
                            <button
                              className="block w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-100"
                              onClick={handleViewAvatar}
                            >
                              Lihat Foto
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          ref={avatarInputRef}
                          className="hidden"
                          onChange={handleAvatarChange}
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
                            selectedPendidik?.avatar ||
                            "/assets/hero/profile-placeholder.png"
                          }
                          alt="avatar"
                          className="max-h-[80vh] max-w-[90vw] rounded-xl border-4 border-white shadow-lg"
                        />
                      </div>
                    )}
                    {loading ? (
                      <div className="py-12 text-center">Memuat...</div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
                        <div>
                          <label className="text-sm text-slate-600">
                            Nama Lengkap
                          </label>
                          <div className="p-3 mt-1 bg-slate-50 rounded">
                            {selectedPendidik?.nama || "-"}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-600">
                            Email
                          </label>
                          <div className="p-3 mt-1 bg-slate-50 rounded">
                            {selectedPendidik?.email || "-"}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-600">
                            No. Telepon
                          </label>
                          <div className="p-3 mt-1 bg-slate-50 rounded">
                            {selectedPendidik?.no_telp || "-"}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-600">
                            Peran/Jabatan
                          </label>
                          <div className="p-3 mt-1 bg-slate-50 rounded">
                            {selectedPendidik?.peran || "-"}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm text-slate-600">NIP</label>
                          <div className="p-3 mt-1 bg-slate-50 rounded">
                            {selectedPendidik?.nip || "-"}
                          </div>
                        </div>
                      </div>
                    )}
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
