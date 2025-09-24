import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-slate-900"
        >
          <img src="/assets/logo1.png" alt="Logo" className="h-6 w-auto" />
          <span>Al-Ihsan</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700 relative">
          <Link to="/" className="hover:text-slate-900">
            Beranda
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              type="button"
              className="hover:text-slate-900 flex items-center gap-1"
            >
              Profil <span>▾</span>
            </button>
            {open && (
              <div className="absolute top-full left-0 mt-2 w-48 rounded-md border border-slate-200 bg-white shadow-lg py-2">
                <Link
                  to="/profil/tentang-kami"
                  className="block px-3 py-2 hover:bg-slate-50"
                >
                  Tentang Kami
                </Link>
                <Link
                  to="/profil/tenaga-pendidik"
                  className="block px-3 py-2 hover:bg-slate-50"
                >
                  Tenaga Pendidik
                </Link>
              </div>
            )}
          </div>
          <Link to="/artikel" className="hover:text-slate-900">
            Artikel
          </Link>
          <Link to="/pendaftaran" className="hover:text-slate-900">
            Pendaftaran
          </Link>
        </nav>
      </div>
    </header>
  );
}
