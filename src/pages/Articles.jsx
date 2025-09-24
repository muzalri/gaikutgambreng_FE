import React from "react";

export default function Articles() {
  const items = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: "Judul Artikel Placeholder",
    snippet:
      "Deskripsi singkat artikel akan tampil di sini sebagai placeholder.",
    image: "/assets/articles/sample.jpg",
  }));

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-r from-teal-900 to-teal-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <h1 className="text-base">Beranda › Artikel</h1>
        </div>
      </section>
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Artikel <span className="text-teal-700">Pesantren Al Ihsan</span>
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Konten akan dinamis setelah admin menambahkan dari backend.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((it) => (
              <article
                key={it.id}
                className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
              >
                <div
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${it.image})` }}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{it.title}</h3>
                  <p className="mt-2 text-xs text-slate-600">{it.snippet}</p>
                  <button
                    type="button"
                    disabled
                    className="mt-4 px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-500 cursor-not-allowed"
                  >
                    Baca Selengkapnya
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
