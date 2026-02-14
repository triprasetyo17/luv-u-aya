/* --- CONFIGURATION --- */
const config = {
    partnerName: "Ayaang Aya💖", 
    musicFile: "assets/Barry Manilow - Can't Smile Without You (Audio).mp3",
    musicVolume: 0.5
};

// Gunakan satu instance audio agar tidak bentrok
let globalAudio = new Audio(config.musicFile);
globalAudio.loop = true;
globalAudio.volume = config.musicVolume;

document.addEventListener('DOMContentLoaded', () => {
    updateName();
    createFloatingElements(); 
    
    // Inisialisasi Musik
    initMusicSystem();
    
    // Page Logic
    const path = window.location.pathname;
    if (path.includes('ucapan.html')) initTypingEffect();
    if (path.includes('question.html')) initQuestionPage();
});

function initMusicSystem() {
    const musicBtn = document.getElementById('music-btn');
    
    // Ambil data dari storage
    const isPlaying = localStorage.getItem('musicPlaying') === 'true';
    const savedTime = parseFloat(localStorage.getItem('musicTime')) || 0;
    
    globalAudio.currentTime = savedTime;

    // Fungsi untuk memutar musik
    const playAudio = () => {
        globalAudio.play().then(() => {
            localStorage.setItem('musicPlaying', 'true');
            if (musicBtn) musicBtn.innerHTML = '🔊';
        }).catch(err => console.log("Menunggu interaksi user untuk navigasi..."));
    };

    // LOGIKA UTAMA: Jika statusnya harusnya 'playing', coba putar.
    if (isPlaying) {
        playAudio();
    }

    // LISTENER INTERAKSI (Solusi untuk Chrome/Safari/Mozilla/Edge)
    // Setiap kali user klik APAPUN pertama kali, audio akan dipaksa jalan
    const forcePlay = () => {
        if (localStorage.getItem('musicPlaying') === 'true') {
            playAudio();
        }
        document.removeEventListener('click', forcePlay);
        document.removeEventListener('touchstart', forcePlay);
    };
    document.addEventListener('click', forcePlay);
    document.addEventListener('touchstart', forcePlay);

    // Simpan posisi lagu secara berkala (setiap 500ms agar lebih akurat)
    setInterval(() => {
        if (!globalAudio.paused) {
            localStorage.setItem('musicTime', globalAudio.currentTime);
        }
    }, 500);

    // Kontrol tombol manual
    if (musicBtn) {
        musicBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (globalAudio.paused) {
                globalAudio.play();
                localStorage.setItem('musicPlaying', 'true');
                musicBtn.innerHTML = '🔊';
            } else {
                globalAudio.pause();
                localStorage.setItem('musicPlaying', 'false');
                musicBtn.innerHTML = '🔇';
            }
        });
    }
}

/* --- NAVIGASI KHUSUS (Tambahkan ini agar saat pindah page audio dipicu) --- */
// Kita cari semua link/tombol yang pindah halaman
document.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (target && target.classList.contains('btn-gold')) {
        // Sebelum pindah halaman, pastikan audio ditandai harus menyala
        localStorage.setItem('musicPlaying', 'true');
        // Browser mengizinkan play() tepat saat klik tombol navigasi
        globalAudio.play(); 
    }
});

/* --- FUNGSI LAINNYA (TETAP SAMA) --- */
function updateName() {
    document.querySelectorAll('.partner-name').forEach(el => {
        el.textContent = config.partnerName;
    });
}

function createFloatingElements() {
    const container = document.getElementById('particles') || document.body;
    setInterval(() => {
        const heart = document.createElement('div');
        heart.innerHTML ='🌹'; 
        heart.classList.add('heart');
        heart.style.left = Math.random() * 100 + '%'; 
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        heart.style.animationDuration = Math.random() * 3 + 4 + 's'; 
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 7000);
    }, 600); 
}

function initQuestionPage() {
    const btnNo = document.getElementById('btn-no');
    if (!btnNo) return;
    const moveBtn = (e) => {
        if(e.type === 'touchstart') e.preventDefault();
        const maxX = window.innerWidth - btnNo.offsetWidth - 20;
        const maxY = window.innerHeight - btnNo.offsetHeight - 20;
        btnNo.style.position = 'fixed'; 
        btnNo.style.left = `${Math.random() * maxX}px`;
        btnNo.style.top = `${Math.random() * maxY}px`;
    };
    btnNo.addEventListener('mouseover', moveBtn);
    btnNo.addEventListener('touchstart', moveBtn);
}

function initTypingEffect() {
    const textElement = document.getElementById('typing-text');
    if (!textElement) return;
    const text = "Sebenernya di islam gaa boleh ngerayain ini dan aku gaa perlu ngucapin karena aku selalu mencintai dan menyanyangimu setiap waktunya💖💖💖💖💖 \n So, di hari kasih sayang ini aku cuma mau bilang...\nTerima kasih sudah diterima baik di keluarga kamu dan sudah jadi alasan bahagiaku. I Love You So Much!💞✨";
    let i = 0;
    textElement.innerHTML = '';
    function type() {
        if (i < text.length) {
            textElement.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
            i++;
            setTimeout(type, 60);
        } else {
            const btnNext = document.getElementById('btn-next');
            if(btnNext) btnNext.style.opacity = '1';
        }
    }
    type();
}
