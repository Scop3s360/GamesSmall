# Station Idle V2 - Development Plan

## Current Status
✅ Core game loop working (100ms tick)
✅ Basic resource gathering (ice, iron ore, carbon)
✅ Water processing (ice → water)
✅ Steel smelting (iron ore + carbon → steel)
✅ Module building system
✅ Save/load system
✅ Console logging for debugging
✅ All 10 tiers of materials/parts production (51 resources, 60 recipes, 46 modules)
✅ Sidebar navigation with tabs (Dashboard, Inventory, Production, Crew, Station, Combat)
✅ Category filters for Inventory, Production, and Station tabs
✅ Crew system with automation (crew.js, crew-ui.js)
✅ Combat system implemented (combat.js, combat-ui.js, ship-renderer.js)
✅ Debug profiles for testing (crew test, combat test, production test)

---

## Phase 1: Material/Part Production ✅ COMPLETE

All 10 tiers implemented with full production chains:
- Tier 1-2: Basic gathering and processing (ice, iron, carbon, water, steel)
- Tier 3-4: Mid-tier materials (electronics, fuel, alloys, components, food, oxygen)
- Tier 5: High-tier (advanced alloys, processors, energy cells, nano materials)
- Tier 6-7: Rare and advanced materials (titanium, copper, silicon, circuits, batteries, superconductors, quantum processors)
- Tier 8: Exotic materials (antimatter, dark matter, graviton emitters, plasma cores, exotic matter)
- Tier 9: Megastructure components (dyson components, ringworld sections, orbital habitats)
- Tier 10: Ultimate systems (colony ships, dyson sphere, ringworld, AI, transcendence)

---

## Phase 2: Crew/Automation System ✅ COMPLETE

Implemented in separate modular files (crew.js, crew-ui.js):
- Crew assignment to recipes for automated production loops
- Crew resource consumption (2 water/hr, 1 food/hr, 5 power/hr)
- Habitation modules grant +2 crew capacity
- Crew tab in sidebar with management UI
- Integrated into game loop with minimal changes to game.js
- Self-contained system that can be edited without breaking existing production

---

## Phase 3: Combat System ✅ COMPLETE

Combat system implemented and tested:
- Ship loadout system with categorized slots (weapon/armor/shield)
- Hull types: Scout (1W/1A/0S), Fighter (2W/1A/1S), Corvette (3W/2A/1S), Destroyer (5W/2A/1S), Battleship (6W/2A/2S)
- Equipment: laser turrets, missiles, railguns, plasma cannons, shields, armor, point defense
- Damage variance (85-115%) for dynamic combat
- Zone-based enemy selection (4 zones, 3 enemies each)
- Pending rewards system - collect on retreat, lose on defeat
- Retreat button for safe exit with rewards
- Enemy respawn for continuous combat
- Defeat condition properly stops combat and resets ship
- Separate Ship tab for configuration, Combat tab for battles
- Optimized UI updates (only HP bars refresh, not entire page)

**Status:** Tested and working - ready for Phase 4

---

## Phase 4: Shop/Prestige System ❌ NOT STARTED

### Step 1: Currency System
- **New Resource:** `credits` (icon: 💰)
- **Earn:** Complete waves, reach milestones, sell resources
- **Purpose:** Purchase permanent upgrades

### Step 2: Shop Upgrades
- **Upgrade:** Production speed boost (%)
- **Upgrade:** Resource gathering boost (%)
- **Upgrade:** Power generation boost (%)
- **Upgrade:** Starting resources on reset
- **Cost:** Credits (increasing per tier)

### Step 3: Prestige/Reset System
- **Mechanic:** Reset game but keep shop upgrades
- **Reward:** Earn credits based on progress
- **Unlock:** New modules, recipes, or mechanics
- **UI:** Prestige button with preview of rewards

### Step 4: Achievements
- **Track:** Milestones (produce X resources, survive X waves)
- **Reward:** Credits, unlock special modules
- **Display:** Achievement list with progress bars

---

## Testing & Debug Tools ✅ COMPLETE

