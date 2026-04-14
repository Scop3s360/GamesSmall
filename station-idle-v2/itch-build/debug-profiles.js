// Debug Profiles - Test starting states for different systems
// TO DISABLE: Comment out the script tag in index.html

const DebugProfiles = {
    profiles: {
        crewTest: {
            name: "Crew Automation Test",
            description: "Resources and modules for testing crew system",
            state: {
                resources: {
                    ice: 500, ironOre: 500, carbon: 500,
                    water: 1000, steel: 500,
                    electronics: 100, fuel: 100, alloys: 100,
                    components: 50, food: 500, oxygen: 500,
                    power: 1000
                },
                modules: {
                    iceExtractor: 2,
                    ironMine: 2,
                    carbonExtractor: 2,
                    waterProcessor: 2,
                    smelter: 2,
                    electronicsLab: 1,
                    refinery: 1,
                    forgery: 1,
                    assemblyPlant: 1,
                    hydroponics: 2,
                    oxygenGenerator: 2,
                    habitation: 3  // 6 crew capacity
                },
                unlockedRecipes: [
                    'gatherIce', 'mineIron', 'extractCarbon',
                    'processWater', 'smeltSteel',
                    'craftElectronics', 'refineFuel', 'forgeAlloys',
                    'assembleComponents', 'growFood', 'generateOxygen'
                ]
            }
        },
        
        combatTest: {
            name: "Combat System Test",
            description: "Resources and equipment for testing combat",
            state: {
                resources: {
                    ice: 200, ironOre: 200, carbon: 200,
                    water: 500, steel: 1000,
                    electronics: 200, fuel: 200, alloys: 200,
                    components: 100,
                    // Combat equipment
                    laserTurrets: 10,
                    missileLaunchers: 8,
                    railguns: 5,
                    plasmaCannons: 3,
                    shieldGenerators: 5,
                    armorPlates: 5,
                    pointDefense: 5,
                    power: 1000
                },
                modules: {
                    iceExtractor: 1,
                    ironMine: 1,
                    carbonExtractor: 1,
                    waterProcessor: 1,
                    smelter: 2,
                    electronicsLab: 2,
                    refinery: 1,
                    forgery: 1,
                    assemblyPlant: 1,
                    weaponsFactory: 1,
                    advancedWeaponry: 1,
                    exoticWeapons: 1,
                    defenseGrid: 1
                },
                unlockedRecipes: [
                    'gatherIce', 'mineIron', 'extractCarbon',
                    'processWater', 'smeltSteel',
                    'craftElectronics', 'refineFuel', 'forgeAlloys',
                    'assembleComponents',
                    'buildLaserTurrets', 'buildMissileLaunchers',
                    'buildRailguns', 'buildPlasmaCannons',
                    'buildShieldGenerators', 'buildArmorPlates', 'buildPointDefense'
                ],
                combat: {
                    ship: {
                        hullType: 'scout',
                        weapons: { laserTurrets: 0, missileLaunchers: 0, railguns: 0, plasmaCannons: 0 },
                        defense: { shieldGenerators: 0, armorPlates: 0, pointDefense: 0 },
                        hp: 100, maxHp: 100, shield: 0, maxShield: 0
                    },
                    waveNumber: 0,
                    enemiesDefeated: 0
                }
            }
        },
        
        productionTest: {
            name: "Production Chain Test",
            description: "Mid-tier resources for testing production chains",
            state: {
                resources: {
                    ice: 1000, ironOre: 1000, carbon: 1000,
                    water: 500, steel: 500,
                    electronics: 200, fuel: 200, alloys: 200,
                    components: 100, food: 200, oxygen: 200,
                    advancedAlloys: 50, processors: 50, energyCells: 50,
                    power: 1000
                },
                modules: {
                    iceExtractor: 2,
                    ironMine: 2,
                    carbonExtractor: 2,
                    waterProcessor: 2,
                    smelter: 2,
                    electronicsLab: 2,
                    refinery: 2,
                    forgery: 2,
                    assemblyPlant: 2,
                    hydroponics: 1,
                    oxygenGenerator: 1,
                    advancedManufacturing: 1,
                    nanoFabricator: 1
                },
                unlockedRecipes: [
                    'gatherIce', 'mineIron', 'extractCarbon',
                    'processWater', 'smeltSteel',
                    'craftElectronics', 'refineFuel', 'forgeAlloys',
                    'assembleComponents', 'growFood', 'generateOxygen',
                    'forgeAdvancedAlloys', 'buildProcessors', 'createEnergyCells'
                ]
            }
        }
    },
    
    // Load a debug profile
    loadProfile(profileName) {
        const profile = this.profiles[profileName];
        if (!profile) {
            console.error(`Profile "${profileName}" not found`);
            return false;
        }
        
        console.log(`Loading debug profile: ${profile.name}`);
        
        // Reset game state
        Game.resources = {};
        Game.modules = {};
        Game.activeRecipes = {};
        
        // Load resources
        Object.keys(profile.state.resources).forEach(resource => {
            Game.resources[resource] = profile.state.resources[resource];
        });
        
        // Load modules
        Object.keys(profile.state.modules).forEach(module => {
            Game.modules[module] = profile.state.modules[module];
        });
        
        // Unlock recipes
        profile.state.unlockedRecipes.forEach(recipeId => {
            if (Recipes[recipeId]) {
                Recipes[recipeId].unlocked = true;
            }
        });
        
        // Load combat state if present
        if (profile.state.combat) {
            Game.combat = JSON.parse(JSON.stringify(profile.state.combat));
            if (typeof CombatSystem !== 'undefined') {
                CombatSystem.ship = JSON.parse(JSON.stringify(profile.state.combat.ship));
            }
        }
        
        // Load crew state if present
        if (profile.state.crew) {
            Game.crew = JSON.parse(JSON.stringify(profile.state.crew));
        }
        
        // Update UI
        if (typeof updateUI === 'function') updateUI();
        if (typeof renderProduction === 'function') renderProduction();
        if (typeof renderStation === 'function') renderStation();
        
        console.log(`Profile "${profile.name}" loaded successfully`);
        return true;
    },
    
    // Render debug menu
    renderDebugMenu() {
        const container = document.getElementById('debug-menu');
        if (!container) return;
        
        let html = '<div class="card" style="background: #300; border-color: #f00;">';
        html += '<h3 style="color: #f00;">🔧 DEBUG PROFILES</h3>';
        html += '<p style="color: #f88; font-size: 0.9em;">Remove script tag in index.html to disable</p>';
        html += '<div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">';
        
        Object.keys(this.profiles).forEach(key => {
            const profile = this.profiles[key];
            html += `
                <div class="card" style="padding: 10px;">
                    <h4 style="margin: 0 0 5px 0;">${profile.name}</h4>
                    <p style="margin: 0 0 10px 0; font-size: 0.9em; opacity: 0.7;">${profile.description}</p>
                    <button class="btn" onclick="DebugProfiles.loadProfile('${key}')" style="width: 100%;">
                        Load Profile
                    </button>
                </div>
            `;
        });
        
        html += '</div></div>';
        container.innerHTML = html;
    }
};

// Auto-render debug menu on page load
window.addEventListener('load', () => {
    DebugProfiles.renderDebugMenu();
});
