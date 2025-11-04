import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";
import SantriService from "../../services/SantriService";
import ArtikelService from "../../services/ArtikelService";
import BerkasService from "../../services/BerkasService";
import {
  FaUserFriends,
  FaChalkboardTeacher,
  FaFileAlt,
  FaChartLine,
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [stats, setStats] = useState({
    totalSantriLulus: 0,
    totalPendidik: 0,
    totalArtikel: 0,
    totalPendaftar: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    // Check if admin is logged in
    if (!AdminService.isLoggedIn()) {
      navigate("/admin");
      return;
    }
    
    // fetch dashboard stats
    const fetchStats = async () => {
      setLoadingCounts(true);
      try {
        const [resSantri, resPendidik, resArtikel, resPendaftar, resLulus] = await Promise.all([
          SantriService.getAllSantri(),
          AdminService.getAllPendidik(),
          ArtikelService.getAllArtikel(),
          // use pagination to get total counts from BerkasController
          BerkasService.getAll({ page: 1, limit: 1 }),
          BerkasService.getAll({ status: 'Diterima', page: 1, limit: 1 }),
        ]);

        const totalSantriLulus = resLulus?.pagination?.total ?? (resLulus?.data ? resLulus.data.length : 0);
        const totalPendaftar = resPendaftar?.pagination?.total ?? (resPendaftar?.data ? resPendaftar.data.length : 0);
        const totalPendidik = resPendidik?.success && Array.isArray(resPendidik.data) ? resPendidik.data.length : 0;
        const totalArtikel = resArtikel?.success && Array.isArray(resArtikel.data) ? resArtikel.data.length : 0;

        setStats({ totalSantriLulus, totalPendidik, totalArtikel, totalPendaftar });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoadingCounts(false);
      }
    };

    // fetch chart data - ambil data per angkatan 5 tahun terakhir
    const fetchChartData = async () => {
      setLoadingChart(true);
      try {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
        
        // Fetch data untuk setiap tahun
        const yearlyData = await Promise.all(
          years.map(async (year) => {
            try {
              const angkatan = `PPDB ${year}`;
              const res = await BerkasService.getAll({ angkatan, page: 1, limit: 1 });
              const count = res?.pagination?.total ?? 0;
              return { year, count };
            } catch (err) {
              console.warn(`Error fetching data for year ${year}:`, err);
              return { year, count: 0 };
            }
          })
        );

        setChartData(yearlyData);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setChartData([]);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchStats();
    fetchChartData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminHeader />
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
                    {loadingCounts ? 'Memuat...' : `${stats.totalSantriLulus} Santri`}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-white border shadow rounded-2xl border-slate-100">
                  <FaChalkboardTeacher className="mb-2 text-4xl text-teal-700" />
                  <div className="text-base font-semibold text-slate-700">
                    Pendidik
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-teal-900">
                    {loadingCounts ? 'Memuat...' : `${stats.totalPendidik} Pendidik`}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-white border shadow rounded-2xl border-slate-100">
                  <FaFileAlt className="mb-2 text-4xl text-teal-700" />
                  <div className="text-base font-semibold text-slate-700">
                    Total Artikel
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-teal-900">
                    {loadingCounts ? 'Memuat...' : `${stats.totalArtikel} Artikel`}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-white border shadow rounded-2xl border-slate-100">
                  <FaChartLine className="mb-2 text-4xl text-teal-700" />
                  <div className="text-base font-semibold text-slate-700">
                    Pendaftar
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-teal-900">
                    {loadingCounts ? 'Memuat...' : `${stats.totalPendaftar} Pendaftar`}
                  </div>
                </div>
              </div>
              {/* Grafik PPDB */}
              <div className="p-8 mb-10 bg-white border shadow rounded-2xl border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-lg font-bold text-slate-900">
                    Grafik PPDB
                  </div>
                  <select className="px-3 py-2 text-sm font-semibold border rounded bg-slate-100 border-slate-200">
                    <option>5 Tahun Terakhir</option>
                  </select>
                </div>

                {/* Chart Container */}
                <div className="relative w-full h-80 bg-white rounded-lg">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 800 300"
                    className="overflow-visible"
                  >
                    {/* Horizontal Grid Lines */}
                    {[20, 40, 60, 80, 100].map((value, i) => (
                      <line
                        key={value}
                        x1="60"
                        y1={50 + i * 40}
                        x2="740"
                        y2={50 + i * 40}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Y-axis labels */}
                    {[20, 40, 60, 80, 100].map((value, i) => (
                      <text
                        key={value}
                        x="50"
                        y={55 + i * 40}
                        fontSize="12"
                        fill="#94a3b8"
                        textAnchor="end"
                        dominantBaseline="middle"
                      >
                        {value}
                      </text>
                    ))}

                    {/* Chart Area */}
                    <g transform="translate(60, 50)">
                      {/* Data line */}
                      <polyline
                        fill="none"
                        stroke="#0f766e"
                        strokeWidth="3"
                        points="0,160 120,80 240,80 360,120 480,40"
                      />

                      {/* Data points */}
                      {[
                        { x: 0, y: 160 },
                        { x: 120, y: 80 },
                        { x: 240, y: 80 },
                        { x: 360, y: 120 },
                        { x: 480, y: 40 },
                      ].map((point, i) => (
                        <circle
                          key={i}
                          cx={point.x}
                          cy={point.y}
                          r="6"
                          fill="#0f766e"
                        />
                      ))}

                      {/* X-axis labels */}
                      {[2021, 2022, 2023, 2024, 2025].map((year, i) => (
                        <text
                          key={year}
                          x={i * 120}
                          y={220}
                          fontSize="12"
                          fill="#94a3b8"
                          textAnchor="middle"
                        >
                          {year}
                        </text>
                      ))}
                    </g>
                  </svg>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
