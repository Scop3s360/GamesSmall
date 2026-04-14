class_name TetrominoPiece
extends Resource

# Tetris piece representation with rotation support

var type: GameConstants.PieceType
var rotation: GameConstants.RotationState = GameConstants.RotationState.NORTH
var position: Vector2i = Vector2i.ZERO
var color: Color = Color.WHITE

# 4x4 grid representation of the piece shape
# Each piece type has 4 rotation states
var shape_data: Array[Array] = []

# Static shape definitions for all Tetris pieces
# Each piece has 4 rotations stored as 4x4 boolean arrays
static var PIECE_SHAPES = {
	GameConstants.PieceType.I: [
		# North (0°)
		[
			[false, false, false, false],
			[true,  true,  true,  true ],
			[false, false, false, false],
			[false, false, false, false]
		],
		# East (90°)
		[
			[false, false, true,  false],
			[false, false, true,  false],
			[false, false, true,  false],
			[false, false, true,  false]
		],
		# South (180°)
		[
			[false, false, false, false],
			[false, false, false, false],
			[true,  true,  true,  true ],
			[false, false, false, false]
		],
		# West (270°)
		[
			[false, true,  false, false],
			[false, true,  false, false],
			[false, true,  false, false],
			[false, true,  false, false]
		]
	],
	
	GameConstants.PieceType.O: [
		# All rotations are the same for O piece
		[
			[false, false, false, false],
			[false, true,  true,  false],
			[false, true,  true,  false],
			[false, false, false, false]
		],
		[
			[false, false, false, false],
			[false, true,  true,  false],
			[false, true,  true,  false],
			[false, false, false, false]
		],
		[
			[false, false, false, false],
			[false, true,  true,  false],
			[false, true,  true,  false],
			[false, false, false, false]
		],
		[
			[false, false, false, false],
			[false, true,  true,  false],
			[false, true,  true,  false],
			[false, false, false, false]
		]
	],
	
	GameConstants.PieceType.T: [
		# North
		[
			[false, false, false, false],
			[false, true,  false, false],
			[true,  true,  true,  false],
			[false, false, false, false]
		],
		# East
		[
			[false, false, false, false],
			[false, true,  false, false],
			[false, true,  true,  false],
			[false, true,  false, false]
		],
		# South
		[
			[false, false, false, false],
			[false, false, false, false],
			[true,  true,  true,  false],
			[false, true,  false, false]
		],
		# West
		[
			[false, false, false, false],
			[false, true,  false, false],
			[true,  true,  false, false],
			[false, true,  false, false]
		]
	],
	
	GameConstants.PieceType.S: [
		# North
		[
			[false, false, false, false],
			[false, true,  true,  false],
			[true,  true,  false, false],
			[false, false, false, false]
		],
		# East
		[
			[false, false, false, false],
			[false, true,  false, false],
			[false, true,  true,  false],
			[false, false, true,  false]
		],
		# South
		[
			[false, false, false, false],
			[false, false, false, false],
			[false, true,  true,  false],
			[true,  true,  false, false]
		],
		# West
		[
			[false, false, false, false],
			[true,  false, false, false],
			[true,  true,  false, false],
			[false, true,  false, false]
		]
	],
	
	GameConstants.PieceType.Z: [
		# North
		[
			[false, false, false, false],
			[true,  true,  false, false],
			[false, true,  true,  false],
			[false, false, false, false]
		],
		# East
		[
			[false, false, false, false],
			[false, false, true,  false],
			[false, true,  true,  false],
			[false, true,  false, false]
		],
		# South
		[
			[false, false, false, false],
			[false, false, false, false],
			[true,  true,  false, false],
			[false, true,  true,  false]
		],
		# West
		[
			[false, false, false, false],
			[false, true,  false, false],
			[true,  true,  false, false],
			[true,  false, false, false]
		]
	],
	
	GameConstants.PieceType.J: [
		# North
		[
			[false, false, false, false],
			[true,  false, false, false],
			[true,  true,  true,  false],
			[false, false, false, false]
		],
		# East
		[
			[false, false, false, false],
			[false, true,  true,  false],
			[false, true,  false, false],
			[false, true,  false, false]
		],
		# South
		[
			[false, false, false, false],
			[false, false, false, false],
			[true,  true,  true,  false],
			[false, false, true,  false]
		],
		# West
		[
			[false, false, false, false],
			[false, true,  false, false],
			[false, true,  false, false],
			[true,  true,  false, false]
		]
	],
	
	GameConstants.PieceType.L: [
		# North
		[
			[false, false, false, false],
			[false, false, true,  false],
			[true,  true,  true,  false],
			[false, false, false, false]
		],
		# East
		[
			[false, false, false, false],
			[false, true,  false, false],
			[false, true,  false, false],
			[false, true,  true,  false]
		],
		# South
		[
			[false, false, false, false],
			[false, false, false, false],
			[true,  true,  true,  false],
			[true,  false, false, false]
		],
		# West
		[
			[false, false, false, false],
			[true,  true,  false, false],
			[false, true,  false, false],
			[false, true,  false, false]
		]
	]
}

