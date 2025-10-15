import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminService from "../services/AdminService";

export default function AdminHeader() {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // Get admin data from localStorage
    const admin = AdminService.getCurrentAdmin();
    setAdminData(admin);
  }, []);

  const adminName = adminData?.nama || "Admin";
  const adminAvatar = "/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between w-full px-10 py-5 text-white shadow bg-gradient-to-r from-teal-800 to-teal-600">
      <div className="flex items-center gap-3">
        <img src="/assets/logo3.png" alt="Logo" className="h-8" />
      </div>
      <Link 
        to="/admin/profil" 
        className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer"
      >
        <span className="font-semibold">Halo, {adminName}</span>
        <img
          src={adminAvatar}
          alt="Admin"
          className="object-cover w-8 h-8 border-2 border-white rounded-full"
        />
      </Link>
    </header>
  );
}
