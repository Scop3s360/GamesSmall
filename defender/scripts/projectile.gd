class_name Projectile
extends Node2D

# Projectile for turret attacks with color-based visuals

signal projectile_hit(target: Node2D, damage: float)
signal projectile_expired()

var color: GameConstants.ColorType = GameConstants.ColorType.RED
var damage: float = 10.0
var speed: float = 300.0  # pixels per second
var target_position: Vector2
var start_position: Vector2
var travel_distance: float = 0.0
var max_range: float = 500.0

var is_active: bool = true

func _ready() -> void:
	start_position = global_position
	# Set up visual appearance based on color
	_setup_visual()

func _setup_visual() -> void:
	# Create a simple colored circle for the projectile
	# This will be drawn in _draw()
	queue_redraw()

func _process(delta: float) -> void:
	if not is_active:
		return
	
	# Move towards target
	var direction = (target_position - global_position).normalized()
	var movement = direction * speed * delta
	
	global_position += movement
	travel_distance += movement.length()
	
	# Check if we've reached the target or max range
	var distance_to_target = global_position.distance_to(target_position)
	
	if distance_to_target < 5.0 or travel_distance >= max_range:
		_hit_target()

func _draw() -> void:
	if not is_active:
		return
	
	# Draw projectile as a colored circle
	var projectile_color = GameConstants.get_visual_color(color)
	var radius = 4.0
	
	# Draw main projectile
	draw_circle(Vector2.ZERO, radius, projectile_color)
	
	# Draw white outline for visibility
	draw_arc(Vector2.ZERO, radius, 0, TAU, 16, Color.WHITE, 1.0)
	
	# Draw trail effect
	var trail_color = projectile_color
	trail_color.a = 0.3
	draw_circle(Vector2.ZERO, radius * 1.5, trail_color)

func initialize(start_pos: Vector2, target_pos: Vector2, projectile_color: GameConstants.ColorType, projectile_damage: float = 10.0) -> void:
	global_position = start_pos
	start_position = start_pos
	target_position = target_pos
	color = projectile_color
	damage = projectile_damage
	travel_distance = 0.0
	is_active = true
	
	# Calculate direction and ensure we're facing the right way
	var direction = (target_position - start_position).normalized()
	rotation = direction.angle()
	
	queue_redraw()

func _hit_target() -> void:
	if not is_active:
		return
	
	is_active = false
	
	# Create hit effect
	_create_hit_effect()
	
	# Emit hit signal
	projectile_hit.emit(null, damage)  # Target will be determined by collision system
	
	# Remove projectile
	queue_free()

func _create_hit_effect() -> void:
	# Simple hit effect - could be enhanced with particles later
	var effect_color = GameConstants.get_visual_color(color)
	
	# Create a temporary visual effect
	var tween = create_tween()
	var original_scale = scale
	
	tween.parallel().tween_property(self, "scale", original_scale * 2.0, 0.1)
	tween.parallel().tween_property(self, "modulate:a", 0.0, 0.1)
	
	print("Projectile hit at ", global_position, " with color ", GameConstants.ColorType.keys()[color])

func set_speed(new_speed: float) -> void:
	speed = max(50.0, new_speed)  # Minimum speed

func set_max_range(new_range: float) -> void:
	max_range = max(100.0, new_range)  # Minimum range

func get_color_info() -> Dictionary:
	return {
		"color": color,
		"visual_color": GameConstants.get_visual_color(color),
		"damage": damage,
		"speed": speed
	}