import React, { useState, useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import ArtikelService from "../../services/ArtikelService";
import { getImageUrl } from "../../config/api";
import TestimonialService from "../../services/TestimonialService";

export default function Home() {
  const GMAPS_LINK = "https://maps.app.goo.gl/1WZnr4KbYHjEhZP96";
  const GMAPS_EMBED =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1234567890!2d106.1234567890!3d-6.1234567890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDcnMjQuNCJTIDEwNsKwMDcnMjQuNCJF!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid";
  const WHATSAPP_NUMBER = "6281234567890"; // ganti dengan nomor WA admin
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

  // State untuk artikel
  const [prestasiArticles, setPrestasiArticles] = useState([]);
  const [kegiatanArticles, setKegiatanArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  // State untuk modal artikel
  const [selectedArtikel, setSelectedArtikel] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // State untuk swipe artikel
  const [currentPrestasiIndex, setCurrentPrestasiIndex] = useState(0);
  const [currentKegiatanIndex, setCurrentKegiatanIndex] = useState(0);

  // Testimonial state
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;
  const prev = () => setCurrent((i) => (i - 1 + total) % total);
  const next = () => setCurrent((i) => (i + 1) % total);

  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-quart" });
  }, []);

  // Fetch articles by category
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoadingArticles(true);
        const response = await ArtikelService.getAllArtikel();

        if (response.success) {
          const articles = response.data;

          // Filter artikel berdasarkan kategori
          const prestasi = articles
            .filter((article) => article.kategori === "Prestasi")
            .slice(0, 3);
          const kegiatan = articles
            .filter((article) => article.kategori === "Kegiatan")
            .slice(0, 3);

          setPrestasiArticles(prestasi);
          setKegiatanArticles(kegiatan);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchArticles();
  }, []);

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoadingTestimonials(true);
        const response = await TestimonialService.getAll();
        if (response.success && Array.isArray(response.data)) {
          const mapped = response.data.map((item) => {
            const imagePath = item.foto
              ? `/uploads/testimonial/${item.foto}`
              : "/assets/FotoBarisSantri.png";
            return {
              id: item.id,
              name: item.nama,
              cohort: item.angkatan
                ? `Angkatan ${item.angkatan}`
                : item.kategori || "",
              photo: getImageUrl(imagePath),
              text: item.testimonial,
            };
          });
          setTestimonials(mapped);
          setCurrent(0);
        } else {
          setTestimonials([]);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setTestimonials([]);
      } finally {
        setLoadingTestimonials(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Fungsi untuk membuka modal detail artikel
  const openDetailModal = (artikel) => {
    setSelectedArtikel(artikel);
    setShowDetailModal(true);
  };

  // Fungsi untuk menutup modal
  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedArtikel(null);
  };

  // Fungsi untuk mendapatkan artikel yang ditampilkan (3 artikel per halaman)
  const getDisplayedPrestasi = () => {
    return prestasiArticles.slice(
      currentPrestasiIndex,
      currentPrestasiIndex + 3
    );
  };

  const getDisplayedKegiatan = () => {
    return kegiatanArticles.slice(
      currentKegiatanIndex,
      currentKegiatanIndex + 3
    );
  };

  // Fungsi untuk swipe prestasi
  const nextPrestasi = () => {
    if (currentPrestasiIndex + 3 < prestasiArticles.length) {
      setCurrentPrestasiIndex(currentPrestasiIndex + 1);
    }
  };

  const prevPrestasi = () => {
    if (currentPrestasiIndex > 0) {
      setCurrentPrestasiIndex(currentPrestasiIndex - 1);
    }
  };

  // Fungsi untuk swipe kegiatan
  const nextKegiatan = () => {
    if (currentKegiatanIndex + 3 < kegiatanArticles.length) {
      setCurrentKegiatanIndex(currentKegiatanIndex + 1);
    }
  };

  const prevKegiatan = () => {
    if (currentKegiatanIndex > 0) {
      setCurrentKegiatanIndex(currentKegiatanIndex - 1);
    }
  };

  return (
    <div className="text-slate-800">
      {/* Hero */}
      <section data-aos="fade-up">
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
      <section id="about" className="py-20" data-aos="fade-up">
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
      <section className="py-20 bg-slate-50" data-aos="fade-up">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-center">
            Prestasi <span className="text-amber-500">Pesantren</span>
          </h2>
          <div className="relative">
            <div className="grid gap-6 mt-8 md:grid-cols-3">
              {loadingArticles ? (
                // Loading skeleton
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-xl animate-pulse"
                  >
                    <div className="h-40 bg-slate-200" />
                    <div className="p-4 space-y-3">
                      <div className="w-16 h-4 bg-slate-200 rounded" />
                      <div className="w-3/4 h-5 bg-slate-200 rounded" />
                      <div className="w-full h-3 bg-slate-200 rounded" />
                      <div className="w-5/6 h-3 bg-slate-200 rounded" />
                    </div>
                  </div>
                ))
              ) : getDisplayedPrestasi().length > 0 ? (
                getDisplayedPrestasi().map((article) => {
                  // Explicitly construct the URL and encode it
                  const imagePath = article.foto;
                  let imageUrl = imagePath
                    ? imagePath.startsWith("http")
                      ? imagePath
                      : `http://localhost:5000${imagePath}`
                    : "/assets/achievements/sample.jpg";

                  // Encode the URL to handle spaces and special characters
                  if (imagePath && !imagePath.startsWith("http")) {
                    imageUrl = encodeURI(imageUrl);
                  }

                  return (
                    <article
                      key={article.id}
                      className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => openDetailModal(article)}
                    >
                      <div
                        className="h-40 bg-center bg-cover"
                        style={{
                          backgroundImage: `url("${imageUrl}")`,
                        }}
                      />
                      <div className="p-4">
                        <p className="text-sm font-semibold text-amber-500">
                          Prestasi
                        </p>
                        <h3 className="mt-1 font-semibold text-slate-900 line-clamp-2">
                          {article.judul}
                        </h3>
                        <p className="mt-2 text-xs text-slate-600 line-clamp-3">
                          {article.isi.substring(0, 100)}...
                        </p>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="col-span-3 py-8 text-center text-slate-500">
                  Belum ada artikel prestasi
                </div>
              )}
            </div>

            {/* Navigation buttons untuk prestasi */}
            {prestasiArticles.length > 3 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={prevPrestasi}
                  disabled={currentPrestasiIndex === 0}
                  className={`p-2 rounded-full ${
                    currentPrestasiIndex === 0
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-amber-500 text-white hover:bg-amber-600"
                  }`}
                  aria-label="Artikel sebelumnya"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <span className="text-sm text-slate-600">
                  {currentPrestasiIndex + 1}-
                  {Math.min(currentPrestasiIndex + 3, prestasiArticles.length)}{" "}
                  dari {prestasiArticles.length}
                </span>
                <button
                  onClick={nextPrestasi}
                  disabled={currentPrestasiIndex + 3 >= prestasiArticles.length}
                  className={`p-2 rounded-full ${
                    currentPrestasiIndex + 3 >= prestasiArticles.length
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-amber-500 text-white hover:bg-amber-600"
                  }`}
                  aria-label="Artikel selanjutnya"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}

            <div className="mt-6">
              <a
                href="/artikel"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Lihat Selengkapnya
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Kegiatan */}
      <section className="py-20" data-aos="fade-up" data-aos-delay="100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-center">
            Kegiatan <span className="text-amber-500">Pesantren</span>
          </h2>
          <div className="relative">
            <div className="grid gap-6 mt-8 md:grid-cols-3">
              {loadingArticles ? (
                // Loading skeleton
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-xl animate-pulse"
                  >
                    <div className="h-40 bg-slate-200" />
                    <div className="p-4 space-y-3">
                      <div className="w-3/4 h-5 bg-slate-200 rounded" />
                      <div className="w-full h-3 bg-slate-200 rounded" />
                      <div className="w-5/6 h-3 bg-slate-200 rounded" />
                    </div>
                  </div>
                ))
              ) : getDisplayedKegiatan().length > 0 ? (
                getDisplayedKegiatan().map((article) => {
                  // Explicitly construct the URL and encode it
                  const imagePath = article.foto;
                  let imageUrl = imagePath
                    ? imagePath.startsWith("http")
                      ? imagePath
                      : `http://localhost:5000${imagePath}`
                    : "/assets/activities/sample.jpg";

                  // Encode the URL to handle spaces and special characters
                  if (imagePath && !imagePath.startsWith("http")) {
                    imageUrl = encodeURI(imageUrl);
                  }

                  return (
                    <article
                      key={article.id}
                      className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => openDetailModal(article)}
                    >
                      <div
                        className="h-40 bg-center bg-cover"
                        style={{
                          backgroundImage: `url("${imageUrl}")`,
                        }}
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-900 line-clamp-2">
                          {article.judul}
                        </h3>
                        <p className="mt-2 text-xs text-slate-600 line-clamp-3">
                          {article.isi.substring(0, 100)}...
                        </p>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="col-span-3 py-8 text-center text-slate-500">
                  Belum ada artikel kegiatan
                </div>
              )}
            </div>

            {/* Navigation buttons untuk kegiatan */}
            {kegiatanArticles.length > 3 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={prevKegiatan}
                  disabled={currentKegiatanIndex === 0}
                  className={`p-2 rounded-full ${
                    currentKegiatanIndex === 0
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-amber-500 text-white hover:bg-amber-600"
                  }`}
                  aria-label="Artikel sebelumnya"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <span className="text-sm text-slate-600">
                  {currentKegiatanIndex + 1}-
                  {Math.min(currentKegiatanIndex + 3, kegiatanArticles.length)}{" "}
                  dari {kegiatanArticles.length}
                </span>
                <button
                  onClick={nextKegiatan}
                  disabled={currentKegiatanIndex + 3 >= kegiatanArticles.length}
                  className={`p-2 rounded-full ${
                    currentKegiatanIndex + 3 >= kegiatanArticles.length
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-amber-500 text-white hover:bg-amber-600"
                  }`}
                  aria-label="Artikel selanjutnya"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}

            <div className="mt-6">
              <a
                href="/artikel"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Lihat Selengkapnya
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Galeri */}
      <section
        className="py-20 bg-slate-50"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-center mb-12">
            Galeri <span className="text-amber-500">Pesantren</span>
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 auto-rows-[200px]">
            {/* Image 1 - Large */}
            <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl shadow-lg">
              <img
                src="/assets/gallery/pesantren-1.jpg"
                alt="Gedung Pesantren"
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.src = "/assets/FotoPesantren.png";
                }}
              />
            </div>
            {/* Image 2 */}
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src="/assets/gallery/pesantren-2.jpg"
                alt="Fasilitas Pesantren"
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.src = "/assets/FotoSejarah.png";
                }}
              />
            </div>
            {/* Image 3 */}
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src="/assets/gallery/pesantren-3.jpg"
                alt="Masjid Pesantren"
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.src = "/assets/FotoPesantren.png";
                }}
              />
            </div>
            {/* Image 4 */}
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src="/assets/gallery/pesantren-4.jpg"
                alt="Kegiatan Santri"
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.src = "/assets/FotoBarisSantri.png";
                }}
              />
            </div>
            {/* Image 5 */}
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src="/assets/gallery/pesantren-5.jpg"
                alt="Pembelajaran"
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.src = "/assets/FotoPesantren.png";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section
        className="relative py-16"
        data-aos="fade-up"
        data-aos-delay="250"
      >
        {/* Background image with blur */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage: "url(/assets/FotoPesantren.png)",
            filter: "blur(3px)",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-white/70" />

        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-center mb-12">
            Testimoni <span className="text-amber-500">Alumni</span>
          </h2>

          <div className="relative min-h-[450px] flex items-center justify-center">
            {loadingTestimonials ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : total === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-slate-500">
                Belum ada testimoni
              </div>
            ) : (
              <>
                {/* Side previews - blurred background cards */}
                <div
                  className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 w-[200px] h-[280px] rounded-2xl overflow-hidden shadow-lg z-0"
                  style={{ filter: "blur(2px)", opacity: 0.6 }}
                >
                  <img
                    src={testimonials[(current - 1 + total) % total].photo}
                    alt="Previous"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-[200px] h-[280px] rounded-2xl overflow-hidden shadow-lg z-0"
                  style={{ filter: "blur(2px)", opacity: 0.6 }}
                >
                  <img
                    src={testimonials[(current + 1) % total].photo}
                    alt="Next"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Main testimonial card */}
                <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-[320px_1fr] gap-6 p-6">
                    {/* Photo on the left */}
                    <div className="flex items-center justify-center">
                      <img
                        src={testimonials[current].photo}
                        alt={testimonials[current].name}
                        className="w-full max-w-[280px] h-auto rounded-xl object-cover shadow-md"
                      />
                    </div>

                    {/* Text content on the right */}
                    <div className="flex flex-col justify-center py-4">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {testimonials[current].name} -{" "}
                        <span className="text-amber-500">
                          {testimonials[current].cohort}
                        </span>
                      </h3>
                      <p className="text-slate-700 leading-relaxed text-justify mt-4">
                        {testimonials[current].text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation arrows */}
                <button
                  onClick={prev}
                  aria-label="Sebelumnya"
                  className="absolute left-2 lg:left-4 z-20 inline-flex items-center justify-center w-12 h-12 text-3xl text-white -translate-y-1/2 rounded-full shadow-lg top-1/2 bg-amber-500 hover:bg-amber-600 transition-colors"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  aria-label="Selanjutnya"
                  className="absolute right-2 lg:right-4 z-20 inline-flex items-center justify-center w-12 h-12 text-3xl text-white -translate-y-1/2 rounded-full shadow-lg top-1/2 bg-amber-500 hover:bg-amber-600 transition-colors"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Hubungi */}
      <section
        id="contact"
        className="py-16"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-center">
            Hubungi <span className="text-amber-500">Kami</span>
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

      {/* Modal Detail Artikel */}
      {showDetailModal && selectedArtikel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={closeDetailModal}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute text-2xl top-4 right-4 text-slate-400 hover:text-teal-700"
              onClick={closeDetailModal}
              aria-label="Tutup"
            >
              &#10005;
            </button>

            {selectedArtikel.foto && (
              <div className="w-full h-64 bg-slate-200">
                <img
                  src={`http://localhost:5000${selectedArtikel.foto}`}
                  alt={selectedArtikel.judul}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="p-8">
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                {selectedArtikel.judul}
              </h2>

              <div className="flex items-center gap-4 pb-4 mb-6 text-sm border-b text-slate-600 border-slate-200">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {selectedArtikel.penulis?.nama || "Admin"}
                </span>
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(selectedArtikel.created_at).toLocaleDateString(
                    "id-ID",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-base leading-relaxed text-slate-700 whitespace-pre-line">
                  {selectedArtikel.isi}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
