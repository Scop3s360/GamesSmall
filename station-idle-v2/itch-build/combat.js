// Combat System - Ship management and enemy encounters

// Combat Zones and Enemies
const CombatZones = {
    asteroidBelt: {
        id: 'asteroidBelt',
        name: 'Asteroid Belt',
        icon: '☄️',
        description: 'Rocky debris field with minor threats',
        enemies: [
            { id: 'scavenger', name: 'Scavenger Drone', icon: '🤖', hp: 50, damage: 5, rewards: { steel: 10, components: 2 } },
            { id: 'miningBot', name: 'Rogue Mining Bot', icon: '⚙️', hp: 80, damage: 8, rewards: { steel: 15, ironOre: 10 } },
            { id: 'pirate', name: 'Pirate Scout', icon: '🏴‍☠️', hp: 120, damage: 12, rewards: { steel: 20, components: 5, fuel: 5 } }
        ]
    },
    nebula: {
        id: 'nebula',
        name: 'Nebula Cloud',
        icon: '🌫️',
        description: 'Dense gas cloud with energy anomalies',
        enemies: [
            { id: 'energyBeing', name: 'Energy Being', icon: '⚡', hp: 100, damage: 15, rewards: { energyCells: 5, electronics: 10 } },
            { id: 'plasmoid', name: 'Plasmoid', icon: '💥', hp: 150, damage: 20, rewards: { plasmaCores: 2, energyCells: 8 } },
            { id: 'voidWraith', name: 'Void Wraith', icon: '👻', hp: 200, damage: 25, rewards: { exoticMatter: 3, energyCells: 12 } }
        ]
    },
    derelictStation: {
        id: 'derelictStation',
        name: 'Derelict Station',
        icon: '🛰️',
        description: 'Abandoned station with hostile defenses',
        enemies: [
            { id: 'securityDrone', name: 'Security Drone', icon: '🚁', hp: 180, damage: 18, rewards: { components: 10, electronics: 8 } },
            { id: 'turretSystem', name: 'Automated Turret', icon: '🔫', hp: 250, damage: 30, rewards: { laserTurrets: 2, components: 15 } },
            { id: 'stationAI', name: 'Rogue Station AI', icon: '🧠', hp: 400, damage: 40, rewards: { processors: 5, advancedCircuits: 3, components: 20 } }
        ]
    },
    alienRuins: {
        id: 'alienRuins',
        name: 'Alien Ruins',
        icon: '🗿',
        description: 'Ancient structures with unknown guardians',
        enemies: [
            { id: 'sentinel', name: 'Ancient Sentinel', icon: '🗿', hp: 300, damage: 35, rewards: { nanoMaterials: 5, advancedAlloys: 10 } },
            { id: 'guardian', name: 'Alien Guardian', icon: '👽', hp: 500, damage: 50, rewards: { quantumProcessors: 3, exoticMatter: 5 } },
            { id: 'construct', name: 'Precursor Construct', icon: '🔷', hp: 800, damage: 70, rewards: { singularityContainers: 2, exoticMatter: 10, quantumProcessors: 5 } }
        ]
    }
};

// Hull types with categorized slot limits and attack speeds
const HullTypes = {
    scout: { 
        name: 'Scout', 
        weaponSlots: 1, 
        armorSlots: 1, 
        shieldSlots: 0, 
        baseHp: 100, 
        attackSpeed: 0.5 
    },
    fighter: { 
        name: 'Fighter', 
        weaponSlots: 2, 
        armorSlots: 1, 
        shieldSlots: 1, 
        baseHp: 150, 
        attackSpeed: 0.75 
    },
    corvette: { 
        name: 'Corvette', 
        weaponSlots: 3, 
        armorSlots: 2, 
        shieldSlots: 1, 
        baseHp: 200, 
        attackSpeed: 1.0 
    },
    destroyer: { 
        name: 'Destroyer', 
        weaponSlots: 5, 
        armorSlots: 2, 
        shieldSlots: 1, 
        baseHp: 300, 
        attackSpeed: 1.5 
    },
    battleship: { 
        name: 'Battleship', 
        weaponSlots: 6, 
        armorSlots: 2, 
        shieldSlots: 2, 
        baseHp: 500, 
        attackSpeed: 2.0 
    }
};

