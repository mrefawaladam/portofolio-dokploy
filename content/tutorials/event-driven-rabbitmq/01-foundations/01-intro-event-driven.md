---
title: "From Monolith to Event-Driven Microservices"
module: "Module 1: Foundations of Distributed Systems"
order: 1
duration: "8 min read"
type: "reading"
excerpt: "Pahami transisi dari synchronous request-response menuju asynchronous event-driven architecture untuk mencegah cascading failure pada sistem skala besar."
tags: ["Architecture", "Event-Driven", "Microservices", "RabbitMQ"]
---

# From Monolith to Event-Driven Microservices

Dalam pengembangan sistem enterprise berskala besar, pola arsitektur **Synchronous Request-Response** (misal REST API biasa) sering kali menjadi bottleneck utama ketika traffic memuncak.

Bayangkan skenario checkout pada aplikasi e-commerce atau transaksi billing rumah sakit (SIMRS):
1. User menekan tombol bayar.
2. Web server memvalidasi saldo.
3. Web server memanggil service inventori barang via HTTP.
4. Web server memanggil payment gateway pihak ketiga via HTTP.
5. Web server memicu pembuatan invoice PDF.
6. Web server mengirim notifikasi email dan WhatsApp.

Jika proses 3, 4, atau 5 mengalami latensi tinggi (atau timeout selama 10 detik), maka koneksi HTTP user akan tertahan. Lebih buruk lagi, ribuan request bersamaan akan menghabiskan **connection pool database** dan **thread pool server**, memicu *cascading failures* ke seluruh aplikasi.

---

## Konsep Inti: Decoupling dengan Events

**Event-Driven Architecture (EDA)** membalik paradigma di atas:

> Ali-alih memerintahkan service lain melakukan sesuatu secara langsung (*command*), sebuah service cukup mempublikasikan sebuah fakta bahwa sesuatu telah terjadi (*event*).

### Perbandingan Pola Arsitektur

| Karakteristik | Synchronous REST | Event-Driven (EDA) |
| :--- | :--- | :--- |
| **Coupling** | *Tight coupling* (bergantung pada ketersediaan target service) | *Loose coupling* (publisher tidak peduli siapa consumer-nya) |
| **Resilience** | Jika target mati, request gagal (*fail-fast* atau crash) | Event disimpan aman di Queue hingga consumer hidup kembali |
| **Throughput** | Dibatasi oleh service terlemah dalam rantai HTTP | Dibatasi oleh kapasitas broker (RabbitMQ mampu jutaan msg/detik) |
| **Skalabilitas** | Scale bersamaan (*horizontal pod autoscaling* mahal) | Worker consumer dapat di-scale secara independen sesuai beban antrean |

---

## Kapan Anda Harus Memilih Event-Driven?

Gunakan pendekatan event-driven ketika:
- **Operasi I/O berat**: Pengiriman email/SMS, kompresi berkas, pembuatan laporan PDF/Excel, atau pemrosesan AI.
- **Sistem multi-stakeholder**: Saat sebuah aksi (misal: `OrderPlaced`) perlu didengar oleh 4 tim berbeda (Logistik, Akuntansi, Notifikasi, Analytics).
- **Integrasi pihak ketiga**: Gateway pembayaran atau webhook bank yang membutuhkan waktu respons acak.

Pada materi berikutnya, kita akan membedah perbandingan teknis antara **RabbitMQ vs HTTP REST** dan bagaimana memilih messaging broker yang tepat.
