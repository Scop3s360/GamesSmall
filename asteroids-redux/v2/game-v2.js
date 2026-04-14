// Game Configuration
const CONFIG = {
    canvas: {
        width: 1200,
        height: 800
    },
    ship: {
        size: 15,
        acceleration: 0.3,
        friction: 0.98,
        rotationSpeed: 0.08,
        maxSpeed: 8,
        invulnerabilityTime: 120,
        shieldMax: 100,
        shieldRegenRate: 0.2,
        shieldDrainRate: 1.5,
        teleportCooldown: 180
    },
    bullet: {
        speed: 10,
        lifetime: 60,
        size: 3
    },
    asteroid: {
        minSpeed: 0.5,
        maxSpeed: 2,
        sizes: [60, 40, 20],
        types: {
            standard: { health: 1, speedMult: 1, pointsMult: 1, color: '#888', fillColor: '#333' },
            armored: { health: 3, speedMult: 0.7, pointsMult: 3, color: '#4488ff', fillColor: '#224488' },
            fast: { health: 1, speedMult: 2, pointsMult: 2, color: '#ff6600', fillColor: '#883300' },
            explosive: { health: 1, speedMult: 1, pointsMult: 2, color: '#ffff00', fillColor: '#666600', explosionRadius: 80 }
        }
    },
    meteor: {
        speed: 8,
        size: 15,
        warningTime: 60, // 1 second warning
        spawnInterval: 300, // 5 seconds
        startLevel: 3
    },
    powerup: {
        lifetime: 600,
        spawnChance: 0.3
    },
    alien: {
        spawnInterval: 600,
        speed: 2,
        shootInterval: 120,
        size: 20
    },
    debris: {
        spawnChance: 0.4,
        speed: 1,
        size: 10
    },
    collectible: {
        lifetime: 400,
        value: 50
    },
    combo: {
        timeWindow: 120,
        multipliers: [1, 1.5, 2, 2.5, 3, 4, 5]
    },
    boss: {
        spawnLevel: 5,
        health: 50,
        size: 80,
        speed: 1.5
    },
    minion: {
        size: 10,
        speed: 3,
        shootInterval: 30,
        followDistance: 50
    }
};

// Game State
let canvas, ctx, audioContext;
let soundEnabled = true; // Sound control
let gameState = {
    running: false,
    paused: false,
    score: 0,
    lives: 3,
    level: 1,
    ship: null,
    bullets: [],
    asteroids: [],
    particles: [],
    powerups: [],
    aliens: [],
    debris: [],
    collectibles: [],
    alienBullets: [],
    meteors: [],
    meteorWarnings: [],
    keys: {},
    stars: [],
    frameCount: 0,
    alienSpawnTimer: 0,
    meteorSpawnTimer: 0,
    sounds: {},
    combo: 0,
    comboTimer: 0,
    comboDisplay: 0,
    screenShake: 0,
    boss: null,
    achievements: {
        firstKill: false,
        combo5: false,
        combo10: false,
        level5: false,
        level10: false,
        destroyBoss: false,
        collect50: false,
        noHit: true,
        allPowerups: new Set()
    },
    achievementQueue: [],
    stats: {
        kills: 0,
        collectiblesGathered: 0,
        bossesDefeated: 0
    }
};

// Initialize
window.onload = () => {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = CONFIG.canvas.width;
    canvas.height = CONFIG.canvas.height;
    
    // Load sound preference
    soundEnabled = localStorage.getItem('asteroidsSoundEnabled') !== 'false';
    updateSoundButton();
    
    // Initialize audio
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        initSounds();
    } catch (e) {
        console.log('Web Audio API not supported');
    }
    
    initStarfield();
    initGame();
    gameLoop();
};

// 8-bit Sound Generation
function initSounds() {
    gameState.sounds = {
        shoot: () => playSound(200, 0.1, 'square'),
        explosion: () => playSound(100, 0.3, 'sawtooth', true),
        powerup: () => playSound(400, 0.2, 'sine', false, [400, 600, 800]),
        hit: () => playSound(150, 0.15, 'triangle'),
        laser: () => playSound(800, 0.3, 'sine', false, [800, 600, 400]),
        alienShoot: () => playSound(250, 0.12, 'square'),
        collect: () => playSound(500, 0.15, 'sine', false, [500, 700]),
        combo: () => playSound(600, 0.1, 'sine', false, [600, 800, 1000]),
        achievement: () => playSound(800, 0.3, 'sine', false, [800, 1000, 1200, 1400]),
        bossSpawn: () => playSound(80, 0.5, 'sawtooth', false, [80, 70, 60, 50]),
        bossHit: () => playSound(120, 0.2, 'triangle'),
        cascade: () => playSound(300, 0.2, 'square', false, [300, 350, 400, 450]),
        meteorWarning: () => playSound(600, 0.1, 'sine', false, [600, 650]),
        meteorLaunch: () => playSound(150, 0.3, 'sawtooth', false, [150, 120, 100])
    };
}

