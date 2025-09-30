import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <header
      className={
        `fixed inset-x-0 top-0 z-50 transition-all ` +
        (isHome
          ? "bg-transparent"
          : "bg-teal-900 border-b border-teal-900 shadow")
      }
    >
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Link
          to="/"
          className={
            `flex items-center gap-4 font-bold pl-2 ` +
            (isHome ? "text-white drop-shadow" : "text-white")
          }
          style={{ minWidth: "220px" }}
        >
          <img
            src="/assets/logo3.png"
            alt="Logo"
            className={isHome ? "h-8 w-auto" : "h-10 w-auto"}
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </Link>
        <nav
          className={
            `relative items-center hidden gap-6 text-sm md:flex ` +
            (isHome ? "text-white" : "text-white")
          }
        >
          <Link to="/" className="hover:underline">
            Beranda
          </Link>
          <div className="relative" onMouseEnter={() => setOpen(true)}>
            <button
              type="button"
              className="flex items-center gap-1 hover:underline"
            >
              Profil <span>▾</span>
            </button>
            {open && (
              <div
                className="absolute left-0 w-48 py-2 mt-2 bg-white border rounded-md shadow-lg top-full border-slate-200 text-slate-700"
                onMouseLeave={() => setOpen(false)}
              >
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
          <Link to="/artikel" className="hover:underline">
            Artikel
          </Link>
          <a
            href="/pendaftaran"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pendaftaran
          </a>
        </nav>
      </div>
    </header>
  );
}
