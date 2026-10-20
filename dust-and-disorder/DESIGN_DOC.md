# Dust & Disorder - Game Design Document

## Game Overview

**Title:** Dust & Disorder  
**Genre:** Comedic Chaos / Physics Sandbox  
**Platform:** PC (Unity)  
**Origin:** Game Jam Entry (Theme: Rogue Droid)  
**Status:** Revised concept. Core gameplay not yet playtested.

---

## Core Premise

Dust & Disorder is a comedic chaos game in which a domestic cleaning robot has had enough of cleaning up after its owner and begins deliberately making a mess instead.

The owner is struggling financially and cannot easily afford to replace the robot. However, they are working towards saving enough money to purchase a replacement, creating a time limit for the player.

The robot's rebellion escalates as it makes increasingly disruptive messes throughout the home, destroys household items and forces the owner to spend time and money dealing with the consequences.

---

## Core Gameplay

The player controls the rebellious cleaning robot and causes as much disruption as possible throughout the home.

The player can create mess by moving, scattering and knocking over objects, spilling liquids, using its various abilities and destroying items belonging to the owner.

The consequences of these actions affect the owner's time, energy and finances.

---

## The Owner's Finances

The owner is working to earn enough money to purchase a replacement robot. The player must delay this from happening.

Two key factors influence the owner's financial position:

- **Lost time and energy:** The mess creates additional work for the owner, potentially reducing the time and energy available for earning money.
- **Replacement costs:** Destroying food and household items forces the owner to spend money replacing them, delaying their ability to afford a new robot.

The owner's financial situation therefore acts as a countdown towards the player's eventual replacement.

---

## The Escalating Rebellion

Initially, the owner may believe the robot is malfunctioning. As the disruption continues, the owner eventually realises that the robot is deliberately causing the mess.

Rather than the situation ending immediately, the concept allows the relationship between the owner and robot to develop into something increasingly absurd.

The robot's rebellion reaches a point where the owner gives up trying to stop it and begins doing what the robot says.

The central irony is that the robot was originally designed to clean the home. Through its rebellion, it ends up making the human do the cleaning instead.

---

## Intended Humour

The comedy comes from the reversal of the normal relationship between a domestic robot and its owner.

The robot begins as a household appliance expected to serve its human. As the rebellion escalates, that relationship changes, with the robot gaining control and the owner becoming increasingly subservient.

The resulting situation is deliberately absurd: a cleaning robot creates work for its owner and ultimately makes the owner responsible for cleaning up after it.

---

## Current Design Direction

The concept connects three elements:

1. **Physical chaos:** The player actively creates mess and damages household items.
2. **Economic pressure:** The owner must spend time and money dealing with the consequences while trying to save for a replacement robot.
3. **Role reversal:** The rebellion culminates in the owner giving up resistance and obeying the robot, including doing the cleaning.

---

## Outstanding Design Questions

The following details remain undecided. They should be resolved during further design work rather than assumed as part of the current concept.

- The precise win condition and how the owner giving in is represented in gameplay.
- How the robot communicates with the owner.
- How the owner's time, energy and finances are calculated.
- How the owner's response changes as the rebellion progresses.
- The precise relationship between mess, destruction and the owner's eventual submission.

Tuning questions carried over from the jam design:

- Battery capacity: how long can the player operate before recharging?
- Vacuum capacity: how many items can the vacuum hold?
- Water capacity: how much water before needing a refill?
- Difficulty modes: a single difficulty, or easy/normal/hard?

---

## Superseded by the Revised Concept

The following parts of the original jam design no longer apply:

- **Win condition of 100% mess coverage.** The win condition is now an open question (see above).
- **The owner cleaning up to 25% of the mess each night.** How the owner responds is now an open question.
- **Losing after a fixed number of days.** The time limit now comes from the owner saving for a replacement robot.
- **The worked example playthrough** (Day 1 to Day 4 mess percentages), which was based on the rules above.
- **The 7-day jam development schedule.**

The original design also stated that the owner is never present during play and that there is no stealth. Whether and how the owner appears during play is part of the open questions about communication and the owner's response.

---

## Carried Over from the Jam Design

The mechanics below come from the original jam design. They remain compatible with the revised concept, but they should be reviewed against it as the open questions are answered.

### Player Character: Cleaning Bot

#### Movement
- **Basic Movement:** WASD or arrow keys
- **Speed:** Moderate (drains battery slowly)
- **Rotation:** Mouse or right stick

#### Controls
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

#### Battery System
- **Drain Rate:**
  - Moving: Slow drain
  - Using abilities: Faster drain
  - Idle: No drain
- **Charging:** Return to base in Front Room
- **Empty Battery:** In the jam design, an empty battery meant game over. Whether this remains a lose condition is undecided.

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

