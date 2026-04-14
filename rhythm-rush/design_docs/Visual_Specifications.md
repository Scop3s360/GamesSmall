# Rhythm Rush - Visual Specifications

## Color Palette (Hex Codes)

### Main Colors
- **Background**: `#1A0033` (Deep Purple)
- **Primary Accent**: `#00F5FF` (Cyan)
- **Secondary Accent**: `#FF10F0` (Magenta)
- **Tertiary Accent**: `#FFD700` (Gold)
- **UI Background**: `#2A1A4A` (Dark Purple)
- **Text**: `#FFFFFF` (White)

### Beat Indicator Colors
- **Perfect Hit**: `#00FF00` (Green)
- **Good Hit**: `#FFD700` (Yellow)
- **Miss**: `#FF0000` (Red)

### Gradient Effects
- **Button Gradient**: `#FF10F0` to `#00F5FF`
- **Background Gradient**: `#1A0033` to `#0A001A`

## Asset Requirements

### Click Area
- **Size**: 400x400px circle
- **Glow Effect**: Pulsing outer ring
- **Center Icon**: 128x128px music note or beat symbol

### Beat Indicator
- **Size**: 600x600px (expands from center)
- **Ring Thickness**: 8px
- **Pulse Animation**: Scale from 0.8 to 1.2

### Generator Icons
- **Size**: 64x64px (normal), 128x128px (2x)
- **Style**: Music-themed icons
- **Glow**: Subtle neon glow when active

### Background
- **Resolution**: 1920x1080px
- **Style**: Abstract music visualizer
- **Animation**: Reactive to beat

## Animation Specifications

### Beat Pulse
- **Duration**: Matches BPM (e.g., 0.5s for 120 BPM)
- **Scale**: 1.0 to 1.2 and back
- **Easing**: Ease-out
- **Glow Intensity**: Increases on beat

### Click Feedback
- **Perfect**: Green burst, 30 particles
- **Good**: Yellow burst, 20 particles
- **Miss**: Red flash, no particles
- **Duration**: 0.3 seconds

### Combo Multiplier
- **Text Scale**: Grows with combo
- **Color Shift**: White → Gold → Rainbow
- **Pulse**: On each successful hit

## AI Generation Prompts

### Generator Icons
```
"Synthwave music equipment icon, [EQUIPMENT], neon glow effect, 
80s retro aesthetic, vibrant colors, transparent background"

Equipment: beat maker, synthesizer, drum machine, mixer, speaker, amplifier
```

### Background
```
"Abstract music visualizer background, synthwave aesthetic, 
purple and cyan gradient, geometric patterns, neon glow, 
pulsing waves, retro futuristic"
```

### Click Area
```
"Glowing circular button, neon ring, music note center icon,
synthwave style, pulsing animation, vibrant colors"
```

## Style Guidelines

### Visual Rules
- Everything pulses to the beat
- High contrast neon colors
- Smooth, satisfying animations
- Clear visual feedback for timing
- Retro 80s synthwave aesthetic

### UI Design
- Dark background for eye comfort
- Neon accents for important elements
- Large, readable text
- Beat-reactive elements
- Minimal visual clutter

## Font Specifications
- **Primary Font**: Audiowide or similar synthwave font
- **Currency Display**: 36px bold
- **Generator Names**: 20px regular
- **Combo Counter**: 48px bold (scales up)
- **Color**: White with neon glow effect
