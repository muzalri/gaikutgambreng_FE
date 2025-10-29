import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";
import SantriService from "../../services/SantriService";
import BerkasService from "../../services/BerkasService";

export default function PPDB() {
  const navigate = useNavigate();
  const [santriList, setSantriList] = useState([]); // now holds Berkas list
  const [loadingList, setLoadingList] = useState(false);

  // Dummy fallback when API not available
  const dummySantri = [
    { id: 101, id_santri: 1, nama: "Bilal Abdurrahman", status: "Diterima", angkatan: "Angkatan 1" },
    { id: 102, id_santri: 2, nama: "Dhiyaurrahman Hamizan", status: "Diterima", angkatan: "Angkatan 1" },
    { id: 103, id_santri: 3, nama: "Raffa Danendra", status: "Diterima", angkatan: "Angkatan 1" },
    { id: 104, id_santri: 4, nama: "Zaki Algifari", status: "Diterima", angkatan: "Angkatan 1" },
    { id: 105, id_santri: 5, nama: "Faris Fadhil", status: "Pending", angkatan: "Angkatan 1" },
    { id: 106, id_santri: 6, nama: "Rafi Alexander", status: "Pending", angkatan: "Angkatan 1" },
    { id: 107, id_santri: 7, nama: "Cahya Ilham", status: "Ditolak", angkatan: "Angkatan 1" },
    { id: 108, id_santri: 8, nama: "Dzaky Ikbaar", status: "Ditolak", angkatan: "Angkatan 1" },
    { id: 109, id_santri: 9, nama: "Frizaski Alfath", status: "Diterima", angkatan: "Angkatan 1" },
    { id: 110, id_santri: 10, nama: "Daffa Abiyya", status: "Diterima", angkatan: "Angkatan 1" },
    { id: 111, id_santri: 11, nama: "Hakkam Zakka", status: "Diterima", angkatan: "Angkatan 1" },
    { id: 112, id_santri: 12, nama: "Raden Muhammad", status: "Diterima", angkatan: "Angkatan 1" },
    { id: 113, id_santri: 13, nama: "Rafii Khairan", status: "Diterima", angkatan: "Angkatan 1" },
  ];

  useEffect(() => {
    // Check if admin is logged in
    if (!AdminService.isLoggedIn()) {
      navigate("/admin");
      return;
    }
    loadBerkas();
  }, [navigate]);

  const loadBerkas = async () => {
    try {
      setLoadingList(true);
      const resp = await BerkasService.getAll({ limit: 100 });
      const list = resp?.data || resp; // {success, data} or array
      if (Array.isArray(list) && list.length > 0) {
        const normalized = list.map((b, idx) => ({
          id: b.id || idx + 1,
          id_santri: b.id_santri,
          nama: b.nama_lengkap || "-",
          angkatan: b.angkatan || "Angkatan 1",
          status: b.status || "Pending",
        }));
        setSantriList(normalized);
      } else {
        setSantriList(dummySantri);
      }
    } catch (e) {
      setSantriList(dummySantri);
    } finally {
      setLoadingList(false);
    }
  };

  // Modal state for viewing applicant details
  const [showModal, setShowModal] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedBerkasId, setSelectedBerkasId] = useState(null);
  const [selectedBerkas, setSelectedBerkas] = useState(null);

  // Modal state for Pengumuman
  const [showPengumumanModal, setShowPengumumanModal] = useState(false);
  const [pengumumanData, setPengumumanData] = useState({
    angkatan: "",
    tahapan: "",
  });

  const openModal = async (santriId, berkasId) => {
    setShowModal(true);
    setLoading(true);
    setSelectedSantri(null);
    setSelectedBerkasId(null);
    setSelectedBerkas(null);
    try {
      const resp = await SantriService.getSantriById(santriId);
      // API may return { data: {...} } or the object directly depending on implementation
      const data = resp?.data || resp;
      setSelectedSantri(data);
      // Set berkas id langsung dari row table
      if (berkasId) setSelectedBerkasId(berkasId);

      // Fetch detail berkas untuk ditampilkan di modal
      if (berkasId) {
        try {
          const berkasDetail = await BerkasService.getById(berkasId);
          const b = berkasDetail?.data || berkasDetail;
          setSelectedBerkas(b);
        } catch (e) {
          setSelectedBerkas({
            id: berkasId,
            nama_lengkap: data?.nama || '-',
            asal_sekolah: '-',
            alamat: '-',
            angkatan: '-',
          });
        }
      }
    } catch (err) {
      console.error("Error fetching santri:", err);
      // Fallback: create a minimal mock so modal can still render
      setSelectedSantri({
        id: santriId,
        nama: "-",
        asal_sekolah: "-",
        alamat: "-",
        angkatan: "-",
        berkas: [],
        status: "-",
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSantri(null);
    setSelectedBerkas(null);
  };

  const handleAction = async (action) => {
    if (!selectedSantri) return;
    try {
      // Prefer updating Berkas status when available
      if (selectedBerkasId) {
        await BerkasService.updateStatus(selectedBerkasId, action);
      } else {
        // Fallback: update santri status if berkas id unknown
        await SantriService.updateSantri(
          selectedSantri.id || selectedSantri._id || 1,
          { status: action }
        );
      }
      alert(`Berhasil mengubah status: ${action}`);
      closeModal();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Gagal mengubah status");
    }
  };

  const openPengumumanModal = () => {
    setShowPengumumanModal(true);
  };

  const closePengumumanModal = () => {
    setShowPengumumanModal(false);
    setPengumumanData({
      angkatan: "",
      tahapan: "",
    });
  };

  const handlePengumumanInputChange = (e) => {
    const { name, value } = e.target;
    setPengumumanData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePengumumanSubmit = (e) => {
    e.preventDefault();

    if (!pengumumanData.angkatan || !pengumumanData.tahapan) {
      alert("Angkatan dan Tahapan harus diisi!");
      return;
    }

    // TODO: Implement pengumuman API call
    console.log("Creating pengumuman:", pengumumanData);
    alert("Pengumuman berhasil dibuat!");
    closePengumumanModal();
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminHeader />
      <div className="flex">
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
          <AdminSidebar activeMenu="PPDB" />
        </div>
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            <section className="p-10 bg-[#f5f6fa] min-h-screen">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="mb-2 text-3xl font-bold text-slate-900">
                    PPDB
                  </h2>
                  <span className="block font-medium text-slate-500">PPDB</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={openPengumumanModal}
                    className="px-6 py-2 font-semibold text-white bg-teal-700 rounded-full shadow-md hover:bg-teal-800 transition"
                  >
                    Pengumuman
                  </button>
                  <div className="relative">
                    <select className="px-6 py-2 pr-10 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400">
                      <option>Status</option>
                      <option>Diterima</option>
                      <option>Proses</option>
                      <option>Ditolak</option>
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
                    <select className="px-6 py-2 pr-10 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400">
                      <option>Tahapan</option>
                      <option>Seleksi Berkas</option>
                      <option>Tes Psikolog</option>
                      <option>Tes Baca Al-Qur'an</option>
                      <option>Wawancara Casantri</option>
                      <option>Karantina Casantri</option>
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
                        <th className="px-4 py-3">Nama</th>
                        <th className="px-4 py-3">Angkatan</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(loadingList ? dummySantri : santriList).map((data, i) => (
                        <tr
                          key={data.id}
                          className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                        >
                          <td className="px-4 py-3">{i + 1}</td>
                          <td className="px-4 py-3">{data.nama}</td>
                          <td className="px-4 py-3">{data.angkatan || "Angkatan 1"}</td>
                          <td className="px-4 py-3">{data.status}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => openModal(data.id_santri, data.id)}
                              className="px-4 py-1 font-semibold text-white bg-teal-700 rounded-full"
                            >
                              Lihat
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Viewer modal */}
                  {showModal && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-30">
                      <div className="relative w-full max-w-3xl p-8 mx-auto mt-5 mb-12 bg-white shadow-lg rounded-2xl">
                        <button
                          className="absolute text-2xl top-6 right-6 text-slate-400 hover:text-teal-700"
                          onClick={closeModal}
                          aria-label="Tutup"
                        >
                          &#10005;
                        </button>
                        <h3 className="text-2xl font-extrabold text-center">
                          Data Berkas Santri
                        </h3>
                        <p className="mb-6 text-sm text-center text-slate-500">
                          Periksa kembali berkas calon santri agar proses
                          verifikasi berjalan lancar.
                        </p>

                        {loading ? (
                          <div className="py-16 text-center">Memuat...</div>
                        ) : (
                          <div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div>
                                <label className="text-sm text-slate-600">
                                  Nama
                                </label>
                                <div className="p-3 mt-1 bg-slate-50 rounded">
                                  {selectedBerkas?.nama_lengkap || selectedSantri?.nama || "-"}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm text-slate-600">
                                  Asal Sekolah Dasar/Madrasah Ibtidaiyah
                                </label>
                                <div className="p-3 mt-1 bg-slate-50 rounded">
                                  {selectedBerkas?.asal_sekolah || selectedSantri?.asal_sekolah || "-"}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm text-slate-600">
                                  Alamat
                                </label>
                                <div className="p-3 mt-1 bg-slate-50 rounded">
                                  {selectedBerkas?.alamat || selectedSantri?.alamat || "-"}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm text-slate-600">
                                  Angkatan
                                </label>
                                <div className="p-3 mt-1 bg-slate-50 rounded">
                                  {selectedBerkas?.angkatan || "Angkatan 1"}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
                              {/* Documents list - try to render selectedSantri.berkas if present */}
                              {(selectedSantri?.berkas?.length > 0
                                ? selectedSantri.berkas
                                : [
                                    "Surat Pernyataan Taat Peraturan",
                                    "Fotokopi Rapor Kelas",
                                    "Fotokopi Ijazah (Menyusul)",
                                    "Fotokopi KTP Orang Tua",
                                    "Fotokopi Kartu Keluarga",
                                    "Fotokopi Akta Kelahiran",
                                    "Pas Foto 4x6 Latar Biru (4 Lembar)",
                                    "Surat Keterangan Bebas TBC & Hepatitis",
                                  ]
                              ).map((label, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-3 bg-slate-50 rounded"
                                >
                                  <div className="text-sm text-slate-700">
                                    {typeof label === "string"
                                      ? label
                                      : label.label}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <button className="px-3 py-1 text-sm font-semibold text-emerald-700 bg-emerald-100 rounded-full">
                                      Lihat
                                    </button>
                                    <div className="text-sm text-slate-500">
                                      {typeof label === "string"
                                        ? "KTP_ORTU.PDF"
                                        : label.filename || ""}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-center gap-6 mt-8">
                              <button
                                onClick={() => handleAction("Diterima")}
                                className="px-8 py-3 text-white rounded-full bg-teal-700 shadow"
                              >
                                Terima
                              </button>
                              <button
                                onClick={() => handleAction("Pending")}
                                className="px-8 py-3 text-white rounded-full bg-amber-400 shadow"
                              >
                                Pending
                              </button>
                              <button
                                onClick={() => handleAction("Ditolak")}
                                className="px-8 py-3 text-white rounded-full bg-rose-600 shadow"
                              >
                                Tolak
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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

              {/* Pengumuman Modal */}
              {showPengumumanModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="relative w-full max-w-md p-8 mx-4 bg-white rounded-2xl shadow-lg">
                    <button
                      className="absolute text-2xl top-4 right-4 text-slate-400 hover:text-slate-600"
                      onClick={closePengumumanModal}
                      aria-label="Tutup"
                    >
                      &#10005;
                    </button>

                    <h3 className="mb-2 text-2xl font-bold text-slate-900">
                      Pengumuman
                    </h3>
                    <p className="mb-6 text-sm text-slate-500">
                      Silakan lengkapi data berikut untuk membuat pengumuman ke
                      PPDB
                    </p>

                    <form
                      onSubmit={handlePengumumanSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          Angkatan
                        </label>
                        <select
                          name="angkatan"
                          value={pengumumanData.angkatan}
                          onChange={handlePengumumanInputChange}
                          className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none"
                          required
                        >
                          <option value="">Pilih Angkatan</option>
                          <option value="Angkatan 1">Angkatan 1</option>
                          <option value="Angkatan 2">Angkatan 2</option>
                          <option value="Angkatan 3">Angkatan 3</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          Tahapan
                        </label>
                        <select
                          name="tahapan"
                          value={pengumumanData.tahapan}
                          onChange={handlePengumumanInputChange}
                          className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none"
                          required
                        >
                          <option value="">Pilih Tahapan</option>
                          <option value="Seleksi Administrasi">
                            Seleksi Administrasi
                          </option>
                          <option value="Tes Psikolog">Tes Psikolog</option>
                          <option value="Tes Baca Al-Qur'an">
                            Tes Baca Al-Qur'an
                          </option>
                          <option value="Wawancara">Wawancara</option>
                          <option value="Karantina">Karantina</option>
                        </select>
                      </div>

                      <div className="flex justify-center pt-4">
                        <button
                          type="submit"
                          className="px-8 py-3 bg-teal-700 text-white rounded-full font-semibold hover:bg-teal-800 transition"
                        >
                          Konfirmasi
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
