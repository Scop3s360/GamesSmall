// Game state
const Game = {
    resources: { 
        // Tier 1-2: Basic
        ice: 0, ironOre: 0, carbon: 0, water: 0, steel: 50,
        // Tier 3-4: Mid-tier 
        electronics: 0, fuel: 0, alloys: 0, components: 0, food: 0, oxygen: 0,
        // Tier 5: High-tier
        advancedAlloys: 0, processors: 0, energyCells: 0, nanoMaterials: 0,
        // Tier 6: Rare materials
        titaniumOre: 0, copperOre: 0, siliconOre: 0,
        titaniumAlloy: 0, copperWire: 0, siliconWafers: 0, circuits: 0, batteries: 0, plasticPolymers: 0, chemicalFuel: 0,
        // Tier 7: Advanced materials
        advancedCircuits: 0, nanotubes: 0, ceramicComposites: 0, superconductors: 0, quantumProcessors: 0, fusionCells: 0,
        // Tier 8: Exotic materials
        antimatterContainers: 0, darkMatterDetectors: 0, gravitonEmitters: 0, temporalStabilizers: 0, 
        neuralInterfaces: 0, quantumEntanglers: 0, plasmaCores: 0, singularityContainers: 0, exoticMatter: 0,
        // Tier 9: Megastructure components
        dysonComponents: 0, ringworldSections: 0, orbitalHabitats: 0, planetaryEngines: 0, 
        stellarForges: 0, warpGates: 0, matrioshkaBrains: 0, terraformingArrays: 0,
        // Tier 10: Ultimate systems
        colonyShips: 0, dysonSphere: 0, ringworld: 0, artificialIntelligence: 0, transcendence: 0,
        // Combat: Weapons & Defense
        laserTurrets: 0, missileLaunchers: 0, railguns: 0, plasmaCannons: 0,
        shieldGenerators: 0, armorPlates: 0, pointDefense: 0,
        // Special
        power: 100, maxPower: 100 
    },
    production: { active: null, progress: 0 },
    modules: { commandCenter: true, solarPanel: true },
    lastUpdate: Date.now()
};

// Logging utility
const Log = {
    info: (msg, data) => console.log(`[INFO] ${msg}`, data || ''),
    warn: (msg, data) => console.warn(`[WARN] ${msg}`, data || ''),
    error: (msg, data) => console.error(`[ERROR] ${msg}`, data || ''),
    game: (msg, data) => console.log(`[GAME] ${msg}`, data || '')
};

// Data
const Resources = {
    // Tier 1: Basic raw
    ice: { name: 'Ice', icon: '🧊' },
    ironOre: { name: 'Iron Ore', icon: '⛏️' },
    carbon: { name: 'Carbon', icon: '⚫' },
    // Tier 2: Basic processed
    water: { name: 'Water', icon: '💧' },
    steel: { name: 'Steel', icon: '🔩' },
    // Tier 3: Mid-tier
    electronics: { name: 'Electronics', icon: '🔌' },
    fuel: { name: 'Fuel', icon: '⛽' },
    alloys: { name: 'Alloys', icon: '🔗' },
    components: { name: 'Components', icon: '⚙️' },
    food: { name: 'Food', icon: '🍎' },
    oxygen: { name: 'Oxygen', icon: '💨' },
    // Tier 5: High-tier
    advancedAlloys: { name: 'Advanced Alloys', icon: '💎' },
    processors: { name: 'Processors', icon: '🖥️' },
    energyCells: { name: 'Energy Cells', icon: '🔋' },
    nanoMaterials: { name: 'Nano Materials', icon: '✨' },
    // Tier 6: Rare raw materials
    titaniumOre: { name: 'Titanium Ore', icon: '⬜' },
    copperOre: { name: 'Copper Ore', icon: '🟠' },
    siliconOre: { name: 'Silicon Ore', icon: '🔷' },
    // Tier 6: Rare processed
    titaniumAlloy: { name: 'Titanium Alloy', icon: '🛡️' },
    copperWire: { name: 'Copper Wire', icon: '🔌' },
    siliconWafers: { name: 'Silicon Wafers', icon: '💿' },
    circuits: { name: 'Circuits', icon: '🔌' },
    batteries: { name: 'Batteries', icon: '🔋' },
    plasticPolymers: { name: 'Plastic Polymers', icon: '🧪' },
    chemicalFuel: { name: 'Chemical Fuel', icon: '⛽' },
    // Tier 7: Advanced materials
    advancedCircuits: { name: 'Advanced Circuits', icon: '🖥️' },
    nanotubes: { name: 'Carbon Nanotubes', icon: '🧬' },
    ceramicComposites: { name: 'Ceramic Composites', icon: '🏺' },
    superconductors: { name: 'Superconductors', icon: '🌀' },
    quantumProcessors: { name: 'Quantum Processors', icon: '💠' },
    fusionCells: { name: 'Fusion Cells', icon: '☀️' },
    // Tier 8: Exotic materials
    antimatterContainers: { name: 'Antimatter Containers', icon: '⚛️' },
    darkMatterDetectors: { name: 'Dark Matter Detectors', icon: '🌑' },
    gravitonEmitters: { name: 'Graviton Emitters', icon: '🌊' },
    temporalStabilizers: { name: 'Temporal Stabilizers', icon: '⏱️' },
    neuralInterfaces: { name: 'Neural Interfaces', icon: '🧠' },
    quantumEntanglers: { name: 'Quantum Entanglers', icon: '🔗' },
    plasmaCores: { name: 'Plasma Cores', icon: '🔥' },
    singularityContainers: { name: 'Singularity Containers', icon: '⚫' },
    exoticMatter: { name: 'Exotic Matter', icon: '✨' },
    // Tier 9: Megastructure components
    dysonComponents: { name: 'Dyson Sphere Components', icon: '🌞' },
    ringworldSections: { name: 'Ringworld Sections', icon: '⭕' },
    orbitalHabitats: { name: 'Orbital Habitats', icon: '🛸' },
    planetaryEngines: { name: 'Planetary Engines', icon: '🚀' },
    stellarForges: { name: 'Stellar Forges', icon: '🔨' },
    warpGates: { name: 'Warp Gates', icon: '🌀' },
    matrioshkaBrains: { name: 'Matrioshka Brain Nodes', icon: '🧩' },
    terraformingArrays: { name: 'Terraforming Arrays', icon: '🌍' },
    // Tier 10: Ultimate systems
    colonyShips: { name: 'Colony Ships', icon: '🚢' },
    dysonSphere: { name: 'Dyson Sphere', icon: '☀️' },
    ringworld: { name: 'Ringworld', icon: '💍' },
    artificialIntelligence: { name: 'Artificial Intelligence', icon: '🤖' },
    transcendence: { name: 'Transcendence Protocol', icon: '🌟' },
    // Combat: Weapons
    laserTurrets: { name: 'Laser Turrets', icon: '🔫' },
    missileLaunchers: { name: 'Missile Launchers', icon: '🚀' },
    railguns: { name: 'Railguns', icon: '⚡' },
    plasmaCannons: { name: 'Plasma Cannons', icon: '💥' },
    // Combat: Defense
    shieldGenerators: { name: 'Shield Generators', icon: '🛡️' },
    armorPlates: { name: 'Armor Plates', icon: '🔰' },
    pointDefense: { name: 'Point Defense', icon: '🎯' },
    // Special
    power: { name: 'Power', icon: '⚡' }
};

