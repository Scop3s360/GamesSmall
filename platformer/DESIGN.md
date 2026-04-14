# Platformer Game - Design Document

## Game Overview
A tight, responsive platformer with simple mechanics and challenging level design. Focus on precision movement and satisfying gameplay feel.

## Core Concept
Classic 2D platformer with:
- Precise jump mechanics
- Collectibles and secrets
- Environmental hazards
- Progressive difficulty
- Speedrun potential

## Gameplay Mechanics

### Player Movement
- **Walk/Run**: Left/right arrow keys
- **Jump**: Space bar (variable height based on hold time)
- **Double Jump**: Optional second jump in mid-air
- **Wall Slide**: Slow descent when touching walls
- **Wall Jump**: Jump off walls for extra mobility

### Core Mechanics
- Tight, responsive controls
- Coyote time (grace period after leaving platform)
- Jump buffering (early jump input registers)
- Variable jump height (hold for higher jump)
- Momentum-based movement

### Collectibles
- **Coins/Gems**: Scattered throughout levels
- **Power-ups**: Temporary abilities
  - Speed boost
  - Invincibility
  - Double jump (if not default)
  - High jump
- **Secrets**: Hidden areas with bonus rewards

### Hazards
- Spikes (instant death)
- Moving platforms
- Falling platforms
- Enemies (simple patrol patterns)
- Pits (fall = death)
- Moving hazards (saws, crushers)

### Level Elements
- Solid platforms
- One-way platforms (jump through from below)
- Moving platforms
- Breakable blocks
- Bounce pads
- Checkpoints

## Game Structure

### Level Progression
- 10-15 short levels
- Each level 30-60 seconds to complete
- Increasing difficulty curve
- Optional collectibles for 100% completion
- Time trials for speedrunners

### Level Themes
- **World 1**: Grasslands (tutorial, easy)
- **World 2**: Caves (darker, moving platforms)
- **World 3**: Factory (mechanical hazards)
- **World 4**: Sky (precision jumps, wind)
- **World 5**: Final Challenge (all mechanics)

## Controls
- **Arrow Keys**: Move left/right
- **Space**: Jump
- **R**: Restart level
- **ESC**: Pause menu

## Visual Style
- Clean, readable graphics
- Distinct foreground/background
- Clear hazard indicators
- Smooth animations
- Particle effects on jumps/landings

## Audio
- Jump sound
- Landing sound
- Coin collection
- Death sound
- Checkpoint sound
- Background music per world
- Sound toggle option

## Player Feedback
- Screen shake on landing (subtle)
- Particle effects
- Animation squash/stretch
- Clear visual/audio cues
- Death animation
- Victory animation

## Progression System
- Level completion tracking
- Collectible tracking (X/Y coins per level)
- Best time per level
- Total deaths counter
- Unlock system (complete level to unlock next)

## Technical Requirements
- HTML5 Canvas
- Vanilla JavaScript
- 60 FPS target
- Tile-based level design
- Simple collision detection
- Level data in JSON format

## Development Phases

### Phase 1: Core Movement
- Player character
- Basic movement (walk, jump)
- Gravity and physics
- Platform collision
- Camera follow

### Phase 2: Level Building
- Tile system
- Level loader
- Multiple platform types
- Hazards (spikes, pits)
- Checkpoints

### Phase 3: Polish Movement
- Coyote time
- Jump buffering
- Variable jump height
- Wall slide/jump
- Animation

### Phase 4: Content
- 5-10 levels
- Collectibles
- Enemies (simple)
- Power-ups
- Level themes

### Phase 5: UI & Menus
- Level select
- Pause menu
- Death/victory screens
- Stats tracking
- Sound toggle

### Phase 6: Polish & Testing
- Particle effects
- Sound effects
- Music
- Balance testing
- Bug fixes

## Level Design Principles
- Teach mechanics through level design
- Introduce one new element per level
- Ramp difficulty gradually
- Reward exploration
- Multiple paths (easy/hard)
- Clear visual language

## Success Metrics
- Controls feel tight and responsive
- Deaths feel fair (player's fault)
- Levels are challenging but achievable
- Speedrun potential exists
- Fun to replay levels

## Inspiration
- Celeste (tight controls, coyote time)
- Super Meat Boy (quick deaths, instant restart)
- Hollow Knight (movement feel)
- Classic Mario (level design)

## Notes
- Prioritize feel over features
- Test movement extensively
- Keep levels short and focused
- Instant restart on death (no loading)
- Clear visual feedback for all actions

---

**Project Status**: Design phase - ready for implementation
**Target Completion**: TBD
**Developer**: NeonGoblin
