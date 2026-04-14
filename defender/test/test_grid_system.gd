extends GutTest

# Test suite for GridSystem
# Feature: defender, Property 4: Grid size invariant

var grid_system: GridSystem

func before_each():
	grid_system = GridSystem.new()
	grid_system.initialize_grid()

func after_each():
	if grid_system:
		grid_system.queue_free()

# Property 4: Grid size invariant
# For any game state, the grid dimensions should remain constant
func test_grid_size_invariant():
	# Test that grid dimensions never change
	assert_eq(grid_system.grid_width, GameConstants.GRID_WIDTH, "Grid width should remain constant")
	assert_eq(grid_system.grid_height, GameConstants.GRID_HEIGHT, "Grid height should remain constant")
	
	# Place some blocks and verify dimensions don't change
	grid_system.place_block(5, 5, GameConstants.PieceType.I)
	grid_system.place_block(10, 10, GameConstants.PieceType.O)
	
	assert_eq(grid_system.grid_width, GameConstants.GRID_WIDTH, "Grid width unchanged after placing blocks")
	assert_eq(grid_system.grid_height, GameConstants.GRID_HEIGHT, "Grid height unchanged after placing blocks")
	
	# Destroy blocks and verify dimensions don't change
	grid_system.destroy_block(5, 5)
	
	assert_eq(grid_system.grid_width, GameConstants.GRID_WIDTH, "Grid width unchanged after destroying blocks")
	assert_eq(grid_system.grid_height, GameConstants.GRID_HEIGHT, "Grid height unchanged after destroying blocks")

# Property 22: Collision detection accuracy
# For any collision query on the grid, the result should correctly reflect the current state
func test_collision_detection_accuracy():
	# Initially all cells should be empty
	for x in range(GameConstants.GRID_WIDTH):
		for y in range(GameConstants.GRID_HEIGHT):
			assert_false(grid_system.is_cell_occupied(x, y), "Cell (%d, %d) should be empty initially" % [x, y])
	
	# Place a block and verify it's detected
	var test_x = 5
	var test_y = 7
	grid_system.place_block(test_x, test_y, GameConstants.PieceType.T)
	
	assert_true(grid_system.is_cell_occupied(test_x, test_y), "Cell should be occupied after placing block")
	
	# Verify surrounding cells are still empty
	assert_false(grid_system.is_cell_occupied(test_x + 1, test_y), "Adjacent cell should remain empty")
	assert_false(grid_system.is_cell_occupied(test_x, test_y + 1), "Adjacent cell should remain empty")
	
	# Destroy the block and verify it's no longer detected
	grid_system.destroy_block(test_x, test_y)
	assert_false(grid_system.is_cell_occupied(test_x, test_y), "Cell should be empty after destroying block")

# Test boundary conditions
func test_boundary_conditions():
	# Out of bounds should be considered occupied
	assert_true(grid_system.is_cell_occupied(-1, 0), "Out of bounds (negative) should be occupied")
	assert_true(grid_system.is_cell_occupied(GameConstants.GRID_WIDTH, 0), "Out of bounds (too wide) should be occupied")
	assert_true(grid_system.is_cell_occupied(0, GameConstants.GRID_HEIGHT), "Out of bounds (too tall) should be occupied")
	
	# Valid boundary positions should work
	assert_false(grid_system.is_cell_occupied(0, 0), "Top-left corner should be valid and empty")
	assert_false(grid_system.is_cell_occupied(GameConstants.GRID_WIDTH - 1, GameConstants.GRID_HEIGHT - 1), "Bottom-right corner should be valid and empty")

# Test coordinate conversion
func test_coordinate_conversion():
	var grid_pos = Vector2i(5, 7)
	var world_pos = grid_system.grid_to_world(grid_pos)
	var converted_back = grid_system.world_to_grid(world_pos)
	
	assert_eq(converted_back, grid_pos, "Coordinate conversion should be reversible")
	
	# Test that world position is centered in cell
	var expected_world = Vector2(
		grid_pos.x * GameConstants.CELL_SIZE + GameConstants.CELL_SIZE / 2,
		grid_pos.y * GameConstants.CELL_SIZE + GameConstants.CELL_SIZE / 2
	)
	assert_eq(world_pos, expected_world, "World position should be centered in grid cell")

# Test block health system
func test_block_health_system():
	var test_x = 3
	var test_y = 4
	var initial_health = 100.0
	
	# Place block with specific health
	grid_system.place_block(test_x, test_y, GameConstants.PieceType.I, initial_health)
	assert_eq(grid_system.get_block_health(test_x, test_y), initial_health, "Block should have correct initial health")
	
	# Damage the block
	var damage = 30.0
	var destroyed = grid_system.damage_block(test_x, test_y, damage)
	assert_false(destroyed, "Block should not be destroyed by partial damage")
	assert_eq(grid_system.get_block_health(test_x, test_y), initial_health - damage, "Block health should be reduced by damage amount")
	
	# Destroy the block with enough damage
	destroyed = grid_system.damage_block(test_x, test_y, 100.0)
	assert_true(destroyed, "Block should be destroyed by sufficient damage")
	assert_false(grid_system.is_cell_occupied(test_x, test_y), "Cell should be empty after block destruction")
	assert_eq(grid_system.get_block_health(test_x, test_y), 0.0, "Destroyed block should have zero health")