extends Node2D
class_name RhythmManager

## Manages rhythm visualization and beat indicators

signal beat_triggered()

# Beat visualization
var beat_circle: Node2D
var beat_indicators: Array[Node2D] = []
var current_bpm: float = 120.0

# Visual settings
var circle_radius: float = 100.0
var indicator_count: int = 8
var beat_flash_duration: float = 0.1

# Animation
var beat_flash_timer: float = 0.0
var is_flashing: bool = false

func _ready() -> void:
	create_beat_visualization()

func setup(bpm: float) -> void:
	"""Setup rhythm manager with BPM"""
	current_bpm = bpm
	print("Rhythm Manager setup with BPM: ", bpm)

func create_beat_visualization() -> void:
	"""Create visual beat indicators"""
	# Central beat circle
	beat_circle = Node2D.new()
	add_child(beat_circle)
	
	# Create beat indicators around the circle
	for i in range(indicator_count):
		var angle = (i * 2 * PI) / indicator_count
		var indicator = create_beat_indicator(angle)
		beat_indicators.append(indicator)
		beat_circle.add_child(indicator)

func create_beat_indicator(angle: float) -> Node2D:
	"""Create a single beat indicator"""
	var indicator = Node2D.new()
	
	# Position around circle
	var pos = Vector2(cos(angle), sin(angle)) * circle_radius
	indicator.position = pos
	
	# Visual representation (colored rectangle)
	var visual = ColorRect.new()
	visual.size = Vector2(20, 20)
	visual.position = Vector2(-10, -10)
	visual.color = Color.CYAN
	indicator.add_child(visual)
	
	return indicator

func trigger_beat() -> void:
	"""Trigger beat visualization"""
	is_flashing = true
	beat_flash_timer = beat_flash_duration
	beat_triggered.emit()
	
	# Flash effect
	for indicator in beat_indicators:
		var visual = indicator.get_child(0) as ColorRect
		visual.color = Color.WHITE

func _process(delta: float) -> void:
	# Handle beat flash animation
	if is_flashing:
		beat_flash_timer -= delta
		if beat_flash_timer <= 0:
			is_flashing = false
			# Reset indicator colors
			for indicator in beat_indicators:
				var visual = indicator.get_child(0) as ColorRect
				visual.color = Color.CYAN
	
	# Rotate beat circle for visual effect
	if beat_circle:
		beat_circle.rotation += delta * 0.5  # Slow rotation

func _draw() -> void:
	"""Draw rhythm visualization"""
	# Draw central circle
	draw_circle(Vector2.ZERO, circle_radius + 10, Color.DARK_GRAY, false, 3.0)
	
	# Draw beat progress arc
	var game_manager = get_parent() as GameManager
	if game_manager:
		var progress = game_manager.get_beat_progress()
		var arc_angle = progress * 2 * PI
		
		# Draw progress arc
		var points = PackedVector2Array()
		var segments = 32
		for i in range(segments + 1):
			var angle = (float(i) / segments) * arc_angle - PI/2
			var point = Vector2(cos(angle), sin(angle)) * (circle_radius + 5)
			points.append(point)
		
		if points.size() > 1:
			for i in range(points.size() - 1):
				draw_line(points[i], points[i + 1], Color.YELLOW, 4.0)

func set_position_on_screen(screen_pos: Vector2) -> void:
	"""Set position of rhythm visualization on screen"""
	global_position = screen_pos