const Recipes = {
    // Tier 1: Basic Gathering
    gatherIce: { id: 'gatherIce', name: 'Gather Ice', duration: 3, powerCost: 5, input: {}, output: { ice: 1 }, unlocked: true },
    mineIron: { id: 'mineIron', name: 'Mine Iron Ore', duration: 3, powerCost: 5, input: {}, output: { ironOre: 1 }, unlocked: true },
    gatherCarbon: { id: 'gatherCarbon', name: 'Gather Carbon', duration: 3, powerCost: 5, input: {}, output: { carbon: 1 }, unlocked: true },
    
    // Tier 2: Basic Processing
    processWater: { id: 'processWater', name: 'Process Water', duration: 4, powerCost: 10, input: { ice: 2 }, output: { water: 1 }, unlocked: false },
    smeltSteel: { id: 'smeltSteel', name: 'Smelt Steel', duration: 5, powerCost: 15, input: { ironOre: 2, carbon: 1 }, output: { steel: 1 }, unlocked: false },
    
    // Tier 3: Mid-tier Materials
    craftElectronics: { id: 'craftElectronics', name: 'Craft Electronics', duration: 6, powerCost: 20, input: { steel: 1, carbon: 1 }, output: { electronics: 1 }, unlocked: false },
    refineFuel: { id: 'refineFuel', name: 'Refine Fuel', duration: 7, powerCost: 25, input: { carbon: 2, water: 1 }, output: { fuel: 1 }, unlocked: false },
    forgeAlloys: { id: 'forgeAlloys', name: 'Forge Alloys', duration: 8, powerCost: 30, input: { steel: 2, ironOre: 1 }, output: { alloys: 1 }, unlocked: false },
    
    // Tier 4: Advanced Components
    assembleComponents: { id: 'assembleComponents', name: 'Assemble Components', duration: 10, powerCost: 40, input: { electronics: 1, alloys: 1 }, output: { components: 1 }, unlocked: false },
    growFood: { id: 'growFood', name: 'Grow Food', duration: 5, powerCost: 15, input: { water: 2, carbon: 1 }, output: { food: 1 }, unlocked: false },
    generateOxygen: { id: 'generateOxygen', name: 'Generate Oxygen', duration: 4, powerCost: 20, input: { water: 1 }, output: { oxygen: 1 }, unlocked: false },
    
    // Tier 5: High-tier Materials
    forgeAdvancedAlloys: { id: 'forgeAdvancedAlloys', name: 'Forge Advanced Alloys', duration: 12, powerCost: 50, input: { alloys: 2, fuel: 1, components: 1 }, output: { advancedAlloys: 1 }, unlocked: false },
    fabricateProcessors: { id: 'fabricateProcessors', name: 'Fabricate Processors', duration: 15, powerCost: 60, input: { electronics: 3, components: 2 }, output: { processors: 1 }, unlocked: false },
    assembleEnergyCells: { id: 'assembleEnergyCells', name: 'Assemble Energy Cells', duration: 10, powerCost: 45, input: { fuel: 2, electronics: 1, alloys: 1 }, output: { energyCells: 1 }, unlocked: false },
    synthesizeNanoMaterials: { id: 'synthesizeNanoMaterials', name: 'Synthesize Nano Materials', duration: 20, powerCost: 80, input: { advancedAlloys: 1, processors: 1, energyCells: 1 }, output: { nanoMaterials: 1 }, unlocked: false },
    
    // Tier 6: Rare Material Gathering
    mineTitanium: { id: 'mineTitanium', name: 'Mine Titanium Ore', duration: 8, powerCost: 35, input: {}, output: { titaniumOre: 1 }, unlocked: false },
    mineCopper: { id: 'mineCopper', name: 'Mine Copper Ore', duration: 6, powerCost: 25, input: {}, output: { copperOre: 1 }, unlocked: false },
    mineSilicon: { id: 'mineSilicon', name: 'Mine Silicon Ore', duration: 7, powerCost: 30, input: {}, output: { siliconOre: 1 }, unlocked: false },
    
    // Tier 6: Rare Material Processing
    forgeTitaniumAlloy: { id: 'forgeTitaniumAlloy', name: 'Forge Titanium Alloy', duration: 15, powerCost: 70, input: { titaniumOre: 2, steel: 2, fuel: 1 }, output: { titaniumAlloy: 1 }, unlocked: false },
    produceCopperWire: { id: 'produceCopperWire', name: 'Produce Copper Wire', duration: 8, powerCost: 40, input: { copperOre: 2, electronics: 1 }, output: { copperWire: 1 }, unlocked: false },
    fabricateSiliconWafers: { id: 'fabricateSiliconWafers', name: 'Fabricate Silicon Wafers', duration: 12, powerCost: 55, input: { siliconOre: 3, components: 1 }, output: { siliconWafers: 1 }, unlocked: false },
    assembleCircuits: { id: 'assembleCircuits', name: 'Assemble Circuits', duration: 10, powerCost: 50, input: { copperWire: 2, siliconWafers: 1, electronics: 1 }, output: { circuits: 1 }, unlocked: false },
    produceBatteries: { id: 'produceBatteries', name: 'Produce Batteries', duration: 12, powerCost: 60, input: { copperWire: 1, plasticPolymers: 2, chemicalFuel: 1 }, output: { batteries: 1 }, unlocked: false },
    synthesizePlastics: { id: 'synthesizePlastics', name: 'Synthesize Plastics', duration: 9, powerCost: 45, input: { carbon: 3, fuel: 2 }, output: { plasticPolymers: 1 }, unlocked: false },
    refineChemicalFuel: { id: 'refineChemicalFuel', name: 'Refine Chemical Fuel', duration: 11, powerCost: 55, input: { fuel: 3, carbon: 2 }, output: { chemicalFuel: 1 }, unlocked: false },
    
    // Tier 7: Advanced Materials
    fabricateAdvancedCircuits: { id: 'fabricateAdvancedCircuits', name: 'Fabricate Advanced Circuits', duration: 18, powerCost: 90, input: { circuits: 3, processors: 1, siliconWafers: 2 }, output: { advancedCircuits: 1 }, unlocked: false },
    synthesizeNanotubes: { id: 'synthesizeNanotubes', name: 'Synthesize Nanotubes', duration: 20, powerCost: 100, input: { carbon: 5, nanoMaterials: 2, energyCells: 1 }, output: { nanotubes: 1 }, unlocked: false },
    produceCeramicComposites: { id: 'produceCeramicComposites', name: 'Produce Ceramic Composites', duration: 16, powerCost: 85, input: { titaniumAlloy: 2, advancedAlloys: 2, plasticPolymers: 1 }, output: { ceramicComposites: 1 }, unlocked: false },
    fabricateSuperconductors: { id: 'fabricateSuperconductors', name: 'Fabricate Superconductors', duration: 22, powerCost: 110, input: { copperWire: 4, nanotubes: 1, energyCells: 2 }, output: { superconductors: 1 }, unlocked: false },
    assembleQuantumProcessors: { id: 'assembleQuantumProcessors', name: 'Assemble Quantum Processors', duration: 25, powerCost: 120, input: { advancedCircuits: 2, superconductors: 1, nanoMaterials: 2 }, output: { quantumProcessors: 1 }, unlocked: false },
    constructFusionCells: { id: 'constructFusionCells', name: 'Construct Fusion Cells', duration: 30, powerCost: 150, input: { titaniumAlloy: 3, superconductors: 2, energyCells: 3, chemicalFuel: 2 }, output: { fusionCells: 1 }, unlocked: false },
    
    // Tier 8: Exotic Materials
    buildAntimatterContainers: { id: 'buildAntimatterContainers', name: 'Build Antimatter Containers', duration: 35, powerCost: 180, input: { fusionCells: 2, quantumProcessors: 2, ceramicComposites: 3 }, output: { antimatterContainers: 1 }, unlocked: false },
    assembleDarkMatterDetectors: { id: 'assembleDarkMatterDetectors', name: 'Assemble Dark Matter Detectors', duration: 40, powerCost: 200, input: { quantumProcessors: 3, superconductors: 3, advancedCircuits: 2 }, output: { darkMatterDetectors: 1 }, unlocked: false },
    fabricateGravitonEmitters: { id: 'fabricateGravitonEmitters', name: 'Fabricate Graviton Emitters', duration: 38, powerCost: 190, input: { fusionCells: 2, nanotubes: 3, quantumProcessors: 2 }, output: { gravitonEmitters: 1 }, unlocked: false },
    constructTemporalStabilizers: { id: 'constructTemporalStabilizers', name: 'Construct Temporal Stabilizers', duration: 45, powerCost: 220, input: { quantumProcessors: 4, superconductors: 3, fusionCells: 2 }, output: { temporalStabilizers: 1 }, unlocked: false },
    assembleNeuralInterfaces: { id: 'assembleNeuralInterfaces', name: 'Assemble Neural Interfaces', duration: 42, powerCost: 210, input: { quantumProcessors: 3, advancedCircuits: 4, nanotubes: 2 }, output: { neuralInterfaces: 1 }, unlocked: false },
    buildQuantumEntanglers: { id: 'buildQuantumEntanglers', name: 'Build Quantum Entanglers', duration: 50, powerCost: 240, input: { quantumProcessors: 5, superconductors: 4, darkMatterDetectors: 1 }, output: { quantumEntanglers: 1 }, unlocked: false },
    constructPlasmaCores: { id: 'constructPlasmaCores', name: 'Construct Plasma Cores', duration: 48, powerCost: 230, input: { fusionCells: 4, ceramicComposites: 3, titaniumAlloy: 4 }, output: { plasmaCores: 1 }, unlocked: false },
    buildSingularityContainers: { id: 'buildSingularityContainers', name: 'Build Singularity Containers', duration: 55, powerCost: 260, input: { antimatterContainers: 2, gravitonEmitters: 2, temporalStabilizers: 1 }, output: { singularityContainers: 1 }, unlocked: false },
    synthesizeExoticMatter: { id: 'synthesizeExoticMatter', name: 'Synthesize Exotic Matter', duration: 60, powerCost: 300, input: { antimatterContainers: 2, darkMatterDetectors: 2, quantumEntanglers: 1 }, output: { exoticMatter: 1 }, unlocked: false },
    
    // Tier 9: Megastructure Components
    fabricateDysonComponents: { id: 'fabricateDysonComponents', name: 'Fabricate Dyson Components', duration: 70, powerCost: 350, input: { titaniumAlloy: 10, fusionCells: 5, quantumProcessors: 3, plasmaCores: 2 }, output: { dysonComponents: 1 }, unlocked: false },
    constructRingworldSections: { id: 'constructRingworldSections', name: 'Construct Ringworld Sections', duration: 75, powerCost: 380, input: { ceramicComposites: 8, nanotubes: 6, gravitonEmitters: 3, exoticMatter: 1 }, output: { ringworldSections: 1 }, unlocked: false },
    buildOrbitalHabitats: { id: 'buildOrbitalHabitats', name: 'Build Orbital Habitats', duration: 65, powerCost: 320, input: { titaniumAlloy: 8, advancedCircuits: 6, fusionCells: 4, neuralInterfaces: 2 }, output: { orbitalHabitats: 1 }, unlocked: false },
    assemblePlanetaryEngines: { id: 'assemblePlanetaryEngines', name: 'Assemble Planetary Engines', duration: 80, powerCost: 400, input: { plasmaCores: 4, gravitonEmitters: 4, fusionCells: 6, quantumProcessors: 4 }, output: { planetaryEngines: 1 }, unlocked: false },
    constructStellarForges: { id: 'constructStellarForges', name: 'Construct Stellar Forges', duration: 85, powerCost: 420, input: { fusionCells: 8, plasmaCores: 5, ceramicComposites: 6, exoticMatter: 2 }, output: { stellarForges: 1 }, unlocked: false },
    buildWarpGates: { id: 'buildWarpGates', name: 'Build Warp Gates', duration: 90, powerCost: 450, input: { quantumEntanglers: 3, gravitonEmitters: 5, exoticMatter: 3, temporalStabilizers: 2 }, output: { warpGates: 1 }, unlocked: false },
    assembleMatrioshkaBrains: { id: 'assembleMatrioshkaBrains', name: 'Assemble Matrioshka Brains', duration: 95, powerCost: 480, input: { quantumProcessors: 10, neuralInterfaces: 6, superconductors: 8, fusionCells: 6 }, output: { matrioshkaBrains: 1 }, unlocked: false },
    constructTerraformingArrays: { id: 'constructTerraformingArrays', name: 'Construct Terraforming Arrays', duration: 88, powerCost: 440, input: { orbitalHabitats: 2, plasmaCores: 4, gravitonEmitters: 4, nanotubes: 8 }, output: { terraformingArrays: 1 }, unlocked: false },
    
    // Tier 10: Ultimate Systems
    buildColonyShips: { id: 'buildColonyShips', name: 'Build Colony Ships', duration: 120, powerCost: 600, input: { orbitalHabitats: 3, warpGates: 2, fusionCells: 10, neuralInterfaces: 5 }, output: { colonyShips: 1 }, unlocked: false },
    constructDysonSphere: { id: 'constructDysonSphere', name: 'Construct Dyson Sphere', duration: 150, powerCost: 800, input: { dysonComponents: 10, stellarForges: 5, plasmaCores: 8, exoticMatter: 5 }, output: { dysonSphere: 1 }, unlocked: false },
    buildRingworld: { id: 'buildRingworld', name: 'Build Ringworld', duration: 140, powerCost: 750, input: { ringworldSections: 10, planetaryEngines: 4, gravitonEmitters: 10, exoticMatter: 6 }, output: { ringworld: 1 }, unlocked: false },
    developAI: { id: 'developAI', name: 'Develop Artificial Intelligence', duration: 130, powerCost: 700, input: { matrioshkaBrains: 5, quantumProcessors: 15, neuralInterfaces: 10, exoticMatter: 4 }, output: { artificialIntelligence: 1 }, unlocked: false },
    achieveTranscendence: { id: 'achieveTranscendence', name: 'Achieve Transcendence', duration: 200, powerCost: 1000, input: { dysonSphere: 1, ringworld: 1, artificialIntelligence: 2, singularityContainers: 5, exoticMatter: 10 }, output: { transcendence: 1 }, unlocked: false },
    
    // Combat: Weapons
    buildLaserTurrets: { id: 'buildLaserTurrets', name: 'Build Laser Turrets', duration: 15, powerCost: 50, input: { steel: 10, electronics: 5, energyCells: 2 }, output: { laserTurrets: 1 }, unlocked: false },
    buildMissileLaunchers: { id: 'buildMissileLaunchers', name: 'Build Missile Launchers', duration: 20, powerCost: 60, input: { steel: 15, components: 8, fuel: 5 }, output: { missileLaunchers: 1 }, unlocked: false },
    buildRailguns: { id: 'buildRailguns', name: 'Build Railguns', duration: 25, powerCost: 80, input: { titaniumAlloy: 10, superconductors: 5, energyCells: 8 }, output: { railguns: 1 }, unlocked: false },
    buildPlasmaCannons: { id: 'buildPlasmaCannons', name: 'Build Plasma Cannons', duration: 35, powerCost: 120, input: { plasmaCores: 3, advancedCircuits: 10, fusionCells: 5 }, output: { plasmaCannons: 1 }, unlocked: false },
    
    // Combat: Defense
    buildShieldGenerators: { id: 'buildShieldGenerators', name: 'Build Shield Generators', duration: 30, powerCost: 100, input: { energyCells: 10, superconductors: 8, quantumProcessors: 3 }, output: { shieldGenerators: 1 }, unlocked: false },
    buildArmorPlates: { id: 'buildArmorPlates', name: 'Build Armor Plates', duration: 18, powerCost: 55, input: { titaniumAlloy: 15, ceramicComposites: 8, advancedAlloys: 5 }, output: { armorPlates: 1 }, unlocked: false },
    buildPointDefense: { id: 'buildPointDefense', name: 'Build Point Defense', duration: 22, powerCost: 70, input: { circuits: 12, processors: 6, components: 10 }, output: { pointDefense: 1 }, unlocked: false }
};

