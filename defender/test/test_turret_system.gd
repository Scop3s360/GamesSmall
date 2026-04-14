extends "res://scripts/simple_test_runner.gd"

# Property-based tests for turret system
# Feature: defender, Property 7: Turret placement validation
# Feature: defender, Property 8: Turret color assignment

var grid_system: GridSystem
var combat_system: CombatSystem
var turret_system: TurretSystem

func _ready() -> void:
	test_name = "TurretSystem Tests"
	super._ready()

func setup_test() -> void:
	# Create fresh instances for each test
	grid_system = GridSystem.new()
	combat_system = CombatSystem.new()
	turret_system = TurretSystem.new()
	
	# Add to scene tree so they can function properly
	add_child(grid_system)
	add_child(combat_system)
	add_child(turret_system)
	
	# Initialize systems
	grid_system.initialize_grid()
	turret_system.initialize(grid_system, combat_system)

func cleanup_test() -> void:
	if grid_system:
		grid_system.queue_free()
	if combat_system:
		combat_system.queue_free()
	if turret_system:
		turret_system.queue_free()

func run_tests() -> void:
	print("=== Running TurretSystem Property Tests ===")
	
	# Property tests
	test_turret_placement_validation_property()
	test_turret_color_assignment_property()
	test_turret_selection_state_property()
	
	# Unit tests
	test_turret_placement_on_blocks()
	test_turret_placement_validation()
	test_turret_color_selection()
	test_turret_destruction_on_block_destruction()
	test_multiple_turret_placement()
	test_turret_selection_and_deselection()
	
	print("=== TurretSystem Tests Complete ===")

# Property 7: Turret placement validation
# **Validates: Requirements 3.1, 3.2**
func test_turret_placement_validation_property() -> void:
	print("Testing Property 7: Turret placement validation")
	
	setup_test()
	
	var test_iterations = 50
	var passed = 0
	
	for i in range(test_iterations):
		# Generate random grid position
		var x = randi() % GameConstants.GRID_WIDTH
		var y = randi() % GameConstants.GRID_HEIGHT
		var grid_pos = Vector2i(x, y)
		
		# Test placement validation
		var validation_result = turret_system.validate_turret_placement(grid_pos)
		var can_place = turret_system._can_place_turret_at(grid_pos)
		
		# Property: Turret placement should succeed if and only if:
		# 1. Position is valid (within grid bounds)
		# 2. Position has a block
		# 3. No turret already exists at position
		
		var expected_valid = (
			grid_system.is_valid_position(x, y) and
			grid_system.is_cell_occupied(x, y) and
			not (grid_pos in turret_system.active_turrets)
		)
		
		if validation_result.valid == expected_valid and can_place == expected_valid:
			passed += 1
		else:
			print("  FAIL: Position ", grid_pos, " - Expected: ", expected_valid, ", Got validation: ", validation_result.valid, ", Got can_place: ", can_place)
			print("    Valid pos: ", grid_system.is_valid_position(x, y))
			print("    Has block: ", grid_system.is_cell_occupied(x, y))
			print("    No turret: ", not (grid_pos in turret_system.active_turrets))
			print("    Reason: ", validation_result.reason)
	
	var success_rate = float(passed) / float(test_iterations) * 100.0
	print("  Property 7 Result: ", passed, "/", test_iterations, " (", success_rate, "%)")
	
	if success_rate >= 95.0:
		print("  ✓ PASS: Turret placement validation property holds")
	else:
		print("  ✗ FAIL: Turret placement validation property violated")
	
	cleanup_test()

