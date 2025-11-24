import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      // Mengubah navbar ketika scroll lebih dari 100px (setelah hero section)
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    if (isHome) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isHome]);

  return (
    <header
      className={
        `fixed inset-x-0 top-0 z-50 transition-all duration-300 ` +
        (isHome
          ? isScrolled
            ? "bg-teal-700 shadow-lg"
            : "bg-transparent"
          : "bg-teal-900 border-b border-teal-900 shadow")
      }
    >
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Link
          to="/"
          className={
            `flex items-center gap-4 font-bold pl-2 transition-all duration-300 ` +
            (isHome
              ? isScrolled
                ? "text-white"
                : "text-white drop-shadow"
              : "text-white")
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

        {/* Desktop Navigation */}
        <nav
          className={
            `relative items-center hidden gap-6 text-sm md:flex transition-all duration-300 ` +
            (isHome ? (isScrolled ? "text-white" : "text-white") : "text-white")
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-teal-800 border-t border-teal-700">
          <nav className="px-4 py-3 space-y-3">
            <Link
              to="/"
              className="block py-2 text-white hover:bg-teal-700 rounded px-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            <div>
              <button
                type="button"
                className="flex items-center justify-between w-full py-2 text-white hover:bg-teal-700 rounded px-3"
                onClick={() => setOpen(!open)}
              >
                Profil <span>{open ? "▴" : "▾"}</span>
              </button>
              {open && (
                <div className="pl-6 mt-2 space-y-2">
                  <Link
                    to="/profil/tentang-kami"
                    className="block py-2 text-white hover:bg-teal-700 rounded px-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tentang Kami
                  </Link>
                  <Link
                    to="/profil/tenaga-pendidik"
                    className="block py-2 text-white hover:bg-teal-700 rounded px-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tenaga Pendidik
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/artikel"
              className="block py-2 text-white hover:bg-teal-700 rounded px-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              Artikel
            </Link>
            <a
              href="/pendaftaran"
              className="block py-2 text-white hover:bg-teal-700 rounded px-3"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pendaftaran
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
