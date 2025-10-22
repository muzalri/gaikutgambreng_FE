import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";
import Swal from "sweetalert2";

export default function Pendidik() {
  const navigate = useNavigate();
  const [pendidikList, setPendidikList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPendidik, setSelectedPendidik] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    no_telp: "",
    email: "",
    password: "",
    isi: "",
    role: "user"
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
      Swal.fire({ icon: "error", title: "Gagal", text: error.message || "Gagal memuat data pendidik" });
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
      Swal.fire({ icon: "error", title: "Gagal", text: error.message || "Gagal mencari data" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await AdminService.createPendidik(formData);
      if (response.success) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Pendidik berhasil ditambahkan", timer: 1500 });
        setShowCreateModal(false);
        resetForm();
        fetchPendidik();
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Gagal", text: error.message || "Gagal menambahkan pendidik" });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...formData };
      if (!updateData.password) delete updateData.password;
      const response = await AdminService.updatePendidik(selectedPendidik.id, updateData);
      if (response.success) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Data berhasil diupdate", timer: 1500 });
        setShowEditModal(false);
        resetForm();
        fetchPendidik();
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Gagal", text: error.message || "Gagal mengupdate" });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Pendidik?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    });
    if (result.isConfirmed) {
      try {
        const response = await AdminService.deletePendidik(id);
        if (response.success) {
          Swal.fire({ icon: "success", title: "Terhapus", text: "Pendidik berhasil dihapus", timer: 1500 });
          fetchPendidik();
        }
      } catch (error) {
        Swal.fire({ icon: "error", title: "Gagal", text: error.message || "Gagal menghapus" });
      }
    }
  };

  const openCreateModal = () => { resetForm(); setShowCreateModal(true); };
  const openEditModal = (pendidik) => {
    setSelectedPendidik(pendidik);
    setFormData({ nama: pendidik.nama, no_telp: pendidik.no_telp || "", email: pendidik.email, password: "", isi: pendidik.isi || "", role: pendidik.role || "user" });
    setShowEditModal(true);
  };
  const openViewModal = (pendidik) => { setSelectedPendidik(pendidik); setShowViewModal(true); };
  const resetForm = () => { setFormData({ nama: "", no_telp: "", email: "", password: "", isi: "", role: "user" }); setSelectedPendidik(null); };

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
                  <h2 className="text-3xl font-bold text-slate-900">Manajemen Pendidik</h2>
                  <span className="font-medium text-slate-500">Kelola data pendidik dan tenaga pengajar</span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="px-6 py-2 font-semibold text-white bg-teal-700 rounded-full shadow-md" onClick={openCreateModal}>
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
                    <button onClick={handleSearch} className="absolute text-teal-700 transform -translate-y-1/2 right-4 top-1/2">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </button>
                  </div>
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(""); fetchPendidik(); }} 
                      className="px-4 py-2 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full">
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
                    <p className="text-lg font-semibold">Belum ada data pendidik</p>
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
                        {pendidikList.map((pendidik, i) => (
                          <tr key={pendidik.id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                            <td className="px-4 py-3">{i + 1}</td>
                            <td className="px-4 py-3">{pendidik.nama}</td>
                            <td className="px-4 py-3">{pendidik.email}</td>
                            <td className="px-4 py-3">{pendidik.no_telp || "-"}</td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${pendidik.role === "admin" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                                {pendidik.role === "admin" ? "Admin" : "Pendidik"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => openViewModal(pendidik)} className="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-full">View</button>
                                <button onClick={() => openEditModal(pendidik)} className="px-3 py-1 text-sm font-semibold text-white bg-yellow-500 rounded-full">Edit</button>
                                <button onClick={() => handleDelete(pendidik.id)} className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-full">Hapus</button>
                              </div>
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

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="relative w-full max-w-lg p-8 mx-auto bg-white shadow-lg rounded-2xl max-h-[90vh] overflow-y-auto">
            <button className="absolute text-2xl top-6 right-6 text-slate-400 hover:text-teal-700" onClick={() => setShowCreateModal(false)}>✕</button>
            <h3 className="mb-2 text-2xl font-bold text-center">Tambah Pendidik Baru</h3>
            <p className="mb-6 text-base text-center text-slate-500">Silakan lengkapi data berikut untuk menambah pendidik</p>
            <form onSubmit={handleCreate} className="flex flex-col gap-2">
              <span className="font-normal text-slate-700">Nama Lengkap *</span>
              <input type="text" placeholder="Masukkan Nama Lengkap..." className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} required />
              <span className="font-normal text-slate-700">Email *</span>
              <input type="email" placeholder="Masukkan Email..." className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              <span className="font-normal text-slate-700">Password *</span>
              <input type="password" placeholder="Masukkan Password..." className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              <span className="font-normal text-slate-700">No Telepon</span>
              <input type="text" placeholder="Masukkan No Telepon..." className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                value={formData.no_telp} onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })} />
              <span className="font-normal text-slate-700">Role *</span>
              <select className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required>
                <option value="user">Pendidik</option>
                <option value="admin">Admin</option>
              </select>
              <span className="font-normal text-slate-700">Keterangan</span>
              <textarea className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none" rows="3"
                value={formData.isi} onChange={(e) => setFormData({ ...formData, isi: e.target.value })} placeholder="Bio pendidik..." />
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => { setShowCreateModal(false); resetForm(); }} className="flex-1 py-3 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full">Batal</button>
                <button type="submit" className="flex-1 py-3 font-semibold text-white bg-teal-700 rounded-full shadow">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="relative w-full max-w-lg p-8 mx-auto bg-white shadow-lg rounded-2xl max-h-[90vh] overflow-y-auto">
            <button className="absolute text-2xl top-6 right-6 text-slate-400 hover:text-teal-700" onClick={() => setShowEditModal(false)}>✕</button>
            <h3 className="mb-2 text-2xl font-bold text-center">Edit Data Pendidik</h3>
            <form onSubmit={handleUpdate} className="flex flex-col gap-2">
              <span className="font-normal text-slate-700">Nama Lengkap *</span>
              <input type="text" className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} required />
              <span className="font-normal text-slate-700">Email *</span>
              <input type="email" className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              <span className="font-normal text-slate-700">Password</span>
              <input type="password" placeholder="Kosongkan jika tidak ingin mengubah" className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <span className="font-normal text-slate-700">No Telepon</span>
              <input type="text" className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                value={formData.no_telp} onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })} />
              <span className="font-normal text-slate-700">Role *</span>
              <select className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required>
                <option value="user">Pendidik</option>
                <option value="admin">Admin</option>
              </select>
              <span className="font-normal text-slate-700">Keterangan</span>
              <textarea className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none" rows="3"
                value={formData.isi} onChange={(e) => setFormData({ ...formData, isi: e.target.value })} placeholder="Bio pendidik..." />
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => { setShowEditModal(false); resetForm(); }} className="flex-1 py-3 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full">Batal</button>
                <button type="submit" className="flex-1 py-3 font-semibold text-white bg-yellow-600 rounded-full shadow">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedPendidik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="relative w-full max-w-lg p-8 mx-auto bg-white shadow-lg rounded-2xl max-h-[90vh] overflow-y-auto">
            <button className="absolute text-2xl top-6 right-6 text-slate-400 hover:text-teal-700" onClick={() => setShowViewModal(false)}>✕</button>
            <h3 className="mb-4 text-2xl font-bold text-center">Detail Pendidik</h3>
            <div className="space-y-3">
              <div>
                <span className="block text-sm font-semibold text-slate-600">Nama Lengkap</span>
                <p className="text-lg text-slate-800">{selectedPendidik.nama}</p>
              </div>
              <div>
                <span className="block text-sm font-semibold text-slate-600">Email</span>
                <p className="text-lg text-slate-800">{selectedPendidik.email}</p>
              </div>
              <div>
                <span className="block text-sm font-semibold text-slate-600">No. Telepon</span>
                <p className="text-lg text-slate-800">{selectedPendidik.no_telp || "-"}</p>
              </div>
              <div>
                <span className="block text-sm font-semibold text-slate-600">Role</span>
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${selectedPendidik.role === "admin" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                  {selectedPendidik.role === "admin" ? "Admin" : "Pendidik"}
                </span>
              </div>
              <div>
                <span className="block text-sm font-semibold text-slate-600">Keterangan</span>
                <p className="text-slate-800 whitespace-pre-wrap">{selectedPendidik.isi || "-"}</p>
              </div>
              <div>
                <span className="block text-sm font-semibold text-slate-600">Tanggal Dibuat</span>
                <p className="text-slate-800">
                  {new Date(selectedPendidik.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
            <button onClick={() => setShowViewModal(false)} className="w-full py-3 mt-6 font-semibold text-white bg-teal-700 rounded-full shadow">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
