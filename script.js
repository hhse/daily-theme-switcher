// 主题管理类
class ThemeManager {
    constructor() {
        this.currentTheme = 'auto';
        this.switchCount = 0;
        this.themes = {
            auto: { name: '自动模式', description: '根据时间自动切换主题' },
            morning: { name: '清晨', description: '温暖的晨光主题，充满希望和活力' },
            afternoon: { name: '午后', description: '明亮的午后主题，充满活力和创造力' },
            evening: { name: '黄昏', description: '温暖的夕阳主题，宁静而美好' },
            night: { name: '夜晚', description: '深邃的夜空主题，神秘而宁静' },
            happy: { name: '开心', description: '充满欢乐的彩色主题' },
            calm: { name: '平静', description: '柔和的平静主题，让人放松' },
            energetic: { name: '活力', description: '充满活力的橙色主题' },
            romantic: { name: '浪漫', description: '温馨浪漫的粉色主题' },
            random: { name: '随机', description: '每天随机选择一个主题' }
        };
        
        this.moodData = {
            morning: { icon: '🌅', text: '新的一天开始了！' },
            afternoon: { icon: '☀️', text: '充满活力的午后时光！' },
            evening: { icon: '🌆', text: '美丽的黄昏时分！' },
            night: { icon: '🌙', text: '宁静的夜晚时光！' },
            happy: { icon: '😊', text: '今天心情很好！' },
            calm: { icon: '😌', text: '内心很平静！' },
            energetic: { icon: '💪', text: '充满能量的一天！' },
            romantic: { icon: '💕', text: '浪漫的心情！' }
        };
        
        this.init();
    }
    
    init() {
        this.loadTheme();
        this.setupEventListeners();
        this.updateTimeDisplay();
        this.startTimeUpdate();
        this.applyTheme(this.currentTheme);
    }
    
