import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";

export default function Testimonial() {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    asal: "",
    testimonial: "",
    foto: null,
  });
  const [fotoPreview, setFotoPreview] = useState(null);

  // Dummy data untuk testimonial
  const dummyTestimonials = [
    {
      id: 1,
      nama: "Ahmad Rizki",
      asal: "Orang Tua Santri",
      testimonial:
        "Pesantren Al Ihsan Bekasi memberikan pendidikan yang sangat berkualitas. Anak saya berkembang dengan baik di sini.",
      rating: 5,
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      status: "Aktif",
    },
    {
      id: 2,
      nama: "Siti Nurhaliza",
      asal: "Alumni",
      testimonial:
        "Saya sangat berterima kasih kepada Pesantren Al Ihsan Bekasi yang telah membentuk karakter saya menjadi lebih baik.",
      rating: 5,
      foto: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      status: "Aktif",
    },
    {
      id: 3,
      nama: "Budi Santoso",
      asal: "Orang Tua Santri",
      testimonial:
        "Pendidikan agama dan akademik yang seimbang membuat anak saya tumbuh dengan baik di Pesantren Al Ihsan.",
      rating: 4,
      foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      status: "Aktif",
    },
  ];

  useEffect(() => {
    // Check if admin is logged in
    if (!AdminService.isLoggedIn()) {
      navigate("/admin");
      return;
    }

    // Load dummy data
    setTestimonials(dummyTestimonials);
    setLoading(false);
  }, [navigate]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement create testimonial logic
    console.log("Creating testimonial:", formData);
    alert("Testimonial berhasil ditambahkan!");
    setFormData({
      nama: "",
      asal: "",
      testimonial: "",
      foto: null,
    });
    setFotoPreview(null);
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
                    <select className="px-6 py-2 pr-10 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400">
                      <option>Semua</option>
                      <option>Aktif</option>
                      <option>Non-Aktif</option>
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
                        <h3 className="text-2xl font-extrabold text-center mb-6">
                          Detail Testimonial
                        </h3>
                        <div className="flex items-center gap-4 mb-6">
                          <img
                            src={selectedTestimonial.foto}
                            alt={selectedTestimonial.nama}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="text-xl font-bold text-slate-900">
                              {selectedTestimonial.nama}
                            </h4>
                            <p className="text-slate-500">
                              {selectedTestimonial.asal}
                            </p>
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 mb-6">
                          <p className="text-slate-700 italic">
                            "{selectedTestimonial.testimonial}"
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={closeViewModal}
                            className="px-6 py-2 bg-teal-700 text-white rounded-full font-semibold hover:bg-teal-800 transition"
                          >
                            Tutup
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
