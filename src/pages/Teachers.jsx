import React from "react";

const teachers = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: "Ust. Nama",
  role: "Musyrif",
}));

export default function Teachers() {
  const teacherImage = "/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png";
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
            {teachers.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl overflow-hidden bg-white shadow-md border border-slate-200"
              >
                <div
                  className="aspect-[4/5] bg-cover bg-center"
                  style={{ backgroundImage: `url(${teacherImage})` }}
                />
                <div className="p-4">
                  <div className="inline-block px-4 py-2 rounded-tl-[16px] rounded-br-[16px] bg-amber-500 text-white text-sm font-medium">
                    {t.name}
                    <div className="text-xs opacity-90">{t.role}</div>
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
