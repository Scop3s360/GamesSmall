# HORDE SPRINT

## High Concept
The game from those fake mobile ads - actually real! Auto-runner where you switch lanes to collect upgrades, avoid traps, and build your army before facing the boss. Simple, satisfying, honest.

## Core Gameplay Loop

### Moment-to-Moment
1. Character auto-runs forward through 3 lanes
2. Player switches lanes (left/right) to choose path
3. **Left Lane:** Collect soldiers to grow army (+1, +5, +10, multipliers)
4. **Middle Lane:** Troops automatically shoot enemies ahead
5. **Right Lane:** Collect weapon upgrades (rifle → machine gun → rockets)
6. Build army strength and firepower as you progress
7. Clear enemy waves and defeat boss at end
8. Win or lose, restart with meta-progression

### Session Structure
- **Run Duration:** 1-3 minutes
- **Stage-Based:** Multiple stages leading to boss
- **Lose Condition:** Health reaches zero
- **Win Condition:** Defeat the boss

## Core Mechanics

### Lane System
- **3 Lanes:** Left, Middle, Right
- **Auto-Run:** Character moves forward automatically
- **Lane Switching:** Instant switch between lanes (arrow keys or swipe)
- **Lane Functions:**
  - **Left Lane:** Troop collection (+soldiers, multipliers)
  - **Middle Lane:** Combat zone (enemies to shoot)
  - **Right Lane:** Weapon upgrades (rifle → machine gun → rocket launcher)

### Army Building & Combat
- **Starting State:** Small squad with basic rifles
- **Troop Collection (Left Lane):**
  - +1, +5, +10, +20 soldier pickups
  - x2, x3 multiplier gates
  - Visual: Army trail grows behind player
  
- **Active Shooting (Middle Lane):**
  - Troops automatically shoot forward at enemies
  - Damage = (troop count × weapon power)
  - Enemies have health bars
  - **Basic Enemies:** Low health, easy to clear
  - **Bullet Sponges:** High health, require sustained fire
  - **Boss Enemies:** Very high health, test your army strength
  - Lose soldiers if enemies reach you

- **Weapon Upgrades (Right Lane):**
  - **Rifle (Starting):** 1 damage per soldier
  - **Machine Gun:** 2 damage per soldier, faster fire rate
  - **Rocket Launcher:** 5 damage per soldier, splash damage
  - **Laser:** 3 damage per soldier, continuous beam
  - Upgrades apply to entire army

### Combat System
- **Automatic Shooting:** Troops fire continuously when enemies are in range
- **Enemy Types:**
  - **Grunts:** 10 HP, move slowly
  - **Tanks:** 50 HP, bullet sponges
  - **Swarms:** 5 HP each, come in groups
  - **Bosses:** 200+ HP, stage-end challenges
  
- **Damage Calculation:**
  - Base damage = troop count × weapon multiplier
  - Fire rate depends on weapon type
  - Enemies that reach player reduce troop count

- **Win/Lose:**
  - Clear all enemies in middle lane = progress
  - Lose all troops = game over
  - Defeat boss = stage complete

### Risk/Reward
- **Safe Path:** Small consistent upgrades (+1, +2)
- **Risky Path:** Big multipliers but might be traps
- **Gates:** "Need 50 soldiers to pass" - forces choices
- **Fake-outs:** What looks like x10 might be -10

## Visual Style
- **Simple & Clean:** Stick figures or basic character sprites
- **Bright Colors:** Clear visual distinction between lanes and pickups
- **Number Feedback:** Big floating numbers when collecting soldiers
- **Army Trail:** Visual representation of your growing army behind player
- **Shooting Effects:** Muzzle flashes, bullet trails, hit effects
- **Health Bars:** Clear enemy health indicators
- **Weapon Indicators:** Visual change when upgrading weapons
- **Satisfying Effects:** Particles, screen shake, impact juice

## Meta-Progression (Between Runs)
- **Currency:** Coins collected during runs
- **Permanent Upgrades:**
  - Start with more soldiers
  - Increased multiplier effectiveness
  - Better starting weapon
  - Extra lives/health
  - Unlock new characters (cosmetic)

- **Unlockables:**
  - New stages/themes
  - Different bosses
  - Character skins
  - Special abilities

## Technical Scope (HTML5/JavaScript)
- 2D side-scrolling view
- Simple sprite-based or shape-based graphics
- Touch/swipe controls for mobile
- Keyboard controls for desktop
- LocalStorage for progression saves
- Procedural or hand-crafted stages

## Unique Selling Points
1. **It's Actually Real:** The game from the ads, honestly made
2. **Quick Sessions:** Perfect for mobile/casual play
3. **Satisfying Progression:** Watch numbers go up
4. **Simple But Strategic:** Easy to learn, choices matter
5. **No Predatory Monetization:** Fair, honest game

## Stage Design Examples

### Stage 1: Tutorial
- Mostly safe upgrades
- Few enemies
- Easy boss (50 soldiers needed)
- Teaches lane switching

### Stage 2: Risk Introduction
- Mix of safe and risky paths
- Gates appear
- Medium boss (100 soldiers needed)

### Stage 3: Traps & Tricks
- Fake multipliers
- More enemies
- Harder boss (200 soldiers needed)

### Stage 4+: Escalation
- Complex choices
- Multiple gates
- Tough bosses
- Requires strategy

## Development Phases
1. **Prototype:** Basic lane switching, auto-run, troop collection
2. **Combat System:** Automatic shooting, enemy health, damage calculation
3. **Weapon Upgrades:** Different weapon types with unique stats
4. **Enemy Variety:** Different enemy types, bullet sponges, bosses
5. **Visual Polish:** Effects, animations, juice, sound
6. **Meta-Progression:** Permanent upgrades, unlockables
7. **Balance:** Tuning difficulty, damage, and progression

## Monetization (Optional)
- **Free to Play:** Ad-supported
- **Premium:** $2-3 one-time purchase removes ads
- **Cosmetics:** Character skins, trail effects
- **NO:** Pay-to-win, energy systems, loot boxes

## Open Questions / To Decide
- How many stages at launch?
- Procedural generation or hand-crafted levels?
- Multiple characters with different abilities?
- Endless mode after beating all stages?
- Leaderboards/competitive element?

---

**Status:** Concept Phase  
**Target Platform:** Web (HTML5), Mobile-friendly  
**Genre:** Auto-Runner / Casual / Arcade  
**Inspiration:** Those fake mobile game ads (but real)  
**Last Updated:** 27/01/2026
