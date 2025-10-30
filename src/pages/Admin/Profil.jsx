import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import AdminService from "../../services/AdminService";
import { FaUserCircle, FaEnvelope, FaPhone, FaIdCard, FaEdit, FaSave, FaTimes, FaCamera } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Profil() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    no_telp: "",
    isi: "",
    password: ""
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (!AdminService.isLoggedIn()) {
      navigate("/admin");
      return;
    }

    const admin = AdminService.getCurrentAdmin();
    
    const fetchAdminProfile = async () => {
      try {
        if (admin && admin.id) {
          const response = await AdminService.getProfile(admin.id);
          if (response.success && response.data) {
            setAdminData(response.data);
            setFormData({
              nama: response.data.nama || "",
              email: response.data.email || "",
              no_telp: response.data.no_telp || "",
              isi: response.data.isi || "",
              password: ""
            });
          } else {
            setAdminData(admin);
            setFormData({
              nama: admin.nama || "",
              email: admin.email || "",
              no_telp: admin.no_telp || "",
              isi: admin.isi || "",
              password: ""
            });
          }
        } else {
          setAdminData(admin);
          setFormData({
            nama: admin?.nama || "",
            email: admin?.email || "",
            no_telp: admin?.no_telp || "",
            isi: admin?.isi || "",
            password: ""
          });
        }
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        setAdminData(admin);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'File Tidak Valid',
          text: 'Hanya file gambar yang diperbolehkan!'
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Terlalu Besar',
          text: 'Ukuran file maksimal 5MB!'
        });
        return;
      }

      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        nama: adminData.nama || "",
        email: adminData.email || "",
        no_telp: adminData.no_telp || "",
        isi: adminData.isi || "",
        password: ""
      });
      setPhotoFile(null);
      setPhotoPreview(null);
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.nama || !formData.email) {
        Swal.fire({
          icon: 'error',
          title: 'Data Tidak Lengkap',
          text: 'Nama dan email wajib diisi!'
        });
        return;
      }

      const submitData = new FormData();
      submitData.append('nama', formData.nama);
      submitData.append('email', formData.email);
      submitData.append('no_telp', formData.no_telp || '');
      submitData.append('isi', formData.isi || '');
      
      if (formData.password && formData.password.trim() !== '') {
        submitData.append('password', formData.password);
      }

      if (photoFile) {
        submitData.append('photo_profile', photoFile);
        console.log('Photo file to upload:', photoFile.name, photoFile.type, photoFile.size);
      }

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let pair of submitData.entries()) {
        console.log(pair[0], ':', pair[1]);
      }

      const response = await AdminService.updateProfile(adminData.id, submitData);

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Profil berhasil diupdate',
          timer: 2000,
          showConfirmButton: false
        });

        setAdminData(response.data);
        setFormData({
          nama: response.data.nama || "",
          email: response.data.email || "",
          no_telp: response.data.no_telp || "",
          isi: response.data.isi || "",
          password: ""
        });
        setIsEditing(false);
        setPhotoFile(null);
        setPhotoPreview(null);

        window.location.reload();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: response.message || 'Gagal mengupdate profil'
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Terjadi kesalahan saat mengupdate profil'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-teal-700">Loading...</div>
      </div>
    );
  }

  const adminName = adminData?.nama || "Admin";
  const adminEmail = adminData?.email || "-";
  const adminPhone = adminData?.no_telp || "-";
  const adminRole = adminData?.role || "Admin";
  const adminIsi = adminData?.isi || "-";

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminHeader />
      <div className="flex">
        <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] z-30">
          <AdminSidebar />
        </div>
        <div className="flex-1 ml-64">
          <main className="flex flex-col min-h-screen">
            <section className="p-10 bg-[#f5f6fa] min-h-screen">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="mb-2 text-3xl font-bold text-slate-900">
                    Profil Admin
                  </h2>
                  <span className="block font-medium text-slate-500">
                    <Link to="/admin/dashboard" className="hover:text-teal-600">Beranda</Link> / Profil
                  </span>
                </div>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="p-8 bg-white border shadow-lg rounded-2xl border-slate-100">
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        {isEditing ? (
                          <label className="cursor-pointer group">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoChange}
                              className="hidden"
                            />
                            <div className="relative">
                              {photoPreview || adminData?.photo_profile ? (
                                <img
                                  src={photoPreview || `http://localhost:5000/${adminData.photo_profile}`}
                                  alt="Profile"
                                  className="object-cover w-24 h-24 border-4 border-teal-500 rounded-full"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-teal-700">
                                  <FaUserCircle className="text-6xl text-white" />
                                </div>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black rounded-full opacity-0 bg-opacity-40 group-hover:opacity-100">
                                <FaCamera className="text-2xl text-white" />
                              </div>
                            </div>
                          </label>
                        ) : (
                          <div>
                            {adminData?.photo_profile ? (
                              <img
                                src={`http://localhost:5000/${adminData.photo_profile}`}
                                alt="Profile"
                                className="object-cover w-24 h-24 border-4 border-teal-500 rounded-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-teal-700">
                                <FaUserCircle className="text-6xl text-white" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{adminName}</h3>
                        <p className="mt-1 text-lg font-medium text-teal-600">{adminRole}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleEditToggle}
                      className="flex items-center gap-2 px-4 py-2 font-semibold transition border-2 rounded-lg text-teal-700 border-teal-600 hover:bg-teal-50"
                    >
                      {isEditing ? (
                        <>
                          <FaTimes /> Batal
                        </>
                      ) : (
                        <>
                          <FaEdit /> Edit Profil
                        </>
                      )}
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50">
                        <FaUserCircle className="mt-1 text-2xl text-teal-600" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-500">Nama Lengkap</p>
                          {isEditing ? (
                            <input
                              type="text"
                              name="nama"
                              value={formData.nama}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 mt-1 text-base font-medium border rounded-lg border-slate-300 text-slate-900 focus:outline-none focus:border-teal-500"
                              required
                            />
                          ) : (
                            <p className="mt-1 text-base font-medium text-slate-900">{adminName}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50">
                        <FaEnvelope className="mt-1 text-2xl text-teal-600" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-500">Email</p>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 mt-1 text-base font-medium border rounded-lg border-slate-300 text-slate-900 focus:outline-none focus:border-teal-500"
                              required
                            />
                          ) : (
                            <p className="mt-1 text-base font-medium text-slate-900">{adminEmail}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50">
                        <FaPhone className="mt-1 text-2xl text-teal-600" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-500">No. Telepon</p>
                          {isEditing ? (
                            <input
                              type="tel"
                              name="no_telp"
                              value={formData.no_telp}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 mt-1 text-base font-medium border rounded-lg border-slate-300 text-slate-900 focus:outline-none focus:border-teal-500"
                            />
                          ) : (
                            <p className="mt-1 text-base font-medium text-slate-900">{adminPhone}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50">
                        <FaIdCard className="mt-1 text-2xl text-teal-600" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-500">Role</p>
                          <p className="mt-1 text-base font-medium text-slate-900">{adminRole}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50">
                        <FaUserCircle className="mt-1 text-2xl text-teal-600" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-500">Deskripsi</p>
                          {isEditing ? (
                            <textarea
                              name="isi"
                              value={formData.isi}
                              onChange={handleInputChange}
                              rows="3"
                              className="w-full px-3 py-2 mt-1 text-base font-medium border rounded-lg border-slate-300 text-slate-900 focus:outline-none focus:border-teal-500"
                              placeholder="Tambahkan deskripsi..."
                            />
                          ) : (
                            <p className="mt-1 text-base font-medium text-slate-900">{adminIsi}</p>
                          )}
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex items-start gap-4 p-4 border-2 rounded-lg bg-yellow-50 border-yellow-300">
                          <FaIdCard className="mt-1 text-2xl text-yellow-600" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-yellow-700">Password Baru (Opsional)</p>
                            <input
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 mt-1 text-base font-medium border rounded-lg border-yellow-300 text-slate-900 focus:outline-none focus:border-yellow-500"
                              placeholder="Kosongkan jika tidak ingin mengubah password"
                            />
                            <p className="mt-1 text-xs text-yellow-600">
                              * Hanya isi jika ingin mengubah password
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 pt-6 mt-6 border-t border-slate-200">
                      {isEditing ? (
                        <>
                          <button
                            type="submit"
                            className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-white transition rounded-lg bg-teal-600 hover:bg-teal-700"
                          >
                            <FaSave /> Simpan Perubahan
                          </button>
                          <button
                            type="button"
                            onClick={handleEditToggle}
                            className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold transition border-2 rounded-lg text-slate-700 border-slate-400 hover:bg-slate-100"
                          >
                            <FaTimes /> Batal
                          </button>
                        </>
                      ) : (
                        <Link
                          to="/admin/dashboard"
                          className="flex-1 px-6 py-3 font-semibold text-center transition border-2 rounded-lg text-teal-700 border-teal-600 hover:bg-teal-50"
                        >
                          Kembali ke Dashboard
                        </Link>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
