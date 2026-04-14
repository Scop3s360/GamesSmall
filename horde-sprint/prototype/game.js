// Game constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const LANE_WIDTH = canvas.width / 3;
const LANES = [LANE_WIDTH / 2, canvas.width / 2, canvas.width - LANE_WIDTH / 2];

// Game state
const game = {
    player: {
        lane: 1, // 0 = left, 1 = middle, 2 = right
        x: 0,
        y: canvas.height - 80,
        size: 30,
        troops: 10,
        weapon: 'Rifle',
        weaponDamage: 1,
        fireRate: 500, // ms between shots
        lastShot: 0
    },
    enemies: [],
    collectibles: [],
    bullets: [],
    gameSpeed: 2,
    score: 0,
    lastSpawn: 0,
    spawnInterval: 2000
};

// Weapon types
const WEAPONS = {
    'Rifle': { damage: 1, fireRate: 500, color: '#ffff00' },
    'Machine Gun': { damage: 2, fireRate: 200, color: '#ff8800' },
    'Rocket Launcher': { damage: 5, fireRate: 1000, color: '#ff0000' }
};

// Input handling
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && game.player.lane > 0) {
        game.player.lane--;
    }
    if (e.key === 'ArrowRight' && game.player.lane < 2) {
        game.player.lane++;
    }
});

// Spawn collectibles
function spawnCollectible() {
    const lane = Math.floor(Math.random() * 3);
    const type = lane === 0 ? 'troops' : lane === 2 ? 'weapon' : null;
    
    if (type === 'troops') {
        const values = [1, 5, 10];
        const value = values[Math.floor(Math.random() * values.length)];
        game.collectibles.push({
            x: LANES[lane],
            y: -20,
            lane: lane,
            type: 'troops',
            value: value,
            size: 20,
            color: '#00ff00'
        });
    } else if (type === 'weapon') {
        const weapons = ['Machine Gun', 'Rocket Launcher'];
        const weapon = weapons[Math.floor(Math.random() * weapons.length)];
        game.collectibles.push({
            x: LANES[lane],
            y: -20,
            lane: lane,
            type: 'weapon',
            value: weapon,
            size: 25,
            color: '#ffaa00'
        });
    }
}

// Spawn enemies (middle lane only)
function spawnEnemy() {
    const types = [
        { hp: 10, size: 25, color: '#ff3333', name: 'Grunt' },
        { hp: 30, size: 35, color: '#ff0000', name: 'Tank' }
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    
    game.enemies.push({
        x: LANES[1],
        y: -30,
        lane: 1,
        hp: type.hp,
        maxHp: type.hp,
        size: type.size,
        color: type.color,
        name: type.name
    });
}

// Shoot bullets
function shoot() {
    const now = Date.now();
    const weapon = WEAPONS[game.player.weapon];
    
    if (now - game.player.lastShot > weapon.fireRate && game.player.lane === 1) {
        game.bullets.push({
            x: game.player.x,
            y: game.player.y - 20,
            speed: 8,
            damage: weapon.damage * game.player.troops,
            color: weapon.color
        });
        game.player.lastShot = now;
    }
}

// Update game state
function update(deltaTime) {
    // Update player position
    game.player.x = LANES[game.player.lane];
    
    // Shoot if in middle lane
    if (game.player.lane === 1) {
        shoot();
    }
    
    // Update bullets
    game.bullets = game.bullets.filter(bullet => {
        bullet.y -= bullet.speed;
        
        // Check collision with enemies
        for (let enemy of game.enemies) {
            const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
            if (dist < enemy.size) {
                enemy.hp -= bullet.damage;
                return false; // Remove bullet
            }
        }
        
        return bullet.y > 0;
    });
    
    // Update enemies
    game.enemies = game.enemies.filter(enemy => {
        enemy.y += game.gameSpeed;
        
        // Check if enemy reached player
        if (enemy.y > canvas.height) {
            game.player.troops = Math.max(0, game.player.troops - 5);
            return false;
        }
        
        return enemy.hp > 0;
    });
    
    // Update collectibles
    game.collectibles = game.collectibles.filter(item => {
        item.y += game.gameSpeed;
        
        // Check collision with player
        const dist = Math.hypot(item.x - game.player.x, item.y - game.player.y);
        if (dist < game.player.size + item.size) {
            if (item.type === 'troops') {
                game.player.troops += item.value;
            } else if (item.type === 'weapon') {
                game.player.weapon = item.value;
            }
            return false;
        }
        
        return item.y < canvas.height + 50;
    });
    
    // Spawn new objects
    const now = Date.now();
    if (now - game.lastSpawn > game.spawnInterval) {
        if (Math.random() < 0.5) {
            spawnEnemy();
        } else {
            spawnCollectible();
        }
        game.lastSpawn = now;
    }
    
    // Update UI
    document.getElementById('troopCount').textContent = game.player.troops;
    document.getElementById('weaponType').textContent = game.player.weapon;
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#0f3460';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw lane dividers
    ctx.strokeStyle = '#16213e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(LANE_WIDTH, 0);
    ctx.lineTo(LANE_WIDTH, canvas.height);
    ctx.moveTo(LANE_WIDTH * 2, 0);
    ctx.lineTo(LANE_WIDTH * 2, canvas.height);
    ctx.stroke();
    
    // Draw lane labels (top)
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('TROOPS', LANES[0], 30);
    ctx.fillText('COMBAT', LANES[1], 30);
    ctx.fillText('WEAPONS', LANES[2], 30);
    
    // Draw player
    ctx.fillStyle = '#00aaff';
    ctx.beginPath();
    ctx.arc(game.player.x, game.player.y, game.player.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw player troop count
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(game.player.troops, game.player.x, game.player.y + 5);
    
    // Draw bullets
    game.bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw enemies
    game.enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x - enemy.size/2, enemy.y - enemy.size/2, enemy.size, enemy.size);
        
        // Health bar
        const barWidth = enemy.size;
        const barHeight = 5;
        const healthPercent = enemy.hp / enemy.maxHp;
        
        ctx.fillStyle = '#333333';
        ctx.fillRect(enemy.x - barWidth/2, enemy.y - enemy.size/2 - 10, barWidth, barHeight);
        
        ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        ctx.fillRect(enemy.x - barWidth/2, enemy.y - enemy.size/2 - 10, barWidth * healthPercent, barHeight);
    });
    
    // Draw collectibles
    game.collectibles.forEach(item => {
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw value/label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        if (item.type === 'troops') {
            ctx.fillText('+' + item.value, item.x, item.y + 5);
        } else if (item.type === 'weapon') {
            ctx.fillText(item.value.substring(0, 2), item.x, item.y + 5);
        }
    });
}

// Game loop
let lastTime = 0;
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    update(deltaTime);
    draw();
    
    requestAnimationFrame(gameLoop);
}

// Start game
requestAnimationFrame(gameLoop);
