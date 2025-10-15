import React from "react";
import {
  FaUserFriends,
  FaChalkboardTeacher,
  FaFileAlt,
  FaChartLine,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminService from "../services/AdminService";

const sidebarMenu = [
  { label: "Beranda", icon: <FaChartLine />, path: "/admin/dashboard", roles: ["admin", "user"] },
  { label: "Santri", icon: <FaUserFriends />, path: "/admin/santri", roles: ["admin", "user"] },
  { label: "Pendidik", icon: <FaChalkboardTeacher />, path: "/admin/pendidik", roles: ["admin"] }, // Only for admin
  { label: "Artikel", icon: <FaFileAlt />, path: "/admin/artikel", roles: ["admin", "user"] },
  { label: "PPDB", icon: <FaChartLine />, path: "/admin/ppdb", roles: ["admin", "user"] },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current admin role from localStorage
  const currentAdmin = AdminService.getCurrentAdmin();
  const userRole = currentAdmin?.role || "user"; // Default to 'user' if not found

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
  const filteredMenu = sidebarMenu.filter(item => item.roles.includes(userRole));

  return (
    <aside
      className="w-64 h-full bg-white shadow-lg flex flex-col justify-between px-4 pt-1"
      style={{ minWidth: "256px" }}
    >
      <div>
        <img src="/assets/logo3.png" alt="Logo" className="h-8 mb-1 mx-auto" />
        <nav className="flex flex-col gap-0.5 mt-1">
          {filteredMenu.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-base hover:bg-teal-50 transition ${
                location.pathname === item.path
                  ? "bg-teal-100 text-teal-900"
                  : "text-slate-700"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}
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
