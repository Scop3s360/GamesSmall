extends GutTest

# Test suite for CombatSystem and color theory
# Feature: defender, Property 5: Color system completeness

var combat_system: CombatSystem

func before_each():
	combat_system = CombatSystem.new()

func after_each():
	if combat_system:
		combat_system.queue_free()

# Property 5: Color system completeness
# For any color type used in the game, it should be properly categorized as primary, secondary, or tertiary
func test_color_system_completeness():
	# Test that all colors are properly categorized
	var all_colors = [
		GameConstants.ColorType.RED,
		GameConstants.ColorType.BLUE,
		GameConstants.ColorType.YELLOW,
		GameConstants.ColorType.GREEN,
		GameConstants.ColorType.ORANGE,
		GameConstants.ColorType.PURPLE
	]
	
	for color in all_colors:
		var category = combat_system.get_color_category(color)
		assert_true(category in ["Primary", "Secondary", "Tertiary"], "Color should have valid category: " + str(color))
		
		var components = combat_system.get_color_components(color)
		assert_true(components.size() > 0, "Color should have at least one component: " + str(color))
		
		# Verify components are valid colors
		for component in components:
			assert_true(component in GameConstants.ColorType.values(), "Component should be valid color: " + str(component))

# Test primary color classification
func test_primary_color_classification():
	var primary_colors = [GameConstants.ColorType.RED, GameConstants.ColorType.BLUE, GameConstants.ColorType.YELLOW]
	
	for color in primary_colors:
		assert_true(combat_system.is_primary_color(color), "Should identify primary color: " + str(color))
		assert_false(combat_system.is_secondary_color(color), "Primary should not be secondary: " + str(color))
		assert_false(combat_system.is_tertiary_color(color), "Primary should not be tertiary: " + str(color))
		
		# Primary colors should be their own components
		var components = combat_system.get_color_components(color)
		assert_eq(components.size(), 1, "Primary color should have one component (itself)")
		assert_eq(components[0], color, "Primary color should be its own component")

# Test secondary color classification
func test_secondary_color_classification():
	var secondary_colors = [GameConstants.ColorType.GREEN, GameConstants.ColorType.ORANGE, GameConstants.ColorType.PURPLE]
	
	for color in secondary_colors:
		assert_false(combat_system.is_primary_color(color), "Secondary should not be primary: " + str(color))
		assert_true(combat_system.is_secondary_color(color), "Should identify secondary color: " + str(color))
		assert_false(combat_system.is_tertiary_color(color), "Secondary should not be tertiary: " + str(color))
		
		# Secondary colors should have two primary components
		var components = combat_system.get_color_components(color)
		assert_eq(components.size(), 2, "Secondary color should have two components")
		
		# Both components should be primary colors
		for component in components:
			assert_true(combat_system.is_primary_color(component), "Secondary color components should be primary")

# Test specific color mixing relationships
func test_color_mixing_relationships():
	# Test known color mixing rules
	var mixing_tests = [
		[GameConstants.ColorType.RED, GameConstants.ColorType.BLUE, GameConstants.ColorType.PURPLE],
		[GameConstants.ColorType.RED, GameConstants.ColorType.YELLOW, GameConstants.ColorType.ORANGE],
		[GameConstants.ColorType.BLUE, GameConstants.ColorType.YELLOW, GameConstants.ColorType.GREEN]
	]
	
	for test in mixing_tests:
		var color1 = test[0]
		var color2 = test[1]
		var expected_result = test[2]
		
		var mixed_color = combat_system.mix_colors(color1, color2)
		assert_eq(mixed_color, expected_result, "Color mixing should produce correct result: %s + %s = %s" % [color1, color2, expected_result])
		
		# Test that order doesn't matter
		var mixed_color_reverse = combat_system.mix_colors(color2, color1)
		assert_eq(mixed_color_reverse, expected_result, "Color mixing should be commutative")

# Test color effectiveness calculations
func test_color_effectiveness():
	# Perfect match should give 1.0 effectiveness
	var perfect_effectiveness = combat_system.get_color_effectiveness(GameConstants.ColorType.RED, GameConstants.ColorType.RED)
	assert_eq(perfect_effectiveness, 1.0, "Perfect color match should give 1.0 effectiveness")
	
	# Component match should give 0.7 effectiveness
	var component_effectiveness = combat_system.get_color_effectiveness(GameConstants.ColorType.RED, GameConstants.ColorType.ORANGE)
	assert_eq(component_effectiveness, 0.7, "Component match should give 0.7 effectiveness")
	
	# Opposite colors should give 0.1 effectiveness
	var opposite_effectiveness = combat_system.get_color_effectiveness(GameConstants.ColorType.RED, GameConstants.ColorType.GREEN)
	assert_eq(opposite_effectiveness, 0.1, "Opposite colors should give 0.1 effectiveness")
	
	# No match should give 0.3 effectiveness
	var no_match_effectiveness = combat_system.get_color_effectiveness(GameConstants.ColorType.BLUE, GameConstants.ColorType.ORANGE)
	assert_eq(no_match_effectiveness, 0.3, "No match should give 0.3 effectiveness")