const Modules = {
    // Tier 2 Modules
    iceProcessor: { id: 'iceProcessor', name: 'Ice Processor', icon: '🧊', description: 'Process ice into water', cost: { steel: 10 }, unlocks: ['processWater'] },
    smelter: { id: 'smelter', name: 'Smelter', icon: '🔥', description: 'Smelt iron ore and carbon into steel', cost: { steel: 15, ironOre: 5 }, unlocks: ['smeltSteel'] },
    
    // Tier 3 Modules
    electronicsLab: { id: 'electronicsLab', name: 'Electronics Lab', icon: '🔌', description: 'Craft electronics from steel and carbon', cost: { steel: 20, carbon: 10 }, unlocks: ['craftElectronics'] },
    refinery: { id: 'refinery', name: 'Refinery', icon: '⛽', description: 'Refine carbon and water into fuel', cost: { steel: 25, water: 15 }, unlocks: ['refineFuel'] },
    forgery: { id: 'forgery', name: 'Forgery', icon: '🔗', description: 'Forge steel and iron ore into alloys', cost: { steel: 30, ironOre: 20 }, unlocks: ['forgeAlloys'] },
    
    // Tier 4 Modules
    assemblyPlant: { id: 'assemblyPlant', name: 'Assembly Plant', icon: '⚙️', description: 'Assemble electronics and alloys into components', cost: { steel: 40, electronics: 20, alloys: 10 }, unlocks: ['assembleComponents'] },
    hydroponics: { id: 'hydroponics', name: 'Hydroponics Bay', icon: '🍎', description: 'Grow food from water and carbon', cost: { steel: 30, water: 20 }, unlocks: ['growFood'] },
    oxygenGenerator: { id: 'oxygenGenerator', name: 'Oxygen Generator', icon: '💨', description: 'Generate oxygen from water', cost: { steel: 35, electronics: 15 }, unlocks: ['generateOxygen'] },
    habitationModule: { id: 'habitationModule', name: 'Habitation Module', icon: '🏠', description: 'House crew members (+2 crew capacity)', cost: { steel: 50, components: 10, food: 20, water: 30 }, crew: 2 },
    
    // Tier 5 Modules
    advancedForgery: { id: 'advancedForgery', name: 'Advanced Forgery', icon: '💎', description: 'Forge advanced alloys from high-tier materials', cost: { steel: 50, alloys: 30, components: 20 }, unlocks: ['forgeAdvancedAlloys'] },
    fabricationLab: { id: 'fabricationLab', name: 'Fabrication Lab', icon: '🖥️', description: 'Fabricate advanced processors', cost: { steel: 60, electronics: 40, components: 25 }, unlocks: ['fabricateProcessors'] },
    energyLab: { id: 'energyLab', name: 'Energy Lab', icon: '🔋', description: 'Assemble high-capacity energy cells', cost: { steel: 55, fuel: 30, electronics: 20 }, unlocks: ['assembleEnergyCells'] },
    nanoFabricator: { id: 'nanoFabricator', name: 'Nano Fabricator', icon: '✨', description: 'Synthesize cutting-edge nano materials', cost: { steel: 100, advancedAlloys: 20, processors: 15, energyCells: 10 }, unlocks: ['synthesizeNanoMaterials'] },
    
    // Tier 6 Modules - Mining Operations
    deepMiningRig: { id: 'deepMiningRig', name: 'Deep Mining Rig', icon: '⛏️', description: 'Access rare ore deposits', cost: { steel: 80, components: 30, alloys: 40 }, unlocks: ['mineTitanium', 'mineCopper', 'mineSilicon'] },
    
    // Tier 6 Modules - Processing
    advancedSmelter: { id: 'advancedSmelter', name: 'Advanced Smelter', icon: '🛡️', description: 'Process titanium and rare alloys', cost: { steel: 100, components: 40, fuel: 50 }, unlocks: ['forgeTitaniumAlloy'] },
    wireFactory: { id: 'wireFactory', name: 'Wire Factory', icon: '🔌', description: 'Produce copper wire for circuits', cost: { steel: 70, electronics: 30, components: 20 }, unlocks: ['produceCopperWire'] },
    waferFab: { id: 'waferFab', name: 'Wafer Fabrication Plant', icon: '💿', description: 'Fabricate silicon wafers', cost: { steel: 90, electronics: 50, components: 30 }, unlocks: ['fabricateSiliconWafers'] },
    circuitAssembly: { id: 'circuitAssembly', name: 'Circuit Assembly', icon: '🔌', description: 'Assemble advanced circuits', cost: { steel: 85, electronics: 45, components: 35 }, unlocks: ['assembleCircuits'] },
    chemicalPlant: { id: 'chemicalPlant', name: 'Chemical Plant', icon: '🧪', description: 'Synthesize plastics and chemical fuel', cost: { steel: 75, fuel: 40, components: 25 }, unlocks: ['synthesizePlastics', 'refineChemicalFuel'] },
    batteryFactory: { id: 'batteryFactory', name: 'Battery Factory', icon: '🔋', description: 'Mass produce batteries', cost: { steel: 95, electronics: 40, components: 30 }, unlocks: ['produceBatteries'] },
    
    // Tier 7 Modules - Advanced Tech
    quantumLab: { id: 'quantumLab', name: 'Quantum Laboratory', icon: '💠', description: 'Research quantum technologies', cost: { steel: 150, processors: 50, advancedAlloys: 60, energyCells: 40 }, unlocks: ['fabricateAdvancedCircuits', 'assembleQuantumProcessors'] },
    nanoForge: { id: 'nanoForge', name: 'Nano Forge', icon: '🧬', description: 'Synthesize carbon nanotubes', cost: { steel: 140, nanoMaterials: 30, processors: 40, energyCells: 35 }, unlocks: ['synthesizeNanotubes'] },
    compositeLab: { id: 'compositeLab', name: 'Composite Laboratory', icon: '🏺', description: 'Produce ceramic composites', cost: { steel: 130, advancedAlloys: 50, components: 45 }, unlocks: ['produceCeramicComposites'] },
    superconductorFab: { id: 'superconductorFab', name: 'Superconductor Fabricator', icon: '🌀', description: 'Fabricate superconducting materials', cost: { steel: 160, processors: 55, energyCells: 50, nanoMaterials: 35 }, unlocks: ['fabricateSuperconductors'] },
    fusionReactor: { id: 'fusionReactor', name: 'Fusion Reactor', icon: '☀️', description: 'Construct fusion power cells', cost: { steel: 200, titaniumAlloy: 80, superconductors: 40, quantumProcessors: 30 }, unlocks: ['constructFusionCells'] },
    
    // Tier 8 Modules - Exotic Tech
    antimatterLab: { id: 'antimatterLab', name: 'Antimatter Laboratory', icon: '⚛️', description: 'Research antimatter containment', cost: { fusionCells: 20, quantumProcessors: 40, ceramicComposites: 50 }, unlocks: ['buildAntimatterContainers', 'assembleDarkMatterDetectors'] },
    gravitonResearch: { id: 'gravitonResearch', name: 'Graviton Research Facility', icon: '🌊', description: 'Study gravitational manipulation', cost: { fusionCells: 25, quantumProcessors: 35, nanotubes: 40 }, unlocks: ['fabricateGravitonEmitters'] },
    temporalLab: { id: 'temporalLab', name: 'Temporal Laboratory', icon: '⏱️', description: 'Research time manipulation', cost: { quantumProcessors: 50, superconductors: 45, fusionCells: 30 }, unlocks: ['constructTemporalStabilizers'] },
    neuralResearch: { id: 'neuralResearch', name: 'Neural Research Center', icon: '🧠', description: 'Develop neural interface technology', cost: { quantumProcessors: 45, advancedCircuits: 60, nanotubes: 35 }, unlocks: ['assembleNeuralInterfaces'] },
    quantumEntanglementLab: { id: 'quantumEntanglementLab', name: 'Quantum Entanglement Lab', icon: '🔗', description: 'Master quantum entanglement', cost: { quantumProcessors: 60, superconductors: 55, darkMatterDetectors: 20 }, unlocks: ['buildQuantumEntanglers'] },
    plasmaForge: { id: 'plasmaForge', name: 'Plasma Forge', icon: '🔥', description: 'Forge plasma containment cores', cost: { fusionCells: 50, ceramicComposites: 45, titaniumAlloy: 60 }, unlocks: ['constructPlasmaCores'] },
    singularityLab: { id: 'singularityLab', name: 'Singularity Laboratory', icon: '⚫', description: 'Study singularity containment', cost: { antimatterContainers: 30, gravitonEmitters: 35, temporalStabilizers: 25 }, unlocks: ['buildSingularityContainers'] },
    exoticMatterSynthesizer: { id: 'exoticMatterSynthesizer', name: 'Exotic Matter Synthesizer', icon: '✨', description: 'Synthesize exotic matter', cost: { antimatterContainers: 35, darkMatterDetectors: 40, quantumEntanglers: 25 }, unlocks: ['synthesizeExoticMatter'] },
    
    // Tier 9 Modules - Megastructures
    dysonConstruction: { id: 'dysonConstruction', name: 'Dyson Construction Bay', icon: '🌞', description: 'Build Dyson sphere components', cost: { titaniumAlloy: 150, fusionCells: 80, quantumProcessors: 60, plasmaCores: 40 }, unlocks: ['fabricateDysonComponents'] },
    ringworldEngineering: { id: 'ringworldEngineering', name: 'Ringworld Engineering', icon: '⭕', description: 'Construct ringworld sections', cost: { ceramicComposites: 120, nanotubes: 100, gravitonEmitters: 60, exoticMatter: 30 }, unlocks: ['constructRingworldSections'] },
    orbitalConstruction: { id: 'orbitalConstruction', name: 'Orbital Construction Yard', icon: '🛸', description: 'Build orbital habitats', cost: { titaniumAlloy: 130, advancedCircuits: 90, fusionCells: 70, neuralInterfaces: 40 }, unlocks: ['buildOrbitalHabitats'] },
    planetaryEngineering: { id: 'planetaryEngineering', name: 'Planetary Engineering', icon: '🚀', description: 'Construct planetary engines', cost: { plasmaCores: 60, gravitonEmitters: 70, fusionCells: 90, quantumProcessors: 65 }, unlocks: ['assemblePlanetaryEngines'] },
    stellarEngineering: { id: 'stellarEngineering', name: 'Stellar Engineering', icon: '🔨', description: 'Build stellar forges', cost: { fusionCells: 120, plasmaCores: 80, ceramicComposites: 100, exoticMatter: 50 }, unlocks: ['constructStellarForges'] },
    warpTechnology: { id: 'warpTechnology', name: 'Warp Technology Center', icon: '🌀', description: 'Develop warp gate technology', cost: { quantumEntanglers: 50, gravitonEmitters: 80, exoticMatter: 60, temporalStabilizers: 45 }, unlocks: ['buildWarpGates'] },
    matrioshkaEngineering: { id: 'matrioshkaEngineering', name: 'Matrioshka Engineering', icon: '🧩', description: 'Build matrioshka brain nodes', cost: { quantumProcessors: 150, neuralInterfaces: 100, superconductors: 120, fusionCells: 90 }, unlocks: ['assembleMatrioshkaBrains'] },
    terraformingCenter: { id: 'terraformingCenter', name: 'Terraforming Center', icon: '🌍', description: 'Develop terraforming arrays', cost: { orbitalHabitats: 30, plasmaCores: 70, gravitonEmitters: 75, nanotubes: 110 }, unlocks: ['constructTerraformingArrays'] },
    
    // Tier 10 Modules - Ultimate Tech
    colonyShipyard: { id: 'colonyShipyard', name: 'Colony Shipyard', icon: '🚢', description: 'Build interstellar colony ships', cost: { orbitalHabitats: 50, warpGates: 35, fusionCells: 150, neuralInterfaces: 80 }, unlocks: ['buildColonyShips'] },
    dysonSphereCommand: { id: 'dysonSphereCommand', name: 'Dyson Sphere Command', icon: '☀️', description: 'Coordinate Dyson sphere construction', cost: { dysonComponents: 150, stellarForges: 80, plasmaCores: 120, exoticMatter: 100 }, unlocks: ['constructDysonSphere'] },
    ringworldCommand: { id: 'ringworldCommand', name: 'Ringworld Command', icon: '💍', description: 'Coordinate ringworld construction', cost: { ringworldSections: 150, planetaryEngines: 70, gravitonEmitters: 150, exoticMatter: 120 }, unlocks: ['buildRingworld'] },
    aiResearchCenter: { id: 'aiResearchCenter', name: 'AI Research Center', icon: '🤖', description: 'Develop artificial intelligence', cost: { matrioshkaBrains: 80, quantumProcessors: 200, neuralInterfaces: 150, exoticMatter: 90 }, unlocks: ['developAI'] },
    transcendenceHub: { id: 'transcendenceHub', name: 'Transcendence Hub', icon: '🌟', description: 'Achieve technological transcendence', cost: { dysonSphere: 5, ringworld: 5, artificialIntelligence: 10, singularityContainers: 100, exoticMatter: 200 }, unlocks: ['achieveTranscendence'] },
    
    // Combat Modules
    weaponsFactory: { id: 'weaponsFactory', name: 'Weapons Factory', icon: '🔫', description: 'Manufacture basic weapons', cost: { steel: 100, electronics: 50, components: 30 }, unlocks: ['buildLaserTurrets', 'buildMissileLaunchers'] },
    advancedWeaponry: { id: 'advancedWeaponry', name: 'Advanced Weaponry', icon: '⚡', description: 'Develop advanced weapon systems', cost: { titaniumAlloy: 80, superconductors: 40, energyCells: 60 }, unlocks: ['buildRailguns'] },
    exoticWeapons: { id: 'exoticWeapons', name: 'Exotic Weapons Lab', icon: '💥', description: 'Create plasma-based weapons', cost: { plasmaCores: 20, advancedCircuits: 50, fusionCells: 30 }, unlocks: ['buildPlasmaCannons'] },
    defenseGrid: { id: 'defenseGrid', name: 'Defense Grid', icon: '🛡️', description: 'Build defensive systems', cost: { steel: 120, energyCells: 40, components: 50 }, unlocks: ['buildShieldGenerators', 'buildArmorPlates', 'buildPointDefense'] }
};

