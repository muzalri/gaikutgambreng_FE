import React, { useState, useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AdminService from "../../services/AdminService";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    e.stopPropagation();

    setLoading(true);

    // Validasi
    if (!email || !password) {
      alert("Email dan password wajib diisi!");
      setLoading(false);
      return;
    }

    try {
      const response = await AdminService.login(email, password);
      if (response.success) {
        alert("Login berhasil!");
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1500);
      } else {
        setLoading(false);
        alert("Email atau password salah!");
      }
    } catch (err) {
      setLoading(false);
      alert("Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.");
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-white">
      {/* Left: Image and Title */}
      <div className="hidden md:flex w-1/2 bg-gray-100 relative items-center justify-center rounded-l-2xl overflow-hidden">
        <img
          src="/assets/FotoPesantren.png"
          alt="Pesantren"
          className="absolute inset-0 object-cover w-full h-full opacity-60"
        />
        <div className="relative z-10 text-left px-10">
          <h1 className="mb-2 text-5xl font-bold text-white drop-shadow-lg">
            Pesantren <span className="text-yellow-400">Al-Ihsan</span> Bekasi
          </h1>
        </div>
      </div>
      {/* Right: Login Form */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 px-6 py-12">
        <h2 className="mb-2 text-2xl font-extrabold text-center text-black">
          SELAMAT DATANG
        </h2>
        <p className="mb-6 text-center text-gray-600">
          Silahkan Masukkan Data Akun Anda!
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm flex flex-col gap-4"
        >
          <div className="flex items-center px-4 bg-gray-100 rounded-full">
            <FaUser className="mr-2 text-gray-400" />
            <input
              type="text"
              placeholder="Masukan Username Anda..."
              className="w-full py-3 bg-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex items-center px-4 bg-gray-100 rounded-full">
            <FaLock className="mr-2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukan Username Anda..."
              className="w-full py-3 bg-transparent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <span
              className="ml-2 text-gray-400 cursor-pointer select-none"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={0}
              role="button"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-3 font-bold text-white transition bg-teal-700 rounded-full shadow-md hover:bg-teal-800 disabled:bg-gray-400 disabled:cursor-not-allowed mt-2"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
