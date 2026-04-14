# Rhythm Rush - Technical Requirements

## Engine
- **Godot Version**: 4.5.1
- **Language**: GDScript

## Required Plugins/Addons
- None (built-in audio and timing systems)

## Performance Targets
- **Frame Rate**: 60 FPS (critical for rhythm timing)
- **Memory**: < 150 MB RAM
- **Audio Latency**: < 20ms (critical for rhythm gameplay)

## Save System Requirements

### Data to Save
- Total currency earned
- Generator counts and levels
- Prestige level and bonuses
- Unlocked rhythm tracks
- Settings (volume, selected track)
- Offline progress time

### Save Format
- JSON file: `user://rhythm_rush_save.json`
- Auto-save every 30 seconds
- Save on exit

### Offline Progress
- Calculate time away
- Award currency based on generator income
- Cap at 24 hours of offline progress

## Input Methods

### Mouse
- **Left Click**: Primary interaction
- **UI**: Click buttons and generators

### Keyboard
- **Space**: Alternative click
- **1-6**: Quick-buy generators
- **ESC**: Pause/settings

### Touch (Future Mobile)
- **Tap**: Click interaction
- Touch-optimized UI
- Larger hit areas

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
- Low system requirements

### Future Mobile
- Portrait or landscape
- Battery optimization
- Touch controls
