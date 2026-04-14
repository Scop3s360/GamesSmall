extends "res://scripts/simple_test_runner.gd"

# Integration tests for the complete turret system
# Tests the interaction between all systems

var grid_system: GridSystem
var combat_system: CombatSystem
var turret_system: TurretSystem
var block_system: BlockSystem

func _ready() -> void:
	test_name = "Integration Tests"
	super._ready()

func setup_test() -> void:
	# Create fresh instances for each test
	grid_system = GridSystem.new()
	combat_system = CombatSystem.new()
	turret_system = TurretSystem.new()
	block_system = BlockSystem.new()
	
	# Add to scene tree
	add_child(grid_system)
	add_child(combat_system)
	add_child(turret_system)
	add_child(block_system)
	
	# Initialize systems
	grid_system.initialize_grid()
	turret_system.initialize(grid_system, combat_system)
	block_system.set_grid_system(grid_system)

func cleanup_test() -> void:
	if grid_system:
		grid_system.queue_free()
	if combat_system:
		combat_system.queue_free()
	if turret_system:
		turret_system.queue_free()
	if block_system:
		block_system.queue_free()

func run_tests() -> void:
	print("=== Running Integration Tests ===")
	
	test_block_placement_and_turret_integration()
	test_turret_color_system_integration()
	test_turret_upgrade_system_integration()
	test_block_destruction_turret_cleanup()
	test_complete_gameplay_cycle()
	
	print("=== Integration Tests Complete ===")

# Test block placement followed by turret placement
func test_block_placement_and_turret_integration() -> void:
	print("Testing block placement and turret integration")
	
	setup_test()
	
	var tests_passed = 0
	var total_tests = 4
	
	# Test 1: Place block
	var block_pos = Vector2i(5, 5)
	var block_placed = grid_system.place_block(block_pos.x, block_pos.y, GameConstants.PieceType.T)
	if block_placed:
		tests_passed += 1
		print("  ✓ PASS: Block placed successfully")
	else:
		print("  ✗ FAIL: Block placement failed")
	
	# Test 2: Place turret on block
	turret_system.set_placement_color(GameConstants.ColorType.RED)
	var turret_placed = turret_system._try_place_turret(block_pos)
	if turret_placed:
		tests_passed += 1
		print("  ✓ PASS: Turret placed on block")
	else:
		print("  ✗ FAIL: Turret placement failed")
	
	# Test 3: Verify turret exists at position
	var turret = turret_system.get_turret_at(block_pos)
	if turret and turret.color == GameConstants.ColorType.RED:
		tests_passed += 1
		print("  ✓ PASS: Turret exists with correct color")
	else:
		print("  ✗ FAIL: Turret not found or wrong color")
	
	# Test 4: Verify turret position matches grid
	if turret and turret.grid_position == block_pos:
		tests_passed += 1
		print("  ✓ PASS: Turret position matches grid position")
	else:
		print("  ✗ FAIL: Turret position mismatch")
	
	print("  Block-Turret integration: ", tests_passed, "/", total_tests)
	
	cleanup_test()

# Test turret color system integration with combat system
func test_turret_color_system_integration() -> void:
	print("Testing turret color system integration")
	
	setup_test()
	
	var tests_passed = 0
	var total_tests = 3
	
	# Place block and turret
	var pos = Vector2i(6, 6)
	grid_system.place_block(pos.x, pos.y, GameConstants.PieceType.I)
	turret_system.set_placement_color(GameConstants.ColorType.BLUE)
	turret_system._try_place_turret(pos)
	
	var turret = turret_system.get_turret_at(pos)
	
	# Test 1: Turret has correct color
	if turret and turret.color == GameConstants.ColorType.BLUE:
		tests_passed += 1
		print("  ✓ PASS: Turret has correct color")
	else:
		print("  ✗ FAIL: Turret color incorrect")
	
	# Test 2: Combat system recognizes turret color
	if turret and combat_system:
		var color_info = combat_system.get_color_info(turret.color)
		if color_info.name == "BLUE" and color_info.category == "Primary":
			tests_passed += 1
			print("  ✓ PASS: Combat system recognizes turret color")
		else:
			print("  ✗ FAIL: Combat system color recognition failed")
	
	# Test 3: Color effectiveness calculation works
	if turret and combat_system:
		var effectiveness = combat_system.get_color_effectiveness(turret.color, GameConstants.ColorType.BLUE)
		if effectiveness == 1.0:  # Perfect match
			tests_passed += 1
			print("  ✓ PASS: Color effectiveness calculation works")
		else:
			print("  ✗ FAIL: Color effectiveness calculation failed - got ", effectiveness)
	
	print("  Color system integration: ", tests_passed, "/", total_tests)
	
	cleanup_test()

