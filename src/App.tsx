import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Calendar, Layout, Info, X } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  // 1. STATE MANAGEMENT
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [namaPeminjam, setNamaPeminjam] = useState("");
  const [namaRuangan, setNamaRuangan] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [reservations, setReservations] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]); // Simpan daftar gedung
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

// 1. Pastikan kedua fungsi ambil data sudah didefinisikan di atas
const fetchReservations = async () => {
  try {
    const response = await axios.get('http://localhost:5009/api/peminjaman');
    setReservations(response.data);
  } catch (error) {
    console.error("Gagal ambil data reservasi:", error);
  }
};

const fetchRooms = async () => {
  try {
    const response = await axios.get('http://localhost:5009/api/ruangan');
    console.log("Data Ruangan:", response.data); // Tambahkan ini untuk cek di Console F12
    setRooms(response.data);
  } catch (error) {
    console.error("Gagal ambil daftar ruangan:", error);
  }
};

// Fungsi untuk membuka modal dalam mode EDIT
const handleEdit = (item: any) => {
  setEditId(item.id);
  setNamaPeminjam(item.namaPeminjam);
  setNamaRuangan(item.namaRuangan);
  setTanggalMulai(item.tanggalMulai);
  setTanggalSelesai(item.tanggalSelesai);
  setIsModalOpen(true);
};

// Fungsi untuk reset form saat tutup modal
const closeModal = () => {
  setIsModalOpen(false);
  setEditId(null);
  setNamaPeminjam("");
  setNamaRuangan("");
  setTanggalMulai("");
  setTanggalSelesai("");
};

// 2. GUNAKAN HANYA SATU useEffect
useEffect(() => {
  fetchReservations();
  fetchRooms();
}, []); // Kosong berarti hanya jalan 1x saat aplikasi dibuka

  // 3. FUNGSI SIMPAN DATA (POST)
  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  const payload = {
    id: editId || 0, // Penting untuk .NET: ID harus disertakan saat PUT
    namaPeminjam,
    namaRuangan,
    tanggalMulai,
    tanggalSelesai,
    status: editId ? undefined : "Menunggu" // Biarkan status lama jika sedang edit
  };

  try {
    if (editId) {
      // MODE EDIT (PUT)
      await axios.put(`http://localhost:5009/api/peminjaman/${editId}`, payload);
      alert("Data berhasil diperbarui!");
    } else {
      // MODE TAMBAH (POST)
      await axios.post('http://localhost:5009/api/peminjaman', payload);
      alert("Reservasi berhasil disimpan!");
    }
    
    closeModal();
    fetchReservations();
  } catch (error) {
    alert("Gagal memproses data. Cek koneksi API!");
  }
};

const handleDelete = async (id: number) => {
  if (window.confirm("Apakah kamu yakin ingin menghapus reservasi ini?")) {
    try {
      await axios.delete(`http://localhost:5009/api/peminjaman/${id}`);
      alert("Data berhasil dihapus!");
      fetchReservations(); // Refresh tabel setelah hapus
    } catch (error) {
      alert("Gagal menghapus data. Cek koneksi API!");
    }
  }
};

