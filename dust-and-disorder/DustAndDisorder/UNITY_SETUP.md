# Dust & Disorder - Unity Project Setup

## Project Information
- **Unity Version:** 6000.3.6f1 (Unity 6)
- **Platform:** PC (Windows)
- **Genre:** Physics-based Time Management / Puzzle

## Quick Start

### Opening the Project
1. Open Unity Hub
2. Click "Add" and navigate to this folder: `DustAndDisorder`
3. Unity will import the project (this may take a few minutes on first load)

### Project Structure
```
DustAndDisorder/
├── Assets/
│   ├── Scenes/          # Game scenes
│   ├── Scripts/         # All C# scripts
│   │   ├── Player/      # Player controller, battery, abilities
│   │   ├── Abilities/   # Push, Pull, Vacuum, Mop
│   │   ├── Objects/     # Interactive objects, mess tasks
│   │   ├── Managers/    # Game, Mess, DayNight managers
│   │   ├── Environment/ # Charging base, rooms
│   │   └── UI/          # UI components
│   ├── Prefabs/         # Reusable game objects
│   ├── Materials/       # Visual materials
│   └── UI/              # UI assets
├── ProjectSettings/     # Unity project settings
└── Packages/            # Package dependencies
```

## Setting Up the Scene

### 1. Create the Main Scene
1. In Unity, go to `File > New Scene`
2. Save it as `Assets/Scenes/MainGame.unity`

### 2. Set Up the Player
1. Create an empty GameObject, name it "Player"
2. Add tag "Player" to it
3. Add components:
   - `Character Controller`
   - `PlayerController` script
   - `BatterySystem` script
   - `AbilitySystem` script
   - `PushAbility` script
   - `PullAbility` script
   - `VacuumAbility` script
   - `MopAbility` script
4. Create a simple capsule as child for visual representation

### 3. Set Up the Camera
1. Select Main Camera
2. Add `CameraController` script
3. Drag Player into the Target field
4. Adjust offset to (0, 10, -10) for isometric view

### 4. Create the Charging Base
1. Create a Cube, name it "ChargingBase"
2. Add tag "ChargingBase"
3. Add `ChargingBase` script
4. Add a Sphere Collider, set as Trigger, radius 2
5. Position in Front Room area

### 5. Set Up Managers
1. Create empty GameObject "GameManager"
   - Add `GameManager` script
2. Create empty GameObject "MessManager"
   - Add `MessManager` script
3. Create empty GameObject "DayNightCycle"
   - Add `DayNightCycle` script
   - Set Day Duration to 300 (5 minutes)

### 6. Create the Environment
1. Create a Plane for the floor (scale 10, 1, 10)
2. Create walls using Cubes to define 4 rooms:
   - Front Room (with charging base)
   - Bedroom
   - Kitchen
   - Bathroom

### 7. Add Interactive Objects
For each mess task, create objects with:
- Rigidbody component
- Collider
- `InteractiveObject` or `MessTask` script
- Set mess value (0.5 - 5.0)
- Set weight for physics

Example objects:
- Lamps (weight: 0.5, mess: 1.0)
- Trash cans (weight: 1.0, mess: 2.0)
- Plants (weight: 5.0, mess: 3.0, isHeavy: true)

### 8. Set Up UI
1. Create Canvas (Screen Space - Overlay)
2. Add UI elements:
   - Battery Meter (Slider + Text)
   - Mess Meter (Slider + Text)
   - Day Timer (Text)
   - Win Screen (Panel, hidden by default)
   - Lose Screen (Panel, hidden by default)
   - Pause Screen (Panel, hidden by default)
3. Create empty GameObject "UIManager" under Canvas
   - Add `UIManager` script
   - Assign all UI references

## Layer Setup
1. Go to `Edit > Project Settings > Tags and Layers`
2. Add layers:
   - `Interactable` (for objects player can interact with)
   - `Vacuumable` (for small items that can be vacuumed)

## Input Setup
The game uses Unity's legacy Input system:
- **Movement:** WASD or Arrow Keys
- **Abilities:** 1-4 keys or Mouse Scroll Wheel
- **Primary Action:** Left Mouse Button
- **Secondary Action:** Right Mouse Button
- **Boost:** Left/Right Shift
- **Pause:** Escape

## Testing
1. Press Play in Unity
2. Use WASD to move
3. Press 1-4 to select abilities
4. Click to use abilities
5. Watch battery and mess meters

## Next Steps
1. Create prefabs for all 32 mess tasks
2. Build out the 4 room layouts
3. Add visual polish (materials, lighting)
4. Balance gameplay (timer, battery drain, mess values)
5. Add sound effects (optional)

## Troubleshooting

### Player won't move
- Check that Character Controller is attached
- Verify battery isn't depleted

### Abilities don't work
- Check that ability scripts are attached
- Verify objects have Rigidbody and Collider
- Check layer masks on abilities

### UI not updating
- Verify UIManager has all references assigned
- Check that managers are in the scene

## Documentation
- Design Doc: `DESIGN_DOC.md`
- Implementation Plan: See artifacts folder

---

**Created:** February 3, 2026  
**Last Updated:** February 3, 2026