function playSound(frequency, duration, type = 'sine', noise = false, sequence = null) {
    if (!audioContext || !soundEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = type;
    
    if (sequence) {
        const noteTime = duration / sequence.length;
        sequence.forEach((freq, i) => {
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + (i * noteTime));
        });
    } else {
        oscillator.frequency.value = frequency;
    }
    
    if (noise) {
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + duration);
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Starfield background
function initStarfield() {
    for (let i = 0; i < 100; i++) {
        gameState.stars.push({
            x: Math.random() * CONFIG.canvas.width,
            y: Math.random() * CONFIG.canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1
        });
    }
}

// Ship Class
class Ship {
    constructor() {
        this.x = CONFIG.canvas.width / 2;
        this.y = CONFIG.canvas.height / 2;
        this.vx = 0;
        this.vy = 0;
        this.angle = -Math.PI / 2;
        this.invulnerable = CONFIG.ship.invulnerabilityTime;
        this.shield = CONFIG.ship.shieldMax;
        this.shieldActive = false;
        this.teleportCooldown = 0;
        this.powerups = {
            rapidFire: 0,
            tripleShot: 0,
            spreadShot: 0,
            speedBoost: 0,
            ricochet: 0,
            timeSlow: 0,
            bomb: 0,
            cascadeMissile: 0,
            laser: 0,
            minions: 0
        };
        this.minions = [];
    }

    update() {
        if (gameState.keys['ArrowLeft']) this.angle -= CONFIG.ship.rotationSpeed;
        if (gameState.keys['ArrowRight']) this.angle += CONFIG.ship.rotationSpeed;

        const speedMultiplier = this.powerups.speedBoost > 0 ? 2 : 1;
        if (gameState.keys['ArrowUp']) {
            this.vx += Math.cos(this.angle) * CONFIG.ship.acceleration * speedMultiplier;
            this.vy += Math.sin(this.angle) * CONFIG.ship.acceleration * speedMultiplier;
            this.createThrustParticles();
        }

        this.vx *= CONFIG.ship.friction;
        this.vy *= CONFIG.ship.friction;

        const maxSpeed = CONFIG.ship.maxSpeed * speedMultiplier;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = CONFIG.canvas.width;
        if (this.x > CONFIG.canvas.width) this.x = 0;
        if (this.y < 0) this.y = CONFIG.canvas.height;
        if (this.y > CONFIG.canvas.height) this.y = 0;

        this.shieldActive = gameState.keys['Shift'] && this.shield > 0;
        if (this.shieldActive) {
            this.shield = Math.max(0, this.shield - CONFIG.ship.shieldDrainRate);
        } else if (this.shield < CONFIG.ship.shieldMax) {
            this.shield = Math.min(CONFIG.ship.shieldMax, this.shield + CONFIG.ship.shieldRegenRate);
        }

        if (this.invulnerable > 0) this.invulnerable--;

        for (let key in this.powerups) {
            if (this.powerups[key] > 0) this.powerups[key]--;
        }

        this.minions = this.minions.filter(minion => minion.update());

        document.getElementById('shields').textContent = Math.floor(this.shield);
    }

    fireLaser() {
        const laserLength = Math.max(CONFIG.canvas.width, CONFIG.canvas.height) * 2;
        const endX = this.x + Math.cos(this.angle) * laserLength;
        const endY = this.y + Math.sin(this.angle) * laserLength;
        
        for (let i = 0; i < 100; i++) {
            const t = i / 100;
            gameState.particles.push(new Particle(
                this.x + (endX - this.x) * t,
                this.y + (endY - this.y) * t,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                '#ff0000',
                15
            ));
        }
        
        gameState.asteroids = gameState.asteroids.filter(asteroid => {
            const dist = this.pointToLineDistance(asteroid.x, asteroid.y, this.x, this.y, endX, endY);
            if (dist < asteroid.radius) {
                createExplosion(asteroid.x, asteroid.y, asteroid.radius);
                const asteroidConfig = CONFIG.asteroid.types[asteroid.type];
                gameState.score += (3 - asteroid.size) * 10 * asteroidConfig.pointsMult;
                gameState.stats.kills++;
                spawnCollectible(asteroid.x, asteroid.y);
                if (asteroid.type === 'explosive') {
                    createShockwave(asteroid.x, asteroid.y, asteroidConfig.explosionRadius);
                }
                return false;
            }
            return true;
        });
        
        gameState.aliens = gameState.aliens.filter(alien => {
            const dist = this.pointToLineDistance(alien.x, alien.y, this.x, this.y, endX, endY);
            if (dist < alien.size) {
                createExplosion(alien.x, alien.y, alien.size);
                gameState.score += 100;
                gameState.stats.kills++;
                spawnCollectible(alien.x, alien.y);
                return false;
            }
            return true;
        });
        
        gameState.meteors = gameState.meteors.filter(meteor => {
            const dist = this.pointToLineDistance(meteor.x, meteor.y, this.x, this.y, endX, endY);
            if (dist < meteor.size) {
                createExplosion(meteor.x, meteor.y, meteor.size);
                gameState.score += 50;
                gameState.stats.kills++;
                return false;
            }
            return true;
        });
        
        if (gameState.boss) {
            const dist = this.pointToLineDistance(gameState.boss.x, gameState.boss.y, this.x, this.y, endX, endY);
            if (dist < gameState.boss.size) {
                gameState.boss.health -= 15;
                createExplosion(gameState.boss.x, gameState.boss.y, 30);
                if (gameState.sounds.bossHit) gameState.sounds.bossHit();
            }
        }
        
        if (gameState.sounds.laser) gameState.sounds.laser();
        gameState.screenShake = 20;
    }
    
    fireCascadeMissile() {
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            gameState.bullets.push(new Bullet(
                this.x,
                this.y,
                Math.cos(angle) * CONFIG.bullet.speed * 1.5,
                Math.sin(angle) * CONFIG.bullet.speed * 1.5,
                false,
                false
            ));
        }
        
        if (gameState.sounds.cascade) gameState.sounds.cascade();
        gameState.screenShake = 15;
    }
    
    pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        
        if (lenSq != 0) param = dot / lenSq;
        
        let xx, yy;
        
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    spawnMinions() {
        for (let i = 0; i < 2; i++) {
            const angle = (i / 2) * Math.PI * 2;
            const offsetX = Math.cos(angle) * CONFIG.minion.followDistance;
            const offsetY = Math.sin(angle) * CONFIG.minion.followDistance;
            this.minions.push(new Minion(this.x + offsetX, this.y + offsetY, i));
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        if (this.shieldActive) {
            ctx.beginPath();
            ctx.arc(0, 0, CONFIG.ship.size + 10, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 255, 255, ${this.shield / 100})`;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00ffff';
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        if (this.invulnerable === 0 || Math.floor(this.invulnerable / 10) % 2 === 0) {
            ctx.beginPath();
            ctx.moveTo(CONFIG.ship.size, 0);
            ctx.lineTo(-CONFIG.ship.size, -CONFIG.ship.size / 2);
            ctx.lineTo(-CONFIG.ship.size / 2, 0);
            ctx.lineTo(-CONFIG.ship.size, CONFIG.ship.size / 2);
            ctx.closePath();
            
            let shipColor = '#00ff00';
            if (this.powerups.speedBoost > 0) {
                shipColor = '#ff00ff';
            } else if (this.powerups.tripleShot > 0) {
                shipColor = '#ff00ff';
            } else if (this.powerups.rapidFire > 0) {
                shipColor = '#ffff00';
            }
            
            ctx.fillStyle = shipColor;
            ctx.shadowBlur = 15;
            ctx.shadowColor = shipColor;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        ctx.restore();
    }

    createThrustParticles() {
        const color = this.powerups.speedBoost > 0 ? '#ff00ff' : '#ff6600';
        for (let i = 0; i < 2; i++) {
            gameState.particles.push(new Particle(
                this.x - Math.cos(this.angle) * CONFIG.ship.size,
                this.y - Math.sin(this.angle) * CONFIG.ship.size,
                -Math.cos(this.angle) * 2 + (Math.random() - 0.5),
                -Math.sin(this.angle) * 2 + (Math.random() - 0.5),
                color,
                20
            ));
        }
    }

    shoot() {
        const fireRate = this.powerups.rapidFire > 0 ? 5 : 10;
        if (gameState.frameCount % fireRate !== 0) return;

        const ricochet = this.powerups.ricochet > 0;

        if (this.powerups.spreadShot > 0) {
            for (let i = -2; i <= 2; i++) {
                const angle = this.angle + (i * 0.3);
                gameState.bullets.push(new Bullet(
                    this.x + Math.cos(angle) * CONFIG.ship.size,
                    this.y + Math.sin(angle) * CONFIG.ship.size,
                    Math.cos(angle) * CONFIG.bullet.speed,
                    Math.sin(angle) * CONFIG.bullet.speed,
                    false,
                    ricochet
                ));
            }
        } else if (this.powerups.tripleShot > 0) {
            for (let i = -1; i <= 1; i++) {
                const angle = this.angle + (i * 0.2);
                gameState.bullets.push(new Bullet(
                    this.x + Math.cos(angle) * CONFIG.ship.size,
                    this.y + Math.sin(angle) * CONFIG.ship.size,
                    Math.cos(angle) * CONFIG.bullet.speed,
                    Math.sin(angle) * CONFIG.bullet.speed,
                    false,
                    ricochet
                ));
            }
        } else {
            gameState.bullets.push(new Bullet(
                this.x + Math.cos(this.angle) * CONFIG.ship.size,
                this.y + Math.sin(this.angle) * CONFIG.ship.size,
                Math.cos(this.angle) * CONFIG.bullet.speed,
                Math.sin(this.angle) * CONFIG.bullet.speed,
                false,
                ricochet
            ));
        }
        
        if (gameState.sounds.shoot) gameState.sounds.shoot();
    }
}

// Bullet Class
class Bullet {
    constructor(x, y, vx, vy, piercing = false, ricochet = false) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.lifetime = CONFIG.bullet.lifetime;
        this.piercing = piercing;
        this.ricochet = ricochet;
        this.bounces = ricochet ? 3 : 0;
        this.hit = false;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.lifetime--;

        if (this.ricochet && this.bounces > 0) {
            if (this.x < 0 || this.x > CONFIG.canvas.width) {
                this.vx *= -1;
                this.bounces--;
            }
            if (this.y < 0 || this.y > CONFIG.canvas.height) {
                this.vy *= -1;
                this.bounces--;
            }
        } else {
            if (this.x < 0) this.x = CONFIG.canvas.width;
            if (this.x > CONFIG.canvas.width) this.x = 0;
            if (this.y < 0) this.y = CONFIG.canvas.height;
            if (this.y > CONFIG.canvas.height) this.y = 0;
        }

        return this.lifetime > 0 && (this.piercing || !this.hit);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, CONFIG.bullet.size, 0, Math.PI * 2);
        ctx.fillStyle = this.ricochet ? '#ff9900' : (this.piercing ? '#00ffff' : '#fff');
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 2, this.y - this.vy * 2);
        const trailColor = this.ricochet ? 'rgba(255, 153, 0, 0.5)' : (this.piercing ? 'rgba(0, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.5)');
        ctx.strokeStyle = trailColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Asteroid Class (with types!)
class Asteroid {
    constructor(x, y, size, type = null) {
        this.x = x;
        this.y = y;
        this.size = size;
        
        // Determine type (weighted random for first spawn)
        if (!type) {
            const rand = Math.random();
            if (rand < 0.5) this.type = 'standard';
            else if (rand < 0.7) this.type = 'fast';
            else if (rand < 0.85) this.type = 'armored';
            else this.type = 'explosive';
        } else {
            this.type = type;
        }
        
        const asteroidConfig = CONFIG.asteroid.types[this.type];
        this.health = asteroidConfig.health;
        this.maxHealth = asteroidConfig.health;
        
        this.radius = CONFIG.asteroid.sizes[size];
        const speed = (Math.random() * (CONFIG.asteroid.maxSpeed - CONFIG.asteroid.minSpeed) + CONFIG.asteroid.minSpeed) * asteroidConfig.speedMult;
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        this.points = this.generateShape();
    }

    generateShape() {
        const points = [];
        const numPoints = 8 + Math.floor(Math.random() * 4);
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const radius = this.radius * (0.8 + Math.random() * 0.4);
            points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
        }
        return points;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        if (this.x < -this.radius) this.x = CONFIG.canvas.width + this.radius;
        if (this.x > CONFIG.canvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = CONFIG.canvas.height + this.radius;
        if (this.y > CONFIG.canvas.height + this.radius) this.y = -this.radius;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const asteroidConfig = CONFIG.asteroid.types[this.type];
        
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
        
        ctx.strokeStyle = asteroidConfig.color;
        ctx.lineWidth = 2;
        
        // Glow effect for explosive
        if (this.type === 'explosive') {
            ctx.shadowBlur = 15;
            ctx.shadowColor = asteroidConfig.color;
        }
        
        ctx.stroke();
        ctx.fillStyle = asteroidConfig.fillColor;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Health indicator for armored asteroids
        if (this.type === 'armored' && this.health < this.maxHealth) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.health, 0, 0);
        }
        
        ctx.restore();
    }

    takeDamage() {
        this.health--;
        return this.health <= 0;
    }

    split() {
        if (this.size < 2) {
            // Children inherit parent type
            return [
                new Asteroid(this.x, this.y, this.size + 1, this.type),
                new Asteroid(this.x, this.y, this.size + 1, this.type)
            ];
        }
        return [];
    }
}

// Meteor Class (NEW!)
class Meteor {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.size = CONFIG.meteor.size;
        
        // Calculate direction toward target
        const angle = Math.atan2(targetY - y, targetX - x);
        this.vx = Math.cos(angle) * CONFIG.meteor.speed;
        this.vy = Math.sin(angle) * CONFIG.meteor.speed;
        this.angle = angle;
        
        // Trail effect
        this.trail = [];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Add to trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) this.trail.shift();
        
        // Remove if off screen
        const margin = 100;
        return !(this.x < -margin || this.x > CONFIG.canvas.width + margin ||
                 this.y < -margin || this.y > CONFIG.canvas.height + margin);
    }

    draw() {
        // Draw trail
        ctx.strokeStyle = 'rgba(255, 100, 0, 0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = i / this.trail.length;
            if (i === 0) {
                ctx.moveTo(this.trail[i].x, this.trail[i].y);
            } else {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
        }
        ctx.stroke();
        
        // Draw meteor
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        ctx.beginPath();
        ctx.moveTo(this.size, 0);
        ctx.lineTo(-this.size, -this.size / 2);
        ctx.lineTo(-this.size / 2, 0);
        ctx.lineTo(-this.size, this.size / 2);
        ctx.closePath();
        
        ctx.fillStyle = '#ff6600';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff6600';
        ctx.fill();
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        ctx.restore();
    }
}

// Meteor Warning Class
class MeteorWarning {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.timer = CONFIG.meteor.warningTime;
        this.pulse = 0;
    }

    update() {
        this.timer--;
        this.pulse += 0.2;
        return this.timer > 0;
    }

    draw() {
        const alpha = Math.sin(this.pulse) * 0.5 + 0.5;
        const size = 20 + Math.sin(this.pulse) * 5;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Warning symbol
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.866, size / 2);
        ctx.lineTo(-size * 0.866, size / 2);
        ctx.closePath();
        
        ctx.strokeStyle = `rgba(255, 0, 0, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff0000';
        ctx.stroke();
        
        // Exclamation mark
        ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', 0, 0);
        
        ctx.shadowBlur = 0;
        ctx.restore();
        
        // Draw line to target
        ctx.strokeStyle = `rgba(255, 0, 0, ${alpha * 0.3})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.targetX, this.targetY);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

// Particle Class
class Particle {
    constructor(x, y, vx, vy, color, lifetime) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.lifetime = lifetime;
        this.maxLifetime = lifetime;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.lifetime--;
        return this.lifetime > 0;
    }

    draw() {
        const alpha = this.lifetime / this.maxLifetime;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.fill();
    }
}

// Powerup Class
class Powerup {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.lifetime = CONFIG.powerup.lifetime;
        this.pulse = 0;
    }

    update() {
        this.lifetime--;
        this.pulse += 0.1;
        return this.lifetime > 0;
    }

    draw() {
        const size = 15 + Math.sin(this.pulse) * 3;
        ctx.save();
        ctx.translate(this.x, this.y);
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.getColor();
        
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fillStyle = this.getColor();
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.getSymbol(), 0, 0);
        
        ctx.restore();
    }

    getColor() {
        switch(this.type) {
            case 'rapidFire': return '#ffff00';
            case 'tripleShot': return '#ff00ff';
            case 'spreadShot': return '#00ff99';
            case 'shield': return '#00ff00';
            case 'speedBoost': return '#ff00ff';
            case 'ricochet': return '#ff9900';
            case 'timeSlow': return '#9966ff';
            case 'bomb': return '#ff6600';
            case 'cascadeMissile': return '#ff0099';
            case 'laser': return '#ff0000';
            case 'minions': return '#00ccff';
            default: return '#fff';
        }
    }

    getSymbol() {
        switch(this.type) {
            case 'rapidFire': return 'R';
            case 'tripleShot': return '3';
            case 'spreadShot': return 'W';
            case 'shield': return 'S';
            case 'speedBoost': return 'F';
            case 'ricochet': return 'O';
            case 'timeSlow': return 'Ⓢ';
            case 'bomb': return '💣';
            case 'cascadeMissile': return 'M';
            case 'laser': return 'L';
            case 'minions': return 'D';
            default: return '?';
        }
    }
}

// Alien/UFO Class
class Alien {
    constructor() {
        const side = Math.floor(Math.random() * 4);
        switch(side) {
            case 0:
                this.x = Math.random() * CONFIG.canvas.width;
                this.y = -CONFIG.alien.size;
                break;
            case 1:
                this.x = CONFIG.canvas.width + CONFIG.alien.size;
                this.y = Math.random() * CONFIG.canvas.height;
                break;
            case 2:
                this.x = Math.random() * CONFIG.canvas.width;
                this.y = CONFIG.canvas.height + CONFIG.alien.size;
                break;
            case 3:
                this.x = -CONFIG.alien.size;
                this.y = Math.random() * CONFIG.canvas.height;
                break;
        }
        
        const angle = Math.atan2(gameState.ship.y - this.y, gameState.ship.x - this.x);
        this.vx = Math.cos(angle) * CONFIG.alien.speed;
        this.vy = Math.sin(angle) * CONFIG.alien.speed;
        this.shootTimer = CONFIG.alien.shootInterval;
        this.size = CONFIG.alien.size;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        this.shootTimer--;
        if (this.shootTimer <= 0) {
            this.shoot();
            this.shootTimer = CONFIG.alien.shootInterval;
        }
        
        const margin = 200;
        return !(this.x < -margin || this.x > CONFIG.canvas.width + margin ||
                 this.y < -margin || this.y > CONFIG.canvas.height + margin);
    }

    shoot() {
        const angle = Math.atan2(gameState.ship.y - this.y, gameState.ship.x - this.x);
        gameState.alienBullets.push({
            x: this.x,
            y: this.y,
            vx: Math.cos(angle) * 5,
            vy: Math.sin(angle) * 5,
            lifetime: 120
        });
        if (gameState.sounds.alienShoot) gameState.sounds.alienShoot();
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        ctx.beginPath();
        ctx.arc(0, -5, 10, 0, Math.PI, true);
        ctx.moveTo(-15, 0);
        ctx.lineTo(-10, 5);
        ctx.lineTo(10, 5);
        ctx.lineTo(15, 0);
        ctx.lineTo(-15, 0);
        
        ctx.fillStyle = '#ff0000';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff0000';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.arc(i * 8, 3, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffff00';
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Space Debris Class
class Debris {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * CONFIG.debris.speed + 0.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = CONFIG.debris.size;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.shape = Math.floor(Math.random() * 3);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        
        if (this.x < -this.size) this.x = CONFIG.canvas.width + this.size;
        if (this.x > CONFIG.canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = CONFIG.canvas.height + this.size;
        if (this.y > CONFIG.canvas.height + this.size) this.y = -this.size;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#666';
        
        switch(this.shape) {
            case 0:
                ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);
                break;
            case 1:
                ctx.beginPath();
                ctx.moveTo(0, -this.size/2);
                ctx.lineTo(this.size/2, this.size/2);
                ctx.lineTo(-this.size/2, this.size/2);
                ctx.closePath();
                ctx.stroke();
                break;
            case 2:
                ctx.beginPath();
                ctx.moveTo(-this.size/2, 0);
                ctx.lineTo(this.size/2, 0);
                ctx.moveTo(0, -this.size/2);
                ctx.lineTo(0, this.size/2);
                ctx.stroke();
                break;
        }
        
        ctx.shadowBlur = 0;
        ctx.restore();
    }
}

// Score Collectible Class
class Collectible {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.lifetime = CONFIG.collectible.lifetime;
        this.pulse = 0;
        this.value = CONFIG.collectible.value;
    }

    update() {
        this.lifetime--;
        this.pulse += 0.15;
        return this.lifetime > 0;
    }

    draw() {
        const size = 8 + Math.sin(this.pulse) * 3;
        ctx.save();
        ctx.translate(this.x, this.y);
        
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const radius = i % 2 === 0 ? size : size / 2;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        
        ctx.fillStyle = '#ffff00';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffff00';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        ctx.restore();
    }
}

// Boss Class
class Boss {
    constructor() {
        this.x = CONFIG.canvas.width / 2;
        this.y = -CONFIG.boss.size;
        this.size = CONFIG.boss.size;
        this.health = CONFIG.boss.health;
        this.maxHealth = CONFIG.boss.health;
        this.vx = 0;
        this.vy = CONFIG.boss.speed;
        this.shootTimer = 60;
        this.phase = 0;
        this.phaseTimer = 0;
        this.rotation = 0;
    }

    update() {
        this.phaseTimer++;
        if (this.phaseTimer > 180) {
            this.phase = (this.phase + 1) % 3;
            this.phaseTimer = 0;
        }

        switch(this.phase) {
            case 0:
                const angle = this.phaseTimer * 0.02;
                this.vx = Math.cos(angle) * 2;
                this.vy = Math.sin(angle) * 2;
                break;
            case 1:
                const dx = gameState.ship.x - this.x;
                const dy = gameState.ship.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                this.vx = (dx / dist) * CONFIG.boss.speed;
                this.vy = (dy / dist) * CONFIG.boss.speed;
                break;
            case 2:
                this.vx = Math.sin(this.phaseTimer * 0.05) * 3;
                this.vy = 1;
                break;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.rotation += 0.02;

        if (this.x < this.size) this.x = this.size;
        if (this.x > CONFIG.canvas.width - this.size) this.x = CONFIG.canvas.width - this.size;
        if (this.y < this.size) this.y = this.size;
        if (this.y > CONFIG.canvas.height - this.size) this.y = CONFIG.canvas.height - this.size;

        this.shootTimer--;
        if (this.shootTimer <= 0) {
            this.shoot();
            this.shootTimer = 40;
        }

        return this.health > 0;
    }

    shoot() {
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            gameState.alienBullets.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * 4,
                vy: Math.sin(angle) * 4,
                lifetime: 150
            });
        }
        if (gameState.sounds.alienShoot) gameState.sounds.alienShoot();
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#ff0000';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = '#ff6600';
        ctx.fill();

        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * this.size * 0.7, Math.sin(angle) * this.size * 0.7);
            ctx.lineTo(Math.cos(angle) * this.size * 1.2, Math.sin(angle) * this.size * 1.2);
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        ctx.shadowBlur = 0;
        ctx.restore();

        const barWidth = 100;
        const barHeight = 10;
        const healthPercent = this.health / this.maxHealth;
        
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - barWidth/2, this.y - this.size - 20, barWidth, barHeight);
        ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        ctx.fillRect(this.x - barWidth/2, this.y - this.size - 20, barWidth * healthPercent, barHeight);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(this.x - barWidth/2, this.y - this.size - 20, barWidth, barHeight);
    }
}

// Minion Class (Defense Drones)
class Minion {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.size = CONFIG.minion.size;
        this.shootTimer = CONFIG.minion.shootInterval;
        this.lifetime = 600;
        this.angle = 0;
    }

    update() {
        this.lifetime--;
        if (this.lifetime <= 0) return false;
        
        if (!gameState.ship) return false;
        
        const targetAngle = (this.id / 2) * Math.PI * 2 + gameState.frameCount * 0.02;
        const targetX = gameState.ship.x + Math.cos(targetAngle) * CONFIG.minion.followDistance;
        const targetY = gameState.ship.y + Math.sin(targetAngle) * CONFIG.minion.followDistance;
        
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 5) {
            this.x += (dx / dist) * CONFIG.minion.speed;
            this.y += (dy / dist) * CONFIG.minion.speed;
        }
        
        let closestTarget = null;
        let closestDist = Infinity;
        
        for (let asteroid of gameState.asteroids) {
            const d = distance(this.x, this.y, asteroid.x, asteroid.y);
            if (d < closestDist) {
                closestDist = d;
                closestTarget = { x: asteroid.x, y: asteroid.y };
            }
        }
        
        for (let alien of gameState.aliens) {
            const d = distance(this.x, this.y, alien.x, alien.y);
            if (d < closestDist) {
                closestDist = d;
                closestTarget = { x: alien.x, y: alien.y };
            }
        }
        
        if (gameState.boss) {
            const d = distance(this.x, this.y, gameState.boss.x, gameState.boss.y);
            if (d < closestDist) {
                closestDist = d;
                closestTarget = { x: gameState.boss.x, y: gameState.boss.y };
            }
        }
        
        if (closestTarget) {
            this.angle = Math.atan2(closestTarget.y - this.y, closestTarget.x - this.x);
            this.shootTimer--;
            if (this.shootTimer <= 0) {
                gameState.bullets.push(new Bullet(
                    this.x,
                    this.y,
                    Math.cos(this.angle) * CONFIG.bullet.speed,
                    Math.sin(this.angle) * CONFIG.bullet.speed,
                    false,
                    false
                ));
                this.shootTimer = CONFIG.minion.shootInterval;
            }
        }
        
        return true;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#00ccff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ccff';
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.size, 0);
        ctx.lineTo(this.size + 5, 0);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.restore();
    }
}

// Game Functions
function initGame() {
    gameState.running = true;
    gameState.paused = false;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;
    gameState.ship = new Ship();
    gameState.bullets = [];
    gameState.asteroids = [];
    gameState.particles = [];
    gameState.powerups = [];
    gameState.aliens = [];
    gameState.debris = [];
    gameState.collectibles = [];
    gameState.alienBullets = [];
    gameState.meteors = [];
    gameState.meteorWarnings = [];
    gameState.frameCount = 0;
    gameState.alienSpawnTimer = CONFIG.alien.spawnInterval;
    gameState.meteorSpawnTimer = CONFIG.meteor.spawnInterval;
    gameState.combo = 0;
    gameState.comboTimer = 0;
    gameState.comboDisplay = 0;
    gameState.screenShake = 0;
    gameState.boss = null;
    gameState.achievementQueue = [];
    gameState.stats = {
        kills: 0,
        collectiblesGathered: 0,
        bossesDefeated: 0
    };
    
    spawnAsteroids(4); // Start with 4 asteroids
    spawnDebris(3);
    updateUI();
}

// NEW: Spawn asteroids from screen edges!
function spawnAsteroids(count) {
    for (let i = 0; i < count; i++) {
        let x, y, vx, vy;
        
        // Spawn from random edge
        const edge = Math.floor(Math.random() * 4);
        const margin = 50;
        
        switch(edge) {
            case 0: // Top
                x = Math.random() * CONFIG.canvas.width;
                y = -margin;
                break;
            case 1: // Right
                x = CONFIG.canvas.width + margin;
                y = Math.random() * CONFIG.canvas.height;
                break;
            case 2: // Bottom
                x = Math.random() * CONFIG.canvas.width;
                y = CONFIG.canvas.height + margin;
                break;
            case 3: // Left
                x = -margin;
                y = Math.random() * CONFIG.canvas.height;
                break;
        }
        
        // 50% chance to aim toward player, 50% chance to drift across
        if (Math.random() < 0.5) {
            // Aim toward player
            const angle = Math.atan2(gameState.ship.y - y, gameState.ship.x - x);
            const speed = Math.random() * (CONFIG.asteroid.maxSpeed - CONFIG.asteroid.minSpeed) + CONFIG.asteroid.minSpeed;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
        } else {
            // Drift across screen
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * (CONFIG.asteroid.maxSpeed - CONFIG.asteroid.minSpeed) + CONFIG.asteroid.minSpeed;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
        }
        
        const asteroid = new Asteroid(x, y, 0);
        asteroid.vx = vx;
        asteroid.vy = vy;
        gameState.asteroids.push(asteroid);
    }
}

// NEW: Spawn meteors!
function spawnMeteor() {
    if (gameState.level < CONFIG.meteor.startLevel) return;
    
    // Spawn from random edge
    let x, y;
    const edge = Math.floor(Math.random() * 4);
    const margin = 100;
    
    switch(edge) {
        case 0: // Top
            x = Math.random() * CONFIG.canvas.width;
            y = -margin;
            break;
        case 1: // Right
            x = CONFIG.canvas.width + margin;
            y = Math.random() * CONFIG.canvas.height;
            break;
        case 2: // Bottom
            x = Math.random() * CONFIG.canvas.width;
            y = CONFIG.canvas.height + margin;
            break;
        case 3: // Left
            x = -margin;
            y = Math.random() * CONFIG.canvas.height;
            break;
    }
    
    // Target player's current position
    const targetX = gameState.ship.x;
    const targetY = gameState.ship.y;
    
    // Create warning first
    gameState.meteorWarnings.push(new MeteorWarning(x, y, targetX, targetY));
    if (gameState.sounds.meteorWarning) gameState.sounds.meteorWarning();
    
    // Schedule meteor spawn after warning
    setTimeout(() => {
        if (gameState.running) {
            gameState.meteors.push(new Meteor(x, y, targetX, targetY));
            if (gameState.sounds.meteorLaunch) gameState.sounds.meteorLaunch();
        }
    }, CONFIG.meteor.warningTime * (1000 / 60)); // Convert frames to ms
}

function spawnPowerup(x, y) {
    if (Math.random() < CONFIG.powerup.spawnChance) {
        const types = ['rapidFire', 'tripleShot', 'spreadShot', 'shield', 'speedBoost', 'ricochet', 'timeSlow', 'bomb', 'cascadeMissile', 'laser', 'minions'];
        const type = types[Math.floor(Math.random() * types.length)];
        gameState.powerups.push(new Powerup(x, y, type));
    }
}

function spawnCollectible(x, y) {
    if (Math.random() < 0.5) {
        gameState.collectibles.push(new Collectible(x, y));
    }
}

function spawnDebris(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * CONFIG.canvas.width;
        const y = Math.random() * CONFIG.canvas.height;
        gameState.debris.push(new Debris(x, y));
    }
}

// NEW: Create shockwave for explosive asteroids
function createShockwave(x, y, radius) {
    // Damage nearby asteroids
    gameState.asteroids.forEach(asteroid => {
        const dist = distance(x, y, asteroid.x, asteroid.y);
        if (dist < radius) {
            if (asteroid.takeDamage()) {
                // Asteroid destroyed by shockwave
                createExplosion(asteroid.x, asteroid.y, asteroid.radius);
                const asteroidConfig = CONFIG.asteroid.types[asteroid.type];
                gameState.score += (3 - asteroid.size) * 10 * asteroidConfig.pointsMult;
                gameState.stats.kills++;
                spawnCollectible(asteroid.x, asteroid.y);
                
                const newAsteroids = asteroid.split();
                const index = gameState.asteroids.indexOf(asteroid);
                if (index > -1) {
                    gameState.asteroids.splice(index, 1);
                    gameState.asteroids.push(...newAsteroids);
                }
            }
        }
    });
    
    // Visual shockwave
    for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 2;
        gameState.particles.push(new Particle(
            x, y,
            Math.cos(angle) * 5,
            Math.sin(angle) * 5,
            '#ffff00',
            30
        ));
    }
    
    gameState.screenShake = 15;
}

function gameLoop() {
    if (gameState.running && !gameState.paused) {
        update();
        draw();
    }
    requestAnimationFrame(gameLoop);
}

function update() {
    gameState.frameCount++;
    
    const timeScale = gameState.ship.powerups.timeSlow > 0 ? 0.5 : 1;
    
    gameState.ship.update();
    
    if (gameState.keys[' ']) {
        gameState.ship.shoot();
    }
    
    gameState.bullets = gameState.bullets.filter(bullet => bullet.update());
    
    gameState.alienBullets = gameState.alienBullets.filter(bullet => {
        bullet.x += bullet.vx * timeScale;
        bullet.y += bullet.vy * timeScale;
        bullet.lifetime--;
        return bullet.lifetime > 0;
    });
    
    gameState.asteroids.forEach(asteroid => {
        if (timeScale < 1) {
            const oldVx = asteroid.vx;
            const oldVy = asteroid.vy;
            asteroid.vx *= timeScale;
            asteroid.vy *= timeScale;
            asteroid.update();
            asteroid.vx = oldVx;
            asteroid.vy = oldVy;
        } else {
            asteroid.update();
        }
    });
    
    // Update meteors
    gameState.meteors = gameState.meteors.filter(meteor => meteor.update());
    
    // Update meteor warnings
    gameState.meteorWarnings = gameState.meteorWarnings.filter(warning => warning.update());
    
    gameState.particles = gameState.particles.filter(particle => particle.update());
    
    gameState.powerups = gameState.powerups.filter(powerup => powerup.update());
    
    gameState.collectibles = gameState.collectibles.filter(collectible => collectible.update());
    
    gameState.debris.forEach(debris => debris.update());
    
    gameState.aliens = gameState.aliens.filter(alien => {
        if (timeScale < 1) {
            const oldVx = alien.vx;
            const oldVy = alien.vy;
            alien.vx *= timeScale;
            alien.vy *= timeScale;
            const result = alien.update();
            alien.vx = oldVx;
            alien.vy = oldVy;
            return result;
        }
        return alien.update();
    });
    
    if (gameState.boss) {
        if (!gameState.boss.update()) {
            createExplosion(gameState.boss.x, gameState.boss.y, 100);
            gameState.score += 1000;
            gameState.stats.bossesDefeated++;
            checkAchievement('destroyBoss');
            gameState.boss = null;
            if (gameState.sounds.explosion) gameState.sounds.explosion();
            gameState.screenShake = 30;
        }
    }
    
    if (!gameState.boss) {
        gameState.alienSpawnTimer--;
        if (gameState.alienSpawnTimer <= 0 && gameState.aliens.length < 3) {
            gameState.aliens.push(new Alien());
            gameState.alienSpawnTimer = CONFIG.alien.spawnInterval;
        }
        
        // Spawn meteors after level 3
        if (gameState.level >= CONFIG.meteor.startLevel) {
            gameState.meteorSpawnTimer--;
            if (gameState.meteorSpawnTimer <= 0) {
                const meteorCount = Math.min(Math.floor(gameState.level / 3), 3);
                for (let i = 0; i < meteorCount; i++) {
                    spawnMeteor();
                }
                gameState.meteorSpawnTimer = CONFIG.meteor.spawnInterval;
            }
        }
    }
    
    if (gameState.comboTimer > 0) {
        gameState.comboTimer--;
        if (gameState.comboTimer === 0) {
            gameState.combo = 0;
        }
    }
    
    if (gameState.comboDisplay > 0) {
        gameState.comboDisplay--;
    }
    
    if (gameState.screenShake > 0) {
        gameState.screenShake--;
    }
    
    if (gameState.achievementQueue.length > 0) {
        gameState.achievementQueue[0].timer--;
        if (gameState.achievementQueue[0].timer <= 0) {
            gameState.achievementQueue.shift();
        }
    }
    
    checkCollisions();
    
    // Level complete - NO MORE EXTRA LIFE
    if (gameState.asteroids.length === 0 && !gameState.boss) {
        gameState.level++;
        
        if (gameState.level % CONFIG.boss.spawnLevel === 0) {
            gameState.boss = new Boss();
            if (gameState.sounds.bossSpawn) gameState.sounds.bossSpawn();
            gameState.screenShake = 20;
        } else {
            const asteroidCount = Math.min(4 + gameState.level, 12); // More asteroids!
            const debrisCount = Math.min(3 + gameState.level, 10);
            spawnAsteroids(asteroidCount);
            spawnDebris(debrisCount);
        }
        
        if (gameState.level === 5) checkAchievement('level5');
        if (gameState.level === 10) checkAchievement('level10');
        
        updateUI();
    }
}

function checkCollisions() {
    // Bullets vs Asteroids (with health system!)
    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
        const bullet = gameState.bullets[i];
        
        for (let j = gameState.asteroids.length - 1; j >= 0; j--) {
            const asteroid = gameState.asteroids[j];
            
            if (distance(bullet.x, bullet.y, asteroid.x, asteroid.y) < asteroid.radius) {
                if (!bullet.piercing) {
                    bullet.hit = true;
                }
                
                // Damage asteroid
                if (asteroid.takeDamage()) {
                    // Asteroid destroyed
                    createExplosion(asteroid.x, asteroid.y, asteroid.radius);
                    
                    const asteroidConfig = CONFIG.asteroid.types[asteroid.type];
                    
                    // Explosive asteroids create shockwave
                    if (asteroid.type === 'explosive') {
                        createShockwave(asteroid.x, asteroid.y, asteroidConfig.explosionRadius);
                    }
                    
                    const newAsteroids = asteroid.split();
                    gameState.asteroids.splice(j, 1);
                    gameState.asteroids.push(...newAsteroids);
                    
                    addCombo();
                    const comboMultiplier = getComboMultiplier();
                    const baseScore = (3 - asteroid.size) * 10 * asteroidConfig.pointsMult;
                    gameState.score += Math.floor(baseScore * comboMultiplier);
                    gameState.stats.kills++;
                    
                    if (gameState.stats.kills === 1) checkAchievement('firstKill');
                    
                    updateUI();
                    
                    spawnPowerup(asteroid.x, asteroid.y);
                    spawnCollectible(asteroid.x, asteroid.y);
                    
                    if (gameState.sounds.explosion) gameState.sounds.explosion();
                    gameState.screenShake = 5;
                } else {
                    // Asteroid damaged but not destroyed
                    createExplosion(bullet.x, bullet.y, 10);
                    if (gameState.sounds.hit) gameState.sounds.hit();
                }
                
                if (!bullet.piercing) break;
            }
        }
    }
    
    // Bullets vs Meteors
    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
        const bullet = gameState.bullets[i];
        
        for (let j = gameState.meteors.length - 1; j >= 0; j--) {
            const meteor = gameState.meteors[j];
            
            if (distance(bullet.x, bullet.y, meteor.x, meteor.y) < meteor.size) {
                if (!bullet.piercing) {
                    bullet.hit = true;
                }
                
                createExplosion(meteor.x, meteor.y, meteor.size);
                gameState.meteors.splice(j, 1);
                
                addCombo();
                const comboMultiplier = getComboMultiplier();
                gameState.score += Math.floor(50 * comboMultiplier);
                gameState.stats.kills++;
                
                updateUI();
                
                if (gameState.sounds.explosion) gameState.sounds.explosion();
                gameState.screenShake = 8;
                
                if (!bullet.piercing) break;
            }
        }
    }
    
    // Bullets vs Boss
    if (gameState.boss) {
        for (let i = gameState.bullets.length - 1; i >= 0; i--) {
            const bullet = gameState.bullets[i];
            
            if (distance(bullet.x, bullet.y, gameState.boss.x, gameState.boss.y) < gameState.boss.size) {
                if (!bullet.piercing) {
                    bullet.hit = true;
                }
                
                gameState.boss.health--;
                createExplosion(bullet.x, bullet.y, 10);
                
                if (gameState.sounds.bossHit) gameState.sounds.bossHit();
                gameState.screenShake = 3;
                
                if (!bullet.piercing) break;
            }
        }
    }
    
    // Bullets vs Aliens
    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
        const bullet = gameState.bullets[i];
        
        for (let j = gameState.aliens.length - 1; j >= 0; j--) {
            const alien = gameState.aliens[j];
            
            if (distance(bullet.x, bullet.y, alien.x, alien.y) < alien.size) {
                if (!bullet.piercing) {
                    bullet.hit = true;
                }
                
                createExplosion(alien.x, alien.y, alien.size);
                gameState.aliens.splice(j, 1);
                
                addCombo();
                const comboMultiplier = getComboMultiplier();
                gameState.score += Math.floor(100 * comboMultiplier);
                gameState.stats.kills++;
                
                updateUI();
                
                spawnPowerup(alien.x, alien.y);
                spawnCollectible(alien.x, alien.y);
                
                if (gameState.sounds.explosion) gameState.sounds.explosion();
                gameState.screenShake = 8;
                
                if (!bullet.piercing) break;
            }
        }
    }
    
    // Bullets vs Debris
    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
        const bullet = gameState.bullets[i];
        
        for (let j = gameState.debris.length - 1; j >= 0; j--) {
            const debris = gameState.debris[j];
            
            if (distance(bullet.x, bullet.y, debris.x, debris.y) < debris.size) {
                if (!bullet.piercing) {
                    bullet.hit = true;
                }
                
                createExplosion(debris.x, debris.y, debris.size / 2);
                gameState.debris.splice(j, 1);
                
                addCombo();
                const comboMultiplier = getComboMultiplier();
                gameState.score += Math.floor(5 * comboMultiplier);
                gameState.stats.kills++;
                
                updateUI();
                
                if (Math.random() < CONFIG.debris.spawnChance) {
                    spawnCollectible(debris.x, debris.y);
                }
                
                if (gameState.sounds.hit) gameState.sounds.hit();
                gameState.screenShake = 2;
                
                if (!bullet.piercing) break;
            }
        }
    }
    
    // Ship vs Asteroids
    if (gameState.ship.invulnerable === 0 && !gameState.ship.shieldActive) {
        for (let asteroid of gameState.asteroids) {
            if (distance(gameState.ship.x, gameState.ship.y, asteroid.x, asteroid.y) < asteroid.radius + CONFIG.ship.size) {
                createExplosion(gameState.ship.x, gameState.ship.y, CONFIG.ship.size * 2);
                gameState.lives--;
                gameState.achievements.noHit = false;
                updateUI();
                
                if (gameState.sounds.explosion) gameState.sounds.explosion();
                gameState.screenShake = 15;
                
                if (gameState.lives <= 0) {
                    gameOver();
                } else {
                    gameState.ship = new Ship();
                }
                break;
            }
        }
    }
    
    // Ship vs Meteors
    if (gameState.ship.invulnerable === 0 && !gameState.ship.shieldActive) {
        for (let meteor of gameState.meteors) {
            if (distance(gameState.ship.x, gameState.ship.y, meteor.x, meteor.y) < meteor.size + CONFIG.ship.size) {
                createExplosion(gameState.ship.x, gameState.ship.y, CONFIG.ship.size * 2);
                gameState.lives--;
                gameState.achievements.noHit = false;
                updateUI();
                
                if (gameState.sounds.explosion) gameState.sounds.explosion();
                gameState.screenShake = 20;
                
                if (gameState.lives <= 0) {
                    gameOver();
                } else {
                    gameState.ship = new Ship();
                }
                break;
            }
        }
    }
    
    // Ship vs Aliens
    if (gameState.ship.invulnerable === 0 && !gameState.ship.shieldActive) {
        for (let alien of gameState.aliens) {
            if (distance(gameState.ship.x, gameState.ship.y, alien.x, alien.y) < alien.size + CONFIG.ship.size) {
                createExplosion(gameState.ship.x, gameState.ship.y, CONFIG.ship.size * 2);
                gameState.lives--;
                gameState.achievements.noHit = false;
                updateUI();
                
                if (gameState.sounds.explosion) gameState.sounds.explosion();
                gameState.screenShake = 15;
                
                if (gameState.lives <= 0) {
                    gameOver();
                } else {
                    gameState.ship = new Ship();
                }
                break;
            }
        }
    }
    
    // Ship vs Boss
    if (gameState.boss && gameState.ship.invulnerable === 0 && !gameState.ship.shieldActive) {
        if (distance(gameState.ship.x, gameState.ship.y, gameState.boss.x, gameState.boss.y) < gameState.boss.size + CONFIG.ship.size) {
            createExplosion(gameState.ship.x, gameState.ship.y, CONFIG.ship.size * 2);
            gameState.lives--;
            gameState.achievements.noHit = false;
            updateUI();
            
            if (gameState.sounds.explosion) gameState.sounds.explosion();
            gameState.screenShake = 20;
            
            if (gameState.lives <= 0) {
                gameOver();
            } else {
                gameState.ship = new Ship();
            }
        }
    }
    
    // Ship vs Alien Bullets
    if (gameState.ship.invulnerable === 0 && !gameState.ship.shieldActive) {
        for (let i = gameState.alienBullets.length - 1; i >= 0; i--) {
            const bullet = gameState.alienBullets[i];
            if (distance(gameState.ship.x, gameState.ship.y, bullet.x, bullet.y) < CONFIG.ship.size) {
                createExplosion(gameState.ship.x, gameState.ship.y, CONFIG.ship.size);
                gameState.alienBullets.splice(i, 1);
                gameState.lives--;
                gameState.achievements.noHit = false;
                updateUI();
                
                if (gameState.sounds.hit) gameState.sounds.hit();
                gameState.screenShake = 10;
                
                if (gameState.lives <= 0) {
                    gameOver();
                } else {
                    gameState.ship = new Ship();
                }
                break;
            }
        }
    }
    
    // Ship vs Powerups
    for (let i = gameState.powerups.length - 1; i >= 0; i--) {
        const powerup = gameState.powerups[i];
        if (distance(gameState.ship.x, gameState.ship.y, powerup.x, powerup.y) < 20) {
            gameState.achievements.allPowerups.add(powerup.type);
            
            if (powerup.type === 'shield') {
                gameState.ship.shield = CONFIG.ship.shieldMax;
            } else if (powerup.type === 'bomb') {
                activateBomb();
            } else if (powerup.type === 'cascadeMissile') {
                gameState.ship.fireCascadeMissile();
            } else if (powerup.type === 'laser') {
                gameState.ship.fireLaser();
            } else if (powerup.type === 'minions') {
                gameState.ship.spawnMinions();
            } else {
                gameState.ship.powerups[powerup.type] = 1800;
            }
            gameState.powerups.splice(i, 1);
            if (gameState.sounds.powerup) gameState.sounds.powerup();
            
            if (gameState.achievements.allPowerups.size >= 11) {
                checkAchievement('allPowerups');
            }
        }
    }
    
    // Ship vs Collectibles
    for (let i = gameState.collectibles.length - 1; i >= 0; i--) {
        const collectible = gameState.collectibles[i];
        if (distance(gameState.ship.x, gameState.ship.y, collectible.x, collectible.y) < 15) {
            gameState.score += collectible.value;
            gameState.stats.collectiblesGathered++;
            gameState.collectibles.splice(i, 1);
            updateUI();
            if (gameState.sounds.collect) gameState.sounds.collect();
            
            if (gameState.stats.collectiblesGathered >= 50) {
                checkAchievement('collect50');
            }
        }
    }
}

function createExplosion(x, y, size) {
    for (let i = 0; i < size; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        gameState.particles.push(new Particle(
            x, y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            `rgb(${Math.random() * 100 + 155}, ${Math.random() * 100 + 100}, 0)`,
            30 + Math.random() * 20
        ));
    }
}

function draw() {
    ctx.save();
    if (gameState.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * gameState.screenShake;
        const shakeY = (Math.random() - 0.5) * gameState.screenShake;
        ctx.translate(shakeX, shakeY);
    }
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
    
    // CRT scanline effect
    for (let i = 0; i < CONFIG.canvas.height; i += 4) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, i, CONFIG.canvas.width, 2);
    }
    
    // Draw starfield
    ctx.fillStyle = '#fff';
    for (let star of gameState.stars) {
        ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    
    // Time slow visual effect
    if (gameState.ship.powerups.timeSlow > 0) {
        ctx.fillStyle = 'rgba(150, 100, 255, 0.1)';
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
    }
    
    // Draw particles
    gameState.particles.forEach(particle => particle.draw());
    
    // Draw debris
    gameState.debris.forEach(debris => debris.draw());
    
    // Draw asteroids
    gameState.asteroids.forEach(asteroid => asteroid.draw());
    
    // Draw meteors
    gameState.meteors.forEach(meteor => meteor.draw());
    
    // Draw meteor warnings
    gameState.meteorWarnings.forEach(warning => warning.draw());
    
    // Draw collectibles
    gameState.collectibles.forEach(collectible => collectible.draw());
    
    // Draw bullets
    gameState.bullets.forEach(bullet => bullet.draw());
    
    // Draw alien bullets
    ctx.fillStyle = '#ff0000';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff0000';
    gameState.alienBullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.shadowBlur = 0;
    
    // Draw aliens
    gameState.aliens.forEach(alien => alien.draw());
    
    // Draw boss
    if (gameState.boss) {
        gameState.boss.draw();
        
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff0000';
        ctx.fillText('⚠ BOSS ⚠', CONFIG.canvas.width / 2, 60);
        ctx.shadowBlur = 0;
    }
    
    // Draw powerups
    gameState.powerups.forEach(powerup => powerup.draw());
    
    // Draw minions
    if (gameState.ship && gameState.ship.minions) {
        gameState.ship.minions.forEach(minion => minion.draw());
    }
    
    // Draw ship
    gameState.ship.draw();
    
    // Combo display
    if (gameState.comboDisplay > 0 && gameState.combo > 1) {
        const alpha = gameState.comboDisplay / 60;
        const multiplier = getComboMultiplier();
        ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffff00';
        ctx.fillText(`${gameState.combo}x COMBO! (${multiplier}x Score)`, CONFIG.canvas.width / 2, CONFIG.canvas.height / 2 - 50);
        ctx.shadowBlur = 0;
    }
    
    // Achievement notifications
    if (gameState.achievementQueue.length > 0) {
        const achievement = gameState.achievementQueue[0];
        const alpha = Math.min(achievement.timer / 60, 1);
        
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
        ctx.fillRect(CONFIG.canvas.width / 2 - 200, 100, 400, 80);
        
        ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(CONFIG.canvas.width / 2 - 200, 100, 400, 80);
        
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffd700';
        ctx.fillText('🏆 ACHIEVEMENT UNLOCKED', CONFIG.canvas.width / 2, 130);
        
        ctx.font = 'bold 20px Arial';
        ctx.fillText(achievement.name, CONFIG.canvas.width / 2, 155);
        
        ctx.font = '16px Arial';
        ctx.fillStyle = `rgba(200, 200, 200, ${alpha})`;
        ctx.fillText(achievement.desc, CONFIG.canvas.width / 2, 175);
        ctx.shadowBlur = 0;
    }
    
    ctx.restore();
}

function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('lives').textContent = gameState.lives;
    document.getElementById('level').textContent = gameState.level;
}

function gameOver() {
    gameState.running = false;
    document.getElementById('finalScore').textContent = gameState.score;
    
    // Check if this is a high score
    if (isHighScore(gameState.score)) {
        document.getElementById('nameEntry').style.display = 'block';
        document.getElementById('restartButton').style.display = 'none';
        document.getElementById('nameInput').value = '';
        document.getElementById('nameInput').focus();
    } else {
        document.getElementById('nameEntry').style.display = 'none';
        document.getElementById('restartButton').style.display = 'block';
    }
    
    document.getElementById('gameOver').style.display = 'block';
}

function isHighScore(score) {
    const scores = JSON.parse(localStorage.getItem('asteroidsHighScores') || '[]');
    return scores.length < 5 || score > scores[scores.length - 1].score;
}

function saveHighScore() {
    const nameInput = document.getElementById('nameInput');
    let name = nameInput.value.toUpperCase().trim();
    
    // Validate name (3 characters)
    if (name.length !== 3) {
        alert('Please enter exactly 3 characters!');
        return;
    }
    
    // Get existing scores
    let scores = JSON.parse(localStorage.getItem('asteroidsHighScores') || '[]');
    
    // Add new score
    scores.push({
        name: name,
        score: gameState.score,
        level: gameState.level,
        date: new Date().toISOString()
    });
    
    // Sort by score (descending)
    scores.sort((a, b) => b.score - a.score);
    
    // Keep only top 5
    scores = scores.slice(0, 5);
    
    // Save to localStorage
    localStorage.setItem('asteroidsHighScores', JSON.stringify(scores));
    
    // Hide name entry, show restart button
    document.getElementById('nameEntry').style.display = 'none';
    document.getElementById('restartButton').style.display = 'block';
    
    // Show high score message
    alert(`Congratulations ${name}! You made the high score list!`);
}

function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    initGame();
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function addCombo() {
    gameState.combo++;
    gameState.comboTimer = CONFIG.combo.timeWindow;
    gameState.comboDisplay = 60;
    
    if (gameState.combo === 5) checkAchievement('combo5');
    if (gameState.combo === 10) checkAchievement('combo10');
    
    if (gameState.sounds.combo) gameState.sounds.combo();
}

function getComboMultiplier() {
    const index = Math.min(gameState.combo - 1, CONFIG.combo.multipliers.length - 1);
    return index >= 0 ? CONFIG.combo.multipliers[index] : 1;
}

function checkAchievement(type) {
    if (gameState.achievements[type]) return;
    
    gameState.achievements[type] = true;
    
    const achievements = {
        firstKill: { name: 'First Blood', desc: 'Destroy your first asteroid' },
        combo5: { name: 'Combo Master', desc: 'Achieve a 5x combo' },
        combo10: { name: 'Combo Legend', desc: 'Achieve a 10x combo' },
        level5: { name: 'Survivor', desc: 'Reach level 5' },
        level10: { name: 'Veteran', desc: 'Reach level 10' },
        destroyBoss: { name: 'Boss Slayer', desc: 'Defeat a boss' },
        collect50: { name: 'Collector', desc: 'Collect 50 items' },
        noHit: { name: 'Untouchable', desc: 'Complete a level without taking damage' },
        allPowerups: { name: 'Power Hungry', desc: 'Collect all powerup types' }
    };
    
    if (achievements[type]) {
        gameState.achievementQueue.push({
            name: achievements[type].name,
            desc: achievements[type].desc,
            timer: 180
        });
        
        if (gameState.sounds.achievement) gameState.sounds.achievement();
    }
}

function activateBomb() {
    createExplosion(gameState.ship.x, gameState.ship.y, 200);
    
    gameState.asteroids.forEach(asteroid => {
        createExplosion(asteroid.x, asteroid.y, asteroid.radius);
        const asteroidConfig = CONFIG.asteroid.types[asteroid.type];
        gameState.score += (3 - asteroid.size) * 10 * asteroidConfig.pointsMult;
        gameState.stats.kills++;
        spawnCollectible(asteroid.x, asteroid.y);
    });
    gameState.asteroids = [];
    
    gameState.aliens.forEach(alien => {
        createExplosion(alien.x, alien.y, alien.size);
        gameState.score += 100;
        gameState.stats.kills++;
        spawnCollectible(alien.x, alien.y);
    });
    gameState.aliens = [];
    
    gameState.meteors.forEach(meteor => {
        createExplosion(meteor.x, meteor.y, meteor.size);
        gameState.score += 50;
        gameState.stats.kills++;
    });
    gameState.meteors = [];
    
    gameState.alienBullets = [];
    
    if (gameState.boss) {
        gameState.boss.health = Math.max(0, gameState.boss.health - 20);
        createExplosion(gameState.boss.x, gameState.boss.y, 50);
        if (gameState.sounds.bossHit) gameState.sounds.bossHit();
    }
    
    gameState.screenShake = 30;
    if (gameState.sounds.explosion) gameState.sounds.explosion();
    
    updateUI();
}

// Input handling
window.addEventListener('keydown', (e) => {
    gameState.keys[e.key] = true;
    
    if (e.key === 'p' || e.key === 'P') {
        gameState.paused = !gameState.paused;
    }
    
    // M key to toggle sound
    if (e.key === 'm' || e.key === 'M') {
        toggleSound();
    }
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    gameState.keys[e.key] = false;
});

// Sound control functions
function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('asteroidsSoundEnabled', soundEnabled);
    updateSoundButton();
}

function updateSoundButton() {
    const button = document.getElementById('soundToggle');
    if (button) {
        if (soundEnabled) {
            button.textContent = '🔊';
            button.title = 'Sound ON (M to toggle)';
        } else {
            button.textContent = '🔇';
            button.title = 'Sound OFF (M to toggle)';
        }
    }
}
