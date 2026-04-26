# EWS Banjir - Kabupaten Malinau (Technical Test)

Sistem pemantauan Early Warning System (EWS) ketinggian air sungai secara real-time untuk pencegahan banjir di Kabupaten Malinau.

![Dashboard Preview](public/preview/preview-ews.png.png)

## Prasyarat
* Docker dan Docker Compose terinstal di sistem Anda.

## Cara Menjalankan Sistem

Aplikasi ini telah sepenuhnya dikemas menggunakan Docker. Anda tidak perlu menginstal Node.js atau PostgreSQL secara lokal di host machine.

1. Clone Repository:
   git clone https://github.com/fadiljee/aws-banjir-malinau.git
   cd ews-banjir-malinau

2. Jalankan via Docker Compose:
   docker compose up --build

Perintah ini akan otomatis membangun image, menyalakan database PostgreSQL, melakukan migrasi skema Prisma, meng-ingest data dari readings.json, dan menyalakan server Next.js.

3. Akses Dashboard:
   Buka browser dan akses http://localhost:3000

---

## Tugas Analisa

### 1. Dari Batch ke Realtime
Untuk mengubah sistem dari file statis ke sistem real-time API, arsitektur perlu ditambahkan komponen berikut:
* API Endpoint (Ingestion Server): Membuat endpoint POST untuk menerima JSON payload langsung dari perangkat IoT sensor.
* Message Broker: Menggunakan Redis atau RabbitMQ sebagai antrean data jika frekuensi sensor sangat tinggi, guna menjaga stabilitas database.
* WebSockets: Menggunakan Socket.io atau library serupa untuk memicu perubahan UI secara instan (push notification ke browser) saat data baru masuk tanpa perlu refresh halaman.

### 2. Flow Notifikasi
* Kapan dikirim: Notifikasi dikirim hanya saat terjadi Perubahan Status (misalnya dari AMAN ke SIAGA). Notifikasi tidak dikirim pada setiap pembacaan menit untuk menghindari spam.
* Mencegah Notifikasi Berulang (Flapping):
    * Hysteresis: Memberikan batas toleransi nilai (misal 2cm). Status hanya akan turun kembali jika nilai berada di bawah threshold dikurangi batas toleransi tersebut.
    * Cooldown Period: Membatasi pengiriman notifikasi ulang untuk sensor yang sama dalam durasi waktu tertentu (misal 15 menit).
* Komponen Bertanggung Jawab: Sebuah Worker Service khusus notifikasi yang membandingkan status terakhir di database dengan data terbaru yang masuk.

### 3. Sensor Mati (Heartbeat)
* Deteksi Sensor Mati: Menggunakan mekanisme Watchdog. Sistem mengecek timestamp terakhir pada database. Jika waktu saat ini dibandingkan timestamp terakhir terpaut lebih dari 5 menit, sensor dinyatakan mati.
* Tampilan Dashboard: Kartu sensor akan berubah warna menjadi abu-abu (grayscale), nilai angka diganti dengan label "OFFLINE", dan menampilkan keterangan waktu terakhir sensor aktif.
* Notifikasi: Peristiwa ini memicu notifikasi kategori Maintenance kepada tim teknis agar segera dilakukan pengecekan perangkat atau jaringan di lokasi.

---

## Stack Teknologi
* Framework: Next.js 14 (App Router)
* Database: PostgreSQL
* ORM: Prisma
* Styling: Tailwind CSS
* Visualisasi: Recharts
* Deployment: Docker & Docker Compose
