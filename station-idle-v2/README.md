# Station Idle V2

A deep space station management incremental game with production chains, crew automation, and combat.

## Quick Start

1. Open `index.html` in a web browser
2. Start gathering resources (ice, iron ore, carbon)
3. Build modules to unlock new production recipes
4. Assign crew to automate production
5. Configure ships and engage in combat for rare resources

## Game Features

- **10 Tiers of Production** - From basic materials to megastructures
- **Crew Automation** - Assign crew to recipes for hands-free production
- **Combat System** - 5 hull types, 4 zones, 12 unique enemies
- **Save/Load** - Your progress is automatically saved
- **Debug Profiles** - Test different game stages quickly

## Controls

- Click tabs in the sidebar to navigate
- Click "Start" on recipes to begin production
- Click "Build" on modules to construct them
- Assign crew in the Crew tab
- Configure ships in the Ship tab
- Battle enemies in the Combat tab

## Tips for New Players

1. **Start Simple** - Focus on ice → water → oxygen production first
2. **Build Solar Panels** - Power is essential for most recipes
3. **Get Crew Early** - Habitation modules unlock automation
4. **Explore Combat** - Rewards help accelerate production
5. **Use Debug Profiles** - Test features without grinding (see below)

## Debug Profiles

For testing purposes, debug profiles are enabled by default. They appear at the top of the Dashboard tab.

**Available Profiles:**
- **Crew Test** - Resources and modules for testing crew automation
- **Combat Test** - Pre-built weapons and defense for testing combat
- **Production Test** - Mid-tier resources for testing production chains

**To Disable:** Comment out the `<script src="js/debug-profiles.js"></script>` line in `index.html`

## File Structure

```
station-idle-v2/
├── index.html              # Main game file
├── css/
│   └── style.css          # Game styling
├── js/
│   ├── game.js            # Core game logic
│   ├── crew.js            # Crew system
│   ├── crew-ui.js         # Crew interface
│   ├── combat.js          # Combat mechanics
│   ├── ship-ui.js         # Ship configuration
│   ├── combat-ui.js       # Combat interface
│   ├── ship-renderer.js   # Ship graphics
│   └── debug-profiles.js  # Testing profiles
├── DEVELOPMENT_PLAN.md    # Technical roadmap
├── DEVLOG.md             # Release history
├── FUTURE_PLANS.md       # Feature roadmap
└── README.md             # This file
```

## Development Status

**Current Version:** Alpha 0.3

**Completed:**
- ✅ Full production system (10 tiers)
- ✅ Crew automation
- ✅ Combat system
- ✅ Save/load functionality

**In Progress:**
- 🚧 Shop/prestige system (Alpha 0.4)

**Planned:**
- 📋 Achievement system
- 📋 Balance tuning
- 📋 More combat zones
- 📋 Research tree

See `FUTURE_PLANS.md` for the complete roadmap.

## Technical Details

- **Engine:** Vanilla JavaScript (no frameworks)
- **Tick Rate:** 100ms (10 updates per second)
- **Save System:** LocalStorage
- **Graphics:** HTML5 Canvas for ships
- **Browser Support:** Modern browsers (Chrome, Firefox, Edge, Safari)

## Known Issues

- Combat balance needs tuning
- Some production chains may feel slow
- No prestige system yet (coming in Alpha 0.4)

## Feedback & Bug Reports

Found a bug or have a suggestion? Please let me know!

- Balance issues (too slow/fast/hard/easy)
- Feature requests
- Bug reports
- General feedback

## Credits

**Developer:** Scop3s360
**Version:** Alpha 0.3
**Release Date:** February 12, 2026

## License

This game is free to play. All rights reserved.

---

**Enjoy building your space empire!** 🚀
