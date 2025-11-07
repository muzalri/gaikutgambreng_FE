import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";
import TestimonialService from "../../services/TestimonialService";
import Swal from "sweetalert2";
import api from "../../config/api";

export default function Testimonial() {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [allTestimonials, setAllTestimonials] = useState([]); // Untuk menyimpan semua data
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua Kategori");
  const [showModal, setShowModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    asal: "",
    testimonial: "",
    foto: null,
    kategori: "",
    angkatan: "",
  });
  const [fotoPreview, setFotoPreview] = useState(null);

  useEffect(() => {
    // Check if admin is logged in
    if (!AdminService.isLoggedIn()) {
      navigate("/admin");
      return;
    }

    // Load testimonials from API
    loadTestimonials();
  }, [navigate]);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const response = await TestimonialService.getAll();
      if (response.success && response.data && response.data.length > 0) {
        // Transform data untuk menyesuaikan dengan UI
        const transformedData = response.data.map((item) => ({
          id: item.id,
          nama: item.nama,
          asal: item.asal || '',
          testimonial: item.testimonial,
          foto: item.foto ? `http://localhost:5000/uploads/testimonial/${encodeURIComponent(item.foto)}` : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          status: 'Aktif',
          kategori: item.kategori,
          angkatan: item.angkatan || ''
        }));
        console.log('Loaded testimonials with encoded URLs:', transformedData);
        setTestimonials(transformedData);
        setAllTestimonials(transformedData); // Simpan semua data
      } else {
        // Jika response success tapi data kosong, set empty array
        setTestimonials([]);
        setAllTestimonials([]);
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
      // Set empty array jika terjadi error
      setTestimonials([]);
      setAllTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter testimonials berdasarkan kategori dan search keyword
  useEffect(() => {
    let filtered = [...allTestimonials];

    // Filter berdasarkan kategori
    if (selectedKategori !== "Semua Kategori") {
      filtered = filtered.filter(t => t.kategori === selectedKategori);
    }

    // Filter berdasarkan search keyword
    if (searchKeyword) {
      filtered = filtered.filter(t => 
        t.nama.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        t.testimonial.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        t.asal.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    setTestimonials(filtered);
  }, [selectedKategori, searchKeyword, allTestimonials]);

  const handleKategoriChange = (e) => {
    setSelectedKategori(e.target.value);
  };

  const openViewModal = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setShowModal(true);
  };

  const closeViewModal = () => {
    setShowModal(false);
    setSelectedTestimonial(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        foto: file,
      }));
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleFotoClick = () => {
    document.getElementById("fotoInput").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi form
    if (!formData.nama || !formData.kategori || !formData.testimonial) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Nama, Kategori, dan Testimonial wajib diisi!",
      });
      return;
    }

    try {
      // Call API to create testimonial
      const response = await TestimonialService.create(formData);
      
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Testimonial berhasil ditambahkan!",
          timer: 1500,
        });

        // Reset form
        setFormData({
          nama: "",
          asal: "",
          testimonial: "",
          foto: null,
          kategori: "",
          angkatan: "",
        });
        setFotoPreview(null);
        setShowModal(false);

        // Reload testimonials
        loadTestimonials();
      }
    } catch (error) {
      console.error('Error creating testimonial:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Gagal menambahkan testimonial",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminHeader />
      <div className="flex">
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
          <AdminSidebar activeMenu="Testimonial" />
        </div>
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            <section className="p-10 bg-[#f5f6fa] min-h-screen">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="mb-2 text-3xl font-bold text-slate-900">
                    Testimonial
                  </h2>
                  <span className="block font-medium text-slate-500">
                    Kelola testimonial dari santri dan orang tua
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="px-6 py-2 font-semibold text-white bg-teal-700 rounded-full shadow-md hover:bg-teal-800 transition"
                    onClick={() => setShowModal(true)}
                  >
                    Tambah
                  </button>
                  <div className="relative">
                    <select 
                      value={selectedKategori}
                      onChange={handleKategoriChange}
                      className="px-6 py-2 pr-10 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400"
                    >
                      <option>Semua Kategori</option>
                      <option>Wali Santri</option>
                      <option>Alumni</option>
                      <option>Santri</option>
                      <option>Guru/Ustadz</option>
                      <option>Lainnya</option>
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
                      placeholder="Cari testimonial..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
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

              {/* Testimonial Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full text-center py-12 text-slate-500">
                    Loading...
                  </div>
                ) : testimonials.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-slate-500">
                    Tidak ada testimonial
                  </div>
                ) : (
                  testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                    >
                      {/* Header dengan foto dan nama */}
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={testimonial.foto}
                          alt={testimonial.nama}
                          className="w-12 h-12 rounded-full object-cover"
                          onLoad={() => console.log('✅ Image loaded:', testimonial.foto)}
                          onError={(e) => {
                            console.log('❌ Image failed to load:', testimonial.foto);
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';
                          }}
                        />
                        <div>
                          <h3 className="font-bold text-slate-900">
                            {testimonial.nama}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {testimonial.asal}
                          </p>
                        </div>
                      </div>

                      {/* Testimonial Text */}
                      <p className="text-slate-700 text-sm leading-relaxed mb-4">
                        "{testimonial.testimonial}"
                      </p>

                      {/* Kategori dan Angkatan */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          {testimonial.kategori}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                          {testimonial.angkatan}
                        </span>
                      </div>

                      {/* Status dan Aksi */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            testimonial.status === "Aktif"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {testimonial.status}
                        </span>
                        <button
                          onClick={() => openViewModal(testimonial)}
                          className="bg-teal-700 text-white px-4 py-1 rounded-full font-semibold hover:bg-teal-800 transition text-sm"
                        >
                          Lihat
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* View Modal */}
              {showModal && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-30">
                  <div className="relative w-full max-w-2xl p-8 mx-auto mt-5 mb-12 bg-white shadow-lg rounded-2xl">
                    <button
                      className="absolute text-2xl top-6 right-6 text-slate-400 hover:text-teal-700"
                      onClick={closeViewModal}
                      aria-label="Tutup"
                    >
                      &#10005;
                    </button>

                    {selectedTestimonial ? (
                      // View Mode
                      <>
                        <h3 className="text-2xl font-extrabold text-center mb-2">
                          Lihat Testimoni
                        </h3>
                        <p className="text-sm text-center text-slate-500 mb-6">
                          Data berikut merupakan testmoni santri Pesantren Al
                          Ihsan Bekasi.
                        </p>

                        {/* Foto Santri */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Foto Santri
                          </label>
                          <div className="w-full h-48 bg-slate-100 rounded-lg overflow-hidden">
                            <img
                              src={selectedTestimonial.foto}
                              alt={selectedTestimonial.nama}
                              className="w-full h-full object-cover"
                              onLoad={() => console.log('✅ Modal image loaded:', selectedTestimonial.foto)}
                              onError={(e) => {
                                console.log('❌ Modal image failed to load:', selectedTestimonial.foto);
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';
                              }}
                            />
                          </div>
                        </div>

                        {/* Nama */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nama
                          </label>
                          <input
                            type="text"
                            value={selectedTestimonial.nama}
                            readOnly
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                          />
                        </div>

                        {/* Angkatan */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Angkatan
                          </label>
                          <input
                            type="text"
                            value={selectedTestimonial.angkatan || "6"}
                            readOnly
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                          />
                        </div>

                        {/* Isi */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Isi
                          </label>
                          <textarea
                            value={selectedTestimonial.testimonial}
                            readOnly
                            rows="3"
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={closeViewModal}
                            className="px-8 py-3 bg-teal-700 text-white rounded-full font-semibold hover:bg-teal-800 transition"
                          >
                            Konfirmasi
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                const result = await Swal.fire({
                                  title: 'Apakah Anda yakin?',
                                  text: "Data tidak dapat dikembalikan!",
                                  icon: 'warning',
                                  showCancelButton: true,
                                  confirmButtonColor: '#d33',
                                  cancelButtonColor: '#3085d6',
                                  confirmButtonText: 'Ya, hapus!',
                                  cancelButtonText: 'Batal'
                                });

                                if (result.isConfirmed) {
                                  await TestimonialService.delete(selectedTestimonial.id);
                                  Swal.fire('Terhapus!', 'Testimonial berhasil dihapus.', 'success');
                                  closeViewModal();
                                  loadTestimonials();
                                }
                              } catch (error) {
                                console.error('Error deleting testimonial:', error);
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Error',
                                  text: error.message || 'Gagal menghapus testimonial'
                                });
                              }
                            }}
                            className="px-8 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
                          >
                            Hapus
                          </button>
                        </div>
                      </>
                    ) : (
                      // Add Mode
                      <>
                        <h3 className="text-2xl font-extrabold text-center mb-6">
                          Tambah Testimonial
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          {/* Upload Foto */}
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Foto Testimoni
                            </label>
                            <div className="relative">
                              <div
                                className="w-full h-32 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-200 transition"
                                onClick={handleFotoClick}
                              >
                                {fotoPreview ? (
                                  <img
                                    src={fotoPreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <span className="text-slate-400 text-4xl">
                                    +
                                  </span>
                                )}
                              </div>
                              <input
                                id="fotoInput"
                                type="file"
                                accept="image/*"
                                onChange={handleFotoChange}
                                className="hidden"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nama
                              </label>
                              <input
                                type="text"
                                name="nama"
                                value={formData.nama}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                placeholder="Masukkan nama lengkap"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Kategori
                              </label>
                              <select
                                name="kategori"
                                value={formData.kategori}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                required
                              >
                                <option value="">Pilih Kategori</option>
                                <option value="Wali Santri">Wali Santri</option>
                                <option value="Alumni">Alumni</option>
                                <option value="Santri">
                                  Santri
                                </option>
                                <option value="Guru/Ustadz">Guru/Ustadz</option>
                                <option value="Lainnya">Lainnya</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Asal
                              </label>
                              <input
                                type="text"
                                name="asal"
                                value={formData.asal}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                placeholder="Masukkan asal (Orang Tua, Alumni, dll)"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Angkatan
                              </label>
                              <select
                                name="angkatan"
                                value={formData.angkatan}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                required
                              >
                                <option value="">Pilih Angkatan</option>
                                <option value="Angkatan 1">Angkatan 1</option>
                                <option value="Angkatan 2">Angkatan 2</option>
                                <option value="Angkatan 3">Angkatan 3</option>
                                <option value="Angkatan 4">Angkatan 4</option>
                                <option value="Angkatan 5">Angkatan 5</option>
                                <option value="Angkatan 6">Angkatan 6</option>
                                <option value="Angkatan 7">Angkatan 7</option>
                                <option value="Angkatan 8">Angkatan 8</option>
                                <option value="Angkatan 9">Angkatan 9</option>
                                <option value="Angkatan 10">Angkatan 10</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Testimonial
                            </label>
                            <textarea
                              name="testimonial"
                              value={formData.testimonial}
                              onChange={handleInputChange}
                              rows="4"
                              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                              placeholder="Masukkan testimonial"
                              required
                            />
                          </div>
                          <div className="flex items-center justify-center gap-4 pt-4">
                            <button
                              type="submit"
                              className="px-6 py-2 bg-teal-700 text-white rounded-full font-semibold hover:bg-teal-800 transition"
                            >
                              Simpan
                            </button>
                            <button
                              type="button"
                              onClick={closeViewModal}
                              className="px-6 py-2 bg-slate-100 text-slate-700 rounded-full font-semibold hover:bg-slate-200 transition"
                            >
                              Batal
                            </button>
                          </div>
                        </form>
                      </>
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
