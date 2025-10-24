import React, { useRef, useState } from "react";
import PenggunaSidebar from "../../components/PenggunaSidebar";

export default function Berkas() {

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
  const initialFiles = Array(labels.length).fill("KTP ORTU.PDF");
  const [files, setFiles] = useState(initialFiles);
  const [formData, setFormData] = useState({
    nama: "",
    asal_sekolah: "",
    alamat: "",
    angkatan: "",
  });
  // create refs for each hidden input
  const fileInputRefs = useRef(labels.map(() => React.createRef()));

  const handleFileClick = (index) => {
    const ref = fileInputRefs.current[index];
    if (ref && ref.current) ref.current.click();
  };

  const handleFileChange = (index, e) => {
    const selected = e.target.files && e.target.files[0];
    setFiles((prev) => {
      const next = [...prev];
      next[index] = selected ? selected.name : "KTP ORTU.PDF";
      return next;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi form
    if (
      !formData.nama ||
      !formData.asal_sekolah ||
      !formData.alamat ||
      !formData.angkatan
    ) {
      alert("Lengkapi Data Pendaftaran Anda!");
      return;
    }

    // Validasi file upload
    const hasFiles = files.some((file) => file !== "KTP ORTU.PDF");
    if (!hasFiles) {
      alert("Lengkapi Data Pendaftaran Anda!");
      return;
    }

    // Simulasi submit
    console.log("Submitting form:", { formData, files });

    // Tampilkan alert sukses
    alert("Berhasil Mengirim Data Pendaftaran!");

    // Reset form
    setFormData({
      nama: "",
      asal_sekolah: "",
      alamat: "",
      angkatan: "",
    });
    setFiles(Array(labels.length).fill("KTP ORTU.PDF"));
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-black mb-2">
                  Pendaftaran
                </h1>
                <span className="block text-gray-500">
                  Berkas > Pendaftaran
                </span>
              </div>
            </div>

            <p className="mb-6 text-gray-600">
              Silakan lengkapi data berikut sesuai persyaratan pendaftaran
              Pesantren Al Ihsan Bekasi.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300"
                  placeholder="Masukkan Nama Lengkap..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asal Sekolah Dasar/Madrasah Ibtidaiyah
                </label>
                <input
                  type="text"
                  name="asal_sekolah"
                  value={formData.asal_sekolah}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300"
                  placeholder="Masukkan Asal Sekolah..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat
                </label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300"
                  placeholder="Masukkan Alamat Lengkap..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Angkatan
                </label>
                <input
                  type="text"
                  name="angkatan"
                  value={formData.angkatan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300"
                  placeholder="Masukkan Angkatan PPDB..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {labels.map((label, idx) => (
                  <div key={label}>
                    <div className="text-sm text-gray-600 mb-2">{label}</div>
                    <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-3 py-2">
                      <button
                        type="button"
                        onClick={() => handleFileClick(idx)}
                        className="px-3 py-1 rounded-full bg-green-200 text-green-800 text-sm font-medium hover:bg-green-300 transition"
                      >
                        Pilih File
                      </button>
                      <div className="flex-1 text-sm text-gray-600 pl-2">
                        {files[idx]}
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

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-700 text-white rounded-full font-semibold hover:bg-teal-800 transition"
                >
                  Konfirmasi
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
