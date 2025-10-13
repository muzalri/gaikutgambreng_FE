import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminService from "../services/AdminService";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect jika sudah login
  useEffect(() => {
    if (AdminService.isLoggedIn()) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validasi
    if (!email || !password) {
      setError("Email dan password wajib diisi");
      setLoading(false);
      return;
    }

    try {
      const response = await AdminService.login(email, password);
      
      if (response.success) {
        // Login berhasil, redirect ke dashboard
        navigate("/admin/dashboard");
      } else {
        setError(response.message || "Login gagal");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl overflow-hidden bg-white shadow-lg rounded-xl">
        {/* Kiri: Gambar dan Judul */}
        <div className="relative flex flex-col items-center justify-center w-1/2 p-8 bg-gray-800">
          <img
            src="/assets/FotoPesantren.png"
            alt="Pesantren"
            className="absolute inset-0 object-cover w-full h-full opacity-60 rounded-l-xl"
          />
          <div className="relative z-10 text-left">
            <h1 className="mb-2 text-4xl font-bold text-white">
              Pesantren <span className="text-yellow-400">Al-Ihsan</span> Bekasi
            </h1>
          </div>
        </div>
        {/* Kanan: Form Login */}
        <div className="flex flex-col items-center justify-center w-1/2 p-12 bg-white">
          <h2 className="mb-2 text-2xl font-bold text-center">
            SELAMAT DATANG
          </h2>
          <p className="mb-6 text-center text-gray-600">
            Silahkan Masukkan Data Akun Anda!
          </p>

          {/* Error Message */}
          {error && (
            <div className="w-full max-w-sm px-4 py-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="flex items-center px-4 mb-4 bg-gray-100 rounded-full">
              <span className="mr-2 text-gray-400 material-icons">person</span>
              <input
                type="email"
                placeholder="Masukan Email Anda..."
                className="w-full py-3 bg-transparent outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex items-center px-4 mb-6 bg-gray-100 rounded-full">
              <span className="mr-2 text-gray-400 material-icons">lock</span>
              <input
                type="password"
                placeholder="Masukan Password Anda..."
                className="w-full py-3 bg-transparent outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 mb-4 font-bold text-white transition bg-teal-700 rounded-full shadow-md hover:bg-teal-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
          <p className="text-center text-gray-500">
            Belum punya akun? Buat Sekarang!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
