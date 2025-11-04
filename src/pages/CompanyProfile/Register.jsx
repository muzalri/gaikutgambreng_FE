import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import PromosiService from "../../services/PromosiService";
import Swal from "sweetalert2";

export default function Register() {
  const [open, setOpen] = useState([false, false, false]);
  const toggle = (idx) => setOpen((o) => o.map((v, i) => (i === idx ? !v : v)));
  // FAQ state (separate from info accordion)
  const [faqOpen, setFaqOpen] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const toggleFaq = (i) =>
    setFaqOpen((s) => s.map((v, idx) => (idx === i ? !v : v)));

  // State untuk brosur
  const [brosur, setBrosur] = useState(null);
  const [brosurLoading, setBrosurLoading] = useState(true);

  // State untuk banner
  const [banner, setBanner] = useState(null);
  const [bannerLoading, setBannerLoading] = useState(true);

  // Fetch brosur dan banner saat component mount
  useEffect(() => {
    const fetchBrosur = async () => {
      try {
        setBrosurLoading(true);
        const response = await PromosiService.getBrosur();
        if (response.success && response.data) {
          setBrosur(response.data);
        }
      } catch (error) {
        console.log('Brosur belum tersedia');
        setBrosur(null);
      } finally {
        setBrosurLoading(false);
      }
    };

    const fetchBanner = async () => {
      try {
        setBannerLoading(true);
        const response = await PromosiService.getBanner();
        if (response.success && response.data) {
          setBanner(response.data);
          console.log('✅ Banner loaded:', response.data);
          console.log('📸 Banner URL:', `http://localhost:5000/uploads/promosi/${encodeURIComponent(response.data.gambar)}`);
        }
      } catch (error) {
        console.log('Banner belum tersedia, menggunakan default');
        setBanner(null);
      } finally {
        setBannerLoading(false);
      }
    };

    fetchBrosur();
    fetchBanner();
  }, []);

  // Handler untuk download brosur
  const handleDownloadBrosur = async () => {
    if (!brosur) {
      Swal.fire({
        icon: 'info',
        title: 'Brosur Belum Tersedia',
        text: 'Brosur sedang dalam proses pembuatan. Silakan coba lagi nanti.',
      });
      return;
    }

    try {
      const brosurUrl = `http://localhost:5000/uploads/promosi/${brosur.gambar}`;
      
      // Fetch the file as blob
      const response = await fetch(brosurUrl);
      const blob = await response.blob();
      
      // Create download link
      const link = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      link.href = objectUrl;
      link.download = `Brosur_Pesantren_AlIhsan_${new Date().getFullYear()}.jpg`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Brosur berhasil diunduh',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error downloading brosur:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal mengunduh brosur. Silakan coba lagi.',
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#fff]">
      {/* Background pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "url(/assets/hero/pattern.png) center/cover no-repeat",
          opacity: 0.13,
        }}
      />
      {/* Custom header: hanya logo kiri dan tombol kanan, tanpa menu navigasi */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between w-full px-6 py-3 shadow-sm"
        style={{
          background: "linear-gradient(90deg, #176d5c 0%, #1e8c7a 100%)",
        }}
      >
        <img
          src="/assets/logo3.png"
          alt="logo"
          className="object-contain w-auto h-12"
        />
        <a href="/loginpengguna">
          <button className="px-6 py-2 text-base font-semibold text-teal-900 transition bg-white rounded-full shadow hover:bg-teal-50">
            Daftar Sekarang
          </button>
        </a>
      </header>

      {/* Hero section full width - Dynamic banner */}
      <div className="w-full relative h-[300px] sm:h-[500px] overflow-hidden">
        {/* Background image menggunakan img tag untuk handle encoding lebih baik */}
        {banner ? (
          <img
            src={`http://localhost:5000/uploads/promosi/${encodeURIComponent(banner.gambar)}`}
            alt="Banner Pesantren Al Ihsan"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              console.error('❌ Error loading banner image');
              e.target.src = '/assets/FotoPesantren.png';
            }}
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url(/assets/FotoPesantren.png)" }}
          />
        )}
        
        {/* <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-center px-6 sm:px-16">
          <h1 className="max-w-2xl mb-3 text-3xl font-extrabold text-white sm:text-4xl drop-shadow-lg">
            Penerimaan <span className="text-amber-400">Santri</span> Baru
            <br />
            Tahun Ajaran 2025
          </h1>
          <p className="max-w-xl text-base text-white sm:text-lg drop-shadow">
            Bergabunglah dengan Pesantren Al Ihsan Bekasi dan wujudkan
            pendidikan yang berkualitas, berakhlak mulia, dan berbasis keilmuan.
          </p>
        </div> */}
        
        {/* Loading indicator saat fetch banner */}
        {bannerLoading && (
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full z-10">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-white font-medium">Memuat banner...</span>
            </div>
          </div>
        )}
      </div>
      {/* Info brosur section */}
      <section className="z-10 flex flex-col items-center w-full max-w-3xl gap-6 px-4 mx-auto mt-10 sm:px-0 sm:flex-row">
        {brosurLoading ? (
          <div className="w-[220px] h-[180px] flex items-center justify-center bg-slate-100 rounded-lg shadow-lg border-2 border-slate-200 animate-pulse">
            <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-teal-600"></div>
          </div>
        ) : brosur ? (
          <img
            src={`http://localhost:5000/uploads/promosi/${brosur.gambar}`}
            alt="Brosur Pesantren Al Ihsan"
            className="w-[220px] h-[180px] object-cover rounded-lg shadow-lg border-2 border-amber-300 cursor-pointer hover:scale-105 transition-transform"
            onClick={handleDownloadBrosur}
          />
        ) : (
          <div className="w-[220px] h-[180px] flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg shadow-lg border-2 border-slate-300">
            <div className="text-center p-4">
              <p className="text-sm text-slate-500 font-medium">📄 Brosur</p>
              <p className="text-xs text-slate-400 mt-1">Segera tersedia</p>
            </div>
          </div>
        )}
        <div className="flex-1">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            Kenapa Memilih <span className="text-amber-500">Al-Ihsan ?</span>
          </h2>
          <h3 className="mb-1 text-lg font-bold text-slate-900">
            Ingin tahu lebih lengkap tentang{" "}
            <span className="text-amber-500">Pesantren Al Ihsan Bekasi?</span>
          </h3>
          <p className="mb-3 text-base text-slate-700">
            Dapatkan informasi detail mengenai program pendidikan, fasilitas,
            syarat pendaftaran, serta jadwal kegiatan dalam brosur resmi kami.
            Brosur ini disusun agar calon santri dan wali santri lebih mudah
            memahami visi, misi, serta layanan yang tersedia di pesantren.
          </p>
          <button 
            onClick={handleDownloadBrosur}
            disabled={!brosur || brosurLoading}
            className="px-6 py-2 text-base font-semibold text-white transition bg-teal-700 rounded-full shadow hover:bg-teal-800 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {brosurLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Memuat...
              </span>
            ) : brosur ? (
              '📥 Unduh Brosur'
            ) : (
              'Brosur Belum Tersedia'
            )}
          </button>
        </div>
      </section>

      {/* Timeline section */}
      <section className="w-full max-w-6xl px-4 mx-auto mt-16">
        <h3 className="mb-12 text-3xl font-bold text-center text-slate-900">
          Timeline <span className="text-amber-500">Pendaftaran</span>
        </h3>

        {/* Timeline Container dengan background terang */}
        <div className="relative bg-gradient-to-r from-slate-50 to-orange-50 rounded-2xl p-12 shadow-lg">
          {/* Garis horizontal oranye */}
          <div className="absolute left-12 right-12 top-1/2 h-1 bg-amber-500 rounded-full transform -translate-y-1/2" />

          {/* Timeline steps */}
          <div className="relative flex justify-between">
            {[
              {
                title: "Seleksi",
                bold: "Administrasi",
                position: "above",
              },
              {
                title: "Tes",
                bold: "Psikologi",
                position: "below",
              },
              {
                title: "Tes Baca",
                bold: "Al-Quran",
                position: "above",
              },
              {
                title: "Wawancara",
                bold: "Casantri",
                position: "below",
              },
              {
                title: "Karantina",
                bold: "Casantri",
                position: "above",
              },
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col items-center z-10">
                {/* Label atas atau bawah */}
                {step.position === "above" && (
                  <div className="mb-4 text-center">
                    <span className="text-sm text-slate-800">
                      {step.title}{" "}
                      <span className="font-bold text-slate-900">
                        {step.bold}
                      </span>
                    </span>
                  </div>
                )}

                {/* Titik oranye bulat */}
                <div className="w-4 h-4 bg-amber-500 rounded-full shadow-md" />

                {/* Label bawah */}
                {step.position === "below" && (
                  <div className="mt-4 text-center">
                    <span className="text-sm text-slate-800">
                      {step.title}{" "}
                      <span className="font-bold text-slate-900">
                        {step.bold}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Accordion Info section */}
      <section className="w-full max-w-4xl px-4 mx-auto mt-16">
        <h3 className="mb-8 text-2xl font-bold text-center text-slate-900">
          Informasi <span className="text-amber-500">Pendaftaran</span>
        </h3>
        <div className="flex flex-col gap-4">
          {[
            "Syarat Pendaftaran",
            "Fasilitas Pesantren",
            "Program Unggulan",
          ].map((title, idx) => (
            <div
              key={title}
              className={`bg-white border shadow-sm rounded-xl border-slate-200 ${
                open[idx] ? "ring-2 ring-amber-300" : ""
              }`}
            >
              <div
                className={`flex items-center justify-between px-6 py-4 transition-all cursor-pointer hover:border-amber-400 ${
                  open[idx]
                    ? "rounded-t-xl"
                    : "rounded-xl hover:ring-2 hover:ring-amber-300"
                }`}
                onClick={() => toggle(idx)}
              >
                <span className="text-base font-semibold text-slate-800">
                  {title}
                </span>
                <span className="text-2xl font-bold text-amber-500">
                  {open[idx] ? "−" : "+"}
                </span>
              </div>

              {/* Inline expandable panel */}
              {open[idx] && (
                <div className="px-6 pt-0 pb-6 rounded-b-xl">
                  {idx === 0 && (
                    <ol className="pt-4 pl-5 text-sm list-decimal text-slate-700">
                      <li>Muslim</li>
                      <li>
                        Lulus SD/MI/Paket A Tahun 2026 atau Tahun Ajaran
                        2025/2026
                      </li>
                      <li>
                        Bersedia Menandatangani Surat Pernyataan Taat Peraturan
                        dan Kebijakan Pesantren
                      </li>
                      <li>Fotokopi Rapor Kelas 5 (Fotokopi ijazah menyusul)</li>
                      <li>Fotokopi KTP Orang Tua</li>
                      <li>Fotokopi KK (Kartu Keluarga)</li>
                      <li>Fotokopi Akta Kelahiran</li>
                      <li>Pas Foto 4x6 latar belakang biru (4 lembar)</li>
                      <li>
                        Surat Keterangan Bebas TBC dan Hepatitis (Cek Lab)
                      </li>
                    </ol>
                  )}

                  {idx === 1 && (
                    <ul className="pt-4 pl-5 text-sm list-disc text-slate-700">
                      <li>Bebas biaya pendaftaran dan uang gedung</li>
                      <li>Bebas SPP bulanan (Pendidikan dan makan)</li>
                      <li>Seragam</li>
                      <li>Asrama (Tempat tidur, kasur, lemari)</li>
                      <li>Kelas</li>
                      <li>Masjid</li>
                      <li>Ruang komputer</li>
                      <li>Perpustakaan</li>
                      <li>Ijazah Setara SMP</li>
                    </ul>
                  )}

                  {idx === 2 && (
                    <ol className="pt-4 pl-5 text-sm list-decimal text-slate-700">
                      <li>Beraqidah benar dan Berakhlak Baik</li>
                      <li>
                        Mempelajari Ilmu Syar'i dengan pemahaman salaful ummah
                      </li>
                      <li>Tahsin dan Tahfidz Al Quran 30 Juz</li>
                      <li>Hafal Mutun Ilmiyyah</li>
                      <li>Bahasa Arab Dasar Lisan dan Tulisan</li>
                      <li>Life Skill</li>
                    </ol>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ section */}
      <section className="w-full max-w-4xl px-4 mx-auto mt-12">
        <h3 className="mb-8 text-2xl font-bold text-center text-slate-900">
          FAQ <span className="text-amber-500">Penerimaan</span>
        </h3>
        <div className="flex flex-col gap-4">
          {[
            {
              q: "Apakah membuka pendaftaran jenjang SMA?",
              a: "Pesantren hanya membuka pendaftaran penerimaan peserta didik baru untuk jenjang SMP.",
            },
            {
              q: "Berapa biaya pendaftaran dan pendidikan pesantren?",
              a: "Beasiswa penuh, hanya menerima 10 anak dan tidak ada program berbayar.",
            },
            {
              q: "Pesantren khusus putra dan putri?",
              a: "Pesantren khusus putra saja.",
            },
            {
              q: "Ijazah negara yang didapat?",
              a: "Ijazah yang akan didapat oleh peserta didik nanti adalah PKBM Paket B.",
            },
            {
              q: "Apa saja pelajaran yang ada di pesantren?",
              a: "Tahfidz dan pelajaran agama/diniyyah (Aqidah, Fiqih, Siroh, Adab, Bahasa Arab, Nahwu, Shorof, Tajwid dan Mutun Imiyyah). Tidak ada materi pelajaran umum.",
            },
            {
              q: "Apakah ada target hafalan/tahfidz Al Quran?",
              a: "Ada, menyesuaikan kemampuan peserta didik.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`bg-white border shadow-sm rounded-xl border-slate-200 ${
                faqOpen[i] ? "ring-2 ring-amber-300" : ""
              }`}
            >
              <div
                className={`flex items-center justify-between px-6 py-4 transition-all cursor-pointer hover:border-amber-400 ${
                  faqOpen[i]
                    ? "rounded-t-xl"
                    : "rounded-xl hover:ring-2 hover:ring-amber-300"
                }`}
                onClick={() => toggleFaq(i)}
              >
                <span className="text-base font-semibold text-slate-800">
                  {item.q}
                </span>
                <span className="text-2xl font-bold text-amber-500">
                  {faqOpen[i] ? "−" : "+"}
                </span>
              </div>

              {faqOpen[i] && (
                <div className="px-6 pt-0 pb-6 rounded-b-xl">
                  <p className="pt-4 text-sm text-slate-700">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="mt-24" />
    </div>
  );
}
