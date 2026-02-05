# Pelan Pembangunan Sistem Kehadiran QR PERKESO Keningau

## 1. Objektif Sistem
Membina sistem pendaftaran kehadiran digital yang pantas dan efisien bagi setiap program anjuran PERKESO Keningau. Data akan disimpan secara berpusat dalam Google Sheets untuk memudahkan urusan laporan dan semakan maklumat syarikat/persatuan peserta.

## 2. Maklumat Teknikal (Environment Variables)
Maklumat ini diperlukan oleh sistem untuk berfungsi. **PENTING:** Kunci rahsia tidak boleh didedahkan dalam kod awam.

- **Platform:** Next.js (Hosting di Vercel)
- **Database:** Google Sheets API
- **Sheet ID:** `1eAgnebdm_PhYXNiqAmokeCJmmQ-7DifWuTHTGqD9HcE`
- **Service Account (Env Vars):**
  - `GOOGLE_CLIENT_EMAIL`: `kehadiran-qr-bot@perkeso-keningau-qr.iam.gserviceaccount.com`
  - `GOOGLE_PRIVATE_KEY`: (Diambil dari fail JSON dan diset dalam Vercel Environment Variables)

## 3. Aliran Kerja Sistem

### A. Bahagian Admin (Anggota PERKESO)
1. **Akses Selamat:** Admin perlu memasukkan **Kod Akses (Passcode)** untuk masuk ke halaman `/admin`.
2. **Cipta Program:** Masukkan Nama Program (cth: Taklimat Majikan 2026).
3. **Jana QR:** Sistem menghasilkan pautan pendaftaran unik:
   `https://hadir-perkeso.vercel.app/register?event=Taklimat_Majikan_2026`
4. **Paparan:** QR Code dijana untuk diletakkan di kaunter pendaftaran.

### B. Bahagian Peserta
1. **Scan:** Peserta mengimbas QR Code.
2. **Isi Maklumat (Dengan Pengesahan Data):**
   - Nama Penuh (Wajib)
   - No. Kad Pengenalan (**Validasi:** Mesti 12 digit nombor sahaja, tiada tanda `-`)
   - No. Telefon (**Validasi:** Format nombor telefon yang sah)
   - Wakil Syarikat / Persatuan / Individu
3. **Hantar:** Data dihantar ke Google Sheet.
4. **Maklum Balas:** Skrin "Pendaftaran Berjaya" dipaparkan sebagai pengesahan.

## 4. Struktur Database (Google Sheets)
Setiap pendaftaran akan disusun mengikut kolum berikut:

| Timestamp | Nama Program | Nama Peserta | No. IC | No. Telefon | Syarikat/Persatuan |
|-----------|--------------|--------------|--------|-------------|--------------------|
| Auto-capture | Input Peserta | Input Peserta | Input Peserta | Input Peserta | Input Peserta |

## 5. Kelebihan & Langkah Keselamatan
- **Integriti Data:** Validasi input memastikan no. IC dan telefon yang direkodkan adalah tepat.
- **Keselamatan Kod:** Menggunakan Environment Variables di Vercel untuk menyembunyikan kunci sensitif daripada kod sumber (GitHub).
- **Kawalan Akses:** Halaman admin dilindungi kata laluan ringkas untuk mengelakkan penyalahgunaan.
- **Pengurusan Ralat:** Mesej ralat mesra pengguna jika berlaku gangguan sambungan atau had API (Rate Limit) Google dicapai.

> **Nota Pembangunan:** Fail `perkeso-keningau-qr-....json` adalah untuk kegunaan *local development* sahaja. Jangan commit fail ini ke GitHub.
