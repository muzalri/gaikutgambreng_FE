import React from "react";

export default function About() {
  return (
    <div className="pt-16">
      <section className="pt-6 pb-2 bg-white">
        <div className="max-w-5xl px-4 mx-auto">
          <div className="flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-teal-900 to-teal-700">
            <span className="text-sm text-white">
              Beranda &gt; Tentang Kami
            </span>
          </div>
        </div>
      </section>
      <section className="py-10">
        <div className="max-w-5xl px-4 mx-auto">
          <div className="overflow-hidden border rounded-2xl border-slate-200">
            <div
              className="aspect-[16/9] bg-cover bg-center"
              style={{ backgroundImage: "url(/assets/FotoPesantren.png)" }}
            />
          </div>
          <h2 className="mt-8 text-2xl font-bold text-slate-900 text-center">
            <span className="text-amber-500">Sejarah</span> Pesantren Al-Ihsan
            Bekasi
          </h2>
          <p className="mt-4 leading-7 text-slate-700 text-justify">
            Pesantren Al Ihsan Bekasi berdiri pada bulan Juli tahun 2021 di
            bawah naungan Yayasan Al Ihsan Al Khairiyyah. Kehadirannya dilandasi
            semangat untuk ikut serta dalam mengemban estafet dakwah Islam,
            serta menjadi wadah pendidikan yang berorientasi pada pembinaan
            akhlak, ilmu, dan amal. Sejak awal, pesantren ini diarahkan untuk
            melahirkan generasi muda Islam yang tidak hanya berilmu, tetapi juga
            memiliki keteguhan iman dan adab yang baik. Karena itu, pesantren
            ini hadir sebagai lembaga yang memadukan ilmu, teladan, dan
            pengabdian.
          </p>
          <p className="mt-4 leading-7 text-slate-700">
            Proin at volutpat tortor, nec imperdiet quam. Aenean porttitor
            semper purus ...
          </p>
          <h3 className="mt-8 text-xl font-bold text-slate-900 text-center">
            <span className="text-amber-500">Visi</span> Pesantren Al-Ihsan
            Bekasi
          </h3>
          <p className="mt-2 text-slate-700 text-center">
            Terbentuknya Generasi Rabbani yang Mandiri Berakhlaqul Karimah dan
            Siap Berkhidmat Untuk Ummat
          </p>
          <h3 className="mt-6 text-xl font-bold text-slate-900 text-center">
            <span className="text-amber-500">Misi</span> Pesantren Al-Ihsan
            Bekasi
          </h3>
          <ol className="pl-6 mt-2 space-y-2 list-decimal text-slate-700 text-justify">
            <li>
              Menyelenggarakan Sistem Pendidikan Berbasis Diniyyah Untuk
              Membantu Para Santri Memahami Al Quran dan As Sunnah
            </li>
            <li>
              Mendidik Para Santri Mentadabburi dan Menghafal Al Quran dan As
              Sunnah Untuk Diamalkan
            </li>
            <li>
              Mendidik Para Santri Untuk Mempersiapkan Diri Sebagai Generasi
              Masa Depan Yang Komitmen Dalam Adab, Ilmu dan Amal
            </li>
            <li>
              Mendidik Para Santri Agar Mandiri , Kuat Jasmani dan Rohani.
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