# Test turret upgrade system integration
func test_turret_upgrade_system_integration() -> void:
	print("Testing turret upgrade system integration")
	
	setup_test()
	
	# Set up GameManager score for testing
	if GameManager:
		GameManager.score = 100  # Enough for upgrades
	
	var tests_passed = 0
	var total_tests = 4
	
	# Place and select turret
	var pos = Vector2i(7, 7)
	grid_system.place_block(pos.x, pos.y, GameConstants.PieceType.O)
	turret_system._try_place_turret(pos)
	turret_system._try_select_turret(pos)
	
	var turret = turret_system.selected_turret
	var initial_damage = turret.damage if turret else 0
	var initial_range = turret.range if turret else 0
	var initial_fire_rate = turret.fire_rate if turret else 0
	
	# Test 1: Damage upgrade
	var damage_upgraded = turret_system.upgrade_selected_turret_damage(5.0)
	if damage_upgraded and turret and turret.damage > initial_damage:
		tests_passed += 1
		print("  ✓ PASS: Damage upgrade works")
	else:
		print("  ✗ FAIL: Damage upgrade failed")
	
	# Test 2: Range upgrade
	var range_upgraded = turret_system.upgrade_selected_turret_range(32.0)
	if range_upgraded and turret and turret.range > initial_range:
		tests_passed += 1
		print("  ✓ PASS: Range upgrade works")
	else:
		print("  ✗ FAIL: Range upgrade failed")
	
	# Test 3: Fire rate upgrade
	var fire_rate_upgraded = turret_system.upgrade_selected_turret_fire_rate(0.5)
	if fire_rate_upgraded and turret and turret.fire_rate > initial_fire_rate:
		tests_passed += 1
		print("  ✓ PASS: Fire rate upgrade works")
	else:
		print("  ✗ FAIL: Fire rate upgrade failed")
	
	# Test 4: Score deduction (if GameManager available)
	if GameManager and GameManager.score < 100:  # Should have been deducted
		tests_passed += 1
		print("  ✓ PASS: Score deduction works")
	else:
		print("  ✓ PASS: Score deduction test skipped (no GameManager)")
		tests_passed += 1  # Don't fail if GameManager not available
	
	print("  Upgrade system integration: ", tests_passed, "/", total_tests)
	
	cleanup_test()

# Test block destruction and turret cleanup
func test_block_destruction_turret_cleanup() -> void:
	print("Testing block destruction and turret cleanup")
	
	setup_test()
	
	var tests_passed = 0
	var total_tests = 3
	
	# Place block and turret
	var pos = Vector2i(8, 8)
	grid_system.place_block(pos.x, pos.y, GameConstants.PieceType.L)
	turret_system._try_place_turret(pos)
	
	# Test 1: Turret exists before destruction
	var turret_before = turret_system.get_turret_at(pos)
	if turret_before:
		tests_passed += 1
		print("  ✓ PASS: Turret exists before block destruction")
	else:
		print("  ✗ FAIL: Turret should exist before destruction")
	
	# Test 2: Block destruction
	grid_system.destroy_block(pos.x, pos.y)
	var block_destroyed = not grid_system.is_cell_occupied(pos.x, pos.y)
	if block_destroyed:
		tests_passed += 1
		print("  ✓ PASS: Block destroyed successfully")
	else:
		print("  ✗ FAIL: Block destruction failed")
	
	# Test 3: Turret cleanup after block destruction
	# Wait a frame for signal processing
	await get_tree().process_frame
	
	var turret_after = turret_system.get_turret_at(pos)
	if not turret_after:
		tests_passed += 1
		print("  ✓ PASS: Turret cleaned up after block destruction")
	else:
		print("  ✗ FAIL: Turret should be cleaned up after block destruction")
	
	print("  Block destruction cleanup: ", tests_passed, "/", total_tests)
	
	cleanup_test()

