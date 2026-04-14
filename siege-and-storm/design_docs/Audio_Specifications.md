# Siege and Storm - Audio Specifications

## Music Tracks

### Defense Phase: "Hold the Line"
- **BPM**: 100
- **Length**: 2:30 loop
- **Style**: Epic medieval orchestral
- **Instruments**: Strings, brass, war drums
- **Mood**: Defensive, strategic, tense
- **Key**: E Minor
- **AI Prompt**: "Medieval fantasy defense music, 100 BPM, orchestral, strategic tension, war drums, epic but not overwhelming, loop"

### Attack Phase: "Storm the Castle"
- **BPM**: 120
- **Length**: 2:30 loop
- **Style**: Aggressive orchestral, battle music
- **Instruments**: Heavy drums, brass fanfare, strings
- **Mood**: Aggressive, triumphant, attacking
- **Key**: D Minor
- **AI Prompt**: "Medieval battle attack music, 120 BPM, aggressive orchestral, brass fanfare, triumphant, epic assault theme, loop"

### Victory Theme
- **BPM**: 110
- **Length**: 0:30 (no loop)
- **Style**: Triumphant fanfare
- **AI Prompt**: "Victory fanfare, medieval fantasy, triumphant orchestral, celebratory, epic win music"

## Sound Effects

### Tower Actions
- **Tower Place**: Building sound, 0.5s
  - **Layers**: Hammer + stone
  - **AI Prompt**: "Medieval tower construction sound, building, hammer and stone, fantasy game audio"

- **Tower Attack - Arrow**: Bow release + whoosh, 0.4s
- **Tower Attack - Cannon**: Explosion, 0.6s
- **Tower Attack - Magic**: Mystical bolt, 0.4s
- **AI Prompt**: "Medieval tower attack sound, [TYPE], fantasy defense game audio"

- **Tower Upgrade**: Power-up sound, 0.5s
  - **AI Prompt**: "Tower upgrade sound effect, power-up, magical enhancement, fantasy game audio"

- **Tower Sell**: Destruction sound, 0.4s
  - **AI Prompt**: "Tower sell sound, deconstruction, coins, fantasy game audio"

### Enemy Actions
- **Enemy Spawn**: Portal sound, 0.5s
- **Enemy Movement**: Footsteps, 0.2s loop (varies by type)
- **Enemy Attack**: Weapon sound, 0.3s
- **Enemy Death**: Death cry, 0.4s (varies by type)
- **AI Prompt**: "Fantasy enemy [ACTION] sound, medieval creature, cartoon style, game audio"

### Projectiles
- **Arrow Flight**: Whoosh, 0.3s
- **Cannonball**: Heavy whoosh + explosion, 0.6s
- **Magic Bolt**: Mystical sound, 0.4s
- **Impact**: Thud/explosion, 0.2s
- **AI Prompt**: "Medieval projectile sound, [TYPE], flight and impact, fantasy game audio"

### Game Events
- **Wave Start**: Horn blast, 1.0s
- **Wave Complete**: Victory chime, 1.0s
- **Phase Change**: Dramatic transition, 2.0s
- **Level Complete**: Epic fanfare, 3.0s
- **Level Failed**: Defeat horn, 2.0s
- **AI Prompt**: "Medieval game event sound, [EVENT], epic, fantasy audio"

### Currency
- **Gold Gain**: Coin sound, 0.2s
- **Insufficient Funds**: Negative buzz, 0.3s
- **AI Prompt**: "Medieval gold coin sound, metallic, satisfying, fantasy currency audio"

### UI Sounds
- **Button Click**: Stone tap, 0.1s
- **Tower Select**: Selection sound, 0.1s
- **Menu Navigate**: Soft tick, 0.05s
- **AI Prompt**: "Medieval UI button click, stone tap, fantasy game interface sound"

## Technical Specifications

### File Formats
- **Music**: OGG Vorbis, 192kbps, stereo
- **SFX**: WAV, 44.1kHz, 16-bit, mono (except spatial)
- **Total Size**: ~20MB

### Volume Levels
- **Music**: -12dB peak
- **SFX**: -6dB peak
- **Normalization**: All files normalized

### Implementation
- **Music**: Seamless loop, crossfade 1.0s between phases
- **SFX**: Pooled, max 16 simultaneous
- **Spatial Audio**: Stereo panning based on position
- **Priority**: Important events override background sounds

## Audio Settings
- **Master Volume**: 0-100%
- **Music Volume**: 0-100%
- **SFX Volume**: 0-100%
- **Mute Toggle**: Instant mute all