    setupEventListeners() {
        // 主题按钮事件
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.setTheme(theme);
            });
        });
        
        // 互动按钮事件
        document.getElementById('particleBtn').addEventListener('click', () => {
            this.createParticles();
        });
        
        document.getElementById('colorBtn').addEventListener('click', () => {
            this.changeColors();
        });
        
        document.getElementById('animationBtn').addEventListener('click', () => {
            this.playAnimation();
        });
        
        // 新增互动按钮事件
        document.getElementById('typingBtn').addEventListener('click', () => {
            this.startTypingEffect();
        });
        
        document.getElementById('confettiBtn').addEventListener('click', () => {
            this.createConfetti();
        });
        
        document.getElementById('rainbowBtn').addEventListener('click', () => {
            this.toggleRainbowMode();
        });
    }
    
    setTheme(theme) {
        if (theme === 'random') {
            const randomThemes = Object.keys(this.themes).filter(t => t !== 'auto' && t !== 'random');
            theme = randomThemes[Math.floor(Math.random() * randomThemes.length)];
        }
        
        this.currentTheme = theme;
        this.switchCount++;
        this.applyTheme(theme);
        this.saveTheme();
        this.updateUI();
    }
    
    applyTheme(theme) {
        const body = document.body;
        
        // 移除所有主题类
        body.removeAttribute('data-theme');
        
        if (theme === 'auto') {
            theme = this.getTimeBasedTheme();
        }
        
        // 应用新主题
        body.setAttribute('data-theme', theme);
        
        // 更新按钮状态
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === this.currentTheme) {
                btn.classList.add('active');
            }
        });
        
        // 更新心情显示
        this.updateMoodDisplay(theme);
        
        // 更新主题描述
        const themeDescription = document.getElementById('themeDescription');
        if (themeDescription) {
            themeDescription.textContent = this.themes[theme]?.description || '当前主题会根据时间和心情自动调整，为您提供最佳的视觉体验。';
        }
    }
    
    getTimeBasedTheme() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 20) return 'evening';
        return 'night';
    }
    
    updateMoodDisplay(theme) {
        const moodIcon = document.getElementById('moodIcon');
        const moodText = document.getElementById('moodText');
        
        if (moodIcon && moodText) {
            const moodData = this.moodData[theme];
            if (moodData) {
                moodIcon.textContent = moodData.icon;
                moodText.textContent = moodData.text;
            }
        }
    }
    
    updateTimeDisplay() {
        const now = new Date();
        const timeDisplay = document.getElementById('timeDisplay');
        const dateDisplay = document.getElementById('dateDisplay');
        const themeDisplay = document.getElementById('themeDisplay');
        
        if (timeDisplay) {
            timeDisplay.textContent = now.toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
        }
        
        if (dateDisplay) {
            dateDisplay.textContent = now.toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            });
        }
        
        if (themeDisplay) {
            const currentTheme = this.currentTheme === 'auto' ? this.getTimeBasedTheme() : this.currentTheme;
            themeDisplay.textContent = `当前主题: ${this.themes[currentTheme]?.name || '未知'}`;
        }
    }
    
    startTimeUpdate() {
        setInterval(() => {
            this.updateTimeDisplay();
        }, 1000);
    }
    
    updateUI() {
        document.getElementById('switchCount').textContent = this.switchCount;
        document.getElementById('currentTheme').textContent = this.themes[this.currentTheme]?.name || '自动';
    }
    
    saveTheme() {
        localStorage.setItem('currentTheme', this.currentTheme);
        localStorage.setItem('switchCount', this.switchCount.toString());
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('currentTheme');
        const savedCount = localStorage.getItem('switchCount');
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }
        
        if (savedCount) {
            this.switchCount = parseInt(savedCount);
        }
    }
    
    // 粒子效果
    createParticles() {
        const container = document.getElementById('particlesContainer');
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // 随机位置
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                
                // 随机颜色
                const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                // 随机大小
                const size = Math.random() * 6 + 2;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                
                container.appendChild(particle);
                
                // 3秒后移除粒子
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 3000);
            }, i * 100);
        }
    }
    
    // 颜色变换效果
    changeColors() {
        const cards = document.querySelectorAll('.card');
        const colors = [
            'linear-gradient(135deg, #667eea, #764ba2)',
            'linear-gradient(135deg, #f093fb, #f5576c)',
            'linear-gradient(135deg, #4facfe, #00f2fe)',
            'linear-gradient(135deg, #43e97b, #38f9d7)',
            'linear-gradient(135deg, #fa709a, #fee140)'
        ];
        
        cards.forEach((card, index) => {
            card.style.background = colors[index % colors.length];
            card.style.color = 'white';
            card.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                card.style.background = '';
                card.style.color = '';
                card.style.transform = '';
            }, 2000);
        });
    }
    
    // 动画效果
    playAnimation() {
        const elements = document.querySelectorAll('.card, .theme-btn, .interactive-btn');
        
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('pulse');
                element.classList.add('glow');
                
                setTimeout(() => {
                    element.classList.remove('pulse');
                    element.classList.remove('glow');
                }, 1000);
            }, index * 200);
        });
    }
    
    // 新增功能方法
    
    // 打字机效果
    startTypingEffect() {
        const title = document.getElementById('typingTitle');
        const subtitle = document.getElementById('typingSubtitle');
        
        if (title) {
            const originalText = title.textContent;
            title.textContent = '';
            title.classList.add('typing');
            
            let i = 0;
            const typeWriter = () => {
                if (i < originalText.length) {
                    title.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    title.classList.remove('typing');
                }
            };
            typeWriter();
        }
        
        if (subtitle) {
            setTimeout(() => {
                const originalText = subtitle.textContent;
                subtitle.textContent = '';
                subtitle.classList.add('typing');
                
                let i = 0;
                const typeWriter = () => {
                    if (i < originalText.length) {
                        subtitle.textContent += originalText.charAt(i);
                        i++;
                        setTimeout(typeWriter, 50);
                    } else {
                        subtitle.classList.remove('typing');
                    }
                };
                typeWriter();
            }, 3000);
        }
    }
    
    // 彩带效果
    createConfetti() {
        const container = document.getElementById('confettiContainer');
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                
                // 随机位置
                confetti.style.left = Math.random() * 100 + '%';
                
                // 随机颜色
                const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                // 随机大小
                const size = Math.random() * 8 + 5;
                confetti.style.width = size + 'px';
                confetti.style.height = size + 'px';
                
                container.appendChild(confetti);
                
                // 3秒后移除彩带
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 3000);
            }, i * 50);
        }
    }
    
    // 彩虹模式
    toggleRainbowMode() {
        const body = document.body;
        body.classList.toggle('rainbow-mode');
        
        setTimeout(() => {
            body.classList.remove('rainbow-mode');
        }, 5000);
    }
}

