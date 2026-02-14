/* --- CONFIGURATION --- */
const config = {
    partnerName: "Ayaang Aya💖", 
    musicFile: "assets/Barry Manilow - Can't Smile Without You (Audio).mp3",
    musicVolume: 0.5
};

document.addEventListener('DOMContentLoaded', () => {
    // Prioritas: Siapkan navigasi dulu agar klik tercatat
    setupNavigation();
    
    // Inisialisasi Musik
    initMusic();
    
    updateName();
    createFloatingElements(); 
    
    // Page Logic
    const path = window.location.pathname;
    if (path.includes('ucapan.html')) initTypingEffect();
    if (path.includes('question.html')) initQuestionPage();
});

/* --- NAVIGATION LOGIC (FIX FOR AUTOPLAY) --- */
function setupNavigation() {
    // Cari tombol "Pencet aku dong" atau tombol navigasi lainnya
    const navButtons = document.querySelectorAll('a.btn-gold');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Paksa set musicPlaying jadi true saat tombol navigasi diklik
            localStorage.setItem('musicPlaying', 'true');
        });
    });
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
        const size = Math.random() * 20 + 10 + 'px';
        heart.style.fontSize = size;
        heart.style.animationDuration = Math.random() * 3 + 4 + 's'; 
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 7000);
    }, 600); 
}

/* --- QUESTION PAGE BUTTON (ANTI-TEMBUS) --- */
function initQuestionPage() {
    const btnNo = document.getElementById('btn-no');
    if (!btnNo) return;

    const moveBtn = (e) => {
        if(e.type === 'touchstart') e.preventDefault();
        const maxX = window.innerWidth - btnNo.offsetWidth - 20;
        const maxY = window.innerHeight - btnNo.offsetHeight - 20;
        const x = Math.random() * Math.max(0, maxX);
        const y = Math.random() * Math.max(0, maxY);
        btnNo.style.position = 'fixed'; 
        btnNo.style.left = `${x}px`;
        btnNo.style.top = `${y}px`;
        btnNo.style.zIndex = '9999';
    };

    btnNo.addEventListener('mouseover', moveBtn);
    btnNo.addEventListener('touchstart', moveBtn);
}

/* --- MUSIC SYSTEM (UPDATED) --- */
function initMusic() {
    const musicBtn = document.getElementById('music-btn');
    const audio = new Audio(config.musicFile);
    audio.loop = true;
    audio.volume = config.musicVolume;

    // Ambil status terakhir
    // Jika user baru pertama kali buka (belum ada data), anggap saja FALSE dulu sampai dia klik tombol mulai
    const isPlaying = localStorage.getItem('musicPlaying') === 'true';
    const currentTime = parseFloat(localStorage.getItem('musicTime')) || 0;
    
    if (currentTime) audio.currentTime = currentTime;

    // Fungsi helper untuk update icon
    const updateIcon = (play) => {
        if(musicBtn) musicBtn.innerHTML = play ? '🔊' : '🔇';
    };

    if (isPlaying) {
        // Coba putar otomatis
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Berhasil putar otomatis
                updateIcon(true);
            }).catch(error => {
                console.log("Autoplay diblokir browser, menunggu interaksi user...");
                updateIcon(false); // Icon tetap mute dulu
                
                // FALLBACK: Tambahkan one-time listener ke seluruh body
                // Jadi user klik dimanapun di layar, musik langsung nyala
                const resumeAudio = () => {
                    audio.play();
                    updateIcon(true);
                    localStorage.setItem('musicPlaying', 'true');
                    document.removeEventListener('click', resumeAudio);
                    document.removeEventListener('touchstart', resumeAudio);
                };
                
                document.addEventListener('click', resumeAudio);
                document.addEventListener('touchstart', resumeAudio);
            });
        }
    } else {
        updateIcon(false);
    }

    // Simpan posisi lagu setiap detik
    setInterval(() => {
        if (!audio.paused) localStorage.setItem('musicTime', audio.currentTime);
    }, 1000);

    // Kontrol tombol musik manual
    if (musicBtn) {
        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Agar tidak bentrok dengan fallback listener
            if (audio.paused) {
                audio.play();
                localStorage.setItem('musicPlaying', 'true');
                updateIcon(true);
            } else {
                audio.pause();
                localStorage.setItem('musicPlaying', 'false');
                updateIcon(false);
            }
        });
    }
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
