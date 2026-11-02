---
title: "Asynchronous Queues vs Synchronous REST APIs"
module: "Module 1: Foundations of Distributed Systems"
order: 2
duration: "10 min read"
type: "architecture"
excerpt: "Analisis mendalam mengenai trade-off latensi, buffer traffic spike, dan mekanisme acknowledgment antara HTTP REST vs Message Broker."
tags: ["RabbitMQ", "HTTP", "Latency", "Buffer"]
---

# Asynchronous Queues vs Synchronous REST APIs

Sering timbul pertanyaan dari engineer backend: *"Kapan kita harus membuat endpoint REST API biasa, dan kapan kita harus melempar data ke message broker seperti RabbitMQ?"*

Mari kita bedah secara obyektif berdasarkan karakteristik jaringan dan sistem operasi.

---

## 1. Masalah Kritis "Blocking HTTP"

Pada HTTP 1.1 / REST, setiap request membuka TCP socket dan menunggu response dari server (Request-Response Lifecycle).

```text
Client (User)
    │
    ▼ [HTTP POST /api/orders]
API Gateway / Backend
    │
    ├─► [HTTP GET] Payment Service (200ms)
    ├─► [HTTP GET] Inventory Service (150ms)
    └─► [HTTP POST] Notification Service (800ms)
    │
    ▼ [Total Latency: ~1,150ms]
Client menerima respons (1.15 detik kemudian)
```

Jika terjadi **Flash Sale** dengan 5,000 request per detik:
- Worker web server (misal PHP-FPM atau Node event loop) akan kehabisan thread kosong.
- Nginx mulai mengembalikan status `504 Gateway Timeout`.
- Server database kehabisan koneksi karena transaksi dibiarkan *open* terlalu lama.

---

## 2. Solusi: Asynchronous Buffer dengan RabbitMQ

Dengan RabbitMQ sebagai message broker, arsitektur berubah menjadi:

```text
Client (User)
    │
    ▼ [HTTP POST /api/orders]
API Gateway (Golang / Next.js)
    │
    ├─► Simpan status "PENDING" ke Database (5ms)
    ├─► Publish event "OrderCreated" ke RabbitMQ (2ms)
    │
    ▼ [Total Latency: ~15ms]
Client langsung menerima respons: "Pesanan Anda sedang diproses!" (Sangat Cepat)
```

Di belakang layar, worker-worker independen (*consumers*) mengambil pesan dari antrean dengan kecepatan yang aman sesuai kapasitas mesin:

```text
RabbitMQ Exchange
    │
    ├───► [Queue Orders] ──────► Order Worker (Golang)
    ├───► [Queue Invoices] ────► PDF Generator Worker (Go)
    └───► [Queue WhatsApp] ────► Notification Worker (Node)
```

---

## 3. Matriks Perbandingan Teknis

```json
{
  "protocol": "AMQP 0-9-1 (RabbitMQ) vs HTTP/1.1 (REST)",
  "connection_overhead": "Persistent TCP Connection vs New Handshake",
  "buffering_capability": "RabbitMQ menyimpan jutaan antrean di RAM/Disk",
  "flow_control": "Consumer menggunakan Prefetch Count untuk mencegah OOM"
}
```

> [!NOTE]
> RabbitMQ bukan pengganti REST API untuk interaksi real-time yang membutuhkan data balik seketika (seperti mengambil profil pengguna atau mencari produk). Namun untuk operasi transaksional dan integrasi antar service, RabbitMQ adalah fondasi kehandalan (*reliability*).
