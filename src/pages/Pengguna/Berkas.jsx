import React, { useRef, useState, useEffect } from "react";
import PenggunaSidebar from "../../components/PenggunaSidebar";
import BerkasService from "../../services/BerkasService";
import Swal from "sweetalert2";

export default function Berkas() {
  const [santriData, setSantriData] = useState(null);
  const [isPendaftaranActive, setIsPendaftaranActive] = useState(false);
  const [pendaftaranInfo, setPendaftaranInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittedBerkas, setSubmittedBerkas] = useState(null); // Berkas yang sudah dikirim
  const [showSubmittedBerkas, setShowSubmittedBerkas] = useState(false); // Toggle view

  useEffect(() => {
    // Ambil data santri dari localStorage
    const data = localStorage.getItem('santriData');
    if (data) {
      setSantriData(JSON.parse(data));
    }

    // Cek status pendaftaran
    checkPendaftaranStatus();
    
    // Cek berkas yang sudah dikirim
    fetchSubmittedBerkas();
  }, []);

  const checkPendaftaranStatus = async () => {
    try {
      setLoading(true);
      const result = await BerkasService.checkActivePendaftaran();
      
      console.log('📋 Status pendaftaran:', result);
      
      setIsPendaftaranActive(result.isActive);
      setPendaftaranInfo(result.pendaftaran);

      // Auto-fill angkatan jika pendaftaran aktif
      if (result.isActive && result.pendaftaran) {
        setFormData((prev) => ({
          ...prev,
          angkatan: result.pendaftaran.angkatan,
        }));
      }
    } catch (error) {
      console.error('Error checking pendaftaran status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Tidak dapat mengecek status pendaftaran',
        timer: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmittedBerkas = async () => {
    try {
      const data = localStorage.getItem('santriData');
      if (!data) return;
      
      const santri = JSON.parse(data);
      const result = await BerkasService.getAll({ id_santri: santri.id });
      
      if (result.data && result.data.length > 0) {
        setSubmittedBerkas(result.data[0]); // Ambil berkas pertama
        console.log('📄 Berkas yang sudah dikirim:', result.data[0]);
      }
    } catch (error) {
      console.error('Error fetching submitted berkas:', error);
    }
  };

  const previewFile = (file) => {
    if (!file) return;
    
    const fileURL = URL.createObjectURL(file);
    const fileType = file.type;
    
    if (fileType.startsWith('image/')) {
      // Preview image
      Swal.fire({
        title: file.name,
        imageUrl: fileURL,
        imageAlt: 'Preview',
        width: 600,
        confirmButtonColor: '#0f766e',
        confirmButtonText: 'Tutup',
      });
    } else if (fileType === 'application/pdf') {
      // Open PDF in new tab
      window.open(fileURL, '_blank');
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Preview Tidak Tersedia',
        text: 'File ini tidak dapat di-preview. Silakan cek file Anda sebelum upload.',
      });
    }
  };

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
  
  const placeholders = [
    "Upload surat pernyataan yang telah ditandatangani",
    "Upload rapor semester terakhir (format PDF/gambar)",
    "Upload ijazah SD/MI (bisa menyusul setelah lulus)",
    "Upload KTP kedua orang tua",
    "Upload Kartu Keluarga",
    "Upload Akta Kelahiran santri",
    "Upload pas foto 4x6 background biru",
    "Upload surat keterangan dari dokter/puskesmas",
  ];
  
  const initialFiles = Array(labels.length).fill(null);
  const [files, setFiles] = useState(initialFiles);
  const [uploadedFiles, setUploadedFiles] = useState({}); // Menyimpan File objects
  const [formData, setFormData] = useState({
    nama: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    asal_sekolah: "",
    alamat: "",
    angkatan: "",
    jenis_kelamin: "Laki-laki",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // create refs for each hidden input
  const fileInputRefs = useRef(labels.map(() => React.createRef()));

  const handleFileClick = (index) => {
    const ref = fileInputRefs.current[index];
    if (ref && ref.current) ref.current.click();
  };

  const handleFileChange = (index, e) => {
    const selected = e.target.files && e.target.files[0];
    if (selected) {
      // Update display name
      setFiles((prev) => {
        const next = [...prev];
        next[index] = selected.name;
        return next;
      });
      
      // Store actual File object
      setUploadedFiles((prev) => ({
        ...prev,
        [labels[index]]: selected
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi santri harus login
    if (!santriData || !santriData.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Data santri tidak ditemukan. Silakan login ulang.',
      });
      return;
    }

    // Validasi form
    if (!formData.nama || !formData.asal_sekolah || !formData.alamat || !formData.angkatan) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Tidak Lengkap',
        text: 'Silakan lengkapi semua field yang wajib diisi!',
      });
      return;
    }

    // Validasi file upload (minimal 1 file harus diupload)
    if (Object.keys(uploadedFiles).length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'File Belum Diupload',
        text: 'Silakan upload minimal 1 berkas pendaftaran!',
      });
      return;
    }

    // KONFIRMASI: Tampilkan daftar file yang akan dikirim
    const fileList = Object.keys(uploadedFiles)
      .map(label => `• ${label}: ${uploadedFiles[label].name}`)
      .join('\n');
    
    const confirmation = await Swal.fire({
      title: 'Konfirmasi Pengiriman Berkas',
      html: `
        <div class="text-left">
          <p class="mb-3 font-semibold">Pastikan data berikut sudah benar:</p>
          <div class="bg-gray-50 p-4 rounded mb-3">
            <p><strong>Nama:</strong> ${formData.nama}</p>
            <p><strong>Tempat Lahir:</strong> ${formData.tempat_lahir || '-'}</p>
            <p><strong>Tanggal Lahir:</strong> ${formData.tanggal_lahir || '-'}</p>
            <p><strong>Jenis Kelamin:</strong> ${formData.jenis_kelamin}</p>
            <p><strong>Asal Sekolah:</strong> ${formData.asal_sekolah}</p>
            <p><strong>Alamat:</strong> ${formData.alamat}</p>
            <p><strong>Angkatan:</strong> ${formData.angkatan}</p>
          </div>
          <p class="mb-2 font-semibold">File yang akan dikirim (${Object.keys(uploadedFiles).length}):</p>
          <div class="bg-gray-50 p-4 rounded text-sm">
            <pre class="whitespace-pre-wrap">${fileList}</pre>
          </div>
          <p class="mt-4 text-red-600 text-sm">⚠️ Pastikan semua file sudah benar. Data tidak dapat diubah setelah dikirim!</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0f766e',
      cancelButtonColor: '#dc2626',
      confirmButtonText: 'Ya, Kirim Sekarang',
      cancelButtonText: 'Cek Lagi',
      width: 600,
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Buat FormData untuk file upload
      const submitData = new FormData();
      
      // Tambahkan data santri
      submitData.append('id_santri', santriData.id);
      submitData.append('nama_lengkap', formData.nama);
      submitData.append('asal_sekolah', formData.asal_sekolah);
      submitData.append('alamat', formData.alamat);
      
      // Field opsional (bisa diisi nanti jika ada)
      submitData.append('tempat_lahir', formData.tempat_lahir || '');
      submitData.append('tanggal_lahir', formData.tanggal_lahir || '');
      submitData.append('jenis_kelamin', formData.jenis_kelamin || 'L');
      submitData.append('no_telp', formData.no_telp || '');
      submitData.append('nama_ayah', formData.nama_ayah || '');
      submitData.append('nama_ibu', formData.nama_ibu || '');
      submitData.append('pekerjaan_ayah', formData.pekerjaan_ayah || '');
      submitData.append('pekerjaan_ibu', formData.pekerjaan_ibu || '');
      submitData.append('no_telp_ortu', formData.no_telp_ortu || '');

      // Tambahkan files - Mapping labels ke field names yang diharapkan backend
      const fileMapping = {
        'Surat Pernyataan Taat Peraturan': 'surat_pernyataan',
        'Fotokopi Rapor Kelas': 'rapor',
        'Fotokopi Ijazah (Menyusul)': 'ijazah',
        'Fotokopi KTP Orang Tua': 'ktp_orang_tua',
        'Fotokopi Kartu Keluarga': 'kartu_keluarga',
        'Fotokopi Akta Kelahiran': 'akta_kelahiran',
        'Pas Foto 4x6 Latar Biru (4 Lembar)': 'foto_santri',
        'Surat Keterangan Bebas TBC & Hepatitis': 'surat_sehat'
      };

      Object.keys(uploadedFiles).forEach(label => {
        const fieldName = fileMapping[label];
        if (fieldName) {
          submitData.append(fieldName, uploadedFiles[label]);
        }
      });

      console.log('📤 Submitting berkas data...');

      // Kirim ke backend
      const result = await BerkasService.create(submitData);

      console.log('✅ Berkas berhasil dikirim:', result);

      // Tampilkan success message
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data pendaftaran berhasil dikirim. Silakan tunggu konfirmasi dari admin.',
        confirmButtonColor: '#0f766e',
      });

      // Refresh data berkas yang sudah dikirim
      await fetchSubmittedBerkas();
      
      // Tampilkan berkas yang sudah dikirim
      setShowSubmittedBerkas(true);

      // Reset form
      setFormData({
        nama: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        asal_sekolah: "",
        alamat: "",
        angkatan: pendaftaranInfo?.angkatan || "", // Keep angkatan
        jenis_kelamin: "Laki-laki",
      });
      setFiles(Array(labels.length).fill(null));
      setUploadedFiles({});
      
      // Reset file inputs
      fileInputRefs.current.forEach(ref => {
        if (ref.current) ref.current.value = '';
      });

    } catch (error) {
      console.error('❌ Error submitting berkas:', error);
      
      const errorMessage = error.response?.data?.message || 'Gagal mengirim data pendaftaran. Silakan coba lagi.';
      
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      <header className="sticky top-0 z-40 flex items-center justify-between w-full px-10 py-5 text-white shadow bg-gradient-to-r from-teal-800 to-teal-600 h-[80px]">
        <div className="flex items-center gap-3">
          <img src="/assets/logo3.png" alt="Logo" className="h-8" />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold">Halo, {santriData?.nama || "Santri"}</span>
          <img
            src={santriData?.foto || "/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png"}
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
                <h1 className="mb-2 text-2xl font-bold text-black">
                  Pendaftaran
                </h1>
                <span className="block text-gray-500">
                  Berkas {'>'} Pendaftaran
                </span>
              </div>
            </div>

            <p className="mb-6 text-gray-600">
              Silakan lengkapi data berikut sesuai persyaratan pendaftaran
              Pesantren Al Ihsan Bekasi.
            </p>

            {/* Tombol Toggle View Berkas yang Sudah Dikirim */}
            {submittedBerkas && (
              <div className="mb-6">
                <button
                  onClick={() => setShowSubmittedBerkas(!showSubmittedBerkas)}
                  className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {showSubmittedBerkas ? 'Sembunyikan' : 'Lihat'} Berkas yang Sudah Dikirim
                </button>
              </div>
            )}

            {/* View Berkas yang Sudah Dikirim */}
            {showSubmittedBerkas && submittedBerkas && (
              <div className="p-6 mb-8 bg-white border-l-4 border-blue-500 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Berkas Pendaftaran Anda</h3>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    submittedBerkas.status === 'Diterima' ? 'bg-green-100 text-green-800' :
                    submittedBerkas.status === 'Ditolak' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {submittedBerkas.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Nama Lengkap</p>
                    <p className="font-semibold">{submittedBerkas.nama_lengkap}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Angkatan</p>
                    <p className="font-semibold">{submittedBerkas.angkatan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tempat Lahir</p>
                    <p className="font-semibold">{submittedBerkas.tempat_lahir || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Lahir</p>
                    <p className="font-semibold">{submittedBerkas.tanggal_lahir || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jenis Kelamin</p>
                    <p className="font-semibold">{submittedBerkas.jenis_kelamin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Alamat</p>
                    <p className="font-semibold">{submittedBerkas.alamat || '-'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="mb-3 font-semibold text-gray-800">Dokumen yang Dikirim:</h4>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {submittedBerkas.surat_pernyataan && (
                      <a href={`http://localhost:5000/${submittedBerkas.surat_pernyataan}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm transition rounded bg-red-50 hover:bg-red-100">
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Surat Pernyataan
                      </a>
                    )}
                    {submittedBerkas.rapor && (
                      <a href={`http://localhost:5000/${submittedBerkas.rapor}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm transition rounded bg-indigo-50 hover:bg-indigo-100">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Rapor
                      </a>
                    )}
                    {submittedBerkas.ijazah && (
                      <a href={`http://localhost:5000/${submittedBerkas.ijazah}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm transition rounded bg-green-50 hover:bg-green-100">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Ijazah
                      </a>
                    )}
                    {submittedBerkas.ktp_orang_tua && (
                      <a href={`http://localhost:5000/${submittedBerkas.ktp_orang_tua}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm transition rounded bg-orange-50 hover:bg-orange-100">
                        <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        KTP Ortu
                      </a>
                    )}
                    {submittedBerkas.kartu_keluarga && (
                      <a href={`http://localhost:5000/${submittedBerkas.kartu_keluarga}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm transition rounded bg-purple-50 hover:bg-purple-100">
                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        KK
                      </a>
                    )}
                    {submittedBerkas.akta_kelahiran && (
                      <a href={`http://localhost:5000/${submittedBerkas.akta_kelahiran}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm transition rounded bg-yellow-50 hover:bg-yellow-100">
                        <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Akta
                      </a>
                    )}
                    {submittedBerkas.foto_santri && (
                      <a href={`http://localhost:5000/${submittedBerkas.foto_santri}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm transition rounded bg-blue-50 hover:bg-blue-100">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Pas Foto
                      </a>
                    )}
                    {submittedBerkas.surat_sehat && (
                      <a href={`http://localhost:5000/${submittedBerkas.surat_sehat}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm transition rounded bg-teal-50 hover:bg-teal-100">
                        <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Surat Sehat
                      </a>
                    )}
                  </div>
                </div>

                {submittedBerkas.status === 'Pending' && (
                  <div className="p-3 mt-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <p className="text-sm text-yellow-800">
                      ⏳ Berkas Anda sedang dalam proses verifikasi oleh admin. Mohon tunggu konfirmasi.
                    </p>
                  </div>
                )}
                
                {submittedBerkas.status === 'Ditolak' && (
                  <div className="p-3 mt-4 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm text-red-800">
                      ❌ Berkas Anda ditolak. Silakan hubungi admin untuk informasi lebih lanjut.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-b-2 border-teal-700 rounded-full animate-spin"></div>
              </div>
            )}

            {/* Pendaftaran Ditutup - Tampilkan Pesan */}
            {!loading && !isPendaftaranActive && (
              <div className="p-8 text-center bg-white rounded-lg shadow-md">
                <div className="mb-6">
                  <svg
                    className="w-24 h-24 mx-auto text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="mb-3 text-2xl font-bold text-gray-800">
                  Pendaftaran Ditutup
                </h2>
                <p className="mb-6 text-gray-600">
                  {pendaftaranInfo?.message || 'Saat ini tidak ada pendaftaran yang sedang dibuka. Silakan hubungi admin untuk informasi lebih lanjut.'}
                </p>
                
                <div className="p-6 mb-6 border border-blue-200 rounded-lg bg-blue-50">
                  <h3 className="mb-3 font-semibold text-gray-800">
                    Butuh Bantuan?
                  </h3>
                  <p className="mb-4 text-gray-600">
                    Hubungi admin untuk informasi jadwal pendaftaran berikutnya
                  </p>
                  <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <a
                      href="https://wa.me/6281234567890?text=Halo%20admin,%20saya%20ingin%20menanyakan%20jadwal%20pendaftaran"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white transition bg-green-600 rounded-full hover:bg-green-700"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Chat WhatsApp
                    </a>
                    <a
                      href="mailto:admin@alihsan.ac.id?subject=Informasi Pendaftaran"
                      className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white transition bg-teal-700 rounded-full hover:bg-teal-800"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Email Admin
                    </a>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  Terima kasih atas minat Anda untuk bergabung dengan Pesantren Al Ihsan Bekasi
                </p>
              </div>
            )}

            {/* Form Pendaftaran - Hanya Tampil Saat Aktif */}
            {!loading && isPendaftaranActive && (
              <>
                {/* Status Badge */}
                <div className="p-4 mb-6 border-l-4 border-green-500 rounded-lg bg-green-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Pendaftaran Sedang Dibuka untuk <strong>Angkatan {pendaftaranInfo?.angkatan}</strong>
                      </p>
                      <p className="mt-1 text-xs text-green-700">
                        {submittedBerkas 
                          ? 'Anda sudah mengirim berkas pendaftaran' 
                          : 'Silakan lengkapi formulir pendaftaran di bawah ini'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pesan jika sudah submit berkas */}
                {submittedBerkas && (
                  <div className="p-4 mb-6 border-l-4 border-blue-500 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-800">
                      ℹ️ Anda sudah mengirimkan berkas pendaftaran untuk <strong>Angkatan {submittedBerkas.angkatan}</strong>. 
                      Silakan klik tombol "Lihat Berkas yang Sudah Dikirim" di atas untuk melihat detail.
                    </p>
                  </div>
                )}

                {/* Form hanya tampil jika belum submit */}
                {!submittedBerkas && (
                <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Nama
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  placeholder="Masukkan Nama Lengkap..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    name="tempat_lahir"
                    value={formData.tempat_lahir || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                    placeholder="Contoh: Jakarta"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    name="tanggal_lahir"
                    value={formData.tanggal_lahir || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Asal Sekolah Dasar/Madrasah Ibtidaiyah
                </label>
                <input
                  type="text"
                  name="asal_sekolah"
                  value={formData.asal_sekolah}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  placeholder="Masukkan Asal Sekolah..."
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Alamat
                </label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  placeholder="Masukkan Alamat Lengkap..."
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <select
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin || 'Laki-laki'}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  required
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Angkatan
                  <span className="ml-2 text-xs text-green-600">(Otomatis terisi)</span>
                </label>
                <input
                  type="text"
                  name="angkatan"
                  value={formData.angkatan}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                  placeholder="Angkatan akan terisi otomatis..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {labels.map((label, idx) => (
                  <div key={label}>
                    <div className="mb-2 text-sm font-medium text-gray-700">{label}</div>
                    <div className="p-3 bg-white border border-gray-300 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => handleFileClick(idx)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition bg-teal-600 rounded-lg hover:bg-teal-700"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload
                        </button>
                        
                        {uploadedFiles[label] && (
                          <button
                            type="button"
                            onClick={() => previewFile(uploadedFiles[label])}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Lihat
                          </button>
                        )}
                      </div>
                      
                      <div className="text-xs italic text-gray-500">
                        {files[idx] ? (
                          <span className="font-medium text-green-600">✓ {files[idx]}</span>
                        ) : (
                          <span>{placeholders[idx]}</span>
                        )}
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
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-full font-semibold transition ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-teal-700 hover:bg-teal-800'
                  } text-white flex items-center gap-2`}
                >
                  {isSubmitting && (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {isSubmitting ? 'Mengirim...' : 'Konfirmasi'}
                </button>
              </div>
            </form>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
