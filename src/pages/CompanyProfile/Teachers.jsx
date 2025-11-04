import React, { useState, useEffect } from "react";
import AdminService from "../../services/AdminService";

// Data akan diambil dari API (pendidik)
// State kosong sebagai initial value
// Jika API gagal, tetap tampilkan pesan / fallback

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await AdminService.getAllPendidik();
        // AdminService returns an array in response.data; handle both shapes
        const data = Array.isArray(response) ? response : response.data || [];
        console.log('Fetched pendidik:', data);
        setTeachers(data);
      } catch (err) {
        console.error('Gagal mengambil data pendidik', err);
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Render
  if (loading) {
    return (
      <div className="pt-16">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">Memuat data pendidik...</div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <section className="bg-white pt-6 pb-2">
        <div className="mx-auto max-w-5xl px-4">
          <div className="bg-gradient-to-r from-teal-900 to-teal-700 rounded-full px-6 py-3 flex items-center">
            <span className="text-white text-sm">
              Beranda &gt; Tenaga Pendidik
            </span>
          </div>
        </div>
      </section>
      <section className="py-10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="px-6 mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Tenaga <span className="text-teal-700">Pendidik</span> Pesantren
              Al Ihsan
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Berikut adalah daftar tenaga pendidik yang membimbing santri di
              Pesantren Al Ihsan Bekasi.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher) => {
              const name = teacher.nama || teacher.name || "-";
              const role = teacher.isi || teacher.role || "Tenaga Pendidik";
              let photoUrl = teacher.photo_profile || teacher.photo || "";
              if (photoUrl) {
                if (!photoUrl.startsWith("http")) {
                  // Normalize leading slash and encode spaces/special chars
                  const path = photoUrl.startsWith("/") ? photoUrl : `/${photoUrl}`;
                  try {
                    photoUrl = new URL(path, 'http://localhost:5000').toString();
                  } catch (e) {
                    // Fallback if URL constructor fails
                    photoUrl = `http://localhost:5000${encodeURI(path)}`;
                  }
                }
              }

              console.log('Teacher photo URL computed:', photoUrl, 'original:', teacher.photo_profile || teacher.photo);

              return (
                <div
                  key={teacher.id}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Photo Section - takes up most of the card */}
                  <div
                    className="aspect-[4/5] bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${photoUrl || '/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png'})` }}
                  >
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Orange Label - simple rectangular at bottom */}
                  <div className="bg-amber-500 px-4 py-3">
                    <div className="text-white text-center">
                      <div className="text-sm font-bold leading-tight">
                        {name}
                      </div>
                      <div className="text-xs font-medium opacity-95 mt-1">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
