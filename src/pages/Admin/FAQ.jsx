import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import FAQService from "../../services/FAQService";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [formData, setFormData] = useState({
    judul: "",
    isi: "",
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    filterFaqs();
  }, [searchKeyword, faqs]);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const data = await FAQService.getAll();
      setFaqs(data);
      setFilteredFaqs(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Gagal mengambil data FAQ",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterFaqs = () => {
    if (!searchKeyword.trim()) {
      setFilteredFaqs(faqs);
      return;
    }

    const keyword = searchKeyword.toLowerCase();
    const filtered = faqs.filter(
      (faq) =>
        faq.judul.toLowerCase().includes(keyword) ||
        faq.isi.toLowerCase().includes(keyword)
    );
    setFilteredFaqs(filtered);
  };

  const handleOpenModal = (mode, faq = null) => {
    setModalMode(mode);
    if (mode === "edit" && faq) {
      setSelectedFaq(faq);
      setFormData({
        judul: faq.judul,
        isi: faq.isi,
      });
    } else {
      setSelectedFaq(null);
      setFormData({
        judul: "",
        isi: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFaq(null);
    setFormData({
      judul: "",
      isi: "",
    });
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

    // Validation
    if (!formData.judul.trim() || !formData.isi.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Judul dan Isi harus diisi!",
      });
      return;
    }

    try {
      setLoading(true);

      if (modalMode === "create") {
        await FAQService.create(formData);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "FAQ berhasil ditambahkan!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await FAQService.update(selectedFaq.id, formData);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "FAQ berhasil diupdate!",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      handleCloseModal();
      fetchFaqs();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Gagal menyimpan FAQ",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: "Apakah Anda yakin ingin menghapus FAQ ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await FAQService.delete(id);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "FAQ berhasil dihapus!",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchFaqs();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Gagal menghapus FAQ",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminHeader />
      <div className="flex">
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
          <AdminSidebar activeMenu="FAQ" />
        </div>
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            <section className="p-10 bg-[#f5f6fa] min-h-screen">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="mb-2 text-3xl font-bold text-slate-900">
                    FAQ
                  </h2>
                  <span className="block font-medium text-slate-500">
                    Kelola FAQ
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleOpenModal("create")}
                    className="px-6 py-2 font-semibold text-white bg-teal-700 rounded-full shadow-md hover:bg-teal-800 transition flex items-center gap-2"
                  >
                    <FaPlus /> Tambah FAQ
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari judul atau isi FAQ..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* FAQ Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada data FAQ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Judul
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Isi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFaqs.map((faq, index) => (
                  <tr key={faq.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {faq.judul}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {faq.isi.length > 100
                        ? faq.isi.substring(0, 100) + "..."
                        : faq.isi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal("edit", faq)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Hapus"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
              </div>

              {/* Modal */}
              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-800">
                        {modalMode === "create" ? "Tambah FAQ" : "Edit FAQ"}
                      </h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="px-6 py-4 space-y-4">
                {/* Judul */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan judul FAQ"
                    required
                  />
                </div>

                {/* Isi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Isi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="isi"
                    value={formData.isi}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan isi FAQ"
                    required
                  />
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          {loading ? "Menyimpan..." : "Simpan"}
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
};

export default FAQ;
