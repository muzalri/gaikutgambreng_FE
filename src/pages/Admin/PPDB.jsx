import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";

export default function PPDB() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    if (!AdminService.isLoggedIn()) {
      navigate("/admin");
      return;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminHeader />
      <div className="flex">
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
          <AdminSidebar activeMenu="PPDB" />
        </div>
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            <section className="p-10 bg-[#f5f6fa] min-h-screen">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="mb-2 text-3xl font-bold text-slate-900">
                    PPDB
                  </h2>
                  <span className="block font-medium text-slate-500">PPDB</span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="px-6 py-2 font-semibold text-white bg-teal-700 rounded-full shadow-md">
                    Buka PPDB
                  </button>
                  <div className="relative">
                    <select className="px-6 py-2 pr-10 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400">
                      <option>Semua</option>
                    </select>
                    <span className="absolute text-teal-700 transform -translate-y-1/2 pointer-events-none right-4 top-1/2">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 8l4 4 4-4" />
                      </svg>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari..."
                      className="px-6 py-2 pr-10 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <span className="absolute text-teal-700 transform -translate-y-1/2 right-4 top-1/2">
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              {/* Card and table */}
              <div className="p-8 bg-white border shadow rounded-2xl border-slate-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="text-base font-bold text-slate-700">
                        <th className="px-4 py-3">NO</th>
                        <th className="px-4 py-3">Nama</th>
                        <th className="px-4 py-3">Angkatan</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { nama: "Bilal Abdurrahman", status: "Diterima" },
                        { nama: "Dhiyaurrahman Hamizan", status: "Diterima" },
                        { nama: "Raffa Danendra", status: "Diterima" },
                        { nama: "Zaki Algifari", status: "Diterima" },
                        { nama: "Faris Fadhil", status: "Perbaikan" },
                        { nama: "Rafi Alexander", status: "Perbaikan" },
                        { nama: "Cahya Ilham", status: "Ditolak" },
                        { nama: "Dzaky Ikbaar", status: "Ditolak" },
                        { nama: "Frizaski Alfath", status: "Diterima" },
                        { nama: "Daffa Abiyya", status: "Diterima" },
                        { nama: "Hakkam Zakka", status: "Diterima" },
                        { nama: "Raden Muhammad", status: "Diterima" },
                        { nama: "Rafii Khairan", status: "Diterima" },
                      ].map((data, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                        >
                          <td className="px-4 py-3">{i + 1}</td>
                          <td className="px-4 py-3">{data.nama}</td>
                          <td className="px-4 py-3">Angkatan 1</td>
                          <td className="px-4 py-3">{data.status}</td>
                          <td className="px-4 py-3">
                            <button className="px-4 py-1 font-semibold text-white bg-teal-700 rounded-full">
                              Lihat
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button className="px-2 py-1 rounded bg-slate-100 text-slate-700">
                    &lt;
                  </button>
                  <span className="px-2">1</span>
                  <button className="px-2 py-1 rounded bg-slate-100 text-slate-700">
                    &gt;
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
