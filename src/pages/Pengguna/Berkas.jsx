import React, { useRef, useState } from "react";
import PenggunaSidebar from "../../components/PenggunaSidebar";

export default function Berkas() {
  const berkas = [
    {
      id: 1,
      nama: "Bilal Abdurrahman",
      angkatan: "Angkatan 1",
      status: "Pengecekan",
    },
  ];

  // Modal + file picker state
  const [showTambahModal, setShowTambahModal] = useState(false);
  // Labels for each required file (keeps order predictable)
  const labels = [
    "Surat Pernyataan Taat Peraturan",
    "Fotokopi Rapor Kelas",
    "Fotokopi Ijazah (Menyusul)",
    "Fotokopi KTP Orang Tua",
    "Fotokopi Kartu Keluarga",
    "Fotokopi Akta Kelahiran",
    "Pas Foto 4x6 Latar Biru (4 Lembar)",
    "Surat Keterangan Bebas TBC & Hepatitis",
  ];
  const initialFiles = Array(labels.length).fill(null);
  const [files, setFiles] = useState(initialFiles);
  // create refs for each hidden input
  const fileInputRefs = useRef(labels.map(() => React.createRef()));

  const openTambahModal = () => setShowTambahModal(true);
  const closeTambahModal = () => setShowTambahModal(false);

  // View modal state for 'Lihat' button
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBerkas, setSelectedBerkas] = useState(null);

  const openViewModal = (b) => {
    setSelectedBerkas(b);
    setShowViewModal(true);
  };
  const closeViewModal = () => setShowViewModal(false);

  const handleFileClick = (index) => {
    const ref = fileInputRefs.current[index];
    if (ref && ref.current) ref.current.click();
  };

  const handleFileChange = (index, e) => {
    const selected = e.target.files && e.target.files[0];
    setFiles((prev) => {
      const next = [...prev];
      next[index] = selected ? selected.name : null;
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      <header className="sticky top-0 z-40 flex items-center justify-between w-full px-10 py-5 text-white shadow bg-gradient-to-r from-teal-800 to-teal-600 h-[80px]">
        <div className="flex items-center gap-3">
          <img src="/assets/logo3.png" alt="Logo" className="h-8" />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold">Halo, Casantri</span>
          <img
            src="/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png"
            alt="Profile"
            className="object-cover w-8 h-8 border-2 border-white rounded-full"
          />
        </div>
      </header>

      <div className="flex flex-1">
        <PenggunaSidebar />
        <div className="flex-1 ml-64">
          <main className="px-10 py-8">
            <h1 className="text-2xl font-bold text-[#1B8277] mb-2">Berkas</h1>
            <span className="block mb-6 text-gray-500">Berkas</span>

            <div className="p-6 bg-white shadow rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Berkas Pendaftaran</h3>
                <button
                  onClick={openTambahModal}
                  className="px-4 py-2 bg-teal-700 text-white rounded-full"
                >
                  Tambah
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="text-base font-bold text-slate-700">
                      <th className="px-4 py-3">NO</th>
                      <th className="px-4 py-3">Nama</th>
                      <th className="px-4 py-3">Angkatan</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {berkas.map((b, i) => (
                      <tr
                        key={b.id}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3">{i + 1}</td>
                        <td className="px-4 py-3">{b.nama}</td>
                        <td className="px-4 py-3">{b.angkatan}</td>
                        <td className="px-4 py-3">{b.status}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => openViewModal(b)}
                            className="px-4 py-1 font-semibold text-white bg-teal-700 rounded-full"
                          >
                            Lihat
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Tambah Modal */}
      {showTambahModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40">
          <div className="w-[880px] max-w-[95%] bg-white rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-auto">
            <button
              onClick={closeTambahModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-2xl font-extrabold text-center text-[#0f172a] mb-1">
              Pendaftaran Santri
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Silakan lengkapi data berikut sesuai persyaratan pendaftaran
            </p>

            <div className="space-y-4 px-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 outline-none"
                  placeholder="Masukkan Nama Lengkap..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asal Sekolah Dasar/Madrasah Ibtidaiyah
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 outline-none"
                  placeholder="Masukkan Asal Sekolah..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 outline-none"
                  placeholder="Masukkan Alamat Lengkap..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {labels.map((label, idx) => (
                  <div key={label}>
                    <div className="text-sm text-gray-600 mb-2">{label}</div>
                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
                      <button
                        type="button"
                        onClick={() => handleFileClick(idx)}
                        className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-800 text-sm font-medium"
                      >
                        Pilih File
                      </button>
                      <div className="flex-1 text-sm text-gray-600 pl-2">
                        {files[idx] ? files[idx] : "Belum ada file dipilih"}
                      </div>
                      <input
                        ref={fileInputRefs.current[idx]}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(idx, e)}
                        accept="image/*,.pdf,.jpg,.jpeg,.png"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center mt-6">
                <button
                  onClick={() => {
                    /* TODO: submit handler */ closeTambahModal();
                  }}
                  className="px-8 py-3 bg-emerald-800 text-white rounded-full shadow-lg"
                >
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lihat Modal (read-only) */}
      {showViewModal && selectedBerkas && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40">
          <div className="w-[880px] max-w-[95%] bg-white rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-auto">
            <button
              onClick={closeViewModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-2xl font-extrabold text-center text-[#0f172a] mb-1">
              Pendaftaran Santri
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Detail berkas pendaftaran
            </p>

            <div className="space-y-4 px-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama
                </label>
                <div className="w-full px-4 py-3 rounded-lg bg-gray-100">
                  {selectedBerkas.nama}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Angkatan
                </label>
                <div className="w-full px-4 py-3 rounded-lg bg-gray-100">
                  {selectedBerkas.angkatan}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {labels.map((label, idx) => (
                  <div key={label}>
                    <div className="text-sm text-gray-600 mb-2">{label}</div>
                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
                      <button className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-800 text-sm font-medium">
                        Lihat
                      </button>
                      <div className="flex-1 text-sm text-gray-600 pl-2">
                        KTP ORTU.PDF
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center mt-6 gap-4">
                <button
                  onClick={closeViewModal}
                  className="px-8 py-3 bg-emerald-800 text-white rounded-full shadow-lg"
                >
                  Konfirmasi
                </button>
                <button
                  onClick={closeViewModal}
                  className="px-8 py-3 bg-red-600 text-white rounded-full shadow-lg"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
