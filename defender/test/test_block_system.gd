extends GutTest

# Test suite for BlockSystem and TetrominoPiece
# Feature: defender, Property 1: Valid piece generation

var block_system: BlockSystem
var grid_system: GridSystem

func before_each():
	grid_system = GridSystem.new()
	grid_system.initialize_grid()
	
	block_system = BlockSystem.new()
	block_system.set_grid_system(grid_system)

func after_each():
	if block_system:
		block_system.queue_free()
	if grid_system:
		grid_system.queue_free()

# Property 1: Valid piece generation
# For any piece generation request, the BlockSystem should return one of the seven valid Tetris piece types
func test_valid_piece_generation():
	var valid_types = [
		GameConstants.PieceType.I,
		GameConstants.PieceType.O,
		GameConstants.PieceType.T,
		GameConstants.PieceType.S,
		GameConstants.PieceType.Z,
		GameConstants.PieceType.J,
		GameConstants.PieceType.L
	]
	
	# Test generating many pieces to ensure all are valid
	for i in range(100):
		var piece = block_system.generate_next_piece()
		assert_not_null(piece, "Generated piece should not be null")
		assert_true(piece.type in valid_types, "Generated piece type should be valid Tetris piece")
		assert_true(piece.is_valid_tetris_piece(), "Piece should validate as valid Tetris piece")

# Test that all 7 piece types can be generated (7-bag system)
func test_all_piece_types_generated():
	var generated_types = {}
	var valid_types = [
		GameConstants.PieceType.I,
		GameConstants.PieceType.O,
		GameConstants.PieceType.T,
		GameConstants.PieceType.S,
		GameConstants.PieceType.Z,
		GameConstants.PieceType.J,
		GameConstants.PieceType.L
	]
	
	# Generate enough pieces to ensure we see all types (7-bag guarantees this in 14 pieces max)
	for i in range(20):
		var piece = block_system.generate_next_piece()
		generated_types[piece.type] = true
	
	# Verify all 7 types were generated
	for piece_type in valid_types:
		assert_true(piece_type in generated_types, "All Tetris piece types should be generated: " + str(piece_type))

# Test piece shape data integrity
func test_piece_shape_data():
	var test_piece = TetrominoPiece.new(GameConstants.PieceType.T, Vector2i.ZERO)
	
	# Verify shape data is 4x4
	assert_eq(test_piece.shape_data.size(), 4, "Shape data should be 4 rows")
	for row in test_piece.shape_data:
		assert_eq(row.size(), 4, "Each row should have 4 columns")
	
	# Verify occupied cells are within bounds
	var occupied_cells = test_piece.get_occupied_cells()
	assert_true(occupied_cells.size() > 0, "Piece should have at least one occupied cell")
	assert_true(occupied_cells.size() <= 4, "Tetris pieces should have at most 4 blocks")

# Test piece rotation
func test_piece_rotation():
	var test_piece = TetrominoPiece.new(GameConstants.PieceType.T, Vector2i.ZERO)
	var initial_rotation = test_piece.rotation
	
	# Test clockwise rotation
	test_piece.rotate_clockwise()
	assert_ne(test_piece.rotation, initial_rotation, "Rotation should change after rotate_clockwise")
	
	# Test that 4 rotations return to original
	test_piece.rotate_clockwise()
	test_piece.rotate_clockwise()
	test_piece.rotate_clockwise()
	assert_eq(test_piece.rotation, initial_rotation, "Four clockwise rotations should return to original")
	
	# Test counterclockwise rotation
	test_piece.rotate_counterclockwise()
	assert_eq(test_piece.rotation, GameConstants.RotationState.WEST, "Counterclockwise from North should be West")

# Test piece movement
func test_piece_movement():
	var test_piece = TetrominoPiece.new(GameConstants.PieceType.I, Vector2i(5, 5))
	var initial_position = test_piece.position
	
	# Test movement
	test_piece.move(Vector2i(1, 0))
	assert_eq(test_piece.position, initial_position + Vector2i(1, 0), "Piece should move correctly")
	
	test_piece.move(Vector2i(0, 1))
	assert_eq(test_piece.position, initial_position + Vector2i(1, 1), "Piece should accumulate movement")

# Test bounding box calculation
func test_bounding_box():
	var test_piece = TetrominoPiece.new(GameConstants.PieceType.O, Vector2i(5, 5))
	var bbox = test_piece.get_bounding_box()
	
	assert_true(bbox.size.x > 0, "Bounding box should have positive width")
	assert_true(bbox.size.y > 0, "Bounding box should have positive height")
	assert_true(bbox.position.x >= test_piece.position.x, "Bounding box should be at or after piece position")
	assert_true(bbox.position.y >= test_piece.position.y, "Bounding box should be at or below piece position")

# Test collision detection with BlockSystem
func test_collision_detection():
	# Place a block in the grid
	grid_system.place_block(5, 5, GameConstants.PieceType.I)
	
	# Test piece that would collide
	var colliding_piece = TetrominoPiece.new(GameConstants.PieceType.O, Vector2i(4, 4))
	assert_false(block_system.can_place_piece(colliding_piece), "Should detect collision with existing block")
	
	# Test piece that wouldn't collide
	var non_colliding_piece = TetrominoPiece.new(GameConstants.PieceType.O, Vector2i(10, 10))
	assert_true(block_system.can_place_piece(non_colliding_piece), "Should allow placement in empty area")

# Test boundary collision
func test_boundary_collision():
	# Test piece outside left boundary
	var left_piece = TetrominoPiece.new(GameConstants.PieceType.I, Vector2i(-1, 5))
	assert_false(block_system.can_place_piece(left_piece), "Should detect collision with left boundary")
	
	# Test piece outside right boundary
	var right_piece = TetrominoPiece.new(GameConstants.PieceType.I, Vector2i(GameConstants.GRID_WIDTH, 5))
	assert_false(block_system.can_place_piece(right_piece), "Should detect collision with right boundary")
	
	# Test piece outside bottom boundary
	var bottom_piece = TetrominoPiece.new(GameConstants.PieceType.I, Vector2i(5, GameConstants.GRID_HEIGHT))
	assert_false(block_system.can_place_piece(bottom_piece), "Should detect collision with bottom boundary")
	
	# Test valid piece within boundaries
	var valid_piece = TetrominoPiece.new(GameConstants.PieceType.O, Vector2i(5, 5))
	assert_true(block_system.can_place_piece(valid_piece), "Should allow placement within boundaries")