Debug profiles system implemented (debug-profiles.js):
- **Crew Test Profile:** Resources and modules for testing crew automation
- **Combat Test Profile:** Pre-built weapons/defense for testing combat system
- **Production Test Profile:** Mid-tier resources for testing production chains
- **Easy to disable:** Comment out script tag in index.html to remove debug menu

### How to Use Debug Profiles:
1. Open `index.html` in browser
2. Debug menu appears at top of Dashboard tab (red border)
3. Click "Load Profile" button for the system you want to test
4. Game state resets to that profile's starting conditions
5. Test the system functionality

### Testing Checklist - Crew System:
- [x] Load "Crew Test" profile
- [x] Verify crew capacity shows correctly (should be 6 from 3 habitation modules)
- [x] Assign crew to water production recipe
- [x] Verify water is being produced automatically
- [x] Assign crew to food production recipe
- [x] Verify food is being produced automatically
- [x] Check crew resource consumption (water, food, power draining)
- [x] Verify 3 crew on life support can sustain all 10 crew (math verified)
- [x] Test unassigning crew from recipes
- [x] Test save/load preserves crew assignments (uses general save system)

**Crew System: ✅ COMPLETE**

### Testing Checklist - Combat System:
- [x] Load "Combat Test" profile
- [x] Verify combat equipment appears in inventory
- [x] Go to Ship tab and configure ship
- [x] Select hull type (scout/fighter/corvette/destroyer/battleship)
- [x] Equip weapons to ship (respects weapon slot limits)
- [x] Equip defense to ship (respects armor/shield slot limits)
- [x] Verify ship stats update (HP, shield, damage, DPS)
- [x] Go to Combat tab and select zone/enemy
- [x] Start combat
- [x] Verify combat UI shows player ship vs enemy
- [x] Verify damage variance (85-115% each hit)
- [x] Verify shields absorb damage before hull
- [x] Verify point defense reduces incoming damage
- [x] Verify pending rewards accumulate
- [x] Test retreat button (collects pending rewards)
- [x] Test defeat (loses all pending rewards, resets ship)
- [x] Verify enemy respawns after victory
- [x] Verify UI only updates HP bars during combat (not entire page)
- [x] Test save/load preserves ship loadout

**Combat System: ✅ COMPLETE**

### Testing Checklist - Production Chains:
- [ ] Load "Production Test" profile
- [ ] Test basic chain: ice → water → oxygen
- [ ] Test mid-tier chain: steel + carbon → electronics
- [ ] Test advanced chain: electronics + alloys → components
- [ ] Verify all recipes consume/produce correct amounts
- [ ] Verify power consumption works correctly
- [ ] Test running multiple recipes simultaneously
- [ ] Verify progress bars animate smoothly
- [ ] Test stopping recipes mid-production
- [ ] Test save/load preserves active recipes and progress

---

## Next Immediate Steps

1. **Implement Phase 4** - Shop/prestige system (credits, upgrades, reset mechanics)
2. **Balance Tuning** - Adjust enemy HP/damage, resource costs, crew consumption rates if needed
3. **Polish** - Add more visual feedback, animations, sound effects (optional)

---

## Implementation Notes

### For Each Step:
1. Add new resources to `Resources` object (name, icon)
2. Add new recipes to `Recipes` object (inputs, outputs, duration, power, unlocked state)
3. Add new modules to `Modules` object (cost, description, unlocks array)
4. Update `Game.resources` initial state if needed
5. Test: Can build module → Recipe unlocks → Can produce → Resources update
6. Check console logs for errors
7. Test save/load preserves new data

### Testing Checklist:
- [ ] Module appears in Station tab
- [ ] Module costs display correctly
- [ ] Can build module when resources available
- [ ] Recipe unlocks after building module
- [ ] Recipe appears in Production tab
- [ ] Can start production when resources available
- [ ] Progress bar animates smoothly
- [ ] Resources consumed/produced correctly
- [ ] Console logs show all actions
- [ ] Save/load preserves state

---

## Next Immediate Step
**Test crew and combat systems using debug profiles, then implement Phase 4: Shop/Prestige**