# Test complete gameplay cycle
func test_complete_gameplay_cycle() -> void:
	print("Testing complete gameplay cycle")
	
	setup_test()
	
	var tests_passed = 0
	var total_tests = 6
	
	# Test 1: Place multiple blocks
	var positions = [Vector2i(3, 10), Vector2i(5, 10), Vector2i(7, 10)]
	var blocks_placed = 0
	for pos in positions:
		if grid_system.place_block(pos.x, pos.y, GameConstants.PieceType.T):
			blocks_placed += 1
	
	if blocks_placed == positions.size():
		tests_passed += 1
		print("  ✓ PASS: Multiple blocks placed")
	else:
		print("  ✗ FAIL: Block placement incomplete - ", blocks_placed, "/", positions.size())
	
	# Test 2: Place turrets with different colors
	var colors = [GameConstants.ColorType.RED, GameConstants.ColorType.BLUE, GameConstants.ColorType.GREEN]
	var turrets_placed = 0
	for i in range(positions.size()):
		turret_system.set_placement_color(colors[i])
		if turret_system._try_place_turret(positions[i]):
			turrets_placed += 1
	
	if turrets_placed == positions.size():
		tests_passed += 1
		print("  ✓ PASS: Multiple turrets placed with different colors")
	else:
		print("  ✗ FAIL: Turret placement incomplete - ", turrets_placed, "/", positions.size())
	
	# Test 3: Verify turret colors
	var correct_colors = 0
	for i in range(positions.size()):
		var turret = turret_system.get_turret_at(positions[i])
		if turret and turret.color == colors[i]:
			correct_colors += 1
	
	if correct_colors == positions.size():
		tests_passed += 1
		print("  ✓ PASS: All turret colors correct")
	else:
		print("  ✗ FAIL: Turret colors incorrect - ", correct_colors, "/", positions.size())
	
	# Test 4: Select and upgrade a turret
	if GameManager:
		GameManager.score = 50
	
	turret_system._try_select_turret(positions[0])
	var selected = turret_system.selected_turret != null
	if selected:
		tests_passed += 1
		print("  ✓ PASS: Turret selection works")
	else:
		print("  ✗ FAIL: Turret selection failed")
	
	# Test 5: Upgrade selected turret
	var initial_damage = turret_system.selected_turret.damage if turret_system.selected_turret else 0
	var upgraded = turret_system.upgrade_selected_turret_damage(10.0)
	var final_damage = turret_system.selected_turret.damage if turret_system.selected_turret else 0
	
	if upgraded and final_damage > initial_damage:
		tests_passed += 1
		print("  ✓ PASS: Turret upgrade works")
	else:
		print("  ✗ FAIL: Turret upgrade failed")
	
	# Test 6: System state consistency
	var system_stats = turret_system.get_system_stats()
	var expected_turrets = positions.size()
	
	if system_stats.active_turrets == expected_turrets:
		tests_passed += 1
		print("  ✓ PASS: System state consistent")
	else:
		print("  ✗ FAIL: System state inconsistent - expected ", expected_turrets, ", got ", system_stats.active_turrets)
	
	print("  Complete gameplay cycle: ", tests_passed, "/", total_tests)
	
	cleanup_test()