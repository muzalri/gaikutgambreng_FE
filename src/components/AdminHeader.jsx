import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminService from "../services/AdminService";
import { FaUserCircle} from "react-icons/fa";

export default function AdminHeader() {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // Get admin data from localStorage
    const admin = AdminService.getCurrentAdmin();
    setAdminData(admin);
  }, []);

  const adminName = adminData?.nama || "Admin";
  const adminPhotoProfile = adminData?.photo_profile;

  // Default avatar SVG component
  const DefaultAvatar = () => (
    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-teal-700">
      <FaUserCircle className="text-6xl text-white" />
    </div>
  );

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
        {adminPhotoProfile ? (
          <img
            src={`http://localhost:5000/${adminPhotoProfile}`}
            alt="Admin"
            className="object-cover w-8 h-8 border-2 border-white rounded-full"
          />
        ) : (
          <DefaultAvatar />
        )}
      </Link>
    </header>
  );
}
