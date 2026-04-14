class_name CombatSystem
extends Node

# Combat system handling color-based damage calculations and projectile management

signal projectile_fired(from: Vector2, to: Vector2, color: GameConstants.ColorType)
signal enemy_damaged(enemy: Node, damage: float, color_match: bool)
signal color_match_achieved(attacker_color: GameConstants.ColorType, target_color: GameConstants.ColorType)

# Color effectiveness multipliers
const PERFECT_MATCH_MULTIPLIER: float = 1.0      # Same color
const COMPONENT_MATCH_MULTIPLIER: float = 0.7    # One component matches
const NO_MATCH_MULTIPLIER: float = 0.3           # No match
const OPPOSITE_MATCH_MULTIPLIER: float = 0.1     # Opposite colors

# Color relationships for educational purposes
var color_relationships: Dictionary = {}

func _ready() -> void:
	_initialize_color_relationships()
	print("CombatSystem initialized with color theory")

func _initialize_color_relationships() -> void:
	# Define color mixing relationships
	color_relationships = {
		# Primary colors are their own components
		GameConstants.ColorType.RED: [GameConstants.ColorType.RED],
		GameConstants.ColorType.BLUE: [GameConstants.ColorType.BLUE],
		GameConstants.ColorType.YELLOW: [GameConstants.ColorType.YELLOW],
		
		# Secondary colors are made from two primaries
		GameConstants.ColorType.GREEN: [GameConstants.ColorType.BLUE, GameConstants.ColorType.YELLOW],
		GameConstants.ColorType.ORANGE: [GameConstants.ColorType.RED, GameConstants.ColorType.YELLOW],
		GameConstants.ColorType.PURPLE: [GameConstants.ColorType.RED, GameConstants.ColorType.BLUE],
		
		# Tertiary colors (for future expansion)
		GameConstants.ColorType.RED_ORANGE: [GameConstants.ColorType.RED, GameConstants.ColorType.ORANGE],
		GameConstants.ColorType.YELLOW_ORANGE: [GameConstants.ColorType.YELLOW, GameConstants.ColorType.ORANGE],
		GameConstants.ColorType.YELLOW_GREEN: [GameConstants.ColorType.YELLOW, GameConstants.ColorType.GREEN],
		GameConstants.ColorType.BLUE_GREEN: [GameConstants.ColorType.BLUE, GameConstants.ColorType.GREEN],
		GameConstants.ColorType.BLUE_PURPLE: [GameConstants.ColorType.BLUE, GameConstants.ColorType.PURPLE],
		GameConstants.ColorType.RED_PURPLE: [GameConstants.ColorType.RED, GameConstants.ColorType.PURPLE]
	}

func get_color_components(color: GameConstants.ColorType) -> Array[GameConstants.ColorType]:
	if color in color_relationships:
		return color_relationships[color].duplicate()
	else:
		return [color]  # Default to self if not found

func is_primary_color(color: GameConstants.ColorType) -> bool:
	return color in [GameConstants.ColorType.RED, GameConstants.ColorType.BLUE, GameConstants.ColorType.YELLOW]

func is_secondary_color(color: GameConstants.ColorType) -> bool:
	return color in [GameConstants.ColorType.GREEN, GameConstants.ColorType.ORANGE, GameConstants.ColorType.PURPLE]

func is_tertiary_color(color: GameConstants.ColorType) -> bool:
	return color in [
		GameConstants.ColorType.RED_ORANGE,
		GameConstants.ColorType.YELLOW_ORANGE,
		GameConstants.ColorType.YELLOW_GREEN,
		GameConstants.ColorType.BLUE_GREEN,
		GameConstants.ColorType.BLUE_PURPLE,
		GameConstants.ColorType.RED_PURPLE
	]

func get_color_category(color: GameConstants.ColorType) -> String:
	if is_primary_color(color):
		return "Primary"
	elif is_secondary_color(color):
		return "Secondary"
	elif is_tertiary_color(color):
		return "Tertiary"
	else:
		return "Unknown"

# Core color matching logic
func is_color_match(attacker_color: GameConstants.ColorType, target_color: GameConstants.ColorType) -> bool:
	return attacker_color == target_color

func has_color_component(color: GameConstants.ColorType, component: GameConstants.ColorType) -> bool:
	var components = get_color_components(color)
	return component in components

func get_color_effectiveness(attacker_color: GameConstants.ColorType, target_color: GameConstants.ColorType) -> float:
	# Perfect match - same color
	if attacker_color == target_color:
		return PERFECT_MATCH_MULTIPLIER
	
	# Check if attacker color is a component of target color or vice versa
	var attacker_components = get_color_components(attacker_color)
	var target_components = get_color_components(target_color)
	
	# If attacker is a component of target, or target is a component of attacker
	if attacker_color in target_components or target_color in attacker_components:
		return COMPONENT_MATCH_MULTIPLIER
	
	# Check for shared components (e.g., Orange vs Purple both have Red)
	for attacker_comp in attacker_components:
		if attacker_comp in target_components:
			return COMPONENT_MATCH_MULTIPLIER
	
	# Check for opposite colors (complementary colors are less effective)
	if _are_opposite_colors(attacker_color, target_color):
		return OPPOSITE_MATCH_MULTIPLIER
	
	# No relationship - reduced effectiveness
	return NO_MATCH_MULTIPLIER

