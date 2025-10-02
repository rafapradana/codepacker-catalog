# 📄 **Product Requirement Document (PRD)**

**Project Name:** Codepacker Catalog
**Purpose:** Web app katalog & portofolio siswa RPL SMKN 4 Malang
**Actors:** Guest(tidak perlu login atau register, hanya pengunjung site pada umumnya), Student, Admin
**Version:** 1.1
**Last Updated:** September 2025

---

## **1. Goals & Objectives**

* Showcase project siswa RPL dalam bentuk katalog online yang profesional.
* Memberikan siswa kontrol penuh atas profil & portofolio mereka.
* Memberikan admin alat untuk mengelola akun siswa, project, dan konten website.
* Menyediakan UI modern, clean, interaktif, responsif, dengan **Notion-like design language**, **primary color biru**, dan **font menggunakan inter untuk, shadcn untuk ui components dan block**.
* Meningkatkan visibilitas karya siswa RPL kepada publik dan industri.
* Memfasilitasi dokumentasi portofolio yang berkelanjutan untuk siswa.

---
## **3. Functional Requirements**

### **3.1 Guest**

* **Landing Page**

  * Hero section (title, tagline, CTA).
  * Footer

* **Students Page**

  * Grid/list view of students.
  * Filter by kelas & skills.
  * Search by name.

* **Student Detail Page**

  * Foto profil, nama, bio, skills, social links.
  * GitHub username (link langsung ke profil GitHub).
  * List card project siswa dengan thumbnail, judul, dan deskripsi singkat, link ke project detail, link repo github, dan live demo (opsional).

* **Projects Page**

  * Grid/list projects.
  * Filter by tech stack, kategori, tahun.
  * Search by project title atau deskripsi atau nama siswa pemilik project.

* **Project Detail Page**

  * Nama Project.
  * Nama Siswa Pemilik Project.
  * Deskripsi.
  * Tech stack tags.
  * Kategori project (Mobile/Web/Game/Desktop/CLI).
  * Link ke repo GitHub.
  * Link ke live demo (opsional).
  * Created at & Updated at
  * media/gambar project.

---

### **3.2 Student (Member)**

* **Authentication**

  * Login/Logout (akun dibuat oleh admin, tidak ada fitur registrasi mandiri).

* **Dashboard**

  * Greeting & welcome message, clock & date.
  * Profil siswa (nama, kelas, bio, skills, foto profil, GitHub username, linkedin).
  * Shortcut ke halaman manage profile & manage project.

* **Kelola Profil**

  * Update Nama, Kelas, bio, skills (tag), foto profil.
  * Tambah GitHub username & link akun.
  * Tambah link akun linkedin

* **Kelola Project**

  * Tambah project
  * Isi Judul Project, Thumbnail, deskripsi, link github (wajib), link live demo (opsional), pilih kategori project, Masukkan Tech Stack Tag.
  * Upload Media/Gambar (ga ada video).
  * Delete/edit project kapan saja.

---

### **3.3 Admin**

* **Admin Login**

  * URL khusus: `/admin/loginadmin`.

* **Admin Dashboard**

  * Greeting & welcome message, clock & date.
  * Statistik: jumlah siswa, jumlah project, top projects.
  * Shortcut ke halaman manage students & manage projects.

* **Kelola Siswa**

  * CRUD akun & profil siswa.

* **Kelola Project Siswa**

  * CRUD project siswa.

* **Kelola Tag Skills**

  * CRUD tag skills

* **Kalola Tech Stack**
  * CRUD tag tech stack.

* **Kalola Kategori Project**
  * CRUD tag kategori project (Mobile/Web/Game/Desktop/CLI).

* **Kelola Kelas**
  * CRUD tag kelas.

---