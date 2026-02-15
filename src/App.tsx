import { useEffect, useState } from 'react';
import axios from 'axios';
import { Building2, User, Calendar, CheckCircle, Clock, XCircle, PlusCircle, Trash2 } from 'lucide-react';

interface Peminjaman {
  id?: number;
  namaPeminjam: string;
  namaRuangan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: string;
}

function App() {
  const [peminjamans, setPeminjamans] = useState<Peminjaman[]>([]);
  const [formData, setFormData] = useState<Peminjaman>({
    namaPeminjam: '',
    namaRuangan: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    status: 'Menunggu'
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5009/api/peminjaman');
      setPeminjamans(response.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5009/api/peminjaman', formData);
      setFormData({ namaPeminjam: '', namaRuangan: '', tanggalMulai: '', tanggalSelesai: '', status: 'Menunggu' });
      fetchData();
    } catch (error) {
      alert("Gagal menambah data!");
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (id === undefined) return; // Validasi ekstra untuk menghilangkan warning

    if (window.confirm("Yakin ingin menghapus data ini?")) {
      try {
        await axios.delete(`http://localhost:5009/api/peminjaman/${id}`);
        fetchData(); 
      } catch (error) {
        alert("Gagal menghapus data!");
      }
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: 'auto', fontFamily: 'Inter, sans-serif' }}>
      <h1>Sistem Peminjaman Ruangan</h1>

      {/* FORM TAMBAH DATA */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
        <h3><PlusCircle size={20} /> Tambah Peminjaman Baru</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input type="text" placeholder="Nama Peminjam" value={formData.namaPeminjam} onChange={e => setFormData({...formData, namaPeminjam: e.target.value})} required />
          <input type="text" placeholder="Nama Ruangan" value={formData.namaRuangan} onChange={e => setFormData({...formData, namaRuangan: e.target.value})} required />
          <input type="datetime-local" value={formData.tanggalMulai} onChange={e => setFormData({...formData, tanggalMulai: e.target.value})} required />
          <input type="datetime-local" value={formData.tanggalSelesai} onChange={e => setFormData({...formData, tanggalSelesai: e.target.value})} required />
        </div>
        <button type="submit" style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer', background: '#2563eb', color: 'white', border: 'none', borderRadius: '5px' }}>Simpan</button>
      </form>

      {/* TABEL DATA */}
      <div style={{ border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Peminjam</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Ruangan</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Tanggal</th> {/* Tambahkan Header ini */}
              <th style={{ padding: '12px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {peminjamans.map((item) => (
              <tr key={item.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}><User size={14} /> {item.namaPeminjam}</td>
                <td style={{ padding: '12px' }}><Building2 size={14} /> {item.namaRuangan}</td>
                <td style={{ padding: '12px' }}>
                  {item.status === "Disetujui" ? <CheckCircle color="green" size={16}/> : 
                    item.status === "Ditolak" ? <XCircle color="red" size={16}/> : 
                    <Clock color="orange" size={16}/>} {item.status}
                </td>
                <td style={{ padding: '12px' }}>
                  <Calendar size={14} style={{ marginRight: '8px' }} /> 
                  {new Date(item.tanggalMulai).toLocaleDateString('id-ID')}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {item.id && (
                    <button 
                        onClick={() => handleDelete(item.id)} 
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', margin: 'auto' }}
                    >
                      <Trash2 size={16} style={{ marginRight: '4px' }} /> Hapus
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;