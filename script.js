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
        
        // 添加主题切换动画
        body.classList.add('theme-transition');
        setTimeout(() => {
            body.classList.remove('theme-transition');
        }, 500);
    }
    
    getTimeBasedTheme() {
        const hour = new Date().getHours();
        
        if (hour >= 5 && hour < 12) {
            return 'morning';
        } else if (hour >= 12 && hour < 17) {
            return 'afternoon';
        } else if (hour >= 17 && hour < 20) {
            return 'evening';
        } else {
            return 'night';
        }
    }
    
    updateMoodDisplay(theme) {
        const moodIcon = document.getElementById('moodIcon');
        const moodText = document.getElementById('moodText');
        
        if (this.moodData[theme]) {
            moodIcon.textContent = this.moodData[theme].icon;
            moodText.textContent = this.moodData[theme].text;
        } else {
            moodIcon.textContent = '😊';
            moodText.textContent = '今天感觉不错！';
        }
    }
    
    updateTimeDisplay() {
        const now = new Date();
        const timeDisplay = document.getElementById('timeDisplay');
        const dateDisplay = document.getElementById('dateDisplay');
        const themeDisplay = document.getElementById('themeDisplay');
        
        // 更新时间
        timeDisplay.textContent = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // 更新日期
        dateDisplay.textContent = now.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
        
        // 更新主题显示
        const currentThemeName = this.themes[this.currentTheme]?.name || '自动';
        themeDisplay.textContent = `当前主题: ${currentThemeName}`;
    }
    
    startTimeUpdate() {
        setInterval(() => {
            this.updateTimeDisplay();
            
            // 如果是自动模式，检查是否需要切换主题
            if (this.currentTheme === 'auto') {
                const newTheme = this.getTimeBasedTheme();
                const currentAppliedTheme = document.body.getAttribute('data-theme');
                if (newTheme !== currentAppliedTheme) {
                    this.applyTheme('auto');
                }
            }
        }, 1000);
    }
    
    updateUI() {
        // 更新主题信息
        const themeDescription = document.getElementById('themeDescription');
        const currentThemeSpan = document.getElementById('currentTheme');
        const switchCountSpan = document.getElementById('switchCount');
        
        const themeInfo = this.themes[this.currentTheme];
        if (themeInfo) {
            themeDescription.textContent = themeInfo.description;
            currentThemeSpan.textContent = themeInfo.name;
        }
        
        switchCountSpan.textContent = this.switchCount;
    }
    
    saveTheme() {
        localStorage.setItem('dailyTheme', this.currentTheme);
        localStorage.setItem('themeSwitchCount', this.switchCount);
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('dailyTheme');
        const savedCount = localStorage.getItem('themeSwitchCount');
        
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
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    
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
    console.log('🎮 互动：p 释放粒子，c 变换颜色，a 播放动画');
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