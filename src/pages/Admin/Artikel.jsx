import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";
import ArtikelService from "../../services/ArtikelService";
import { getImageUrl } from "../../config/api";
import Swal from "sweetalert2";

export default function Artikel() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const fileInputRef = React.useRef();

  // State untuk data artikel
  const [artikelList, setArtikelList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const [editMode, setEditMode] = React.useState(false);
  const [currentArtikel, setCurrentArtikel] = React.useState(null);

  // Form state
  const [formData, setFormData] = React.useState({
    judul: "",
    isi: "",
    foto: "",
    kategori: "",
  });

  React.useEffect(() => {
    // Check if admin is logged in
    if (!AdminService.isLoggedIn()) {
      navigate("/admin");
      return;
    }
    fetchArtikel();
  }, [navigate]);

  // Fetch semua artikel
  const fetchArtikel = async () => {
    try {
      setLoading(true);
      const response = await ArtikelService.getAllArtikel();
      if (response.success) {
        setArtikelList(response.data);
      }
    } catch (error) {
      console.error("Error fetching artikel:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengambil data artikel",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (keyword.trim() === "") {
      fetchArtikel();
      return;
    }

    try {
      const response = await ArtikelService.searchArtikel(keyword);
      if (response.success) {
        setArtikelList(response.data);
      }
    } catch (error) {
      console.error("Error searching artikel:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "warning",
          title: "File Terlalu Besar",
          text: "Ukuran file maksimal 5MB",
        });
        return;
      }

      // Validasi tipe file
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: "warning",
          title: "Tipe File Tidak Valid",
          text: "Hanya file gambar (JPEG, JPG, PNG, GIF, WEBP) yang diizinkan",
        });
        return;
      }

      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Upload foto ke server
  const uploadFotoToServer = async (file) => {
    try {
      const response = await ArtikelService.uploadFoto(file);
      if (response.success) {
        return response.data.url; // Return URL foto
      }
      return null;
    } catch (error) {
      console.error("Error uploading foto:", error);
      throw error;
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      judul: "",
      isi: "",
      foto: "",
      kategori: "",
    });
    setImage(null);
    setPreview(null);
    setEditMode(false);
    setCurrentArtikel(null);
  };

  // Open modal untuk tambah artikel
  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Handle create artikel
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!formData.judul || !formData.isi || !formData.kategori) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Judul, isi, dan kategori artikel harus diisi!",
      });
      return;
    }

    try {
      // Show loading
      Swal.fire({
        title: "Membuat artikel...",
        text: "Mohon tunggu",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      let fotoUrl = formData.foto;

      // Upload foto jika ada file yang dipilih
      if (image) {
        fotoUrl = await uploadFotoToServer(image);
      }

      const admin = AdminService.getCurrentAdmin();
      const finalKategori = formData.kategori;

      const response = await ArtikelService.createArtikel({
        judul: formData.judul,
        isi: formData.isi,
        foto: fotoUrl,
        kategori: finalKategori,
        id_pengguna: admin.id,
      });

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Artikel berhasil dibuat!",
          timer: 2000,
          showConfirmButton: false,
        });
        setShowModal(false);
        fetchArtikel();
        resetForm();
      }
    } catch (error) {
      console.error("Error creating artikel:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Gagal membuat artikel",
      });
    }
  };

  // Handle update artikel
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.judul || !formData.isi || !formData.kategori) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Judul, isi, dan kategori artikel harus diisi!",
      });
      return;
    }

    try {
      // Show loading
      Swal.fire({
        title: "Mengupdate artikel...",
        text: "Mohon tunggu",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      let fotoUrl = formData.foto;

      // Upload foto baru jika ada file yang dipilih
      if (image) {
        fotoUrl = await uploadFotoToServer(image);
      }

      const finalKategori = formData.kategori;

      const response = await ArtikelService.updateArtikel(currentArtikel.id, {
        judul: formData.judul,
        isi: formData.isi,
        foto: fotoUrl,
        kategori: finalKategori,
      });

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Artikel berhasil diupdate!",
          timer: 2000,
          showConfirmButton: false,
        });
        setViewModal(false);
        fetchArtikel();
        resetForm();
      }
    } catch (error) {
      console.error("Error updating artikel:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Gagal mengupdate artikel",
      });
    }
  };

  // Handle delete artikel
  const handleDelete = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Konfirmasi Hapus",
      text: "Yakin ingin menghapus artikel ini?",
      showCancelButton: true,
      confirmButtonColor: "#0f766e",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await ArtikelService.deleteArtikel(currentArtikel.id);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Artikel berhasil dihapus!",
          timer: 2000,
          showConfirmButton: false,
        });
        setViewModal(false);
        fetchArtikel();
        resetForm();
      }
    } catch (error) {
      console.error("Error deleting artikel:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Gagal menghapus artikel",
      });
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // New: modal for viewing article details
  const [viewModal, setViewModal] = React.useState(false);
  const [selectedArticle, setSelectedArticle] = React.useState(null);

  const openViewModal = (article) => {
    setCurrentArtikel(article);
    setFormData({
      judul: article.judul,
      isi: article.isi,
      foto: article.foto || "",
      kategori: article.kategori || "",
    });
    // Set preview dengan URL lengkap dari server jika ada foto
    if (article.foto) {
      setPreview(`http://localhost:5000${article.foto}`);
    } else {
      setPreview(null);
    }
    setImage(null);
    setEditMode(true);
    setViewModal(true);
  };

  const closeViewModal = () => {
    setViewModal(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminHeader />
      <div className="flex">
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
          <AdminSidebar activeMenu="Artikel" />
        </div>
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            <section className="p-10 bg-[#f5f6fa] min-h-screen">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="mb-2 text-3xl font-bold text-slate-900">
                    Artikel
                  </h2>
                  <span className="block font-medium text-slate-500">
                    Artikel
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="px-6 py-2 font-semibold text-white bg-teal-700 rounded-full shadow-md"
                    onClick={openAddModal}
                  >
                    Tambah
                  </button>
                  {/* Modal Tambah Artikel */}
                  {showModal && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-30">
                      <div className="relative w-full max-w-lg p-8 mx-auto mt-5 mb-12 bg-white shadow-lg rounded-2xl">
                        <button
                          className="absolute text-2xl top-6 right-6 text-slate-400 hover:text-teal-700"
                          onClick={() => {
                            setShowModal(false);
                            resetForm();
                          }}
                          aria-label="Tutup"
                        >
                          &#10005;
                        </button>
                        <h3 className="mb-2 text-2xl font-bold text-center">
                          Tambah Artikel
                        </h3>
                        <p className="mb-6 text-base text-center text-slate-500">
                          Silakan lengkapi data berikut menambah artikel
                          Pesantren Al Ihsan Bekasi.
                        </p>
                        <form
                          className="flex flex-col gap-2"
                          onSubmit={handleCreate}
                        >
                          <span className="text-sm font-medium text-slate-700">
                            Foto Artikel
                          </span>
                          <div
                            className="flex items-center justify-center w-full h-40 mb-2 rounded-lg cursor-pointer bg-slate-100 hover:bg-slate-200 transition-colors"
                            onClick={handleImageClick}
                          >
                            {preview ? (
                              <img
                                src={preview}
                                alt="Preview"
                                className="object-contain h-full rounded-lg"
                              />
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <span className="text-4xl font-bold text-slate-400">
                                  +
                                </span>
                                <span className="text-sm text-slate-500">
                                  Klik untuk upload foto
                                </span>
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
                          {image && (
                            <span className="text-xs text-slate-600">
                              File: {image.name} (
                              {(image.size / 1024).toFixed(2)} KB)
                            </span>
                          )}
                          <span className="text-sm font-medium text-slate-700">
                            Kategori <span className="text-red-500">*</span>
                          </span>
                          <select
                            name="kategori"
                            value={formData.kategori}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                            required
                          >
                            <option value="">Pilih Kategori</option>
                            <option value="Prestasi">Prestasi</option>
                            <option value="Kegiatan">Kegiatan</option>
                            <option value="Berita Islami">Berita Islami</option>
                            <option value="Lainnya">Lainnya</option>
                          </select>
                          <span className="text-sm font-medium text-slate-700">
                            Judul <span className="text-red-500">*</span>
                          </span>
                          <input
                            type="text"
                            name="judul"
                            value={formData.judul}
                            onChange={handleInputChange}
                            placeholder="Masukkan Judul..."
                            className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                            required
                          />
                          <span className="text-sm font-medium text-slate-700">
                            Isi <span className="text-red-500">*</span>
                          </span>
                          <textarea
                            name="isi"
                            value={formData.isi}
                            onChange={handleInputChange}
                            placeholder="Masukkan Isi..."
                            className="w-full px-5 py-3 font-medium rounded-lg resize-none bg-slate-100 text-slate-700 focus:outline-none"
                            rows={4}
                            required
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
                      value={searchKeyword}
                      onChange={handleSearch}
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
              {/* Card and table */}
              <div className="p-8 bg-white border shadow rounded-2xl border-slate-100">
                {loading ? (
                  <div className="py-12 text-center">
                    <p className="text-slate-500">Memuat data artikel...</p>
                  </div>
                ) : artikelList.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-slate-500">Belum ada artikel</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left">
                        <thead>
                          <tr className="text-base font-bold text-slate-700">
                            <th className="px-4 py-3">NO</th>
                            <th className="px-4 py-3">Judul</th>
                            <th className="px-4 py-3">Kategori</th>
                            <th className="px-4 py-3">Penulis</th>
                            <th className="px-4 py-3">Tanggal</th>
                            <th className="px-4 py-3">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {artikelList.map((artikel, i) => (
                            <tr
                              key={artikel.id}
                              className={
                                i % 2 === 0 ? "bg-white" : "bg-slate-50"
                              }
                            >
                              <td className="px-4 py-3">{i + 1}</td>
                              <td className="px-4 py-3">{artikel.judul}</td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-1 text-xs font-medium text-teal-700 bg-teal-100 rounded-full">
                                  {artikel.kategori || "Tidak ada"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {artikel.penulis?.nama || "Admin"}
                              </td>
                              <td className="px-4 py-3">
                                {new Date(
                                  artikel.created_at
                                ).toLocaleDateString("id-ID")}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  className="px-4 py-1 font-semibold text-white bg-teal-700 rounded-full"
                                  onClick={() => openViewModal(artikel)}
                                >
                                  Lihat
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-4">
                      <button className="px-2 py-1 rounded bg-slate-100 text-slate-700">
                        &lt;
                      </button>
                      <span className="px-2">1</span>
                      <button className="px-2 py-1 rounded bg-slate-100 text-slate-700">
                        &gt;
                      </button>
                    </div>
                  </>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* View Article Modal (matches design image) */}
      {viewModal && currentArtikel && (
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
              Edit Artikel
            </h3>
            <p className="mb-6 text-base text-center text-slate-500">
              Silakan lengkapi data berikut menyunting artikel Pesantren Al
              Ihsan Bekasi.
            </p>

            <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
              <label className="text-sm font-medium text-slate-700">
                Foto Artikel
              </label>
              <div
                className="w-full h-40 rounded-lg bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors"
                onClick={handleImageClick}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="object-contain h-full rounded-lg"
                  />
                ) : formData.foto ? (
                  <img
                    src={`http://localhost:5000${formData.foto}`}
                    alt="Foto artikel"
                    className="object-contain h-full rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl font-bold text-slate-400">+</span>
                    <span className="text-sm text-slate-500">
                      Klik untuk upload foto baru
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
              {image && (
                <span className="text-xs text-slate-600">
                  File baru: {image.name} ({(image.size / 1024).toFixed(2)} KB)
                </span>
              )}

              <label className="text-sm font-medium text-slate-700">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleInputChange}
                className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                required
              >
                <option value="">Pilih Kategori</option>
                <option value="Prestasi">Prestasi</option>
                <option value="Kegiatan">Kegiatan</option>
                <option value="Berita Islami">Berita Islami</option>
                <option value="Lainnya">Lainnya</option>
              </select>

              <label className="text-sm font-medium text-slate-700">
                Judul <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="judul"
                value={formData.judul}
                onChange={handleInputChange}
                className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                required
              />

              <label className="text-sm font-medium text-slate-700">
                Isi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="isi"
                value={formData.isi}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-5 py-3 font-medium rounded-lg resize-none bg-slate-100 text-slate-700 focus:outline-none"
                required
              />

              <label className="text-sm font-medium text-slate-700">
                Penulis
              </label>
              <input
                type="text"
                value={currentArtikel.penulis?.nama || "Admin"}
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
          </div>
        </div>
      )}
    </div>
  );
}
