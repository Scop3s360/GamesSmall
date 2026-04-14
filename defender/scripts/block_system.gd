class_name BlockSystem
extends Node

# Block system for handling Tetris piece generation, movement, and placement

signal piece_generated(piece: TetrominoPiece)
signal piece_moved(piece: TetrominoPiece, direction: Vector2i)
signal piece_rotated(piece: TetrominoPiece, clockwise: bool)
signal piece_locked(piece: TetrominoPiece)

var current_piece: TetrominoPiece
var next_piece: TetrominoPiece
var grid_system: GridSystem

# Piece generation settings
var spawn_position: Vector2i = Vector2i(GameConstants.GRID_WIDTH / 2 - 2, 0)
var piece_bag: Array[GameConstants.PieceType] = []  # For 7-bag randomization

# Movement timing
var fall_timer: float = 0.0
var fall_interval: float = 1.0  # Seconds between automatic falls
var fast_fall_multiplier: float = 10.0

func _ready() -> void:
	print("BlockSystem initialized")
	_initialize_piece_bag()

func set_grid_system(grid: GridSystem) -> void:
	grid_system = grid
	print("BlockSystem connected to GridSystem")

func _process(delta: float) -> void:
	if not grid_system or not current_piece:
		return
	
	# Handle automatic falling
	fall_timer += delta
	if fall_timer >= fall_interval:
		fall_timer = 0.0
		_try_move_piece(Vector2i(0, 1))  # Move down

func _input(event: InputEvent) -> void:
	if not current_piece or not GameManager.is_game_active():
		return
	
	if event.is_action_pressed("ui_left"):
		_try_move_piece(Vector2i(-1, 0))
	elif event.is_action_pressed("ui_right"):
		_try_move_piece(Vector2i(1, 0))
	elif event.is_action_pressed("ui_down"):
		# Fast fall
		var old_interval = fall_interval
		fall_interval = fall_interval / fast_fall_multiplier
		_try_move_piece(Vector2i(0, 1))
		fall_interval = old_interval
	elif event.is_action_pressed("rotate_left"):
		_try_rotate_piece(false)
	elif event.is_action_pressed("rotate_right"):
		_try_rotate_piece(true)
	elif event.is_action_pressed("drop_fast"):
		_hard_drop_piece()

func _initialize_piece_bag() -> void:
	# 7-bag randomization ensures all pieces appear before repeating
	piece_bag = [
		GameConstants.PieceType.I,
		GameConstants.PieceType.O,
		GameConstants.PieceType.T,
		GameConstants.PieceType.S,
		GameConstants.PieceType.Z,
		GameConstants.PieceType.J,
		GameConstants.PieceType.L
	]
	piece_bag.shuffle()

func generate_next_piece() -> TetrominoPiece:
	# Use 7-bag system for fair randomization
	if piece_bag.is_empty():
		_initialize_piece_bag()
	
	var piece_type = piece_bag.pop_back()
	var piece = TetrominoPiece.new(piece_type, spawn_position)
	
	piece_generated.emit(piece)
	return piece

func spawn_new_piece() -> bool:
	# Move next piece to current, generate new next piece
	if next_piece:
		current_piece = next_piece
	else:
		current_piece = generate_next_piece()
	
	next_piece = generate_next_piece()
	
	# Check if spawn position is blocked (game over condition)
	if not can_place_piece(current_piece):
		print("Cannot spawn new piece - game over!")
		return false
	
	print("New piece spawned: ", GameConstants.PieceType.keys()[current_piece.type])
	return true

func can_move(piece: TetrominoPiece, direction: Vector2i) -> bool:
	if not piece or not grid_system:
		return false
	
	# Create a temporary piece at the new position
	var test_piece = TetrominoPiece.new(piece.type, piece.position + direction)
	test_piece.rotation = piece.rotation
	test_piece._update_shape_data()
	
	return can_place_piece(test_piece)

func can_rotate(piece: TetrominoPiece, clockwise: bool = true) -> bool:
	if not piece or not grid_system:
		return false
	
	# Create a temporary piece with the new rotation
	var new_rotation: GameConstants.RotationState
	if clockwise:
		new_rotation = ((piece.rotation + 1) % 4) as GameConstants.RotationState
	else:
		new_rotation = ((piece.rotation - 1) % 4) as GameConstants.RotationState
		if new_rotation < 0:
			new_rotation = GameConstants.RotationState.WEST
	
	var test_piece = piece.get_rotated_copy(new_rotation)
	return can_place_piece(test_piece)

func can_place_piece(piece: TetrominoPiece) -> bool:
	if not piece or not grid_system:
		return false
	
	var occupied_cells = piece.get_occupied_cells()
	
	for cell in occupied_cells:
		# Check bounds
		if not grid_system.is_valid_position(cell.x, cell.y):
			return false
		
		# Check collision with existing blocks
		if grid_system.is_cell_occupied(cell.x, cell.y):
			return false
	
	return true

func _try_move_piece(direction: Vector2i) -> bool:
	if not current_piece:
		return false
	
	if can_move(current_piece, direction):
		current_piece.move(direction)
		piece_moved.emit(current_piece, direction)
		return true
	else:
		# If we can't move down, lock the piece
		if direction.y > 0:  # Moving down
			_lock_current_piece()
		return false

func _try_rotate_piece(clockwise: bool) -> bool:
	if not current_piece:
		return false
	
	if can_rotate(current_piece, clockwise):
		if clockwise:
			current_piece.rotate_clockwise()
		else:
			current_piece.rotate_counterclockwise()
		piece_rotated.emit(current_piece, clockwise)
		return true
	
	return false

func _hard_drop_piece() -> void:
	if not current_piece:
		return
	
	# Move piece down until it can't move anymore
	while can_move(current_piece, Vector2i(0, 1)):
		current_piece.move(Vector2i(0, 1))
	
	# Lock the piece immediately
	_lock_current_piece()

func _lock_current_piece() -> void:
	if not current_piece or not grid_system:
		return
	
	var occupied_cells = current_piece.get_occupied_cells()
	
	# Place each cell of the piece in the grid
	for cell in occupied_cells:
		if grid_system.is_valid_position(cell.x, cell.y):
			grid_system.place_block(cell.x, cell.y, current_piece.type, GameConstants.BASE_BLOCK_HEALTH)
	
	piece_locked.emit(current_piece)
	print("Piece locked: ", GameConstants.PieceType.keys()[current_piece.type])
	
	# Clear current piece and spawn new one
	current_piece = null
	
	# Spawn next piece
	if not spawn_new_piece():
		# Game over
		GameManager.change_phase(GameConstants.GamePhase.GAME_OVER)

# Get the current falling piece for rendering
func get_current_piece() -> TetrominoPiece:
	return current_piece

# Get the next piece for preview
func get_next_piece() -> TetrominoPiece:
	return next_piece

# Start the block system (called when game starts)
func start_system() -> void:
	current_piece = null
	next_piece = null
	fall_timer = 0.0
	_initialize_piece_bag()
	
	if not spawn_new_piece():
		print("Failed to start block system - no space for initial piece")

# Pause/resume the falling
func set_paused(paused: bool) -> void:
	set_process(not paused)

# Adjust fall speed (for difficulty progression)
func set_fall_speed(new_interval: float) -> void:
	fall_interval = max(0.1, new_interval)  # Minimum fall interval
	print("Fall speed changed to ", fall_interval, " seconds")