class_name Turret
extends Node2D

# Turret class for color-based defensive units

signal turret_fired(projectile: Node2D)
signal turret_destroyed(turret: Turret)
signal target_acquired(enemy: Node2D)
signal target_lost()

# Turret properties
var color: GameConstants.ColorType = GameConstants.ColorType.RED
var damage: float = GameConstants.BASE_TURRET_DAMAGE
var range: float = GameConstants.BASE_TURRET_RANGE
var fire_rate: float = GameConstants.BASE_TURRET_FIRE_RATE
var health: float = GameConstants.BASE_TURRET_HEALTH
var max_health: float = GameConstants.BASE_TURRET_HEALTH

# Position and targeting
var grid_position: Vector2i
var current_target: Node2D = null
var last_shot_time: float = 0.0

# Visual properties
var turret_size: float = 24.0
var range_indicator_visible: bool = false

# References
var grid_system: GridSystem = null
var combat_system: CombatSystem = null

func _ready() -> void:
	print("Turret created at grid position ", grid_position, " with color ", GameConstants.ColorType.keys()[color])

func _process(delta: float) -> void:
	_update_targeting()
	_try_fire()

func initialize(grid_pos: Vector2i, turret_color: GameConstants.ColorType, grid_ref: GridSystem, combat_ref: CombatSystem) -> void:
	grid_position = grid_pos
	color = turret_color
	grid_system = grid_ref
	combat_system = combat_ref
	
	# Set world position based on grid position
	if grid_system:
		position = grid_system.grid_to_world(grid_position)
	
	print("Turret initialized at ", grid_position, " with color ", GameConstants.ColorType.keys()[color])

func _update_targeting() -> void:
	# Find enemies in range
	var enemies_in_range = _find_enemies_in_range()
	
	if enemies_in_range.is_empty():
		if current_target:
			current_target = null
			target_lost.emit()
		return
	
	# Select closest enemy if no current target or current target is out of range
	if not current_target or not _is_enemy_in_range(current_target):
		current_target = _select_best_target(enemies_in_range)
		if current_target:
			target_acquired.emit(current_target)

func _find_enemies_in_range() -> Array[Node2D]:
	var enemies: Array[Node2D] = []
	
	# Get all enemies from the scene (this will be improved when enemy system is implemented)
	var scene_root = get_tree().current_scene
	if not scene_root:
		return enemies
	
	# For now, we'll return an empty array since enemies aren't implemented yet
	# This will be updated when the enemy system is added
	return enemies

func _is_enemy_in_range(enemy: Node2D) -> bool:
	if not enemy or not is_instance_valid(enemy):
		return false
	
	var distance = position.distance_to(enemy.global_position)
	return distance <= range

func _select_best_target(enemies: Array[Node2D]) -> Node2D:
	if enemies.is_empty():
		return null
	
	# Select closest enemy for now (can be improved with priority system)
	var closest_enemy: Node2D = null
	var closest_distance: float = INF
	
	for enemy in enemies:
		var distance = position.distance_to(enemy.global_position)
		if distance < closest_distance:
			closest_distance = distance
			closest_enemy = enemy
	
	return closest_enemy

func _try_fire() -> void:
	if not current_target or not _can_fire():
		return
	
	if not _has_line_of_sight(current_target):
		return
	
	_fire_at_target(current_target)

func _can_fire() -> bool:
	var current_time = Time.get_time_dict_from_system()
	var current_seconds = current_time.hour * 3600 + current_time.minute * 60 + current_time.second
	
	# Check if enough time has passed since last shot
	var time_since_last_shot = current_seconds - last_shot_time
	var required_interval = 1.0 / fire_rate
	
	return time_since_last_shot >= required_interval

func _has_line_of_sight(target: Node2D) -> bool:
	if not target or not grid_system:
		return false
	
	# Simple line of sight check - can be improved later
	var target_grid_pos = grid_system.world_to_grid(target.global_position)
	
	# For now, assume line of sight is clear if target is in range
	# This will be improved with proper raycast checking
	return _is_enemy_in_range(target)

func _fire_at_target(target: Node2D) -> void:
	if not target or not combat_system:
		return
	
	# Create projectile
	var projectile = _create_projectile(target.global_position)
	if projectile:
		turret_fired.emit(projectile)
		
		# Update last shot time
		var current_time = Time.get_time_dict_from_system()
		last_shot_time = current_time.hour * 3600 + current_time.minute * 60 + current_time.second
		
		# Emit combat system signal for projectile tracking
		combat_system.spawn_projectile(global_position, target.global_position, color, damage)

