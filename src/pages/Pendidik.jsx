import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminService from "../services/AdminService";
import Swal from "sweetalert2";

export default function Pendidik() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
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
    const admin = AdminService.getCurrentAdmin();
    if (admin) {
      setAdminData(admin);
    }
    fetchPendidik();
  }, []);

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
      Swal.fire({ icon: "error", title: "Gagal", text: error.message || "Gagal mencari data pendidik" });
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
      if (!updateData.password) {
        delete updateData.password;
      }
      const response = await AdminService.updatePendidik(selectedPendidik.id, updateData);
      if (response.success) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Data pendidik berhasil diupdate", timer: 1500 });
        setShowEditModal(false);
        resetForm();
        fetchPendidik();
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Gagal", text: error.message || "Gagal mengupdate pendidik" });
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
        Swal.fire({ icon: "error", title: "Gagal", text: error.message || "Gagal menghapus pendidik" });
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
  const handleLogout = async () => { await AdminService.logout(); navigate("/admin"); };
  const adminName = adminData?.nama || "Admin";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 flex items-center justify-between w-full px-10 py-5 text-white shadow bg-gradient-to-r from-teal-800 to-teal-600">
        <div className="flex items-center gap-3"><img src="/assets/logo3.png" alt="Logo" className="h-8" /></div>
        <div className="flex items-center gap-4">
          <span className="font-semibold">Halo, {adminName}</span>
          <img src="/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png" alt="Admin" className="object-cover w-8 h-8 border-2 border-white rounded-full" />
          <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold transition bg-red-500 rounded-lg hover:bg-red-600">Logout</button>
        </div>
      </header>
      <div className="flex">
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30"><AdminSidebar activeMenu="Pendidik" /></div>
        <div className="flex-1 ml-64">
          <main className="p-8">
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold text-gray-800">Manajemen Pendidik</h1>
              <p className="text-gray-600">Kelola data pendidik dan tenaga pengajar</p>
            </div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center flex-1 gap-2">
                <input type="text" placeholder="Cari nama atau email..." className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSearch()} />
                <button onClick={handleSearch} className="px-6 py-2 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700">Cari</button>
                {searchQuery && <button onClick={() => { setSearchQuery(""); fetchPendidik(); }} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Reset</button>}
              </div>
              <button onClick={openCreateModal} className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">+ Tambah Pendidik</button>
            </div>
            <div className="overflow-hidden bg-white rounded-lg shadow">
              {loading ? (
                <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-teal-600 rounded-full border-t-transparent animate-spin"></div></div>
              ) : pendidikList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <span className="mb-2 text-5xl"></span>
                  <p className="text-lg font-semibold">Belum ada data pendidik</p>
                  <p className="text-sm">Klik "Tambah Pendidik" untuk menambahkan data baru</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="text-white bg-teal-600">
                    <tr>
                      <th className="px-6 py-4 text-left">No</th>
                      <th className="px-6 py-4 text-left">Nama</th>
                      <th className="px-6 py-4 text-left">Email</th>
                      <th className="px-6 py-4 text-left">No. Telepon</th>
                      <th className="px-6 py-4 text-left">Role</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendidikList.map((pendidik, index) => (
                      <tr key={pendidik.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4 font-semibold">{pendidik.nama}</td>
                        <td className="px-6 py-4">{pendidik.email}</td>
                        <td className="px-6 py-4">{pendidik.no_telp || "-"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${pendidik.role === "admin" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                            {pendidik.role === "admin" ? "Admin" : "Pendidik"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => openViewModal(pendidik)} className="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded hover:bg-green-600">View</button>
                            <button onClick={() => openEditModal(pendidik)} className="px-3 py-1 text-sm font-semibold text-white bg-yellow-500 rounded hover:bg-yellow-600">Edit</button>
                            <button onClick={() => handleDelete(pendidik.id)} className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </main>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-2xl font-bold text-teal-800">Tambah Pendidik Baru</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">Nama Lengkap *</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">Email *</label>
                <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">Password *</label>
                <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">No. Telepon</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.no_telp} onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">Role *</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required>
                  <option value="user">Pendidik</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">Keterangan / Bio</label>
                <textarea className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" rows="4"
                  value={formData.isi} onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                  placeholder="Tulis bio atau keterangan tentang pendidik..." />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { setShowCreateModal(false); resetForm(); }}
                  className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Batal</button>
                <button type="submit" className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-2xl font-bold text-teal-800">Edit Data Pendidik</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">Nama Lengkap *</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">Email *</label>
                <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">Password</label>
                <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Kosongkan jika tidak ingin mengubah password" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">No. Telepon</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.no_telp} onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">Role *</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required>
                  <option value="user">Pendidik</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">Keterangan / Bio</label>
                <textarea className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" rows="4"
                  value={formData.isi} onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                  placeholder="Tulis bio atau keterangan tentang pendidik..." />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { setShowEditModal(false); resetForm(); }}
                  className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Batal</button>
                <button type="submit" className="px-6 py-2 font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedPendidik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-2xl font-bold text-teal-800">Detail Pendidik</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-600">Nama Lengkap</label>
                <p className="text-lg text-gray-800">{selectedPendidik.nama}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-600">Email</label>
                <p className="text-lg text-gray-800">{selectedPendidik.email}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-600">No. Telepon</label>
                <p className="text-lg text-gray-800">{selectedPendidik.no_telp || "-"}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-600">Role</label>
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedPendidik.role === "admin" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                  {selectedPendidik.role === "admin" ? "Admin" : "Pendidik"}
                </span>
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-600">Keterangan / Bio</label>
                <p className="text-gray-800 whitespace-pre-wrap">{selectedPendidik.isi || "-"}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-600">Tanggal Dibuat</label>
                <p className="text-gray-800">
                  {new Date(selectedPendidik.created_at).toLocaleDateString("id-ID", {
                    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                  })}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setShowViewModal(false)}
                className="px-6 py-2 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
