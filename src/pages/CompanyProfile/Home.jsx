import React, { useState } from "react";

export default function Home() {
  const GMAPS_LINK = "https://maps.app.goo.gl/1WZnr4KbYHjEhZP96";
  const GMAPS_EMBED =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1234567890!2d106.1234567890!3d-6.1234567890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDcnMjQuNCJTIDEwNsKwMDcnMjQuNCJF!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid";
  const WHATSAPP_NUMBER = "6281234567890"; // ganti dengan nomor WA admin
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

  // Placeholder data testimonial (nanti diganti API)
  const testimonials = [
    {
      id: 1,
      name: "Bilal Hamizan",
      cohort: "Angkatan 1",
      photo: "/assets/FotoBarisSantri.png",
      text: "Belajar di Pesantren Al Ihsan Bekasi membuat saya semakin mencintai ilmu agama. Lingkungan yang disiplin dan penuh kebersamaan membentuk karakter saya. Ilmu yang saya dapatkan menjadi bekal berharga untuk masa depan",
    },
    {
      id: 2,
      name: "Ahmad Fauzi",
      cohort: "Angkatan 2",
      photo: "/assets/FotoPesantren.png",
      text: "Program tahfizh dan kajian kitab sangat membantu saya memahami agama secara mendalam dan terstruktur.",
    },
    {
      id: 3,
      name: "Muhammad Yusuf",
      cohort: "Angkatan 3",
      photo: "/assets/FotoBarisSantri.png",
      text: "Para asatidz membimbing dengan sabar. Saya merasakan perubahan nyata dalam ibadah dan akhlak.",
    },
  ];
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;
  const prev = () => setCurrent((i) => (i - 1 + total) % total);
  const next = () => setCurrent((i) => (i + 1) % total);

  return (
    <div className="text-slate-800">
      {/* Hero */}
      <section>
        <div className="relative">
          <div
            className="h-[56vh] sm:h-[64vh] md:h-[72vh] lg:h-[78vh] xl:h-[82vh] bg-cover bg-center"
            style={{ backgroundImage: "url(/assets/FotoPesantren.png)" }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="max-w-5xl text-center">
              <h1 className="text-4xl hero-title sm:text-5xl md:text-6xl lg:text-7xl">
                Pesantren <span className="text-amber-500">Al-Ihsan</span>{" "}
                Bekasi
              </h1>
              <p className="mt-4 text-lg hero-subtitle sm:text-xl md:text-2xl">
                Adab, Ilmu, dan Amal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang */}
      <section id="about" className="py-20">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center ">
          Kenapa Memilih Pesantren{" "}
          <span className="text-amber-500">Al-Ihsan ?</span>
        </h2>
        <div className="grid items-start gap-8 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 md:grid-cols-2 mt-10">
          <div className="overflow-hidden border rounded-xl border-slate-200">
            <div
              className="aspect-[16/10] bg-cover bg-center"
              style={{ backgroundImage: "url(/assets/FotoSejarah.png)" }}
            />
          </div>

          <div>
            <p className="mt-4 leading-7 text-slate-600">
              Pondok Pesantren Al Ihsan berkomitmen mencetak generasi muslim
              yang berilmu dan berakhlak mulia melalui pembelajaran agama yang
              mendalam. Santri dibimbing untuk menguasai bahasa Arab sebagai
              kunci memahami Al-Qur’an dan Hadits, mempelajari Al-Qur’an dan
              Hadits secara intensif, serta mengkaji mutun islamiyah seperti
              fiqih, aqidah, dan akhlak. Dengan lingkungan yang religius,
              disiplin, dan penuh kekeluargaan, Al Ihsan menyeimbangkan ilmu,
              akhlak, dan spiritualitas agar santri siap menjadi pribadi yang
              beriman, berilmu, dan bermanfaat bagi umat dan bangsa.
            </p>
            <a
              href="/profil/tentang-kami"
              className="inline-block mt-4 text-sm text-slate-600 hover:text-slate-900"
            >
              Lihat Selengkapnya
            </a>
          </div>
        </div>
      </section>

      {/* Prestasi */}
      <section className="py-20 bg-slate-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-center">
            Prestasi <span className="text-amber-600">Pesantren</span>
          </h2>
          <div className="grid gap-6 mt-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <article
                key={i}
                className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-xl"
              >
                <div
                  className="h-40 bg-center bg-cover"
                  style={{
                    backgroundImage: "url(/assets/achievements/sample.jpg)",
                  }}
                />
                <div className="p-4">
                  <p className="text-sm font-semibold text-amber-600">
                    Juara 1
                  </p>
                  <h3 className="mt-1 font-semibold text-slate-900">
                    Kompetisi MQK
                  </h3>
                  <p className="mt-2 text-xs text-slate-600">
                    Alhamdulillah, kabar gembira ...
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6">
            <a
              href="/artikel"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Lihat Selengkapnya
            </a>
          </div>
        </div>
      </section>

      {/* Kegiatan */}
      <section className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-center">
            Kegiatan <span className="text-amber-600">Pesantren</span>
          </h2>
          <div className="grid gap-6 mt-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <article
                key={i}
                className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-xl"
              >
                <div
                  className="h-40 bg-center bg-cover"
                  style={{
                    backgroundImage: "url(/assets/activities/sample.jpg)",
                  }}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">
                    Pengarahan Santri
                  </h3>
                  <p className="mt-2 text-xs text-slate-600">
                    Pengarahan santri sebagai ...
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6">
            <a
              href="/artikel"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Lihat Selengkapnya
            </a>
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className="relative py-16">
        {/* Background image like design */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center filter blur-[2px]"
          style={{ backgroundImage: "url(/assets/FotoPesantren.png)" }}
        />
        <div className="absolute inset-0 -z-10 bg-white/80" />

        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-center">
            Testimoni <span className="text-amber-600">Alumni</span>
          </h2>

          <div className="relative mt-8 min-h-[380px]">
            {/* Side previews positioned behind main card, consistent size */}
            <div className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 w-[220px] h-[300px] rounded-2xl overflow-hidden blur-[2px] opacity-70 pointer-events-none z-0">
              <div
                className="w-full h-full bg-center bg-cover"
                style={{
                  backgroundImage: `url(${
                    testimonials[(current - 1 + total) % total].photo
                  })`,
                }}
              />
            </div>
            <div className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 w-[220px] h-[300px] rounded-2xl overflow-hidden blur-[2px] opacity-70 pointer-events-none z-0">
              <div
                className="w-full h-full bg-center bg-cover"
                style={{
                  backgroundImage: `url(${
                    testimonials[(current + 1) % total].photo
                  })`,
                }}
              />
            </div>

            {/* Main card fixed size */}
            <div className="relative z-10 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] ring-1 ring-slate-100 grid md:grid-cols-[360px_1fr] overflow-hidden h-[300px]">
                <div
                  className="h-full bg-center bg-cover"
                  style={{
                    backgroundImage: `url(${testimonials[current].photo})`,
                  }}
                />
                <div className="p-6 md:p-8">
                  <p className="text-lg font-semibold text-slate-900 md:text-xl">
                    {testimonials[current].name} -{" "}
                    <span className="text-amber-600">
                      {testimonials[current].cohort}
                    </span>
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700 md:text-base">
                    {testimonials[current].text}
                  </p>
                </div>
              </div>
            </div>

            {/* Arrows - fixed position */}
            <button
              onClick={prev}
              aria-label="Sebelumnya"
              className="absolute left-0 z-20 inline-flex items-center justify-center w-12 h-12 text-white -translate-y-1/2 rounded-full shadow md:left-6 top-1/2 bg-amber-500 hover:bg-amber-600"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Selanjutnya"
              className="absolute right-0 z-20 inline-flex items-center justify-center w-12 h-12 text-white -translate-y-1/2 rounded-full shadow md:right-6 top-1/2 bg-amber-500 hover:bg-amber-600"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* Hubungi */}
      <section id="contact" className="py-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-center">
            Hubungi <span className="text-teal-700">Kami</span>
          </h2>
          <div className="grid gap-6 mt-6 md:grid-cols-2">
            {/* Kartu Tanya */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
              {/* Background blur */}
              <div
                className="aspect-[16/10] bg-cover bg-center filter blur-[2px] scale-[1.02]"
                style={{ backgroundImage: "url(/assets/FotoBarisSantri.png)" }}
              />
              {/* Overlay semi gelap */}
              <div className="absolute inset-0 bg-black/25" />
              {/* Foto santri (kanan) */}
              <img
                src="/assets/FotoSantriRBG.png"
                alt="Santri"
                className="absolute right-2 bottom-0 h-[92%] object-contain z-20 hidden sm:block"
              />
              {/* Teks dan tombol - vertikal tengah kiri */}
              <div className="absolute z-30 -translate-y-1/2 left-6 top-1/2">
                <h3 className="text-xl font-extrabold text-white sm:text-2xl drop-shadow">
                  Tanyakan Disini
                </h3>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2 mt-3 text-sm font-semibold text-white rounded-full shadow bg-amber-500"
                >
                  Tanya Disini
                </a>
              </div>
            </div>

            {/* Kartu Map */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.12)] ring-1 ring-slate-100">
              <iframe
                title="Lokasi Pesantren Al-Ihsan Bekasi"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1234567890!2d106.1234567890!3d-6.1234567890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDcnMjQuNCJTIDEwNsKwMDcnMjQuNCJF!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
                className="w-full aspect-[16/10]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Gradient bottom for label readability */}
              <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none bg-gradient-to-t from-white/90 to-transparent" />
              <a
                href={GMAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute z-10 inline-block px-4 py-2 text-xs font-semibold text-white -translate-x-1/2 rounded-full shadow left-1/2 bottom-4 bg-amber-500 sm:text-sm"
              >
                Lokasi Pesantren Al-Ihsan Bekasi
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
