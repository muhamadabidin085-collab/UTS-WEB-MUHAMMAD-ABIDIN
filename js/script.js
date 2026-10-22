/**
 * Script Interaktif UTS Pemrograman Web - Muhammad Abidin
 * Pemisahan Fungsi Terstruktur:
 * 1. Function Kalkulator Sederhana
 * 2. Function Estimasi Biaya Proyek
 * 3. Function Konversi Nilai Proyek
 */

document.addEventListener('DOMContentLoaded', () => {
    initModulKalkulatorLengkap();
    initDarkMode();
    initFilterProyek();
    initValidasiForm();
});

/* ===================================================
   FUNGSI 1: KALKULATOR SEDERHANA (Operasi Matematika)
   =================================================== */
// Fungsi murni untuk menghitung perkalian atau penjumlahan dasar
function hitungKalkulatorSederhana(angka1, angka2, operasi) {
    if (operasi === 'kali') {
        return angka1 * angka2;
    } else if (operasi === 'tambah') {
        return angka1 + angka2;
    }
    return 0;
}

/* ===================================================
   FUNGSI 2: ESTIMASI BIAYA PROYEK
   =================================================== */
// Fungsi logika untuk menghitung total biaya estimasi proyek
function hitungEstimasiBiaya(hargaDasar, jumlahHalaman, totalFitur) {
    // Memanggil Fungsi Kalkulator Sederhana untuk hitung biaya tambahan halaman
    const biayaHalamanTambahan = hitungKalkulatorSederhana(jumlahHalaman - 1, 100000, 'kali');

    // Memanggil Fungsi Kalkulator Sederhana untuk kalkulasi total
    const subtotal = hitungKalkulatorSederhana(hargaDasar, biayaHalamanTambahan, 'tambah');
    const totalAkhir = hitungKalkulatorSederhana(subtotal, totalFitur, 'tambah');

    return totalAkhir;
}

/* ===================================================
   FUNGSI 3: KONVERSI NILAI / KATEGORI PROYEK
   =================================================== */
// Fungsi untuk mengonversi angka total biaya menjadi Grade & Kategori Proyek
function konversiNilaiProyek(totalBiaya) {
    if (totalBiaya >= 2000000) {
        return { grade: 'A', kategori: 'Skala Besar / Enterprise' };
    } else if (totalBiaya >= 1000000) {
        return { grade: 'B', kategori: 'Skala Menengah / Standard' };
    } else {
        return { grade: 'C', kategori: 'Skala Kecil / Starter' };
    }
}

/* ===================================================
   MANIPULASI DOM & EVENT LISTENER UNTUK MODUL KALKULATOR
   =================================================== */
function initModulKalkulatorLengkap() {
    const pilihanJenis = document.getElementById('projectType');
    const inputHalaman = document.getElementById('pageCount');
    const opsiFitur = document.querySelectorAll('.feature-checkbox');
    const teksTotal = document.getElementById('totalPriceResult');

    if (!pilihanJenis || !teksTotal) return;

    // Membuat elemen wadah tambahan untuk Konversi Nilai via DOM (tanpa ubah HTML)
    let kotakKonversi = document.getElementById('badgeKonversiNilai');
    if (!kotakKonversi) {
        kotakKonversi = document.createElement('div');
        kotakKonversi.id = 'badgeKonversiNilai';
        kotakKonversi.className = 'mt-2 fs-6';
        teksTotal.parentNode.appendChild(kotakKonversi);
    }

    function jalankanSemuaFungsi() {
        const hargaDasar = parseInt(pilihanJenis.value) || 0;

        let jumlahHalaman = parseInt(inputHalaman.value) || 1;
        if (jumlahHalaman < 1) jumlahHalaman = 1;

        let totalFitur = 0;
        opsiFitur.forEach(cb => {
            if (cb.checked && !cb.disabled) {
                totalFitur += parseInt(cb.value) || 0;
            }
        });

        // 1 & 2. Jalankan Fungsi Estimasi Biaya & Kalkulator Sederhana
        const totalBiaya = hitungEstimasiBiaya(hargaDasar, jumlahHalaman, totalFitur);

        // 3. Jalankan Fungsi Konversi Nilai
        const hasilKonversi = konversiNilaiProyek(totalBiaya);

        // Tampilkan Hasil ke DOM HTML
        teksTotal.textContent = 'Rp ' + totalBiaya.toLocaleString('id-ID');
        kotakKonversi.innerHTML = `
            <span class="badge bg-primary me-1">Grade ${hasilKonversi.grade}</span> 
            <span class="text-secondary fw-semibold">Kategori: ${hasilKonversi.kategori}</span>
        `;
    }

    // Event Listener untuk memicu perubahan di layar
    pilihanJenis.addEventListener('change', jalankanSemuaFungsi);
    inputHalaman.addEventListener('input', jalankanSemuaFungsi);
    opsiFitur.forEach(cb => cb.addEventListener('change', jalankanSemuaFungsi));

    // Jalankan sekali saat pertama dimuat
    jalankanSemuaFungsi();
}