// Categorization helpers
const RecipeCategories = {
    gathering: ['gatherIce', 'mineIron', 'gatherCarbon', 'mineTitanium', 'mineCopper', 'mineSilicon'],
    basic: ['processWater', 'smeltSteel', 'craftElectronics', 'refineFuel', 'forgeAlloys', 'assembleComponents', 'growFood', 'generateOxygen'],
    advanced: ['forgeAdvancedAlloys', 'fabricateProcessors', 'assembleEnergyCells', 'synthesizeNanoMaterials', 
               'forgeTitaniumAlloy', 'produceCopperWire', 'fabricateSiliconWafers', 'assembleCircuits', 'produceBatteries', 
               'synthesizePlastics', 'refineChemicalFuel', 'fabricateAdvancedCircuits', 'synthesizeNanotubes', 
               'produceCeramicComposites', 'fabricateSuperconductors', 'assembleQuantumProcessors', 'constructFusionCells'],
    exotic: ['buildAntimatterContainers', 'assembleDarkMatterDetectors', 'fabricateGravitonEmitters', 'constructTemporalStabilizers',
             'assembleNeuralInterfaces', 'buildQuantumEntanglers', 'constructPlasmaCores', 'buildSingularityContainers', 'synthesizeExoticMatter'],
    mega: ['fabricateDysonComponents', 'constructRingworldSections', 'buildOrbitalHabitats', 'assemblePlanetaryEngines',
           'constructStellarForges', 'buildWarpGates', 'assembleMatrioshkaBrains', 'constructTerraformingArrays'],
    ultimate: ['buildColonyShips', 'constructDysonSphere', 'buildRingworld', 'developAI', 'achieveTranscendence'],
    combat: ['buildLaserTurrets', 'buildMissileLaunchers', 'buildRailguns', 'buildPlasmaCannons', 
             'buildShieldGenerators', 'buildArmorPlates', 'buildPointDefense']
};

