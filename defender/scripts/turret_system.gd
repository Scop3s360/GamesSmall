class_name TurretSystem
extends Node

# System for managing turret placement, selection, and upgrades

signal turret_placed(turret: Turret, position: Vector2i)
signal turret_selected(turret: Turret)
signal turret_deselected()
signal turret_destroyed(turret: Turret, position: Vector2i)

# Turret management
var active_turrets: Dictionary = {}  # Vector2i -> Turret
var selected_turret: Turret = null

# References to other systems
var grid_system: GridSystem = null
var combat_system: CombatSystem = null

# Turret placement settings
var placement_mode: bool = false
var placement_color: GameConstants.ColorType = GameConstants.ColorType.RED

func _ready() -> void:
	print("TurretSystem initialized")

func initialize(grid_ref: GridSystem, combat_ref: CombatSystem) -> void:
	grid_system = grid_ref
	combat_system = combat_ref
	
	# Connect to grid system signals
	if grid_system:
		grid_system.block_destroyed.connect(_on_block_destroyed)

func _input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.pressed:
		if event.button_index == MOUSE_BUTTON_LEFT:
			_handle_left_click(event.position)
		elif event.button_index == MOUSE_BUTTON_RIGHT:
			_handle_right_click(event.position)

func _handle_left_click(mouse_pos: Vector2) -> void:
	if not grid_system:
		return
	
	var grid_pos = grid_system.world_to_grid(mouse_pos)
	
	if placement_mode:
		_try_place_turret(grid_pos)
	else:
		_try_select_turret(grid_pos)

func _handle_right_click(mouse_pos: Vector2) -> void:
	# Right click to enter/exit placement mode or cancel selection
	if selected_turret:
		_deselect_turret()
	else:
		_toggle_placement_mode()

func _try_place_turret(grid_pos: Vector2i) -> bool:
	if not _can_place_turret_at(grid_pos):
		print("Cannot place turret at ", grid_pos)
		return false
	
	var turret = _create_turret(grid_pos, placement_color)
	if turret:
		active_turrets[grid_pos] = turret
		turret_placed.emit(turret, grid_pos)
		print("Turret placed at ", grid_pos, " with color ", GameConstants.ColorType.keys()[placement_color])
		
		# Exit placement mode after successful placement
		placement_mode = false
		return true
	
	return false

func _try_select_turret(grid_pos: Vector2i) -> void:
	if grid_pos in active_turrets:
		var turret = active_turrets[grid_pos]
		_select_turret(turret)
	else:
		_deselect_turret()

func _can_place_turret_at(grid_pos: Vector2i) -> bool:
	if not grid_system:
		return false
	
	# Check if there's already a turret at this position
	if grid_pos in active_turrets:
		return false
	
	# Use static validation from Turret class
	return Turret.can_place_turret_at(grid_pos, grid_system)

func _create_turret(grid_pos: Vector2i, turret_color: GameConstants.ColorType) -> Turret:
	var turret_scene = preload("res://scripts/turret.gd")
	var turret = Turret.new()
	
	# Add to scene tree
	get_tree().current_scene.add_child(turret)
	
	# Initialize turret
	turret.initialize(grid_pos, turret_color, grid_system, combat_system)
	
	# Connect turret signals
	turret.turret_destroyed.connect(_on_turret_destroyed)
	turret.turret_fired.connect(_on_turret_fired)
	
	return turret

func _select_turret(turret: Turret) -> void:
	# Deselect previous turret
	if selected_turret:
		selected_turret.hide_range_indicator()
	
	selected_turret = turret
	turret.show_range_indicator()
	turret_selected.emit(turret)
	
	print("Turret selected: ", turret.get_turret_stats())

func _deselect_turret() -> void:
	if selected_turret:
		selected_turret.hide_range_indicator()
		selected_turret = null
		turret_deselected.emit()
		print("Turret deselected")

func _toggle_placement_mode() -> void:
	placement_mode = not placement_mode
	print("Placement mode: ", placement_mode)
	
	if not placement_mode:
		_deselect_turret()

# Turret management functions
func get_turret_at(grid_pos: Vector2i) -> Turret:
	if grid_pos in active_turrets:
		return active_turrets[grid_pos]
	return null

func get_all_turrets() -> Array[Turret]:
	var turrets: Array[Turret] = []
	for turret in active_turrets.values():
		turrets.append(turret)
	return turrets

func get_turret_count() -> int:
	return active_turrets.size()

func destroy_turret_at(grid_pos: Vector2i) -> void:
	if grid_pos in active_turrets:
		var turret = active_turrets[grid_pos]
		turret.destroy()

# Color selection for placement
func set_placement_color(color: GameConstants.ColorType) -> void:
	placement_color = color
	print("Placement color set to: ", GameConstants.ColorType.keys()[color])

