---
title: "Building High-Throughput Workers in Golang"
module: "Module 3: Golang Production Implementation"
order: 1
duration: "15 min read"
type: "code"
excerpt: "Kode produksi lengkap membangun AMQP consumer worker di Go dengan graceful shutdown, dynamic goroutine pool, dan prefetch optimization."
tags: ["Golang", "RabbitMQ", "Goroutines", "GracefulShutdown", "amqp091-go"]
---

# Building High-Throughput Workers in Golang

Golang adalah salah satu bahasa pemrograman paling ideal untuk consumer worker berkecepatan tinggi karena model konkurensi **Goroutines** yang sangat ringan (hanya memakan ~2KB memori per goroutine).

Pada materi ini, kita akan menyusun struktur worker produksi menggunakan library resmi `github.com/rabbitmq/amqp091-go`.

---

## 1. Menyiapkan Koneksi & Channel AMQP

```go
package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"

	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
	amqpURL := os.Getenv("RABBITMQ_URL")
	if amqpURL == "" {
		amqpURL = "amqp://guest:guest@localhost:5672/"
	}

	conn, err := amqp.Dial(amqpURL)
	if err != nil {
		log.Fatalf("Gagal terhubung ke RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Gagal membuka channel: %v", err)
	}
	defer ch.Close()

	// Setting Prefetch Count (QoS) sangat krusial!
	// Jangan biarkan 1 worker menelan ribuan pesan sekaligus.
	err = ch.Qos(
		50,    // prefetch count
		0,     // prefetch size
		false, // global
	)
	if err != nil {
		log.Fatalf("Gagal set QoS: %v", err)
	}

	msgs, err := ch.Consume(
		"orders.process", // queue
		"worker-go-1",    // consumer tag
		false,            // auto-ack HARUS FALSE untuk keamanan
		false,            // exclusive
		false,            // no-local
		false,            // no-wait
		nil,              // args
	)
	if err != nil {
		log.Fatalf("Gagal mendaftar consumer: %v", err)
	}

	log.Println("Worker Golang siap mendengarkan pesan. Menunggu tasks...")

	// Jalankan Worker Pool
	var wg sync.WaitGroup
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	concurrency := 10 // 10 goroutines paralel
	for i := 1; i <= concurrency; i++ {
		wg.Add(1)
		go worker(ctx, &wg, i, msgs)
	}

	// Tangani Graceful Shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	<-sigChan

	log.Println("Sinyal terminate diterima. Menyelesaikan pekerjaan berjalan...")
	cancel()
	wg.Wait()
	log.Println("Worker shutdown selesai dengan bersih.")
}
```

---

## 2. Worker Goroutine Function

```go
func worker(ctx context.Context, wg *sync.WaitGroup, id int, msgs <-chan amqp.Delivery) {
	defer wg.Done()

	for {
		select {
		case <-ctx.Done():
			log.Printf("[Worker #%d] Berhenti menerima pesan baru.", id)
			return
		case msg, ok := <-msgs:
			if !ok {
				log.Printf("[Worker #%d] Channel ditutup broker.", id)
				return
			}

			// Proses payload
			err := processOrderPayload(msg.Body)
			if err != nil {
				log.Printf("[Worker #%d] Gagal memproses: %v", id, err)
				// Nack tanpa requeue agar dialihkan ke DLQ
				msg.Nack(false, false)
				continue
			}

			// Konfirmasi sukses ke RabbitMQ
			msg.Ack(false)
		}
	}
}

func processOrderPayload(body []byte) error {
	// Simulasi logika bisnis, unmarshal JSON, simpan ke DB
	return nil
}
```

---

## Poin Penting Performa

1. **`autoAck: false`**: Selalu matikan auto-ack di lingkungan produksi. Pesan hanya boleh di-ack setelah transaksi database berhasil di-commit.
2. **`Qos(50, ...)`**: Mengatur *Fair Dispatch* agar RabbitMQ membagi beban secara merata ke seluruh instance worker yang aktif.