const ResourceCategories = {
    basic: ['ice', 'ironOre', 'carbon', 'water', 'steel', 'electronics', 'fuel', 'alloys', 'components', 'food', 'oxygen'],
    advanced: ['advancedAlloys', 'processors', 'energyCells', 'nanoMaterials', 'titaniumOre', 'copperOre', 'siliconOre',
               'titaniumAlloy', 'copperWire', 'siliconWafers', 'circuits', 'batteries', 'plasticPolymers', 'chemicalFuel',
               'advancedCircuits', 'nanotubes', 'ceramicComposites', 'superconductors', 'quantumProcessors', 'fusionCells'],
    exotic: ['antimatterContainers', 'darkMatterDetectors', 'gravitonEmitters', 'temporalStabilizers', 'neuralInterfaces',
             'quantumEntanglers', 'plasmaCores', 'singularityContainers', 'exoticMatter'],
    mega: ['dysonComponents', 'ringworldSections', 'orbitalHabitats', 'planetaryEngines', 'stellarForges', 
           'warpGates', 'matrioshkaBrains', 'terraformingArrays', 'colonyShips', 'dysonSphere', 'ringworld', 
           'artificialIntelligence', 'transcendence'],
    combat: ['laserTurrets', 'missileLaunchers', 'railguns', 'plasmaCannons', 
             'shieldGenerators', 'armorPlates', 'pointDefense']
};

