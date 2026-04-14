# Rhythm Rush - Audio Specifications

## Music Tracks

### Track 1: Starter Beat
- **BPM**: 120
- **Length**: 2:00 loop
- **Style**: Simple 4/4 electronic beat
- **Instruments**: Kick, snare, hi-hat, bass synth
- **Mood**: Upbeat, accessible, beginner-friendly
- **Key**: C Major
- **AI Prompt**: "Simple electronic dance music loop, 120 BPM, 4/4 time, synthwave style, upbeat and energetic, beginner-friendly rhythm"

### Track 2: Synth Wave
- **BPM**: 128
- **Length**: 2:30 loop
- **Style**: Retro 80s synthwave
- **Instruments**: Analog synths, drum machine, arpeggiator
- **Mood**: Nostalgic, energetic, retro
- **Key**: A Minor
- **AI Prompt**: "80s synthwave music loop, 128 BPM, retro analog synths, nostalgic vibe, neon aesthetic, arpeggiator melody"

### Track 3: Digital Pulse
- **BPM**: 135
- **Length**: 2:00 loop
- **Style**: Fast electronic, glitch elements
- **Instruments**: Digital synths, glitch effects, heavy bass
- **Mood**: Intense, fast-paced, modern
- **Key**: E Minor
- **AI Prompt**: "Fast electronic music, 135 BPM, digital synths, glitch effects, intense energy, modern EDM style"

### Track 4: Chill Groove
- **BPM**: 100
- **Length**: 2:30 loop
- **Style**: Relaxed electronic, lo-fi elements
- **Instruments**: Soft synths, mellow drums, ambient pads
- **Mood**: Relaxed, chill, focus-friendly
- **Key**: G Major
- **AI Prompt**: "Chill electronic music loop, 100 BPM, lo-fi elements, relaxed vibe, soft synths, ambient atmosphere"

### Track 5: Epic Drop
- **BPM**: 140
- **Length**: 2:00 loop
- **Style**: High-energy EDM with drops
- **Instruments**: Heavy synths, powerful drums, bass drops
- **Mood**: Explosive, energetic, climactic
- **Key**: D Minor
- **AI Prompt**: "High energy EDM loop, 140 BPM, powerful bass drops, intense synths, festival energy, epic climax"

## Sound Effects

### Click Feedback
- **Perfect Click**: Bright synth hit, 0.1s, C5 note
- **Good Click**: Softer synth hit, 0.1s, G4 note
- **Miss Click**: Dull thud, 0.1s, low frequency
- **Format**: WAV, 44.1kHz, 16-bit
- **AI Prompt**: "Synth hit sound effect, bright and satisfying, electronic, short duration, game audio"

### Combo System
- **Combo 10x**: Ascending chime, 0.2s
- **Combo 25x**: Brighter chime with reverb, 0.3s
- **Combo 50x**: Epic chime with echo, 0.5s
- **Combo Break**: Descending tone, 0.3s
- **AI Prompt**: "Achievement chime sound effect, ascending notes, satisfying, electronic, game reward audio"

### Generator Sounds
- **Purchase**: Cash register + synth, 0.5s
- **Upgrade**: Power-up whoosh, 0.4s
- **Generator Active**: Subtle loop per type, 1.0s loop
- **AI Prompt**: "Power-up sound effect, electronic whoosh, satisfying upgrade sound, game audio"

### UI Sounds
- **Button Click**: Soft beep, 0.05s
- **Tab Switch**: Swoosh, 0.1s
- **Menu Open**: Rising tone, 0.2s
- **Menu Close**: Falling tone, 0.2s
- **AI Prompt**: "UI button click sound, soft electronic beep, minimal, clean, game interface audio"

### Special Events
- **Prestige Available**: Shimmering chime, 1.0s
- **Prestige Activate**: Epic fanfare, 2.0s
- **Milestone Reached**: Celebration sound, 1.5s
- **AI Prompt**: "Epic achievement fanfare, celebratory, electronic orchestra, game victory sound"

## Technical Specifications

### File Formats
- **Music**: OGG Vorbis, 192kbps, stereo
- **SFX**: WAV, 44.1kHz, 16-bit, mono (except spatial effects)
- **Compression**: Lossy for music, lossless for SFX

### Volume Levels
- **Music**: -12dB peak
- **SFX**: -6dB peak
- **Normalization**: All files normalized

### Implementation
- **Music**: Seamless looping, crossfade 0.5s
- **SFX**: Pooled for performance
- **Layering**: Max 8 simultaneous SFX
- **Beat Sync**: Music BPM exposed to game logic

## AI Generation Tools
- **Music**: Suno AI, Udio, AIVA
- **SFX**: ElevenLabs Sound Effects, Soundraw
- **Prompts**: Use provided prompts above
