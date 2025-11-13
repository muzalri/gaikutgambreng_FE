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

  // Suppress ResizeObserver errors
  useEffect(() => {
    const resizeObserverErrHandler = (e) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        const resizeObserverErr = e;
        resizeObserverErr.stopImmediatePropagation();
        return false;
      }
    };
    window.addEventListener('error', resizeObserverErrHandler);
    return () => window.removeEventListener('error', resizeObserverErrHandler);
  }, []);

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

        console.log('Stats responses:', {
          resSantri,
          resPendidik,
          resArtikel,
          resPendaftar,
          resLulus
        });

        // Total santri lulus (yang statusnya Diterima)
        const totalSantriLulus = resLulus?.pagination?.total ?? 0;
        
        // Total pendaftar (semua berkas yang pernah daftar)
        const totalPendaftar = resPendaftar?.pagination?.total ?? 0;
        
        // Total pendidik
        const totalPendidik = resPendidik?.success && Array.isArray(resPendidik.data) ? resPendidik.data.length : 0;
        
        // Total artikel
        const totalArtikel = resArtikel?.success && Array.isArray(resArtikel.data) ? resArtikel.data.length : 0;

        console.log('Final stats:', { totalSantriLulus, totalPendidik, totalArtikel, totalPendaftar });

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
        
        console.log('Fetching chart data for years:', years);
        
        // Fetch data untuk setiap tahun dengan berbagai format angkatan yang mungkin
        const yearlyData = await Promise.all(
          years.map(async (year) => {
            try {
              // Coba beberapa format angkatan yang mungkin
              const formats = [`PPDB ${year}`, `${year}`, `Angkatan ${year}`];
              let totalCount = 0;
              
              for (const format of formats) {
                try {
                  const res = await BerkasService.getAll({ angkatan: format, page: 1, limit: 1 });
                  console.log(`Response for ${format}:`, res);
                  const count = res?.pagination?.total ?? 0;
                  totalCount += count;
                } catch (err) {
                  console.warn(`No data for format ${format}:`, err.message);
                }
              }
              
              console.log(`Total count for year ${year}:`, totalCount);
              return { year, count: totalCount };
            } catch (err) {
              console.warn(`Error fetching data for year ${year}:`, err);
              return { year, count: 0 };
            }
          })
        );

        console.log('Final yearly data:', yearlyData);
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
                    Santri Diterima
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-teal-900">
                    {loadingCounts ? 'Memuat...' : `${stats.totalSantriLulus} Santri`}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-white border shadow rounded-2xl border-slate-100">
                  <FaChalkboardTeacher className="mb-2 text-4xl text-teal-700" />
                  <div className="text-base font-semibold text-slate-700">
                    Total Pendidik
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
                    Total Pendaftar
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-teal-900">
                    {loadingCounts ? 'Memuat...' : `${stats.totalPendaftar} Pendaftar`}
                  </div>
                </div>
              </div>

              {/* Summary Statistics - Dinamis dari chartData */}
              {!loadingChart && chartData.length > 0 && (() => {
                const total = chartData.reduce((sum, item) => sum + item.count, 0);
                const average = Math.round(total / chartData.length);
                const highest = chartData.reduce((max, item) => item.count > max.count ? item : max, chartData[0]);
                
                return (
                  <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                    <div className="p-6 text-white rounded-lg shadow-lg bg-gradient-to-br from-teal-500 to-teal-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-teal-100">Total Pendaftar (5 Tahun)</p>
                          <p className="mt-2 text-3xl font-bold">{total}</p>
                        </div>
                        <div className="p-3 rounded-full bg-white/20">
                          <FaUserFriends className="w-8 h-8" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 text-white rounded-lg shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-100">Rata-rata/Tahun</p>
                          <p className="mt-2 text-3xl font-bold">{average}</p>
                        </div>
                        <div className="p-3 rounded-full bg-white/20">
                          <FaChartLine className="w-8 h-8" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 text-white rounded-lg shadow-lg bg-gradient-to-br from-amber-500 to-amber-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-amber-100">Tahun Tertinggi</p>
                          <p className="mt-2 text-3xl font-bold">{highest.year}</p>
                          <p className="mt-1 text-sm text-amber-100">{highest.count} pendaftar</p>
                        </div>
                        <div className="p-3 text-3xl rounded-full bg-white/20">
                          🏆
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Grafik PPDB - Dinamis dan Diperbesar */}
              <div className="p-8 mb-10 bg-white border shadow rounded-2xl border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-lg font-bold text-slate-900">
                    Tren PPDB 5 Tahun Terakhir
                  </div>
                  <div className="px-3 py-2 text-sm font-semibold border rounded bg-slate-100 border-slate-200">
                    {chartData.length > 0 ? `${chartData[0].year} - ${chartData[chartData.length - 1].year}` : '5 Tahun Terakhir'}
                  </div>
                </div>

                {loadingChart ? (
                  <div className="flex items-center justify-center min-h-[500px]">
                    <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-teal-600"></div>
                  </div>
                ) : chartData.length === 0 ? (
                  <div className="flex items-center justify-center min-h-[500px] text-gray-400">
                    <p>Tidak ada data tersedia</p>
                  </div>
                ) : (
                  <div className="relative w-full min-h-[500px]">
                    <svg 
                      viewBox="0 0 1000 450" 
                      className="w-full h-full" 
                      preserveAspectRatio="xMidYMid meet"
                      style={{ overflow: 'visible' }}
                    >
                      {/* Definitions for gradients and filters */}
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#0d9488" stopOpacity="0.05" />
                        </linearGradient>
                        
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#0d9488" />
                          <stop offset="50%" stopColor="#14b8a6" />
                          <stop offset="100%" stopColor="#0d9488" />
                        </linearGradient>

                        <filter id="lineShadow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                          <feOffset dx="0" dy="2" result="offsetblur"/>
                          <feComponentTransfer>
                            <feFuncA type="linear" slope="0.3"/>
                          </feComponentTransfer>
                          <feMerge>
                            <feMergeNode/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>

                        <filter id="pointGlow">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Calculate dimensions and scaling */}
                      {(() => {
                        const padding = { left: 80, right: 80, top: 60, bottom: 80 };
                        const chartWidth = 1000 - padding.left - padding.right;
                        const chartHeight = 450 - padding.top - padding.bottom;
                        const maxCount = Math.max(...chartData.map(d => d.count), 1);
                        const yScale = chartHeight / maxCount;
                        const xStep = chartWidth / (chartData.length - 1);

                        const points = chartData.map((d, i) => ({
                          x: padding.left + i * xStep,
                          y: padding.top + chartHeight - d.count * yScale,
                          count: d.count,
                          year: d.year,
                        }));

                        const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
                        const areaPath = linePath + ` L ${points[points.length-1].x},${padding.top + chartHeight} L ${padding.left},${padding.top + chartHeight} Z`;

                        const gridLines = 5;
                        const gridStep = Math.ceil(maxCount / gridLines);

                        return (
                          <>
                            {/* Grid */}
                            <g opacity="0.15">
                              {Array.from({ length: gridLines + 1 }).map((_, i) => {
                                const y = padding.top + chartHeight - (i * gridStep * yScale);
                                return (
                                  <g key={i}>
                                    <line
                                      x1={padding.left}
                                      y1={y}
                                      x2={1000 - padding.right}
                                      y2={y}
                                      stroke="#64748b"
                                      strokeWidth="1"
                                      strokeDasharray="4,4"
                                    />
                                    <text
                                      x={padding.left - 15}
                                      y={y + 5}
                                      textAnchor="end"
                                      className="text-xs fill-gray-500"
                                    >
                                      {i * gridStep}
                                    </text>
                                  </g>
                                );
                              })}
                            </g>

                            {/* Area under curve */}
                            <path d={areaPath} fill="url(#areaGradient)" />

                            {/* Main line */}
                            <path
                              d={linePath}
                              fill="none"
                              stroke="url(#lineGradient)"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              filter="url(#lineShadow)"
                            />

                            {/* Data points with hover effects */}
                            {points.map((point, i) => {
                              const isHighest = point.count === Math.max(...chartData.map(d => d.count));
                              const isHovered = hoveredPoint === i;
                              
                              return (
                                <g key={i}>
                                  {isHovered && (
                                    <circle
                                      cx={point.x}
                                      cy={point.y}
                                      r="12"
                                      fill="#0d9488"
                                      opacity="0.3"
                                      className="animate-ping"
                                    />
                                  )}
                                  
                                  <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r={isHovered ? "8" : "6"}
                                    fill="white"
                                    stroke="#0d9488"
                                    strokeWidth="3"
                                    filter="url(#pointGlow)"
                                    className="transition-all duration-200 cursor-pointer"
                                    onMouseEnter={() => setHoveredPoint(i)}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                    style={{ pointerEvents: 'all' }}
                                  />

                                  {isHighest && (
                                    <text x={point.x} y={point.y - 25} textAnchor="middle" className="text-2xl">
                                      🏆
                                    </text>
                                  )}

                                  {isHovered && (
                                    <g>
                                      <rect
                                        x={point.x - 40}
                                        y={point.y - 60}
                                        width="80"
                                        height="35"
                                        rx="6"
                                        fill="#0d9488"
                                        opacity="0.95"
                                      />
                                      <text x={point.x} y={point.y - 42} textAnchor="middle" className="text-xs font-semibold fill-white">
                                        {point.year}
                                      </text>
                                      <text x={point.x} y={point.y - 28} textAnchor="middle" className="text-sm font-bold fill-white">
                                        {point.count} orang
                                      </text>
                                    </g>
                                  )}
                                </g>
                              );
                            })}

                            {/* Year labels */}
                            {points.map((point, i) => (
                              <text
                                key={i}
                                x={point.x}
                                y={padding.top + chartHeight + 30}
                                textAnchor="middle"
                                className="text-sm font-medium fill-gray-700"
                                onMouseEnter={() => setHoveredPoint(i)}
                                onMouseLeave={() => setHoveredPoint(null)}
                                style={{ cursor: 'pointer' }}
                              >
                                {point.year}
                                {hoveredPoint === i && (
                                  <tspan x={point.x} dy="15" className="text-xs fill-teal-600">
                                    ▲
                                  </tspan>
                                )}
                              </text>
                            ))}
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