/* ===================================================
   FITUR INTERAKTIF UI: Dark Mode Toggle
   =================================================== */
function initDarkMode() {
    const tombolTema = document.getElementById('themeToggleBtn');
    const ikonTema = document.getElementById('themeIcon');
    const teksTema = document.getElementById('themeText');

    if (!tombolTema) return;

    tombolTema.addEventListener('click', () => {
        const temaSekarang = document.body.getAttribute('data-bs-theme');

        if (temaSekarang === 'dark') {
            document.body.setAttribute('data-bs-theme', 'light');
            teksTema.textContent = 'Dark Mode';
            ikonTema.className = 'bi bi-moon-stars-fill me-1';
        } else {
            document.body.setAttribute('data-bs-theme', 'dark');
            teksTema.textContent = 'Light Mode';
            ikonTema.className = 'bi bi-sun-fill me-1';
        }
    });
}

/* ===================================================
   FITUR INTERAKTIF UI: Search / Filter Proyek
   =================================================== */
function initFilterProyek() {
    const inputCari = document.getElementById('projectSearchInput');
    const daftarProyek = document.querySelectorAll('.project-item');
    const pesanKosong = document.getElementById('noProjectAlert');

    if (!inputCari) return;

    inputCari.addEventListener('input', (e) => {
        const kataKunci = e.target.value.toLowerCase().trim();
        let adaMatch = false;

        daftarProyek.forEach(proyek => {
            const judul = proyek.getAttribute('data-title') ? proyek.getAttribute('data-title').toLowerCase() : '';
            const teknologi = proyek.getAttribute('data-tech') ? proyek.getAttribute('data-tech').toLowerCase() : '';

            if (judul.includes(kataKunci) || teknologi.includes(kataKunci)) {
                proyek.classList.remove('d-none');
                adaMatch = true;
            } else {
                proyek.classList.add('d-none');
            }
        });

        if (adaMatch) {
            pesanKosong.classList.add('d-none');
        } else {
            pesanKosong.classList.remove('d-none');
        }
    });
}

/* ===================================================
   FITUR INTERAKTIF UI: Validasi Form Kontak
   =================================================== */
function initValidasiForm() {
    const form = document.getElementById('contactForm');
    const kotakAlert = document.getElementById('contactAlert');
    const teksAlert = document.getElementById('contactAlertText');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nama = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subjek = document.getElementById('contactSubject').value.trim();
        const pesan = document.getElementById('contactMessage').value.trim();

        if (nama && email.includes('@') && subjek && pesan.length >= 10) {
            teksAlert.textContent = `Terima kasih, ${nama}! Pesan kamu berhasil dikirim.`;
            kotakAlert.className = 'alert alert-success alert-dismissible fade show';
            kotakAlert.classList.remove('d-none');
            form.reset();
        } else {
            teksAlert.textContent = 'Harap isi semua kolom formulir dengan benar!';
            kotakAlert.className = 'alert alert-danger alert-dismissible fade show';
            kotakAlert.classList.remove('d-none');
        }
    });
}