document.addEventListener('DOMContentLoaded', function() {
    
    
    const artistItems = document.querySelectorAll('.artist-item');

    let playTimers = {};

    artistItems.forEach((item, index) => {
        const artistName = item.querySelector('h3').innerText;

        const audioPath = `audio/${artistName}.mp3`;
        const audio = new Audio(audioPath);
        audio.loop = true;

        item.addEventListener('mouseenter', function() {
            console.log(`已指向 ${artistName}，倒计时 2 秒开始...`);

            playTimers[index] = setTimeout(() => {
                audio.currentTime = 0; 

                audio.play().then(() => {
                    console.log(`正在播放: ${artistName}`);

                    if (typeof gtag === 'function') {
                        gtag('event', 'audio_preview_2s', {
                            'artist_name': artistName,
                            'event_category': 'Engagement',
                            'event_label': 'Hover Preview'
                        });
                    }
                }).catch(error => {
                    console.warn("自动播放被拦截，请确保用户先与页面有过交互:", error);
                });
                
            }, 1000); 
        });

        item.addEventListener('mouseleave', function() {

            clearTimeout(playTimers[index]);

            audio.pause();
            audio.currentTime = 0;
            console.log(`停止播放: ${artistName}`);
        });

        item.addEventListener('click', function() {
 
            if (typeof gtag === 'function') {
                gtag('event', 'artist_click', {
                    'artist_name': artistName,
                    'method': 'Grid Click'
                });
            }
       
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = new Audio();
    let currentTrackIndex = -1;

    const artistItems = document.querySelectorAll('.artist-item');
    let playTimers = {};

    artistItems.forEach((item, index) => {
        const h3 = item.querySelector('h3');
        if (!h3) return;
        const artistName = h3.innerText;
 
        const previewAudio = new Audio(`audio/${artistName}.mp3`);

        item.addEventListener('mouseenter', () => {
            playTimers[index] = setTimeout(() => {
                previewAudio.play().catch(() => console.log("首页预览：需先点击页面授权音频"));
                if (typeof gtag === 'function') {
                    gtag('event', 'hover_preview', { 'artist_name': artistName });
                }
            }, 1000); 
        });

        item.addEventListener('mouseleave', () => {
            clearTimeout(playTimers[index]);
            previewAudio.pause();
            previewAudio.currentTime = 0;
        });
    });

    const playButtons = document.querySelectorAll('.play-track-btn');
    const mainPlayBtn = document.getElementById('main-play-btn');
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const randomBtn = document.getElementById('random-play-btn');
    
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const currentTimeEl = document.getElementById('current-time');
    const durationTimeEl = document.getElementById('duration-time');

const volumeControl = document.getElementById('volume-control');
const muteBtn = document.getElementById('mute-btn');
let lastVolume = 0.5; 
if (volumeControl && muteBtn) {

    volumeControl.addEventListener('input', function() {
        const val = parseFloat(this.value);
        audioPlayer.volume = val;
        updateVolumeIcon(val);
        if (val > 0) lastVolume = val;
    });

    muteBtn.addEventListener('click', function() {
        if (audioPlayer.volume > 0) {
    
            lastVolume = audioPlayer.volume;
            audioPlayer.volume = 0;
            volumeControl.value = 0;
            updateVolumeIcon(0);
        } else {
   
            audioPlayer.volume = lastVolume;
            volumeControl.value = lastVolume;
            updateVolumeIcon(lastVolume);
        }

        if (typeof gtag === 'function') {
            gtag('event', 'mute_toggle', { 'is_muted': audioPlayer.volume === 0 });
        }
    });
}

function updateVolumeIcon(volume) {
    const icon = document.getElementById('mute-btn');
    if (!icon) return;
    
    if (volume == 0) {
        icon.innerText = "🔇";
    } else if (volume < 0.5) {
        icon.innerText = "🔉";
    } else {
        icon.innerText = "🔊";
    }
}

    const currentImg = document.getElementById('current-track-img');
    const currentTitle = document.getElementById('current-title');
    const currentArtist = document.getElementById('current-artist');

    function playTrack(index) {
        if (playButtons.length === 0) return;

        if (index < 0) index = playButtons.length - 1;
        if (index >= playButtons.length) index = 0;
        
        currentTrackIndex = index;
        const btn = playButtons[index];
        
        const src = btn.getAttribute('data-src');
        const imgPath = btn.getAttribute('data-img');
        const artist = btn.getAttribute('data-artist');
        const title = btn.closest('.list-group-item').querySelector('h6').innerText;

        if (currentImg) currentImg.src = imgPath;
        if (currentTitle) currentTitle.innerText = title;
        if (currentArtist) currentArtist.innerText = artist;

        audioPlayer.src = src;
        audioPlayer.load();
        audioPlayer.play().then(() => {
            if (mainPlayBtn) mainPlayBtn.innerText = "⏸";
        }).catch(e => console.error("播放失败:", e));

        if (typeof gtag === 'function') {
            gtag('event', 'play_song', { 'song_name': title, 'artist': artist });
        }
    }


    playButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => playTrack(index));
    });

    if (mainPlayBtn) {
        mainPlayBtn.addEventListener('click', () => {
            if (!audioPlayer.src) {
                playTrack(0);
                return;
            }
            if (audioPlayer.paused) {
                audioPlayer.play();
                mainPlayBtn.innerText = "⏸";
            } else {
                audioPlayer.pause();
                mainPlayBtn.innerText = "▶";
            }
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => playTrack(currentTrackIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => playTrack(currentTrackIndex + 1));
    if (randomBtn) randomBtn.addEventListener('click', () => playTrack(Math.floor(Math.random() * playButtons.length)));

    audioPlayer.addEventListener('ended', () => playTrack(currentTrackIndex + 1));

    function formatTime(time) {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    }

    audioPlayer.addEventListener('timeupdate', () => {
        const { duration, currentTime } = audioPlayer;
        if (isNaN(duration)) return;
        
        const percent = (currentTime / duration) * 100;
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (currentTimeEl) currentTimeEl.innerText = formatTime(currentTime);
        if (durationTimeEl) durationTimeEl.innerText = formatTime(duration);
    });

    if (progressContainer) {
        progressContainer.addEventListener('click', function(e) {
            const width = this.clientWidth;
            const clickX = e.offsetX;
            const duration = audioPlayer.duration;
            audioPlayer.currentTime = (clickX / width) * duration;
        });
    }

    if (volumeControl) {
        audioPlayer.volume = volumeControl.value;
        volumeControl.addEventListener('input', function() {
            audioPlayer.volume = this.value;
            const volIcon = this.previousElementSibling;
            if (volIcon) {
                if (this.value == 0) volIcon.innerText = "🔇";
                else if (this.value < 0.5) volIcon.innerText = "🔉";
                else volIcon.innerText = "🔊";
            }
        });
    }
});

const backBtn = document.querySelector('.back-home-btn');

if (backBtn) {
    backBtn.addEventListener('click', function() {
 
        if (typeof gtag === 'function') {
            gtag('event', 'navigate_home', {
                'from_page': document.title,
                'event_category': 'Navigation'
            });
        }
    });
}

const downloadButtons = document.querySelectorAll('.download-track-btn');

downloadButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {

        e.preventDefault();
        
        const fileUrl = this.getAttribute('data-src');
        const songTitle = this.closest('.list-group-item').querySelector('h6').innerText;

        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = `${songTitle}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (typeof gtag === 'function') {
            gtag('event', 'file_download', {
                'file_name': songTitle,
                'file_extension': 'mp3',
                'event_label': 'Music List Download'
            });
        }
        
        console.log(`正在下载: ${songTitle}`);
    });
});
document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.classList.contains('collapsed')) {
            const memberName = this.innerText;
            if (typeof gtag === 'function') {
                gtag('event', 'bio_view', {
                    'member_name': memberName,
                    'event_category': 'Engagement'
                });
            }
        }
    });
});