// 音乐播放器类
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('backgroundMusic');
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.playlist = [
            { name: '轻音乐 - 清晨', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
            { name: '轻音乐 - 午后', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
            { name: '轻音乐 - 夜晚', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' }
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateSongInfo();
    }
    
    setupEventListeners() {
        document.getElementById('playMusic').addEventListener('click', () => {
            this.play();
        });
        
        document.getElementById('pauseMusic').addEventListener('click', () => {
            this.pause();
        });
        
        document.getElementById('nextMusic').addEventListener('click', () => {
            this.next();
        });
        
        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });
    }
    
    play() {
        if (!this.isPlaying) {
            this.audio.src = this.playlist[this.currentSongIndex].url;
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.updateSongInfo();
            }).catch(err => {
                console.log('音乐播放失败:', err);
                this.showMessage('音乐播放失败，请检查网络连接');
            });
        }
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateSongInfo();
    }
    
    next() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
        this.updateSongInfo();
        if (this.isPlaying) {
            this.play();
        }
    }
    
    setVolume(volume) {
        this.audio.volume = volume;
    }
    
    updateSongInfo() {
        const songElement = document.getElementById('currentSong');
        if (songElement) {
            songElement.textContent = this.isPlaying ? 
                `正在播放: ${this.playlist[this.currentSongIndex].name}` : 
                '当前无播放';
        }
    }
    
    showMessage(message) {
        const songElement = document.getElementById('currentSong');
        if (songElement) {
            songElement.textContent = message;
            setTimeout(() => {
                this.updateSongInfo();
            }, 3000);
        }
    }
}

// 天气API类
class WeatherAPI {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.getLocation();
    }
    
    setupEventListeners() {
        document.getElementById('refreshWeather').addEventListener('click', () => {
            this.getLocation();
        });
        
        document.getElementById('searchCity').addEventListener('click', () => {
            this.searchCity();
        });
        
        document.getElementById('cityInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchCity();
            }
        });
        
        // 快速城市按钮事件
        document.querySelectorAll('.quick-city-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const city = btn.getAttribute('data-city');
                this.getWeatherByCity(city);
            });
        });
    }
    
    searchCity() {
        const cityInput = document.getElementById('cityInput');
        const city = cityInput.value.trim();
        
        if (city) {
            this.getWeatherByCity(city);
            cityInput.value = '';
        }
    }
    
    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.getWeather(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.log('获取位置失败:', error);
                    // 如果获取位置失败，使用默认城市
                    this.getWeatherByCity('北京');
                }
            );
        } else {
            // 浏览器不支持地理位置，使用默认城市
            this.getWeatherByCity('北京');
        }
    }
    
    async getWeather(lat, lon) {
        try {
            this.showLoading();
            // 使用免费的天气API
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=439d4b804bc8187953eb36d2a8c26a02&units=metric&lang=zh_cn`);
            
            if (!response.ok) {
                throw new Error('天气API请求失败');
            }
            
            const data = await response.json();
            const weatherData = this.parseWeatherData(data);
            this.updateWeatherDisplay(weatherData);
        } catch (error) {
            console.log('获取天气失败:', error);
            // 如果API失败，使用模拟数据
            const weatherData = this.getMockWeatherData();
            this.updateWeatherDisplay(weatherData);
        }
    }
    
    async getWeatherByCity(city) {
        try {
            this.showLoading();
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=439d4b804bc8187953eb36d2a8c26a02&units=metric&lang=zh_cn`);
            
            if (!response.ok) {
                throw new Error('天气API请求失败');
            }
            
            const data = await response.json();
            const weatherData = this.parseWeatherData(data);
            this.updateWeatherDisplay(weatherData);
        } catch (error) {
            console.log('获取天气失败:', error);
            const weatherData = this.getMockWeatherData();
            this.updateWeatherDisplay(weatherData);
        }
    }
    
    showLoading() {
        document.getElementById('weatherLocation').textContent = '获取天气中...';
        document.getElementById('weatherTemp').textContent = '--°C';
        document.getElementById('weatherDesc').textContent = '--';
        document.getElementById('weatherIcon').textContent = '⏳';
    }
    
    parseWeatherData(data) {
        const weatherId = data.weather[0].id;
        const temperature = Math.round(data.main.temp);
        const condition = data.weather[0].description;
        const city = data.name;
        
        // 根据天气ID获取对应的图标
        const icon = this.getWeatherIcon(weatherId);
        
        return {
            location: city,
            temperature: temperature,
            condition: condition,
            icon: icon
        };
    }
    
    getWeatherIcon(weatherId) {
        // 根据OpenWeatherMap的天气ID返回对应的emoji图标
        if (weatherId >= 200 && weatherId < 300) return '⛈️'; // 雷雨
        if (weatherId >= 300 && weatherId < 400) return '🌧️'; // 小雨
        if (weatherId >= 500 && weatherId < 600) return '🌧️'; // 雨
        if (weatherId >= 600 && weatherId < 700) return '❄️'; // 雪
        if (weatherId >= 700 && weatherId < 800) return '🌫️'; // 雾
        if (weatherId === 800) return '☀️'; // 晴天
        if (weatherId === 801) return '🌤️'; // 少云
        if (weatherId >= 802 && weatherId < 900) return '☁️'; // 多云
        return '🌤️'; // 默认
    }
    
    getMockWeatherData() {
        const conditions = ['晴天', '多云', '小雨', '阴天'];
        const temperatures = [15, 20, 25, 30];
        const icons = ['☀️', '⛅', '🌧️', '☁️'];
        
        const randomIndex = Math.floor(Math.random() * conditions.length);
        
        return {
            location: '当前位置',
            temperature: temperatures[randomIndex],
            condition: conditions[randomIndex],
            icon: icons[randomIndex]
        };
    }
    
    updateWeatherDisplay(data) {
        document.getElementById('weatherLocation').textContent = data.location;
        document.getElementById('weatherTemp').textContent = `${data.temperature}°C`;
        document.getElementById('weatherDesc').textContent = data.condition;
        document.getElementById('weatherIcon').textContent = data.icon;
    }
    
    showWeatherError() {
        document.getElementById('weatherLocation').textContent = '无法获取位置';
        document.getElementById('weatherTemp').textContent = '--°C';
        document.getElementById('weatherDesc').textContent = '--';
        document.getElementById('weatherIcon').textContent = '❓';
    }
}

