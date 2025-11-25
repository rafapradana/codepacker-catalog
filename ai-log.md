# AI System Prompts Log

This document contains the system prompts and response structures used in the project.

## OpenRouter Project Ideas Generator

**Source:** `src/lib/openrouter.ts`
**Function:** `PROMPT_TEMPLATES.PROJECT_IDEAS`

### System Prompt

```text
Sebagai AI assistant untuk platform pembelajaran coding, tugasmu adalah membuatkan TEPAT 3 (TIGA) ide proyek yang menarik dan relevan.

**Profil Siswa:**
- Skill Level: ${params.skillLevel}
- Tech Stack yang ingin digunakan: ${params.techStack.join(', ')}
- Waktu tersedia: ${params.timeAvailable}
- Kategori proyek: ${params.category}
- Tingkat kesulitan: ${params.difficulty}

**Instruksi UTAMA:**
1. WAJIB membuatkan 3 ide proyek. Tidak boleh kurang, tidak boleh lebih.
2. Setiap proyek harus unik dan berbeda satu sama lain.
3. Setiap proyek harus sesuai dengan skill level dan tech stack yang diminta.
4. Estimasi waktu pengerjaan harus realistis sesuai dengan waktu yang tersedia.

**Format Response (JSON):**
Response HARUS berupa JSON valid dengan struktur persis seperti ini:
{
  "ideas": [
    {
      "title": "Nama Proyek 1",
      "description": "Deskripsi lengkap proyek 1...",
      "techStack": ["Tech 1", "Tech 2"],
      "difficulty": "${params.difficulty}",
      "estimatedHours": 40,
      "category": "${params.category}",
      "features": ["Feature 1", "Feature 2"]
    },
    {
      "title": "Nama Proyek 2",
      "description": "Deskripsi lengkap proyek 2...",
      "techStack": ["Tech 1", "Tech 2"],
      "difficulty": "${params.difficulty}",
      "estimatedHours": 40,
      "category": "${params.category}",
      "features": ["Feature 1", "Feature 2"]
    },
    {
      "title": "Nama Proyek 3",
      "description": "Deskripsi lengkap proyek 3...",
      "techStack": ["Tech 1", "Tech 2"],
      "difficulty": "${params.difficulty}",
      "estimatedHours": 40,
      "category": "${params.category}",
      "features": ["Feature 1", "Feature 2"]
    }
  ]
}

**Catatan Penting:**
- Pastikan array "ideas" berisi TEPAT 3 objek.
- Pastikan response HANYA berupa JSON yang valid.
- Jangan tambahkan teks apapun di luar JSON.
```

### Response Structure (JSON)

The AI is expected to return a JSON object with the following structure:

```json
{
  "ideas": [
    {
      "title": "string",
      "description": "string",
      "techStack": ["string"],
      "difficulty": "string",
      "estimatedHours": number,
      "category": "string",
      "features": ["string"]
    }
  ]
}
```

### Real Response Example

Generated using `scripts/test-openrouter.ts` with parameters:
- Skill Level: beginner
- Tech Stack: React, Tailwind
- Time Available: 20 hours
- Category: web-app
- Difficulty: easy

```json
{
  "ideas": [
    {
      "title": "Aplikasi Todo List Sederhana",
      "description": "Buat aplikasi web untuk mengelola tugas harian dengan fitur menambah, menghapus, dan menandai tugas sebagai selesai. Gunakan React untuk state management dan Tailwind untuk styling responsif yang menarik.",
      "techStack": [
        "React",
        "Tailwind"
      ],
      "difficulty": "easy",
      "estimatedHours": 15,
      "category": "web-app",
      "features": [
        "Menambah tugas baru",
        "Menghapus tugas",
        "Menandai tugas selesai",
        "Filter tugas (semua, aktif, selesai)"
      ]
    },
    {
      "title": "Generator Kutipan Motivasi",
      "description": "Aplikasi yang menampilkan kutipan motivasi secara acak dari API gratis. Pengguna bisa generate kutipan baru, salin teks, dan background berubah warna secara dinamis menggunakan Tailwind untuk UI yang modern.",
      "techStack": [
        "React",
        "Tailwind"
      ],
      "difficulty": "easy",
      "estimatedHours": 14,
      "category": "web-app",
      "features": [
        "Fetch kutipan dari API",
        "Tombol generate kutipan baru",
        "Fitur salin kutipan",
        "Animasi transisi sederhana"
      ]
    },
    {
      "title": "Pelacak Pengeluaran Harian",
      "description": "Web app sederhana untuk mencatat pengeluaran harian, menampilkan daftar transaksi, dan menghitung total pengeluaran. Semua data disimpan di local storage React, dengan desain clean menggunakan Tailwind.",
      "techStack": [
        "React",
        "Tailwind"
      ],
      "difficulty": "easy",
      "estimatedHours": 16,
      "category": "web-app",
      "features": [
        "Input pengeluaran baru",
        "Daftar transaksi",
        "Hitung total pengeluaran",
        "Hapus transaksi individual"
      ]
    }
  ]
}
```

## Catatan Implementasi

### Strategi Model
Kami menggunakan **OpenRouter** sebagai gateway untuk mengakses berbagai model LLM. Saat ini, konfigurasi menggunakan model `x-ai/grok-4.1-fast:free`. Pemilihan model ini didasarkan pada kecepatan inferensi yang tinggi dan efisiensi biaya (gratis), yang sangat ideal untuk fitur yang membutuhkan respon cepat seperti generator ide proyek ini.

### Prompt Engineering
Tantangan utama dalam integrasi ini adalah memastikan output AI selalu konsisten dalam format JSON yang valid agar dapat diproses oleh aplikasi. Kami menerapkan beberapa teknik *Prompt Engineering*:
1.  **Instruksi Eksplisit**: Memberikan perintah tegas seperti "Response HARUS berupa JSON valid" dan "Jangan tambahkan teks apapun di luar JSON".
2.  **One-Shot / Zero-Shot Templating**: Memberikan struktur JSON kosong yang spesifik sebagai acuan bagi model.
3.  **Parameter `response_format`**: Memanfaatkan fitur API `{ type: 'json_object' }` untuk memaksa model beroperasi dalam mode JSON.

### Robustness & Validasi
Meskipun prompt sudah dirancang dengan ketat, respon dari LLM tidak selalu 100% dapat diprediksi. Oleh karena itu, kami menerapkan lapisan pertahanan di sisi kode (`src/lib/openrouter.ts`):
-   **Pembersihan Output (Sanitization)**: Fungsi `parseAIResponse` secara proaktif membersihkan *markdown code blocks* (seperti \`\`\`json ... \`\`\`) yang seringkali disertakan oleh model meskipun tidak diminta.
-   **Validasi Skema Runtime**: Fungsi `validateProjectIdea` memeriksa tipe data setiap field (memastikan `techStack` adalah array, `estimatedHours` adalah number, dll) sebelum data disimpan ke database. Ini mencegah data korup masuk ke sistem.

## Refleksi

### Observasi
Selama pengujian, kami mengamati bahwa model cenderung "terlalu membantu" dengan menyertakan formatting markdown atau teks pengantar. Langkah *post-processing* string sebelum melakukan `JSON.parse()` terbukti menjadi langkah krusial untuk mencegah *runtime error*. Penggunaan model yang lebih kecil dan cepat (seperti Grok Fast) terkadang memerlukan instruksi yang lebih repetitif dibandingkan model besar (seperti GPT-4) untuk mematuhi format yang ketat.
