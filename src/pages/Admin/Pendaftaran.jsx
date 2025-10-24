import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";
import Swal from "sweetalert2";

export default function Pendaftaran() {
  const navigate = useNavigate();
  const [pendaftaranList, setPendaftaranList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    tanggal_buka: "",
    jam_buka: "",
    tanggal_tutup: "",
    jam_tutup: "",
    angkatan: "",
  });

  useEffect(() => {
    // Check if admin is logged in
    if (!AdminService.isLoggedIn()) {
      navigate("/admin");
      return;
    }
    fetchPendaftaran();
  }, [navigate]);

  const fetchPendaftaran = async () => {
    try {
      setLoading(true);
      // Simulasi data untuk sementara
      const dummyData = [
        {
          id: 1,
          tanggal_buka: "2025-06-10",
          jam_buka: "00:01",
          tanggal_tutup: "2025-06-30",
          jam_tutup: "23:59",
          angkatan: "Angkatan 1",
          created_at: "2024-01-15T10:00:00Z",
        },
      ];
      setPendaftaranList(dummyData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi form
    if (
      !formData.tanggal_buka ||
      !formData.jam_buka ||
      !formData.tanggal_tutup ||
      !formData.jam_tutup ||
      !formData.angkatan
    ) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Semua field harus diisi!",
      });
      return;
    }

    try {
      // TODO: Implement create pendaftaran API call
      console.log("Creating pendaftaran:", formData);

      // Simulasi sukses
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Pendaftaran berhasil dibuat!",
        timer: 1500,
      });

      // Reset form
      setFormData({
        tanggal_buka: "",
        jam_buka: "",
        tanggal_tutup: "",
        jam_tutup: "",
        angkatan: "",
      });

      // Refresh data
      fetchPendaftaran();
    } catch (error) {
      console.warn("Backend tidak tersedia, simulasi sukses");
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Pendaftaran berhasil dibuat! (Simulasi)",
        timer: 1500,
      });
      setFormData({
        tanggal_buka: "",
        jam_buka: "",
        tanggal_tutup: "",
        jam_tutup: "",
        angkatan: "",
      });
      fetchPendaftaran();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminHeader />
      <div className="flex">
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
          <AdminSidebar activeMenu="Pendaftaran" />
        </div>
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            <section className="p-10 bg-[#f5f6fa] min-h-screen">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="mb-2 text-3xl font-bold text-slate-900">
                    Pendaftaran
                  </h2>
                  <span className="block font-medium text-slate-500">
                    Kelola jadwal pendaftaran santri baru
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

              {/* Buka Pendaftaran Section */}
              <div className="p-8 bg-white border shadow rounded-2xl border-slate-100 mb-6">
                <h3 className="mb-6 text-xl font-bold text-slate-900">
                  Buka Pendaftaran
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tanggal Buka
                      </label>
                      <input
                        type="date"
                        name="tanggal_buka"
                        value={formData.tanggal_buka}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Jam Buka
                      </label>
                      <input
                        type="time"
                        name="jam_buka"
                        value={formData.jam_buka}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tanggal Tutup
                      </label>
                      <input
                        type="date"
                        name="tanggal_tutup"
                        value={formData.tanggal_tutup}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Jam Tutup
                      </label>
                      <input
                        type="time"
                        name="jam_tutup"
                        value={formData.jam_tutup}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Angkatan
                      </label>
                      <input
                        type="text"
                        name="angkatan"
                        value={formData.angkatan}
                        onChange={handleInputChange}
                        placeholder="Masukkan angkatan..."
                        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        required
                      />
                    </div>
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

              {/* Daftar Pendaftaran */}
              <div className="p-8 bg-white border shadow rounded-2xl border-slate-100">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-teal-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                ) : pendaftaranList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <span className="mb-2 text-5xl">📅</span>
                    <p className="text-lg font-semibold">
                      Belum ada data pendaftaran
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead>
                        <tr className="text-base font-bold text-slate-700">
                          <th className="px-4 py-3">NO</th>
                          <th className="px-4 py-3">Tanggal Buka</th>
                          <th className="px-4 py-3">Jam Buka</th>
                          <th className="px-4 py-3">Tanggal Tutup</th>
                          <th className="px-4 py-3">Jam Tutup</th>
                          <th className="px-4 py-3">Angkatan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendaftaranList.map((pendaftaran, i) => (
                          <tr
                            key={pendaftaran.id}
                            className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                          >
                            <td className="px-4 py-3">{i + 1}</td>
                            <td className="px-4 py-3">
                              {new Date(
                                pendaftaran.tanggal_buka
                              ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-4 py-3">
                              {pendaftaran.jam_buka}
                            </td>
                            <td className="px-4 py-3">
                              {new Date(
                                pendaftaran.tanggal_tutup
                              ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-4 py-3">
                              {pendaftaran.jam_tutup}
                            </td>
                            <td className="px-4 py-3">
                              {pendaftaran.angkatan}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