// 倒计时类
class CountdownTimer {
    constructor() {
        this.targetDate = null;
        this.countdownInterval = null;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSavedCountdown();
    }
    
    setupEventListeners() {
        document.getElementById('setCountdown').addEventListener('click', () => {
            this.setCountdown();
        });
    }
    
    setCountdown() {
        const dateInput = document.getElementById('countdownDate');
        const eventInput = document.getElementById('countdownEvent');
        
        if (dateInput.value) {
            this.targetDate = new Date(dateInput.value);
            const eventName = eventInput.value || '重要日子';
            
            localStorage.setItem('countdownDate', this.targetDate.getTime());
            localStorage.setItem('countdownEvent', eventName);
            
            this.startCountdown();
            this.updateEventName(eventName);
        }
    }
    
    loadSavedCountdown() {
        const savedDate = localStorage.getItem('countdownDate');
        const savedEvent = localStorage.getItem('countdownEvent');
        
        if (savedDate) {
            this.targetDate = new Date(parseInt(savedDate));
            this.startCountdown();
            if (savedEvent) {
                this.updateEventName(savedEvent);
            }
        }
    }
    
    startCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        this.updateCountdown();
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }
    
    updateCountdown() {
        if (!this.targetDate) return;
        
        const now = new Date().getTime();
        const distance = this.targetDate.getTime() - now;
        
        if (distance < 0) {
            this.showExpiredMessage();
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('daysCount').textContent = days.toString().padStart(2, '0');
        document.getElementById('hoursCount').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutesCount').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('secondsCount').textContent = seconds.toString().padStart(2, '0');
    }
    
    updateEventName(eventName) {
        document.getElementById('countdownEvent').textContent = `距离${eventName}`;
    }
    
    showExpiredMessage() {
        document.getElementById('daysCount').textContent = '00';
        document.getElementById('hoursCount').textContent = '00';
        document.getElementById('minutesCount').textContent = '00';
        document.getElementById('secondsCount').textContent = '00';
        document.getElementById('countdownEvent').textContent = '倒计时已结束！';
    }
}

