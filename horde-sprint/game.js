// Horde Sprint - Vampire Survivors Style Tower Defense Runner
// Game Configuration
const CONFIG = {
    canvas: {
        width: 800,
        height: 600
    },
    player: {
        size: 20,
        speed: 3,
        maxHealth: 100,
        startTroops: 10
    },
    game: {
        fortressDistance: 3000, // Distance to fortress
        enemySpawnRate: 60, // Frames between spawns
        xpPerLevel: 10,
        maxItems: 5,
        maxItemLevel: 5
    },
    enemies: {
        infantry: {
            health: 15,
            speed: 1.5,
            damage: 5,
            xp: 1,
            shootRate: 120,
            color: '#ff4444',
            size: 15
        },
        tank: {
            health: 50,
            speed: 0.8,
            damage: 15,
            xp: 3,
            shootRate: 90,
            color: '#cc3333',
            size: 25
        },
        turret: {
            health: 80,
            speed: 0,
            damage: 10,
            xp: 5,
            shootRate: 60,
            color: '#992222',
            size: 30
        }
    }
};

// Item Definitions
const ITEMS = {
    rifle: {
        name: 'Rifle',
        description: 'Basic automatic fire',
        maxLevel: 5,
        levels: [
            { damage: 5, fireRate: 20, range: 200, projectiles: 1 },
            { damage: 7, fireRate: 18, range: 220, projectiles: 1 },
            { damage: 10, fireRate: 15, range: 250, projectiles: 1 },
            { damage: 13, fireRate: 12, range: 280, projectiles: 2 },
            { damage: 18, fireRate: 10, range: 300, projectiles: 2 }
        ],
        color: '#00e5ff'
    },
    shotgun: {
        name: 'Shotgun',
        description: 'Close range spread',
        maxLevel: 5,
        levels: [
            { damage: 3, fireRate: 40, range: 120, projectiles: 3 },
            { damage: 4, fireRate: 38, range: 130, projectiles: 4 },
            { damage: 5, fireRate: 35, range: 140, projectiles: 5 },
            { damage: 7, fireRate: 32, range: 150, projectiles: 6 },
            { damage: 10, fireRate: 30, range: 160, projectiles: 8 }
        ],
        color: '#ff9100'
    },
    rocket: {
        name: 'Rocket Launcher',
        description: 'Explosive AOE damage',
        maxLevel: 5,
        levels: [
            { damage: 20, fireRate: 80, range: 250, radius: 40 },
            { damage: 25, fireRate: 75, range: 270, radius: 50 },
            { damage: 32, fireRate: 70, range: 290, radius: 60 },
            { damage: 40, fireRate: 65, range: 310, radius: 70 },
            { damage: 55, fireRate: 60, range: 330, radius: 90 }
        ],
        color: '#ff3d00'
    },
    laser: {
        name: 'Laser',
        description: 'Rapid fire beam',
        maxLevel: 5,
        levels: [
            { damage: 2, fireRate: 5, range: 180, pierce: 1 },
            { damage: 3, fireRate: 5, range: 200, pierce: 2 },
            { damage: 4, fireRate: 4, range: 220, pierce: 3 },
            { damage: 6, fireRate: 4, range: 250, pierce: 4 },
            { damage: 9, fireRate: 3, range: 280, pierce: 5 }
        ],
        color: '#76ff03'
    },
    mortar: {
        name: 'Mortar',
        description: 'Arcing explosive shells',
        maxLevel: 5,
        levels: [
            { damage: 30, fireRate: 100, range: 300, radius: 60 },
            { damage: 40, fireRate: 95, range: 320, radius: 70 },
            { damage: 52, fireRate: 90, range: 340, radius: 80 },
            { damage: 68, fireRate: 85, range: 360, radius: 95 },
            { damage: 90, fireRate: 80, range: 380, radius: 110 }
        ],
        color: '#e040fb'
    }
};

