// Ship Renderer - Canvas-based ship graphics (64x64px)
// Modular equipment system - different hull types with varying slot counts

const ShipRenderer = {
    // Draw base player ship hull based on type
    drawBaseHull(ctx, hullType = 'scout') {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        
        switch(hullType) {
            case 'scout':
                // Small, nimble ship (2 slots)
                ctx.fillStyle = '#0ff';
                // Compact nose
                ctx.beginPath();
                ctx.moveTo(32, 12);
                ctx.lineTo(26, 22);
                ctx.lineTo(38, 22);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Cockpit
                ctx.fillStyle = '#0f0';
                ctx.fillRect(30, 16, 4, 4);
                
                // Small body
                ctx.fillStyle = '#0ff';
                ctx.fillRect(28, 22, 8, 18);
                ctx.strokeRect(28, 22, 8, 18);
                
                // Single engine
                ctx.fillRect(29, 40, 6, 8);
                ctx.strokeRect(29, 40, 6, 8);
                ctx.fillStyle = '#f00';
                ctx.fillRect(30, 44, 4, 6);
                ctx.fillStyle = '#ff0';
                ctx.fillRect(31, 46, 2, 3);
                break;
                
            case 'fighter':
                // Standard ship (4 slots) - current default
                ctx.fillStyle = '#0ff';
                ctx.beginPath();
                ctx.moveTo(32, 10);
                ctx.lineTo(24, 25);
                ctx.lineTo(40, 25);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                ctx.fillStyle = '#0f0';
                ctx.fillRect(29, 15, 6, 6);
                
                ctx.fillStyle = '#0ff';
                ctx.fillRect(22, 25, 20, 20);
                ctx.strokeRect(22, 25, 20, 20);
                
                ctx.fillRect(24, 45, 6, 8);
                ctx.fillRect(34, 45, 6, 8);
                ctx.strokeRect(24, 45, 6, 8);
                ctx.strokeRect(34, 45, 6, 8);
                
                ctx.fillStyle = '#f00';
                ctx.fillRect(25, 50, 4, 6);
                ctx.fillRect(35, 50, 4, 6);
                ctx.fillStyle = '#ff0';
                ctx.fillRect(26, 52, 2, 3);
                ctx.fillRect(36, 52, 2, 3);
                break;
                
            case 'corvette':
                // Medium ship (6 slots)
                ctx.fillStyle = '#0ff';
                // Wider nose
                ctx.beginPath();
                ctx.moveTo(32, 8);
                ctx.lineTo(20, 22);
                ctx.lineTo(44, 22);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Bridge
                ctx.fillStyle = '#0f0';
                ctx.fillRect(28, 14, 8, 6);
                ctx.strokeRect(28, 14, 8, 6);
                
                // Larger body
                ctx.fillStyle = '#0ff';
                ctx.fillRect(18, 22, 28, 24);
                ctx.strokeRect(18, 22, 28, 24);
                
                // Triple engines
                ctx.fillRect(20, 46, 6, 10);
                ctx.fillRect(29, 46, 6, 10);
                ctx.fillRect(38, 46, 6, 10);
                ctx.strokeRect(20, 46, 6, 10);
                ctx.strokeRect(29, 46, 6, 10);
                ctx.strokeRect(38, 46, 6, 10);
                
                ctx.fillStyle = '#f00';
                ctx.fillRect(21, 50, 4, 6);
                ctx.fillRect(30, 50, 4, 6);
                ctx.fillRect(39, 50, 4, 6);
                break;
                
            case 'destroyer':
                // Large ship (8 slots)
                ctx.fillStyle = '#0ff';
                // Command tower
                ctx.fillRect(28, 8, 8, 12);
                ctx.strokeRect(28, 8, 8, 12);
                
                // Bridge windows
                ctx.fillStyle = '#0f0';
                ctx.fillRect(30, 10, 4, 4);
                
                // Main hull
                ctx.fillStyle = '#0ff';
                ctx.fillRect(16, 20, 32, 28);
                ctx.strokeRect(16, 20, 32, 28);
                
                // Hull sections
                ctx.strokeRect(18, 24, 28, 8);
                ctx.strokeRect(18, 34, 28, 8);
                
                // Quad engines
                ctx.fillRect(18, 48, 6, 10);
                ctx.fillRect(26, 48, 6, 10);
                ctx.fillRect(32, 48, 6, 10);
                ctx.fillRect(40, 48, 6, 10);
                ctx.strokeRect(18, 48, 6, 10);
                ctx.strokeRect(26, 48, 6, 10);
                ctx.strokeRect(32, 48, 6, 10);
                ctx.strokeRect(40, 48, 6, 10);
                
                ctx.fillStyle = '#f00';
                ctx.fillRect(19, 52, 4, 6);
                ctx.fillRect(27, 52, 4, 6);
                ctx.fillRect(33, 52, 4, 6);
                ctx.fillRect(41, 52, 4, 6);
                break;
                
            case 'battleship':
                // Massive ship (10 slots)
                ctx.fillStyle = '#0ff';
                // Command superstructure
                ctx.fillRect(26, 6, 12, 14);
                ctx.strokeRect(26, 6, 12, 14);
                
                // Bridge
                ctx.fillStyle = '#0f0';
                ctx.fillRect(28, 8, 8, 6);
                ctx.strokeRect(28, 8, 8, 6);
                
                // Massive hull
                ctx.fillStyle = '#0ff';
                ctx.fillRect(12, 20, 40, 32);
                ctx.strokeRect(12, 20, 40, 32);
                
                // Armor sections
                ctx.strokeRect(14, 24, 36, 8);
                ctx.strokeRect(14, 34, 36, 8);
                ctx.strokeRect(14, 44, 36, 6);
                
                // Five engines
                ctx.fillRect(14, 52, 6, 8);
                ctx.fillRect(21, 52, 6, 8);
                ctx.fillRect(29, 52, 6, 8);
                ctx.fillRect(37, 52, 6, 8);
                ctx.fillRect(45, 52, 6, 8);
                
                ctx.fillStyle = '#f00';
                [15, 22, 30, 38, 46].forEach(x => {
                    ctx.fillRect(x, 54, 4, 6);
                });
                break;
        }
    },
    
    // Get hardpoint positions based on hull type
    getHardpoints(hullType) {
        switch(hullType) {
            case 'scout':
                return [
                    { x: 24, y: 28 },  // Left
                    { x: 38, y: 28 }   // Right
                ];
            case 'fighter':
                return [
                    { x: 16, y: 30 },  // Left wing
                    { x: 46, y: 30 },  // Right wing
                    { x: 18, y: 35 },  // Left side
                    { x: 44, y: 35 }   // Right side
                ];
            case 'corvette':
                return [
                    { x: 12, y: 28 },  // Far left
                    { x: 50, y: 28 },  // Far right
                    { x: 16, y: 34 },  // Left wing
                    { x: 46, y: 34 },  // Right wing
                    { x: 20, y: 40 },  // Left side
                    { x: 42, y: 40 }   // Right side
                ];
            case 'destroyer':
                return [
                    { x: 10, y: 26 },  // Far left top
                    { x: 52, y: 26 },  // Far right top
                    { x: 12, y: 32 },  // Left top
                    { x: 50, y: 32 },  // Right top
                    { x: 14, y: 38 },  // Left mid
                    { x: 48, y: 38 },  // Right mid
                    { x: 16, y: 44 },  // Left bottom
                    { x: 46, y: 44 }   // Right bottom
                ];
            case 'battleship':
                return [
                    { x: 8, y: 24 },   // Far left top
                    { x: 54, y: 24 },  // Far right top
                    { x: 10, y: 30 },  // Left top
                    { x: 52, y: 30 },  // Right top
                    { x: 12, y: 36 },  // Left mid-top
                    { x: 50, y: 36 },  // Right mid-top
                    { x: 14, y: 42 },  // Left mid-bottom
                    { x: 48, y: 42 },  // Right mid-bottom
                    { x: 16, y: 48 },  // Left bottom
                    { x: 46, y: 48 }   // Right bottom
                ];
            default:
                return [];
        }
    },
    
    // Draw weapon in specific position
    drawWeapon(ctx, weaponType, position) {
        const pos = position;
        
        switch(weaponType) {
            case 'laserTurrets':
                // Small turret mount
                ctx.fillStyle = '#0f0';
                ctx.fillRect(pos.x, pos.y, 3, 4);
                ctx.fillStyle = '#0ff';
                ctx.fillRect(pos.x, pos.y, 3, 2);
                break;
                
            case 'missileLaunchers':
                // Missile pod
                ctx.fillStyle = '#f80';
                ctx.fillRect(pos.x - 1, pos.y, 4, 8);
                ctx.strokeStyle = '#fff';
                ctx.strokeRect(pos.x - 1, pos.y, 4, 8);
                // Missile tips
                ctx.fillStyle = '#ff0';
                ctx.fillRect(pos.x, pos.y + 1, 2, 2);
                ctx.fillRect(pos.x, pos.y + 4, 2, 2);
                break;
                
            case 'railguns':
                // Long barrel
                ctx.strokeStyle = '#00f';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(pos.x + 1, pos.y);
                ctx.lineTo(pos.x + 1, pos.y - 15);
                ctx.stroke();
                // Barrel tip glow
                ctx.fillStyle = '#0ff';
                ctx.fillRect(pos.x, pos.y - 16, 3, 2);
                break;
                
            case 'plasmaCannons':
                // Plasma emitter
                ctx.fillStyle = '#f0f';
                ctx.beginPath();
                ctx.arc(pos.x + 2, pos.y + 2, 4, 0, Math.PI * 2);
                ctx.fill();
                // Inner glow
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(pos.x + 2, pos.y + 2, 2, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
    },
    
    // Draw defense module
    drawDefense(ctx, defenseType, ship) {
        switch(defenseType) {
            case 'shieldGenerators':
                // Shield bubble
                if (ship.shield > 0) {
                    const shieldAlpha = Math.min(0.4, (ship.shield / ship.maxShield) * 0.4);
                    ctx.strokeStyle = `rgba(0, 255, 255, ${shieldAlpha + 0.2})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(32, 32, 28, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Shield glow
                    ctx.fillStyle = `rgba(0, 255, 255, ${shieldAlpha})`;
                    ctx.beginPath();
                    ctx.arc(32, 32, 28, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            case 'armorPlates':
                // Armor plating overlay
                ctx.strokeStyle = '#888';
                ctx.lineWidth = 2;
                ctx.strokeRect(21, 24, 22, 22);
                ctx.strokeRect(23, 26, 18, 18);
                // Armor rivets
                ctx.fillStyle = '#666';
                [24, 32, 40].forEach(x => {
                    [26, 34, 42].forEach(y => {
                        ctx.fillRect(x, y, 2, 2);
                    });
                });
                break;
                
            case 'pointDefense':
                // Point defense turrets on top
                ctx.fillStyle = '#ff0';
                ctx.fillRect(28, 28, 3, 3);
                ctx.fillRect(35, 28, 3, 3);
                ctx.strokeStyle = '#f80';
                ctx.lineWidth = 1;
                ctx.strokeRect(28, 28, 3, 3);
                ctx.strokeRect(35, 28, 3, 3);
                break;
        }
    },
    
    // Draw complete player ship with all equipment
    drawPlayerShip(canvas, ship) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 64, 64);
        
        const hullType = ship.hullType || 'fighter';
        
        // Layer 1: Shield (behind everything)
        if (ship.defense.shieldGenerators > 0) {
            this.drawDefense(ctx, 'shieldGenerators', ship);
        }
        
        // Layer 2: Base hull
        this.drawBaseHull(ctx, hullType);
        
        // Layer 3: Armor plating (over hull)
        if (ship.defense.armorPlates > 0) {
            this.drawDefense(ctx, 'armorPlates', ship);
        }
        
        // Layer 4: Weapons (visible on hardpoints)
        const hardpoints = this.getHardpoints(hullType);
        let hardpointIndex = 0;
        
        Object.entries(ship.weapons).forEach(([weaponType, count]) => {
            for (let i = 0; i < count && hardpointIndex < hardpoints.length; i++) {
                this.drawWeapon(ctx, weaponType, hardpoints[hardpointIndex]);
                hardpointIndex++;
            }
        });
        
        // Layer 5: Point defense (on top)
        if (ship.defense.pointDefense > 0) {
            this.drawDefense(ctx, 'pointDefense', ship);
        }
    },
    
    // Draw enemy ship based on wave
    drawEnemyShip(canvas, wave) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 64, 64);
        
        if (wave <= 3) {
            // Scout - small, fast
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.moveTo(32, 50); // Bottom point
            ctx.lineTo(20, 30);
            ctx.lineTo(32, 25);
            ctx.lineTo(44, 30);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Wings
            ctx.fillStyle = '#800';
            ctx.beginPath();
            ctx.moveTo(20, 30);
            ctx.lineTo(10, 35);
            ctx.lineTo(15, 40);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(44, 30);
            ctx.lineTo(54, 35);
            ctx.lineTo(49, 40);
            ctx.closePath();
            ctx.fill();
            
            // Cockpit
            ctx.fillStyle = '#ff0';
            ctx.fillRect(30, 32, 4, 4);
            
        } else if (wave <= 6) {
            // Fighter - medium
            ctx.fillStyle = '#f00';
            ctx.fillRect(26, 15, 12, 30);
            ctx.strokeStyle = '#fff';
            ctx.strokeRect(26, 15, 12, 30);
            
            // Wings
            ctx.fillStyle = '#c00';
            ctx.fillRect(15, 25, 10, 15);
            ctx.fillRect(39, 25, 10, 15);
            
            // Cockpit
            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.arc(32, 25, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Weapons
            ctx.fillStyle = '#0f0';
            ctx.fillRect(20, 35, 3, 6);
            ctx.fillRect(41, 35, 3, 6);
            
            // Engine
            ctx.fillStyle = '#f80';
            ctx.fillRect(28, 45, 8, 6);
            
        } else if (wave <= 10) {
            // Destroyer - large
            ctx.fillStyle = '#a00';
            ctx.fillRect(22, 10, 20, 40);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(22, 10, 20, 40);
            
            // Command tower
            ctx.fillStyle = '#f00';
            ctx.fillRect(28, 15, 8, 10);
            
            // Armor plating
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                ctx.strokeRect(23, 12 + i * 9, 18, 8);
            }
            
            // Heavy weapons
            ctx.fillStyle = '#0f0';
            ctx.fillRect(16, 20, 5, 8);
            ctx.fillRect(43, 20, 5, 8);
            ctx.fillRect(16, 35, 5, 8);
            ctx.fillRect(43, 35, 5, 8);
            
            // Engines
            ctx.fillStyle = '#f80';
            ctx.fillRect(24, 50, 6, 8);
            ctx.fillRect(34, 50, 6, 8);
            
        } else {
            // Battleship - massive
            ctx.fillStyle = '#800';
            ctx.fillRect(18, 8, 28, 48);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(18, 8, 28, 48);
            
            // Command bridge
            ctx.fillStyle = '#f00';
            ctx.fillRect(26, 12, 12, 12);
            ctx.strokeRect(26, 12, 12, 12);
            
            // Heavy armor sections
            ctx.fillStyle = '#666';
            ctx.fillRect(20, 26, 24, 8);
            ctx.fillRect(20, 36, 24, 8);
            
            // Multiple weapon batteries
            ctx.fillStyle = '#0f0';
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(12, 20 + i * 10, 5, 6);
                ctx.fillRect(47, 20 + i * 10, 5, 6);
            }
            
            // Massive engines
            ctx.fillStyle = '#f80';
            ctx.fillRect(20, 56, 8, 6);
            ctx.fillRect(36, 56, 8, 6);
            ctx.fillStyle = '#ff0';
            ctx.fillRect(22, 58, 4, 3);
            ctx.fillRect(38, 58, 4, 3);
            
            // Shield indicators
            ctx.strokeStyle = '#0ff';
            ctx.lineWidth = 1;
            ctx.strokeRect(17, 7, 30, 50);
        }
    },
    
    // Draw asteroids
    drawAsteroid(canvas, size = 'medium') {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 64, 64);
        
        const sizes = {
            small: { radius: 12, craters: 2 },
            medium: { radius: 20, craters: 4 },
            large: { radius: 28, craters: 6 }
        };
        
        const config = sizes[size];
        
        // Asteroid body (irregular circle)
        ctx.fillStyle = '#666';
        ctx.beginPath();
        const points = 8;
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const variance = config.radius * (0.8 + Math.random() * 0.4);
            const x = 32 + Math.cos(angle) * variance;
            const y = 32 + Math.sin(angle) * variance;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Craters
        ctx.fillStyle = '#444';
        for (let i = 0; i < config.craters; i++) {
            const angle = (i / config.craters) * Math.PI * 2;
            const distance = config.radius * 0.5;
            const x = 32 + Math.cos(angle) * distance;
            const y = 32 + Math.sin(angle) * distance;
            ctx.beginPath();
            ctx.arc(x, y, 3 + Math.random() * 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Surface details
        ctx.fillStyle = '#555';
        for (let i = 0; i < 5; i++) {
            const x = 20 + Math.random() * 24;
            const y = 20 + Math.random() * 24;
            ctx.fillRect(x, y, 2, 2);
        }
    },
    
    // Draw space station
    drawSpaceStation(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 64, 64);
        
        // Central hub
        ctx.fillStyle = '#888';
        ctx.fillRect(24, 24, 16, 16);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(24, 24, 16, 16);
        
        // Windows
        ctx.fillStyle = '#0ff';
        ctx.fillRect(27, 27, 3, 3);
        ctx.fillRect(34, 27, 3, 3);
        ctx.fillRect(27, 34, 3, 3);
        ctx.fillRect(34, 34, 3, 3);
        
        // Docking arms (4 directions)
        ctx.fillStyle = '#666';
        // Top
        ctx.fillRect(30, 14, 4, 10);
        ctx.fillRect(28, 14, 8, 3);
        // Bottom
        ctx.fillRect(30, 40, 4, 10);
        ctx.fillRect(28, 47, 8, 3);
        // Left
        ctx.fillRect(14, 30, 10, 4);
        ctx.fillRect(14, 28, 3, 8);
        // Right
        ctx.fillRect(40, 30, 10, 4);
        ctx.fillRect(47, 28, 3, 8);
        
        // Solar panels
        ctx.fillStyle = '#00f';
        ctx.fillRect(10, 26, 4, 12);
        ctx.fillRect(50, 26, 4, 12);
        
        // Antenna
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(32, 24);
        ctx.lineTo(32, 10);
        ctx.stroke();
        ctx.fillStyle = '#f00';
        ctx.fillRect(31, 10, 2, 2);
    },
    
    // Draw debris field
    drawDebris(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 64, 64);
        
        // Multiple debris pieces
        const pieces = [
            { x: 15, y: 20, w: 8, h: 6, angle: 0.3 },
            { x: 35, y: 15, w: 10, h: 4, angle: -0.5 },
            { x: 25, y: 35, w: 6, h: 8, angle: 0.8 },
            { x: 45, y: 40, w: 7, h: 5, angle: -0.2 },
            { x: 20, y: 48, w: 5, h: 6, angle: 1.2 }
        ];
        
        pieces.forEach(piece => {
            ctx.save();
            ctx.translate(piece.x + piece.w/2, piece.y + piece.h/2);
            ctx.rotate(piece.angle);
            
            // Debris piece
            ctx.fillStyle = '#444';
            ctx.fillRect(-piece.w/2, -piece.h/2, piece.w, piece.h);
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.strokeRect(-piece.w/2, -piece.h/2, piece.w, piece.h);
            
            // Damage marks
            ctx.fillStyle = '#222';
            ctx.fillRect(-piece.w/4, -piece.h/4, 2, 2);
            
            ctx.restore();
        });
    },
    
    // Draw mine (explosive hazard)
    drawMine(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 64, 64);
        
        // Mine body
        ctx.fillStyle = '#800';
        ctx.beginPath();
        ctx.arc(32, 32, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Spikes
        const spikes = 8;
        ctx.fillStyle = '#666';
        for (let i = 0; i < spikes; i++) {
            const angle = (i / spikes) * Math.PI * 2;
            const x1 = 32 + Math.cos(angle) * 16;
            const y1 = 32 + Math.sin(angle) * 16;
            const x2 = 32 + Math.cos(angle) * 24;
            const y2 = 32 + Math.sin(angle) * 24;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#888';
            ctx.stroke();
        }
        
        // Warning light
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.arc(32, 32, 4, 0, Math.PI * 2);
        ctx.fill();
    },
    
    // Create canvas element and draw entity
    createShipCanvas(type, data) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        canvas.style.imageRendering = 'pixelated';
        
        if (type === 'player') {
            this.drawPlayerShip(canvas, data);
        } else if (type === 'enemy') {
            this.drawEnemyShip(canvas, data);
        } else if (type === 'asteroid') {
            this.drawAsteroid(canvas, data);
        } else if (type === 'station') {
            this.drawSpaceStation(canvas);
        } else if (type === 'debris') {
            this.drawDebris(canvas);
        } else if (type === 'mine') {
            this.drawMine(canvas);
        }
        
        return canvas;
    }
};