// 语音控制类
class VoiceControl {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initSpeechRecognition();
    }
    
    setupEventListeners() {
        document.getElementById('startVoice').addEventListener('click', () => {
            this.startListening();
        });
        
        document.getElementById('stopVoice').addEventListener('click', () => {
            this.stopListening();
        });
    }
    
    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'zh-CN';
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceStatus('正在听取命令...', '🟢');
            };
            
            this.recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                this.processCommand(command);
            };
            
            this.recognition.onerror = (event) => {
                console.log('语音识别错误:', event.error);
                this.updateVoiceStatus('语音识别失败', '🔴');
                this.isListening = false;
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceStatus('点击开始语音控制', '🔴');
            };
        } else {
            this.updateVoiceStatus('浏览器不支持语音识别', '🔴');
        }
    }
    
    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
        }
    }
    
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }
    
    processCommand(command) {
        console.log('识别到命令:', command);
        
        if (command.includes('切换主题') || command.includes('随机主题')) {
            themeManager.setTheme('random');
            this.showMessage('已切换到随机主题');
        } else if (command.includes('清晨') || command.includes('早晨')) {
            themeManager.setTheme('morning');
            this.showMessage('已切换到清晨主题');
        } else if (command.includes('夜晚') || command.includes('晚上')) {
            themeManager.setTheme('night');
            this.showMessage('已切换到夜晚主题');
        } else if (command.includes('播放音乐')) {
            musicPlayer.play();
            this.showMessage('开始播放音乐');
        } else if (command.includes('释放粒子')) {
            themeManager.createParticles();
            this.showMessage('释放粒子效果');
        } else {
            this.showMessage('未识别的命令');
        }
    }
    
    updateVoiceStatus(message, indicator) {
        document.getElementById('voiceStatus').textContent = message;
        document.getElementById('voiceIndicator').textContent = indicator;
    }
    
    showMessage(message) {
        this.updateVoiceStatus(message, '🟢');
        setTimeout(() => {
            this.updateVoiceStatus('点击开始语音控制', '🔴');
        }, 2000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    window.musicPlayer = new MusicPlayer();
    window.weatherAPI = new WeatherAPI();
    window.countdownTimer = new CountdownTimer();
    window.voiceControl = new VoiceControl();
    
    // 添加页面加载动画
    document.body.classList.add('loading');
    
    // 添加一些初始的浮动形状动画
    const shapes = document.querySelectorAll('.floating-shape');
    shapes.forEach((shape, index) => {
        shape.style.animationDelay = (index * 0.5) + 's';
    });
    
    // 添加鼠标移动效果
    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.floating-shape');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
    
    // 添加键盘快捷键
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case '1':
                themeManager.setTheme('morning');
                break;
            case '2':
                themeManager.setTheme('afternoon');
                break;
            case '3':
                themeManager.setTheme('evening');
                break;
            case '4':
                themeManager.setTheme('night');
                break;
            case '5':
                themeManager.setTheme('happy');
                break;
            case '6':
                themeManager.setTheme('calm');
                break;
            case '7':
                themeManager.setTheme('energetic');
                break;
            case '8':
                themeManager.setTheme('romantic');
                break;
            case '0':
                themeManager.setTheme('auto');
                break;
            case 'r':
                themeManager.setTheme('random');
                break;
            case 'p':
                themeManager.createParticles();
                break;
            case 'c':
                themeManager.changeColors();
                break;
            case 'a':
                themeManager.playAnimation();
                break;
            case 't':
                themeManager.startTypingEffect();
                break;
            case 'f':
                themeManager.createConfetti();
                break;
            case 'b':
                themeManager.toggleRainbowMode();
                break;
            case 't':
                themeManager.startTypingEffect();
                break;
            case 'f':
                themeManager.createConfetti();
                break;
            case 'b':
                themeManager.toggleRainbowMode();
                break;
        }
    });
    
    // 添加触摸支持
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // 向上滑动 - 随机主题
                themeManager.setTheme('random');
            } else {
                // 向下滑动 - 自动模式
                themeManager.setTheme('auto');
            }
        }
    });
    
    // 添加滚动视差效果
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.background-decoration');
        const speed = scrolled * 0.5;
        
        parallax.style.transform = `translateY(${speed}px)`;
    });
    
    // 添加窗口大小改变时的响应
    window.addEventListener('resize', () => {
        // 重新计算布局
        setTimeout(() => {
            themeManager.updateTimeDisplay();
        }, 100);
    });
    
    // 添加页面可见性变化监听
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // 页面重新可见时更新时间
            themeManager.updateTimeDisplay();
        }
    });
    
    console.log('🎨 每日主题网页已加载完成！');
    console.log('💡 提示：使用数字键 1-8 快速切换主题，0 返回自动模式，r 随机主题');
    console.log('🎮 互动：p 释放粒子，c 变换颜色，a 播放动画，t 打字机效果，f 彩带，b 彩虹模式');
    console.log('🎤 语音控制：点击"开始语音"按钮进行语音控制');
});

// 添加一些额外的工具函数
class Utils {
    static getRandomColor() {
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
            '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    static getRandomGradient() {
        const gradients = [
            'linear-gradient(135deg, #667eea, #764ba2)',
            'linear-gradient(135deg, #f093fb, #f5576c)',
            'linear-gradient(135deg, #4facfe, #00f2fe)',
            'linear-gradient(135deg, #43e97b, #38f9d7)',
            'linear-gradient(135deg, #fa709a, #fee140)',
            'linear-gradient(135deg, #a8edea, #fed6e3)',
            'linear-gradient(135deg, #ffecd2, #fcb69f)',
            'linear-gradient(135deg, #ff9a9e, #fecfef)'
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
    }
    
    static animateValue(element, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * progress;
            element.textContent = Math.round(current);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
} 