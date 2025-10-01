import React from "react";
import AdminSidebar from "../components/AdminSidebar";

export default function PPDB() {
  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <header className="w-full flex items-center justify-between px-10 py-5 text-white shadow bg-gradient-to-r from-teal-800 to-teal-600 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/assets/logo3.png" alt="Logo" className="h-8" />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold">Halo, Admin Pusat</span>
          <img
            src="/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png"
            alt="Admin"
            className="object-cover w-8 h-8 border-2 border-white rounded-full"
          />
        </div>
      </header>
      <div className="flex">
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
          <AdminSidebar activeMenu="PPDB" />
        </div>
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            <section className="p-10 bg-[#f5f6fa] min-h-screen">
              <h2 className="mb-2 text-3xl font-bold text-slate-900">PPDB</h2>
              <span className="text-slate-500 font-medium mb-6 block">
                PPDB
              </span>
              {/* Tabel dan filter sesuai desain PPDB.png */}
              <div className="bg-white rounded-2xl shadow border border-slate-100 p-8">
                <div className="flex items-center justify-end gap-4 mb-4">
                  <button className="bg-teal-700 text-white px-6 py-2 rounded-full font-semibold shadow">
                    Buka PPDB
                  </button>
                  <div className="relative">
                    <select className="px-6 py-2 pr-10 font-semibold border-2 border-teal-700 rounded-full text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all appearance-none">
                      <option>Semua</option>
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-teal-700">
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
                      className="px-6 py-2 font-semibold border-2 border-teal-700 rounded-full text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all pr-10"
                    />
                    <span className="absolute right-4 top-2.5 text-teal-700">
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
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="text-slate-700 font-bold text-base">
                        <th className="py-3 px-4">NO</th>
                        <th className="py-3 px-4">Nama</th>
                        <th className="py-3 px-4">Angkatan</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Aksi</th>
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
                          <td className="py-3 px-4">{i + 1}</td>
                          <td className="py-3 px-4">{data.nama}</td>
                          <td className="py-3 px-4">Angkatan 1</td>
                          <td className="py-3 px-4">{data.status}</td>
                          <td className="py-3 px-4">
                            <button className="bg-teal-700 text-white px-4 py-1 rounded-full font-semibold">
                              Lihat
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end items-center gap-2 mt-4">
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
