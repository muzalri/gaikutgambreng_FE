import React, { useState, useEffect } from "react";
import ArtikelService from "../../services/ArtikelService";

export default function Articles() {
  const [artikelList, setArtikelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtikel, setSelectedArtikel] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchArtikel();
  }, []);

  const fetchArtikel = async () => {
    try {
      setLoading(true);
      const response = await ArtikelService.getAllArtikel();
      if (response.success) {
        setArtikelList(response.data);
      }
    } catch (error) {
      console.error("Error fetching artikel:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (artikel) => {
    setSelectedArtikel(artikel);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedArtikel(null);
  };

  // Fungsi untuk memotong teks
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

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
              Berita dan artikel terbaru dari Pesantren Al Ihsan Bekasi
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <p className="text-slate-500">Memuat artikel...</p>
            </div>
          ) : artikelList.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500">Belum ada artikel tersedia</p>
            </div>
          ) : (
            <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
              {artikelList.map((artikel) => (
                <article
                  key={artikel.id}
                  className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="h-40 bg-slate-200 relative overflow-hidden">
                    {artikel.foto ? (
                      <img
                        src={`http://localhost:5000${artikel.foto}`}
                        alt={artikel.judul}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full"><span class="text-4xl text-slate-400">📰</span></div>';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-4xl text-slate-400">📰</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 line-clamp-2">
                      {artikel.judul}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 line-clamp-3">
                      {truncateText(artikel.isi, 100)}
                    </p>
                    <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                      <span>Oleh: {artikel.penulis?.nama || "Admin"}</span>
                      <span>
                        {new Date(artikel.created_at).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openDetailModal(artikel)}
                      className="px-4 py-2 mt-4 text-sm text-white transition-colors bg-teal-700 rounded-md hover:bg-teal-800"
                    >
                      Baca Selengkapnya
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal Detail Artikel */}
      {showDetailModal && selectedArtikel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={closeDetailModal}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute text-2xl top-4 right-4 text-slate-400 hover:text-teal-700"
              onClick={closeDetailModal}
              aria-label="Tutup"
            >
              &#10005;
            </button>

            {selectedArtikel.foto && (
              <div className="w-full h-64 bg-slate-200">
                <img
                  src={`http://localhost:5000${selectedArtikel.foto}`}
                  alt={selectedArtikel.judul}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="p-8">
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                {selectedArtikel.judul}
              </h2>

              <div className="flex items-center gap-4 pb-4 mb-6 text-sm border-b text-slate-600 border-slate-200">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {selectedArtikel.penulis?.nama || "Admin"}
                </span>
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(selectedArtikel.created_at).toLocaleDateString(
                    "id-ID",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-base leading-relaxed text-slate-700 whitespace-pre-line">
                  {selectedArtikel.isi}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
