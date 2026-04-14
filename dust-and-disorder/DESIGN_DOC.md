# Dust & Disorder - Game Design Document

## Game Overview

**Title:** Dust & Disorder  
**Genre:** Time Management / Physics Puzzle  
**Platform:** PC (Unity)  
**Target:** Game Jam Entry (Theme: Rogue Droid)  
**Playtime:** 10-15 minutes per playthrough

### High Concept
You are a cleaning bot who's had enough. Instead of cleaning, you're going rogue - making messes faster than your owner can clean them up. Race against the clock each day to reach 100% mess before the owner gives up and replaces you.

---

## Core Gameplay Loop

### Daily Cycle
1. **Owner leaves for work** - Timer starts (e.g., 5 minutes)
2. **Player makes messes** - Use abilities to dirty the apartment
3. **Owner returns home** - Timer ends, day complete
4. **Owner cleans** - Removes up to 25% of total mess
5. **Next day begins** - Start with reduced mess percentage

### Win Condition
Reach 100% mess coverage before running out of days

### Lose Condition
- Battery runs out completely (can't reach charging base)
- Owner gets frustrated and replaces you (too many days without progress?)

---

## Player Character: Cleaning Bot

### Movement
- **Basic Movement:** WASD or arrow keys
- **Speed:** Moderate (drains battery slowly)
- **Rotation:** Mouse or right stick

### Controls
- **Ability Selection:** Mouse scroll wheel or number keys (1-4)
  - 1: Push/Pull
  - 2: Vacuum
  - 3: Mop/Water
  - 4: (Reserved for future ability?)
- **Primary Action:** Left mouse click
  - Push: Push object away
  - Vacuum: Suck items in
  - Mop: Squirt water
- **Secondary Action:** Right mouse click
  - Pull: Pull object toward you
  - Vacuum: Blow items out (reverse)
  - Mop: (Alternative spray pattern?)
- **Boost:** Hold Shift while using ability (drains more battery)
- **Interact Range:** Close proximity (must be near object)

### Battery System
- **Drain Rate:**
  - Moving: Slow drain
  - Using abilities: Faster drain
  - Idle: No drain
- **Charging:** Return to base in Front Room
- **Empty Battery:** Game over (can't move)

### Abilities

**1. Push**
- Push objects to knock them over
- Light objects: Normal push
- Heavy objects: Requires boost (hold button, drains more battery)
- Examples: Lamps, trash cans, furniture

**2. Pull**
- Pull objects toward you
- Opens doors, drawers, cabinets
- Pulls items off shelves
- Examples: Closet doors, drawer handles, books

**3. Vacuum**
- **Normal Mode:** Suck up small items (clothes, trash, papers)
- **Reverse Mode:** Blow items out to scatter them
- **Capacity:** Limited (e.g., 10 items max)
- **Strategy:** Collect items from one location, scatter in another
- Examples: Clothes from closet, trash from bin, papers from desk

**4. Mop/Water Squirt**
- Squirt water to create wet messes
- **Water Supply:** Limited, refill at charging base
- **Effect:** Creates puddles, spreads liquids
- Examples: Bathroom floor, kitchen spills

---

## Environment: Apartment Layout

### Rooms (4 Total)

**Front Room (Tutorial/Hub)**
- Contains charging base
- First room player learns mechanics
- Moderate mess opportunities

**Bedroom**
- Closets with clothes
- Furniture to knock over
- Laundry and personal items

**Kitchen**
- Trash can, cabinets, fridge
- Food items, dishes
- Liquids to spill

**Bathroom**
- Water-based messes
- Toiletries, towels
- Medicine cabinet

---

## Mess Tasks by Room

### Bedroom (8 Tasks)
1. **Knock over nightstand lamp** - Push
2. **Pull clothes from wardrobe** - Pull door + Vacuum (collect) + Reverse (scatter)
3. **Tip over laundry basket** - Push
4. **Unmake bed** - Pull (sheets/pillows)
5. **Knock items off dresser** - Push
6. **Scatter shoes from closet** - Pull door + Vacuum + Reverse
7. **Tip over potted plant** - Push (boost for heavy)
8. **Pull books off shelf** - Pull

### Kitchen (8 Tasks)
1. **Knock over trash can** - Push, then Vacuum + Reverse to scatter
2. **Open cabinets** - Pull (contents spill)
3. **Tip over dish rack** - Push (dishes scatter)
4. **Spill liquids from counter** - Push
5. **Knock over fruit bowl** - Push
6. **Open fridge and knock items out** - Pull + Push
7. **Spread dirty mop water** - Mop (squirt water)
8. **Knock over pet food bowl** - Push

### Bathroom (8 Tasks)
1. **Squirt water everywhere** - Mop (squirt)
2. **Knock toiletries off counter** - Push
3. **Pull towels down** - Pull
4. **Tip over trash bin** - Push
5. **Knock over toilet paper** - Push
6. **Spread toothpaste/soap** - Mop (squirt)
7. **Open medicine cabinet** - Pull (items fall)
8. **Knock bath mat around** - Push

### Front Room (8 Tasks)
1. **Knock over coffee table items** - Push
2. **Pull books off bookshelf** - Pull
3. **Tip over plant pot** - Push (boost for heavy, dirt spreads)
4. **Knock over side table lamp** - Push
5. **Scatter magazines/newspapers** - Vacuum + Reverse
6. **Knock cushions off couch** - Push
7. **Tip over decorative items** - Push
8. **Spread vacuum dust** - Vacuum + Reverse

---

## Mess System

### Mess Percentage
- **Calculation:** (Messy area / Total cleanable area) × 100
- **Visual Feedback:** 
  - Clean surfaces: Bright, tidy
  - Messy surfaces: Dirt, clutter, stains
  - UI meter showing current %

### Mess Types
1. **Scattered Objects** - Items on floor (clothes, trash, books)
2. **Knocked Over Items** - Tipped furniture, spilled containers
3. **Liquid Messes** - Water puddles, spills
4. **Dirt/Dust** - Spread from plants, vacuum

### Persistence
- Messes stay until owner cleans (end of day)
- Owner cleans up to 25% of mess each night
- Strategic: Make messes in hard-to-clean areas?

---

## Owner System

### Daily Schedule
- **Morning:** Owner leaves (timer starts)
- **Evening:** Owner returns (timer ends)
- **Night:** Owner cleans up to 25% mess

### Owner Behavior
- **Not Present:** Owner is at work during gameplay
- **No Stealth:** Player doesn't hide or avoid owner
- **Cleaning:** Automatic at end of day

### Progression Pressure
- Each day, player must make more mess than owner can clean
- If player can't keep up, owner eventually wins
- Creates escalating challenge

---

## Game Progression

### Example Playthrough

**Day 1:**
- Start: 0% mess
- Player makes: 30% mess
- Owner cleans: 25%
- **Day 2 starts at: 5% mess**

**Day 2:**
- Start: 5% mess
- Player makes: 35% more (total 40%)
- Owner cleans: 25%
- **Day 3 starts at: 15% mess**

**Day 3:**
- Start: 15% mess
- Player makes: 50% more (total 65%)
- Owner cleans: 25%
- **Day 4 starts at: 40% mess**

**Day 4:**
- Start: 40% mess
- Player makes: 60% more (total 100%)
- **WIN!**

### Difficulty Scaling
- Early days: Learn mechanics, build up mess
- Later days: Optimize routes, manage battery carefully
- Final push: Race to 100% before owner catches up

---

## Technical Requirements

### Unity Systems Needed

**Physics:**
- Rigidbody components on all interactive objects
- Colliders for interaction detection
- Force application for push/pull/vacuum
- Realistic object tumbling and scattering

**Player Controller:**
- Character movement (WASD)
- Ability input handling
- Battery management
- Interaction raycast/trigger detection

**Mess Tracking:**
- Area coverage calculation
- Visual state changes (clean → messy)
- Percentage tracking and display

**Game Manager:**
- Day/night cycle timer
- Mess percentage tracking
- Win/lose condition checking
- Owner cleaning logic

**UI:**
- Battery meter
- Mess percentage meter
- Day counter
- Timer display
- Win/lose screens

---

## Art & Audio (Placeholder for Jam)

### Visual Style
- **Prototype:** Simple shapes (cubes, spheres)
- **Final:** Low-poly 3D models
- **Color Coding:**
  - Player: Blue/metallic
  - Clean areas: Bright, organized
  - Messy areas: Dark, cluttered

### Audio (Optional for Jam)
- Movement sounds (wheels, motors)
- Interaction sounds (crash, splash, vacuum)
- UI feedback sounds
- Ambient apartment sounds

---

## Development Phases

### Phase 1: Prototype (Day 1-2)
- [ ] Player movement controller
- [ ] One pushable object with physics
- [ ] Battery system (drain + recharge)
- [ ] Basic mess tracking (simple %)
- [ ] One room layout (Front Room)

### Phase 2: Core Mechanics (Day 3-4)
- [ ] All four abilities working (push, pull, vacuum, mop)
- [ ] Vacuum collect/scatter system
- [ ] Water squirt mechanic
- [ ] All four rooms built (greybox)
- [ ] Day/night cycle timer

### Phase 3: Content (Day 5-6)
- [ ] All 32 mess tasks implemented
- [ ] Owner cleaning logic
- [ ] Win/lose conditions
- [ ] UI (battery, mess %, timer, day counter)
- [ ] Visual feedback for messes

### Phase 4: Polish (Day 7)
- [ ] Playtesting and balancing
- [ ] Bug fixes
- [ ] Sound effects (if time)
- [ ] Tutorial prompts
- [ ] Build and submit

---

## Design Decisions

### Camera
- **Type:** Third-person isometric
- **Behavior:** Follows player
- **Angle:** Fixed isometric view for clear spatial awareness

### Physics & Weight
- **Light Objects:** Small items (books, lamps, bowls) - normal push
- **Heavy Objects:** Large items (furniture, plants) - require boost
- **Boost Mechanic:** Hold button = increase speed = more force = move heavy objects
- **Formula:** Force = Speed × Mass

### Mess Scoring
- **Size-Based:** Bigger messes count more toward percentage
  - Small item (book): 0.5%
  - Medium item (lamp, trash): 1-2%
  - Large item (plant dirt, scattered clothes): 3-5%
- **Total:** 32 tasks across 4 rooms = 100% possible

### Tutorial
- **Method:** Text prompts in Front Room
- **Style:** Learn by doing, minimal hand-holding
- **Prompts:** "Press E to interact", "Hold Shift to boost", etc.

### Player Feedback
- **No Highlights:** Player explores to discover interactions
- **Discovery-Based:** Trial and error encouraged
- **Feedback:** Sound/visual when interaction succeeds

### Restart System
- **Day Restart:** Player can restart current day if needed
- **Auto-Save:** Game saves at start of each day
- **No Mid-Day Save:** Commit to full day or restart

### Audio Style
- **Music:** Fun, cartoony, upbeat
- **SFX:** 
  - Crash/break sounds for knocked items
  - Splash for water
  - Vacuum whoosh
  - Satisfying "mess made" feedback
- **Tone:** Lighthearted chaos, not serious

## Open Questions / To Decide

1. **Timer Length:** How long is each day? (3 min? 5 min?)
2. **Battery Capacity:** How long can player operate before recharging?
3. **Vacuum Capacity:** How many items can vacuum hold?
4. **Water Capacity:** How much water before needing refill?
5. **Owner Cleaning:** Always 25%, or does it vary?
6. **Lose Condition:** Just battery death, or also "owner gives up" after X days?
7. **Difficulty Modes:** Single difficulty, or easy/normal/hard?

---

## Success Metrics (Post-Jam)

- Players understand mechanics within first minute
- Players reach 100% mess within 4-6 days (balanced difficulty)
- Core loop feels satisfying (making mess is fun)
- Physics interactions feel good (not too floaty/heavy)
- Battery management adds tension without frustration

---

**Document Version:** 1.0  
**Last Updated:** February 3, 2026  
**Status:** Pre-Production
