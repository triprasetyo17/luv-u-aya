/* --- CONFIGURATION --- */
const config = {
    partnerName: "Ayaang Aya💖", 
    musicFile: "assets/Barry Manilow - Can't Smile Without You (Audio).mp3",
    musicVolume: 0.5
};

document.addEventListener('DOMContentLoaded', () => {
    initMusic();
    updateName();
    createFloatingElements(); 
    
    // Page Logic
    const path = window.location.pathname;
    if (path.includes('ucapan.html')) initTypingEffect();
    if (path.includes('question.html')) initQuestionPage();
});

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

/* --- PERBAIKAN LOGIC MUSIC SYSTEM --- */
function initMusic() {
    const musicBtn = document.getElementById('music-btn');
    const audio = new Audio(config.musicFile);
    
    audio.loop = true;
    audio.volume = config.musicVolume;

    // Ambil status terakhir
    const isPlaying = localStorage.getItem('musicPlaying') !== 'false'; // Default true jika null
    const currentTime = parseFloat(localStorage.getItem('musicTime')) || 0;

    if (currentTime) audio.currentTime = currentTime;

    // Fungsi update icon tombol
    const updateIcon = () => {
        if (musicBtn) musicBtn.innerHTML = audio.paused ? '🔇' : '🔊';
    };

    // Fungsi untuk mencoba memutar audio
    const attemptPlay = () => {
        audio.play()
            .then(() => {
                // Berhasil play
                localStorage.setItem('musicPlaying', 'true');
                updateIcon();
            })
            .catch(error => {
                // Gagal (Autoplay Blocked), tunggu interaksi pertama user
                console.log("Autoplay dicegah browser, menunggu interaksi user...");
                
                const playOnInteraction = () => {
                    audio.play();
                    localStorage.setItem('musicPlaying', 'true');
                    updateIcon();
                    // Hapus listener agar tidak dijalankan berulang kali
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('touchstart', playOnInteraction);
                    document.removeEventListener('keydown', playOnInteraction);
                };

                // Pasang jebakan di seluruh dokumen
                document.addEventListener('click', playOnInteraction);
                document.addEventListener('touchstart', playOnInteraction);
                document.addEventListener('keydown', playOnInteraction);
            });
    };

    // Logic Tombol Music (Manual)
    if (musicBtn) {
        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Agar tidak bentrok dengan listener global
            if (audio.paused) {
                audio.play();
                localStorage.setItem('musicPlaying', 'true');
            } else {
                audio.pause();
                localStorage.setItem('musicPlaying', 'false');
            }
            updateIcon();
        });
    }

    // Simpan waktu lagu setiap detik
    setInterval(() => {
        if (!audio.paused) localStorage.setItem('musicTime', audio.currentTime);
    }, 1000);

    // Jalankan attempt play jika statusnya 'true' atau user baru buka
    if (isPlaying) {
        attemptPlay();
    } else {
        updateIcon();
    }
}

/* --- TYPING EFFECT --- */
function initTypingEffect() {
    const textElement = document.getElementById('typing-text');
    if (!textElement) return;
    
    const text = "Sebenernya di islam gaa boleh ngerayain ini dan aku gaa perlu ngucapin karena aku selalu mencintai dan menyanyangimu setiap waktunya💖💖💖💖💖 \n So, di hari kasih sayang ini aku cuma mau bilang...\nTerima kasih sudah menerimaku dan diterima baik di keluarga kamu, karena itu sudah menjadi suatu kebahagiaanku. I Love You So Much sayaang!💞✨";
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
