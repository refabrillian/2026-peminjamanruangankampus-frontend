# Changelog

Semua perubahan penting pada proyek **Peminjaman Ruangan Kampus - Backend** akan didokumentasikan di file ini.
Format ini mengikuti standar [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) dan menggunakan [Semantic Versioning](https://semver.org/lang/id/).

## [1.0.0] - 2026-02-15

### Added
- Inisialisasi proyek ASP.NET Core 10.
- Implementasi CRUD Modul Peminjaman (Create, Read, Delete).
- Integrasi database SQLite dengan Entity Framework Core.
- Implementasi fitur **Soft Delete** pada entitas Peminjaman.
- Penambahan **Database Seeding** untuk data awal ruangan.
- File konfigurasi `.env.example` dan update `.gitignore` untuk keamanan.

### Changed
- Refaktor struktur folder mengikuti standar industri.
- Update `README.md` dengan panduan instalasi dan variabel lingkungan.