---
title: "Ensuring Reliability: Idempotent Consumers & Dead-Letter Queues (DLQ)"
module: "Module 2: Core Architecture & Message Patterns"
order: 2
duration: "11 min read"
type: "architecture"
excerpt: "Strategi menangani kegagalan pesan, duplicate delivery, dan isolasi pesan beracun (poison message) menggunakan DLQ dan Redis locking."
tags: ["Reliability", "DLQ", "Idempotency", "Redis", "RabbitMQ"]
---

# Ensuring Reliability: Idempotent Consumers & Dead-Letter Queues (DLQ)

Dalam sistem terdistribusi nyata, dua hal pasti akan terjadi:
1. **Jaringan mengalami fluktuasi**, menyebabkan pesan yang sama dikirim lebih dari satu kali (*At-least-once delivery*).
2. **Data yang cacat (*poison message*)**, menyebabkan consumer crash berulang kali jika terus di-retry tanpa henti.

Mari pelajari 2 pola pertahanan fundamental untuk sistem produksi: **Idempotent Consumers** dan **Dead-Letter Queues (DLQ)**.

---

## 1. Idempotent Consumer Pattern

> Operasi dikatakan **idempotent** jika dieksekusi 1 kali atau 100 kali dengan parameter yang sama menghasilkan kondisi akhir sistem yang sama persis tanpa efek samping ganda.

### Masalah Duplicate Message
Katakanlah worker telah memotong saldo pengguna sebesar Rp 100.000. Saat worker hendak mengirim `Ack` (Acknowledgment) ke RabbitMQ, koneksi jaringan terputus. RabbitMQ akan menganggap worker mati dan mengirimkan pesan tersebut ke worker lain. Jika worker kedua mengeksekusi saldo lagi, saldo user akan terpotong dua kali!

### Solusi: Unique Idempotency Key dengan Redis / Database

```text
Message Diterima (Mengandung UUID: "msg_abc_123")
    │
    ▼
Periksa Redis / DB: SETNX lock:idempotency:msg_abc_123 (TTL 1 Jam)
    │
    ├──► Key SUDAH ADA? ──► Skip proses, langsung kirim Ack ke RabbitMQ!
    │
    └──► Key BELUM ADA? ──► Jalankan transaksi bisnis, simpan status, lalu Ack.
```

Contoh snippet logika di Golang:

```go
func HandleTransaction(ctx context.Context, msg amqp.Delivery, rdb *redis.Client) error {
    messageID := msg.MessageId
    
    // Gunakan Redis SETNX (Set if Not Exists)
    success, err := rdb.SetNX(ctx, "processed:"+messageID, "1", 24*time.Hour).Result()
    if err != nil {
        return err // error koneksi redis, nack dan retry
    }
    
    if !success {
        log.Printf("Pesan %s telah diproses sebelumnya. Melewati eksekusi.", messageID)
        return msg.Ack(false)
    }

    // Eksekusi transaksi bisnis yang aman
    err = executeDebitBalance(msg.Body)
    if err != nil {
        // Hapus key agar bisa dicoba kembali jika gagal bisnis
        rdb.Del(ctx, "processed:"+messageID)
        return err
    }

    return msg.Ack(false)
}
```

---

## 2. Dead-Letter Exchange & Queue (DLQ)

Ketika pesan gagal diproses (misal format JSON rusak, atau user ID tidak ditemukan di DB), kita tidak boleh membiarkan pesan tersebut di-`Nack(requeue=true)` tanpa batas, karena akan menciptakan **Infinite CPU Loop**.

Solusinya adalah mengonfigurasi **Dead-Letter Exchange (DLX)**:

```text
Main Queue ("orders.process")
    │
    ├── (Gagal 3x retry / Nack(requeue=false) / Expired TTL)
    │
    ▼
Dead Letter Exchange ("dlx.orders")
    │
    ▼
Dead Letter Queue ("orders.dlq") ──► Alert ke Slack/Sentry untuk investigasi Engineer
```

### Konfigurasi Argumen Queue di RabbitMQ

```go
args := amqp.Table{
    "x-dead-letter-exchange":    "dlx.orders",
    "x-dead-letter-routing-key": "orders.dead",
    "x-message-ttl":             int32(60000), // 60 detik
}

_, err := ch.QueueDeclare(
    "orders.process", // nama antrean
    true,             // durable
    false,            // autoDelete
    false,            // exclusive
    false,            // noWait
    args,             // argumen DLX
)
```

Dengan DLQ, antrean utama Anda selalu bersih dan lancar, sementara pesan yang bermasalah tersimpan aman untuk diinspeksi (*replay* atau *debugging*) oleh tim engineer tanpa ada data yang hilang!