func _create_projectile(target_pos: Vector2) -> Node2D:
	# Create projectile using the existing Projectile class
	var projectile = preload("res://scripts/projectile.gd").new()
	
	# Add to scene tree
	get_tree().current_scene.add_child(projectile)
	
	# Initialize projectile
	projectile.initialize(global_position, target_pos, color, damage)
	
	# Connect projectile signals
	projectile.projectile_hit.connect(_on_projectile_hit)
	projectile.projectile_expired.connect(_on_projectile_expired)
	
	return projectile

# Turret management functions
func take_damage(damage_amount: float) -> void:
	health -= damage_amount
	health = max(0.0, health)
	
	if health <= 0.0:
		destroy()

func destroy() -> void:
	turret_destroyed.emit(self)
	queue_free()

func repair(repair_amount: float) -> void:
	health += repair_amount
	health = min(max_health, health)

func upgrade_damage(increase: float) -> void:
	damage += increase

func upgrade_range(increase: float) -> void:
	range += increase

func upgrade_fire_rate(increase: float) -> void:
	fire_rate += increase

func set_color(new_color: GameConstants.ColorType) -> void:
	color = new_color
	queue_redraw()

# Validation functions
static func can_place_turret_at(grid_pos: Vector2i, grid_system: GridSystem) -> bool:
	if not grid_system:
		return false
	
	# Check if position is valid and has a block
	if not grid_system.is_valid_position(grid_pos.x, grid_pos.y):
		return false
	
	if not grid_system.is_cell_occupied(grid_pos.x, grid_pos.y):
		return false
	
	# Check if there's already a turret at this position
	# This will be improved when turret tracking is added to grid system
	return true

func get_turret_stats() -> Dictionary:
	return {
		"color": color,
		"damage": damage,
		"range": range,
		"fire_rate": fire_rate,
		"health": health,
		"max_health": max_health,
		"grid_position": grid_position,
		"has_target": current_target != null
	}

func show_range_indicator() -> void:
	range_indicator_visible = true
	queue_redraw()

func hide_range_indicator() -> void:
	range_indicator_visible = false
	queue_redraw()

# Visual rendering
func _draw() -> void:
	# Draw range indicator if visible
	if range_indicator_visible:
		var range_color = Color.WHITE
		range_color.a = 0.3
		draw_arc(Vector2.ZERO, range, 0, TAU, 32, range_color, 2.0)
	
	# Draw turret body
	var turret_color = GameConstants.get_visual_color(color)
	draw_circle(Vector2.ZERO, turret_size / 2, turret_color)
	
	# Draw turret outline
	draw_arc(Vector2.ZERO, turret_size / 2, 0, TAU, 16, Color.BLACK, 2.0)
	
	# Draw health bar if damaged
	if health < max_health:
		_draw_health_bar()
	
	# Draw targeting line if has target
	if current_target and is_instance_valid(current_target):
		var target_direction = (current_target.global_position - global_position).normalized()
		var line_end = target_direction * (turret_size / 2 + 10)
		draw_line(Vector2.ZERO, line_end, Color.RED, 3.0)

func _draw_health_bar() -> void:
	var bar_width = turret_size
	var bar_height = 4.0
	var bar_offset = Vector2(-bar_width / 2, -turret_size / 2 - 8)
	
	# Background
	draw_rect(Rect2(bar_offset, Vector2(bar_width, bar_height)), Color.BLACK)
	
	# Health fill
	var health_ratio = health / max_health
	var health_width = bar_width * health_ratio
	var health_color = Color.GREEN.lerp(Color.RED, 1.0 - health_ratio)
	draw_rect(Rect2(bar_offset, Vector2(health_width, bar_height)), health_color)

# Input handling for selection
func _input_event(viewport: Viewport, event: InputEvent, shape_idx: int) -> void:
	if event is InputEventMouseButton and event.pressed:
		if event.button_index == MOUSE_BUTTON_LEFT:
			_on_turret_selected()

func _on_turret_selected() -> void:
	print("Turret selected at ", grid_position)
	show_range_indicator()
	
	# This will trigger UI to show turret stats and upgrade options
	# For now, just print the stats
	var stats = get_turret_stats()
	print("Turret Stats: ", stats)

# Projectile signal handlers
func _on_projectile_hit(target: Node2D, damage_dealt: float) -> void:
	print("Turret projectile hit target for ", damage_dealt, " damage")
	# Could add experience/upgrade points here

func _on_projectile_expired() -> void:
	print("Turret projectile expired without hitting target")