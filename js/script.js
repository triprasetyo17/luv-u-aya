/* --- CONFIGURATION --- */
const config = {
    partnerName: "Ayaang Aya💖", 
    musicFile: "assets/Barry Manilow - Can't Smile Without You (Audio).mp3",
    musicVolume: 0.5
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi musik segera setelah halaman dimuat
    initMusic();
    
    updateName();
    createFloatingElements(); 
    
    // Page Logic
    const path = window.location.pathname;
    if (path.includes('ucapan.html')) initTypingEffect();
    if (path.includes('question.html')) initQuestionPage();
});

/* --- MUSIC SYSTEM (FORCE RESUME) --- */
function initMusic() {
    const musicBtn = document.getElementById('music-btn');
    
    // Gunakan satu instance audio global di memori halaman
    if (!window.audioContext) {
        window.audioContext = new Audio(config.musicFile);
        window.audioContext.loop = true;
        window.audioContext.volume = config.musicVolume;
    }
    
    const audio = window.audioContext;

    // Ambil posisi waktu terakhir agar lagu "melanjutkan", bukan mengulang
    const currentTime = parseFloat(localStorage.getItem('musicTime')) || 0;
    audio.currentTime = currentTime;

    // Fungsi untuk mencoba memutar musik
    const attemptPlay = () => {
        audio.play().then(() => {
            if(musicBtn) musicBtn.innerHTML = '🔊';
            localStorage.setItem('musicPlaying', 'true');
        }).catch(() => {
            // Jika autoplay diblokir, kita tunggu interaksi pertama user di layar
            console.log("Autoplay ditunda: Menunggu interaksi user...");
        });
    };

    // Jalankan attemptPlay segera
    attemptPlay();

    // LOGIKA KRUSIAL: Jika browser memblokir autoplay di index.html, 
    // lagu akan otomatis nyala begitu user klik/sentuh APAPUN di halaman.
    document.addEventListener('click', attemptPlay, { once: true });
    document.addEventListener('touchstart', attemptPlay, { once: true });

    // Simpan posisi detik lagu setiap 100ms agar perpindahan antar page terasa seamless
    setInterval(() => {
        if (!audio.paused) {
            localStorage.setItem('musicTime', audio.currentTime);
        }
    }, 100);

    // Kontrol manual tombol speaker
    if (musicBtn) {
        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Biar gak bentrok sama listener document
            if (audio.paused) {
                audio.play();
                musicBtn.innerHTML = '🔊';
                localStorage.setItem('musicPlaying', 'true');
            } else {
                audio.pause();
                musicBtn.innerHTML = '🔇';
                localStorage.setItem('musicPlaying', 'false');
            }
        });
    }
}

/* --- DYNAMIC NAME --- */
function updateName() {
    document.querySelectorAll('.partner-name').forEach(el => {
        el.textContent = config.partnerName;
    });
}

/* --- FIXED FLOATING HEARTS --- */
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

/* --- QUESTION PAGE LOGIC --- */
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
}

/* --- TYPING EFFECT --- */
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