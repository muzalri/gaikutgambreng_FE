import React from "react";

// Data dummy statis untuk tenaga pendidik
const teachers = [
  {
    id: 1,
    name: "Ust. Heru Kusuma",
    role: "Penanggung Jawab",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Ust. Muhibbul Umam Thalib, Lc",
    role: "Mudir Pesantren",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Ust. Danu Sabdo, M.Pd",
    role: "Kesantrian",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Ust. Hudzaifah, BA.",
    role: "Bag. Bahasa",
    photo:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=500&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Ust. Luthfi",
    role: "Bag. Tahfidz",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
  },
  {
    id: 6,
    name: "Ust. Reza",
    role: "Koordinator Musyrif",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
  },
  {
    id: 7,
    name: "Ust. Fajar",
    role: "Musyrif",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face",
  },
  {
    id: 8,
    name: "Ust. Najib",
    role: "Musyrif",
    photo:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=500&fit=crop&crop=face",
  },
];

export default function Teachers() {
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
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Photo Section - takes up most of the card */}
                <div
                  className="aspect-[4/5] bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${teacher.photo})` }}
                >
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Orange Label - simple rectangular at bottom */}
                <div className="bg-amber-500 px-4 py-3">
                  <div className="text-white text-center">
                    <div className="text-sm font-bold leading-tight">
                      {teacher.name}
                    </div>
                    <div className="text-xs font-medium opacity-95 mt-1">
                      {teacher.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
