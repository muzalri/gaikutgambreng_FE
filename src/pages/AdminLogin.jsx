import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminService from "../services/AdminService";

// Import Swal dengan try-catch untuk fallback
let Swal;
try {
  Swal = require("sweetalert2").default;
} catch (error) {
  // Fallback jika SweetAlert2 belum terinstall
  console.warn("SweetAlert2 belum terinstall. Menggunakan alert biasa.");
  Swal = {
    fire: ({ text, title }) => {
      return Promise.resolve(alert(`${title}\n${text}`));
    }
  };
}

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect jika sudah login
  useEffect(() => {
    if (AdminService.isLoggedIn()) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah form reload
    e.stopPropagation(); // Mencegah event bubbling
    
    console.log("Form submitted - preventing default");
    setLoading(true);

    // Validasi
    if (!email || !password) {
      console.log("Validation failed: email or password empty");
      try {
        await Swal.fire({
          icon: "warning",
          title: "Data Tidak Lengkap",
          text: "Email dan password wajib diisi!",
          confirmButtonColor: "#0f766e",
        });
      } catch (error) {
        // Fallback jika SweetAlert2 belum terinstall
        alert("Email dan password wajib diisi!");
      }
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting login with:", email);
      const response = await AdminService.login(email, password);
      console.log("Login response:", response);
      
      if (response.success) {
        // Login berhasil
        console.log("Login successful");
        try {
          await Swal.fire({
            icon: "success",
            title: "Login Berhasil!",
            text: `Selamat datang, ${response.data.nama}`,
            confirmButtonColor: "#0f766e",
            timer: 1500,
            showConfirmButton: false,
          });
          navigate("/admin/dashboard");
        } catch (error) {
          // Fallback jika SweetAlert2 belum terinstall
          navigate("/admin/dashboard");
        }
      } else {
        // Login gagal
        console.log("Login failed:", response.message);
        setLoading(false);
        try {
          await Swal.fire({
            icon: "error",
            title: "Login Gagal",
            text: response.message || "Email atau password salah!",
            confirmButtonColor: "#0f766e",
          });
        } catch (error) {
          // Fallback jika SweetAlert2 belum terinstall
          alert(response.message || "Email atau password salah!");
        }
      }
    } catch (err) {
      // Error dari server
      console.error("Login error:", err);
      setLoading(false);
      try {
        await Swal.fire({
          icon: "error",
          title: "Terjadi Kesalahan",
          text: err.message || "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.",
          confirmButtonColor: "#0f766e",
        });
      } catch (error) {
        // Fallback jika SweetAlert2 belum terinstall
        alert(err.message || "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.");
      }
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
