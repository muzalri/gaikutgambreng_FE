import React from "react";
import { FaHome, FaFolder, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const menus = [
  { label: "Beranda", icon: <FaHome />, path: "/pengguna/beranda" },
  { label: "Berkas", icon: <FaFolder />, path: "/pengguna/beranda" },
];

export default function PenggunaSidebar() {
  const location = useLocation();
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
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 font-semibold text-base hover:bg-red-50 transition w-full">
          <span className="text-xl">
            <FaSignOutAlt />
          </span>
          Keluar
        </button>
      </div>
    </aside>
  );
}
