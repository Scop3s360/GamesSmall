# Siege and Storm - Technical Requirements

## Engine
- **Godot Version**: 4.5.1
- **Language**: GDScript

## Required Plugins/Addons
- None (built-in pathfinding and AI)

## Performance Targets
- **Frame Rate**: 60 FPS
- **Memory**: < 250 MB RAM
- **Max Units On Screen**: 100+

## Save System Requirements

### Data to Save
- Completed levels
- Star ratings per level
- Unlocked towers
- Settings
- Best scores

### Save Format
- JSON file: `user://siege_and_storm_save.json`
- Auto-save after each level

## Input Methods

### Mouse
- **Click**: Place tower, select, UI
- **Hover**: Preview range and stats
- **Right Click**: Cancel/deselect

### Keyboard
- **1-6**: Quick-select towers
- **Space**: Start wave / Pause
- **ESC**: Menu
- **+/-**: Speed controls

### Touch (Future Mobile)
- **Tap**: Place tower, select
- **Drag**: Pan camera (if needed)
- Touch-optimized UI

## Resolution Support
- **Native**: 1920x1080 (16:9)
- **Minimum**: 1280x720
- **Scaling**: UI scales proportionally
- **Fullscreen**: Supported
- **Windowed**: Supported

## Platform-Specific

### Windows
- Standalone executable
- No dependencies

### Future Mobile
- Landscape orientation
- Touch controls
- Optimized performance