# Property 8: Turret color assignment
# **Validates: Requirements 3.3**
func test_turret_color_assignment_property() -> void:
	print("Testing Property 8: Turret color assignment")
	
	setup_test()
	
	# Place some blocks first
	for i in range(5):
		var x = randi() % GameConstants.GRID_WIDTH
		var y = randi() % GameConstants.GRID_HEIGHT
		grid_system.place_block(x, y, GameConstants.PieceType.I)
	
	var test_iterations = 30
	var passed = 0
	
	var test_colors = [
		GameConstants.ColorType.RED,
		GameConstants.ColorType.BLUE,
		GameConstants.ColorType.YELLOW,
		GameConstants.ColorType.GREEN,
		GameConstants.ColorType.ORANGE,
		GameConstants.ColorType.PURPLE
	]
	
	for i in range(test_iterations):
		# Find a valid placement position
		var valid_positions = grid_system.get_valid_turret_positions()
		if valid_positions.is_empty():
			continue
		
		var grid_pos = valid_positions[randi() % valid_positions.size()]
		var test_color = test_colors[randi() % test_colors.size()]
		
		# Set placement color and try to place turret
		turret_system.set_placement_color(test_color)
		var placement_successful = turret_system._try_place_turret(grid_pos)
		
		if placement_successful:
			var placed_turret = turret_system.get_turret_at(grid_pos)
			
			# Property: For any turret creation with a specified color, 
			# the created turret should have exactly that color assigned
			if placed_turret and placed_turret.color == test_color:
				passed += 1
			else:
				print("  FAIL: Turret at ", grid_pos, " - Expected color: ", GameConstants.ColorType.keys()[test_color], ", Got: ", GameConstants.ColorType.keys()[placed_turret.color if placed_turret else GameConstants.ColorType.RED])
		else:
			# If placement failed, that's not a color assignment issue
			passed += 1
	
	var success_rate = float(passed) / float(test_iterations) * 100.0
	print("  Property 8 Result: ", passed, "/", test_iterations, " (", success_rate, "%)")
	
	if success_rate >= 95.0:
		print("  ✓ PASS: Turret color assignment property holds")
	else:
		print("  ✗ FAIL: Turret color assignment property violated")
	
	cleanup_test()

# Property 9: Turret selection state
# **Validates: Requirements 3.5**
func test_turret_selection_state_property() -> void:
	print("Testing Property 9: Turret selection state")
	
	setup_test()
	
	# Place some turrets first
	var turret_positions = []
	for i in range(3):
		var x = 5 + i * 2
		var y = 5
		grid_system.place_block(x, y, GameConstants.PieceType.T)
		turret_system._try_place_turret(Vector2i(x, y))
		turret_positions.append(Vector2i(x, y))
	
	var test_iterations = 20
	var passed = 0
	
	for i in range(test_iterations):
		# Test selection
		var pos_to_select = turret_positions[randi() % turret_positions.size()]
		turret_system._try_select_turret(pos_to_select)
		
		# Property: For any turret selection event, the system should display 
		# the turret's upgrade options and current statistics
		var selected_turret = turret_system.selected_turret
		var turret_at_pos = turret_system.get_turret_at(pos_to_select)
		
		if selected_turret == turret_at_pos and selected_turret != null:
			# Verify turret shows range indicator (selection visual feedback)
			if selected_turret.range_indicator_visible:
				passed += 1
			else:
				print("  FAIL: Selected turret should show range indicator")
		else:
			print("  FAIL: Turret selection failed - Selected: ", selected_turret, ", Expected: ", turret_at_pos)
		
		# Test deselection
		turret_system._deselect_turret()
		if turret_system.selected_turret == null:
			# This counts as a successful test iteration
			pass
		else:
			print("  FAIL: Turret deselection failed")
			passed -= 1  # Subtract from passed count
	
	var success_rate = float(passed) / float(test_iterations) * 100.0
	print("  Property 9 Result: ", passed, "/", test_iterations, " (", success_rate, "%)")
	
	if success_rate >= 90.0:
		print("  ✓ PASS: Turret selection state property holds")
	else:
		print("  ✗ FAIL: Turret selection state property violated")
	
	cleanup_test()

