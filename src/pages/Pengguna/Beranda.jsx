import React from "react";
import {
  FaHome,
  FaFolder,
  FaSignOutAlt,
  FaThLarge,
  FaCalendarAlt,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import PenggunaSidebar from "../../components/PenggunaSidebar";

export default function Beranda() {
  // Dummy data for demonstration
  const namaLogin = "Casantri";
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
            src="/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png"
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
            <h1 className="text-2xl font-bold text-[#1B8277] mb-2">Beranda</h1>
            <span className="block mb-6 text-gray-500">Beranda</span>
            {/* Hero Section & Cardview - Responsive Grid */}
            {/* Hero Section & Cardview - Responsive Flex Layout */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 mb-8 items-start">
              {/* Banner */}
              <div className="relative w-full h-[240px] rounded-2xl overflow-hidden shadow bg-white">
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
              {/* Cardview Info Boxes */}
              <div className="flex flex-col w-full gap-5">
                <div className="flex items-center gap-3 px-8 py-5 bg-white shadow rounded-2xl">
                  <FaThLarge className="text-[#1B8277] text-2xl" />
                  <div className="flex-1">
                    <div className="font-bold text-[#1B8277]">Pendaftar</div>
                    <div className="text-sm text-gray-500">120 Pendaftar</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-8 py-5 bg-white shadow rounded-2xl">
                  <FaCalendarAlt className="text-[#1B8277] text-2xl" />
                  <div className="flex-1">
                    <div className="font-bold text-[#1B8277]">Tahapan</div>
                    <div className="text-sm text-gray-500">Seleksi Berkas</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-8 py-5 bg-white shadow rounded-2xl">
                  <FaRegCalendarCheck className="text-[#1B8277] text-2xl" />
                  <div className="flex-1">
                    <div className="font-bold text-[#1B8277]">Status</div>
                    <div className="text-sm text-gray-500">Pengecekan</div>
                  </div>
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