const CombatSystem = {
    // Ship loadout
    ship: {
        hullType: 'scout',
        weapons: {
            laserTurrets: 0,
            missileLaunchers: 0,
            railguns: 0,
            plasmaCannons: 0
        },
        defense: {
            shieldGenerators: 0,
            armorPlates: 0,
            pointDefense: 0
        },
        hp: 100,
        maxHp: 100,
        shield: 0,
        maxShield: 0
    },
    
    // Enemy state
    enemy: null,
    enemyHp: 0,
    enemyMaxHp: 0,
    currentZone: null,
    currentEnemyId: null,
    
    // Combat state
    inCombat: false,
    combatTimer: 0,
    playerAttackTimer: 0,
    pendingRewards: {},  // Temporary storage for rewards during combat
    
    // Initialize combat system
    init() {
        if (!Game.combat) {
            Game.combat = {
                ship: JSON.parse(JSON.stringify(this.ship)),
                waveNumber: 0,
                enemiesDefeated: 0
            };
        } else {
            this.ship = Game.combat.ship;
            // Ensure hullType exists for old saves
            if (!this.ship.hullType) {
                this.ship.hullType = 'scout';
            }
        }
        Log.info('Combat system initialized', Game.combat);
    },
    
    // Get total equipped slots by category
    getEquippedSlots() {
        const weaponSlots = Object.values(this.ship.weapons).reduce((a, b) => a + b, 0);
        const armorSlots = this.ship.defense.armorPlates;
        const shieldSlots = this.ship.defense.shieldGenerators + this.ship.defense.pointDefense;
        return { weapons: weaponSlots, armor: armorSlots, shields: shieldSlots };
    },
    
    // Get max slots for current hull
    getMaxSlots() {
        const hull = HullTypes[this.ship.hullType];
        return { 
            weapons: hull.weaponSlots, 
            armor: hull.armorSlots, 
            shields: hull.shieldSlots 
        };
    },
    
    // Change hull type
    changeHullType(hullType) {
        if (!HullTypes[hullType]) {
            Log.error(`Invalid hull type: ${hullType}`);
            return false;
        }
        
        this.ship.hullType = hullType;
        this.updateShipStats();
        Game.combat.ship = JSON.parse(JSON.stringify(this.ship));
        Log.game(`Changed hull type to ${HullTypes[hullType].name}`);
        return true;
    },
    
    // Equip weapon to ship
    equipWeapon(weaponType) {
        const available = Game.resources[weaponType];
        if (available <= 0) {
            Log.warn(`No ${weaponType} available to equip`);
            return false;
        }
        
        // Check weapon slot limit
        const equipped = this.getEquippedSlots();
        const maxSlots = this.getMaxSlots();
        if (equipped.weapons >= maxSlots.weapons) {
            Log.warn(`Cannot equip - weapon slots full (${maxSlots.weapons} max)`);
            return false;
        }
        
        Game.resources[weaponType]--;
        this.ship.weapons[weaponType]++;
        Game.combat.ship = JSON.parse(JSON.stringify(this.ship));
        Log.game(`Equipped ${weaponType} to ship`);
        return true;
    },
    
    // Unequip weapon from ship
    unequipWeapon(weaponType) {
        if (this.ship.weapons[weaponType] <= 0) {
            Log.warn(`No ${weaponType} equipped on ship`);
            return false;
        }
        
        this.ship.weapons[weaponType]--;
        Game.resources[weaponType]++;
        Game.combat.ship = JSON.parse(JSON.stringify(this.ship));
        Log.game(`Unequipped ${weaponType} from ship`);
        return true;
    },
    
    // Equip defense to ship
    equipDefense(defenseType) {
        const available = Game.resources[defenseType];
        if (available <= 0) {
            Log.warn(`No ${defenseType} available to equip`);
            return false;
        }
        
        // Check slot limit by category
        const equipped = this.getEquippedSlots();
        const maxSlots = this.getMaxSlots();
        
        if (defenseType === 'armorPlates') {
            if (equipped.armor >= maxSlots.armor) {
                Log.warn(`Cannot equip - armor slots full (${maxSlots.armor} max)`);
                return false;
            }
        } else {
            // shieldGenerators and pointDefense use shield slots
            if (equipped.shields >= maxSlots.shields) {
                Log.warn(`Cannot equip - shield slots full (${maxSlots.shields} max)`);
                return false;
            }
        }
        
        Game.resources[defenseType]--;
        this.ship.defense[defenseType]++;
        Game.combat.ship = JSON.parse(JSON.stringify(this.ship));
        this.updateShipStats();
        Log.game(`Equipped ${defenseType} to ship`);
        return true;
    },
    
    // Unequip defense from ship
    unequipDefense(defenseType) {
        if (this.ship.defense[defenseType] <= 0) {
            Log.warn(`No ${defenseType} equipped on ship`);
            return false;
        }
        
        this.ship.defense[defenseType]--;
        Game.resources[defenseType]++;
        Game.combat.ship = JSON.parse(JSON.stringify(this.ship));
        this.updateShipStats();
        Log.game(`Unequipped ${defenseType} from ship`);
        return true;
    },
    
    // Update ship stats based on equipment
    updateShipStats() {
        // Base stats from hull type
        const hullData = HullTypes[this.ship.hullType];
        this.ship.maxHp = hullData.baseHp;
        this.ship.maxShield = 0;
        
        // Armor plates add HP
        this.ship.maxHp += this.ship.defense.armorPlates * 50;
        
        // Shield generators add shield
        this.ship.maxShield = this.ship.defense.shieldGenerators * 100;
        
        // Restore to max if not in combat
        if (!this.inCombat) {
            this.ship.hp = this.ship.maxHp;
            this.ship.shield = this.ship.maxShield;
        }
        
        Game.combat.ship = JSON.parse(JSON.stringify(this.ship));
    },
    
    // Calculate total damage output
    calculateDamage() {
        let damage = 0;
        damage += this.ship.weapons.laserTurrets * 10;
        damage += this.ship.weapons.missileLaunchers * 25;
        damage += this.ship.weapons.railguns * 50;
        damage += this.ship.weapons.plasmaCannons * 100;
        return damage;
    },
    
    // Start combat encounter
    startCombat(zoneId, enemyId) {
        if (this.inCombat) {
            Log.warn('Already in combat');
            return false;
        }
        
        const zone = CombatZones[zoneId];
        if (!zone) {
            Log.error(`Zone ${zoneId} not found`);
            return false;
        }
        
        const enemyData = zone.enemies.find(e => e.id === enemyId);
        if (!enemyData) {
            Log.error(`Enemy ${enemyId} not found in zone ${zoneId}`);
            return false;
        }
        
        this.currentZone = zoneId;
        this.currentEnemyId = enemyId;
        this.enemy = { ...enemyData };
        this.enemyHp = this.enemy.hp;
        this.enemyMaxHp = this.enemy.hp;
        this.inCombat = true;
        this.combatTimer = 0;
        this.playerAttackTimer = 0;
        this.pendingRewards = {};  // Clear pending rewards
        
        Log.game(`Combat started - ${zone.name}: ${this.enemy.name}`);
        return true;
    },
    
    // Update combat (called from game loop)
    update(deltaTime) {
        if (!this.inCombat) return;
        
        this.combatTimer += deltaTime;
        this.playerAttackTimer += deltaTime;
        
        // Player attacks based on hull attack speed
        const attackSpeed = HullTypes[this.ship.hullType].attackSpeed;
        if (this.playerAttackTimer >= attackSpeed) {
            this.playerAttackTimer = 0;
            this.playerAttack();
        }
        
        // Enemy attacks every second
        if (this.combatTimer >= 1) {
            this.combatTimer = 0;
            this.enemyAttack();
        }
    },
    
    // Player attack
    playerAttack() {
        const baseDamage = this.calculateDamage();
        // Add variance: 85% to 115% of base damage
        const variance = 0.85 + Math.random() * 0.3;
        const playerDamage = Math.floor(baseDamage * variance);
        
        this.enemyHp -= playerDamage;
        Log.info(`Player deals ${playerDamage} damage to enemy`);
        
        // Check if enemy defeated
        if (this.enemyHp <= 0) {
            this.endCombat(true);
        }
    },
    
    // Enemy attack
    enemyAttack() {
        // Base enemy damage with variance: 85% to 115%
        const variance = 0.85 + Math.random() * 0.3;
        let enemyDamage = Math.floor(this.enemy.damage * variance);
        
        // Point defense reduces incoming damage
        const pointDefenseReduction = this.ship.defense.pointDefense * 2;
        enemyDamage = Math.max(0, enemyDamage - pointDefenseReduction);
        
        // Shields absorb damage first
        if (this.ship.shield > 0) {
            if (this.ship.shield >= enemyDamage) {
                this.ship.shield -= enemyDamage;
                Log.info(`Shields absorb ${enemyDamage} damage`);
                enemyDamage = 0;
            } else {
                enemyDamage -= this.ship.shield;
                Log.info(`Shields depleted, ${enemyDamage} damage to hull`);
                this.ship.shield = 0;
            }
        }
        
        // Remaining damage to HP
        if (enemyDamage > 0) {
            this.ship.hp -= enemyDamage;
            Log.info(`Enemy deals ${enemyDamage} damage to hull`);
        }
        
        // Check if player defeated
        if (this.ship.hp <= 0) {
            Log.game(`Player HP reached ${this.ship.hp} - triggering defeat`);
            this.endCombat(false);
            return; // Stop processing this tick
        }
        
        Game.combat.ship = JSON.parse(JSON.stringify(this.ship));
    },
    
    // End combat
    endCombat(victory) {
        if (victory) {
            Game.combat.enemiesDefeated++;
            Log.game(`Victory! Defeated ${this.enemy.name}`);
            
            // Add rewards to pending (not inventory yet)
            Object.keys(this.enemy.rewards).forEach(resource => {
                const amount = this.enemy.rewards[resource];
                this.pendingRewards[resource] = (this.pendingRewards[resource] || 0) + amount;
                Log.game(`Earned: +${amount} ${Resources[resource].name} (pending)`);
            });
            
            // Respawn same enemy for continuous combat
            const zone = CombatZones[this.currentZone];
            const enemyData = zone.enemies.find(e => e.id === this.currentEnemyId);
            this.enemy = { ...enemyData };
            this.enemyHp = this.enemy.hp;
            this.enemyMaxHp = this.enemy.hp;
            this.combatTimer = 0;
            this.playerAttackTimer = 0;
            
            Log.game(`${this.enemy.name} respawned - combat continues!`);
            
            // Force UI update for respawn
            if (typeof CombatUI !== 'undefined') {
                CombatUI.renderCombatTab();
            }
        } else {
            // Player defeated - lose all pending rewards
            Log.game('=== DEFEAT TRIGGERED ===');
            this.inCombat = false;
            this.combatTimer = 0;
            this.playerAttackTimer = 0;
            
            Log.game('Defeat! Ship destroyed - all pending rewards lost!');
            this.pendingRewards = {};  // Clear pending rewards
            
            // Reset ship HP
            this.ship.hp = this.ship.maxHp;
            this.ship.shield = this.ship.maxShield;
            Game.combat.ship = JSON.parse(JSON.stringify(this.ship));
            
            this.enemy = null;
            this.enemyHp = 0;
            this.currentZone = null;
            this.currentEnemyId = null;
            
            Log.game('=== COMBAT ENDED - inCombat=' + this.inCombat + ' ===');
            
            // Force UI update to show defeat and return to zone selection
            if (typeof CombatUI !== 'undefined') {
                CombatUI.renderCombatTab();
            }
        }
    },
    
    // Retreat from combat
    retreat() {
        if (!this.inCombat) {
            Log.warn('Not in combat');
            return false;
        }
        
        this.inCombat = false;
        this.combatTimer = 0;
        this.playerAttackTimer = 0;
        
        // Transfer pending rewards to inventory
        Object.keys(this.pendingRewards).forEach(resource => {
            const amount = this.pendingRewards[resource];
            Game.resources[resource] = (Game.resources[resource] || 0) + amount;
            Log.game(`Collected: +${amount} ${Resources[resource].name}`);
        });
        
        Log.game('Retreated from combat - rewards collected!');
        this.pendingRewards = {};  // Clear pending rewards
        
        // Reset ship HP and shields
        this.ship.hp = this.ship.maxHp;
        this.ship.shield = this.ship.maxShield;
        Game.combat.ship = JSON.parse(JSON.stringify(this.ship));
        
        this.enemy = null;
        this.enemyHp = 0;
        this.currentZone = null;
        this.currentEnemyId = null;
        
        return true;
    }
};

// Initialize on load
CombatSystem.init();