func _are_opposite_colors(color1: GameConstants.ColorType, color2: GameConstants.ColorType) -> bool:
	# Define complementary color pairs
	var opposite_pairs = [
		[GameConstants.ColorType.RED, GameConstants.ColorType.GREEN],
		[GameConstants.ColorType.BLUE, GameConstants.ColorType.ORANGE],
		[GameConstants.ColorType.YELLOW, GameConstants.ColorType.PURPLE]
	]
	
	for pair in opposite_pairs:
		if (color1 == pair[0] and color2 == pair[1]) or (color1 == pair[1] and color2 == pair[0]):
			return true
	
	return false

# Damage calculation
func calculate_damage(base_damage: float, attacker_color: GameConstants.ColorType, target_color: GameConstants.ColorType) -> float:
	var effectiveness = get_color_effectiveness(attacker_color, target_color)
	var final_damage = base_damage * effectiveness
	
	# Emit signal for educational feedback
	if effectiveness >= PERFECT_MATCH_MULTIPLIER:
		color_match_achieved.emit(attacker_color, target_color)
	
	return final_damage

# Color mixing for turret combinations (future feature)
func mix_colors(color1: GameConstants.ColorType, color2: GameConstants.ColorType) -> GameConstants.ColorType:
	# Handle mixing of primary colors to create secondary colors
	var colors = [color1, color2]
	colors.sort()  # Ensure consistent ordering
	
	# Primary + Primary = Secondary
	if GameConstants.ColorType.RED in colors and GameConstants.ColorType.BLUE in colors:
		return GameConstants.ColorType.PURPLE
	elif GameConstants.ColorType.RED in colors and GameConstants.ColorType.YELLOW in colors:
		return GameConstants.ColorType.ORANGE
	elif GameConstants.ColorType.BLUE in colors and GameConstants.ColorType.YELLOW in colors:
		return GameConstants.ColorType.GREEN
	
	# If same color or no valid mix, return the first color
	return color1

# Projectile management
func spawn_projectile(from: Vector2, to: Vector2, color: GameConstants.ColorType, damage: float = 10.0) -> void:
	# This will create a projectile node and manage its movement
	# For now, we'll emit a signal and handle it in the main scene
	projectile_fired.emit(from, to, color)
	print("Projectile fired from ", from, " to ", to, " with color ", GameConstants.ColorType.keys()[color])

# Educational color information
func get_color_info(color: GameConstants.ColorType) -> Dictionary:
	return {
		"name": GameConstants.ColorType.keys()[color],
		"category": get_color_category(color),
		"components": get_color_components(color),
		"visual_color": GameConstants.get_visual_color(color),
		"is_primary": is_primary_color(color),
		"is_secondary": is_secondary_color(color),
		"is_tertiary": is_tertiary_color(color)
	}

# Get all colors that would be effective against a target
func get_effective_colors_against(target_color: GameConstants.ColorType) -> Array[GameConstants.ColorType]:
	var effective_colors: Array[GameConstants.ColorType] = []
	
	# Check all possible colors
	for color_value in GameConstants.ColorType.values():
		var color = color_value as GameConstants.ColorType
		var effectiveness = get_color_effectiveness(color, target_color)
		
		# Include colors with decent effectiveness
		if effectiveness >= COMPONENT_MATCH_MULTIPLIER:
			effective_colors.append(color)
	
	return effective_colors

# Get colors that share components with the given color
func get_related_colors(color: GameConstants.ColorType) -> Array[GameConstants.ColorType]:
	var related_colors: Array[GameConstants.ColorType] = []
	var color_components = get_color_components(color)
	
	for color_value in GameConstants.ColorType.values():
		var test_color = color_value as GameConstants.ColorType
		if test_color == color:
			continue  # Skip self
		
		var test_components = get_color_components(test_color)
		
		# Check for shared components
		for component in color_components:
			if component in test_components:
				related_colors.append(test_color)
				break
	
	return related_colors

# Validate color system completeness (for testing)
func validate_color_system() -> bool:
	# Ensure all colors have valid relationships
	for color_value in GameConstants.ColorType.values():
		var color = color_value as GameConstants.ColorType
		var components = get_color_components(color)
		
		if components.is_empty():
			print("Error: Color ", GameConstants.ColorType.keys()[color], " has no components")
			return false
		
		# Ensure components are valid colors
		for component in components:
			if not component in GameConstants.ColorType.values():
				print("Error: Invalid component ", component, " for color ", GameConstants.ColorType.keys()[color])
				return false
	
	return true

# Debug function to print color relationships
func debug_print_color_relationships() -> void:
	print("=== Color Relationships ===")
	for color_value in GameConstants.ColorType.values():
		var color = color_value as GameConstants.ColorType
		var info = get_color_info(color)
		print(info.name, " (", info.category, "): ", info.components)