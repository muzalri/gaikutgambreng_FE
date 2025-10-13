import React, { useState } from "react";
import Footer from "../../components/Footer";

export default function Register() {
  const [open, setOpen] = useState([false, false, false]);
  const toggle = (idx) => setOpen((o) => o.map((v, i) => (i === idx ? !v : v)));
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

      {/* Hero section full width */}
      <div
        className="w-full relative h-[260px] sm:h-[340px] bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/FotoPesantren.png)" }}
      >
        <div className="absolute inset-0 bg-black/40" />
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
        </div>
      </div>
      {/* Info brosur section */}
      <section className="z-10 flex flex-col items-center w-full max-w-3xl gap-6 px-4 mx-auto mt-10 sm:px-0 sm:flex-row">
        <img
          src="/assets/achievements/brosur.png"
          alt="brosur"
          className="w-[220px] h-[180px] object-contain rounded-lg shadow-lg border-2 border-amber-300"
        />
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
          <button className="px-6 py-2 text-base font-semibold text-white transition bg-teal-700 rounded-full shadow hover:bg-teal-800">
            Unduh Brosur
          </button>
        </div>
      </section>

      {/* Timeline section */}
      <section className="w-full max-w-4xl px-4 mx-auto mt-16">
        <h3 className="mb-8 text-2xl font-bold text-center text-slate-900">
          Timeline <span className="text-amber-500">Pendaftaran</span>
        </h3>
        <div
          className="relative flex flex-row items-end justify-between w-full"
          style={{ minHeight: "120px" }}
        >
          {/* Garis horizontal oranye */}
          <div
            className="absolute left-0 right-0 z-0 h-2 rounded-full top-1/2 bg-gradient-to-r from-amber-400 to-amber-300"
            style={{ transform: "translateY(-50%)" }}
          />
          {/* Step/titik dan label */}
          {[
            {
              atas: (
                <span className="block text-sm text-slate-800">
                  Seleksi <b>Administrasi</b>
                </span>
              ),
              bawah: (
                <span className="block mt-2 text-sm font-bold text-slate-900">
                  Tes <span className="text-amber-500">Psikologi</span>
                </span>
              ),
            },
            {
              atas: (
                <span className="block text-sm text-slate-800">
                  Tes Baca <b>Al-Quran</b>
                </span>
              ),
              bawah: (
                <span className="block mt-2 text-sm font-bold text-slate-900">
                  Wawancara <b className="text-amber-500">Casantri</b>
                </span>
              ),
            },
            {
              atas: (
                <span className="block text-sm text-slate-800">
                  Karantina <b>Casantri</b>
                </span>
              ),
              bawah: null,
            },
          ].map((step, i) => (
            <div key={i} className="z-10 flex flex-col items-center flex-1">
              {/* Label atas */}
              <div className="mb-2 text-center w-max">{step.atas}</div>
              {/* Titik oranye */}
              <div className="flex items-center justify-center w-6 h-6 border-4 border-white rounded-full shadow-lg bg-amber-400" />
              {/* Label bawah */}
              {step.bawah && (
                <div className="mt-2 text-center w-max">{step.bawah}</div>
              )}
            </div>
          ))}
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
              className="flex items-center justify-between px-6 py-4 transition bg-white border shadow cursor-pointer rounded-xl border-slate-200 hover:border-amber-400"
              onClick={() => toggle(idx)}
            >
              <span className="text-base font-semibold text-slate-800">
                {title}
              </span>
              <span className="text-2xl font-bold text-amber-500">
                {open[idx] ? "−" : "+"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-24" />
    </div>
  );
}
