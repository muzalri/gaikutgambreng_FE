import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";
import PromosiService from "../../services/PromosiService";
import Swal from "sweetalert2";

export default function Promosi() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Banner state
  const [banner, setBanner] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const bannerInputRef = React.useRef();

  // Brosur state
  const [brosur, setBrosur] = useState(null);
  const [brosurFile, setBrosurFile] = useState(null);
  const [brosurPreview, setBrosurPreview] = useState(null);
  const brosurInputRef = React.useRef();

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
      
      // Fetch banner
      try {
        const bannerRes = await PromosiService.getBanner();
        if (bannerRes.success) {
          setBanner(bannerRes.data);
        }
      } catch (err) {
        console.log('Banner belum ada');
        setBanner(null);
      }

      // Fetch brosur
      try {
        const brosurRes = await PromosiService.getBrosur();
        if (brosurRes.success) {
          setBrosur(brosurRes.data);
        }
      } catch (err) {
        console.log('Brosur belum ada');
        setBrosur(null);
      }
    } catch (error) {
      console.error('Error fetching promosi:', error);
    } finally {
      setLoading(false);
    }
  };

  // Banner handlers
  const handleBannerImageClick = () => {
    bannerInputRef.current?.click();
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "warning",
          title: "File Terlalu Besar",
          text: "Ukuran file maksimal 5MB!",
        });
        return;
      }

      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: "warning",
          title: "Format File Salah",
          text: "Hanya file gambar yang diperbolehkan!",
        });
        return;
      }

      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    
    if (!bannerFile) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Gambar banner harus diupload!",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('gambar', bannerFile);

      const result = await Swal.fire({
        title: 'Konfirmasi',
        text: banner ? 'Banner akan diganti dengan yang baru!' : 'Upload banner baru?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0f766e',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Ya, Upload!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        const response = await PromosiService.createBanner(formData);
        
        if (response.success) {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Banner berhasil diupload!",
            timer: 1500,
          });
          
          setBannerFile(null);
          setBannerPreview(null);
          fetchPromosi();
        }
      }
    } catch (error) {
      console.error("Error uploading banner:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal mengupload banner!",
      });
    }
  };

  const handleDeleteBanner = async () => {
    try {
      const result = await Swal.fire({
        title: 'Konfirmasi Hapus',
        text: 'Yakin ingin menghapus banner ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        await PromosiService.deleteBanner();
        
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Banner berhasil dihapus!",
          timer: 1500,
        });
        
        fetchPromosi();
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal menghapus banner!",
      });
    }
  };

  // Brosur handlers
  const handleBrosurImageClick = () => {
    brosurInputRef.current?.click();
  };

  const handleBrosurImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "warning",
          title: "File Terlalu Besar",
          text: "Ukuran file maksimal 5MB!",
        });
        return;
      }

      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: "warning",
          title: "Format File Salah",
          text: "Hanya file gambar yang diperbolehkan!",
        });
        return;
      }

      setBrosurFile(file);
      setBrosurPreview(URL.createObjectURL(file));
    }
  };

  const handleBrosurSubmit = async (e) => {
    e.preventDefault();
    
    if (!brosurFile) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Gambar brosur harus diupload!",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('gambar', brosurFile);

      const result = await Swal.fire({
        title: 'Konfirmasi',
        text: brosur ? 'Brosur akan diganti dengan yang baru!' : 'Upload brosur baru?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0f766e',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Ya, Upload!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        const response = await PromosiService.createBrosur(formData);
        
        if (response.success) {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Brosur berhasil diupload!",
            timer: 1500,
          });
          
          setBrosurFile(null);
          setBrosurPreview(null);
          fetchPromosi();
        }
      }
    } catch (error) {
      console.error("Error uploading brosur:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal mengupload brosur!",
      });
    }
  };

  const handleDeleteBrosur = async () => {
    try {
      const result = await Swal.fire({
        title: 'Konfirmasi Hapus',
        text: 'Yakin ingin menghapus brosur ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        await PromosiService.deleteBrosur();
        
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Brosur berhasil dihapus!",
          timer: 1500,
        });
        
        fetchPromosi();
      }
    } catch (error) {
      console.error("Error deleting brosur:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal menghapus brosur!",
      });
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Left: Kelola Banner Promosi */}
                <div className="p-8 bg-white border shadow rounded-2xl border-slate-100">
                  <h3 className="mb-1 text-xl font-bold text-slate-900">
                    Kelola Banner Promosi
                  </h3>
                  <p className="mb-4 text-sm text-slate-500">
                    Unggah gambar banner yang akan ditampilkan di halaman pendaftaran
                  </p>

                  {loading ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-teal-600"></div>
                    </div>
                  ) : banner ? (
                    // Tampilkan banner yang sudah ada (Read Only)
                    <div className="space-y-4">
                      <div className="overflow-hidden border-2 rounded-lg border-slate-200">
                        <img
                          src={`http://localhost:5000/uploads/promosi/${banner.gambar}`}
                          alt="Banner Promosi"
                          className="object-cover w-full h-64"
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50">
                        <p className="text-sm text-slate-600">
                          <span className="font-semibold">Diupload:</span>{" "}
                          {new Date(banner.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <button
                        onClick={handleDeleteBanner}
                        className="w-full py-3 font-semibold text-white transition bg-red-600 shadow rounded-full hover:bg-red-700"
                      >
                        🗑️ Hapus Banner
                      </button>
                    </div>
                  ) : (
                    // Form upload banner baru (Create)
                    <form onSubmit={handleBannerSubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                          Upload Banner
                        </label>
                        <div
                          className="flex flex-col items-center justify-center w-full overflow-hidden transition border-2 border-dashed rounded-lg cursor-pointer h-48 bg-slate-50 border-slate-300 hover:bg-slate-100"
                          onClick={handleBannerImageClick}
                        >
                          {bannerPreview ? (
                            <img
                              src={bannerPreview}
                              alt="Banner Preview"
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="text-center">
                              <div className="mb-2 text-6xl">📸</div>
                              <p className="text-sm text-slate-500">
                                Klik untuk upload gambar
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                Max 5MB (JPG, PNG, WEBP)
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
                        {bannerFile && (
                          <p className="mt-2 text-xs text-slate-500">
                            📁 {bannerFile.name} ({(bannerFile.size / 1024).toFixed(0)} KB)
                          </p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={!bannerFile}
                        className="w-full py-3 font-semibold text-white transition shadow bg-teal-700 rounded-full hover:bg-teal-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
                      >
                        ✅ Upload Banner
                      </button>
                    </form>
                  )}
                </div>

                {/* Right: Kelola Brosur Promosi */}
                <div className="p-8 bg-white border shadow rounded-2xl border-slate-100">
                  <h3 className="mb-1 text-xl font-bold text-slate-900">
                    Kelola Brosur Promosi
                  </h3>
                  <p className="mb-4 text-sm text-slate-500">
                    Unggah gambar brosur yang akan ditampilkan di halaman pendaftaran
                  </p>

                  {loading ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-teal-600"></div>
                    </div>
                  ) : brosur ? (
                    // Tampilkan brosur yang sudah ada (Read Only)
                    <div className="space-y-4">
                      <div className="overflow-hidden border-2 rounded-lg border-slate-200">
                        <img
                          src={`http://localhost:5000/uploads/promosi/${brosur.gambar}`}
                          alt="Brosur Promosi"
                          className="object-cover w-full h-64"
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50">
                        <p className="text-sm text-slate-600">
                          <span className="font-semibold">Diupload:</span>{" "}
                          {new Date(brosur.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <button
                        onClick={handleDeleteBrosur}
                        className="w-full py-3 font-semibold text-white transition bg-red-600 shadow rounded-full hover:bg-red-700"
                      >
                        🗑️ Hapus Brosur
                      </button>
                    </div>
                  ) : (
                    // Form upload brosur baru (Create)
                    <form onSubmit={handleBrosurSubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                          Upload Brosur
                        </label>
                        <div
                          className="flex flex-col items-center justify-center w-full overflow-hidden transition border-2 border-dashed rounded-lg cursor-pointer h-48 bg-slate-50 border-slate-300 hover:bg-slate-100"
                          onClick={handleBrosurImageClick}
                        >
                          {brosurPreview ? (
                            <img
                              src={brosurPreview}
                              alt="Brosur Preview"
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="text-center">
                              <div className="mb-2 text-6xl">📄</div>
                              <p className="text-sm text-slate-500">
                                Klik untuk upload gambar
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                Max 5MB (JPG, PNG, WEBP)
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
                        {brosurFile && (
                          <p className="mt-2 text-xs text-slate-500">
                            📁 {brosurFile.name} ({(brosurFile.size / 1024).toFixed(0)} KB)
                          </p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={!brosurFile}
                        className="w-full py-3 font-semibold text-white transition shadow bg-teal-700 rounded-full hover:bg-teal-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
                      >
                        ✅ Upload Brosur
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
