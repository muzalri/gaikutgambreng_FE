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
    
    console.log('='.repeat(50));
    console.log('🔍 DEBUGGING FOTO SANTRI');
    console.log('='.repeat(50));
    
    if (data) {
      const parsedData = JSON.parse(data);
      console.log('📸 Santri Data from localStorage:', parsedData);
      console.log('📸 Foto URL:', parsedData?.foto);
      console.log('📸 Is HTTP URL?', parsedData?.foto?.startsWith('http'));
      
      // Log final URL yang akan digunakan
      const finalUrl = parsedData?.foto 
        ? (parsedData.foto.startsWith('http') 
            ? parsedData.foto 
            : `http://localhost:5000/${parsedData.foto}`)
        : "/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png";
      
      console.log('📸 Final URL untuk foto:', finalUrl);
      console.log('='.repeat(50));
      
      setSantriData(parsedData);
    } else {
      console.log('❌ No santriData in localStorage!');
      console.log('='.repeat(50));
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
    "Kartu Keluarga",
    "Akta Kelahiran",
    "Rapor Kelas 5",
    "Surat Kematian Orang Tua (Yatim)",
    "Pas Foto 4x6 Latar Biru",
    "Sertifikat Hafalan (Jika Ada)",
    "Sertifikat Penghargaan (Jika Ada)",
    "Rekaman VN Surat Yunus 71-78",
  ];
  
  const placeholders = [
    "Upload Kartu Keluarga (PDF/gambar)",
    "Upload Akta Kelahiran calon santri (PDF/gambar)",
    "Upload Rapor Kelas 5 (PDF/gambar)",
    "Upload Surat Kematian jika Yatim/Piatu (PDF/gambar)",
    "Upload Pas foto 4x6 latar belakang biru (gambar)",
    "Upload Sertifikat Hafalan jika ada (PDF/gambar)",
    "Upload Sertifikat Penghargaan jika ada (PDF/gambar)",
    "Upload rekaman bacaan Surat Yunus 71-78 (audio: mp3, wav, m4a)",
  ];
  
  const initialFiles = Array(labels.length).fill(null);
  const [files, setFiles] = useState(initialFiles);
  const [uploadedFiles, setUploadedFiles] = useState({}); // Menyimpan File objects
  const [formData, setFormData] = useState({
    nama: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    asal_sekolah: "",
    hafalan_quran: "",
    alamat: "",
    no_telp: "",
    angkatan: "",
    jenis_kelamin: "Laki-laki",
    nama_ayah: "",
    pekerjaan_ayah: "",
    penghasilan_ayah: "",
    nama_ibu: "",
    pekerjaan_ibu: "",
    penghasilan_ibu: "",
    status_anak: "Orangtua Lengkap",
    jumlah_tanggungan: "",
    status_kepemilikan_rumah: "",
    luas_tanah_bangunan: "",
    kepemilikan_kendaraan: "",
    kesediaan_sekolah_ortu: "Bersedia",
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

    // Validasi semua field data wajib diisi
    const requiredFields = [
      { field: formData.nama, label: 'Nama Lengkap' },
      { field: formData.asal_sekolah, label: 'Asal Sekolah' },
      { field: formData.hafalan_quran, label: 'Hafalan Al-Qur\'an' },
      { field: formData.alamat, label: 'Alamat' },
      { field: formData.no_telp, label: 'Nomor WhatsApp' },
      { field: formData.angkatan, label: 'Angkatan' },
      { field: formData.nama_ayah, label: 'Nama Ayah' },
      { field: formData.pekerjaan_ayah, label: 'Pekerjaan Ayah' },
      { field: formData.penghasilan_ayah, label: 'Penghasilan Ayah' },
      { field: formData.nama_ibu, label: 'Nama Ibu' },
      { field: formData.penghasilan_ibu, label: 'Penghasilan Ibu' },
      { field: formData.status_anak, label: 'Status Anak' },
      { field: formData.jumlah_tanggungan, label: 'Jumlah Tanggungan' },
      { field: formData.status_kepemilikan_rumah, label: 'Status Kepemilikan Rumah' },
      { field: formData.luas_tanah_bangunan, label: 'Luas Tanah dan Bangunan' },
      { field: formData.kepemilikan_kendaraan, label: 'Kepemilikan Kendaraan' },
      { field: formData.kesediaan_sekolah_ortu, label: 'Kesediaan Sekolah Orangtua' },
    ];

    const emptyFields = requiredFields.filter(item => !item.field || item.field.trim() === '');
    
    if (emptyFields.length > 0) {
      const fieldList = emptyFields.map(item => `• ${item.label}`).join('\n');
      Swal.fire({
        icon: 'warning',
        title: 'Data Tidak Lengkap',
        html: `<div class="text-left"><p class="mb-2">Field berikut wajib diisi:</p><pre class="text-sm">${fieldList}</pre></div>`,
        confirmButtonColor: '#dc2626',
      });
      return;
    }

    // Validasi file upload wajib (kecuali Surat Kematian, Sertifikat Hafalan, dan Sertifikat Penghargaan)
    const requiredFiles = [
      'Kartu Keluarga',
      'Akta Kelahiran',
      'Rapor Kelas 5',
      'Pas Foto 4x6 Latar Biru',
      'Rekaman VN Surat Yunus 71-78',
    ];

    const missingFiles = requiredFiles.filter(label => !uploadedFiles[label]);
    
    if (missingFiles.length > 0) {
      const fileList = missingFiles.map(label => `• ${label}`).join('\n');
      Swal.fire({
        icon: 'warning',
        title: 'Berkas Belum Lengkap',
        html: `<div class="text-left"><p class="mb-2">Berkas berikut wajib diupload:</p><pre class="text-sm">${fileList}</pre><p class="mt-3 text-xs text-gray-600">Catatan: Surat Kematian (untuk Yatim), Sertifikat Hafalan, dan Sertifikat Penghargaan bersifat opsional.</p></div>`,
        confirmButtonColor: '#dc2626',
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
      submitData.append('angkatan', formData.angkatan);
      
      // Data pribadi
      submitData.append('tempat_lahir', formData.tempat_lahir || '');
      submitData.append('tanggal_lahir', formData.tanggal_lahir || '');
      submitData.append('jenis_kelamin', formData.jenis_kelamin || 'Laki-laki');
      submitData.append('hafalan_quran', formData.hafalan_quran || '');
      submitData.append('no_telp', formData.no_telp || '');
      
      // Data orang tua
      submitData.append('nama_ayah', formData.nama_ayah || '');
      submitData.append('pekerjaan_ayah', formData.pekerjaan_ayah || '');
      submitData.append('penghasilan_ayah', formData.penghasilan_ayah || '');
      submitData.append('nama_ibu', formData.nama_ibu || '');
      submitData.append('pekerjaan_ibu', formData.pekerjaan_ibu || '');
      submitData.append('penghasilan_ibu', formData.penghasilan_ibu || '');
      submitData.append('no_telp_ortu', formData.no_telp_ortu || '');
      
      // Data keluarga dan ekonomi
      submitData.append('status_anak', formData.status_anak || 'Orangtua Lengkap');
      submitData.append('jumlah_tanggungan', formData.jumlah_tanggungan || '');
      submitData.append('status_kepemilikan_rumah', formData.status_kepemilikan_rumah || '');
      submitData.append('luas_tanah_bangunan', formData.luas_tanah_bangunan || '');
      submitData.append('kepemilikan_kendaraan', formData.kepemilikan_kendaraan || '');
      submitData.append('kesediaan_sekolah_ortu', formData.kesediaan_sekolah_ortu || 'Bersedia');

      // Tambahkan files - Mapping labels ke field names yang diharapkan backend
      const fileMapping = {
        'Kartu Keluarga': 'kartu_keluarga',
        'Akta Kelahiran': 'akta_kelahiran',
        'Rapor Kelas 5': 'rapor',
        'Surat Kematian Orang Tua (Yatim)': 'surat_kematian',
        'Pas Foto 4x6 Latar Biru': 'foto_santri',
        'Sertifikat Hafalan (Jika Ada)': 'sertifikat_hafalan',
        'Sertifikat Penghargaan (Jika Ada)': 'sertifikat_penghargaan',
        'Rekaman VN Surat Yunus 71-78': 'voice_note'
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
        hafalan_quran: "",
        alamat: "",
        no_telp: "",
        angkatan: pendaftaranInfo?.angkatan || "", // Keep angkatan
        jenis_kelamin: "Laki-laki",
        nama_ayah: "",
        pekerjaan_ayah: "",
        penghasilan_ayah: "",
        nama_ibu: "",
        pekerjaan_ibu: "",
        penghasilan_ibu: "",
        status_anak: "Orangtua Lengkap",
        jumlah_tanggungan: "",
        status_kepemilikan_rumah: "",
        luas_tanah_bangunan: "",
        kepemilikan_kendaraan: "",
        kesediaan_sekolah_ortu: "Bersedia",
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
            src={
              santriData?.foto 
                ? (santriData.foto.startsWith('http') 
                    ? santriData.foto 
                    : `http://localhost:5000/${santriData.foto}`)
                : "/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png"
            }
            alt="Profile"
            className="object-cover w-8 h-8 border-2 border-white rounded-full"
            onError={(e) => {
              e.target.src = "/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png";
            }}
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
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">📋 Berkas Pendaftaran Anda</h3>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    submittedBerkas.status === 'Diterima' ? 'bg-green-100 text-green-800' :
                    submittedBerkas.status === 'Ditolak' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {submittedBerkas.status}
                  </span>
                </div>

                {/* DATA PRIBADI */}
                <div className="mb-6">
                  <h4 className="flex items-center gap-2 mb-4 text-lg font-bold text-teal-700">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Data Pribadi Santri
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs text-gray-500">Nama Lengkap</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.nama_lengkap}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tempat Lahir</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.tempat_lahir || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tanggal Lahir</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.tanggal_lahir || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Jenis Kelamin</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.jenis_kelamin}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Asal Sekolah</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.asal_sekolah || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Hafalan Al-Qur'an</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.hafalan_quran || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">No. WhatsApp</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.no_telp || '-'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500">Alamat</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.alamat || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Angkatan</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.angkatan}</p>
                    </div>
                  </div>
                </div>

                {/* DATA ORANG TUA */}
                <div className="pt-6 mb-6 border-t">
                  <h4 className="flex items-center gap-2 mb-4 text-lg font-bold text-teal-700">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Data Orang Tua
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs text-gray-500">Nama Ayah</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.nama_ayah || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pekerjaan Ayah</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.pekerjaan_ayah || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Penghasilan Ayah</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.penghasilan_ayah || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Nama Ibu</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.nama_ibu || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pekerjaan Ibu</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.pekerjaan_ibu || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Penghasilan Ibu</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.penghasilan_ibu || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* DATA KELUARGA */}
                <div className="pt-6 mb-6 border-t">
                  <h4 className="flex items-center gap-2 mb-4 text-lg font-bold text-teal-700">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Data Keluarga & Ekonomi
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs text-gray-500">Status Anak</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.status_anak || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Jumlah Tanggungan</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.jumlah_tanggungan || '-'} orang</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status Kepemilikan Rumah</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.status_kepemilikan_rumah || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Luas Tanah & Bangunan</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.luas_tanah_bangunan || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Kepemilikan Kendaraan</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.kepemilikan_kendaraan || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Kesediaan Sekolah Orangtua</p>
                      <p className="font-semibold text-gray-800">{submittedBerkas.kesediaan_sekolah_ortu || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* DOKUMEN YANG DIKIRIM */}
                <div className="pt-6 border-t">
                  <h4 className="flex items-center gap-2 mb-4 text-lg font-bold text-teal-700">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Dokumen yang Dikirim
                  </h4>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {submittedBerkas.kartu_keluarga && (
                      <a href={`http://localhost:5000/${submittedBerkas.kartu_keluarga}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 transition rounded-lg bg-purple-50 hover:bg-purple-100 hover:shadow">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Kartu Keluarga
                      </a>
                    )}
                    {submittedBerkas.akta_kelahiran && (
                      <a href={`http://localhost:5000/${submittedBerkas.akta_kelahiran}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-yellow-700 transition rounded-lg bg-yellow-50 hover:bg-yellow-100 hover:shadow">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Akta Kelahiran
                      </a>
                    )}
                    {submittedBerkas.rapor && (
                      <a href={`http://localhost:5000/${submittedBerkas.rapor}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-700 transition rounded-lg bg-indigo-50 hover:bg-indigo-100 hover:shadow">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Rapor Kelas 5
                      </a>
                    )}
                    {submittedBerkas.surat_kematian && (
                      <a href={`http://localhost:5000/${submittedBerkas.surat_kematian}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition rounded-lg bg-gray-50 hover:bg-gray-100 hover:shadow">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Surat Kematian
                      </a>
                    )}
                    {submittedBerkas.foto_santri && (
                      <a href={`http://localhost:5000/${submittedBerkas.foto_santri}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 transition rounded-lg bg-blue-50 hover:bg-blue-100 hover:shadow">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Pas Foto 4x6
                      </a>
                    )}
                    {submittedBerkas.sertifikat_hafalan && (
                      <a href={`http://localhost:5000/${submittedBerkas.sertifikat_hafalan}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 transition rounded-lg bg-green-50 hover:bg-green-100 hover:shadow">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        Sertifikat Hafalan
                      </a>
                    )}
                    {submittedBerkas.sertifikat_penghargaan && (
                      <a href={`http://localhost:5000/${submittedBerkas.sertifikat_penghargaan}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-pink-700 transition rounded-lg bg-pink-50 hover:bg-pink-100 hover:shadow">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                        Sertifikat Penghargaan
                      </a>
                    )}
                    {submittedBerkas.voice_note && (
                      <a href={`http://localhost:5000/${submittedBerkas.voice_note}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-teal-700 transition rounded-lg bg-teal-50 hover:bg-teal-100 hover:shadow">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        Rekaman VN Quran
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
                  Asal Sekolah Dasar/Madrasah Ibtidaiyah <span className="text-red-500">*</span>
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
                  Hafalan Al-Qur'an Yang Dimiliki <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="hafalan_quran"
                  value={formData.hafalan_quran}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  placeholder="Contoh: 1 Juz dan Juz 30 lengkap"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">* Jawaban dengan jumlah juz dan surat!</p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  placeholder="Masukkan Alamat Lengkap..."
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="no_telp"
                  value={formData.no_telp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  placeholder="Contoh: 085774786881"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">* Tidak boleh dengan (+62), (-) dan spasi, cukup satu nomor</p>
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

              {/* DATA ORANG TUA */}
              <div className="pt-6 mt-6 border-t-2 border-gray-200">
                <h3 className="mb-4 text-lg font-bold text-gray-800">Data Orang Tua</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Nama Ayah <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_ayah"
                    value={formData.nama_ayah}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                    placeholder="Nama lengkap ayah"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Pekerjaan Ayah <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pekerjaan_ayah"
                    value={formData.pekerjaan_ayah}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                    placeholder="Contoh: Wiraswasta, PNS, dll"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Penghasilan Ayah Per Bulan Rata-rata <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="penghasilan_ayah"
                  value={formData.penghasilan_ayah}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  placeholder="Contoh: Rp 5.000.000"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Nama Ibu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_ibu"
                    value={formData.nama_ibu}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                    placeholder="Nama lengkap ibu"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Pekerjaan Ibu
                  </label>
                  <input
                    type="text"
                    name="pekerjaan_ibu"
                    value={formData.pekerjaan_ibu}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                    placeholder="Contoh: Ibu Rumah Tangga, Guru, dll"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Penghasilan Ibu Per Bulan Rata-rata <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="penghasilan_ibu"
                  value={formData.penghasilan_ibu}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  placeholder="Contoh: Rp 3.000.000 atau Rp 0 jika tidak bekerja"
                  required
                />
              </div>

              {/* DATA KELUARGA */}
              <div className="pt-6 mt-6 border-t-2 border-gray-200">
                <h3 className="mb-4 text-lg font-bold text-gray-800">Data Keluarga</h3>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Status Anak <span className="text-red-500">*</span>
                </label>
                <select
                  name="status_anak"
                  value={formData.status_anak}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  required
                >
                  <option value="Orangtua Lengkap">Orangtua Lengkap</option>
                  <option value="Yatim/Piatu">Yatim/Piatu (Melampirkan Surat Kematian)</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Jumlah Tanggungan (Istri dan Anak) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="jumlah_tanggungan"
                  value={formData.jumlah_tanggungan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  placeholder="Contoh: 4"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Status Kepemilikan Rumah (Milik/Kontrak/Menumpang) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="status_kepemilikan_rumah"
                  value={formData.status_kepemilikan_rumah}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  placeholder="Contoh: Milik Sendiri, Kontrak, atau Menumpang"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Luas Tanah Dan Bangunan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="luas_tanah_bangunan"
                  value={formData.luas_tanah_bangunan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  placeholder="Contoh: Milik Sendiri LT 100 / LB 70"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Kepemilikan Kendaraan Bermotor Roda Empat (Merk, Type, Dan Tahun) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="kepemilikan_kendaraan"
                  value={formData.kepemilikan_kendaraan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  placeholder="Contoh: Toyota Avanza 2010 atau Tidak Ada"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Bersedia Mengikuti Sekolah Orangtua Dua Bulan Sekali (Kajian Rutin) <span className="text-red-500">*</span>
                </label>
                <select
                  name="kesediaan_sekolah_ortu"
                  value={formData.kesediaan_sekolah_ortu}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  required
                >
                  <option value="Bersedia">Bersedia</option>
                  <option value="Tidak">Tidak</option>
                </select>
              </div>

              {/* UPLOAD BERKAS */}
              <div className="pt-6 mt-6 border-t-2 border-gray-200">
                <h3 className="mb-2 text-lg font-bold text-gray-800">Upload Berkas (Foto/Scan Terbaca dengan Jelas)</h3>
                <div className="p-4 mb-4 border border-blue-200 rounded-lg bg-blue-50">
                  <p className="text-sm text-blue-800">
                    <strong>Dokumen yang wajib diupload:</strong><br/>
                    1. Kartu Keluarga<br/>
                    2. Akta Kelahiran<br/>
                    3. Rapor Kelas 5<br/>
                    4. Surat Kematian Orang Tua bagi Yatim<br/>
                    5. Pas Foto 4x6 latar belakang biru
                  </p>
                  <p className="mt-2 text-xs text-blue-700">
                    * Dokumen ijazah dan Surat Keterangan Bebas TBC & Hepatitis bisa menyusul saat calon santri dinyatakan diterima.
                  </p>
                </div>
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
