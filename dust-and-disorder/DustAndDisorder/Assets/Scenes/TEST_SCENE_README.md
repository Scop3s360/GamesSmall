# Test Scene Quick Start

## What's in the Test Scene

The `TestScene.unity` includes a basic setup to test all core systems:

### Environment
- **Floor** - 50x50 plane to move around on
- **Lighting** - Directional light for visibility
- **Camera** - Isometric view that follows the player

### Player
- Positioned at (0, 1, 0)
- Blue capsule visual
- All systems attached (movement, battery, abilities)

### Charging Base
- Yellow cylinder at (-8, 0.5, -8)
- Recharges battery and refills water
- Has trigger zone for automatic charging

### Test Objects
- **2 Lamps** (light, white) - Easy to push
- **2 Trash Cans** (medium, gray) - Normal push
- **2 Plants** (heavy, green) - Require boost to push
- **3 Books** (small, colored) - Can be vacuumed

## How to Use

### Option 1: Automatic Setup (Recommended)
1. Open `TestScene.unity` in Unity
2. Create an empty GameObject in the scene
3. Add the `TestSceneSetup` component to it
4. The scene will auto-setup when you press Play

### Option 2: Manual Setup
1. Open `TestScene.unity`
2. Add a GameObject with `TestSceneSetup` component
3. Right-click the component → "Setup Test Scene"
4. Press Play

## Controls

- **WASD** - Move player
- **1** - Push ability
- **2** - Pull ability  
- **3** - Vacuum ability
- **4** - Mop ability
- **Left Click** - Use primary action
- **Right Click** - Use secondary action
- **Hold Shift** - Boost (2x power, 2x battery cost)
- **Escape** - Pause

## Testing Checklist

✅ **Movement** - Walk around with WASD  
✅ **Battery Drain** - Watch battery meter decrease while moving  
✅ **Charging** - Walk to yellow charging base, battery refills  
✅ **Push (1)** - Click on lamps/trash cans to push them  
✅ **Push Heavy** - Hold Shift and push green plants  
✅ **Pull (2)** - Click to pull objects toward you  
✅ **Vacuum (3)** - Hold Left Click near books to suck them up  
✅ **Vacuum Blow** - Right Click to scatter vacuumed items  
✅ **Mop (4)** - Click to squirt water puddles  
✅ **Camera** - Camera should follow player smoothly  

## Expected Behavior

- Battery starts at 100%
- Moving drains battery slowly
- Using abilities drains battery faster
- Boost drains 2x battery
- Objects should react to physics
- Heavy objects need boost to move
- Vacuum can hold up to 10 items
- Water creates puddles on ground

## Troubleshooting

**Player won't move:**
- Check battery isn't at 0%
- Verify CharacterController is attached

**Abilities don't work:**
- Make sure you selected an ability (1-4)
- Check battery level
- Verify objects have Rigidbody

**Camera doesn't follow:**
- Check CameraController has player as target
- Verify player has "Player" tag
