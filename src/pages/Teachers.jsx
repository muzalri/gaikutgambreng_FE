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
      <section className="bg-gradient-to-r from-teal-900 to-teal-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-base">Beranda › Tenaga Pendidik</h1>
        </div>
      </section>
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </section>
    </div>
  );
}
