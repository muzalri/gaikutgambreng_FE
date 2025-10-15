import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";
import { FaUserCircle, FaEnvelope, FaPhone, FaIdCard } from "react-icons/fa";

export default function Profil() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    if (!AdminService.isLoggedIn()) {
      navigate("/admin");
      return;
    }

    // Get admin data from localStorage
    const admin = AdminService.getCurrentAdmin();
    
    // Fetch fresh admin data from backend
    const fetchAdminProfile = async () => {
      try {
        if (admin && admin.id) {
          const response = await AdminService.getProfile(admin.id);
          if (response.success && response.data) {
            setAdminData(response.data);
          } else {
            setAdminData(admin);
          }
        } else {
          setAdminData(admin);
        }
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        // Fallback to localStorage data
        setAdminData(admin);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-teal-700">Loading...</div>
      </div>
    );
  }

  const adminName = adminData?.nama || "Admin";
  const adminEmail = adminData?.email || "-";
  const adminPhone = adminData?.no_telp || "-";
  const adminRole = adminData?.role || "Admin";
  const adminIsi = adminData?.isi || "-";

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminHeader />
      <div className="flex">
        {/* Sidebar fixed on the left, below header */}
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
          <AdminSidebar />
        </div>
        {/* Main content with left margin for sidebar */}
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            {/* Profile Content */}
            <section className="p-10 bg-[#f5f6fa] min-h-screen">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="mb-2 text-3xl font-bold text-slate-900">
                    Profil Admin
                  </h2>
                  <span className="block font-medium text-slate-500">
                    <Link to="/admin/dashboard" className="hover:text-teal-600">Beranda</Link> / Profil
                  </span>
                </div>
              </div>

              {/* Profile Card */}
              <div className="max-w-4xl mx-auto">
                <div className="p-8 bg-white border shadow-lg rounded-2xl border-slate-100">
                  {/* Profile Header */}
                  <div className="flex items-center gap-6 pb-6 mb-6 border-b border-slate-200">
                    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-teal-700">
                      <FaUserCircle className="text-6xl text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{adminName}</h3>
                      <p className="mt-1 text-lg font-medium text-teal-600">{adminRole}</p>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50">
                      <FaEnvelope className="mt-1 text-2xl text-teal-600" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-500">Email</p>
                        <p className="mt-1 text-base font-medium text-slate-900">{adminEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50">
                      <FaPhone className="mt-1 text-2xl text-teal-600" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-500">No. Telepon</p>
                        <p className="mt-1 text-base font-medium text-slate-900">{adminPhone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50">
                      <FaIdCard className="mt-1 text-2xl text-teal-600" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-500">Role</p>
                        <p className="mt-1 text-base font-medium text-slate-900">{adminRole}</p>
                      </div>
                    </div>

                    {adminIsi && adminIsi !== "-" && (
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50">
                        <FaUserCircle className="mt-1 text-2xl text-teal-600" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-500">Deskripsi</p>
                          <p className="mt-1 text-base font-medium text-slate-900">{adminIsi}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 mt-6 border-t border-slate-200">
                    <Link
                      to="/admin/dashboard"
                      className="flex-1 px-6 py-3 font-semibold text-center transition border-2 rounded-lg text-teal-700 border-teal-600 hover:bg-teal-50"
                    >
                      Kembali ke Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

                 