const ModuleCategories = {
    basic: ['iceProcessor', 'smelter', 'electronicsLab', 'refinery', 'forgery', 'assemblyPlant', 'hydroponics', 'oxygenGenerator'],
    advanced: ['advancedForgery', 'fabricationLab', 'energyLab', 'nanoFabricator', 'deepMiningRig', 'advancedSmelter',
               'wireFactory', 'waferFab', 'circuitAssembly', 'chemicalPlant', 'batteryFactory', 'quantumLab', 'nanoForge',
               'compositeLab', 'superconductorFab', 'fusionReactor'],
    exotic: ['antimatterLab', 'gravitonResearch', 'temporalLab', 'neuralResearch', 'quantumEntanglementLab', 
             'plasmaForge', 'singularityLab', 'exoticMatterSynthesizer'],
    mega: ['dysonConstruction', 'ringworldEngineering', 'orbitalConstruction', 'planetaryEngineering', 'stellarEngineering',
           'warpTechnology', 'matrioshkaEngineering', 'terraformingCenter', 'colonyShipyard', 'dysonSphereCommand',
           'ringworldCommand', 'aiResearchCenter', 'transcendenceHub'],
    combat: ['weaponsFactory', 'advancedWeaponry', 'exoticWeapons', 'defenseGrid']
};