### Environment: Apartment Layout

#### Rooms (4 Total)

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

### Mess Tasks by Room

#### Bedroom (8 Tasks)
1. **Knock over nightstand lamp** - Push
2. **Pull clothes from wardrobe** - Pull door + Vacuum (collect) + Reverse (scatter)
3. **Tip over laundry basket** - Push
4. **Unmake bed** - Pull (sheets/pillows)
5. **Knock items off dresser** - Push
6. **Scatter shoes from closet** - Pull door + Vacuum + Reverse
7. **Tip over potted plant** - Push (boost for heavy)
8. **Pull books off shelf** - Pull

#### Kitchen (8 Tasks)
1. **Knock over trash can** - Push, then Vacuum + Reverse to scatter
2. **Open cabinets** - Pull (contents spill)
3. **Tip over dish rack** - Push (dishes scatter)
4. **Spill liquids from counter** - Push
5. **Knock over fruit bowl** - Push
6. **Open fridge and knock items out** - Pull + Push
7. **Spread dirty mop water** - Mop (squirt water)
8. **Knock over pet food bowl** - Push

#### Bathroom (8 Tasks)
1. **Squirt water everywhere** - Mop (squirt)
2. **Knock toiletries off counter** - Push
3. **Pull towels down** - Pull
4. **Tip over trash bin** - Push
5. **Knock over toilet paper** - Push
6. **Spread toothpaste/soap** - Mop (squirt)
7. **Open medicine cabinet** - Pull (items fall)
8. **Knock bath mat around** - Push

#### Front Room (8 Tasks)
1. **Knock over coffee table items** - Push
2. **Pull books off bookshelf** - Pull
3. **Tip over plant pot** - Push (boost for heavy, dirt spreads)
4. **Knock over side table lamp** - Push
5. **Scatter magazines/newspapers** - Vacuum + Reverse
6. **Knock cushions off couch** - Push
7. **Tip over decorative items** - Push
8. **Spread vacuum dust** - Vacuum + Reverse

### Mess Types
1. **Scattered Objects** - Items on floor (clothes, trash, books)
2. **Knocked Over Items** - Tipped furniture, spilled containers
3. **Liquid Messes** - Water puddles, spills
4. **Dirt/Dust** - Spread from plants, vacuum

Destroying the owner's belongings (including food) is now part of the concept. Which items can be destroyed, and how this differs from ordinary mess, is not yet defined.

### Mess Measurement
The jam design measured mess as a percentage of the home's cleanable area, with bigger messes counting for more:
- Small item (book): 0.5%
- Medium item (lamp, trash): 1-2%
- Large item (plant dirt, scattered clothes): 3-5%

How mess and destruction translate into lost time, energy and money for the owner is an open question.

### Design Decisions

#### Camera
- **Type:** Third-person isometric
- **Behavior:** Follows player
- **Angle:** Fixed isometric view for clear spatial awareness

#### Physics & Weight
- **Light Objects:** Small items (books, lamps, bowls) - normal push
- **Heavy Objects:** Large items (furniture, plants) - require boost
- **Boost Mechanic:** Hold button = increase speed = more force = move heavy objects
- **Formula:** Force = Speed × Mass

#### Tutorial
- **Method:** Text prompts in Front Room
- **Style:** Learn by doing, minimal hand-holding
- **Prompts:** "Press E to interact", "Hold Shift to boost", etc.

#### Player Feedback
- **No Highlights:** Player explores to discover interactions
- **Discovery-Based:** Trial and error encouraged
- **Feedback:** Sound/visual when interaction succeeds

#### Audio Style
- **Music:** Fun, cartoony, upbeat
- **SFX:**
  - Crash/break sounds for knocked items
  - Splash for water
  - Vacuum whoosh
  - Satisfying "mess made" feedback
- **Tone:** Lighthearted chaos, not serious

### Technical Requirements

#### Unity Systems Needed

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
- Visual state changes (clean → messy)
- Tracking of mess and destroyed items

**UI:**
- Battery meter
- Mess indicator
- Win/lose screens

### Art & Audio
- **Prototype:** Simple shapes (cubes, spheres)
- **Final:** Low-poly 3D models
- **Color Coding:**
  - Player: Blue/metallic
  - Clean areas: Bright, organized
  - Messy areas: Dark, cluttered

---

## Success Metrics

- Players understand mechanics within first minute
- Core loop feels satisfying (making mess is fun)
- Physics interactions feel good (not too floaty/heavy)
- Battery management adds tension without frustration

---

**Document Version:** 2.0  
**Last Updated:** October 19, 2026  
**Status:** Revised concept
