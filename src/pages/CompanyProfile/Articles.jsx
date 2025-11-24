import React, { useState, useEffect } from "react";
import ArtikelService from "../../services/ArtikelService";

export default function Articles() {
  const [artikelList, setArtikelList] = useState([]);
  const [filteredArtikel, setFilteredArtikel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtikel, setSelectedArtikel] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [categories, setCategories] = useState(["Semua"]);

  useEffect(() => {
    fetchArtikel();
  }, []);

  const fetchArtikel = async () => {
    try {
      setLoading(true);
      const response = await ArtikelService.getAllArtikel();
      if (response.success) {
        setArtikelList(response.data);
        setFilteredArtikel(response.data);

        // Extract unique categories from articles
        const uniqueCategories = ["Semua"];
        response.data.forEach((artikel) => {
          if (
            artikel.kategori &&
            !uniqueCategories.includes(artikel.kategori)
          ) {
            uniqueCategories.push(artikel.kategori);
          }
        });
        setCategories(uniqueCategories);
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

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    filterArticles();
  };

  // Handle category filter
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    filterArticles(e.target.value, searchKeyword);
  };

  // Filter articles based on search and category
  const filterArticles = (
    category = selectedCategory,
    search = searchKeyword
  ) => {
    let filtered = artikelList;

    // Filter by category
    if (category !== "Semua") {
      filtered = filtered.filter((artikel) => artikel.kategori === category);
    }

    // Filter by search keyword
    if (search.trim()) {
      filtered = filtered.filter(
        (artikel) =>
          artikel.judul.toLowerCase().includes(search.toLowerCase()) ||
          artikel.isi.toLowerCase().includes(search.toLowerCase()) ||
          (artikel.penulis?.nama &&
            artikel.penulis.nama.toLowerCase().includes(search.toLowerCase()))
      );
    }

    setFilteredArtikel(filtered);
  };

  // Update filtered articles when search keyword changes
  useEffect(() => {
    filterArticles();
  }, [searchKeyword, selectedCategory, artikelList]);

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
          {/* Header Section */}
          <div className="px-2 mb-6 sm:px-6">
            <h2 className="text-xl font-bold sm:text-2xl text-slate-900">
              Artikel <span className="text-teal-700">Pesantren Al Ihsan</span>
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Berita dan artikel terbaru dari Pesantren Al Ihsan Bekasi
            </p>
          </div>

          {/* Search and Filter - Responsive */}
          <div className="flex flex-col gap-3 px-2 mb-6 sm:flex-row sm:items-center sm:justify-end sm:gap-4 sm:px-6">
            <div className="relative w-full sm:w-auto sm:min-w-[200px]">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2.5 pr-10 text-sm font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-sm appearance-none sm:px-6 focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <span className="absolute text-teal-700 transform -translate-y-1/2 pointer-events-none right-4 top-1/2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 8l4 4 4-4" />
                </svg>
              </span>
            </div>
            <form onSubmit={handleSearch} className="relative w-full sm:w-auto sm:min-w-[250px]">
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 text-sm font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-sm sm:px-6 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <button
                type="submit"
                className="absolute text-teal-700 transform -translate-y-1/2 right-4 top-1/2"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </form>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <p className="text-slate-500">Memuat artikel...</p>
            </div>
          ) : artikelList.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500">Belum ada artikel tersedia</p>
            </div>
          ) : filteredArtikel.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500">
                Tidak ada artikel yang sesuai dengan filter
              </p>
            </div>
          ) : (
            <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArtikel.map((artikel) => (
                <article
                  key={artikel.id}
                  className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="h-40 bg-slate-200 relative overflow-hidden">
                    {artikel.foto ? (
                      <img
                        src={`https://backend.pesantrenalihsanbekasi.or.id/${artikel.foto}`}
                        alt={artikel.judul}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML =
                            '<div class="flex items-center justify-center h-full"><span class="text-4xl text-slate-400">📰</span></div>';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-4xl text-slate-400">📰</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {artikel.kategori && (
                      <span className="inline-block px-2 py-1 text-xs font-medium text-teal-700 bg-teal-100 rounded-full mb-2">
                        {artikel.kategori}
                      </span>
                    )}
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
                  src={`https://backend.pesantrenalihsanbekasi.or.id${selectedArtikel.foto}`}
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
