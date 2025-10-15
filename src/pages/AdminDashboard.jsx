import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminService from "../services/AdminService";
import {
  FaUserFriends,
  FaChalkboardTeacher,
  FaFileAlt,
  FaChartLine,
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    if (!AdminService.isLoggedIn()) {
      navigate("/admin");
      return;
    }

    // Get admin data from localStorage
    const admin = AdminService.getCurrentAdmin();
    setAdminData(admin);
    setLoading(false);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await AdminService.logout();
      navigate("/admin");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/admin");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-teal-700">Loading...</div>
      </div>
    );
  }

  const adminName = adminData?.nama || "Admin";
  const adminAvatar = "/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png";

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      {/* Sticky header at the top */}
      <header className="sticky top-0 z-40 flex items-center justify-between w-full px-10 py-5 text-white shadow bg-gradient-to-r from-teal-800 to-teal-600">
        <div className="flex items-center gap-3">
          <img src="/assets/logo3.png" alt="Logo" className="h-8" />
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold">Halo, {adminName}</span>
          <img
            src={adminAvatar}
            alt="Admin"
            className="object-cover w-8 h-8 border-2 border-white rounded-full"
          />
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-semibold transition bg-red-500 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>
      <div className="flex">
        {/* Sidebar fixed on the left, below header */}
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
          <AdminSidebar />
        </div>
        {/* Main content with left margin for sidebar */}
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            {/* Dashboard Content */}
            <section className="p-10 bg-[#f5f6fa] min-h-screen">
              <h2 className="mb-2 text-3xl font-bold text-slate-900">
                Beranda
              </h2>
              <span className="block mb-6 font-medium text-slate-500">
                Beranda
              </span>
              <div className="grid grid-cols-4 gap-6 mb-10">
                <div className="flex flex-col items-center justify-center p-6 bg-white border shadow rounded-2xl border-slate-100">
                  <FaUserFriends className="mb-2 text-4xl text-teal-700" />
                  <div className="text-base font-semibold text-slate-700">
                    Total Santri
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-teal-900">
                    80 Santri
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-white border shadow rounded-2xl border-slate-100">
                  <FaChalkboardTeacher className="mb-2 text-4xl text-teal-700" />
                  <div className="text-base font-semibold text-slate-700">
                    Pendidik
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-teal-900">
                    13 Pendidik
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-white border shadow rounded-2xl border-slate-100">
                  <FaFileAlt className="mb-2 text-4xl text-teal-700" />
                  <div className="text-base font-semibold text-slate-700">
                    Total Artikel
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-teal-900">
                    30 Artikel
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-white border shadow rounded-2xl border-slate-100">
                  <FaChartLine className="mb-2 text-4xl text-teal-700" />
                  <div className="text-base font-semibold text-slate-700">
                    Pendaftar
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-teal-900">
                    120 Pendaftar
                  </div>
                </div>
              </div>
              {/* Grafik PPDB */}
              <div className="p-8 mb-10 bg-white border shadow rounded-2xl border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold text-slate-900">
                    Grafik PPDB
                  </div>
                  <select className="px-3 py-2 text-sm font-semibold border rounded bg-slate-100 border-slate-200">
                    <option>5 Tahun Terakhir</option>
                  </select>
                </div>
                {/* Dummy Chart */}
                <div className="flex items-center justify-center w-full h-48">
                  <svg width="100%" height="100%" viewBox="0 0 400 120">
                    <polyline
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="3"
                      points="40,100 100,60 160,60 220,80 280,60 340,100"
                    />
                    {[40, 100, 160, 220, 280, 340].map((x, i) => (
                      <circle
                        key={i}
                        cx={x}
                        cy={[100, 60, 60, 80, 60, 100][i]}
                        r="7"
                        fill="#14b8a6"
                      />
                    ))}
                    {/* X axis labels */}
                    {[2021, 2022, 2023, 2024, 2025].map((year, i) => (
                      <text
                        key={year}
                        x={40 + i * 60}
                        y={115}
                        fontSize="14"
                        textAnchor="middle"
                        fill="#64748b"
                      >
                        {year}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>
              {/* Aktivitas Terbaru */}
              <div className="p-8 bg-white border shadow rounded-2xl border-slate-100">
                <div className="mb-4 text-lg font-bold text-slate-900">
                  Aktivitas Terbaru
                </div>
                <div className="flex gap-6 overflow-x-auto">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="min-w-[220px] bg-slate-50 rounded-xl p-5 flex flex-col gap-2 shadow border border-slate-100"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <img
                          src={adminAvatar}
                          alt="Admin"
                          className="object-cover w-8 h-8 border-2 border-white rounded-full"
                        />
                        <span className="font-bold text-slate-900">
                          Hamizan
                        </span>
                      </div>
                      <div className="text-xs text-slate-700">
                        Hamizan baru saja menambahkan Artikel baru berjudul
                        "Pengumuman Hasil PPDB 2025"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