let currentProductionFilter = 'all';
let currentInventoryFilter = 'all';
let currentStationFilter = 'all';

function filterProduction(category) {
    currentProductionFilter = category;
    renderProduction();
}

function filterInventory(category) {
    currentInventoryFilter = category;
    renderInventory();
}

function filterStation(category) {
    currentStationFilter = category;
    renderStation();
}
function gameLoop() {
    const now = Date.now();
    const delta = (now - Game.lastUpdate) / 1000;
    Game.lastUpdate = now;

    // Generate power
    Game.resources.power = Math.min(Game.resources.power + 10 * delta, Game.resources.maxPower);

    // Update crew system
    if (typeof CrewSystem !== 'undefined') {
        CrewSystem.update(delta);
        // Update crew progress bars if on crew tab
        if (typeof CrewUI !== 'undefined' && document.getElementById('crew').classList.contains('active')) {
            CrewUI.updateCrewProgress();
        }
    }

    // Update combat system
    if (typeof CombatSystem !== 'undefined') {
        CombatSystem.update(delta);
        // Update combat display (HP bars only, not full re-render)
        if (CombatSystem.inCombat && document.getElementById('combat').classList.contains('active')) {
            CombatUI.updateCombatDisplay();
        }
    }

    // Update production
    if (Game.production.active) {
        const recipe = Recipes[Game.production.active];
        if (canProduce(recipe)) {
            Game.production.progress += delta;
            if (Game.production.progress >= recipe.duration) {
                completeProduction(recipe);
                Game.production.progress = 0;
            }
        }
    }

    updateUI();
}

function canProduce(recipe) {
    if (Game.resources.power < recipe.powerCost) return false;
    for (const [res, amt] of Object.entries(recipe.input)) {
        if (Game.resources[res] < amt) return false;
    }
    return true;
}

function completeProduction(recipe) {
    Log.game(`Completing production: ${recipe.name}`);
    for (const [res, amt] of Object.entries(recipe.input)) {
        Game.resources[res] -= amt;
        Log.info(`Consumed ${amt} ${res}`);
    }
    Game.resources.power -= recipe.powerCost;
    Log.info(`Consumed ${recipe.powerCost} power`);
    for (const [res, amt] of Object.entries(recipe.output)) {
        Game.resources[res] += amt;
        Log.info(`Produced ${amt} ${res}`);
    }
}

function startProduction(recipeId) {
    Log.game(`Starting production: ${recipeId}`);
    Game.production.active = recipeId;
    Game.production.progress = 0;
    renderProduction();
    updateUI();
}

function stopProduction() {
    Log.game(`Stopping production: ${Game.production.active}`);
    Game.production.active = null;
    Game.production.progress = 0;
    updateUI();
}

function buildModule(moduleId) {
    const module = Modules[moduleId];
    Log.game(`Attempting to build module: ${moduleId}`);
    
    // Check costs
    for (const [res, amt] of Object.entries(module.cost)) {
        if (Game.resources[res] < amt) {
            Log.warn(`Insufficient ${res}: need ${amt}, have ${Game.resources[res]}`);
            return;
        }
    }
    
    // Deduct costs
    for (const [res, amt] of Object.entries(module.cost)) {
        Game.resources[res] -= amt;
        Log.info(`Spent ${amt} ${res}`);
    }
    
    // Build module
    Game.modules[moduleId] = true;
    Log.game(`Built module: ${module.name}`);
    
    // Unlock recipes
    if (module.unlocks) {
        module.unlocks.forEach(id => {
            Recipes[id].unlocked = true;
            Log.info(`Unlocked recipe: ${id}`);
        });
    }
    
    // Grant crew if habitation module
    if (module.crew && typeof CrewSystem !== 'undefined') {
        CrewSystem.addCrew(module.crew);
    }
    
    renderStation();
    renderProduction();
    updateUI();
}

