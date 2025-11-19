import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";
import { getImageUrl } from "../../config/api";
import Swal from "sweetalert2";

export default function Pendidik() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [pendidikList, setPendidikList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [currentPendidik, setCurrentPendidik] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showImageView, setShowImageView] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    no_telp: "",
    email: "",
    password: "",
    isi: "",
    role: "user",
    photo_profile: "",
  });

  useEffect(() => {
    if (!AdminService.isLoggedIn()) {
      navigate("/admin");
      return;
    }
    fetchPendidik();
  }, [navigate]);

  const fetchPendidik = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getAllPendidik();
      if (response.success) {
        setPendidikList(response.data);
      }
    } catch (error) {
      // Jika backend tidak tersedia, gunakan data dummy
      console.warn("Backend tidak tersedia, menggunakan data dummy");
      const dummyData = [
        {
          id: 1,
          nama: "Dr. Ahmad Hidayat",
          email: "ahmad@pesantren.com",
          no_telp: "081234567890",
          role: "admin",
          isi: "Kepala Pesantren",
          photo_profile:
            "/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png",
          created_at: "2024-01-15T10:00:00Z",
        },
        {
          id: 2,
          nama: "Ust. Muhammad Ali",
          email: "muhammad@pesantren.com",
          no_telp: "081234567891",
          role: "user",
          isi: "Guru Al-Quran",
          photo_profile:
            "/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png",
          created_at: "2024-01-16T10:00:00Z",
        },
      ];
      setPendidikList(dummyData);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPendidik();
      return;
    }
    try {
      setLoading(true);
      const response = await AdminService.searchPendidik(searchQuery);
      if (response.success) {
        setPendidikList(response.data);
      }
    } catch (error) {
      // Jika backend tidak tersedia, gunakan data dummy dengan filter
      console.warn("Backend tidak tersedia, menggunakan data dummy");
      const dummyData = [
        {
          id: 1,
          nama: "Dr. Ahmad Hidayat",
          email: "ahmad@pesantren.com",
          no_telp: "081234567890",
          role: "admin",
          isi: "Kepala Pesantren",
          photo_profile:
            "/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png",
          created_at: "2024-01-15T10:00:00Z",
        },
        {
          id: 2,
          nama: "Ust. Muhammad Ali",
          email: "muhammad@pesantren.com",
          no_telp: "081234567891",
          role: "user",
          isi: "Guru Al-Quran",
          photo_profile:
            "/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png",
          created_at: "2024-01-16T10:00:00Z",
        },
      ];
      const filteredData = dummyData.filter(
        (pendidik) =>
          pendidik.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pendidik.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setPendidikList(filteredData);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Upload foto dulu jika ada
      let photoUrl = "";
      if (image) {
        const uploadResponse = await AdminService.uploadFotoPendidik(image);
        if (uploadResponse.success) {
          photoUrl = uploadResponse.data.url;
        }
      }

      const dataToSubmit = { ...formData, photo_profile: photoUrl };
      const response = await AdminService.createPendidik(dataToSubmit);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Pendidik berhasil ditambahkan",
          timer: 1500,
        });
        setShowCreateModal(false);
        resetForm();
        fetchPendidik();
      }
    } catch (error) {
      // Jika backend tidak tersedia, simulasi sukses
      console.warn("Backend tidak tersedia, simulasi sukses");
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Pendidik berhasil ditambahkan (Simulasi)",
        timer: 1500,
      });
      setShowCreateModal(false);
      resetForm();
      fetchPendidik();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log('handleUpdate called, currentPendidik:', currentPendidik, 'formData:', formData, 'image:', image);
    try {
      // Upload foto baru jika ada
      let photoUrl = formData.photo_profile;
      if (image) {
        const uploadResponse = await AdminService.uploadFotoPendidik(image);
        if (uploadResponse.success) {
          photoUrl = uploadResponse.data.url;
        }
      }

      const updateData = { ...formData, photo_profile: photoUrl };
      if (!updateData.password) delete updateData.password;
      const response = await AdminService.updatePendidik(currentPendidik.id, updateData);
      console.log('Update response:', response);
      // Accept multiple shapes: { success:true }, or axios response.data
      const ok = response?.success === true || response?.data?.success === true || response?.status === 200 || response?.success === undefined;
      if (ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data berhasil diupdate",
          timer: 1500,
        });
        closeViewModal();
        fetchPendidik();
      } else {
        console.warn('Update did not return success flag, response:', response);
      }
    } catch (error) {
      // Jika backend tidak tersedia, simulasi sukses
      console.warn("Backend tidak tersedia, simulasi sukses");
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data berhasil diupdate (Simulasi)",
        timer: 1500,
      });
      closeViewModal();
      fetchPendidik();
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Hapus Pendidik?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) {
      try {
        console.log('Deleting pendidik id=', currentPendidik?.id);
        const response = await AdminService.deletePendidik(currentPendidik.id);
        console.log('Delete response:', response);
        const ok = response?.success === true || response?.data?.success === true || response?.status === 200 || response?.success === undefined;
        if (ok) {
          Swal.fire({
            icon: "success",
            title: "Terhapus",
            text: "Pendidik berhasil dihapus",
            timer: 1500,
          });
          closeViewModal();
          fetchPendidik();
        } else {
          console.warn('Delete did not return success flag, response:', response);
        }
      } catch (error) {
        // Jika backend tidak tersedia, simulasi sukses
        console.warn("Backend tidak tersedia, simulasi sukses");
        Swal.fire({
          icon: "success",
          title: "Terhapus",
          text: "Pendidik berhasil dihapus (Simulasi)",
          timer: 1500,
        });
        closeViewModal();
        fetchPendidik();
      }
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };
  const openViewModal = (pendidik) => {
    setCurrentPendidik(pendidik);
    setFormData({
      nama: pendidik.nama,
      no_telp: pendidik.no_telp || "",
      email: pendidik.email,
      password: "",
      isi: pendidik.isi || "",
      role: pendidik.role || "user",
      photo_profile: pendidik.photo_profile || "",
    });
    setPreview("");
    setImage(null);
    setShowAvatarMenu(false);
    setShowImageView(false);
    setViewModal(true);
  };
  const closeViewModal = () => {
    setViewModal(false);
    setShowAvatarMenu(false);
    setShowImageView(false);
    resetForm();
    setCurrentPendidik(null);
  };
  const resetForm = () => {
    setFormData({
      nama: "",
      no_telp: "",
      email: "",
      password: "",
      isi: "",
      role: "user",
      photo_profile: "",
    });
    setPreview("");
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setShowAvatarMenu(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarClick = () => {
    setShowAvatarMenu(!showAvatarMenu);
  };

  const handleEditPhoto = () => {
    setShowAvatarMenu(false);
    fileInputRef.current?.click();
  };

  const handleViewPhoto = () => {
    setShowAvatarMenu(false);
    setShowImageView(true);
  };

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
                    Manajemen Pendidik
                  </h2>
                  <span className="font-medium text-slate-500">
                    Kelola data pendidik dan tenaga pengajar
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="px-6 py-2 font-semibold text-white bg-teal-700 rounded-full shadow-md"
                    onClick={openCreateModal}
                  >
                    Tambah
                  </button>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari nama atau email..."
                      className="px-6 py-2 pr-10 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute text-teal-700 transform -translate-y-1/2 right-4 top-1/2"
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
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        fetchPendidik();
                      }}
                      className="px-4 py-2 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
              <div className="p-8 bg-white border shadow rounded-2xl border-slate-100">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-teal-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                ) : pendidikList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <span className="mb-2 text-5xl">📚</span>
                    <p className="text-lg font-semibold">
                      Belum ada data pendidik
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead>
                        <tr className="text-base font-bold text-slate-700">
                          <th className="px-4 py-3">NO</th>
                          <th className="px-4 py-3">Nama</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">No. Telepon</th>
                          <th className="px-4 py-3">Role</th>
                          <th className="px-4 py-3">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          // Filter berdasarkan search keyword
                          let filtered = pendidikList;
                          
                          if (searchQuery.trim()) {
                            const keyword = searchQuery.toLowerCase();
                            filtered = filtered.filter(p => 
                              (p.nama && p.nama.toLowerCase().includes(keyword)) ||
                              (p.email && p.email.toLowerCase().includes(keyword)) ||
                              (p.no_telp && String(p.no_telp).toLowerCase().includes(keyword)) ||
                              (p.isi && p.isi.toLowerCase().includes(keyword))
                            );
                          }
                          
                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td
                                  colSpan="6"
                                  className="py-8 text-center text-slate-500"
                                >
                                  {searchQuery.trim() ? 'Tidak ada pendidik yang sesuai dengan pencarian' : 'Tidak ada data pendidik'}
                                </td>
                              </tr>
                            );
                          }
                          
                          return filtered.map((pendidik, i) => (
                          <tr
                            key={pendidik.id}
                            className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                          >
                            <td className="px-4 py-3">{i + 1}</td>
                            <td className="px-4 py-3">{pendidik.nama}</td>
                            <td className="px-4 py-3">{pendidik.email}</td>
                            <td className="px-4 py-3">
                              {pendidik.no_telp || "-"}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                  pendidik.role === "admin"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {pendidik.role === "admin"
                                  ? "Admin"
                                  : "Pendidik"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                className="px-4 py-1 font-semibold text-white bg-teal-700 rounded-full"
                                onClick={() => openViewModal(pendidik)}
                              >
                                Lihat
                              </button>
                            </td>
                          </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="relative w-full max-w-lg p-8 mx-auto bg-white shadow-lg rounded-2xl max-h-[90vh] overflow-y-auto">
            <button
              className="absolute text-2xl top-6 right-6 text-slate-400 hover:text-teal-700"
              onClick={() => setShowCreateModal(false)}
            >
              ✕
            </button>
            <h3 className="mb-2 text-2xl font-bold text-center">
              Tambah Pendidik Baru
            </h3>
            <p className="mb-6 text-base text-center text-slate-500">
              Silakan lengkapi data berikut untuk menambah pendidik
            </p>

            <form onSubmit={handleCreate} className="flex flex-col gap-2">
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
                        <span className="text-2xl text-slate-400">+</span>
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
                <p className="mt-2 text-xs text-slate-500">
                  Klik untuk upload foto
                </p>
              </div>

              <label className="text-sm font-medium text-slate-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                required
              />

              <label className="text-sm font-medium text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Masukkan Email..."
                className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <span className="font-normal text-slate-700">Password *</span>
              <input
                type="password"
                placeholder="Masukkan Password..."
                className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <span className="font-normal text-slate-700">No Telepon</span>
              <input
                type="text"
                placeholder="Masukkan No Telepon..."
                className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                value={formData.no_telp}
                onChange={(e) =>
                  setFormData({ ...formData, no_telp: e.target.value })
                }
              />
              <span className="font-normal text-slate-700">Role *</span>
              <select
                className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                required
              >
                <option value="user">Pendidik</option>
                <option value="admin">Admin</option>
              </select>
              <span className="font-normal text-slate-700">Keterangan</span>
              <textarea
                className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                rows="3"
                value={formData.isi}
                onChange={(e) =>
                  setFormData({ ...formData, isi: e.target.value })
                }
                placeholder="Bio pendidik..."
              />
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-3 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 font-semibold text-white bg-teal-700 rounded-full shadow"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View/Edit Pendidik Modal (matches Artikel flow) */}
      {viewModal && currentPendidik && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-30">
          <div className="relative w-full max-w-2xl p-8 mx-auto mt-8 mb-12 bg-white shadow-lg rounded-2xl">
            <button
              className="absolute text-2xl top-6 right-6 text-slate-400 hover:text-teal-700"
              onClick={closeViewModal}
              aria-label="Tutup"
            >
              &#10005;
            </button>
            <h3 className="mb-2 text-3xl font-bold text-center">
              Edit Pendidik
            </h3>
            <p className="mb-6 text-base text-center text-slate-500">
              Silakan lengkapi data berikut untuk menyunting data pendidik
              Pesantren Al Ihsan Bekasi.
            </p>

            <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
              {/* Avatar Upload with Menu */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative">
                  <div
                    className="w-24 h-24 overflow-hidden rounded-full border-4 border-white shadow cursor-pointer"
                    onClick={handleAvatarClick}
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="preview"
                        className="object-cover w-full h-full"
                      />
                    ) : formData.photo_profile ? (
                      <img
                        src={getImageUrl(formData.photo_profile)}
                        alt="Foto pendidik"
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.src = "/assets/hero/profile-placeholder.png";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-slate-100">
                        <span className="text-2xl text-slate-400">+</span>
                      </div>
                    )}
                  </div>
                  {showAvatarMenu && (
                    <div className="absolute left-1/2 z-10 mt-2 w-32 -translate-x-1/2 rounded-lg bg-white shadow-lg border border-slate-200">
                      <button
                        type="button"
                        className="block w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-100"
                        onClick={handleEditPhoto}
                      >
                        Edit Foto
                      </button>
                      <button
                        type="button"
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
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Klik untuk upload foto baru
                </p>
              </div>

              <label className="text-sm font-medium text-slate-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                required
              />

              <label className="text-sm font-medium text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                required
              />

              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Kosongkan jika tidak ingin mengubah password"
                className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
              />

              <label className="text-sm font-medium text-slate-700">
                No. Telepon
              </label>
              <input
                type="text"
                value={formData.no_telp}
                onChange={(e) =>
                  setFormData({ ...formData, no_telp: e.target.value })
                }
                className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
              />

              <label className="text-sm font-medium text-slate-700">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                required
              >
                <option value="user">Pendidik</option>
                <option value="admin">Admin</option>
              </select>

              <label className="text-sm font-medium text-slate-700">
                Keterangan
              </label>
              <textarea
                value={formData.isi}
                onChange={(e) =>
                  setFormData({ ...formData, isi: e.target.value })
                }
                rows={4}
                placeholder="Bio singkat pendidik..."
                className="w-full px-5 py-3 font-medium rounded-lg resize-none bg-slate-100 text-slate-700 focus:outline-none"
              />

              <label className="text-sm font-medium text-slate-700">
                Tanggal Bergabung
              </label>
              <input
                type="text"
                value={new Date(currentPendidik.created_at).toLocaleDateString(
                  "id-ID",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
                className="w-full px-5 py-3 font-medium rounded-lg bg-slate-200 text-slate-500 cursor-not-allowed"
                disabled
              />

              <div className="flex items-center justify-center gap-6 mt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-700 text-white rounded-full shadow hover:bg-teal-800"
                >
                  Konfirmasi
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-3 bg-red-600 text-white rounded-full shadow hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            </form>

            {/* Full Image View Modal */}
            {showImageView && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
                onClick={() => setShowImageView(false)}
              >
                <img
                  src={
                    preview
                      ? preview
                      : formData.photo_profile
                      ? getImageUrl(formData.photo_profile)
                      : "/assets/hero/profile-placeholder.png"
                  }
                  alt="Foto pendidik"
                  className="max-h-[80vh] max-w-[90vw] rounded-xl border-4 border-white shadow-lg"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