func cycle_placement_color() -> void:
	var colors = [
		GameConstants.ColorType.RED,
		GameConstants.ColorType.BLUE,
		GameConstants.ColorType.YELLOW,
		GameConstants.ColorType.GREEN,
		GameConstants.ColorType.ORANGE,
		GameConstants.ColorType.PURPLE
	]
	
	var current_index = colors.find(placement_color)
	var next_index = (current_index + 1) % colors.size()
	set_placement_color(colors[next_index])

# Upgrade functions
func upgrade_selected_turret_damage(increase: float) -> bool:
	if not selected_turret:
		return false
	
	# Check if player has enough score (will be integrated with GameManager)
	if GameManager and GameManager.score < GameConstants.TURRET_UPGRADE_COST:
		print("Not enough score for upgrade (need ", GameConstants.TURRET_UPGRADE_COST, ")")
		return false
	
	selected_turret.upgrade_damage(increase)
	
	# Deduct cost
	if GameManager:
		GameManager.score -= GameConstants.TURRET_UPGRADE_COST
	
	print("Turret damage upgraded by ", increase, " (cost: ", GameConstants.TURRET_UPGRADE_COST, ")")
	return true

func upgrade_selected_turret_range(increase: float) -> bool:
	if not selected_turret:
		return false
	
	# Check if player has enough score
	if GameManager and GameManager.score < GameConstants.TURRET_UPGRADE_COST:
		print("Not enough score for upgrade (need ", GameConstants.TURRET_UPGRADE_COST, ")")
		return false
	
	selected_turret.upgrade_range(increase)
	
	# Deduct cost
	if GameManager:
		GameManager.score -= GameConstants.TURRET_UPGRADE_COST
	
	print("Turret range upgraded by ", increase, " (cost: ", GameConstants.TURRET_UPGRADE_COST, ")")
	return true

func upgrade_selected_turret_fire_rate(increase: float) -> bool:
	if not selected_turret:
		return false
	
	# Check if player has enough score
	if GameManager and GameManager.score < GameConstants.TURRET_UPGRADE_COST:
		print("Not enough score for upgrade (need ", GameConstants.TURRET_UPGRADE_COST, ")")
		return false
	
	selected_turret.upgrade_fire_rate(increase)
	
	# Deduct cost
	if GameManager:
		GameManager.score -= GameConstants.TURRET_UPGRADE_COST
	
	print("Turret fire rate upgraded by ", increase, " (cost: ", GameConstants.TURRET_UPGRADE_COST, ")")
	return true

func change_selected_turret_color(new_color: GameConstants.ColorType) -> bool:
	if not selected_turret:
		return false
	
	selected_turret.set_color(new_color)
	print("Turret color changed to ", GameConstants.ColorType.keys()[new_color])
	return true

# Signal handlers
func _on_turret_destroyed(turret: Turret) -> void:
	# Find and remove turret from active list
	for grid_pos in active_turrets.keys():
		if active_turrets[grid_pos] == turret:
			active_turrets.erase(grid_pos)
			turret_destroyed.emit(turret, grid_pos)
			
			if selected_turret == turret:
				selected_turret = null
			
			print("Turret destroyed at ", grid_pos)
			break

func _on_turret_fired(projectile: Node2D) -> void:
	# Handle projectile creation and management
	print("Turret fired projectile")

func _on_block_destroyed(position: Vector2i) -> void:
	# Destroy turret if its supporting block is destroyed
	if position in active_turrets:
		var turret = active_turrets[position]
		print("Block destroyed - removing turret at ", position)
		turret.destroy()

# Validation and testing functions
func validate_turret_placement(grid_pos: Vector2i) -> Dictionary:
	var result = {
		"valid": false,
		"reason": ""
	}
	
	if not grid_system:
		result.reason = "No grid system available"
		return result
	
	if not grid_system.is_valid_position(grid_pos.x, grid_pos.y):
		result.reason = "Position out of bounds"
		return result
	
	if not grid_system.is_cell_occupied(grid_pos.x, grid_pos.y):
		result.reason = "No block at position"
		return result
	
	if grid_pos in active_turrets:
		result.reason = "Turret already exists at position"
		return result
	
	result.valid = true
	result.reason = "Valid placement"
	return result

func get_system_stats() -> Dictionary:
	return {
		"active_turrets": active_turrets.size(),
		"selected_turret": selected_turret != null,
		"placement_mode": placement_mode,
		"placement_color": GameConstants.ColorType.keys()[placement_color]
	}

# Debug functions
func debug_print_turrets() -> void:
	print("=== Active Turrets ===")
	for grid_pos in active_turrets.keys():
		var turret = active_turrets[grid_pos]
		var stats = turret.get_turret_stats()
		print("Position ", grid_pos, ": ", stats)