# Refa Creative Portfolio (Dynamic PostgreSQL Edition)

Portfolio profesional modern berbasis **Next.js 14 (App Router)**, **PostgreSQL (`pg`)**, **Tailwind CSS**, dan **Framer Motion**.  
Didesain siap produksi dengan integrasi database dinamis di **Dokploy**, sistem **Admin Dashboard** (`/admin`), dan form kontak langsung ke WhatsApp.

---

## Fitur Utama

1. **Sepenuhnya Dinamis dengan PostgreSQL**:
   - Seluruh konten (Projects, Products, News, Experiences, Educations, Tech Stacks, Impact Metrics) bersumber dari PostgreSQL.
   - **Zero-Downtime Resilience**: Jika database offline, aplikasi otomatis menggunakan fallback data lokal tanpa error/crash.
2. **Admin Dashboard Terproteksi (`/admin`)**:
   - CRUD visual lengkap untuk menambah, mengedit, dan menghapus seluruh portofolio.
   - Autentikasi berbasis PIN / Passcode (`ADMIN_SECRET_KEY`).
3. **Form Kontak WhatsApp Interaktif**:
   - Pengunjung mengisi nama, jenis kebutuhan sistem/arsitektur, dan pesan.
   - Tombol kirim langsung memformat pesan dan membuka obrolan WhatsApp (`+6283848988030`).
4. **Dokploy & Docker Ready**:
   - Dilengkapi `docker-compose.yml` untuk development lokal.
   - Script migrasi dan seeding otomatis: `npm run db:setup`.

---

## Panduan Menjalankan di Lokal (Development)

### 1. Jalankan PostgreSQL Lokal (Docker Compose)
```bash
docker compose up -d
```
Database PostgreSQL 16 akan otomatis berjalan di port `5432` dengan database `refa_portfolio`.

### 2. Konfigurasi Environment Variable
Salin `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```
Isi dari `.env.local`:
```env
DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/refa_portfolio
DATABASE_SSL=false
ADMIN_SECRET_KEY=refa-admin-2026
```

### 3. Migrasi & Initial Seeding Database
Jalankan perintah ini satu kali untuk membuat seluruh tabel dan mengisi data awal:
```bash
npm run db:setup
```
Untuk memverifikasi jumlah data yang ada di database:
```bash
npm run db:check
```

### 4. Jalankan Aplikasi Next.js
```bash
npm run dev
```
Buka browser:
- **Portofolio Publik**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin) (Gunakan Passcode: `refa-admin-2026`)

---

## Panduan Deployment ke Production (Dokploy)

1. **Buat Database PostgreSQL di Dokploy**:
   - Di Dokploy Dashboard, pilih **Create Service** -> **Database** -> **PostgreSQL**.
   - Catat Connection String yang diberikan oleh Dokploy (Internal atau External URL).
2. **Deploy Aplikasi Next.js di Dokploy**:
   - Tambahkan Service Application (dari Git repository ini).
   - Masukkan Environment Variables di Dokploy:
     ```env
     DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>
     DATABASE_SSL=false
     ADMIN_SECRET_KEY=ganti-dengan-password-rahasia-anda
     ```
3. **Inisialisasi Database di Dokploy**:
   - Masuk ke terminal container Next.js di Dokploy, lalu jalankan:
     ```bash
     npm run db:setup
     ```
   - Seluruh 7 tabel dan data portofolio akan terisi secara instan.

---

## Struktur Database (7 Tabel)

- `public.projects`: Proyek unggulan, kategori, tag, metrik, demo & repo link.
- `public.products`: Produk SaaS & developer tools, badge, status operasional.
- `public.news_articles`: Berita teknis, devlog, dan case studies.
- `public.experiences`: Riwayat pekerjaan, peran, pencapaian, dan tech stack.
- `public.educations`: Riwayat pendidikan formal.
- `public.tech_stacks`: Kategori keahlian toolkit & icon resolver.
- `public.impact_metrics`: Highlight metrik pencapaian performa sistem.

---

## File Utama Proyek

- [`app/page.tsx`](app/page.tsx) — Halaman utama publik portofolio dengan form WhatsApp.
- [`app/admin/page.tsx`](app/admin/page.tsx) — Admin Dashboard CRUD interaktif.
- [`app/api/portfolio/route.ts`](app/api/portfolio/route.ts) — Endpoint API publik yang mengambil 7 tabel sekaligus.
- [`app/api/admin/[entity]/route.ts`](app/api/admin/[entity]/route.ts) — API CRUD protected untuk Admin.
- [`scripts/schema.sql`](scripts/schema.sql) — Skrip DDL PostgreSQL dan data seed awal.
- [`scripts/setup-db.js`](scripts/setup-db.js) — Skrip eksekusi migrasi & seeding otomatis.
- [`lib/db.ts`](lib/db.ts) — PostgreSQL Connection Pool dengan auto-fallback.
- [`docker-compose.yml`](docker-compose.yml) — Docker container PostgreSQL untuk lokal.