// Game State
let canvas, ctx;
let gameState = {
    running: false,
    paused: false,
    levelingUp: false,
    score: 0,
    xp: 0,
    level: 1,
    distanceTraveled: 0,
    troops: CONFIG.player.startTroops,
    health: CONFIG.player.maxHealth,
    player: null,
    items: {}, // { itemKey: level }
    enemies: [],
    bullets: [],
    particles: [],
    powerups: [],
    enemyBullets: [],
    lastEnemySpawn: 0,
    itemCooldowns: {},
    backgroundOffset: 0
};

// Player Class
class Player {
    constructor() {
        this.x = CONFIG.canvas.width / 2;
        this.y = CONFIG.canvas.height - 150;
        this.size = CONFIG.player.size;
        this.vx = 0;
        this.vy = 0;
    }

    update() {
        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;

        // Keep in bounds
        this.x = Math.max(this.size, Math.min(CONFIG.canvas.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(CONFIG.canvas.height - this.size, this.y));

        // Friction
        this.vx *= 0.85;
        this.vy *= 0.85;
    }

    draw() {
        // Draw player
        ctx.fillStyle = '#00ff41';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#00cc33';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw troop count indicator
        const troopCount = Math.min(gameState.troops, 50);
        const radius = this.size + 10;
        for (let i = 0; i < troopCount; i++) {
            const angle = (i / troopCount) * Math.PI * 2;
            const x = this.x + Math.cos(angle) * radius;
            const y = this.y + Math.sin(angle) * radius;
            ctx.fillStyle = '#00ff41';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    move(dx, dy) {
        this.vx += dx * CONFIG.player.speed;
        this.vy += dy * CONFIG.player.speed;
    }
}

// Enemy Classes
class Enemy {
    constructor(type, x, y) {
        this.type = type;
        const config = CONFIG.enemies[type];
        this.x = x;
        this.y = y;
        this.health = config.health;
        this.maxHealth = config.health;
        this.speed = config.speed;
        this.damage = config.damage;
        this.xp = config.xp;
        this.shootRate = config.shootRate;
        this.color = config.color;
        this.size = config.size;
        this.shootTimer = 0;
        this.dead = false;
        this.hopOffset = 0;
    }

    update() {
        if (this.dead) return false;

        const player = gameState.player;
        
        // Move toward player (except turrets)
        if (this.type !== 'turret') {
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const dist = Math.hypot(dx, dy);
            
            if (dist > 50) {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            }

            // Hop animation for infantry
            if (this.type === 'infantry') {
                this.hopOffset = Math.sin(Date.now() / 200) * 3;
            }
        }

        // Shoot at player
        this.shootTimer++;
        if (this.shootTimer >= this.shootRate) {
            this.shoot();
            this.shootTimer = 0;
        }

        // Check collision with player
        const dist = Math.hypot(this.x - player.x, this.y - player.y);
        if (dist < this.size + player.size) {
            this.hitPlayer();
            return false;
        }

        return true;
    }

    shoot() {
        const player = gameState.player;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.hypot(dx, dy);
        
        gameState.enemyBullets.push({
            x: this.x,
            y: this.y,
            vx: (dx / dist) * 4,
            vy: (dy / dist) * 4,
            damage: this.damage,
            size: 5
        });
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    hitPlayer() {
        gameState.troops -= this.damage;
        if (gameState.troops < 0) {
            gameState.health += gameState.troops;
            gameState.troops = 0;
        }
        this.die();
    }

    die() {
        this.dead = true;
        gameState.score += this.xp * 10;
        gameState.xp += this.xp;
        createExplosion(this.x, this.y, this.color);
        
        // Drop powerup chance
        if (Math.random() < 0.3) {
            gameState.powerups.push({
                x: this.x,
                y: this.y,
                type: 'troops',
                value: Math.floor(Math.random() * 3) + 1
            });
        }
    }

    draw() {
        if (this.dead) return;

        ctx.save();
        ctx.translate(this.x, this.y + this.hopOffset);

        if (this.type === 'infantry') {
            // Triangle
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.lineTo(this.size * 0.7, this.size * 0.5);
            ctx.lineTo(-this.size * 0.7, this.size * 0.5);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (this.type === 'tank') {
            // Trapezoid
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(-this.size * 0.6, -this.size * 0.6);
            ctx.lineTo(this.size * 0.6, -this.size * 0.6);
            ctx.lineTo(this.size * 0.8, this.size * 0.6);
            ctx.lineTo(-this.size * 0.8, this.size * 0.6);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (this.type === 'turret') {
            // Base + Gun
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size * 0.6, -this.size * 0.4, this.size * 1.2, this.size * 0.8);
            ctx.fillRect(-this.size * 0.3, -this.size * 0.8, this.size * 0.6, this.size * 0.5);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(-this.size * 0.6, -this.size * 0.4, this.size * 1.2, this.size * 0.8);
        }

        // Health bar
        const barWidth = this.size * 1.5;
        const barHeight = 4;
        const healthPercent = this.health / this.maxHealth;
        
        ctx.fillStyle = '#000';
        ctx.fillRect(-barWidth/2, -this.size - 10, barWidth, barHeight);
        ctx.fillStyle = '#00ff41';
        ctx.fillRect(-barWidth/2, -this.size - 10, barWidth * healthPercent, barHeight);

        ctx.restore();
    }
}

// Bullet Class
class Bullet {
    constructor(x, y, targetX, targetY, itemKey, level) {
        this.x = x;
        this.y = y;
        const item = ITEMS[itemKey];
        const stats = item.levels[level - 1];
        
        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.hypot(dx, dy);
        
        this.vx = (dx / dist) * 8;
        this.vy = (dy / dist) * 8;
        this.damage = stats.damage;
        this.color = item.color;
        this.size = 5;
        this.range = stats.range;
        this.distTraveled = 0;
        this.pierce = stats.pierce || 0;
        this.pierceCount = 0;
        this.radius = stats.radius || 0;
        this.hit = false;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.distTraveled += Math.hypot(this.vx, this.vy);

        // Check range
        if (this.distTraveled > this.range) {
            return false;
        }

        // Check collision with enemies
        for (let enemy of gameState.enemies) {
            if (enemy.dead) continue;
            
            const dist = Math.hypot(this.x - enemy.x, this.y - enemy.y);
            if (dist < this.size + enemy.size) {
                enemy.takeDamage(this.damage);
                
                // AOE damage
                if (this.radius > 0) {
                    for (let other of gameState.enemies) {
                        if (other.dead || other === enemy) continue;
                        const d = Math.hypot(this.x - other.x, this.y - other.y);
                        if (d < this.radius) {
                            other.takeDamage(this.damage * 0.5);
                        }
                    }
                    createExplosion(this.x, this.y, this.color, this.radius);
                    return false;
                }
                
                // Pierce
                this.pierceCount++;
                if (this.pierceCount > this.pierce) {
                    return false;
                }
            }
        }

        return true;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Particle System
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.life = 1;
        this.decay = 0.02;
        this.size = Math.random() * 4 + 2;
        this.color = color;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        return this.life > 0;
    }

    draw() {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function createExplosion(x, y, color, radius = 30) {
    const count = Math.floor(radius / 3);
    for (let i = 0; i < count; i++) {
        gameState.particles.push(new Particle(x, y, color));
    }
}

// Helper Functions
function spawnEnemy() {
    const types = ['infantry', 'infantry', 'infantry', 'tank', 'turret'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Spawn from top or sides
    let x, y;
    if (Math.random() < 0.5) {
        x = Math.random() * CONFIG.canvas.width;
        y = -50;
    } else {
        x = Math.random() < 0.5 ? -50 : CONFIG.canvas.width + 50;
        y = Math.random() * CONFIG.canvas.height;
    }
    
    gameState.enemies.push(new Enemy(type, x, y));
}

function shootWeapons() {
    for (let itemKey in gameState.items) {
        const level = gameState.items[itemKey];
        const item = ITEMS[itemKey];
        const stats = item.levels[level - 1];
        
        // Check cooldown
        if (!gameState.itemCooldowns[itemKey]) {
            gameState.itemCooldowns[itemKey] = 0;
        }
        
        gameState.itemCooldowns[itemKey]++;
        
        if (gameState.itemCooldowns[itemKey] >= stats.fireRate) {
            gameState.itemCooldowns[itemKey] = 0;
            
            // Find nearest enemy
            let nearest = null;
            let nearestDist = Infinity;
            
            for (let enemy of gameState.enemies) {
                if (enemy.dead) continue;
                const dist = Math.hypot(enemy.x - gameState.player.x, enemy.y - gameState.player.y);
                if (dist < nearestDist && dist < stats.range) {
                    nearest = enemy;
                    nearestDist = dist;
                }
            }
            
            if (nearest) {
                const projectiles = stats.projectiles || 1;
                for (let i = 0; i < projectiles; i++) {
                    const spread = (i - (projectiles - 1) / 2) * 0.2;
                    const angle = Math.atan2(nearest.y - gameState.player.y, nearest.x - gameState.player.x) + spread;
                    const targetX = gameState.player.x + Math.cos(angle) * stats.range;
                    const targetY = gameState.player.y + Math.sin(angle) * stats.range;
                    
                    gameState.bullets.push(new Bullet(
                        gameState.player.x,
                        gameState.player.y,
                        targetX,
                        targetY,
                        itemKey,
                        level
                    ));
                }
            }
        }
    }
}

function checkLevelUp() {
    const xpNeeded = gameState.level * CONFIG.game.xpPerLevel;
    if (gameState.xp >= xpNeeded) {
        gameState.xp -= xpNeeded;
        gameState.level++;
        showLevelUpScreen();
    }
}

function showLevelUpScreen() {
    gameState.levelingUp = true;
    gameState.paused = true;
    
    // Generate 3 random upgrade options
    const options = [];
    const availableItems = Object.keys(ITEMS);
    
    while (options.length < 3) {
        const itemKey = availableItems[Math.floor(Math.random() * availableItems.length)];
        const currentLevel = gameState.items[itemKey] || 0;
        
        if (currentLevel < CONFIG.game.maxItemLevel) {
            if (!options.find(o => o.key === itemKey)) {
                options.push({
                    key: itemKey,
                    item: ITEMS[itemKey],
                    level: currentLevel + 1
                });
            }
        }
    }
    
    displayLevelUpOptions(options);
}

function displayLevelUpOptions(options) {
    // This will be handled by HTML overlay
    const overlay = document.getElementById('levelUpOverlay');
    const optionsContainer = document.getElementById('levelUpOptions');
    optionsContainer.innerHTML = '';
    
    options.forEach((opt, index) => {
        const div = document.createElement('div');
        div.className = 'level-up-option';
        div.innerHTML = `
            <h3>${opt.item.name} ${opt.level > 1 ? `(Lv ${opt.level})` : ''}</h3>
            <p>${opt.item.description}</p>
        `;
        div.onclick = () => selectUpgrade(opt.key);
        optionsContainer.appendChild(div);
    });
    
    overlay.style.display = 'flex';
}

function selectUpgrade(itemKey) {
    gameState.items[itemKey] = (gameState.items[itemKey] || 0) + 1;
    document.getElementById('levelUpOverlay').style.display = 'none';
    gameState.levelingUp = false;
    gameState.paused = false;
}

function drawBackground() {
    // Scrolling terrain
    gameState.backgroundOffset += 1;
    if (gameState.backgroundOffset > 50) gameState.backgroundOffset = 0;
    
    // Dark ground
    ctx.fillStyle = '#2a4a2a';
    ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
    
    // Grass patches
    ctx.fillStyle = '#3a5a3a';
    for (let y = -50; y < CONFIG.canvas.height + 50; y += 50) {
        for (let x = 0; x < CONFIG.canvas.width; x += 50) {
            if ((x + y + gameState.backgroundOffset) % 100 < 50) {
                ctx.fillRect(x, y + gameState.backgroundOffset, 50, 50);
            }
        }
    }
}

// Game Loop
function gameLoop() {
    if (!gameState.running) return;
    
    if (!gameState.paused) {
        // Clear and draw background
        drawBackground();
        
        // Spawn enemies
        gameState.lastEnemySpawn++;
        if (gameState.lastEnemySpawn >= CONFIG.game.enemySpawnRate) {
            spawnEnemy();
            gameState.lastEnemySpawn = 0;
        }
        
        // Update player
        gameState.player.update();
        
        // Shoot weapons
        shootWeapons();
        
        // Update enemies
        gameState.enemies = gameState.enemies.filter(e => e.update());
        
        // Update bullets
        gameState.bullets = gameState.bullets.filter(b => b.update());
        
        // Update enemy bullets
        gameState.enemyBullets = gameState.enemyBullets.filter(eb => {
            eb.x += eb.vx;
            eb.y += eb.vy;
            
            // Check collision with player
            const dist = Math.hypot(eb.x - gameState.player.x, eb.y - gameState.player.y);
            if (dist < eb.size + gameState.player.size) {
                gameState.troops -= eb.damage;
                if (gameState.troops < 0) {
                    gameState.health += gameState.troops;
                    gameState.troops = 0;
                }
                return false;
            }
            
            return eb.x > -50 && eb.x < CONFIG.canvas.width + 50 && 
                   eb.y > -50 && eb.y < CONFIG.canvas.height + 50;
        });
        
        // Update particles
        gameState.particles = gameState.particles.filter(p => p.update());
        
        // Update powerups
        gameState.powerups = gameState.powerups.filter(p => {
            const dist = Math.hypot(p.x - gameState.player.x, p.y - gameState.player.y);
            if (dist < 30) {
                gameState.troops += p.value;
                return false;
            }
            return true;
        });
        
        // Check level up
        checkLevelUp();
        
        // Update distance
        gameState.distanceTraveled += 0.5;
        
        // Draw everything
        gameState.enemies.forEach(e => e.draw());
        gameState.bullets.forEach(b => b.draw());
        gameState.enemyBullets.forEach(eb => {
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(eb.x, eb.y, eb.size, 0, Math.PI * 2);
            ctx.fill();
        });
        gameState.particles.forEach(p => p.draw());
        gameState.powerups.forEach(p => {
            ctx.fillStyle = '#ffea00';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
            ctx.fill();
        });
        gameState.player.draw();
        
        // Draw UI
        updateUI();
        
        // Check game over
        if (gameState.health <= 0) {
            endGame();
            return;
        }
    }
    
    requestAnimationFrame(gameLoop);
}

function updateUI() {
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('troops').textContent = Math.floor(gameState.troops);
    document.getElementById('distance').textContent = Math.floor(gameState.distanceTraveled) + '/' + CONFIG.game.fortressDistance;
    document.getElementById('score').textContent = gameState.score;
    
    // XP bar
    const xpNeeded = gameState.level * CONFIG.game.xpPerLevel;
    const xpPercent = (gameState.xp / xpNeeded) * 100;
    document.getElementById('xpBar').style.width = xpPercent + '%';
}

function endGame() {
    gameState.running = false;
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalLevel').textContent = gameState.level;
    document.getElementById('gameOver').style.display = 'block';
}

// Input Handling
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    if (e.key === ' ') {
        gameState.paused = !gameState.paused;
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function handleInput() {
    if (gameState.paused || !gameState.running) return;
    
    let dx = 0, dy = 0;
    
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) dx -= 1;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) dx += 1;
    if (keys['ArrowUp'] || keys['w'] || keys['W']) dy -= 1;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) dy += 1;
    
    if (dx !== 0 || dy !== 0) {
        gameState.player.move(dx, dy);
    }
}

setInterval(handleInput, 16);

// Initialize Game
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    gameState = {
        running: true,
        paused: false,
        levelingUp: false,
        score: 0,
        xp: 0,
        level: 1,
        distanceTraveled: 0,
        troops: CONFIG.player.startTroops,
        health: CONFIG.player.maxHealth,
        player: new Player(),
        items: { rifle: 1 }, // Start with rifle
        enemies: [],
        bullets: [],
        particles: [],
        powerups: [],
        enemyBullets: [],
        lastEnemySpawn: 0,
        itemCooldowns: {},
        backgroundOffset: 0
    };
    
    requestAnimationFrame(gameLoop);
}

function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    initGame();
}

// Start game
window.onload = () => {
    initGame();
};