const handleUpdateStatus = async (id: number, statusBaru: string) => {
  try {
    // URL harus sesuai: /api/peminjaman/{id}/status
    await axios.patch(`http://localhost:5009/api/peminjaman/${id}/status`, {
      newStatus: statusBaru // Key 'newStatus' harus sama dengan property di DTO C# kamu
    });
    fetchReservations(); // Ambil data terbaru agar UI update otomatis
  } catch (error) {
    console.error("Gagal update status:", error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900 tracking-tight">Peminjaman Ruangan</h1>
          <p className="text-gray-500 mt-1">Manajemen reservasi gedung kampus pusat.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-200 font-semibold"
        >
          <Plus size={20} /> Tambah Reservasi
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Calendar /></div>
            <div><p className="text-sm text-gray-500">Total Pinjam</p><p className="text-xl font-bold">{reservations.length}</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
  <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Info /></div>
  <div>
    <p className="text-sm text-gray-500">Pending</p>
    <p className="text-xl font-bold">
      {reservations.filter(r => r.status === "Menunggu" || !r.status).length}
    </p>
  </div>
</div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Layout /></div>
            <div><p className="text-sm text-gray-500">Ruangan Aktif</p><p className="text-xl font-bold">{rooms.length}</p></div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Cari nama peminjam..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Peminjam</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Ruangan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Waktu Reservasi</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>                
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
  {reservations
    .filter((val) =>
      val?.namaPeminjam?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((item: any) => (
      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
        <td className="px-6 py-4 font-medium text-gray-700">{item.namaPeminjam}</td>
        <td className="px-6 py-4 text-gray-600">{item.namaRuangan}</td>
        
        {/* KOLOM JAM/WAKTU */}
        <td className="px-6 py-4 text-sm text-gray-500">
  <div className="flex flex-col">
    {/* Menampilkan Rentang Tanggal jika Berbeda Hari */}
    <span className="font-semibold">
      {new Date(item.tanggalMulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
      {new Date(item.tanggalMulai).toDateString() !== new Date(item.tanggalSelesai).toDateString() && 
        ` - ${new Date(item.tanggalSelesai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}`}
    </span>
    
    {/* Menampilkan Jam */}
    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-1 w-fit">
      {new Date(item.tanggalMulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - 
      {new Date(item.tanggalSelesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
    </span>
  </div>
</td>

        {/* KOLOM STATUS (Kembalikan Badge Ini) */}
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            item.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' : 
            item.status === 'Ditolak' ? 'bg-red-100 text-red-700' : 
            'bg-amber-100 text-amber-700'
          }`}>
            {item.status || 'Menunggu'}
          </span>
        </td>

        {/* KOLOM AKSI (Tombol-tombol) */}
        <td className="px-6 py-4 text-right">
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => handleUpdateStatus(item.id, "Disetujui")}
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Setujui"
            >
              {/* Menggunakan simbol check sederhana atau ikon dari lucide */}
              <Plus size={18} className="rotate-45" style={{ transform: 'rotate(0deg)' }} />
            </button>

            <button 
              onClick={() => handleUpdateStatus(item.id, "Ditolak")}
              className="p-2 text-red-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Tolak"
            >
              <X size={18} />
            </button>

            <button 
              onClick={() => handleDelete(item.id)}
              className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
              title="Hapus"
            >
              <Trash2 size={18} />
            </button>

            <button 
  onClick={() => handleEdit(item)}
  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
  title="Edit Data"
>
  <Search size={18} /> {/* Atau pakai ikon Edit jika di-import */}
</button>
          </div>
        </td>
      </tr>
    ))}
</tbody>
          </table>
        </div>
      </div>

      {/* MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-900">
  {editId ? "Edit Reservasi" : "Reservasi Baru"}
</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Peminjam</label>
                <input 
                  type="text" 
                  value={namaPeminjam}
                  onChange={(e) => setNamaPeminjam(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Masukkan nama lengkap..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ruangan</label>
                <select 
  value={namaRuangan}
  onChange={(e) => setNamaRuangan(e.target.value)}
  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-700"
  required
>
  <option value="">-- Pilih Ruangan --</option>
  {rooms.map((room: any) => (
    <option key={room.id} value={room.namaRuangan || room.NamaRuangan}>
      {/* Trik ini memastikan jika salah satu undefined, yang lain akan muncul */}
      {room.namaRuangan || room.NamaRuangan}
    </option>
  ))}
</select>

<div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai</label>
      <input 
        type="datetime-local" 
        value={tanggalMulai}
        onChange={(e) => setTanggalMulai(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Selesai</label>
      <input 
        type="datetime-local" 
        value={tanggalSelesai}
        onChange={(e) => setTanggalSelesai(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        required
      />
    </div>
  </div>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all mt-4">
                Simpan Reservasi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;