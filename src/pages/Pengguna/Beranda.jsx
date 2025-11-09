import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaFolder,
  FaSignOutAlt,
  FaThLarge,
  FaCalendarAlt,
  FaRegCalendarCheck,
  FaWhatsapp,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PenggunaSidebar from "../../components/PenggunaSidebar";
import Swal from "sweetalert2";
import PengumumanService from "../../services/PengumumanService";
import PromosiService from "../../services/PromosiService";
import BerkasService from "../../services/BerkasService";
import GroupChatService from "../../services/GroupChatService";

export default function Beranda() {
  const [santriData, setSantriData] = useState(null);
  const [pengumuman, setPengumuman] = useState(null);
  const [santriAnnounced, setSantriAnnounced] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [banner, setBanner] = useState(null);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [berkasData, setBerkasData] = useState(null);
  const [groupChat, setGroupChat] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil data santri dari localStorage
    const data = localStorage.getItem("santriData");
    if (data) {
      const parsedData = JSON.parse(data);
      setSantriData(parsedData);
      
      // Cek berkas santri ini
      loadBerkasData(parsedData.id);
    }
    
    // Ambil banner dari promosi
    fetchBanner();
    
    // Ambil pengumuman aktif
    (async () => {
      try {
        const resp = await PengumumanService.getActive();
        // PengumumanService.getActive sudah return resp.data?.data || resp.data
        // Jadi struktur data sudah: { pengumuman: {...}, santri: [...] }
        console.log('Pengumuman response:', resp);
        const payload = resp?.data || resp;
        console.log('Payload:', payload);
        setPengumuman(payload?.pengumuman || null);
        const santriList = payload?.santri || payload?.berkas || [];
        console.log('Santri list:', santriList);
        setSantriAnnounced(Array.isArray(santriList) ? santriList : []);
      } catch (e) {
        console.error('Error fetching pengumuman:', e);
        setPengumuman(null);
        setSantriAnnounced([]);
      }
    })();
  }, []);

  const loadBerkasData = async (idSantri) => {
    try {
      const response = await BerkasService.getByIdSantri(idSantri);
      if (response.success && response.data) {
        setBerkasData(response.data);
        
        // Jika berkas sudah ada dan ada angkatan, ambil group chat
        if (response.data.angkatan) {
          loadGroupChat(response.data.angkatan);
        }
      }
    } catch (error) {
      console.log('Belum ada berkas untuk santri ini');
    }
  };

  const loadGroupChat = async (angkatan) => {
    try {
      const response = await GroupChatService.getGroupChatByAngkatan(angkatan);
      if (response.success && response.data) {
        setGroupChat(response.data);
      }
    } catch (error) {
      console.log('Belum ada group chat untuk angkatan ini');
    }
  };

  const fetchBanner = async () => {
    try {
      setBannerLoading(true);
      const response = await PromosiService.getBanner();
      console.log('✅ Banner loaded:', response.data);
      console.log('📸 Banner URL:', `http://localhost:5000/uploads/promosi/${encodeURIComponent(response.data.gambar)}`);
      setBanner(response.data);
    } catch (error) {
      console.log('ℹ️ No banner found, using default');
      setBanner(null);
    } finally {
      setBannerLoading(false);
    }
  };

  // Dummy data for demonstration
  const namaLogin = santriData?.nama || "Santri";
  const getTahapanLabel = (num) => {
    const map = {
      2: "Seleksi Berkas",
      3: "Tes Psikolog",
      4: "Tes Baca Al-Qur'an",
      5: "Wawancara Casantri",
      6: "Diterima",
    };
    return map[parseInt(num || 1, 10)] || `Tahap ${num}`;
  };

  const getDisplayedTahapan = (row) => {
    const isPengumumanTahap5 = parseInt(pengumuman?.tahapan_num || 0, 10) === 5;
    const statusRow = String(row?.status || '').toLowerCase();
    if (isPengumumanTahap5 && statusRow === 'diterima') {
      return 'Diterima';
    }
    return getTahapanLabel(row?.tahapan || row?.tahapan_num);
  };

  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      {/* Sticky Header Full Width */}
      <header className="sticky top-0 z-40 flex items-center justify-between w-full px-10 py-5 text-white shadow bg-gradient-to-r from-teal-800 to-teal-600 h-[80px]">
        <div className="flex items-center gap-3">
          <img src="/assets/logo3.png" alt="Logo" className="h-8" />
        </div>
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
          onClick={() => setShowProfileModal(true)}
        >
          <span className="font-semibold">Halo, {namaLogin}</span>
          <img
            src={
              santriData?.foto ||
              "/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png"
            }
            alt="Profile"
            className="object-cover w-8 h-8 border-2 border-white rounded-full"
          />
        </div>
      </header>
      <div className="flex flex-1">
        {/* Sidebar */}
        <PenggunaSidebar />
        {/* Main Content */}
        <div className="flex-1 ml-64">
          <main className="px-10 py-8">
            {/* Beranda Title */}
            <h1 className="text-2xl font-bold text-black mb-2">Beranda</h1>
            <span className="block mb-6 text-gray-500">Beranda</span>
            {/* Hero/Banner Full Width */}
            <div className="mb-8">
              <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow bg-white">
                {banner ? (
                  <img
                    src={`http://localhost:5000/uploads/promosi/${encodeURIComponent(banner.gambar)}`}
                    alt="Hero Banner"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      console.log('❌ Banner failed to load, using default');
                      e.target.src = '/assets/FotoPesantren.png';
                    }}
                  />
                ) : (
                  <img
                    src="/assets/FotoPesantren.png"
                    alt="Hero"
                    className="object-cover w-full h-full"
                  />
                )}
                {/* <div className="absolute inset-0 flex flex-col justify-center px-8 bg-black bg-opacity-30">
                  <h2 className="mb-2 text-2xl font-bold text-white">
                    Penerimaan <span className="text-yellow-400">Santri</span>{" "}
                    Baru Tahun Ajaran 2025
                  </h2>
                  <p className="max-w-md text-base text-white">
                    Bergabunglah dengan Pesantren Al Ihsan Bekasi dan wujudkan
                    pendidikan yang berkualitas, berakhlak mulia, dan berbasis
                    keilmuan.
                  </p>
                </div> */}
              </div>
            </div>
            {/* Group Chat Section - Tampil jika ada berkas dan group chat */}
            {berkasData && groupChat && (
              <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl shadow border-l-4 border-green-500">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 text-white p-3 rounded-full">
                    <FaWhatsapp className="text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Group WhatsApp Angkatan {berkasData.angkatan}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {groupChat.keterangan || 'Bergabunglah dengan group WhatsApp untuk mendapatkan informasi terbaru seputar pendaftaran dan kegiatan pesantren.'}
                    </p>
                    <a
                      href={groupChat.link_wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition shadow-md"
                    >
                      <FaWhatsapp className="text-xl" />
                      Gabung Group WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Table Section */}
            <div className="p-6 bg-white shadow rounded-2xl">
              <h3 className="mb-1 text-lg font-bold">
                Pengumuman Santri Baru {pengumuman?.angkatan || "-"}
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Pengumuman Lolos: {pengumuman ? (pengumuman.tahapan_label || getTahapanLabel(pengumuman.tahapan_num)) : "-"} 
              </p>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500">
                    <th className="py-2">NO</th>
                    <th className="py-2">Nama</th>
                    <th className="py-2">Angkatan</th>
                    <th className="py-2">Tahapan</th>
                  </tr>
                </thead>
                <tbody>
                  {santriAnnounced && santriAnnounced.length > 0 ? (
                    santriAnnounced.map((berkas, idx) => (
                      <tr key={berkas.id || idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-2 py-2">{idx + 1}</td>
                        <td className="px-2 py-2">{berkas.nama_lengkap || berkas.nama || '-'}</td>
                        <td className="px-2 py-2">{berkas.angkatan || '-'}</td>
                        <td className="px-2 py-2">{getDisplayedTahapan(berkas)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-2 py-4 text-center text-gray-500">
                        {pengumuman ? "Tidak ada data berkas yang berhasil ke tahapan ini" : "Belum ada pengumuman aktif"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="relative w-full max-w-4xl mx-4 bg-white rounded-3xl shadow-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowProfileModal(false)}
            >
              ✕
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-8">
              <img
                src={
                  santriData?.foto ||
                  "/assets/teachers/Drs.-K.H.-Mudrik-Qori-MA-Mudir 1.png"
                }
                alt="Profile"
                className="object-cover w-24 h-24 border-4 border-white rounded-full shadow-lg"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {santriData?.nama || "Bilal Abdurrahman"}
                </h2>
              </div>
              <button className="px-6 py-2 bg-teal-700 text-white rounded-full font-semibold hover:bg-teal-800 transition shadow">
                Ganti Kata Sandi
              </button>
            </div>

            {/* Profile Fields - 2 column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-600">
                  {santriData?.nama || "Bilal Abdurrahman Wahid Putra"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-600">
                  {santriData?.email || "Email@gmail.com"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Telepon
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-600">
                  {santriData?.no_telp || "08123456789"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-600">
                  {santriData?.alamat || "Bogor"}
                </div>
              </div>
            </div>

            {/* Sunting Button */}
            <div className="flex justify-start">
              <button className="px-8 py-3 bg-teal-700 text-white rounded-full font-semibold hover:bg-teal-800 transition shadow">
                Sunting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
