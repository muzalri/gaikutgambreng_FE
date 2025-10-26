import React from "react";
import { FaHome, FaFolder, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const menus = [
  { label: "Beranda", icon: <FaHome />, path: "/pengguna/beranda" },
  { label: "Berkas", icon: <FaFolder />, path: "/pengguna/berkas" },
];

export default function PenggunaSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Keluar?',
      text: 'Apakah Anda yakin ingin keluar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      // Hapus data dari localStorage
      localStorage.removeItem('santriData');

      // Tampilkan pesan sukses
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil Keluar',
        text: 'Anda telah keluar dari sistem',
        timer: 1500,
        showConfirmButton: false
      });

      // Redirect ke halaman login
      navigate('/loginpengguna');
    }
  };

  return (
    <aside className="flex flex-col justify-between w-64 h-[calc(100vh-80px)] bg-white shadow-lg px-4 pt-1 pb-2 fixed left-0 top-[80px] z-30">
      <nav className="flex flex-col gap-0.5 mt-1">
        <img src="/assets/logo3.png" alt="Logo" className="h-8 mb-1 mx-auto" />
        {menus.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-base transition ${
              location.pathname === item.path
                ? "bg-[#E6F4F1] text-[#1B8277]"
                : "text-slate-700 hover:bg-[#E6F4F1]"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 font-semibold text-base hover:bg-red-50 hover:text-red-600 transition w-full"
        >
          <span className="text-xl">
            <FaSignOutAlt />
          </span>
          Keluar
        </button>
      </div>
    </aside>
  );
}
