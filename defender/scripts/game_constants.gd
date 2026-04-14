class_name GameConstants
extends RefCounted

# Grid Configuration
const GRID_WIDTH: int = 20
const GRID_HEIGHT: int = 15
const CELL_SIZE: int = 32

# Game Balance
const INITIAL_LIVES: int = 3
const BASE_BLOCK_HEALTH: float = 100.0
const WAVE_PREPARATION_TIME: float = 5.0

# Turret Constants
const BASE_TURRET_DAMAGE: float = 25.0
const BASE_TURRET_RANGE: float = 128.0  # 4 cells
const BASE_TURRET_FIRE_RATE: float = 1.0  # shots per second
const BASE_TURRET_HEALTH: float = 50.0
const TURRET_UPGRADE_COST: int = 10  # Score cost for upgrades

# Colors
enum ColorType {
	# Primary Colors
	RED,
	BLUE, 
	YELLOW,
	# Secondary Colors
	GREEN,    # Blue + Yellow
	ORANGE,   # Red + Yellow
	PURPLE,   # Red + Blue
	# Tertiary Colors (for future expansion)
	RED_ORANGE,
	YELLOW_ORANGE,
	YELLOW_GREEN,
	BLUE_GREEN,
	BLUE_PURPLE,
	RED_PURPLE
}

# Block Types (Tetris pieces)
enum PieceType {
	I, # Line piece
	O, # Square piece
	T, # T-shaped piece
	S, # S-shaped piece
	Z, # Z-shaped piece
	J, # J-shaped piece
	L  # L-shaped piece
}

# Rotation States
enum RotationState {
	NORTH,  # 0 degrees
	EAST,   # 90 degrees clockwise
	SOUTH,  # 180 degrees
	WEST    # 270 degrees clockwise
}

# Enemy Behaviors
enum EnemyBehavior {
	PATHFINDER,  # Tries to find paths around blocks
	DESTROYER,   # Attacks blocks to create paths
	HYBRID       # Combines both behaviors based on situation
}

# Game Phases
enum GamePhase {
	BUILDING,    # Player placing blocks and turrets
	COMBAT,      # Enemies attacking, turrets defending
	UPGRADE,     # Between waves, choosing upgrades
	PAUSED,      # Game is paused
	GAME_OVER    # Game has ended
}

# Color mixing relationships for educational purposes
static func get_color_components(color: ColorType) -> Array[ColorType]:
	match color:
		ColorType.RED, ColorType.BLUE, ColorType.YELLOW:
			return [color]  # Primary colors are their own components
		ColorType.GREEN:
			return [ColorType.BLUE, ColorType.YELLOW]
		ColorType.ORANGE:
			return [ColorType.RED, ColorType.YELLOW]
		ColorType.PURPLE:
			return [ColorType.RED, ColorType.BLUE]
		_:
			return [color]  # Default for tertiary colors

# Get visual color for rendering
static func get_visual_color(color_type: ColorType) -> Color:
	match color_type:
		ColorType.RED:
			return Color.RED
		ColorType.BLUE:
			return Color.BLUE
		ColorType.YELLOW:
			return Color.YELLOW
		ColorType.GREEN:
			return Color.GREEN
		ColorType.ORANGE:
			return Color.ORANGE
		ColorType.PURPLE:
			return Color.MAGENTA
		_:
			return Color.WHITE  # Default for unknown colors