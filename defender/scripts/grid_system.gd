class_name GridSystem
extends Node2D

# Grid system for managing block placement, collision detection, and pathfinding

signal block_placed(position: Vector2i, block_type: GameConstants.PieceType)
signal block_destroyed(position: Vector2i)

# Grid data - stores what's in each cell
var grid_data: Array[Array] = []
var block_health: Array[Array] = []

# Grid dimensions
var grid_width: int = GameConstants.GRID_WIDTH
var grid_height: int = GameConstants.GRID_HEIGHT
var cell_size: int = GameConstants.CELL_SIZE

func _ready() -> void:
	initialize_grid()
	print("GridSystem initialized with size ", grid_width, "x", grid_height)

func initialize_grid() -> void:
	# Initialize 2D arrays for grid data and block health
	grid_data.clear()
	block_health.clear()
	
	for y in range(grid_height):
		var row_data: Array = []
		var row_health: Array = []
		for x in range(grid_width):
			row_data.append(null)  # null = empty cell
			row_health.append(0.0)  # 0 = no health (empty)
		grid_data.append(row_data)
		block_health.append(row_health)

func is_valid_position(x: int, y: int) -> bool:
	return x >= 0 and x < grid_width and y >= 0 and y < grid_height

func is_cell_occupied(x: int, y: int) -> bool:
	if not is_valid_position(x, y):
		return true  # Out of bounds counts as occupied
	return grid_data[y][x] != null

func place_block(x: int, y: int, block_type: GameConstants.PieceType, health: float = GameConstants.BASE_BLOCK_HEALTH) -> bool:
	if not is_valid_position(x, y) or is_cell_occupied(x, y):
		return false
	
	grid_data[y][x] = block_type
	block_health[y][x] = health
	
	block_placed.emit(Vector2i(x, y), block_type)
	return true

func damage_block(x: int, y: int, damage: float) -> bool:
	if not is_valid_position(x, y) or not is_cell_occupied(x, y):
		return false
	
	block_health[y][x] -= damage
	
	# Check if block is destroyed
	if block_health[y][x] <= 0:
		destroy_block(x, y)
		return true  # Block was destroyed
	
	return false  # Block damaged but not destroyed

func destroy_block(x: int, y: int) -> void:
	if not is_valid_position(x, y):
		return
	
	grid_data[y][x] = null
	block_health[y][x] = 0.0
	
	block_destroyed.emit(Vector2i(x, y))
	print("Block destroyed at (", x, ", ", y, ")")

func get_block_health(x: int, y: int) -> float:
	if not is_valid_position(x, y):
		return 0.0
	return block_health[y][x]

func get_block_type(x: int, y: int) -> GameConstants.PieceType:
	if not is_valid_position(x, y) or not is_cell_occupied(x, y):
		return GameConstants.PieceType.I  # Default return
	return grid_data[y][x]

# Coordinate conversion utilities
func world_to_grid(world_pos: Vector2) -> Vector2i:
	return Vector2i(
		int(world_pos.x / cell_size),
		int(world_pos.y / cell_size)
	)

func grid_to_world(grid_pos: Vector2i) -> Vector2:
	return Vector2(
		grid_pos.x * cell_size + cell_size / 2,
		grid_pos.y * cell_size + cell_size / 2
	)

# Get neighboring cells for pathfinding
func get_neighbors(pos: Vector2i) -> Array[Vector2i]:
	var neighbors: Array[Vector2i] = []
	var directions = [
		Vector2i(0, -1),  # Up
		Vector2i(1, 0),   # Right
		Vector2i(0, 1),   # Down
		Vector2i(-1, 0)   # Left
	]
	
	for direction in directions:
		var neighbor = pos + direction
		if is_valid_position(neighbor.x, neighbor.y):
			neighbors.append(neighbor)
	
	return neighbors

# Get valid positions for turret placement (on top of blocks)
func get_valid_turret_positions() -> Array[Vector2i]:
	var positions: Array[Vector2i] = []
	
	for y in range(grid_height):
		for x in range(grid_width):
			if is_cell_occupied(x, y):
				positions.append(Vector2i(x, y))
	
	return positions

# Basic pathfinding (A* will be implemented later)
func find_path(start: Vector2i, end: Vector2i) -> Array[Vector2i]:
	# Placeholder implementation - just return direct path for now
	# This will be replaced with proper A* pathfinding
	var path: Array[Vector2i] = []
	
	if not is_valid_position(start.x, start.y) or not is_valid_position(end.x, end.y):
		return path
	
	# Simple direct path (will be improved)
	path.append(start)
	path.append(end)
	
	return path

# Debug visualization
func _draw() -> void:
	if not is_inside_tree():
		return
		
	# Draw grid lines
	var grid_color = Color.GRAY
	grid_color.a = 0.3
	
	# Vertical lines
	for x in range(grid_width + 1):
		var start_pos = Vector2(x * cell_size, 0)
		var end_pos = Vector2(x * cell_size, grid_height * cell_size)
		draw_line(start_pos, end_pos, grid_color, 1.0)
	
	# Horizontal lines
	for y in range(grid_height + 1):
		var start_pos = Vector2(0, y * cell_size)
		var end_pos = Vector2(grid_width * cell_size, y * cell_size)
		draw_line(start_pos, end_pos, grid_color, 1.0)
	
	# Draw placed blocks
	for y in range(grid_height):
		for x in range(grid_width):
			if is_cell_occupied(x, y):
				var rect = Rect2(
					x * cell_size + 2,
					y * cell_size + 2,
					cell_size - 4,
					cell_size - 4
				)
				
				# Color based on health (red = damaged, green = healthy)
				var health_ratio = block_health[y][x] / GameConstants.BASE_BLOCK_HEALTH
				var block_color = Color.GREEN.lerp(Color.RED, 1.0 - health_ratio)
				
				draw_rect(rect, block_color)
	
	# Draw current falling piece if available
	_draw_falling_piece()

func _draw_falling_piece() -> void:
	# Get current piece from GameManager's block system
	if GameManager and GameManager.block_system:
		var current_piece = GameManager.block_system.get_current_piece()
		if current_piece:
			var occupied_cells = current_piece.get_occupied_cells()
			
			for cell in occupied_cells:
				if is_valid_position(cell.x, cell.y):
					var rect = Rect2(
						cell.x * cell_size + 4,
						cell.y * cell_size + 4,
						cell_size - 8,
						cell_size - 8
					)
					
					# Use piece color with transparency to show it's falling
					var piece_color = current_piece.color
					piece_color.a = 0.7
					
					draw_rect(rect, piece_color)
					
					# Draw outline to make it more visible
					draw_rect(rect, Color.WHITE, false, 2.0)