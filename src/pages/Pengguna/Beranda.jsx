import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaFolder,
  FaSignOutAlt,
  FaThLarge,
  FaCalendarAlt,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PenggunaSidebar from "../../components/PenggunaSidebar";
import Swal from "sweetalert2";

export default function Beranda() {
  const [santriData, setSantriData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil data santri dari localStorage
    const data = localStorage.getItem('santriData');
    if (data) {
      setSantriData(JSON.parse(data));
    }
  }, []);

  // Dummy data for demonstration
  const namaLogin = santriData?.nama || "Santri";
  const santriBaru = [
    "Bilal Abdurrahman",
    "Dhiyaurrahman Hamizan",
    "Raffa Danendra",
    "Zaki Algifari",
    "Faris Fadhil",
    "Rafi Alexander",
    "Cahya Ilham",
    "Dzaky Ikbaar",
    "Frizaski Alfath",
    "Daffa Abiyya",
    "Hakkam Zakka",
    "Raden Muhammad",
    "Rafii Khairan",
  ];

  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      {/* Sticky Header Full Width */}
      <header className="sticky top-0 z-40 flex items-center justify-between w-full px-10 py-5 text-white shadow bg-gradient-to-r from-teal-800 to-teal-600 h-[80px]">
        <div className="flex items-center gap-3">
          <img src="/assets/logo3.png" alt="Logo" className="h-8" />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold">Halo, {namaLogin}</span>
          <img
            src={santriData?.foto || "/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png"}
            alt="Profile"
            className="object-cover w-8 h-8 border-2 border-white rounded-full"
          />
        </div>
      </header>
      <div className="flex flex-1">
        {/* Sidebar */}
        <PenggunaSidebar />
        {/* Main Content */}
        <div className="flex-1 ml-64">
          <main className="px-10 py-8">
            {/* Beranda Title */}
            <h1 className="text-2xl font-bold text-black mb-2">Beranda</h1>
            <span className="block mb-6 text-gray-500">Beranda</span>
            {/* Hero/Banner Full Width */}
            <div className="mb-8">
              <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow bg-white">
                <img
                  src="/assets/FotoPesantren.png"
                  alt="Hero"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex flex-col justify-center px-8 bg-black bg-opacity-30">
                  <h2 className="mb-2 text-2xl font-bold text-white">
                    Penerimaan <span className="text-yellow-400">Santri</span>{" "}
                    Baru Tahun Ajaran 2025
                  </h2>
                  <p className="max-w-md text-base text-white">
                    Bergabunglah dengan Pesantren Al Ihsan Bekasi dan wujudkan
                    pendidikan yang berkualitas, berakhlak mulia, dan berbasis
                    keilmuan.
                  </p>
                </div>
              </div>
            </div>
            {/* Table Section */}
            <div className="p-6 bg-white shadow rounded-2xl">
              <h3 className="mb-4 text-lg font-bold">
                Pengumuman Santri Baru Angkatan 1
              </h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500">
                    <th className="py-2">NO</th>
                    <th className="py-2">Nama</th>
                    <th className="py-2">Angkatan</th>
                    <th className="py-2">Tahapan</th>
                  </tr>
                </thead>
                <tbody>
                  {santriBaru.map((nama, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-2 py-2">{idx + 1}</td>
                      <td className="px-2 py-2">{nama}</td>
                      <td className="px-2 py-2">Angkatan 1</td>
                      <td className="px-2 py-2">Seleksi Berkas</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
