# Siege and Storm - Visual Specifications

## Color Palette (Hex Codes)

### Environment
- **Grass**: `#4CAF50` (Green)
- **Path**: `#8D6E63` (Brown)
- **Sky**: `#87CEEB` (Sky Blue)
- **Castle**: `#757575` (Gray Stone)

### Player Towers (Friendly)
- **Primary**: `#2196F3` (Blue)
- **Secondary**: `#1976D2` (Dark Blue)
- **Accent**: `#FFD700` (Gold)
- **Glow**: Blue glow effect

### Enemy Units (Hostile)
- **Primary**: `#F44336` (Red)
- **Secondary**: `#C62828` (Dark Red)
- **Accent**: `#FF9800` (Orange)
- **Glow**: Red glow effect

### UI
- **Currency**: `#FFD700` (Gold)
- **Button**: `#2196F3` (Blue)
- **Text**: `#FFFFFF` (White)
- **Health Bar**: `#4CAF50` (Green) to `#F44336` (Red)

## Asset Requirements

### Tower Sprites
- **Size**: 64x64px (normal), 128x128px (2x)
- **Style**: Cartoon medieval fantasy
- **Levels**: 3 visual upgrade tiers
- **Animation**: Idle, attack

### Enemy Sprites
- **Size**: 32x32px (normal), 64x64px (2x)
- **Frames**: 4-frame walk cycle
- **Style**: Cartoon fantasy creatures
- **Variety**: 6-8 different enemy types

### Base/Castle
- **Player Base**: 128x128px, blue theme
- **Enemy Base**: 128x128px, red theme
- **Style**: Medieval castle, cartoon
- **Damage States**: 3 states

### Path Tiles
- **Size**: 64x64px
- **Style**: Dirt/stone pathway
- **Seamless**: Tileable texture

### Projectiles
- **Size**: 16x16px to 32x32px
- **Types**: Arrow, cannonball, magic bolt
- **Trail**: Fading trail effect

## Animation Specifications

### Tower Attack
- **Arrow**: Projectile flies in arc
- **Cannon**: Explosion on impact
- **Magic**: Beam or bolt with glow
- **Duration**: 0.5-1.0 seconds

### Enemy Movement
- **Walk Cycle**: 4 frames, 0.4 seconds
- **Speed**: Varies by enemy type
- **Direction**: Face movement direction

### Tower Placement
- **Duration**: 0.5 seconds
- **Effect**: Build animation, fade in
- **Particles**: Dust/sparkles

### Upgrade Effect
- **Duration**: 0.3 seconds
- **Effect**: Flash, glow, size increase
- **Particles**: Sparkles around tower

## AI Generation Prompts

### Tower Sprites
```
"Cartoon medieval fantasy [TOWER TYPE], bright colors, friendly design,
blue team colors, game asset, isometric or side view, detailed but stylized,
transparent background"

Tower Types: arrow tower, cannon tower, magic tower, barracks, archer tower
```

### Enemy Sprites
```
"Cartoon fantasy [ENEMY TYPE] character, side view, simple design,
red/orange colors, medieval fantasy style, cute but menacing,
transparent background, game sprite"

Enemy Types: goblin, orc, troll, flying creature, healer, boss
```

### Environment
```
"Cartoon medieval fantasy landscape, bright colors, grass and path,
castle in background, game background asset, top-down or isometric view"
```

## Style Guidelines

### Visual Rules
- Bright, colorful cartoon style
- Clear team colors (blue vs red)
- Family-friendly aesthetic
- High contrast for visibility
- Medieval fantasy theme
- Stylized, not realistic

### Tower Design Rules
- Easily distinguishable types
- Clear visual upgrades
- Consistent art style
- Readable at small sizes

### Enemy Design Rules
- Varied silhouettes
- Clear visual hierarchy
- Consistent art style
- Cute but threatening

### UI Design
- Medieval fantasy theme
- Wood/stone textures
- Gold accents
- Clear, readable information
- Touch-friendly buttons

## Font Specifications
- **Primary Font**: MedievalSharp or similar fantasy font
- **Heading**: 32px bold
- **Body Text**: 18px regular
- **Currency**: 24px bold
- **Tower Cost**: 16px medium
- **Wave Counter**: 28px bold
- **Color**: White with dark outline