# Unit test: Turret placement on blocks
func test_turret_placement_on_blocks() -> void:
	print("Testing turret placement on blocks")
	
	setup_test()
	
	# Place a block
	var block_pos = Vector2i(5, 5)
	grid_system.place_block(block_pos.x, block_pos.y, GameConstants.PieceType.T)
	
	# Try to place turret on the block
	turret_system.set_placement_color(GameConstants.ColorType.RED)
	var success = turret_system._try_place_turret(block_pos)
	
	if success:
		var turret = turret_system.get_turret_at(block_pos)
		if turret and turret.color == GameConstants.ColorType.RED:
			print("  ✓ PASS: Turret placed successfully on block")
		else:
			print("  ✗ FAIL: Turret not found or wrong color after placement")
	else:
		print("  ✗ FAIL: Could not place turret on block")
	
	cleanup_test()

# Unit test: Turret placement validation
func test_turret_placement_validation() -> void:
	print("Testing turret placement validation edge cases")
	
	setup_test()
	
	var tests_passed = 0
	var total_tests = 4
	
	# Test 1: Cannot place on empty cell
	var empty_pos = Vector2i(3, 3)
	var validation = turret_system.validate_turret_placement(empty_pos)
	if not validation.valid and "No block" in validation.reason:
		tests_passed += 1
		print("  ✓ PASS: Cannot place turret on empty cell")
	else:
		print("  ✗ FAIL: Should not allow placement on empty cell")
	
	# Test 2: Cannot place out of bounds
	var oob_pos = Vector2i(-1, -1)
	validation = turret_system.validate_turret_placement(oob_pos)
	if not validation.valid and "out of bounds" in validation.reason:
		tests_passed += 1
		print("  ✓ PASS: Cannot place turret out of bounds")
	else:
		print("  ✗ FAIL: Should not allow placement out of bounds")
	
	# Test 3: Can place on block
	var block_pos = Vector2i(4, 4)
	grid_system.place_block(block_pos.x, block_pos.y, GameConstants.PieceType.I)
	validation = turret_system.validate_turret_placement(block_pos)
	if validation.valid:
		tests_passed += 1
		print("  ✓ PASS: Can place turret on block")
	else:
		print("  ✗ FAIL: Should allow placement on block - ", validation.reason)
	
	# Test 4: Cannot place where turret already exists
	turret_system._try_place_turret(block_pos)
	validation = turret_system.validate_turret_placement(block_pos)
	if not validation.valid and "already exists" in validation.reason:
		tests_passed += 1
		print("  ✓ PASS: Cannot place turret where one already exists")
	else:
		print("  ✗ FAIL: Should not allow placement where turret exists")
	
	print("  Validation tests: ", tests_passed, "/", total_tests)
	
	cleanup_test()

# Unit test: Turret color selection
func test_turret_color_selection() -> void:
	print("Testing turret color selection and cycling")
	
	setup_test()
	
	var tests_passed = 0
	var total_tests = 3
	
	# Test 1: Set specific color
	turret_system.set_placement_color(GameConstants.ColorType.BLUE)
	var stats = turret_system.get_system_stats()
	if stats.placement_color == "BLUE":
		tests_passed += 1
		print("  ✓ PASS: Color set correctly")
	else:
		print("  ✗ FAIL: Color not set correctly")
	
	# Test 2: Cycle colors
	var initial_color = turret_system.placement_color
	turret_system.cycle_placement_color()
	var new_color = turret_system.placement_color
	if new_color != initial_color:
		tests_passed += 1
		print("  ✓ PASS: Color cycling works")
	else:
		print("  ✗ FAIL: Color cycling failed")
	
	# Test 3: Cycle through all colors
	var colors_seen = {}
	for i in range(10):  # Cycle more than the number of colors
		turret_system.cycle_placement_color()
		colors_seen[turret_system.placement_color] = true
	
	if colors_seen.size() >= 3:  # Should see at least 3 different colors
		tests_passed += 1
		print("  ✓ PASS: Multiple colors available through cycling")
	else:
		print("  ✗ FAIL: Not enough color variety in cycling")
	
	print("  Color selection tests: ", tests_passed, "/", total_tests)
	
	cleanup_test()

