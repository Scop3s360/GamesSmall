# HERO'S GAMBIT

## High Concept
Pull the pins in the right order to save the hero! Puzzle game where you remove pins/barriers to guide lava, water, treasure, and enemies. One wrong move = death. The actual game from those "only 1% can solve" ads.

## Core Gameplay Loop

### Moment-to-Moment
1. View puzzle scene with hero, princess/treasure, enemies, hazards
2. Identify pins holding back elements (lava, water, enemies)
3. Plan the correct sequence
4. Pull pins one at a time
5. Watch physics/flow resolve
6. Success = hero gets treasure/princess, enemies die
7. Failure = hero dies, retry

### Session Structure
- **Puzzle Duration:** 10-60 seconds per puzzle
- **Level-Based:** Progressive difficulty
- **Lose Condition:** Hero dies (lava, enemies, traps)
- **Win Condition:** Hero survives and reaches goal

## Core Mechanics

### Pin System
- **Pins:** Removable barriers holding back elements
- **Pull Order Matters:** Wrong sequence = death
- **One-Way:** Can't undo, must restart puzzle
- **Visual Feedback:** Highlight selected pin before pulling

### Elements & Physics

**Lava (Red):**
- Kills hero instantly
- Kills enemies on contact
- Flows downward with gravity
- Can be blocked or redirected

**Water (Blue):**
- Neutralizes lava (turns to stone)
- Safe for hero
- Flows downward with gravity
- Can extinguish fire

**Enemies (Various):**
- Kill hero on contact
- Die from lava
- Can be trapped or eliminated
- Different types: goblins, dragons, skeletons

**Treasure/Princess:**
- Goal to reach
- Must clear path safely
- Sometimes behind enemies
- Sometimes needs rescue from danger

**Traps:**
- Spikes, arrows, falling rocks
- Triggered by wrong pin pulls
- Can kill hero or enemies

### Puzzle Types

**Type 1: Lava Redirect**
- Use lava to kill enemies
- Then neutralize lava with water
- Hero walks to treasure

**Type 2: Water First**
- Block lava with water
- Create safe path
- Avoid drowning hero

**Type 3: Enemy Elimination**
- Drop enemies into lava
- Or trap them behind barriers
- Clear path for hero

**Type 4: Multi-Stage**
- Pull pin A to get water
- Pull pin B to block lava
- Pull pin C to drop enemies
- Pull pin D to open path

**Type 5: Fake-Out**
- Obvious solution kills hero
- Must think counter-intuitively
- "Only 1% can solve" difficulty

## Visual Style
- **Simple 2D:** Side-view cross-section
- **Clear Colors:** Red=danger, Blue=safe, Yellow=treasure
- **Cartoon Style:** Exaggerated, readable
- **Satisfying Physics:** Smooth liquid flow, dramatic deaths
- **Minimal UI:** Just the puzzle and restart button

## Progression System

### Level Progression
- **World 1:** Basic lava/water (10 levels)
- **World 2:** Enemies introduced (10 levels)
- **World 3:** Multiple elements (10 levels)
- **World 4:** Complex sequences (10 levels)
- **World 5:** Expert puzzles (10 levels)

### Difficulty Curve
- Early: 2-3 pins, obvious solutions
- Mid: 4-5 pins, some misdirection
- Late: 6+ pins, complex sequences
- Expert: Multiple fake-outs, precise timing

### Hints System
- **Free Hints:** 3 per day
- **Earned Hints:** Watch ad or complete bonus puzzle
- **Hint Types:**
  - Show first pin to pull
  - Highlight wrong pins
  - Show full solution (costs 3 hints)

## Meta-Progression (Optional)
- **Stars:** 3 stars per level (speed-based)
- **Unlockables:** New hero skins, themes
- **Achievements:** "Save 100 heroes", "Never use hints"
- **Daily Puzzles:** New puzzle each day for bonus rewards

## Technical Scope (HTML5/JavaScript)
- 2D canvas or DOM-based
- Simple physics simulation (gravity, flow)
- Touch/click controls
- Level data in JSON format
- LocalStorage for progress
- Procedural or hand-crafted levels

## Unique Selling Points
1. **Actually The Real Game:** No bait-and-switch
2. **Pure Puzzle:** No timers, no energy, just puzzles
3. **Satisfying Solutions:** Watch your plan work perfectly
4. **Bite-Sized:** Perfect for quick play sessions
5. **Fair Difficulty:** Challenging but solvable

## Example Puzzles

### Puzzle 1 (Tutorial):
```
[Hero] | [Lava] | [Treasure]
       Pin A    Pin B
```
Solution: Pull Pin A (lava flows away), Pull Pin B (hero walks to treasure)

### Puzzle 2 (Water):
```
[Water]
   |
[Hero] | [Lava] | [Treasure]
       Pin A    Pin B
```
Solution: Pull Pin A (water flows down, neutralizes lava), Pull Pin B (safe path)

### Puzzle 3 (Enemy):
```
[Lava]
   |
[Hero] | [Enemy] | [Treasure]
       Pin A     Pin B
```
Solution: Pull Pin A (lava kills enemy), wait, Pull Pin B (hero walks over cooled lava)

### Puzzle 4 (Fake-Out):
```
[Treasure] | [Lava]
    |          |
[Hero]    | [Water]
   Pin A     Pin B
```
Wrong: Pull Pin A (treasure falls on hero - death!)
Right: Pull Pin B (water neutralizes lava), Pull Pin A (treasure safe)

## Development Phases
1. **Prototype:** Basic pin pulling, lava/water physics
2. **Core Puzzles:** 10-20 hand-crafted levels
3. **Elements:** Add enemies, traps, variations
4. **Polish:** Animations, particles, sound effects
5. **Content:** 50+ levels across multiple worlds
6. **Meta:** Hints, stars, progression system

## Monetization (Optional)
- **Free:** Ad-supported (optional ads for hints)
- **Premium:** $1.99 removes ads, gives unlimited hints
- **Cosmetic:** Hero skins, visual themes
- **NO:** Pay-to-skip, energy systems

## Level Editor (Future)
- **Community Levels:** Players create and share
- **Rating System:** Upvote best puzzles
- **Featured Puzzles:** Curated by community
- **Endless Content:** User-generated

## Open Questions / To Decide
- How many levels at launch? (50? 100?)
- Hand-crafted or procedurally generated?
- Multiple heroes with different abilities?
- Competitive element (speedrun leaderboards)?
- Level editor at launch or post-launch?

---

**Status:** Concept Phase  
**Target Platform:** Web (HTML5), Mobile-friendly  
**Genre:** Puzzle / Logic / Casual  
**Inspiration:** "Pull the pin" / "Hero rescue" fake ads  
**Last Updated:** 27/01/2026
