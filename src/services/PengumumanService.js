import api from "../config/api";

const TAHAPAN_MAP = {
  "Seleksi Berkas": 1,
  "Tes Psikolog": 2,
  "Tes Baca Al-Qur'an": 3,
  "Wawancara Casantri": 4,
  "Karantina Casantri": 5,
  // Backward-compat for labels in modal if used
  "Seleksi Administrasi": 1,
  "Wawancara": 4,
  "Karantina": 5,
};

const publish = async ({ angkatan, tahapan }) => {
  const tahapan_num = TAHAPAN_MAP[tahapan] || parseInt(tahapan, 10) || 1;
  const tahapan_label = Object.keys(TAHAPAN_MAP).find(
    (k) => TAHAPAN_MAP[k] === tahapan_num
  ) || "Seleksi Berkas";
  const resp = await api.post("/pengumuman/publish", {
    angkatan,
    tahapan_label,
    tahapan_num,
  });
  return resp.data;
};

const getActive = async () => {
  const resp = await api.get("/pengumuman/active");
  // Backend shape: { success, data: { pengumuman, santri } }
  return resp.data?.data || resp.data;
};

const PengumumanService = { publish, getActive };
export default PengumumanService;


