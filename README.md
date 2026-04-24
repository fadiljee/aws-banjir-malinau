# EWS Banjir Malinau (Technical Test)

Repositori ini berisi pengerjaan tugas teknis untuk posisi Software Developer di Pijar Teknologi Mediatama. Project ini adalah sistem peringatan dini (EWS) banjir yang memproses data sensor ketinggian air di wilayah Malinau.

## Kondisi Project Saat Ini
Project masih dalam tahap pengembangan. Backend dan infrastruktur database sudah stabil, UI dashboard sudah bisa menampilkan data dari PostgreSQL, namun optimasi grafik dan beberapa fitur filter masih dalam pengerjaan (WIP).

### Tech Stack:
- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **Containerization:** Docker & Docker Compose

---

## Cara Menjalankan di Lokal

### 1. Clone & Setup Env
```bash
git clone [https://github.com/fadiljee/ews-banjir-malinau.git](https://github.com/fadiljee/ews-banjir-malinau.git)
cd ews-banjir-malinau
cp .env.example .env