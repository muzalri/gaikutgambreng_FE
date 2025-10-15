import React from "react";
import AdminSidebar from "../../components/AdminSidebar";

export default function Profil() {
  // dummy profile data
  const profile = {
    name: "Bilal Abdurrahman",
    email: "Email@gmail.com",
    phone: "08123456789",
    role: "Admin Pusat",
    avatar: "/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png",
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <header className="sticky top-0 z-40 flex items-center justify-between w-full px-10 py-5 text-white shadow bg-gradient-to-r from-teal-800 to-teal-600">
        <div className="flex items-center gap-3">
          <img src="/assets/logo3.png" alt="Logo" className="h-8" />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold">Halo, {profile.name}</span>
          <img
            src={profile.avatar}
            alt="Admin"
            className="object-cover w-8 h-8 border-2 border-white rounded-full"
          />
        </div>
      </header>

      <div className="flex">
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
          <AdminSidebar activeMenu="Beranda" />
        </div>
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            <section className="p-10 bg-[#f5f6fa] min-h-screen">
              <div className="mb-6">
                <h2 className="mb-2 text-3xl font-bold text-slate-900">
                  Profil
                </h2>
                <span className="block font-medium text-slate-500">Profil</span>
              </div>

              <div className="p-8 bg-white border shadow rounded-2xl border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="flex items-center gap-6">
                    <img
                      src={profile.avatar}
                      className="w-24 h-24 rounded-full object-cover"
                      alt="avatar"
                    />
                    <div>
                      <h3 className="text-lg font-bold">{profile.name}</h3>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-teal-700 text-white rounded-full">
                      Ganti Kata Sandi
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Nama
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-lg bg-slate-100"
                      value={profile.name}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Email
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-lg bg-slate-100"
                      value={profile.email}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      No. Telepon
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-lg bg-slate-100"
                      value={profile.phone}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Peran
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-lg bg-slate-100"
                      value={profile.role}
                      readOnly
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button className="px-6 py-3 bg-teal-700 text-white rounded-full">
                    Sunting
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
