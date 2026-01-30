/* --- CONFIGURATION --- */
const config = {
    partnerName: "Ayaang Aya💖", 
    musicFile: "assets/Barry Manilow - Can't Smile Without You (Audio).mp3",
    musicVolume: 0.5
};

document.addEventListener('DOMContentLoaded', () => {
    initMusic();
    updateName();
    createFloatingElements(); // Panggil fungsi animasi
    
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
    // Cari container khusus, jika tidak ada (karena lupa nulis di HTML), pakai body
    const container = document.getElementById('particles') || document.body;
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.innerHTML ='🌹'; // Bisa ganti '🌹' atau '✨'
        heart.classList.add('heart');
        
        // Random Position
        heart.style.left = Math.random() * 100 + '%'; // Gunakan % agar responsif
        
        // Random Size
        const size = Math.random() * 20 + 10 + 'px';
        heart.style.fontSize = size;
        
        // Random Animation Duration
        heart.style.animationDuration = Math.random() * 3 + 4 + 's'; // 4-7 detik (lebih lambat & elegan)
        
        container.appendChild(heart);
        
        // Hapus elemen setelah selesai animasi
        setTimeout(() => heart.remove(), 7000);
    }, 600); // Muncul setiap 0.6 detik
}

/* --- QUESTION PAGE BUTTON (ANTI-TEMBUS) --- */
function initQuestionPage() {
    const btnNo = document.getElementById('btn-no');
    if (!btnNo) return;

    const moveBtn = (e) => {
        if(e.type === 'touchstart') e.preventDefault();
        
        // Batas aman (Viewport - Ukuran Tombol - Margin)
        const maxX = window.innerWidth - btnNo.offsetWidth - 20;
        const maxY = window.innerHeight - btnNo.offsetHeight - 20;

        const x = Math.random() * Math.max(0, maxX);
        const y = Math.random() * Math.max(0, maxY);
        
        btnNo.style.position = 'fixed'; // Fixed relative to screen
        btnNo.style.left = `${x}px`;
        btnNo.style.top = `${y}px`;
        btnNo.style.zIndex = '9999';
    };

    btnNo.addEventListener('mouseover', moveBtn);
    btnNo.addEventListener('touchstart', moveBtn);
}

/* --- MUSIC SYSTEM (SAMA SEPERTI SEBELUMNYA) --- */
function initMusic() {
    const musicBtn = document.getElementById('music-btn');
    const audio = new Audio(config.musicFile);
    audio.loop = true;
    audio.volume = config.musicVolume;

    const isPlaying = localStorage.getItem('musicPlaying') === 'true';
    const currentTime = parseFloat(localStorage.getItem('musicTime')) || 0;
    
    if (currentTime) audio.currentTime = currentTime;

    if (isPlaying) {
        audio.play().catch(() => console.log("User interaction needed"));
        if(musicBtn) musicBtn.innerHTML = '🔊';
    }

    setInterval(() => {
        if (!audio.paused) localStorage.setItem('musicTime', audio.currentTime);
    }, 1000);

    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                localStorage.setItem('musicPlaying', 'true');
                musicBtn.innerHTML = '🔊';
            } else {
                audio.pause();
                localStorage.setItem('musicPlaying', 'false');
                musicBtn.innerHTML = '🔇';
            }
        });
    }
}

/* --- TYPING EFFECT (SAMA) --- */
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