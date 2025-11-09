import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import AdminSidebar from '../../components/AdminSidebar';
import GroupChatService from '../../services/GroupChatService';
import PendaftaranService from '../../services/PendaftaranService';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash, FaWhatsapp } from 'react-icons/fa';

export default function GroupChat() {
  const [groupChats, setGroupChats] = useState([]);
  const [angkatanOptions, setAngkatanOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    angkatan: '',
    link_wa: '',
    keterangan: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load group chats
      const groupChatsRes = await GroupChatService.getAllGroupChats();
      setGroupChats(groupChatsRes.data || []);
      
      // Load angkatan options
      const angkatanRes = await PendaftaranService.getAngkatanDropdown();
      setAngkatanOptions(angkatanRes.data || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      Swal.fire('Error', 'Gagal memuat data', 'error');
      setLoading(false);
    }
  };

  const handleOpenModal = (groupChat = null) => {
    if (groupChat) {
      // Edit mode
      setEditMode(true);
      setCurrentId(groupChat.id);
      setFormData({
        angkatan: groupChat.angkatan,
        link_wa: groupChat.link_wa,
        keterangan: groupChat.keterangan || '',
      });
    } else {
      // Create mode
      setEditMode(false);
      setCurrentId(null);
      setFormData({
        angkatan: '',
        link_wa: '',
        keterangan: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentId(null);
    setFormData({
      angkatan: '',
      link_wa: '',
      keterangan: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.angkatan || !formData.link_wa) {
      Swal.fire('Peringatan', 'Angkatan dan Link WA wajib diisi', 'warning');
      return;
    }
    
    try {
      if (editMode) {
        // Update
        await GroupChatService.updateGroupChat(currentId, formData);
        Swal.fire('Berhasil', 'Group chat berhasil diupdate', 'success');
      } else {
        // Create
        await GroupChatService.createGroupChat(formData);
        Swal.fire('Berhasil', 'Group chat berhasil dibuat', 'success');
      }
      
      handleCloseModal();
      loadData();
    } catch (error) {
      console.error('Error saving group chat:', error);
      const message = error.response?.data?.message || 'Gagal menyimpan data';
      Swal.fire('Error', message, 'error');
    }
  };

  const handleDelete = async (id, angkatan) => {
    const result = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: `Hapus group chat untuk angkatan ${angkatan}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    });
    
    if (result.isConfirmed) {
      try {
        await GroupChatService.deleteGroupChat(id);
        Swal.fire('Berhasil', 'Group chat berhasil dihapus', 'success');
        loadData();
      } catch (error) {
        console.error('Error deleting group chat:', error);
        const message = error.response?.data?.message || 'Gagal menghapus data';
        Swal.fire('Error', message, 'error');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f6fa]">
      <AdminHeader />
      <div className="flex flex-1" style={{ paddingTop: '72px' }}>
        <div className="fixed top-[72px] left-0 h-[calc(100vh-72px)] overflow-y-auto">
          <AdminSidebar />
        </div>
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Group Chat WhatsApp</h1>
                <p className="text-gray-600 mt-1">Kelola link group WhatsApp per angkatan</p>
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition"
              >
                <FaPlus />
                Tambah Group Chat
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Memuat data...</div>
              ) : groupChats.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Belum ada group chat. Klik "Tambah Group Chat" untuk membuat.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">No</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Angkatan</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Link WhatsApp</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Keterangan</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupChats.map((gc, index) => (
                        <tr key={gc.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                            Angkatan {gc.angkatan}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <a
                              href={gc.link_wa}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 flex items-center gap-2"
                            >
                              <FaWhatsapp className="text-lg" />
                              <span className="truncate max-w-xs">{gc.link_wa}</span>
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {gc.keterangan || '-'}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleOpenModal(gc)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm transition"
                              >
                                <FaEdit />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(gc.id, gc.angkatan)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm transition"
                              >
                                <FaTrash />
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {editMode ? 'Edit Group Chat' : 'Tambah Group Chat'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Angkatan */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Angkatan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="angkatan"
                    value={formData.angkatan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Pilih Angkatan</option>
                    {angkatanOptions.map(opt => (
                      <option key={opt.id} value={opt.angkatan}>
                        Angkatan {opt.angkatan}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Link WA */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Link WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="link_wa"
                    value={formData.link_wa}
                    onChange={handleInputChange}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Masukkan link invite group WhatsApp
                  </p>
                </div>

                {/* Keterangan */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Keterangan (Opsional)
                  </label>
                  <textarea
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Catatan tambahan tentang group ini"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-semibold"
                >
                  {editMode ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