# Test damage calculation
func test_damage_calculation():
	var base_damage = 100.0
	
	# Perfect match should deal full damage
	var perfect_damage = combat_system.calculate_damage(base_damage, GameConstants.ColorType.RED, GameConstants.ColorType.RED)
	assert_eq(perfect_damage, 100.0, "Perfect match should deal full damage")
	
	# Component match should deal 70% damage
	var component_damage = combat_system.calculate_damage(base_damage, GameConstants.ColorType.RED, GameConstants.ColorType.ORANGE)
	assert_eq(component_damage, 70.0, "Component match should deal 70% damage")
	
	# Opposite colors should deal 10% damage
	var opposite_damage = combat_system.calculate_damage(base_damage, GameConstants.ColorType.RED, GameConstants.ColorType.GREEN)
	assert_eq(opposite_damage, 10.0, "Opposite colors should deal 10% damage")

# Test color component relationships
func test_color_component_relationships():
	# Test that secondary colors contain their primary components
	assert_true(combat_system.has_color_component(GameConstants.ColorType.ORANGE, GameConstants.ColorType.RED), "Orange should contain Red")
	assert_true(combat_system.has_color_component(GameConstants.ColorType.ORANGE, GameConstants.ColorType.YELLOW), "Orange should contain Yellow")
	assert_false(combat_system.has_color_component(GameConstants.ColorType.ORANGE, GameConstants.ColorType.BLUE), "Orange should not contain Blue")
	
	assert_true(combat_system.has_color_component(GameConstants.ColorType.GREEN, GameConstants.ColorType.BLUE), "Green should contain Blue")
	assert_true(combat_system.has_color_component(GameConstants.ColorType.GREEN, GameConstants.ColorType.YELLOW), "Green should contain Yellow")
	assert_false(combat_system.has_color_component(GameConstants.ColorType.GREEN, GameConstants.ColorType.RED), "Green should not contain Red")
	
	assert_true(combat_system.has_color_component(GameConstants.ColorType.PURPLE, GameConstants.ColorType.RED), "Purple should contain Red")
	assert_true(combat_system.has_color_component(GameConstants.ColorType.PURPLE, GameConstants.ColorType.BLUE), "Purple should contain Blue")
	assert_false(combat_system.has_color_component(GameConstants.ColorType.PURPLE, GameConstants.ColorType.YELLOW), "Purple should not contain Yellow")

# Test color matching logic
func test_color_matching():
	# Same colors should match
	assert_true(combat_system.is_color_match(GameConstants.ColorType.RED, GameConstants.ColorType.RED), "Same colors should match")
	assert_true(combat_system.is_color_match(GameConstants.ColorType.BLUE, GameConstants.ColorType.BLUE), "Same colors should match")
	
	# Different colors should not match
	assert_false(combat_system.is_color_match(GameConstants.ColorType.RED, GameConstants.ColorType.BLUE), "Different colors should not match")
	assert_false(combat_system.is_color_match(GameConstants.ColorType.GREEN, GameConstants.ColorType.ORANGE), "Different colors should not match")

# Test effective colors calculation
func test_effective_colors():
	# Get colors effective against Red
	var effective_against_red = combat_system.get_effective_colors_against(GameConstants.ColorType.RED)
	
	# Should include Red itself (perfect match) and Orange/Purple (component matches)
	assert_true(GameConstants.ColorType.RED in effective_against_red, "Red should be effective against Red")
	assert_true(GameConstants.ColorType.ORANGE in effective_against_red, "Orange should be effective against Red (component match)")
	assert_true(GameConstants.ColorType.PURPLE in effective_against_red, "Purple should be effective against Red (component match)")
	
	# Should not include Green (opposite color)
	assert_false(GameConstants.ColorType.GREEN in effective_against_red, "Green should not be effective against Red (opposite)")

# Test related colors calculation
func test_related_colors():
	# Get colors related to Red
	var related_to_red = combat_system.get_related_colors(GameConstants.ColorType.RED)
	
	# Should include Orange and Purple (both contain Red)
	assert_true(GameConstants.ColorType.ORANGE in related_to_red, "Orange should be related to Red")
	assert_true(GameConstants.ColorType.PURPLE in related_to_red, "Purple should be related to Red")
	
	# Should not include Green (no shared components)
	assert_false(GameConstants.ColorType.GREEN in related_to_red, "Green should not be related to Red")

# Test color system validation
func test_color_system_validation():
	var is_valid = combat_system.validate_color_system()
	assert_true(is_valid, "Color system should be valid and complete")

# Test color info retrieval
func test_color_info():
	var red_info = combat_system.get_color_info(GameConstants.ColorType.RED)
	
	assert_eq(red_info.name, "RED", "Color name should be correct")
	assert_eq(red_info.category, "Primary", "Red should be categorized as Primary")
	assert_true(red_info.is_primary, "Red should be marked as primary")
	assert_false(red_info.is_secondary, "Red should not be marked as secondary")
	assert_false(red_info.is_tertiary, "Red should not be marked as tertiary")
	
	var orange_info = combat_system.get_color_info(GameConstants.ColorType.ORANGE)
	assert_eq(orange_info.category, "Secondary", "Orange should be categorized as Secondary")
	assert_false(orange_info.is_primary, "Orange should not be marked as primary")
	assert_true(orange_info.is_secondary, "Orange should be marked as secondary")