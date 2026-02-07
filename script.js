

document.addEventListener('DOMContentLoaded', function() {
    
    
    const artistItems = document.querySelectorAll('.artist-item');
    
    // 存储每个格子的计时器，防止逻辑冲突
    let playTimers = {};

    artistItems.forEach((item, index) => {
        const artistName = item.querySelector('h3').innerText;
        
        // 动态创建音频对象
        // 确保你的 audio 文件夹中有对应名称的 mp3，例如 "Leo-need.mp3"
        const audioPath = `audio/${artistName}.mp3`;
        const audio = new Audio(audioPath);
        audio.loop = true;

        // --- 1. 鼠标移入逻辑 (悬停 2 秒播放) ---
        item.addEventListener('mouseenter', function() {
            console.log(`已指向 ${artistName}，倒计时 2 秒开始...`);
            
            // 设置计时器
            playTimers[index] = setTimeout(() => {
                audio.currentTime = 0; // 确保从头开始播放
                
                // 播放音频并处理浏览器自动播放策略限制
                audio.play().then(() => {
                    console.log(`正在播放: ${artistName}`);
                    
                    // 【GA 追踪】：记录用户对特定歌手有深度兴趣 
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
                
            }, 1000); // 2000 毫秒 = 2 秒
        });

        // --- 2. 鼠标移出逻辑 (立即停止) ---
        item.addEventListener('mouseleave', function() {
            // 清除未完成的计时器
            clearTimeout(playTimers[index]);
            
            // 停止播放并重置进度
            audio.pause();
            audio.currentTime = 0;
            console.log(`停止播放: ${artistName}`);
        });

        // --- 3. 鼠标点击逻辑 (GA 点击记录) [cite: 13] ---
        item.addEventListener('click', function() {
            // 【GA 追踪】：记录点击转化率 
            if (typeof gtag === 'function') {
                gtag('event', 'artist_click', {
                    'artist_name': artistName,
                    'method': 'Grid Click'
                });
            }
       
        });
    });
});
// 在原有 script.js 基础上增加以下逻辑
/**
 * 6751YCOM Coursework 1 - 音乐播放器完整交互脚本
 * 集成功能：音量控制、进度条、随机播放、GA追踪、悬停试听
 */

document.addEventListener('DOMContentLoaded', function() {
    // --- 全局音频对象 ---
    const audioPlayer = new Audio();
    let currentTrackIndex = -1;

    // --- 1. 首页逻辑：九宫格悬停预览 ---
    const artistItems = document.querySelectorAll('.artist-item');
    let playTimers = {};

    artistItems.forEach((item, index) => {
        const h3 = item.querySelector('h3');
        if (!h3) return;
        const artistName = h3.innerText;
        // 这里的预览音频对象是独立的，不影响底部的全局播放器
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

    // --- 2. 详情页逻辑：播放器 UI 元素 ---
    const playButtons = document.querySelectorAll('.play-track-btn');
    const mainPlayBtn = document.getElementById('main-play-btn');
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const randomBtn = document.getElementById('random-play-btn');
    
    // 进度条与时间
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const currentTimeEl = document.getElementById('current-time');
    const durationTimeEl = document.getElementById('duration-time');

    // --- 音量与静音控制逻辑 ---
const volumeControl = document.getElementById('volume-control');
const muteBtn = document.getElementById('mute-btn');
let lastVolume = 0.5; // 用于存储静音前的音量

if (volumeControl && muteBtn) {
    // 1. 滑块控制音量
    volumeControl.addEventListener('input', function() {
        const val = parseFloat(this.value);
        audioPlayer.volume = val;
        updateVolumeIcon(val);
        if (val > 0) lastVolume = val; // 只要滑块大于0，就记录为上次音量
    });

    // 2. 点击图标切换静音
    muteBtn.addEventListener('click', function() {
        if (audioPlayer.volume > 0) {
            // 当前有声音 -> 变静音
            lastVolume = audioPlayer.volume;
            audioPlayer.volume = 0;
            volumeControl.value = 0;
            updateVolumeIcon(0);
        } else {
            // 当前静音 -> 恢复上次音量
            audioPlayer.volume = lastVolume;
            volumeControl.value = lastVolume;
            updateVolumeIcon(lastVolume);
        }

        // GA 追踪静音行为
        if (typeof gtag === 'function') {
            gtag('event', 'mute_toggle', { 'is_muted': audioPlayer.volume === 0 });
        }
    });
}

// 提取：统一更新图标的函数
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

    // 当前播放信息 UI
    const currentImg = document.getElementById('current-track-img');
    const currentTitle = document.getElementById('current-title');
    const currentArtist = document.getElementById('current-artist');

    // --- 3. 核心播放函数 ---
    function playTrack(index) {
        if (playButtons.length === 0) return;
        
        // 循环逻辑
        if (index < 0) index = playButtons.length - 1;
        if (index >= playButtons.length) index = 0;
        
        currentTrackIndex = index;
        const btn = playButtons[index];
        
        const src = btn.getAttribute('data-src');
        const imgPath = btn.getAttribute('data-img');
        const artist = btn.getAttribute('data-artist');
        const title = btn.closest('.list-group-item').querySelector('h6').innerText;

        // 更新 UI 信息
        if (currentImg) currentImg.src = imgPath;
        if (currentTitle) currentTitle.innerText = title;
        if (currentArtist) currentArtist.innerText = artist;

        // 加载并播放
        audioPlayer.src = src;
        audioPlayer.load();
        audioPlayer.play().then(() => {
            if (mainPlayBtn) mainPlayBtn.innerText = "⏸";
        }).catch(e => console.error("播放失败:", e));

        // GA 追踪
        if (typeof gtag === 'function') {
            gtag('event', 'play_song', { 'song_name': title, 'artist': artist });
        }
    }

    // --- 4. 事件监听绑定 ---

    // 列表播放按钮点击
    playButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => playTrack(index));
    });

    // 播放/暂停按钮
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

    // 上一首/下一首/随机播放
    if (prevBtn) prevBtn.addEventListener('click', () => playTrack(currentTrackIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => playTrack(currentTrackIndex + 1));
    if (randomBtn) randomBtn.addEventListener('click', () => playTrack(Math.floor(Math.random() * playButtons.length)));

    // 自动切歌
    audioPlayer.addEventListener('ended', () => playTrack(currentTrackIndex + 1));

    // --- 5. 进度条逻辑 ---
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

    // --- 6. 音量控制逻辑 ---
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
// 在 script.js 的 DOMContentLoaded 内部添加
const backBtn = document.querySelector('.back-home-btn');

if (backBtn) {
    backBtn.addEventListener('click', function() {
        // GA 追踪：记录返回首页的转化路径
        if (typeof gtag === 'function') {
            gtag('event', 'navigate_home', {
                'from_page': document.title,
                'event_category': 'Navigation'
            });
        }
    });
}
// 在 script.js 的 DOMContentLoaded 内部添加
const downloadButtons = document.querySelectorAll('.download-track-btn');

downloadButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        // 阻止按钮默认行为
        e.preventDefault();
        
        const fileUrl = this.getAttribute('data-src');
        const songTitle = this.closest('.list-group-item').querySelector('h6').innerText;

        // 创建隐藏的下载链接
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = `${songTitle}.mp3`; // 设置下载后的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // --- GA 追踪 (40% 权重核心) ---
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