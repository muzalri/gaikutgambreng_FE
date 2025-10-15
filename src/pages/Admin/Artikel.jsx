import React from "react";
import AdminSidebar from "../../components/AdminSidebar";

export default function Artikel() {
  const [showModal, setShowModal] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const fileInputRef = React.useRef();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // New: modal for viewing article details
  const [viewModal, setViewModal] = React.useState(false);
  const [selectedArticle, setSelectedArticle] = React.useState(null);

  const openViewModal = (article) => {
    // article is an object { id, judul, isi, penulis, image }
    setSelectedArticle(article);
    // initialize preview with article image (if any)
    setPreview(article.image || null);
    setImage(null);
    setViewModal(true);
  };

  const closeViewModal = () => {
    setViewModal(false);
    setSelectedArticle(null);
  };

  const handleConfirm = () => {
    // stub: here you'd call API to save changes
    closeViewModal();
  };

  const handleDelete = () => {
    // stub: here you'd call API to delete the article
    closeViewModal();
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <header className="sticky top-0 z-40 flex items-center justify-between w-full px-10 py-5 text-white shadow bg-gradient-to-r from-teal-800 to-teal-600">
        <div className="flex items-center gap-3">
          <img src="/assets/logo3.png" alt="Logo" className="h-8" />
        </div>
        <a href="/admin/profil" className="flex items-center gap-3">
          <span className="font-semibold">Halo, Admin Pusat</span>
          <img
            src="/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png"
            alt="Admin"
            className="object-cover w-8 h-8 border-2 border-white rounded-full"
          />
        </a>
      </header>
      <div className="flex">
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
          <AdminSidebar activeMenu="Artikel" />
        </div>
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            <section className="p-10 bg-[#f5f6fa] min-h-screen">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="mb-2 text-3xl font-bold text-slate-900">
                    Artikel
                  </h2>
                  <span className="block font-medium text-slate-500">
                    Artikel
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="px-6 py-2 font-semibold text-white bg-teal-700 rounded-full shadow-md"
                    onClick={() => setShowModal(true)}
                  >
                    Tambah
                  </button>
                  {/* Modal Tambah Artikel */}
                  {showModal && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-30">
                      <div className="relative w-full max-w-lg p-8 mx-auto mt-5 mb-12 bg-white shadow-lg rounded-2xl">
                        <button
                          className="absolute text-2xl top-6 right-6 text-slate-400 hover:text-teal-700"
                          onClick={() => setShowModal(false)}
                          aria-label="Tutup"
                        >
                          &#10005;
                        </button>
                        <h3 className="mb-2 text-2xl font-bold text-center">
                          Tambah Artikel
                        </h3>
                        <p className="mb-6 text-base text-center text-slate-500">
                          Silakan lengkapi data berikut menambah artikel
                          Pesantren Al Ihsan Bekasi.
                        </p>
                        <form className="flex flex-col gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Foto Artikel
                          </span>
                          <div
                            className="flex items-center justify-center w-full h-40 mb-2 rounded-lg cursor-pointer bg-slate-100"
                            onClick={handleImageClick}
                          >
                            {preview ? (
                              <img
                                src={preview}
                                alt="Preview"
                                className="object-contain h-full"
                              />
                            ) : (
                              <span className="text-4xl font-bold text-slate-400">
                                +
                              </span>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-700">
                            Judul
                          </span>
                          <input
                            type="text"
                            placeholder="Masukkan Judul..."
                            className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                          />
                          <span className="text-sm font-medium text-slate-700">
                            Isi
                          </span>
                          <textarea
                            placeholder="Masukkan Isi..."
                            className="w-full px-5 py-3 font-medium rounded-lg resize-none bg-slate-100 text-slate-700 focus:outline-none"
                            rows={4}
                          />
                          <span className="text-sm font-medium text-slate-700">
                            Penulis
                          </span>
                          <input
                            type="text"
                            placeholder="Masukkan Nama Penulis..."
                            className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="w-1/2 py-3 mx-auto mt-4 font-semibold text-white bg-teal-700 rounded-full shadow"
                          >
                            Konfirmasi
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                  <div className="relative">
                    <select className="px-6 py-2 pr-10 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400">
                      <option>Semua</option>
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
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari..."
                      className="px-6 py-2 pr-10 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <span className="absolute text-teal-700 transform -translate-y-1/2 right-4 top-1/2">
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
                    </span>
                  </div>
                </div>
              </div>
              {/* Card and table */}
              <div className="p-8 bg-white border shadow rounded-2xl border-slate-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="text-base font-bold text-slate-700">
                        <th className="px-4 py-3">NO</th>
                        <th className="px-4 py-3">Judul</th>
                        <th className="px-4 py-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 13 }).map((_, i) => {
                        const article = {
                          id: i + 1,
                          judul: "Juara 1 Kompetisi MQK",
                          isi: "Ringkasan atau isi artikel singkat...",
                          penulis: "Admin Pusat",
                          image: null,
                        };
                        return (
                          <tr
                            key={i}
                            className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                          >
                            <td className="px-4 py-3">{i + 1}</td>
                            <td className="px-4 py-3">{article.judul}</td>
                            <td className="px-4 py-3">
                              <button
                                className="px-4 py-1 font-semibold text-white bg-teal-700 rounded-full"
                                onClick={() => openViewModal(article)}
                              >
                                Lihat
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button className="px-2 py-1 rounded bg-slate-100 text-slate-700">
                    &lt;
                  </button>
                  <span className="px-2">1</span>
                  <button className="px-2 py-1 rounded bg-slate-100 text-slate-700">
                    &gt;
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* View Article Modal (matches design image) */}
      {viewModal && selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-30">
          <div className="relative w-full max-w-2xl p-8 mx-auto mt-8 mb-12 bg-white shadow-lg rounded-2xl">
            <button
              className="absolute text-2xl top-6 right-6 text-slate-400 hover:text-teal-700"
              onClick={closeViewModal}
              aria-label="Tutup"
            >
              &#10005;
            </button>
            <h3 className="mb-2 text-3xl font-bold text-center">
              Lihat Artikel
            </h3>
            <p className="mb-6 text-base text-center text-slate-500">
              Silakan lengkapi data berikut menyunting artikel Pesantren Al
              Ihsan Bekasi.
            </p>

            <form className="flex flex-col gap-4">
              <label className="text-sm font-medium text-slate-700">
                Foto Artikel
              </label>
              <div
                className="w-full h-40 rounded-lg bg-slate-100 flex items-center justify-center cursor-pointer"
                onClick={handleImageClick}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="object-contain h-full"
                  />
                ) : (
                  <span className="text-4xl font-bold text-slate-400">+</span>
                )}
              </div>
              {/* hidden file input reused from Tambah modal */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />

              <label className="text-sm font-medium text-slate-700">
                Judul
              </label>
              <input
                type="text"
                defaultValue={selectedArticle.judul}
                className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
              />

              <label className="text-sm font-medium text-slate-700">Isi</label>
              <textarea
                defaultValue={selectedArticle.isi}
                rows={4}
                className="w-full px-5 py-3 font-medium rounded-lg resize-none bg-slate-100 text-slate-700 focus:outline-none"
              />

              <label className="text-sm font-medium text-slate-700">
                Penulis
              </label>
              <input
                type="text"
                defaultValue={selectedArticle.penulis}
                className="w-full px-5 py-3 font-medium rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
              />

              <div className="flex items-center justify-center gap-6 mt-4">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-6 py-3 bg-teal-700 text-white rounded-full shadow"
                >
                  Konfirmasi
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-3 bg-red-600 text-white rounded-full shadow"
                >
                  Hapus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
