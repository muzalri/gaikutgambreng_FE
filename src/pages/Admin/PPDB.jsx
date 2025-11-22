import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import { getImageUrl } from "../../config/api";
import AdminService from "../../services/AdminService";
import Swal from "sweetalert2";
import SantriService from "../../services/SantriService";
import BerkasService from "../../services/BerkasService";
import PendaftaranService from "../../services/PendaftaranService";
import VoiceNoteService from "../../services/VoiceNoteService";
import PengumumanService from "../../services/PengumumanService";

export default function PPDB() {
  const navigate = useNavigate();
  const [santriList, setSantriList] = useState([]); // now holds Berkas list
  const [loadingList, setLoadingList] = useState(false);
  const location = useLocation();
  const [selectedAngkatan, setSelectedAngkatan] = useState("");
  const [selectedTahapan, setSelectedTahapan] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const TAHAPAN_LABELS = {
    1: "Seleksi Berkas",
    2: "Tes Psikolog",
    3: "Tes Baca Al-Qur'an",
    4: "Karantina Casantri",
    5: "Wawancara Casantri",
  };

  const getTahapanLabel = (value) => {
    const num = parseInt(value || 1, 10);
    return TAHAPAN_LABELS[num] || `Tahap ${num}`;
  };

  useEffect(() => {
    // Check if admin is logged in
    if (!AdminService.isLoggedIn()) {
      navigate("/admin");
      return;
    }
    loadBerkas();
  }, [navigate]);

  // Sync selectedAngkatan from query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const angkatan = params.get("angkatan") || "";
    setSelectedAngkatan(angkatan);
  }, [location.search]);

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
          tahapan: b.tahapan || 1,
        }));
        setSantriList(normalized);
      } else {
        setSantriList([]);
      }
    } catch (e) {
      console.error('Error loading berkas:', e);
      setSantriList([]);
    } finally {
      setLoadingList(false);
    }
  };

  // removed: angkatan dropdown handled in sidebar

  // Modal state for viewing applicant details
  const [showModal, setShowModal] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedBerkasId, setSelectedBerkasId] = useState(null);
  const [selectedBerkas, setSelectedBerkas] = useState(null);
  const [selectedVoiceNote, setSelectedVoiceNote] = useState(null);

  const getDocumentsFromSelectedBerkas = () => {
    const b = selectedBerkas || {};
    const docs = [
      { key: 'kartu_keluarga', label: 'Kartu Keluarga' },
      { key: 'akta_kelahiran', label: 'Akta Kelahiran' },
      { key: 'rapor', label: 'Rapor Kelas 5' },
      { key: 'surat_kematian', label: 'Surat Kematian' },
      { key: 'foto_santri', label: 'Pas Foto 4x6' },
      { key: 'sertifikat_hafalan', label: 'Sertifikat Hafalan' },
      { key: 'sertifikat_penghargaan', label: 'Sertifikat Penghargaan' },
    ];
    
    // Filter hanya dokumen yang benar-benar diunggah (field tidak null/kosong)
    return docs
      .filter((d) => b[d.key]) // Hanya ambil yang ada datanya
      .map((d) => {
        const rawPath = b[d.key];
        const normalized = rawPath ? `/${String(rawPath).replace(/\\\\/g, '/').replace(/^\/?/, '')}` : '';
        return {
          ...d,
          path: rawPath || '',
          url: rawPath ? getImageUrl(normalized) : '',
          filename: rawPath ? normalized.split('/').pop() : '',
          exists: Boolean(rawPath)
        };
      });
  };

  const getExt = (filename = '') => (filename.split('.').pop() || '').toLowerCase();
  const isImageExt = (ext) => ['png','jpg','jpeg','webp','gif'].includes(ext);
  const isPdfExt = (ext) => ext === 'pdf';

  const handleViewDocument = async (doc) => {
    if (!doc?.exists || !doc?.url) {
      await Swal.fire({ title: 'Tidak tersedia', text: 'Dokumen belum diunggah.', icon: 'info' });
      return;
    }
    const ext = getExt(doc.filename || doc.path || '');
    if (isImageExt(ext)) {
      await Swal.fire({
        title: doc.label,
        imageUrl: doc.url,
        imageAlt: doc.filename || 'Preview',
        width: 720,
        confirmButtonColor: '#0f766e',
        confirmButtonText: 'Tutup',
      });
      return;
    }
    if (isPdfExt(ext)) {
      window.open(doc.url, '_blank', 'noopener,noreferrer');
      return;
    }
    await Swal.fire({
      icon: 'info',
      title: 'Preview Tidak Tersedia',
      text: 'Format file ini tidak dapat di-preview. File akan dibuka di tab baru.',
      confirmButtonColor: '#0f766e'
    });
    window.open(doc.url, '_blank', 'noopener,noreferrer');
  };

  // Modal state for Pengumuman
  const [showPengumumanModal, setShowPengumumanModal] = useState(false);
  const [pengumumanData, setPengumumanData] = useState({
    angkatan: "",
    tahapan: "",
  });
  const [angkatanOptions, setAngkatanOptions] = useState([]);
  const [tahapanOptions, setTahapanOptions] = useState([]);

  const openModal = async (santriId, berkasId) => {
    setShowModal(true);
    setLoading(true);
    setSelectedSantri(null);
    setSelectedBerkasId(null);
    setSelectedBerkas(null);
    setSelectedVoiceNote(null);
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

      // Fetch voice note data
      try {
        const vnResponse = await VoiceNoteService.getAll({ id_santri: santriId });
        const voiceNotes = vnResponse?.data?.voiceNotes || vnResponse?.data || [];
        if (voiceNotes.length > 0) {
          setSelectedVoiceNote(voiceNotes[0]); // Ambil voice note pertama
        }
      } catch (e) {
        console.error("Error fetching voice note:", e);
        setSelectedVoiceNote(null);
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
      if (action === "Diterima") {
        if (selectedBerkasId) {
          const currentTahap = parseInt(selectedBerkas?.tahapan || 1, 10);
          const currentStatus = String(selectedBerkas?.status || 'Pending');
          if (currentTahap >= 5) {
            // Sudah di tahap 5: jika masih Pending atau Ditolak, bisa set status Diterima
            if (currentStatus.toLowerCase() === 'pending' || currentStatus.toLowerCase() === 'ditolak') {
              const { isConfirmed } = await Swal.fire({
                title: 'Selesaikan tahapan? ',
                text: 'Tahap saat ini Karantina Casantri. Set status menjadi Diterima?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, set Diterima',
                cancelButtonText: 'Batal',
              });
              if (!isConfirmed) return;
              await BerkasService.updateStatus(selectedBerkasId, 'Diterima');
              await loadBerkas();
              await Swal.fire({ title: 'Berhasil', text: 'Status diubah menjadi Diterima', icon: 'success' });
              closeModal();
              return;
            }
            await Swal.fire({ title: 'Info', text: 'Tahapan sudah di level tertinggi.', icon: 'info' });
            return;
          }
          const next = currentTahap + 1;
          const nextLabel = getTahapanLabel(next);
          const { isConfirmed } = await Swal.fire({
            title: "Majukan tahapan?",
            text: `Ke ${nextLabel}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, majukan",
            cancelButtonText: "Batal",
          });
          if (!isConfirmed) return;
          await BerkasService.updateTahapan(selectedBerkasId, next);
          // Refresh list and selected berkas
          await loadBerkas();
          const detail = await BerkasService.getById(selectedBerkasId);
          setSelectedBerkas(detail?.data || detail);
          await Swal.fire({
            title: "Berhasil",
            text: `Tahapan berhasil dimajukan ke ${nextLabel}`,
            icon: "success",
          });
        }
        closeModal();
        return;
      } else if (action === "Ditolak") {
        if (selectedBerkasId) {
          const { isConfirmed } = await Swal.fire({
            title: "Tolak berkas?",
            text: `Status akan diubah menjadi Ditolak`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, tolak",
            cancelButtonText: "Batal",
          });
          if (!isConfirmed) return;
          await BerkasService.updateStatus(selectedBerkasId, "Ditolak");
          await loadBerkas();
          await Swal.fire({
            title: "Berhasil",
            text: "Status berkas diubah menjadi Ditolak",
            icon: "success",
          });
        }
        closeModal();
        return;
      }
    } catch (err) {
      console.error("Error updating status:", err);
      await Swal.fire({
        title: "Gagal",
        text: "Gagal memproses aksi",
        icon: "error",
      });
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

  // Load angkatan options when modal opens
  useEffect(() => {
    const loadAngkatanOptions = async () => {
      try {
        const resp = await PendaftaranService.getAll({ limit: 100 });
        const rows = resp?.data || resp || [];
        const unique = Array.from(new Set((rows || []).map((r) => r.angkatan).filter(Boolean)));
        setAngkatanOptions(unique);
      } catch (_) {
        setAngkatanOptions([]);
      }
    };
    if (showPengumumanModal) {
      loadAngkatanOptions();
    }
  }, [showPengumumanModal]);

  // Set tahapan options to always show 5 tahapan (1-5)
  useEffect(() => {
    if (pengumumanData.angkatan) {
      // Always show all 5 tahapan options
      setTahapanOptions([1, 2, 3, 4, 5]);
    } else {
      setTahapanOptions([]);
    }
  }, [pengumumanData.angkatan]);

  const handlePengumumanSubmit = async (e) => {
    e.preventDefault();

    if (!pengumumanData.angkatan || !pengumumanData.tahapan) {
      await Swal.fire({
        title: "Validasi",
        text: "Angkatan dan Tahapan harus diisi!",
        icon: "warning",
      });
      return;
    }

    try {
      const selectedTahapan = parseInt(pengumumanData.tahapan, 10);
      const tahapLabel = getTahapanLabel(selectedTahapan);
      
      const { isConfirmed } = await Swal.fire({
        title: "Publikasikan pengumuman?",
        html: `Angkatan: <b>${pengumumanData.angkatan}</b><br/>Tahapan: <b>${tahapLabel}</b>`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, publikasikan",
        cancelButtonText: "Batal",
      });
      
      if (!isConfirmed) return;

      // Publish pengumuman dengan tahapan yang dipilih
      await PengumumanService.publish({
        angkatan: pengumumanData.angkatan,
        tahapan: selectedTahapan.toString(),
      });

      await Swal.fire({
        title: "Berhasil",
        text: "Pengumuman berhasil dipublikasikan!",
        icon: "success",
      });
      
      closePengumumanModal();
    } catch (err) {
      console.error(err);
      await Swal.fire({
        title: "Gagal",
        text: err.message || "Gagal mempublikasikan pengumuman",
        icon: "error",
      });
    }
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
                  {/* Angkatan filter moved to sidebar */}
                  <div className="relative">
                    <select className="px-6 py-2 pr-10 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                      <option value="">Status</option>
                      <option value="Diterima">Diterima</option>
                      <option value="Proses">Proses</option>
                      <option value="Ditolak">Ditolak</option>
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
                    <select className="px-6 py-2 pr-10 font-semibold text-teal-700 bg-white border border-teal-700 rounded-full shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400" value={selectedTahapan} onChange={(e) => setSelectedTahapan(e.target.value)}>
                      <option value="">Tahapan</option>
                      <option value="1">Seleksi Berkas</option>
                      <option value="2">Tes Psikolog</option>
                      <option value="3">Tes Baca Al-Qur'an</option>
                      <option value="4">Karantina Casantri</option>
                      <option value="5">Wawancara Casantri</option>
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
                      placeholder="Cari nama, angkatan, status..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
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
                        <th className="px-4 py-3">Tahapan</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        let filtered = santriList;
                        
                        // Filter by angkatan
                        if (selectedAngkatan) {
                          const val = String(selectedAngkatan);
                          filtered = filtered.filter((row) => {
                            const ra = String(row.angkatan || "").toLowerCase();
                            return (
                              ra === val.toLowerCase() ||
                              ra.includes(val.toLowerCase()) ||
                              ra.includes(`angkatan ${val}`.toLowerCase())
                            );
                          });
                        }
                        
                        // Filter by tahapan
                        if (selectedTahapan) {
                          filtered = filtered.filter((row) => {
                            const tahap = parseInt(row?.tahapan || 1, 10);
                            return tahap === parseInt(selectedTahapan, 10);
                          });
                        }
                        
                        // Filter by status
                        if (selectedStatus) {
                          const target = selectedStatus === 'Proses' ? 'Pending' : selectedStatus;
                          filtered = filtered.filter((row) => {
                            return String(row?.status || '').toLowerCase() === String(target).toLowerCase();
                          });
                        }
                        
                        // Filter by search keyword
                        if (searchKeyword.trim()) {
                          const keyword = searchKeyword.toLowerCase();
                          filtered = filtered.filter(row => 
                            (row.nama && row.nama.toLowerCase().includes(keyword)) ||
                            (row.angkatan && String(row.angkatan).toLowerCase().includes(keyword)) ||
                            (row.status && row.status.toLowerCase().includes(keyword))
                          );
                        }
                        
                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td
                                colSpan="6"
                                className="py-8 text-center text-slate-500"
                              >
                                {searchKeyword.trim() ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data pendaftaran'}
                              </td>
                            </tr>
                          );
                        }
                        
                        return filtered.map((data, i) => (
                        <tr
                          key={data.id}
                          className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                        >
                          <td className="px-4 py-3">{i + 1}</td>
                          <td className="px-4 py-3">{data.nama}</td>
                          <td className="px-4 py-3">{data.angkatan || "Angkatan 1"}</td>
                          <td className="px-4 py-3">{getTahapanLabel(data.tahapan)}</td>
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
                        ));
                      })()}
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
                            {/* Data Pribadi Calon Santri */}
                            <div className="mb-6">
                              <h4 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">
                                📋 Data Pribadi Calon Santri
                              </h4>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Nama Lengkap</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.nama_lengkap || selectedSantri?.nama || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Jenis Kelamin</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.jenis_kelamin || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Tempat Lahir</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.tempat_lahir || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Tanggal Lahir</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.tanggal_lahir ? new Date(selectedBerkas.tanggal_lahir).toLocaleDateString('id-ID') : "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Alamat</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.alamat || selectedSantri?.alamat || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">No. Telp/WA</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.no_telp || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Asal Sekolah/Madrasah</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.asal_sekolah || selectedSantri?.asal_sekolah || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Hafalan Al-Qur'an</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.hafalan_quran || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Angkatan</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.angkatan || "Angkatan 1"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Tahapan</label>
                                  <div className="mt-1 px-4 py-2 rounded bg-slate-50 inline-block">
                                    {getTahapanLabel(selectedBerkas?.tahapan)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Data Orang Tua */}
                            <div className="mb-6">
                              <h4 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">
                                👨‍👩‍👧 Data Orang Tua
                              </h4>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Nama Ayah</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.nama_ayah || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Pekerjaan Ayah</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.pekerjaan_ayah || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Penghasilan Ayah</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.penghasilan_ayah || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Nama Ibu</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.nama_ibu || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Pekerjaan Ibu</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.pekerjaan_ibu || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Penghasilan Ibu</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.penghasilan_ibu || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">No. Telp Orang Tua</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.no_telp_ortu || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Status Anak</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.status_anak || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Jumlah Tanggungan</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.jumlah_tanggungan || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Kesediaan Sekolah Ortu</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.kesediaan_sekolah_ortu || "-"}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Data Ekonomi Keluarga */}
                            <div className="mb-6">
                              <h4 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">
                                🏠 Data Ekonomi Keluarga
                              </h4>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Status Kepemilikan Rumah</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.status_kepemilikan_rumah || "-"}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-slate-600">Luas Tanah & Bangunan</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.luas_tanah_bangunan || "-"}
                                  </div>
                                </div>
                                <div className="md:col-span-2">
                                  <label className="text-sm font-semibold text-slate-600">Kepemilikan Kendaraan</label>
                                  <div className="p-3 mt-1 bg-slate-50 rounded">
                                    {selectedBerkas?.kepemilikan_kendaraan || "-"}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Nilai Voice Note */}
                            {selectedVoiceNote && (
                              <div className="mb-6">
                                <h4 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">
                                  🎤 Penilaian Voice Note (Bacaan Al-Qur'an)
                                </h4>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                  <div>
                                    <label className="text-sm font-semibold text-slate-600">Surat</label>
                                    <div className="p-3 mt-1 bg-slate-50 rounded">
                                      {selectedVoiceNote.surat || "Yunus 71-78"}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-semibold text-slate-600">Nilai</label>
                                    <div className={`p-3 mt-1 rounded font-bold text-center ${selectedVoiceNote.nilai >= 80 ? 'bg-green-100 text-green-700' : selectedVoiceNote.nilai >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                      {selectedVoiceNote.nilai ? `${selectedVoiceNote.nilai}/100` : "Belum Dinilai"}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-semibold text-slate-600">Status Penilaian</label>
                                    <div className={`p-3 mt-1 rounded text-center font-semibold ${selectedVoiceNote.status_penilaian === 'Sudah Dinilai' ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'}`}>
                                      {selectedVoiceNote.status_penilaian || "Belum Dinilai"}
                                    </div>
                                  </div>
                                  {selectedVoiceNote.catatan_penilaian && (
                                    <div className="md:col-span-3">
                                      <label className="text-sm font-semibold text-slate-600">Catatan Penilaian</label>
                                      <div className="p-3 mt-1 bg-slate-50 rounded">
                                        {selectedVoiceNote.catatan_penilaian}
                                      </div>
                                    </div>
                                  )}
                                  {selectedVoiceNote.tanggal_penilaian && (
                                    <div>
                                      <label className="text-sm font-semibold text-slate-600">Tanggal Dinilai</label>
                                      <div className="p-3 mt-1 bg-slate-50 rounded">
                                        {new Date(selectedVoiceNote.tanggal_penilaian).toLocaleDateString('id-ID')}
                                      </div>
                                    </div>
                                  )}
                                  <div className="md:col-span-3">
                                    <label className="text-sm font-semibold text-slate-600">Audio Rekaman</label>
                                    <div className="p-3 mt-1 bg-slate-50 rounded">
                                      {selectedVoiceNote.file_path ? (
                                        <audio controls className="w-full">
                                          <source src={`https://backend.pesantrenalihsanbekasi.or.id/${encodeURI(selectedVoiceNote.file_path)}`} />
                                          Browser Anda tidak mendukung pemutar audio.
                                        </audio>
                                      ) : (
                                        <span className="text-slate-400">Tidak ada rekaman</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Dokumen Berkas */}
                            <div className="mb-6">
                              <h4 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">
                                📄 Dokumen Berkas
                              </h4>

                              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                                {getDocumentsFromSelectedBerkas().length > 0 ? (
                                  getDocumentsFromSelectedBerkas().map((doc, idx) => {
                                    // Tentukan styling berdasarkan jenis dokumen (sama dengan Berkas.jsx)
                                    let colorClass = '';
                                    let svgPath = '';
                                    
                                    if (doc.key === 'kartu_keluarga') {
                                      colorClass = 'text-purple-700 bg-purple-50 hover:bg-purple-100';
                                      svgPath = 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
                                    } else if (doc.key === 'akta_kelahiran') {
                                      colorClass = 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100';
                                      svgPath = 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z';
                                    } else if (doc.key === 'rapor') {
                                      colorClass = 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100';
                                      svgPath = 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253';
                                    } else if (doc.key === 'surat_kematian') {
                                      colorClass = 'text-gray-700 bg-gray-50 hover:bg-gray-100';
                                      svgPath = 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
                                    } else if (doc.key === 'foto_santri') {
                                      colorClass = 'text-blue-700 bg-blue-50 hover:bg-blue-100';
                                      svgPath = 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z';
                                    } else if (doc.key === 'sertifikat_hafalan') {
                                      colorClass = 'text-green-700 bg-green-50 hover:bg-green-100';
                                      svgPath = 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z';
                                    } else if (doc.key === 'sertifikat_penghargaan') {
                                      colorClass = 'text-pink-700 bg-pink-50 hover:bg-pink-100';
                                      svgPath = 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7';
                                    }
                                    
                                    return (
                                      <div
                                        key={idx}
                                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition rounded-lg cursor-pointer hover:shadow ${colorClass}`}
                                        onClick={() => handleViewDocument(doc)}
                                      >
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={svgPath} />
                                        </svg>
                                        <span>{doc.label}</span>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="col-span-4 text-center py-8 text-slate-400">
                                    Tidak ada dokumen yang diunggah
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-center gap-6 mt-8">
                              <button
                                onClick={() => handleAction("Diterima")}
                                className="px-8 py-3 text-white rounded-full bg-teal-700 shadow"
                              >
                                Terima
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
                          {angkatanOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
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
                          {tahapanOptions.map((num) => (
                            <option key={num} value={num}>{getTahapanLabel(num)}</option>
                          ))}
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
