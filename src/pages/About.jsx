import React from "react";

export default function About() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-r from-teal-900 to-teal-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-base">Beranda › Tentang Kami</h1>
          
        </div>
      </section>
      <section className="py-10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <div className="aspect-[16/9] bg-cover bg-center" style={{ backgroundImage: "url(/assets/FotoPesantren.png)" }} />
          </div>
          <h2 className="mt-8 text-2xl font-bold text-slate-900">
            Sejarah Pesantren Al-Ihsan Bekasi
          </h2>
          <p className="mt-4 text-slate-700 leading-7">
            PPesantren Al Ihsan Bekasi berdiri pada bulan Juli tahun 2021 di bawah naungan Yayasan Al Ihsan Al Khairiyyah. Kehadirannya dilandasi semangat untuk ikut serta dalam mengemban estafet dakwah Islam, serta menjadi wadah pendidikan yang berorientasi pada pembinaan akhlak, ilmu, dan amal. Sejak awal, pesantren ini diarahkan untuk melahirkan generasi muda Islam yang tidak hanya berilmu, tetapi juga memiliki keteguhan iman dan adab yang baik. Karena itu, pesantren ini hadir sebagai lembaga yang memadukan ilmu, teladan, dan pengabdian.
          </p>
          <p className="mt-4 text-slate-700 leading-7">
            Proin at volutpat tortor, nec imperdiet quam. Aenean porttitor
            semper purus ...
          </p>
          <h3 className="mt-8 text-xl font-bold text-slate-900">
            Visi Pesantren Al-Ihsan Bekasi
          </h3>
          <p className="mt-2 text-slate-700">
          Terbentuknya Generasi Rabbani yang Mandiri Berakhlaqul Karimah dan Siap Berkhidmat Untuk Ummat
          </p>
          <h3 className="mt-6 text-xl font-bold text-slate-900">
            Misi Pesantren Al-Ihsan Bekasi
          </h3>
          <ol className="mt-2 list-decimal pl-6 text-slate-700 space-y-2">
            <li>Menyelenggarakan Sistem Pendidikan Berbasis Diniyyah Untuk Membantu Para Santri Memahami Al Quran dan As Sunnah</li>
            <li>Mendidik Para Santri Mentadabburi dan Menghafal Al Quran dan As Sunnah Untuk Diamalkan</li>
            <li>Mendidik Para Santri Untuk Mempersiapkan Diri Sebagai Generasi Masa Depan Yang Komitmen Dalam Adab, Ilmu dan Amal</li>
            <li>Mendidik Para Santri Agar Mandiri , Kuat Jasmani dan Rohani.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