// UI
function updateUI() {
    // Resources - Show only essential resources in top bar
    const essentialResources = ['power', 'ice', 'ironOre', 'carbon'];
    document.getElementById('resources').innerHTML = Object.entries(Game.resources)
        .filter(([k]) => essentialResources.includes(k))
        .map(([k, v]) => `<div class="resource"><span>${Resources[k].icon}</span><span class="resource-name">${Resources[k].name}:</span><span class="resource-amount">${Math.floor(v)}</span></div>`)
        .join('');

    // Main production
    const mainProd = document.getElementById('main-production');
    
    // Manual production
    if (!Game.production.active) {
        if (mainProd.dataset.state !== 'empty') {
            mainProd.innerHTML = '<h3>Manual Production</h3><p style="text-align:center;opacity:0.5;">No production active</p>';
            mainProd.dataset.state = 'empty';
        }
    } else {
        const recipe = Recipes[Game.production.active];
        const progress = Math.min(100, (Game.production.progress / recipe.duration) * 100);
        
        // Only rebuild if recipe changed
        if (mainProd.dataset.recipe !== recipe.id) {
            const output = Resources[Object.keys(recipe.output)[0]];
            mainProd.dataset.recipe = recipe.id;
            mainProd.dataset.state = 'active';
            mainProd.innerHTML = `
                <h3>Manual Production</h3>
                <div class="card">
                    <h3>${output.icon} ${recipe.name}</h3>
                    <p>⏱️ ${recipe.duration}s | ⚡ ${recipe.powerCost} power</p>
                    <div class="progress">
                        <div class="progress-fill"></div>
                        <span class="progress-text">0%</span>
                    </div>
                    <button class="btn" onclick="stopProduction()">Stop</button>
                </div>
            `;
        }
        
        // Always update progress
        const fill = mainProd.querySelector('.progress-fill');
        const text = mainProd.querySelector('.progress-text');
        if (fill) fill.style.width = progress + '%';
        if (text) text.textContent = Math.floor(progress) + '%';
    }
    
    // Crew automated production
    if (typeof Game.crew !== 'undefined' && Object.keys(Game.crew.assignments).length > 0) {
        let crewHtml = '<h3 style="margin-top: 20px;">Crew Automated Production</h3><div class="grid">';
        
        Object.keys(Game.crew.assignments).forEach(recipeId => {
            const recipe = Recipes[recipeId];
            const assignment = Game.crew.assignments[recipeId];
            const progress = Math.min(100, (assignment.progress / recipe.duration) * 100);
            const output = Resources[Object.keys(recipe.output)[0]];
            
            crewHtml += `
                <div class="card">
                    <h3>👤 ${output.icon} ${recipe.name}</h3>
                    <p>⏱️ ${recipe.duration}s | ⚡ ${recipe.powerCost} power</p>
                    <div class="progress">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                        <span class="progress-text">${Math.floor(progress)}%</span>
                    </div>
                </div>
            `;
        });
        
        crewHtml += '</div>';
        
        // Append or update crew section
        let crewSection = document.getElementById('crew-production-section');
        if (!crewSection) {
            crewSection = document.createElement('div');
            crewSection.id = 'crew-production-section';
            mainProd.parentElement.appendChild(crewSection);
        }
        crewSection.innerHTML = crewHtml;
    } else {
        // Remove crew section if no assignments
        const crewSection = document.getElementById('crew-production-section');
        if (crewSection) crewSection.remove();
    }
}

function renderProduction() {
    const grid = document.getElementById('production-grid');
    let recipes = Object.values(Recipes);
    
    // Apply filter
    if (currentProductionFilter !== 'all') {
        const categoryRecipes = RecipeCategories[currentProductionFilter];
        recipes = recipes.filter(r => categoryRecipes.includes(r.id));
    }
    
    grid.innerHTML = recipes.map(r => {
        const isActive = Game.production.active === r.id;
        const canProd = canProduce(r);
        const output = Resources[Object.keys(r.output)[0]];
        
        // Build input display
        const inputDisplay = Object.keys(r.input).length > 0 
            ? `<p><strong>Input:</strong> ${Object.entries(r.input).map(([res, amt]) => `${amt} ${Resources[res].name}`).join(', ')}</p>`
            : '';
        
        return `
            <div class="card ${!r.unlocked ? 'locked' : ''}">
                <h3>${output.icon} ${r.name}</h3>
                ${inputDisplay}
                <p><strong>Output:</strong> ${Object.entries(r.output).map(([res, amt]) => `${amt} ${Resources[res].name}`).join(', ')}</p>
                <p>⏱️ ${r.duration}s | ⚡ ${r.powerCost} power</p>
                ${r.unlocked ? `
                    <button class="btn ${isActive ? 'active' : ''}" onclick="startProduction('${r.id}')" ${!canProd && !isActive ? 'disabled' : ''}>
                        ${isActive ? '✓ Producing' : canProd ? 'Produce' : 'Insufficient Resources'}
                    </button>
                ` : '<button class="btn" disabled>🔒 Locked</button>'}
            </div>
        `;
    }).join('');
}

function renderStation() {
    const grid = document.getElementById('station-grid');
    let modules = Object.values(Modules);
    
    // Apply filter
    if (currentStationFilter !== 'all') {
        const categoryModules = ModuleCategories[currentStationFilter];
        modules = modules.filter(m => categoryModules.includes(m.id));
    }
    
    grid.innerHTML = modules.map(m => {
        const isBuilt = Game.modules[m.id];
        const canBuild = !isBuilt && Object.entries(m.cost).every(([res, amt]) => Game.resources[res] >= amt);
        return `
            <div class="card ${!canBuild && !isBuilt ? 'locked' : ''}">
                <h3>${m.icon} ${m.name}</h3>
                <p>${m.description}</p>
                <p><strong>Cost:</strong> ${Object.entries(m.cost).map(([res, amt]) => `${amt} ${Resources[res].name}`).join(', ')}</p>
                ${isBuilt ? '<button class="btn" disabled>✓ Built</button>' : 
                    `<button class="btn" onclick="buildModule('${m.id}')" ${!canBuild ? 'disabled' : ''}>Build</button>`}
            </div>
        `;
    }).join('');
}

function switchTab(tabName) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
    if (tabName === 'inventory') renderInventory();
    if (tabName === 'production') renderProduction();
    if (tabName === 'crew' && typeof CrewUI !== 'undefined') CrewUI.renderCrewTab();
    if (tabName === 'station') renderStation();
    if (tabName === 'ship' && typeof ShipUI !== 'undefined') ShipUI.renderShipTab();
    if (tabName === 'combat' && typeof CombatUI !== 'undefined') CombatUI.renderCombatTab();
}

function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    let resources = Object.entries(Game.resources).filter(([k]) => k !== 'maxPower');
    
    // Apply filter
    if (currentInventoryFilter !== 'all') {
        const categoryResources = ResourceCategories[currentInventoryFilter];
        resources = resources.filter(([k]) => categoryResources.includes(k));
    }
    
    grid.innerHTML = resources
        .map(([k, v]) => {
            const res = Resources[k];
            return `
                <div class="card">
                    <h3>${res.icon} ${res.name}</h3>
                    <p style="font-size: 2em; text-align: center; color: #0f0; margin: 20px 0;">${Math.floor(v)}</p>
                    <p style="text-align: center; opacity: 0.7;">Current Stock</p>
                </div>
            `;
        }).join('');
}

function saveGame() {
    try {
        localStorage.setItem('stationIdleV2', JSON.stringify(Game));
        Log.info('Game saved successfully');
        alert('Game saved!');
    } catch (e) {
        Log.error('Failed to save game', e);
        alert('Save failed!');
    }
}

function resetGame() {
    if (confirm('Reset game?')) {
        try {
            localStorage.removeItem('stationIdleV2');
            Log.info('Game reset - reloading');
            location.reload();
        } catch (e) {
            Log.error('Failed to reset game', e);
        }
    }
}

// Init
Log.info('=== Station Idle V2 Initializing ===');
const saved = localStorage.getItem('stationIdleV2');
if (saved) {
    try {
        Object.assign(Game, JSON.parse(saved));
        Log.info('Loaded saved game', Game);
    } catch (e) {
        Log.error('Failed to load saved game', e);
    }
} else {
    Log.info('Starting new game', Game);
}

renderInventory();
renderProduction();
renderStation();
setInterval(gameLoop, 100);
Log.info('Game loop started (100ms tick rate)');
