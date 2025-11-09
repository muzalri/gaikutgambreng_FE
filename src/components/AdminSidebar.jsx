import React, { useEffect, useState } from "react";
import {
  FaUserFriends,
  FaChalkboardTeacher,
  FaFileAlt,
  FaChartLine,
  FaSignOutAlt,
  FaQuoteLeft,
  FaCalendarAlt,
  FaBullhorn,
  FaMicrophone,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminService from "../services/AdminService";
import PendaftaranService from "../services/PendaftaranService";

const sidebarMenu = [
  {
    label: "Beranda",
    icon: <FaChartLine />,
    path: "/admin/dashboard",
    roles: ["admin", "user"],
  },
  {
    label: "Santri",
    icon: <FaUserFriends />,
    path: "/admin/santri",
    roles: ["admin", "user"],
  },
  {
    label: "Pendidik",
    icon: <FaChalkboardTeacher />,
    path: "/admin/pendidik",
    roles: ["admin"],
  }, // Only for admin
  {
    label: "Artikel",
    icon: <FaFileAlt />,
    path: "/admin/artikel",
    roles: ["admin", "user"],
  },
  {
    label: "Testimonial",
    icon: <FaQuoteLeft />,
    path: "/admin/testimonial",
    roles: ["admin", "user"],
  },
  {
    label: "PPDB",
    icon: <FaChartLine />,
    path: "/admin/ppdb",
    roles: ["admin", "user"],
  },
  {
    label: "Pendaftaran",
    icon: <FaCalendarAlt />,
    path: "/admin/pendaftaran",
    roles: ["admin", "user"],
  },
  {
    label: "Promosi",
    icon: <FaBullhorn />,
    path: "/admin/promosi",
    roles: ["admin", "user"],
  },
  {
    label: "Voice Note",
    icon: <FaMicrophone />,
    path: "/admin/voicenote",
    roles: ["admin", "user"],
  },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [ppdbOpen, setPpdbOpen] = useState(false);
  const [angkatanOptions, setAngkatanOptions] = useState([]);

  // Get current admin role from localStorage
  const currentAdmin = AdminService.getCurrentAdmin();
  const userRole = currentAdmin?.role || "user"; // Default to 'user' if not found

  useEffect(() => {
    const loadAngkatan = async () => {
      try {
        const resp = await PendaftaranService.getAngkatanDropdown();
        const list = resp?.data || [];
        setAngkatanOptions(Array.isArray(list) ? list : []);
      } catch (e) {
        setAngkatanOptions([]);
      }
    };
    loadAngkatan();
  }, []);

  const handleLogout = async () => {
    try {
      await AdminService.logout();
      navigate("/admin");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      localStorage.removeItem("adminData");
      navigate("/admin");
    }
  };

  // Filter menu items based on user role
  const filteredMenu = sidebarMenu.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <aside
      className="w-64 h-full bg-white shadow-lg flex flex-col justify-between px-4 pt-1"
      style={{ minWidth: "256px" }}
    >
      <div>
        <img src="/assets/logo3.png" alt="Logo" className="h-8 mb-1 mx-auto" />
        <nav className="flex flex-col gap-0.5 mt-1">
          {filteredMenu.map((item) => {
            const isPPDB = item.label === "PPDB";
            const isActive = location.pathname === item.path || (isPPDB && location.pathname.startsWith("/admin/ppdb"));
            if (!isPPDB) {
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-base hover:bg-teal-50 transition ${
                    isActive ? "bg-teal-100 text-teal-900" : "text-slate-700"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={item.label} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setPpdbOpen((v) => !v)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-semibold text-base hover:bg-teal-50 transition ${
                    isActive ? "bg-teal-100 text-teal-900" : "text-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </span>
                  <span className={`transition-transform ${ppdbOpen ? "rotate-180" : "rotate-0"}`}>▾</span>
                </button>
                {ppdbOpen && (
                  <div className="ml-8 mt-1 mb-2 flex flex-col">
                   
                    {angkatanOptions.map((opt) => (
                      <Link
                        key={opt.id || opt.angkatan}
                        to={`/admin/ppdb?angkatan=${encodeURIComponent(String(opt.angkatan))}`}
                        className={`px-3 py-2 rounded-md text-sm font-semibold hover:bg-teal-50 ${
                          location.pathname === "/admin/ppdb" && new URLSearchParams(location.search).get("angkatan") === String(opt.angkatan)
                            ? "text-teal-900"
                            : "text-slate-600"
                        }`}
                      >
                        {`Angkatan ${opt.angkatan}`}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
      <div className="pb-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 font-semibold text-base hover:bg-red-50 hover:text-red-600 transition w-full"
        >
          <span className="text-xl">
            <FaSignOutAlt />
          </span>
          Keluar
        </button>
      </div>
    </aside>
  );
}
