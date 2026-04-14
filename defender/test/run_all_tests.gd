extends Node

# Test runner to execute all test suites

func _ready() -> void:
	print("=== DEFENDER GAME TEST SUITE ===")
	print("Running all tests...")
	
	# Run tests in sequence
	await run_test_suite("res://test/test_grid_system.gd", "Grid System Tests")
	await run_test_suite("res://test/test_block_system.gd", "Block System Tests")
	await run_test_suite("res://test/test_combat_system.gd", "Combat System Tests")
	await run_test_suite("res://test/test_turret_system.gd", "Turret System Tests")
	await run_test_suite("res://test/test_integration.gd", "Integration Tests")
	
	print("=== ALL TESTS COMPLETE ===")
	print("Check output above for detailed results")
	
	# Exit after tests
	get_tree().quit()

func run_test_suite(test_path: String, suite_name: String) -> void:
	print("\n" + "=".repeat(50))
	print("RUNNING: ", suite_name)
	print("=".repeat(50))
	
	# Load and run the test
	var test_script = load(test_path)
	if test_script:
		var test_instance = test_script.new()
		add_child(test_instance)
		
		# Wait for test to complete
		await get_tree().process_frame
		await get_tree().create_timer(0.1).timeout
		
		# Clean up
		test_instance.queue_free()
	else:
		print("ERROR: Could not load test suite: ", test_path)
	
	print("COMPLETED: ", suite_name)
	print("=".repeat(50))