"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FolderGit2,
  Boxes,
  Newspaper,
  Briefcase,
  GraduationCap,
  Layers,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  X,
  Sparkles,
  BookOpen,
  Bookmark,
  Search,
  Menu,
  FileText,
  Settings2,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  Check,
  ListTree,
  Table as TableIcon,
  Info,
} from "lucide-react";
import MarkdownEditor from "@/components/MarkdownEditor";
import AdminSidebar, { TabKey } from "@/components/admin/AdminSidebar";

// Helper function to auto-generate URL-friendly slug
function slugify(text: string): string {
  return (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

interface FieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "boolean"
    | "tags"
    | "markdown"
    | "image"
    | "select"
    | "chip_select";
  required?: boolean;
  helper?: string;
  placeholder?: string;
  options?: { label: string; value: string }[] | string[];
}

interface TabConfig {
  key: TabKey;
  label: string;
  singular: string;
  icon: React.ElementType;
  description: string;
  fields: FieldConfig[];
}

const TABS: TabConfig[] = [
  {
    key: "courses",
    label: "Kurikulum Kursus",
    singular: "Track Kursus",
    icon: BookOpen,
    description: "Katalog kursus Coursera-style. Klik judul kursus untuk mengelola Bab & Pelajaran",
    fields: [
      {
        name: "title",
        label: "Judul Kursus",
        type: "text",
        required: true,
        placeholder: "e.g. Mastering Event-Driven Architecture with RabbitMQ & Golang",
        helper: "Judul utama kursus yang akan menjadi headline track.",
      },
      {
        name: "slug",
        label: "Slug URL",
        type: "text",
        required: true,
        placeholder: "e.g. event-driven-rabbitmq",
        helper: "URL identitas kursus. Otomatis dibuat dari judul saat Anda mengetik.",
      },
      {
        name: "tagline",
        label: "Tagline Singkat",
        type: "text",
        placeholder: "e.g. Enterprise Message Broker Patterns & Distributed Microservices",
        helper: "Satu kalimat ringkas penjelas nilai kursus ini.",
      },
      {
        name: "category",
        label: "Kategori Bidang",
        type: "text",
        placeholder: "e.g. Distributed Systems & Backend",
        options: [
          "Distributed Systems & Backend",
          "Cloud & DevOps Architecture",
          "Software Engineering & DDD",
          "Golang High-Concurrency",
        ],
        helper: "Kategori keilmuan kursus.",
      },
      {
        name: "level",
        label: "Tingkat Kesulitan",
        type: "chip_select",
        options: [
          { label: "Beginner", value: "Beginner" },
          { label: "Intermediate", value: "Intermediate" },
          { label: "Advanced", value: "Advanced" },
          { label: "Intermediate — Advanced", value: "Intermediate — Advanced" },
          { label: "All Levels", value: "All Levels" },
        ],
        helper: "Tingkat prasyarat materi.",
      },
      {
        name: "badge",
        label: "Badge Label",
        type: "text",
        placeholder: "e.g. Flagship Track, New, Popular",
        helper: "Label pemanis di sudut kartu kursus.",
      },
      {
        name: "icon",
        label: "Nama Icon",
        type: "text",
        placeholder: "e.g. Workflow, Cpu, BookOpen, Network",
        helper: "Nama icon Lucide (Workflow, Cpu, BookOpen, Network, Database).",
      },
      {
        name: "description",
        label: "Deskripsi Lengkap Kursus",
        type: "textarea",
        required: true,
        placeholder: "Tuliskan silabus, target audiens, dan apa saja yang dipelajari...",
        helper: "Penjelasan mendalam tentang seluruh rangkaian kursus ini.",
      },
      {
        name: "published",
        label: "Status Publikasi",
        type: "boolean",
        helper: "Aktifkan agar kursus tampil untuk publik di halaman /tutorials.",
      },
      {
        name: "order_index",
        label: "Nomor Urut Tampil",
        type: "number",
        helper: "Nomor urut (angka 1 akan tampil paling atas/pertama).",
      },
    ],
  },
  {
    key: "modules",
    label: "Semua Modul Bab",
    singular: "Modul Bab",
    icon: FolderGit2,
    description: "Kelompok bab kurikulum dalam suatu track kursus",
    fields: [
      {
        name: "course_id",
        label: "Pilih Track Kursus Induk",
        type: "select",
        required: true,
        helper: "Pilih kursus yang menaungi modul bab ini (otomatis tanpa perlu copy-paste UUID!).",
      },
      {
        name: "title",
        label: "Judul Modul Bab",
        type: "text",
        required: true,
        placeholder: "e.g. 01. Foundations of Distributed Systems",
        helper: "Nama bab materi pembelajaran.",
      },
      {
        name: "slug",
        label: "Slug Modul",
        type: "text",
        required: true,
        placeholder: "e.g. 01-foundations",
        helper: "Slug unik untuk penamaan folder modul.",
      },
      {
        name: "order_index",
        label: "Urutan Bab",
        type: "number",
        helper: "Nomor bab dalam kursus (1, 2, 3...).",
      },
    ],
  },
  {
    key: "lessons",
    label: "Semua Pelajaran",
    singular: "Materi Lesson",
    icon: Bookmark,
    description: "Artikel pembelajaran dan tutorial interaktif Markdown",
    fields: [
      {
        name: "course_id",
        label: "Langkah 1: Pilih Track Kursus",
        type: "select",
        required: true,
        helper: "Pilih kursus utama materi ini.",
      },
      {
        name: "module_id",
        label: "Langkah 2: Pilih Modul Bab",
        type: "select",
        required: true,
        helper: "Pilihan bab otomatis menyesuaikan dengan kursus yang Anda pilih di atas.",
      },
      {
        name: "title",
        label: "Judul Materi Pelajaran",
        type: "text",
        required: true,
        placeholder: "e.g. Memahami Exchange, Queue, dan Binding di RabbitMQ",
        helper: "Judul artikel materi yang dipelajari pembaca.",
      },
      {
        name: "slug",
        label: "Slug Materi",
        type: "text",
        required: true,
        placeholder: "e.g. intro-event-driven",
        helper: "Akan digunakan pada URL: /tutorials/[course]/[slug]",
      },
      {
        name: "type",
        label: "Tipe Pembelajaran",
        type: "chip_select",
        options: [
          { label: "📖 Reading Guide", value: "reading" },
          { label: "💻 Code Walkthrough", value: "code" },
          { label: "🏗️ System Architecture", value: "architecture" },
        ],
        helper: "Format penyajian materi.",
      },
      {
        name: "duration",
        label: "Estimasi Durasi Belajar",
        type: "text",
        placeholder: "e.g. 8 min read, 15 min read",
        helper: "Perkiraan waktu yang dibutuhkan untuk menyelesaikan materi ini.",
      },
      {
        name: "excerpt",
        label: "Ringkasan Singkat (Excerpt)",
        type: "textarea",
        placeholder: "Rangkuman 1-2 kalimat tentang inti materi ini...",
        helper: "Ditampilkan di daftar isi dan preview awal materi.",
      },
      {
        name: "tags",
        label: "Kata Kunci / Tags",
        type: "tags",
        placeholder: "e.g. RabbitMQ, AMQP, Go, Messaging, Architecture",
        helper: "Pisahkan dengan koma.",
      },
      {
        name: "content",
        label: "Isi Materi Markdown (Editor Lengkap)",
        type: "markdown",
        required: true,
        helper: "Tulis materi lengkap dengan pemformatan Markdown, blok kode, dan gambar.",
      },
      {
        name: "published",
        label: "Status Publikasi",
        type: "boolean",
        helper: "Aktifkan agar materi langsung bisa dibaca pengunjung.",
      },
      {
        name: "order_index",
        label: "Urutan Pelajaran",
        type: "number",
        helper: "Urutan pelajaran di dalam modul bab (1, 2, 3...).",
      },
    ],
  },
  {
    key: "prompts",
    label: "Prompt Showcase",
    singular: "AI Prompt",
    icon: Sparkles,
    description: "Koleksi prompt engineering & system instructions siap pakai",
    fields: [
      {
        name: "title",
        label: "Judul Prompt",
        type: "text",
        required: true,
        placeholder: "e.g. Domain-Driven Design & Hexagonal Architecture Modeler",
        helper: "Nama prompt instruksi.",
      },
      {
        name: "slug",
        label: "Slug URL",
        type: "text",
        required: true,
        placeholder: "e.g. ddd-hexagonal-architect",
        helper: "URL identitas prompt.",
      },
      {
        name: "type",
        label: "Kategori Prompt",
        type: "chip_select",
        required: true,
        options: [
          { label: "Architecture & DDD", value: "Architecture & DDD" },
          { label: "Distributed Systems", value: "Distributed Systems" },
          { label: "Database Tuning", value: "Database Tuning" },
          { label: "Code Review & Security", value: "Code Review & Security" },
          { label: "Refactoring & Migration", value: "Refactoring & Migration" },
        ],
        helper: "Spesialisasi prompt.",
      },
      {
        name: "target_model",
        label: "Model AI Rekomendasi",
        type: "text",
        placeholder: "e.g. Claude 3.5 Sonnet / GPT-4o",
        options: ["Claude 3.5 Sonnet", "GPT-4o", "DeepSeek-V3", "Claude 3.5 Sonnet / GPT-4o"],
        helper: "Model AI yang dioptimalkan untuk prompt ini.",
      },
      {
        name: "badge",
        label: "Badge Label",
        type: "text",
        placeholder: "e.g. Production Tested, Flagship Prompt, High Accuracy",
        helper: "Label penanda kualitas prompt.",
      },
      {
        name: "description",
        label: "Ringkasan Tujuan Prompt",
        type: "textarea",
        required: true,
        placeholder: "Jelaskan use-case utama dari prompt ini...",
        helper: "Deskripsi singkat yang muncul di kartu katalog prompt.",
      },
      {
        name: "tags",
        label: "Tags",
        type: "tags",
        placeholder: "e.g. Golang, DDD, Microservices, Clean Architecture",
        helper: "Pisahkan dengan koma.",
      },
      {
        name: "instructions",
        label: "Panduan Pemakaian / Variabel Input",
        type: "textarea",
        placeholder: "e.g. Ganti variabel {{DOMAIN_REQUIREMENTS}} dengan spesifikasi Anda...",
        helper: "Panduan cara menggunakan atau mengisi template prompt.",
      },
      {
        name: "prompt_text",
        label: "Isi Prompt Lengkap (System Instruction)",
        type: "markdown",
        required: true,
        helper: "Tuliskan seluruh instruksi prompt di sini.",
      },
      {
        name: "order_index",
        label: "Urutan Tampil",
        type: "number",
        helper: "Nomor urut (1 tampil pertama).",
      },
    ],
  },
  {
    key: "news",
    label: "News & Articles",
    singular: "Artikel Devlog",
    icon: Newspaper,
    description: "Tulisan artikel teknis, catatan arsitektur, dan devlog",
    fields: [
      {
        name: "title",
        label: "Judul Artikel",
        type: "text",
        required: true,
        placeholder: "e.g. Menghadapi Traffic Spike dengan Zero-Downtime Migration",
        helper: "Judul utama artikel.",
      },
      {
        name: "slug",
        label: "Slug URL",
        type: "text",
        required: true,
        placeholder: "e.g. zero-downtime-migration",
        helper: "URL artikel di /news/[slug].",
      },
      {
        name: "cover_image",
        label: "Gambar Sampul (Cover Image)",
        type: "image",
        helper: "Upload gambar sampul untuk artikel ini.",
      },
      {
        name: "category",
        label: "Kategori Artikel",
        type: "chip_select",
        options: [
          { label: "Architecture", value: "Architecture" },
          { label: "Engineering", value: "Engineering" },
          { label: "Devlog", value: "Devlog" },
          { label: "Milestone", value: "Milestone" },
        ],
        helper: "Klasifikasi topik artikel.",
      },
      {
        name: "read_time",
        label: "Waktu Baca",
        type: "text",
        placeholder: "e.g. 5 min read",
        helper: "Perkiraan waktu membaca.",
      },
      {
        name: "excerpt",
        label: "Ringkasan Singkat (Excerpt)",
        type: "textarea",
        required: true,
        placeholder: "Rangkuman 2-3 kalimat mengenai isi artikel...",
        helper: "Akan tampil di kartu artikel dan meta SEO preview.",
      },
      {
        name: "tags",
        label: "Tags",
        type: "tags",
        placeholder: "e.g. Architecture, Golang, DevOps",
        helper: "Pisahkan dengan koma.",
      },
      {
        name: "content",
        label: "Isi Konten Artikel (Markdown)",
        type: "markdown",
        helper: "Tulis konten lengkap menggunakan editor Markdown.",
      },
      {
        name: "published",
        label: "Status Publikasi",
        type: "boolean",
        helper: "Aktifkan agar artikel langsung live di website.",
      },
    ],
  },
  {
    key: "projects",
    label: "Projects Showcase",
    singular: "Project",
    icon: Layers,
    description: "Karya unggulan, studi kasus arsitektur, dan implementasi",
    fields: [
      {
        name: "title",
        label: "Nama Project",
        type: "text",
        required: true,
        placeholder: "e.g. Nexmedis Healthcare AI Platform",
        helper: "Nama project utama.",
      },
      {
        name: "slug",
        label: "Slug URL",
        type: "text",
        required: true,
        placeholder: "e.g. nexmedis-healthcare-ai",
        helper: "Identitas URL project.",
      },
      {
        name: "tagline",
        label: "Tagline Singkat",
        type: "text",
        placeholder: "e.g. Electronic Health Record Platform with Real-time AI Scribe",
        helper: "Penjelasan ringkas 1 baris.",
      },
      {
        name: "image_url",
        label: "Gambar Screenshot / Mockup",
        type: "image",
        helper: "Visual project yang akan tampil di grid portofolio.",
      },
      {
        name: "category",
        label: "Kategori Project",
        type: "text",
        placeholder: "e.g. Backend Architecture, Full Stack, Healthcare AI",
        options: ["Backend Architecture", "Full Stack", "Distributed Systems", "Healthcare AI"],
        helper: "Kategori spesialisasi.",
      },
      {
        name: "tags",
        label: "Tech Stack Tags",
        type: "tags",
        placeholder: "e.g. Next.js, Golang, RabbitMQ, PostgreSQL, Docker",
        helper: "Pisahkan dengan koma.",
      },
      {
        name: "demo_url",
        label: "URL Demo / Live Website",
        type: "text",
        placeholder: "https://...",
        helper: "Tautan ke situs produksi atau staging.",
      },
      {
        name: "github_url",
        label: "URL Repository GitHub",
        type: "text",
        placeholder: "https://github.com/...",
        helper: "Tautan ke kode sumber (jika open source / public).",
      },
      {
        name: "metrics",
        label: "Highlight Metrik / Pencapaian",
        type: "text",
        placeholder: "e.g. -35% Latency, 99.9% Uptime, 10k+ MAU",
        helper: "Pencapaian terukur yang menonjolkan dampak engineering Anda.",
      },
      {
        name: "featured",
        label: "Featured di Halaman Utama",
        type: "boolean",
        helper: "Tampilkan di baris teratas beranda sebagai project utama.",
      },
      {
        name: "description",
        label: "Studi Kasus Lengkap (Markdown)",
        type: "markdown",
        required: true,
        helper: "Ceritakan arsitektur, tantangan, dan solusi teknis yang Anda terapkan.",
      },
      {
        name: "order_index",
        label: "Urutan Tampil",
        type: "number",
        helper: "Nomor urut (1 tampil terdepan).",
      },
    ],
  },
  {
    key: "products",
    label: "Products & SaaS",
    singular: "Produk",
    icon: Boxes,
    description: "Koleksi tools, library, dan produk digital yang dirilis",
    fields: [
      {
        name: "name",
        label: "Nama Produk",
        type: "text",
        required: true,
        placeholder: "e.g. GopherMQ Studio",
        helper: "Nama resmi produk atau tools.",
      },
      {
        name: "slug",
        label: "Slug URL",
        type: "text",
        required: true,
        placeholder: "e.g. gophermq-studio",
        helper: "URL identitas produk.",
      },
      {
        name: "headline",
        label: "Headline / Value Proposition",
        type: "text",
        required: true,
        placeholder: "e.g. High-throughput RabbitMQ message visualizer & load simulator",
        helper: "Pernyataan nilai produk untuk pengguna.",
      },
      {
        name: "status",
        label: "Status Produk",
        type: "chip_select",
        options: [
          { label: "🟢 Live", value: "Live" },
          { label: "⚡ Beta", value: "Beta" },
          { label: "🛠️ In Development", value: "In Development" },
          { label: "💡 Concept", value: "Concept" },
        ],
        helper: "Kondisi tahap pengembangan saat ini.",
      },
      {
        name: "pricing_type",
        label: "Model Distribusi / Harga",
        type: "chip_select",
        options: [
          { label: "Open Source", value: "Open Source" },
          { label: "Free", value: "Free" },
          { label: "Freemium", value: "Freemium" },
          { label: "Commercial", value: "Commercial" },
        ],
        helper: "Lisensi atau model bisnis.",
      },
      {
        name: "badge",
        label: "Badge Label",
        type: "text",
        placeholder: "e.g. v1.2, Popular, Trending",
        helper: "Label pemanis di sudut kartu.",
      },
      {
        name: "icon_name",
        label: "Nama Icon",
        type: "text",
        placeholder: "e.g. Network, Cpu, Layers3, Boxes",
        helper: "Nama icon visual.",
      },
      {
        name: "product_url",
        label: "URL Website Produk",
        type: "text",
        placeholder: "https://...",
        helper: "Link ke halaman web produk.",
      },
      {
        name: "github_url",
        label: "URL GitHub Repository",
        type: "text",
        placeholder: "https://github.com/...",
        helper: "Link ke repo open-source.",
      },
      {
        name: "description",
        label: "Deskripsi Produk",
        type: "textarea",
        required: true,
        placeholder: "Jelaskan fitur-fitur utama dan kapabilitas produk...",
        helper: "Deskripsi mendalam mengenai keunggulan produk.",
      },
      {
        name: "order_index",
        label: "Urutan Tampil",
        type: "number",
        helper: "Nomor urut tampil.",
      },
    ],
  },
  {
    key: "stacks",
    label: "Tech Stacks",
    singular: "Tech Stack",
    icon: Layers,
    description: "Kelompok keahlian teknologi dan arsitektur sistem",
    fields: [
      {
        name: "title",
        label: "Kategori Keahlian",
        type: "text",
        required: true,
        placeholder: "e.g. Backend Engineering & Microservices",
        helper: "Nama pilar kompetensi teknis.",
      },
      {
        name: "icon_name",
        label: "Nama Icon",
        type: "text",
        placeholder: "ServerCog, Braces, Network, Database, Workflow",
        helper: "Icon visual pilar ini.",
      },
      {
        name: "note",
        label: "Deskripsi Catatan",
        type: "textarea",
        required: true,
        placeholder: "Pengalaman mendalam membangun layanan skala besar...",
        helper: "Penjelasan ringkas kapabilitas pada pilar ini.",
      },
      {
        name: "tags",
        label: "Daftar Teknologi",
        type: "tags",
        placeholder: "e.g. Golang, PostgreSQL, Redis, RabbitMQ, Docker, Kubernetes",
        helper: "Pisahkan dengan koma.",
      },
      {
        name: "grid_span",
        label: "Ukuran Grid Layout",
        type: "text",
        placeholder: "e.g. lg:col-span-3 atau lg:col-span-2",
        helper: "Ukuran lebar kolom di tampilan grid beranda.",
      },
      {
        name: "order_index",
        label: "Urutan Tampil",
        type: "number",
        helper: "Nomor urut tampil.",
      },
    ],
  },
  {
    key: "experiences",
    label: "Work Experience",
    singular: "Pengalaman Kerja",
    icon: Briefcase,
    description: "Riwayat karir profesional dan kontribusi engineering",
    fields: [
      {
        name: "role",
        label: "Posisi / Jabatan",
        type: "text",
        required: true,
        placeholder: "e.g. Senior Backend Engineer",
        helper: "Nama peran atau posisi kerja.",
      },
      {
        name: "company",
        label: "Nama Perusahaan",
        type: "text",
        required: true,
        placeholder: "e.g. Nexmedis",
        helper: "Nama instansi/perusahaan tempat Anda berkarya.",
      },
      {
        name: "brand",
        label: "Tipe Pekerjaan",
        type: "text",
        required: true,
        placeholder: "e.g. Nexmedis · Full-time",
        helper: "Format label brand & tipe komitmen.",
      },
      {
        name: "period",
        label: "Periode Waktu",
        type: "text",
        required: true,
        placeholder: "e.g. MAR 2025 — PRESENT",
        helper: "Masa kerja dari bulan/tahun awal hingga selesai.",
      },
      {
        name: "url",
        label: "Website Perusahaan",
        type: "text",
        placeholder: "https://...",
        helper: "Link ke situs perusahaan.",
      },
      {
        name: "detail",
        label: "Detail Pekerjaan & Pencapaian",
        type: "textarea",
        required: true,
        placeholder: "Memimpin arsitektur sistem pesan distributed event-driven...",
        helper: "Pencapaian utama dan sistem yang Anda bangun.",
      },
      {
        name: "tags",
        label: "Tech Stack yang Digunakan",
        type: "tags",
        placeholder: "e.g. Golang, RabbitMQ, Docker, Kubernetes",
        helper: "Pisahkan dengan koma.",
      },
      {
        name: "order_index",
        label: "Urutan Tampil",
        type: "number",
        helper: "Urutan kronologis (1 untuk posisi terbaru).",
      },
    ],
  },
  {
    key: "educations",
    label: "Education History",
    singular: "Riwayat Pendidikan",
    icon: GraduationCap,
    description: "Latar belakang akademik dan sertifikasi formal",
    fields: [
      {
        name: "institution",
        label: "Institusi / Universitas",
        type: "text",
        required: true,
        placeholder: "e.g. Universitas Indonesia",
        helper: "Nama universitas atau akademi.",
      },
      {
        name: "degree",
        label: "Gelar / Program Studi",
        type: "text",
        required: true,
        placeholder: "e.g. Bachelor of Computer Science (S.Kom)",
        helper: "Tingkat pendidikan dan jurusan.",
      },
      {
        name: "period",
        label: "Periode Studi",
        type: "text",
        required: true,
        placeholder: "e.g. 2020 — 2024",
        helper: "Tahun awal hingga kelulusan.",
      },
      {
        name: "detail",
        label: "Fokus Studi & Catatan",
        type: "textarea",
        placeholder: "Konsentrasi pada Rekayasa Perangkat Lunak dan Sistem Terdistribusi...",
        helper: "Pencapaian akademik, IPK, atau fokus riset.",
      },
      {
        name: "order_index",
        label: "Urutan Tampil",
        type: "number",
        helper: "Nomor urut tampil.",
      },
    ],
  },
  {
    key: "impact",
    label: "Impact Metrics",
    singular: "Metrik Dampak",
    icon: TrendingUp,
    description: "Statistik dampak nyata dan pembuktian performa sistem",
    fields: [
      {
        name: "metric",
        label: "Angka Metrik",
        type: "text",
        required: true,
        placeholder: "e.g. -35%, +70%, 99.99%",
        helper: "Angka kuantitatif yang mencolok.",
      },
      {
        name: "title",
        label: "Judul Pencapaian",
        type: "text",
        required: true,
        placeholder: "e.g. Latency Reduction in Event Broker",
        helper: "Satu kalimat penjelas apa yang berhasil dicapai.",
      },
      {
        name: "detail",
        label: "Keterangan Konteks",
        type: "textarea",
        required: true,
        placeholder: "Dioptimalkan melalui implementasi concurrent connection pooling...",
        helper: "Penjelasan teknis bagaimana angka tersebut diraih.",
      },
      {
        name: "order_index",
        label: "Urutan Tampil",
        type: "number",
        helper: "Urutan posisi kartu metrik.",
      },
    ],
  },
];

// Reusable Pagination Component
function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  if (totalItems <= pageSize) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-slate-50/90 border-t border-slate-200 text-xs">
      <div className="text-slate-500 font-medium">
        Menampilkan <span className="font-bold text-slate-800">{startIdx}</span> -{" "}
        <span className="font-bold text-slate-800">{endIdx}</span> dari{" "}
        <span className="font-bold text-slate-800">{totalItems}</span> data
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition shadow-2xs"
        >
          ← Sebelumnya
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
          if (
            totalPages > 7 &&
            p !== 1 &&
            p !== totalPages &&
            Math.abs(p - currentPage) > 1
          ) {
            if (p === 2 || p === totalPages - 1) {
              return (
                <span key={p} className="px-1 text-slate-400">
                  ...
                </span>
              );
            }
            return null;
          }

          const isActive = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`grid h-8 w-8 place-items-center rounded-xl font-bold transition text-xs ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition shadow-2xs"
        >
          Selanjutnya →
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabKey>("courses");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 8;
  const COURSES_PER_PAGE = 6;

  // Selected Course for Detail Drill-down View ("judul diklik detail baru tampil sub bab")
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

  // Cached relational data for courses, modules, and lessons
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [allModules, setAllModules] = useState<any[]>([]);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [entityCounts, setEntityCounts] = useState<Partial<Record<TabKey, number>>>({});

  // Modal / Drawer State
  const [modalEntity, setModalEntity] = useState<TabKey>("courses");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeFormTab, setActiveFormTab] = useState<"meta" | "markdown">("meta");
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("refa_admin_key");
    if (saved) {
      setAdminKey(saved);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchItems();
      fetchTutorialRelations();
    }
  }, [isAuthenticated, activeTab]);

  // Reset pagination and drill-down when activeTab changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedCourseId(null);
  }, [activeTab]);

  // Reset pagination when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretKey: inputKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login gagal");
      }
      localStorage.setItem("refa_admin_key", inputKey);
      setAdminKey(inputKey);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("refa_admin_key");
    setAdminKey("");
    setIsAuthenticated(false);
  };

  // Fetch relations for Course, Module, and Lesson tree
  const fetchTutorialRelations = async () => {
    if (!adminKey) return;
    try {
      const [resCourses, resModules, resLessons] = await Promise.all([
        fetch("/api/admin/courses", { headers: { "x-admin-key": adminKey } }),
        fetch("/api/admin/modules", { headers: { "x-admin-key": adminKey } }),
        fetch("/api/admin/lessons", { headers: { "x-admin-key": adminKey } }),
      ]);
      if (resCourses.ok) {
        const cData = await resCourses.json();
        if (Array.isArray(cData)) {
          setAllCourses(cData);
          setEntityCounts((prev) => ({ ...prev, courses: cData.length }));
        }
      }
      if (resModules.ok) {
        const mData = await resModules.json();
        if (Array.isArray(mData)) {
          setAllModules(mData);
          setEntityCounts((prev) => ({ ...prev, modules: mData.length }));
        }
      }
      if (resLessons.ok) {
        const lData = await resLessons.json();
        if (Array.isArray(lData)) {
          setAllLessons(lData);
          setEntityCounts((prev) => ({ ...prev, lessons: lData.length }));
        }
      }
    } catch {
      // Ignore background relation load errors
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/${activeTab}`, {
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memuat data dari database");
      }
      const loaded = Array.isArray(data) ? data : [];
      setItems(loaded);
      setEntityCounts((prev) => ({ ...prev, [activeTab]: loaded.length }));
    } catch (err: any) {
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const currentTabConfig = useMemo(() => {
    return TABS.find((t) => t.key === activeTab) || TABS[0];
  }, [activeTab]);

  const modalEntityConfig = useMemo(() => {
    return TABS.find((t) => t.key === modalEntity) || currentTabConfig;
  }, [modalEntity, currentTabConfig]);

  // Lookup maps to replace raw UUIDs with friendly readable titles
  const courseMap = useMemo(() => {
    const map = new Map<string, string>();
    allCourses.forEach((c) => map.set(c.id, c.title));
    return map;
  }, [allCourses]);

  const moduleMap = useMemo(() => {
    const map = new Map<string, string>();
    allModules.forEach((m) => map.set(m.id, m.title));
    return map;
  }, [allModules]);

  // Compute hierarchical tree for courses -> modules -> lessons
  const courseTree = useMemo(() => {
    return allCourses.map((course) => {
      const courseModules = allModules
        .filter((m) => m.course_id === course.id)
        .sort((a, b) => (Number(a.order_index) || 0) - (Number(b.order_index) || 0));

      const modulesWithLessons = courseModules.map((mod) => {
        const modLessons = allLessons
          .filter((l) => l.module_id === mod.id || (!l.module_id && l.course_id === course.id))
          .sort((a, b) => (Number(a.order_index) || 0) - (Number(b.order_index) || 0));
        return {
          ...mod,
          lessons: modLessons,
        };
      });

      const totalLessonsCount = modulesWithLessons.reduce(
        (sum, m) => sum + m.lessons.length,
        0
      );

      return {
        ...course,
        modules: modulesWithLessons,
        totalLessons: totalLessonsCount,
      };
    });
  }, [allCourses, allModules, allLessons]);

  // Get currently selected course for drill-down view
  const activeSelectedCourse = useMemo(() => {
    if (!selectedCourseId) return null;
    return courseTree.find((c) => c.id === selectedCourseId) || null;
  }, [courseTree, selectedCourseId]);

  // Has markdown field?
  const hasMarkdownField = useMemo(() => {
    return modalEntityConfig.fields.some((f) => f.type === "markdown");
  }, [modalEntityConfig]);

  // Generic modal openers that can target any entity
  const openCreateModalForEntity = (entity: TabKey, defaultValues: Record<string, any> = {}) => {
    setModalEntity(entity);
    setEditingItem(null);
    setActiveFormTab("meta");
    const targetConfig = TABS.find((t) => t.key === entity) || currentTabConfig;
    const initial: Record<string, any> = {};

    targetConfig.fields.forEach((f) => {
      if (f.type === "boolean") initial[f.name] = true;
      else if (f.type === "number") initial[f.name] = 1;
      else if (f.type === "tags") initial[f.name] = "";
      else if (f.name === "type" && f.options && Array.isArray(f.options)) {
        const firstOpt = f.options[0];
        initial[f.name] = typeof firstOpt === "string" ? firstOpt : firstOpt.value;
      } else if (f.name === "level") {
        initial[f.name] = "Intermediate — Advanced";
      } else if (f.name === "status") {
        initial[f.name] = "Live";
      } else if (f.name === "pricing_type") {
        initial[f.name] = "Open Source";
      } else {
        initial[f.name] = "";
      }
    });

    Object.assign(initial, defaultValues);
    setFormData(initial);
    setIsModalOpen(true);
  };

  const openEditModalForEntity = (entity: TabKey, item: any) => {
    setModalEntity(entity);
    setEditingItem(item);
    setActiveFormTab("meta");
    const targetConfig = TABS.find((t) => t.key === entity) || currentTabConfig;
    const formatted: Record<string, any> = { ...item };
    targetConfig.fields.forEach((f) => {
      if (f.type === "tags" && Array.isArray(item[f.name])) {
        formatted[f.name] = item[f.name].join(", ");
      }
    });
    setFormData(formatted);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    openCreateModalForEntity(activeTab);
  };

  const openEditModal = (item: any) => {
    openEditModalForEntity(activeTab, item);
  };

  const handleDeleteEntity = async (entity: TabKey, id: string, title?: string) => {
    const config = TABS.find((t) => t.key === entity) || currentTabConfig;
    if (
      !confirm(
        `Apakah Anda yakin ingin menghapus ${config.singular} ${
          title ? `"${title}"` : "ini"
        }?`
      )
    ) {
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/admin/${entity}/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus");
      }
      setSuccessMsg(`Berhasil menghapus ${config.singular}!`);
      setTimeout(() => setSuccessMsg(null), 3500);

      // If deleted course was the selected one, reset view
      if (entity === "courses" && selectedCourseId === id) {
        setSelectedCourseId(null);
      }

      fetchItems();
      fetchTutorialRelations();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = (id: string, title?: string) => {
    handleDeleteEntity(activeTab, id, title);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload: Record<string, any> = {};
    modalEntityConfig.fields.forEach((f) => {
      const val = formData[f.name];
      if (f.type === "tags") {
        payload[f.name] =
          typeof val === "string"
            ? val
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : Array.isArray(val)
            ? val
            : [];
      } else if (f.type === "number") {
        payload[f.name] = val !== "" && !isNaN(Number(val)) ? Number(val) : 0;
      } else if (f.type === "boolean") {
        payload[f.name] = Boolean(val);
      } else {
        payload[f.name] = val !== undefined && val !== "" ? val : null;
      }
    });

    try {
      const url = editingItem
        ? `/api/admin/${modalEntity}/${editingItem.id}`
        : `/api/admin/${modalEntity}`;
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan perubahan");
      }

      setSuccessMsg(
        editingItem
          ? `Berhasil memperbarui ${modalEntityConfig.singular}!`
          : `Berhasil menambahkan ${modalEntityConfig.singular} baru!`
      );
      setTimeout(() => setSuccessMsg(null), 3500);
      setIsModalOpen(false);
      fetchItems();
      fetchTutorialRelations();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Toggle module collapse in tree view
  const toggleModuleCollapse = (moduleId: string) => {
    setCollapsedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // Client-side quick search filter
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      const textToMatch = [
        item.title,
        item.name,
        item.slug,
        item.role,
        item.institution,
        item.metric,
        item.tagline,
        item.headline,
        item.category,
        item.type,
        courseMap.get(item.course_id),
        moduleMap.get(item.module_id),
        ...(Array.isArray(item.tags) ? item.tags : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return textToMatch.includes(q);
    });
  }, [items, searchQuery, courseMap, moduleMap]);

  // Paginated items for standard tables
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage, ITEMS_PER_PAGE]);

  // Paginated course cards for courses list view
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courseTree;
    const q = searchQuery.toLowerCase().trim();
    return courseTree.filter((c) => {
      const match = [c.title, c.slug, c.tagline, c.category, c.level, c.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return match.includes(q);
    });
  }, [courseTree, searchQuery]);

  const totalCoursePages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE) || 1;
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * COURSES_PER_PAGE;
    return filteredCourses.slice(start, start + COURSES_PER_PAGE);
  }, [filteredCourses, currentPage, COURSES_PER_PAGE]);

  // Auth Gate
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b15] px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-8 backdrop-blur-2xl text-white shadow-2xl">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3">
              <Image
                src="/logo-light.png"
                alt="mrefawm"
                width={150}
                height={50}
                priority
                className="h-9 w-auto object-contain"
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Admin Management Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Dokploy PostgreSQL Hybrid Content Engine</p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-500/40 p-3 text-xs text-red-200">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1.5 font-bold">
                Admin Secret Key
              </label>
              <input
                type="password"
                placeholder="Masukkan kode rahasia admin..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                required
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110 active:scale-[0.98]"
            >
              Buka Dashboard Admin
            </button>
            <div className="text-center pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:underline"
              >
                <ArrowLeft size={13} /> Kembali ke Portofolio
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      {/* SIDEBAR NAVIGATION */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSearchQuery("");
          setSelectedCourseId(null);
        }}
        counts={entityCounts}
        onLogout={handleLogout}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* MAIN CONTENT AREA */}
      <div className="lg:pl-64 xl:pl-72 flex flex-col min-h-screen">
        {/* Top Header Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 sm:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpenMobile(true)}
              className="lg:hidden grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
              title="Buka Menu"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400 hidden sm:inline">Admin Portal</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <button
                onClick={() => setSelectedCourseId(null)}
                className={`font-bold flex items-center gap-1.5 transition ${
                  selectedCourseId
                    ? "text-blue-600 hover:underline"
                    : "text-slate-900"
                }`}
              >
                <currentTabConfig.icon size={15} className="text-blue-600" />
                {currentTabConfig.label}
              </button>
              {activeSelectedCourse && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                    {activeSelectedCourse.title}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                fetchItems();
                fetchTutorialRelations();
              }}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs disabled:opacity-60"
            >
              <RefreshCw size={13} className={loading ? "animate-spin text-blue-600" : ""} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:brightness-105 active:scale-95"
            >
              <Plus size={15} />
              <span>Tambah {currentTabConfig.singular}</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Notifications */}
          {error && (
            <div className="flex items-center justify-between rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs sm:text-sm text-rose-700 shadow-xs">
              <div className="flex items-center gap-2.5">
                <AlertCircle size={18} className="shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="grid h-6 w-6 place-items-center rounded-md text-rose-400 hover:text-rose-700"
              >
                ✕
              </button>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs sm:text-sm text-emerald-800 shadow-xs animate-in fade-in">
              <CheckCircle size={18} className="shrink-0 text-emerald-600" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* EDUCATIONAL BANNER: JELASIN KURSUS, BAB, DAN PELAJARAN */}
          {(activeTab === "courses" || activeTab === "modules" || activeTab === "lessons") && (
            <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white p-5 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-blue-600 text-white font-bold">
                  <Info size={16} />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        Panduan Konsep: Kursus ➔ Modul Bab ➔ Pelajaran / Lessons
                      </h3>
                      <span className="rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5">
                        Coursera Architecture
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    <div className="rounded-xl border border-blue-100 bg-white/85 p-3 shadow-2xs">
                      <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                        <BookOpen size={14} className="text-blue-600" />
                        1. Track Kursus
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        <strong>Program / Mata Kuliah Utama.</strong> Menampung judul kurikulum besar, silabus lengkap, tingkat kesulitan, dan badge.
                      </p>
                    </div>

                    <div className="rounded-xl border border-indigo-100 bg-white/85 p-3 shadow-2xs">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-xs">
                        <FolderGit2 size={14} className="text-indigo-600" />
                        2. Modul Bab (Chapters)
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        <strong>Bab Pengelompok Topik.</strong> Berfungsi membagi materi kursus ke dalam bab terstruktur (Bab 1: Dasar, Bab 2: Desain Pola, dst).
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-white/85 p-3 shadow-2xs">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                        <Bookmark size={14} className="text-emerald-600" />
                        3. Pelajaran / Lessons
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        <strong>Isi Materi Sebenarnya!</strong> Artikel bacaan & latihan koding Markdown yang dibaca pengunjung website di setiap bab, lengkap dengan durasi baca.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1. VIEW A: DETAIL DRILL-DOWN VIEW (Tampil saat judul kursus diklik) */}
          {activeTab === "courses" && activeSelectedCourse ? (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Back button and quick actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedCourseId(null)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs self-start"
                >
                  <ArrowLeft size={14} /> Kembali ke Daftar Semua Kursus
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/tutorials/${activeSelectedCourse.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                  >
                    <span>Lihat Live Web</span> <ExternalLink size={12} />
                  </Link>
                  <button
                    onClick={() => {
                      openCreateModalForEntity("modules", {
                        course_id: activeSelectedCourse.id,
                        order_index: activeSelectedCourse.modules.length + 1,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
                  >
                    <Plus size={14} /> Tambah Bab Baru ke Kursus Ini
                  </button>
                </div>
              </div>

              {/* Course Detail Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
                {/* Course Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-start gap-3.5">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20">
                      <BookOpen size={24} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                          {activeSelectedCourse.title}
                        </h2>
                        {activeSelectedCourse.badge && (
                          <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                            {activeSelectedCourse.badge}
                          </span>
                        )}
                        {activeSelectedCourse.level && (
                          <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                            {activeSelectedCourse.level}
                          </span>
                        )}
                        {activeSelectedCourse.published ? (
                          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                            🟢 Live di Web
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                            ⚪ Draft
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                        {activeSelectedCourse.tagline || activeSelectedCourse.description}
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1 text-slate-700 font-semibold">
                          <FolderGit2 size={13} className="text-blue-600" />
                          {activeSelectedCourse.modules.length} Bab Modul
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-700 font-semibold">
                          <Bookmark size={13} className="text-emerald-600" />
                          {activeSelectedCourse.totalLessons} Materi Pelajaran
                        </span>
                        <span>•</span>
                        <span className="font-mono text-slate-400">
                          /tutorials/{activeSelectedCourse.slug}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditModalForEntity("courses", activeSelectedCourse)}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                      title="Edit Detail Kursus"
                    >
                      <Edit2 size={13} /> Edit Kursus
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteEntity(
                          "courses",
                          activeSelectedCourse.id,
                          activeSelectedCourse.title
                        )
                      }
                      className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Hapus Kursus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Sub Bab & Lessons Hierarchy */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Daftar Bab & Materi Pelajaran di Kursus Ini</span>
                    <span>{activeSelectedCourse.modules.length} Bab Terdaftar</span>
                  </div>

                  {activeSelectedCourse.modules.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center space-y-2">
                      <p className="text-xs text-slate-600 font-medium">
                        Belum ada Bab Modul di kursus ini.
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Klik tombol &quot;Tambah Bab Baru ke Kursus Ini&quot; untuk membuat bab kurikulum pertama.
                      </p>
                      <button
                        onClick={() => {
                          openCreateModalForEntity("modules", {
                            course_id: activeSelectedCourse.id,
                            order_index: 1,
                          });
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
                      >
                        <Plus size={13} /> Tambah Bab Pertama
                      </button>
                    </div>
                  ) : (
                    activeSelectedCourse.modules.map((mod: any, modIdx: number) => {
                      const isCollapsed = Boolean(collapsedModules[mod.id]);

                      return (
                        <div
                          key={mod.id}
                          className="rounded-2xl border border-slate-200/90 bg-slate-50/60 overflow-hidden shadow-2xs"
                        >
                          {/* Bab Header */}
                          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-100/80 border-b border-slate-200/80">
                            <div
                              onClick={() => toggleModuleCollapse(mod.id)}
                              className="flex items-center gap-2.5 cursor-pointer select-none min-w-0"
                            >
                              <button
                                type="button"
                                className="text-slate-400 hover:text-slate-700"
                              >
                                {isCollapsed ? (
                                  <ChevronRight size={15} />
                                ) : (
                                  <ChevronDown size={15} />
                                )}
                              </button>
                              <span className="grid h-6 w-6 place-items-center rounded-lg bg-blue-600 text-white font-mono text-[10px] font-bold shrink-0">
                                {mod.order_index || modIdx + 1}
                              </span>
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                  Bab {mod.order_index || modIdx + 1}: {mod.title}
                                </span>
                                <span className="ml-2 font-mono text-[10px] text-slate-400 hidden sm:inline">
                                  /{mod.slug}
                                </span>
                              </div>
                              <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600 shrink-0">
                                {mod.lessons.length} Pelajaran
                              </span>
                            </div>

                            {/* Bab Action Buttons */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => {
                                  openCreateModalForEntity("lessons", {
                                    course_id: activeSelectedCourse.id,
                                    module_id: mod.id,
                                    order_index: mod.lessons.length + 1,
                                  });
                                }}
                                className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-indigo-700 transition"
                              >
                                <Plus size={11} /> Tambah Pelajaran
                              </button>
                              <button
                                onClick={() => openEditModalForEntity("modules", mod)}
                                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                                title="Edit Bab"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteEntity("modules", mod.id, mod.title)
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition"
                                title="Hapus Bab"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Lessons list in this Bab */}
                          {!isCollapsed && (
                            <div className="p-3 sm:p-4 space-y-2">
                              {mod.lessons.length === 0 ? (
                                <div className="py-4 text-center text-xs text-slate-400 italic bg-white/70 rounded-xl border border-dashed border-slate-200">
                                  Belum ada materi pelajaran di bab ini. Klik tombol{" "}
                                  <span className="font-semibold text-indigo-600">
                                    &quot;+ Tambah Pelajaran&quot;
                                  </span>{" "}
                                  di atas untuk menulis artikel materi Markdown.
                                </div>
                              ) : (
                                mod.lessons.map((lesson: any) => (
                                  <div
                                    key={lesson.id}
                                    className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200/70 shadow-2xs hover:border-blue-300 hover:shadow-xs transition"
                                  >
                                    <div className="flex items-start gap-3 min-w-0">
                                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 border border-slate-200/80 text-sm shrink-0 mt-0.5">
                                        {lesson.type === "code"
                                          ? "💻"
                                          : lesson.type === "architecture"
                                          ? "🏗️"
                                          : "📖"}
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                            {lesson.title}
                                          </span>
                                          <span
                                            className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                                              lesson.published
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : "bg-amber-50 text-amber-700 border border-amber-200"
                                            }`}
                                          >
                                            {lesson.published ? "Live" : "Draft"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                          <span className="font-medium text-slate-500">
                                            {lesson.duration || "10 min read"}
                                          </span>
                                          <span>•</span>
                                          <span className="capitalize font-medium text-slate-500">
                                            Tipe: {lesson.type || "reading"}
                                          </span>
                                          <span>•</span>
                                          <span className="font-mono text-slate-400">
                                            /{lesson.slug}
                                          </span>
                                        </div>
                                        {lesson.excerpt && (
                                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 max-w-xl">
                                            {lesson.excerpt}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Lesson Action Buttons */}
                                    <div className="flex items-center gap-1 shrink-0 ml-3">
                                      <Link
                                        href={`/tutorials/${activeSelectedCourse.slug}/${lesson.slug}`}
                                        target="_blank"
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                        title="Lihat di Web Live"
                                      >
                                        <ExternalLink size={13} />
                                      </Link>
                                      <button
                                        onClick={() =>
                                          openEditModalForEntity("lessons", lesson)
                                        }
                                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition"
                                        title="Edit Materi & Markdown"
                                      >
                                        <Edit2 size={12} />
                                        <span className="hidden sm:inline">Edit Markdown</span>
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteEntity(
                                            "lessons",
                                            lesson.id,
                                            lesson.title
                                          )
                                        }
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                        title="Hapus Pelajaran"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === "courses" ? (
            /* 2. VIEW B: COURSES CATALOG VIEW (Tampilan Bersih Awal, Judul Diklik untuk Lihat Detail) */
            <div className="space-y-4">
              {/* Header Search & Stats Banner */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                      {currentTabConfig.label}
                    </h1>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200/60 font-mono">
                      {filteredCourses.length} kursus
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Klik pada judul kursus atau tombol &quot;Detail & Kurikulum&quot; untuk membuka daftar Bab dan Pelajaran.
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Cari kursus..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Courses Grid / Cards */}
              {loading ? (
                <div className="p-16 text-center space-y-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
                  <p className="text-xs font-semibold text-slate-500">
                    Memuat daftar kursus...
                  </p>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="p-16 text-center rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {searchQuery
                      ? `Tidak ada kursus untuk "${searchQuery}"`
                      : "Belum ada Track Kursus"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    {searchQuery
                      ? "Gunakan kata kunci pencarian yang lain."
                      : "Klik tombol Tambah Track Kursus di kanan atas untuk membuat kursus pertama."}
                  </p>
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Reset Pencarian
                    </button>
                  ) : (
                    <button
                      onClick={() => openCreateModalForEntity("courses")}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                    >
                      <Plus size={14} /> Tambah Track Kursus Pertama
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3.5">
                  {paginatedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div
                            onClick={() => setSelectedCourseId(course.id)}
                            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20 cursor-pointer group-hover:scale-105 transition"
                            title="Klik untuk membuka detail & bab"
                          >
                            <BookOpen size={24} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2
                                onClick={() => setSelectedCourseId(course.id)}
                                className="text-base sm:text-lg font-black text-slate-900 leading-snug cursor-pointer hover:text-blue-600 transition"
                              >
                                {course.title}
                              </h2>
                              {course.badge && (
                                <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                                  {course.badge}
                                </span>
                              )}
                              {course.level && (
                                <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                                  {course.level}
                                </span>
                              )}
                              {course.published ? (
                                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                                  🟢 Live di Web
                                </span>
                              ) : (
                                <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                                  ⚪ Draft
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 max-w-2xl leading-relaxed">
                              {course.tagline || course.description}
                            </p>
                            <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400 font-medium">
                              <span className="flex items-center gap-1 text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                                <FolderGit2 size={12} className="text-blue-600" />
                                {course.modules.length} Bab Modul
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                                <Bookmark size={12} className="text-emerald-600" />
                                {course.totalLessons} Materi Pelajaran
                              </span>
                              <span>•</span>
                              <span className="font-mono text-slate-400">
                                /tutorials/{course.slug}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <Link
                            href={`/tutorials/${course.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition shadow-2xs"
                            title="Lihat Halaman Publik di Web"
                          >
                            <ExternalLink size={15} />
                          </Link>
                          <button
                            onClick={() => openEditModalForEntity("courses", course)}
                            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition shadow-2xs"
                            title="Edit Detail Kursus"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteEntity("courses", course.id, course.title)
                            }
                            className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition shadow-2xs"
                            title="Hapus Kursus"
                          >
                            <Trash2 size={15} />
                          </button>
                          <button
                            onClick={() => setSelectedCourseId(course.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
                          >
                            <span>Detail & Kurikulum</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Course Cards Pagination */}
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalCoursePages}
                      totalItems={filteredCourses.length}
                      pageSize={COURSES_PER_PAGE}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 3. VIEW C: STANDARD TABLE VIEW WITH PAGINATION (Untuk semua tab lain: Prompts, News, Projects, Modules, Lessons, dll) */
            <div className="space-y-4">
              {/* Header Search Banner */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                      {currentTabConfig.label}
                    </h1>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200/60 font-mono">
                      {filteredItems.length} item
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{currentTabConfig.description}</p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder={`Cari di ${currentTabConfig.label.toLowerCase()}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Items Table Card */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {loading ? (
                  <div className="p-16 text-center space-y-3">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
                    <p className="text-xs font-semibold text-slate-500">
                      Memuat data {currentTabConfig.label}...
                    </p>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
                      <currentTabConfig.icon size={22} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">
                      {searchQuery
                        ? `Tidak ada hasil untuk "${searchQuery}"`
                        : `Belum ada ${currentTabConfig.singular}`}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      {searchQuery
                        ? "Coba gunakan kata kunci pencarian yang lain."
                        : `Klik tombol "Tambah ${currentTabConfig.singular}" di kanan atas untuk membuat data baru.`}
                    </p>
                    {searchQuery ? (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        Reset Pencarian
                      </button>
                    ) : (
                      <button
                        onClick={openCreateModal}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                      >
                        <Plus size={14} /> Tambah {currentTabConfig.singular} Pertama
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          <tr>
                            <th className="px-6 py-4">Judul / Entitas Utama</th>
                            <th className="px-6 py-4">Kategori & Relasi</th>
                            <th className="px-6 py-4">Tags & Atribut</th>
                            <th className="px-6 py-4 text-center">Urutan</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedItems.map((item) => {
                            const primaryTitle =
                              item.title ||
                              item.name ||
                              item.role ||
                              item.institution ||
                              item.metric ||
                              "Tanpa Judul";
                            const subtitle =
                              item.tagline ||
                              item.headline ||
                              item.description ||
                              item.company ||
                              item.degree ||
                              item.note ||
                              item.excerpt ||
                              "";
                            const tags = item.tags || (item.category ? [item.category] : []);

                            // Friendly relation info
                            const relatedCourseTitle = item.course_id
                              ? courseMap.get(item.course_id)
                              : null;
                            const relatedModuleTitle = item.module_id
                              ? moduleMap.get(item.module_id)
                              : null;

                            return (
                              <tr key={item.id} className="hover:bg-slate-50/80 transition group">
                                {/* Col 1: Primary Title + Image/Slug */}
                                <td className="px-6 py-4">
                                  <div className="flex items-start gap-3">
                                    {(item.cover_image || item.image_url) && (
                                      /* eslint-disable-next-line @next/next/no-img-element */
                                      <img
                                        src={item.cover_image || item.image_url}
                                        alt={primaryTitle}
                                        className="h-11 w-14 shrink-0 rounded-xl object-cover border border-slate-200 shadow-2xs mt-0.5"
                                      />
                                    )}
                                    <div className="min-w-0">
                                      <div className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                                        {primaryTitle}
                                      </div>
                                      {subtitle && (
                                        <div className="text-slate-500 text-xs mt-0.5 line-clamp-1 max-w-md">
                                          {subtitle}
                                        </div>
                                      )}
                                      {item.slug && (
                                        <div className="flex items-center gap-1.5 mt-1">
                                          <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                                            /{item.slug}
                                          </span>
                                          {activeTab === "lessons" && item.course_id && (
                                            <Link
                                              href={`/tutorials/${
                                                courseMap.get(item.course_id) || item.course_id
                                              }/${item.slug}`}
                                              target="_blank"
                                              className="text-[10px] text-blue-600 hover:underline inline-flex items-center gap-0.5"
                                            >
                                              Live <ExternalLink size={9} />
                                            </Link>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Col 2: Relasi & Kategori */}
                                <td className="px-6 py-4">
                                  <div className="space-y-1 max-w-xs">
                                    {relatedCourseTitle && (
                                      <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-lg">
                                        <BookOpen size={10} className="shrink-0 text-blue-600" />
                                        <span className="truncate">{relatedCourseTitle}</span>
                                      </div>
                                    )}
                                    {relatedModuleTitle && (
                                      <div className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg ml-0.5">
                                        <FolderGit2 size={10} className="shrink-0 text-slate-500" />
                                        <span className="truncate">{relatedModuleTitle}</span>
                                      </div>
                                    )}

                                    {!relatedCourseTitle && !relatedModuleTitle && (
                                      <div className="text-xs text-slate-600 font-medium">
                                        {item.type ||
                                          item.brand ||
                                          item.period ||
                                          item.pricing_type ||
                                          item.read_time ||
                                          item.category ||
                                          "-"}
                                      </div>
                                    )}

                                    {item.level && (
                                      <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[10px] border border-indigo-100">
                                        {item.level}
                                      </span>
                                    )}
                                    {item.status && (
                                      <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-100">
                                        ● {item.status}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Col 3: Tags & Atribut */}
                                <td className="px-6 py-4">
                                  <div className="flex flex-wrap gap-1 max-w-xs">
                                    {Array.isArray(tags) &&
                                      tags.slice(0, 3).map((tg: string) => (
                                        <span
                                          key={tg}
                                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 font-semibold border border-slate-200/50"
                                        >
                                          {tg}
                                        </span>
                                      ))}
                                    {Array.isArray(tags) && tags.length > 3 && (
                                      <span className="text-[10px] text-slate-400 self-center">
                                        +{tags.length - 3}
                                      </span>
                                    )}
                                    {item.published === false && (
                                      <span className="rounded-md bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
                                        Draft
                                      </span>
                                    )}
                                    {item.featured && (
                                      <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                                        ★ Featured
                                      </span>
                                    )}
                                    {item.metrics && (
                                      <span className="rounded-md bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] font-bold">
                                        {item.metrics}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Col 4: Order Index */}
                                <td className="px-6 py-4 text-center font-mono text-xs text-slate-500 font-bold">
                                  #{item.order_index ?? "-"}
                                </td>

                                {/* Col 5: Actions */}
                                <td className="px-6 py-4 text-right">
                                  <div className="inline-flex items-center gap-1">
                                    <button
                                      onClick={() => openEditModal(item)}
                                      className="rounded-xl p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition"
                                      title="Edit data"
                                    >
                                      <Edit2 size={15} />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(item.id, primaryTitle)}
                                      className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                                      title="Hapus data"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination for Standard Tables */}
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={filteredItems.length}
                      pageSize={ITEMS_PER_PAGE}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* FRIENDLY SLIDE-OVER DRAWER / WIDE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="h-full sm:h-[95vh] w-full max-w-5xl flex flex-col rounded-none sm:rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
                  <modalEntityConfig.icon size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {editingItem
                      ? `Edit ${modalEntityConfig.singular}`
                      : `Tambah ${modalEntityConfig.singular} Baru`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Perubahan akan disimpan langsung ke database PostgreSQL Dokploy.
                  </p>
                </div>
              </div>

              {/* Tab Navigation inside Drawer if has Markdown */}
              <div className="flex items-center gap-2">
                {hasMarkdownField && (
                  <div className="flex rounded-xl bg-slate-200/70 p-1 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveFormTab("meta")}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                        activeFormTab === "meta"
                          ? "bg-white text-blue-600 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Settings2 size={13} /> Informasi & Pengaturan
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFormTab("markdown")}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                        activeFormTab === "markdown"
                          ? "bg-white text-blue-600 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <FileText size={13} /> Konten Markdown
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-slate-200/60 text-slate-500 hover:bg-slate-300 transition"
                  title="Tutup Form"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Drawer Body (Scrollable Form) */}
            <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                {/* RENDER FIELDS */}
                {modalEntityConfig.fields.map((field) => {
                  // If hasMarkdown and we are in meta tab, hide markdown field
                  if (field.type === "markdown" && activeFormTab === "meta") {
                    return null;
                  }
                  // If hasMarkdown and we are in markdown tab, only show markdown field
                  if (field.type !== "markdown" && activeFormTab === "markdown") {
                    return null;
                  }

                  // 1. MARKDOWN EDITOR FIELD
                  if (field.type === "markdown") {
                    return (
                      <div key={field.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          {field.helper && (
                            <span className="text-xs text-slate-400">{field.helper}</span>
                          )}
                        </div>
                        <MarkdownEditor
                          value={formData[field.name] || ""}
                          onChange={(val) => setFormData({ ...formData, [field.name]: val })}
                          label={field.label}
                          required={field.required}
                          adminKey={adminKey}
                          minHeight="min-h-[420px]"
                          currentCoverUrl={formData["cover_image"] || formData["image_url"]}
                          onSetCover={(url) => {
                            const coverKey =
                              modalEntity === "news" ? "cover_image" : "image_url";
                            setFormData((prev) => ({ ...prev, [coverKey]: url }));
                          }}
                        />
                      </div>
                    );
                  }

                  // 2. DYNAMIC RELATIONAL SELECT (Course & Module Dropdowns)
                  if (field.name === "course_id") {
                    return (
                      <div key={field.name} className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <select
                          value={formData["course_id"] || ""}
                          onChange={(e) => {
                            const newCourseId = e.target.value;
                            setFormData((prev) => {
                              const updated: Record<string, any> = {
                                ...prev,
                                course_id: newCourseId,
                              };
                              if (modalEntity === "lessons") {
                                const matchingMods = allModules.filter(
                                  (m) => m.course_id === newCourseId
                                );
                                updated.module_id =
                                  matchingMods.length > 0 ? matchingMods[0].id : "";
                              }
                              return updated;
                            });
                          }}
                          required={field.required}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:border-blue-500 focus:bg-white focus:outline-none"
                        >
                          <option value="">-- Pilih Track Kursus --</option>
                          {allCourses.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title} ({c.slug})
                            </option>
                          ))}
                        </select>
                        {field.helper && (
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <HelpCircle size={11} className="text-blue-500" /> {field.helper}
                          </p>
                        )}
                      </div>
                    );
                  }

                  if (field.name === "module_id") {
                    const selectedCourseIdForForm = formData["course_id"];
                    const availableModules = allModules.filter(
                      (m) => m.course_id === selectedCourseIdForForm
                    );

                    return (
                      <div key={field.name} className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <select
                          value={formData["module_id"] || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, module_id: e.target.value })
                          }
                          required={field.required}
                          disabled={!selectedCourseIdForForm}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:border-blue-500 focus:bg-white focus:outline-none disabled:opacity-50"
                        >
                          <option value="">
                            {selectedCourseIdForForm
                              ? availableModules.length > 0
                                ? "-- Pilih Modul Bab --"
                                : "Belum ada modul di kursus ini"
                              : "-- Pilih Track Kursus terlebih dahulu --"}
                          </option>
                          {availableModules.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.title}
                            </option>
                          ))}
                        </select>
                        {field.helper && (
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <HelpCircle size={11} className="text-blue-500" /> {field.helper}
                          </p>
                        )}
                      </div>
                    );
                  }

                  // 3. AUTO-SLUG GENERATION ON TITLE / NAME
                  const isTitleField = field.name === "title" || field.name === "name";
                  const isSlugField = field.name === "slug";

                  if (isTitleField) {
                    return (
                      <div key={field.name} className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="text"
                          value={formData[field.name] ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => {
                              const updated = { ...prev, [field.name]: val };
                              if (!editingItem || !prev.slug) {
                                updated.slug = slugify(val);
                              }
                              return updated;
                            });
                          }}
                          required={field.required}
                          placeholder={field.placeholder}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-blue-500 focus:bg-white focus:outline-none transition"
                        />
                        {field.helper && (
                          <p className="text-[11px] text-slate-500">{field.helper}</p>
                        )}
                      </div>
                    );
                  }

                  if (isSlugField) {
                    return (
                      <div key={field.name} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const title = formData.title || formData.name || "";
                              setFormData((prev) => ({ ...prev, slug: slugify(title) }));
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 transition"
                          >
                            <RefreshCw size={10} /> Auto-Generate dari Judul
                          </button>
                        </div>
                        <input
                          type="text"
                          value={formData[field.name] ?? ""}
                          onChange={(e) =>
                            setFormData({ ...formData, [field.name]: slugify(e.target.value) })
                          }
                          required={field.required}
                          placeholder={field.placeholder}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:border-blue-500 focus:bg-white focus:outline-none transition"
                        />
                        {field.helper && (
                          <p className="text-[11px] text-slate-500">{field.helper}</p>
                        )}
                      </div>
                    );
                  }

                  // 4. CHIP SELECTORS
                  if (field.type === "chip_select" && field.options) {
                    const currentVal = formData[field.name];
                    return (
                      <div key={field.name} className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {field.options.map((opt: any) => {
                            const val = typeof opt === "string" ? opt : opt.value;
                            const lbl = typeof opt === "string" ? opt : opt.label;
                            const isSelected = currentVal === val;
                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setFormData({ ...formData, [field.name]: val })}
                                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition border ${
                                  isSelected
                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {lbl}
                              </button>
                            );
                          })}
                        </div>
                        {field.helper && (
                          <p className="text-[11px] text-slate-500">{field.helper}</p>
                        )}
                      </div>
                    );
                  }

                  // 5. IMAGE UPLOAD & PREVIEW
                  if (field.type === "image") {
                    return (
                      <div key={field.name} className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          {formData[field.name] && (
                            <div className="relative group shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={formData[field.name]}
                                alt="Preview"
                                className="h-16 w-24 rounded-xl object-cover border border-slate-200 shadow-xs"
                              />
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, [field.name]: "" })}
                                className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-white shadow-xs hover:bg-rose-600 transition"
                                title="Hapus gambar"
                              >
                                <X size={11} />
                              </button>
                            </div>
                          )}
                          <div className="w-full flex-1">
                            <input
                              type="text"
                              value={formData[field.name] ?? ""}
                              onChange={(e) =>
                                setFormData({ ...formData, [field.name]: e.target.value })
                              }
                              placeholder="e.g. /uploads/image.png atau paste URL gambar"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                            />
                            {field.helper && (
                              <p className="text-[11px] text-slate-500 mt-1">{field.helper}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // 6. TEXTAREA
                  if (field.type === "textarea") {
                    return (
                      <div key={field.name} className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <textarea
                          rows={3}
                          value={formData[field.name] || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, [field.name]: e.target.value })
                          }
                          required={field.required}
                          placeholder={field.placeholder}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                        />
                        {field.helper && (
                          <p className="text-[11px] text-slate-500">{field.helper}</p>
                        )}
                      </div>
                    );
                  }

                  // 7. BOOLEAN TOGGLE SWITCH
                  if (field.type === "boolean") {
                    const isChecked = Boolean(formData[field.name]);
                    return (
                      <div
                        key={field.name}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3.5"
                      >
                        <div>
                          <label
                            htmlFor={field.name}
                            className="text-xs font-bold text-slate-800 cursor-pointer"
                          >
                            {field.label}
                          </label>
                          {field.helper && (
                            <p className="text-[11px] text-slate-500 mt-0.5">{field.helper}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, [field.name]: !isChecked })}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isChecked ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              isChecked ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  }

                  // 8. STANDARD TEXT, NUMBER, OR TAGS
                  return (
                    <div key={field.name} className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type={field.type === "number" ? "number" : "text"}
                        value={formData[field.name] ?? ""}
                        onChange={(e) =>
                          setFormData({ ...formData, [field.name]: e.target.value })
                        }
                        required={field.required}
                        placeholder={
                          field.placeholder ||
                          (field.type === "tags" ? "e.g. Next.js, Golang, RabbitMQ" : "")
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                      />
                      {field.helper && (
                        <p className="text-[11px] text-slate-500">{field.helper}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Drawer Footer Actions */}
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <div className="flex items-center gap-3">
                  {hasMarkdownField && activeFormTab === "meta" && (
                    <button
                      type="button"
                      onClick={() => setActiveFormTab("markdown")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                    >
                      <FileText size={14} /> Lanjut ke Editor Markdown →
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:brightness-105 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" /> Menyimpan...
                      </>
                    ) : editingItem ? (
                      `Perbarui ${modalEntityConfig.singular}`
                    ) : (
                      `Simpan ${modalEntityConfig.singular}`
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
