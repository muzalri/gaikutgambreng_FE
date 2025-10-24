import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";
import Swal from "sweetalert2";

export default function Promosi() {
  const navigate = useNavigate();
  const [promosiList, setPromosiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    gambar: null,
    status: "aktif",
  });
  const [preview, setPreview] = useState(null);
  const fileInputRef = React.useRef();

  useEffect(() => {
    // Check if admin is logged in
    if (!AdminService.isLoggedIn()) {
      navigate("/admin");
      return;
    }
    fetchPromosi();
  }, [navigate]);

  const fetchPromosi = async () => {
    try {
      setLoading(true);
      // Simulasi data untuk sementara
      const dummyData = [
        {
          id: 1,
          judul: "Penerimaan Santri Baru 2025",
          deskripsi:
            "Bergabunglah dengan Pesantren Al Ihsan Bekasi untuk pendidikan yang berkualitas",
          gambar: "/assets/hero/pattern.png",
          status: "aktif",
          created_at: "2024-01-15T10:00:00Z",
        },
      ];
      setPromosiList(dummyData);
    } catch (error) {
      console.warn("Backend tidak tersedia, menggunakan data dummy");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
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
        gambar: file,
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi form
    if (!formData.judul || !formData.deskripsi) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Judul dan deskripsi harus diisi!",
      });
      return;
    }

    try {
      // TODO: Implement create promosi API call
      console.log("Creating promosi:", formData);

      // Simulasi sukses
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Promosi berhasil dibuat!",
        timer: 1500,
      });

      // Reset form
      setFormData({
        judul: "",
        deskripsi: "",
        gambar: null,
        status: "aktif",
      });
      setPreview(null);

      // Refresh data
      fetchPromosi();
    } catch (error) {
      console.warn("Backend tidak tersedia, simulasi sukses");
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Promosi berhasil dibuat! (Simulasi)",
        timer: 1500,
      });
      setFormData({
        judul: "",
        deskripsi: "",
        gambar: null,
        status: "aktif",
      });
      setPreview(null);
      fetchPromosi();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminHeader />
      <div className="flex">
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
          <AdminSidebar activeMenu="Promosi" />
        </div>
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            <section className="p-10 bg-[#f5f6fa] min-h-screen">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="mb-2 text-3xl font-bold text-slate-900">
                    Promosi
                  </h2>
                  <span className="block font-medium text-slate-500">
                    Kelola konten promosi dan iklan
                  </span>
                </div>
                <div className="flex items-center gap-4">
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

              {/* Tambah Promosi Section */}
              <div className="p-8 bg-white border shadow rounded-2xl border-slate-100 mb-6">
                <h3 className="mb-6 text-xl font-bold text-slate-900">
                  Tambah Promosi
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Judul
                      </label>
                      <input
                        type="text"
                        name="judul"
                        value={formData.judul}
                        onChange={handleInputChange}
                        placeholder="Masukkan judul promosi..."
                        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      >
                        <option value="aktif">Aktif</option>
                        <option value="nonaktif">Nonaktif</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleInputChange}
                      placeholder="Masukkan deskripsi promosi..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Gambar
                    </label>
                    <div
                      className="w-full h-40 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
                      onClick={handleImageClick}
                    >
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <span className="text-4xl text-gray-400">📷</span>
                          <p className="text-sm text-gray-500 mt-2">
                            Klik untuk upload gambar
                          </p>
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
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-teal-700 text-white rounded-full font-semibold hover:bg-teal-800 transition"
                    >
                      Buat
                    </button>
                  </div>
                </form>
              </div>

              {/* Daftar Promosi */}
              <div className="p-8 bg-white border shadow rounded-2xl border-slate-100">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-teal-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                ) : promosiList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <span className="mb-2 text-5xl">📢</span>
                    <p className="text-lg font-semibold">
                      Belum ada data promosi
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promosiList.map((promosi, i) => (
                      <div
                        key={promosi.id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
                      >
                        <div className="h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                          <img
                            src={promosi.gambar}
                            alt={promosi.judul}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {promosi.judul}
                          </h3>
                          <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                            {promosi.deskripsi}
                          </p>
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                promosi.status === "aktif"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {promosi.status === "aktif"
                                ? "Aktif"
                                : "Nonaktif"}
                            </span>
                            <div className="flex gap-2">
                              <button className="px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full hover:bg-teal-200 transition">
                                Edit
                              </button>
                              <button className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full hover:bg-red-200 transition">
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
