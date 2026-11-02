---
title: "RabbitMQ Core: Direct, Topic, and Fanout Exchanges"
module: "Module 2: Core Architecture & Message Patterns"
order: 1
duration: "12 min read"
type: "reading"
excerpt: "Pahami cara kerja internal RabbitMQ: bagaimana Exchange merutekan pesan ke antrean target menggunakan routing key dan binding pattern."
tags: ["RabbitMQ", "Exchanges", "RoutingKey", "Queues"]
---

# RabbitMQ Core: Direct, Topic, and Fanout Exchanges

Salah satu keunggulan terbesar RabbitMQ dibandingkan broker sederhana seperti Redis Queue adalah adanya abstraksi **Exchange**.

Pada AMQP protocol:
- **Producer** tidak pernah mengirim pesan langsung ke antrean (*Queue*).
- **Producer** selalu mengirim pesan ke **Exchange**.
- **Exchange** bertugas merutekan pesan ke satu atau lebih Queue berdasarkan aturan (*Binding & Routing Key*).

---

## 1. Jenis-Jenis Exchange Utama

### A. Direct Exchange (Unicast / 1-to-1 Matching)
Pesan diarahkan ke Queue yang memiliki `binding_key` persis sama dengan `routing_key` pesan.

```text
Producer ──(routing_key: "payment.success")──► [Direct Exchange]
                                                       │
                                                       ├──► (binding: "payment.success") ──► [Billing Queue]
                                                       └──► (binding: "payment.failed")  ──► [Refund Queue]
```
Cocok untuk: Penugasan pekerjaan spesifik ke worker tertentu.

---

### B. Fanout Exchange (Broadcast / 1-to-All)
Exchange mengabaikan routing key dan menduplikasi pesan ke **seluruh antrean** yang terikat (*bound*) padanya.

```text
Producer ──► [Fanout Exchange: "user.registered"]
                     │
                     ├──► [Email Welcome Queue]
                     ├──► [Free Credits Provisioning Queue]
                     └──► [CRM Data Sync Queue]
```
Cocok untuk: Notifikasi global, audit trail, atau *cache invalidation* di beberapa service.

---

### C. Topic Exchange (Pattern Matching / Wildcards)
Exchange merutekan pesan berdasarkan pencocokan pola kata yang dipisahkan titik (`.`):
- `*` (asterisk): Menggantikan tepat 1 kata.
- `#` (hash): Menggantikan 0 atau lebih kata.

Contoh Routing Key: `health.<department>.<urgency>`:
- `health.emergency.*` -> Cocok dengan `health.emergency.icu`, `health.emergency.ambulance`.
- `health.#` -> Mendengarkan seluruh event kesehatan dari unit mana pun.

---

## 2. Praktik Terbaik Penamaan Routing Key

Gunakan konvensi terstandarisasi di tim engineering Anda:

```text
<domain>.<entity>.<action>
Contoh:
- hospital.patient.admitted
- billing.invoice.paid
- logistics.courier.dispatched
```

Standarisasi ini memudahkan service baru untuk berlangganan (*subscribe*) ke domain tertentu tanpa perlu mengubah kode producer sama sekali!
