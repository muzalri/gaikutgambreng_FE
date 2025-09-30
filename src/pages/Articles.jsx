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
      <section className="pt-6 pb-2 bg-white">
        <div className="max-w-5xl px-4 mx-auto">
          <div className="flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-teal-900 to-teal-700">
            <span className="text-sm text-white">Beranda &gt; Artikel</span>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-5xl px-4 mx-auto">
          <div className="px-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Artikel <span className="text-teal-700">Pesantren Al Ihsan</span>
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Konten akan dinamis setelah admin menambahkan dari backend.
            </p>
          </div>
          <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <article
                key={it.id}
                className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-xl"
              >
                <div
                  className="h-40 bg-center bg-cover"
                  style={{ backgroundImage: `url(${it.image})` }}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{it.title}</h3>
                  <p className="mt-2 text-xs text-slate-600">{it.snippet}</p>
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 mt-4 text-sm border rounded-md cursor-not-allowed border-slate-300 text-slate-500"
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
