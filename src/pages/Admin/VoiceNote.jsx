import React, { useState, useEffect } from "react";
import AdminHeader from "../../components/AdminHeader";
import AdminSidebar from "../../components/AdminSidebar";
import VoiceNoteService from "../../services/VoiceNoteService";
import PendaftaranService from "../../services/PendaftaranService";
import Swal from "sweetalert2";

export default function VoiceNote() {
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [angkatanOptions, setAngkatanOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [filters, setFilters] = useState({
    angkatan: "",
    status_penilaian: "",
    search: "",
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedVN, setSelectedVN] = useState(null);
  const [penilaianData, setPenilaianData] = useState({
    nilai: "",
    catatan_penilaian: "",
  });

  useEffect(() => {
    fetchAngkatan();
    fetchVoiceNotes();
  }, [pagination.page, filters]);

  const fetchAngkatan = async () => {
    try {
      const response = await PendaftaranService.getAngkatanDropdown();
      setAngkatanOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching angkatan:", error);
    }
  };

  const fetchVoiceNotes = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach(
        (key) => params[key] === "" && delete params[key]
      );

      const response = await VoiceNoteService.getAll(params);

      if (response.success) {
        setVoiceNotes(response.data || []);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching voice notes:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Tidak dapat memuat data voice note",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
  };

  const handleOpenModal = (voiceNote) => {
    setSelectedVN(voiceNote);
    setPenilaianData({
      nilai: voiceNote.nilai || "",
      catatan_penilaian: voiceNote.catatan_penilaian || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVN(null);
    setPenilaianData({ nilai: "", catatan_penilaian: "" });
  };

  const handleSubmitPenilaian = async (e) => {
    e.preventDefault();

    if (!penilaianData.nilai || penilaianData.nilai < 0 || penilaianData.nilai > 100) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Nilai harus diisi dan berada di antara 0-100",
      });
      return;
    }

    try {
      const response = await VoiceNoteService.updatePenilaian(
        selectedVN.id,
        penilaianData
      );

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Penilaian berhasil disimpan!",
          timer: 2000,
        });
        handleCloseModal();
        fetchVoiceNotes(); // Refresh data
      }
    } catch (error) {
      console.error("Error submitting penilaian:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal menyimpan penilaian",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Voice Note?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await VoiceNoteService.delete(id);
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Voice note berhasil dihapus",
          timer: 2000,
        });
        fetchVoiceNotes();
      } catch (error) {
        console.error("Error deleting voice note:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal menghapus voice note",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminHeader />
      <div className="flex">
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
          <AdminSidebar activeMenu="Voice Note" />
        </div>
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            <section className="p-10 bg-[#f5f6fa] min-h-screen">
              {/* Header */}
              <div className="mb-6">
                <h2 className="mb-2 text-3xl font-bold text-slate-900">
                  Penilaian Voice Note
                </h2>
                <span className="block font-medium text-slate-500">
                  Kelola dan nilai rekaman bacaan Al-Qur'an santri
                </span>
              </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Filter Angkatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Angkatan
                </label>
                <select
                  value={filters.angkatan}
                  onChange={(e) => handleFilterChange("angkatan", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Semua Angkatan</option>
                  {angkatanOptions.map((opt) => (
                    <option key={opt.id} value={opt.angkatan}>
                      Angkatan {opt.angkatan}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Status Penilaian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Penilaian
                </label>
                <select
                  value={filters.status_penilaian}
                  onChange={(e) =>
                    handleFilterChange("status_penilaian", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Semua Status</option>
                  <option value="Belum Dinilai">Belum Dinilai</option>
                  <option value="Sudah Dinilai">Sudah Dinilai</option>
                </select>
              </div>

              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Nama / Asal Sekolah
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Ketik untuk mencari..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Voice Note</p>
                  <p className="text-3xl font-bold mt-2">{pagination.total}</p>
                </div>
                <div className="bg-blue-400 bg-opacity-30 p-4 rounded-full">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Belum Dinilai</p>
                  <p className="text-3xl font-bold mt-2">
                    {voiceNotes.filter((vn) => vn.status_penilaian === "Belum Dinilai").length}
                  </p>
                </div>
                <div className="bg-yellow-400 bg-opacity-30 p-4 rounded-full">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Sudah Dinilai</p>
                  <p className="text-3xl font-bold mt-2">
                    {voiceNotes.filter((vn) => vn.status_penilaian === "Sudah Dinilai").length}
                  </p>
                </div>
                <div className="bg-green-400 bg-opacity-30 p-4 rounded-full">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : voiceNotes.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
                <p className="mt-4 text-gray-500">Tidak ada data voice note</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Santri
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Angkatan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Asal Sekolah
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Audio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nilai
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {voiceNotes.map((vn, index) => (
                        <tr key={vn.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(pagination.page - 1) * pagination.limit + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {vn.nama_lengkap}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {vn.angkatan}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {vn.asal_sekolah}
                          </td>
                          <td className="px-6 py-4">
                            {vn.file_path && (
                              <audio controls className="w-64">
                                <source
                                  src={`http://localhost:5000/${encodeURI(
                                    vn.file_path.replace(/\\/g, "/")
                                  )}`}
                                  type="audio/mpeg"
                                />
                                Browser tidak mendukung audio player.
                              </audio>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                vn.status_penilaian === "Sudah Dinilai"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {vn.status_penilaian}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {vn.nilai ? (
                              <span className="font-semibold text-teal-600">
                                {vn.nilai}/100
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleOpenModal(vn)}
                              className="text-teal-600 hover:text-teal-900 mr-3"
                            >
                              {vn.status_penilaian === "Sudah Dinilai" ? "Edit" : "Nilai"}
                            </button>
                            <button
                              onClick={() => handleDelete(vn.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: Math.max(prev.page - 1, 1),
                        }))
                      }
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: Math.min(prev.page + 1, prev.totalPages),
                        }))
                      }
                      disabled={pagination.page === pagination.totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Menampilkan{" "}
                        <span className="font-medium">
                          {(pagination.page - 1) * pagination.limit + 1}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-medium">
                          {Math.min(
                            pagination.page * pagination.limit,
                            pagination.total
                          )}
                        </span>{" "}
                        dari <span className="font-medium">{pagination.total}</span>{" "}
                        hasil
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() =>
                            setPagination((prev) => ({
                              ...prev,
                              page: Math.max(prev.page - 1, 1),
                            }))
                          }
                          disabled={pagination.page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          Halaman {pagination.page} dari {pagination.totalPages}
                        </span>
                        <button
                          onClick={() =>
                            setPagination((prev) => ({
                              ...prev,
                              page: Math.min(prev.page + 1, prev.totalPages),
                            }))
                          }
                          disabled={pagination.page === pagination.totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Modal Penilaian */}
          {showModal && selectedVN && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleCloseModal}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmitPenilaian}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Penilaian Voice Note
                      </h3>

                      {/* Info Santri */}
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Nama:</span>{" "}
                          {selectedVN.nama_lengkap}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Angkatan:</span>{" "}
                          {selectedVN.angkatan}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Asal Sekolah:</span>{" "}
                          {selectedVN.asal_sekolah}
                        </p>
                      </div>

                      {/* Audio Player */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rekaman Bacaan
                        </label>
                        <audio controls className="w-full">
                          <source
                            src={`http://localhost:5000/${encodeURI(
                              selectedVN.file_path.replace(/\\/g, "/")
                            )}`}
                            type="audio/mpeg"
                          />
                          Browser tidak mendukung audio player.
                        </audio>
                      </div>

                      {/* Nilai */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nilai (0-100) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={penilaianData.nilai}
                          onChange={(e) =>
                            setPenilaianData((prev) => ({
                              ...prev,
                              nilai: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        />
                      </div>

                      {/* Catatan */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Catatan Penilaian
                        </label>
                        <textarea
                          value={penilaianData.catatan_penilaian}
                          onChange={(e) =>
                            setPenilaianData((prev) => ({
                              ...prev,
                              catatan_penilaian: e.target.value,
                            }))
                          }
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="Berikan catatan untuk santri..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Simpan Penilaian
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
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