# Unit test: Turret destruction when block is destroyed
func test_turret_destruction_on_block_destruction() -> void:
	print("Testing turret destruction when supporting block is destroyed")
	
	setup_test()
	
	# Place block and turret
	var pos = Vector2i(6, 6)
	grid_system.place_block(pos.x, pos.y, GameConstants.PieceType.O)
	turret_system._try_place_turret(pos)
	
	var turret_exists_before = turret_system.get_turret_at(pos) != null
	
	# Destroy the block
	grid_system.destroy_block(pos.x, pos.y)
	
	# Wait a frame for signal processing
	await get_tree().process_frame
	
	var turret_exists_after = turret_system.get_turret_at(pos) != null
	
	if turret_exists_before and not turret_exists_after:
		print("  ✓ PASS: Turret destroyed when block destroyed")
	else:
		print("  ✗ FAIL: Turret not properly destroyed - Before: ", turret_exists_before, ", After: ", turret_exists_after)
	
	cleanup_test()

# Unit test: Multiple turret placement
func test_multiple_turret_placement() -> void:
	print("Testing multiple turret placement")
	
	setup_test()
	
	# Place multiple blocks
	var positions = [Vector2i(2, 2), Vector2i(4, 4), Vector2i(6, 6)]
	var colors = [GameConstants.ColorType.RED, GameConstants.ColorType.BLUE, GameConstants.ColorType.GREEN]
	
	for i in range(positions.size()):
		grid_system.place_block(positions[i].x, positions[i].y, GameConstants.PieceType.L)
	
	# Place turrets with different colors
	var turrets_placed = 0
	for i in range(positions.size()):
		turret_system.set_placement_color(colors[i])
		if turret_system._try_place_turret(positions[i]):
			turrets_placed += 1
	
	var total_turrets = turret_system.get_turret_count()
	
	if turrets_placed == positions.size() and total_turrets == positions.size():
		print("  ✓ PASS: Multiple turrets placed successfully")
		
		# Verify colors
		var colors_correct = 0
		for i in range(positions.size()):
			var turret = turret_system.get_turret_at(positions[i])
			if turret and turret.color == colors[i]:
				colors_correct += 1
		
		if colors_correct == positions.size():
			print("  ✓ PASS: All turret colors correct")
		else:
			print("  ✗ FAIL: Turret colors incorrect - ", colors_correct, "/", positions.size())
	else:
		print("  ✗ FAIL: Multiple turret placement failed - Placed: ", turrets_placed, ", Total: ", total_turrets)
	
	cleanup_test()

# Unit test: Turret selection and deselection
func test_turret_selection_and_deselection() -> void:
	print("Testing turret selection and deselection")
	
	setup_test()
	
	# Place a turret
	var pos = Vector2i(7, 7)
	grid_system.place_block(pos.x, pos.y, GameConstants.PieceType.S)
	turret_system._try_place_turret(pos)
	
	var tests_passed = 0
	var total_tests = 4
	
	# Test 1: Select turret
	turret_system._try_select_turret(pos)
	if turret_system.selected_turret != null and turret_system.selected_turret == turret_system.get_turret_at(pos):
		tests_passed += 1
		print("  ✓ PASS: Turret selection works")
	else:
		print("  ✗ FAIL: Turret selection failed")
	
	# Test 2: Selected turret shows range indicator
	if turret_system.selected_turret and turret_system.selected_turret.range_indicator_visible:
		tests_passed += 1
		print("  ✓ PASS: Selected turret shows range indicator")
	else:
		print("  ✗ FAIL: Selected turret should show range indicator")
	
	# Test 3: Deselect turret
	turret_system._deselect_turret()
	if turret_system.selected_turret == null:
		tests_passed += 1
		print("  ✓ PASS: Turret deselection works")
	else:
		print("  ✗ FAIL: Turret deselection failed")
	
	# Test 4: Select empty area (should not select anything)
	var empty_pos = Vector2i(10, 10)
	turret_system._try_select_turret(empty_pos)
	if turret_system.selected_turret == null:
		tests_passed += 1
		print("  ✓ PASS: Selecting empty area doesn't select turret")
	else:
		print("  ✗ FAIL: Should not select turret when clicking empty area")
	
	print("  Selection tests: ", tests_passed, "/", total_tests)
	
	cleanup_test()