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

  // Banner form state
  const [bannerData, setBannerData] = useState({
    judul: "",
    deskripsi: "",
    gambar: null,
  });
  const [bannerPreview, setBannerPreview] = useState(null);
  const bannerInputRef = React.useRef();

  // Brosur form state
  const [brosurData, setBrosurData] = useState({
    judul: "",
    deskripsi: "",
    gambar: null,
  });
  const [brosurPreview, setBrosurPreview] = useState(null);
  const brosurInputRef = React.useRef();

  // Keep legacy for compatibility
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

  // Banner handlers
  const handleBannerImageClick = () => {
    bannerInputRef.current?.click();
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerData((prev) => ({ ...prev, gambar: file }));
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!bannerData.gambar) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Gambar banner harus diupload!",
      });
      return;
    }

    try {
      console.log("Creating banner:", bannerData);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Banner promosi berhasil dibuat!",
        timer: 1500,
      });
      setBannerData({ judul: "", deskripsi: "", gambar: null });
      setBannerPreview(null);
      fetchPromosi();
    } catch (error) {
      console.warn("Backend tidak tersedia, simulasi sukses");
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Banner promosi berhasil dibuat! (Simulasi)",
        timer: 1500,
      });
      setBannerData({ judul: "", deskripsi: "", gambar: null });
      setBannerPreview(null);
    }
  };

  // Brosur handlers
  const handleBrosurImageClick = () => {
    brosurInputRef.current?.click();
  };

  const handleBrosurImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrosurData((prev) => ({ ...prev, gambar: file }));
      setBrosurPreview(URL.createObjectURL(file));
    }
  };

  const handleBrosurSubmit = async (e) => {
    e.preventDefault();
    if (!brosurData.gambar) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Gambar brosur harus diupload!",
      });
      return;
    }

    try {
      console.log("Creating brosur:", brosurData);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Brosur promosi berhasil dibuat!",
        timer: 1500,
      });
      setBrosurData({ judul: "", deskripsi: "", gambar: null });
      setBrosurPreview(null);
      fetchPromosi();
    } catch (error) {
      console.warn("Backend tidak tersedia, simulasi sukses");
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Brosur promosi berhasil dibuat! (Simulasi)",
        timer: 1500,
      });
      setBrosurData({ judul: "", deskripsi: "", gambar: null });
      setBrosurPreview(null);
    }
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
                    Promosi
                  </span>
                </div>
              </div>

              {/* Two-column layout: Banner (left) and Brosur (right) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Kelola Banner Promosi */}
                <div className="p-8 bg-white border shadow rounded-2xl border-slate-100">
                  <h3 className="mb-1 text-xl font-bold text-slate-900">
                    Kelola Banner Promosi
                  </h3>
                  <p className="mb-4 text-sm text-slate-500">
                    Unggah gambar banner yang akan ditampilkan di halaman
                    pendaftaran
                  </p>
                  <form
                    onSubmit={handleBannerSubmit}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Foto Artikel
                      </label>
                      <div
                        className="w-full h-48 rounded-lg bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition overflow-hidden"
                        onClick={handleBannerImageClick}
                      >
                        {bannerPreview ? (
                          <img
                            src={bannerPreview}
                            alt="Banner Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <div className="text-6xl mb-2">+</div>
                            <p className="text-sm text-slate-500">
                              Klik untuk upload gambar
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={bannerInputRef}
                        onChange={handleBannerImageChange}
                        className="hidden"
                      />
                      {bannerData.gambar && (
                        <p className="text-xs text-slate-500 mt-2">
                          Ukuran Gambar:{" "}
                          {(bannerData.gambar.size / 1024).toFixed(0)} KB (
                          {bannerData.gambar.name})
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-teal-700 text-white rounded-full font-semibold hover:bg-teal-800 transition shadow"
                    >
                      Konfirmasi
                    </button>
                  </form>
                </div>

                {/* Right: Kelola Banner Promosi (Brosur) */}
                <div className="p-8 bg-white border shadow rounded-2xl border-slate-100">
                  <h3 className="mb-1 text-xl font-bold text-slate-900">
                    Kelola Banner Promosi
                  </h3>
                  <p className="mb-4 text-sm text-slate-500">
                    Unggah gambar banner yang akan ditampilkan di halaman
                    pendaftaran
                  </p>
                  <form
                    onSubmit={handleBrosurSubmit}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Foto Artikel
                      </label>
                      <div
                        className="w-full h-48 rounded-lg bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition overflow-hidden"
                        onClick={handleBrosurImageClick}
                      >
                        {brosurPreview ? (
                          <img
                            src={brosurPreview}
                            alt="Brosur Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <div className="text-6xl mb-2">+</div>
                            <p className="text-sm text-slate-500">
                              Klik untuk upload gambar
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={brosurInputRef}
                        onChange={handleBrosurImageChange}
                        className="hidden"
                      />
                      {brosurData.gambar && (
                        <p className="text-xs text-slate-500 mt-2">
                          Ukuran Gambar:{" "}
                          {(brosurData.gambar.size / 1024).toFixed(0)} KB (
                          {brosurData.gambar.name})
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-teal-700 text-white rounded-full font-semibold hover:bg-teal-800 transition shadow"
                    >
                      Konfirmasi
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