func _init(piece_type: GameConstants.PieceType = GameConstants.PieceType.I, start_position: Vector2i = Vector2i.ZERO) -> void:
	type = piece_type
	position = start_position
	rotation = GameConstants.RotationState.NORTH
	color = _get_piece_color(piece_type)
	_update_shape_data()

func _get_piece_color(piece_type: GameConstants.PieceType) -> Color:
	# Assign colors to different piece types for visual distinction
	match piece_type:
		GameConstants.PieceType.I:
			return Color.CYAN
		GameConstants.PieceType.O:
			return Color.YELLOW
		GameConstants.PieceType.T:
			return Color.MAGENTA
		GameConstants.PieceType.S:
			return Color.GREEN
		GameConstants.PieceType.Z:
			return Color.RED
		GameConstants.PieceType.J:
			return Color.BLUE
		GameConstants.PieceType.L:
			return Color.ORANGE
		_:
			return Color.WHITE

func _update_shape_data() -> void:
	if type in PIECE_SHAPES:
		shape_data = PIECE_SHAPES[type][rotation].duplicate(true)
	else:
		# Fallback to I piece if type is invalid
		shape_data = PIECE_SHAPES[GameConstants.PieceType.I][0].duplicate(true)

func get_occupied_cells() -> Array[Vector2i]:
	var cells: Array[Vector2i] = []
	
	for y in range(4):
		for x in range(4):
			if shape_data[y][x]:
				cells.append(Vector2i(position.x + x, position.y + y))
	
	return cells

func rotate_clockwise() -> void:
	var new_rotation = (rotation + 1) % 4
	rotation = new_rotation as GameConstants.RotationState
	_update_shape_data()

func rotate_counterclockwise() -> void:
	var new_rotation = (rotation - 1) % 4
	if new_rotation < 0:
		new_rotation = 3
	rotation = new_rotation as GameConstants.RotationState
	_update_shape_data()

func move(direction: Vector2i) -> void:
	position += direction

func get_bounding_box() -> Rect2i:
	var min_x = 4
	var max_x = -1
	var min_y = 4
	var max_y = -1
	
	for y in range(4):
		for x in range(4):
			if shape_data[y][x]:
				min_x = min(min_x, x)
				max_x = max(max_x, x)
				min_y = min(min_y, y)
				max_y = max(max_y, y)
	
	if max_x == -1:  # No blocks found
		return Rect2i(0, 0, 0, 0)
	
	return Rect2i(
		position.x + min_x,
		position.y + min_y,
		max_x - min_x + 1,
		max_y - min_y + 1
	)

# Create a copy of this piece with a different rotation for testing
func get_rotated_copy(new_rotation: GameConstants.RotationState) -> TetrominoPiece:
	var copy = TetrominoPiece.new(type, position)
	copy.rotation = new_rotation
	copy._update_shape_data()
	return copy

# Static method to create a random piece
static func create_random_piece(spawn_position: Vector2i = Vector2i.ZERO) -> TetrominoPiece:
	var piece_types = [
		GameConstants.PieceType.I,
		GameConstants.PieceType.O,
		GameConstants.PieceType.T,
		GameConstants.PieceType.S,
		GameConstants.PieceType.Z,
		GameConstants.PieceType.J,
		GameConstants.PieceType.L
	]
	
	var random_type = piece_types[randi() % piece_types.size()]
	return TetrominoPiece.new(random_type, spawn_position)

# Validate that this piece represents one of the 7 standard Tetris pieces
func is_valid_tetris_piece() -> bool:
	return type in [
		GameConstants.PieceType.I,
		GameConstants.PieceType.O,
		GameConstants.PieceType.T,
		GameConstants.PieceType.S,
		GameConstants.PieceType.Z,
		GameConstants.PieceType.J,
		GameConstants.PieceType.L
	]