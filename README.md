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
- **Prompt Showcase Page**: [http://localhost:3000/prompts](http://localhost:3000/prompts)
- **News & Devlog Page**: [http://localhost:3000/news](http://localhost:3000/news)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin) (Gunakan Passcode: `refa-admin-2026`)

---

## Panduan Deployment ke Production (Dokploy)

Proyek ini telah dikonfigurasi secara optimal untuk deployment di **Dokploy** menggunakan multi-stage Docker build (`output: "standalone"`).

### 1. Buat Database PostgreSQL di Dokploy
1. Buka dashboard Dokploy Anda.
2. Klik **Create Service** -> pilih **Database** -> pilih **PostgreSQL**.
3. Beri nama service (misal: `refa-postgres`).
4. Klik **Deploy**.
5. Setelah running, buka tab **General** dan copy **Internal Connection String** (misal: `postgresql://postgres:<password>@<container-name>:5432/refa_portfolio`).

### 2. Buat & Deploy Aplikasi Next.js di Dokploy
1. Di Dokploy, klik **Create Service** -> pilih **Application**.
2. Beri nama service (misal: `refa-portfolio`).
3. Pada tab **Source / Provider**:
   - Pilih **GitHub**.
   - Repository: `mrefawaladam/portofolio-dokploy`.
   - Branch: `main`.
4. Pada tab **Build**:
   - **Build Type**: Pilih **Dockerfile** (otomatis menggunakan `Dockerfile` multi-stage yang sudah ada di repo).
5. Pada tab **Environment Variables**, tambahkan:
   ```env
   DATABASE_URL=postgresql://postgres:<password>@<container-name>:5432/refa_portfolio
   DATABASE_SSL=false
   ADMIN_SECRET_KEY=ganti-dengan-kunci-rahasia-admin-anda
   PORT=3000
   ```
6. *(Opsional)* **Persistent Volume untuk Upload Gambar / File**:
   - Agar file gambar yang diupload via Admin tetap tersimpan saat container di-restart, tambahkan Volume Mount di tab **Volumes**:
     - **Host Path**: `/var/lib/dokploy/volumes/refa-portfolio-uploads` (atau volume name `refa_uploads`)
     - **Container Path**: `/app/public/uploads`
7. Pada tab **Domains**:
   - Masukkan domain Anda (misal: `mrefawm.my.id`).
   - Port: `3000`.
   - Aktifkan **HTTPS / Let's Encrypt SSL**.
8. Klik **Deploy**.

### 3. Migrasi & Initial Seeding Database di Dokploy
Setelah aplikasi Next.js berhasil di-deploy:
1. Buka tab **Terminal / Console** pada service container Next.js di Dokploy.
2. Jalankan perintah migrasi & seed:
   ```bash
   node scripts/setup-db.js
   ```
3. Periksa status data:
   ```bash
   node scripts/setup-db.js --check
   ```
   Seluruh 8 tabel akan otomatis terisi data awal (*Projects, Products, Prompt Showcases, News, Experiences, Educations, Tech Stacks, Impact*).

---

## Struktur Database (8 Tabel)

- `public.projects`: Proyek unggulan, arsitektur microservices, live demo & repo link.
- `public.products`: Produk digital, tools & SDK, pricing type, status operasional.
- `public.prompt_showcases`: Koleksi AI & System prompts, kategori/tipe, model AI, tags, dan instruksi.
- `public.news_articles`: Berita teknis, catatan devlog, cover image, dan case studies.
- `public.experiences`: Riwayat pekerjaan, peran, detail pencapaian, dan tech stack.
- `public.educations`: Riwayat pendidikan formal.
- `public.tech_stacks`: Kategori keahlian toolkit & icon resolver.
- `public.impact_metrics`: Highlight metrik pencapaian performa sistem.

---

## File Utama Proyek

- [`app/page.tsx`](app/page.tsx) — Halaman utama publik portofolio dengan form WhatsApp.
- [`app/prompts/page.tsx`](app/prompts/page.tsx) — Halaman terpisah AI & System Prompt Showcase (Carousel + Grid View + Live Search).
- [`app/news/page.tsx`](app/news/page.tsx) — Halaman terpisah katalog artikel & devlog engineering.
- [`app/news/[slug]/page.tsx`](app/news/[slug]/page.tsx) — Halaman detail artikel teknis (Markdown rendering).
- [`app/admin/page.tsx`](app/admin/page.tsx) — Admin Dashboard CRUD interaktif untuk seluruh 8 entitas.
- [`components/PromptShowcaseCarousel.tsx`](components/PromptShowcaseCarousel.tsx) — Komponen carousel prompt interaktif dengan copy & expand modal.
- [`Dockerfile`](Dockerfile) — Multi-stage production build Next.js 14 standalone untuk Dokploy.
- [`scripts/schema.sql`](scripts/schema.sql) — Skrip DDL PostgreSQL 8 tabel dan data seed awal.
- [`scripts/setup-db.js`](scripts/setup-db.js) — Skrip eksekusi migrasi & seeding otomatis.
- [`lib/db.ts`](lib/db.ts) — PostgreSQL Connection Pool dengan auto-fallback.
