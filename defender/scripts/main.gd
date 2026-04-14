extends Node2D

# Main game scene - coordinates all systems

@onready var grid_system: GridSystem = $GridSystem
@onready var block_system: BlockSystem = $BlockSystem
@onready var combat_system: CombatSystem = $CombatSystem
@onready var turret_system: TurretSystem = $TurretSystem
@onready var debug_label: Label = $UI/DebugLabel
@onready var next_piece_label: Label = $UI/NextPieceLabel
@onready var color_info_label: Label = $UI/ColorInfoLabel
@onready var turret_ui: Panel = $UI/TurretUI
@onready var turret_stats_label: Label = $UI/TurretUI/TurretStatsLabel
@onready var upgrade_damage_button: Button = $UI/TurretUI/UpgradeButtons/UpgradeDamageButton
@onready var upgrade_range_button: Button = $UI/TurretUI/UpgradeButtons/UpgradeRangeButton
@onready var upgrade_fire_rate_button: Button = $UI/TurretUI/UpgradeButtons/UpgradeFireRateButton

# Test variables for color demonstration
var test_colors: Array[GameConstants.ColorType] = [
	GameConstants.ColorType.RED,
	GameConstants.ColorType.BLUE,
	GameConstants.ColorType.YELLOW,
	GameConstants.ColorType.GREEN,
	GameConstants.ColorType.ORANGE,
	GameConstants.ColorType.PURPLE
]
var current_test_color_index: int = 0

func _ready() -> void:
	print("Main scene loaded")
	
	# Connect to GameManager
	if GameManager:
		GameManager.grid_system = grid_system
		GameManager.block_system = block_system
		GameManager.combat_system = combat_system
		GameManager.turret_system = turret_system
		GameManager.game_phase_changed.connect(_on_game_phase_changed)
		GameManager.start_new_game()
	
	# Initialize turret system
	if turret_system:
		turret_system.initialize(grid_system, combat_system)
		turret_system.turret_placed.connect(_on_turret_placed)
		turret_system.turret_selected.connect(_on_turret_selected)
		turret_system.turret_deselected.connect(_on_turret_deselected)
		turret_system.turret_destroyed.connect(_on_turret_destroyed)
	
	# Connect turret UI buttons
	if upgrade_damage_button:
		upgrade_damage_button.pressed.connect(_on_upgrade_damage_pressed)
	if upgrade_range_button:
		upgrade_range_button.pressed.connect(_on_upgrade_range_pressed)
	if upgrade_fire_rate_button:
		upgrade_fire_rate_button.pressed.connect(_on_upgrade_fire_rate_pressed)
	
	# Connect grid system signals
	if grid_system:
		grid_system.block_placed.connect(_on_block_placed)
		grid_system.block_destroyed.connect(_on_block_destroyed)
	
	# Connect block system to grid system
	if block_system and grid_system:
		block_system.set_grid_system(grid_system)
		block_system.piece_generated.connect(_on_piece_generated)
		block_system.piece_locked.connect(_on_piece_locked)
		block_system.piece_moved.connect(_on_piece_moved)
		block_system.piece_rotated.connect(_on_piece_rotated)
	
	# Connect combat system signals
	if combat_system:
		combat_system.color_match_achieved.connect(_on_color_match_achieved)
		combat_system.projectile_fired.connect(_on_projectile_fired)
		combat_system.enemy_damaged.connect(_on_enemy_damaged)
	
	# Start the block system
	if block_system:
		block_system.start_system()
	
	# Display initial color info
	_update_color_info()

func _process(_delta: float) -> void:
	_update_debug_info()
	_draw_current_piece()

func _update_debug_info() -> void:
	if debug_label and GameManager:
		var game_state = GameManager.get_game_state()
		var current_piece_info = ""
		if block_system and block_system.get_current_piece():
			var piece = block_system.get_current_piece()
			current_piece_info = " | Current: " + GameConstants.PieceType.keys()[piece.type]
		
		var turret_info = ""
		if turret_system:
			var turret_stats = turret_system.get_system_stats()
			turret_info = " | Turrets: %d | Mode: %s" % [turret_stats.active_turrets, "Place" if turret_stats.placement_mode else "Select"]
		
		debug_label.text = "Defender - Wave: %d | Score: %d | Lives: %d | Phase: %s%s%s" % [
			game_state.wave,
			game_state.score,
			game_state.lives,
			GameConstants.GamePhase.keys()[game_state.phase],
			current_piece_info,
			turret_info
		]
	
	if next_piece_label and block_system and block_system.get_next_piece():
		var next_piece = block_system.get_next_piece()
		next_piece_label.text = "Next: " + GameConstants.PieceType.keys()[next_piece.type]

func _update_color_info() -> void:
	if color_info_label and combat_system:
		var current_color = test_colors[current_test_color_index]
		var color_info = combat_system.get_color_info(current_color)
		
		var turret_color_info = ""
		if turret_system:
			var turret_stats = turret_system.get_system_stats()
			turret_color_info = "\nTurret Color: %s\nSpace: Toggle placement | Up: Cycle color" % turret_stats.placement_color
		
		color_info_label.text = "Test Color: %s (%s)\nComponents: %s\nPress C to cycle%s" % [
			color_info.name,
			color_info.category,
			str(color_info.components),
			turret_color_info
		]

func _draw_current_piece() -> void:
	# Force redraw to show current falling piece
	if grid_system:
		grid_system.queue_redraw()

func _input(event: InputEvent) -> void:
	# Test input for damaging blocks (right-click)
	if event is InputEventMouseButton and event.pressed:
		if event.button_index == MOUSE_BUTTON_RIGHT:
			_test_damage_block_at_mouse(event.position)
		elif event.button_index == MOUSE_BUTTON_LEFT:
			_test_color_effectiveness_at_mouse(event.position)
	
	# Cycle through test colors
	if event.is_action_pressed("ui_accept"):  # Enter key
		_cycle_test_color()
	
	# Turret system controls
	if event.is_action_pressed("ui_select"):  # Space key - toggle placement mode
		if turret_system:
			turret_system._toggle_placement_mode()
	
	# Cycle turret placement color
	if event.is_action_pressed("ui_up"):  # Up arrow
		if turret_system:
			turret_system.cycle_placement_color()

func _cycle_test_color() -> void:
	current_test_color_index = (current_test_color_index + 1) % test_colors.size()
	_update_color_info()
	print("Switched to test color: ", GameConstants.ColorType.keys()[test_colors[current_test_color_index]])

func _test_damage_block_at_mouse(mouse_pos: Vector2) -> void:
	if grid_system:
		var grid_pos = grid_system.world_to_grid(mouse_pos)
		if grid_system.is_cell_occupied(grid_pos.x, grid_pos.y):
			var damaged = grid_system.damage_block(grid_pos.x, grid_pos.y, 25.0)
			if damaged:
				print("Block at (", grid_pos.x, ", ", grid_pos.y, ") destroyed!")
			else:
				var health = grid_system.get_block_health(grid_pos.x, grid_pos.y)
				print("Block at (", grid_pos.x, ", ", grid_pos.y, ") damaged. Health: ", health)

func _test_color_effectiveness_at_mouse(mouse_pos: Vector2) -> void:
	if grid_system and combat_system:
		var grid_pos = grid_system.world_to_grid(mouse_pos)
		if grid_system.is_cell_occupied(grid_pos.x, grid_pos.y):
			var block_type = grid_system.get_block_type(grid_pos.x, grid_pos.y)
			var target_color = _get_color_for_block_type(block_type)
			var attacker_color = test_colors[current_test_color_index]
			
			var effectiveness = combat_system.get_color_effectiveness(attacker_color, target_color)
			var base_damage = 50.0
			var actual_damage = combat_system.calculate_damage(base_damage, attacker_color, target_color)
			
			print("Color Test: %s vs %s = %.1f%% effectiveness (%.1f damage)" % [
				GameConstants.ColorType.keys()[attacker_color],
				GameConstants.ColorType.keys()[target_color],
				effectiveness * 100.0,
				actual_damage
			])
			
			# Create visual feedback
			_create_color_feedback(grid_system.grid_to_world(grid_pos), effectiveness)

func _get_color_for_block_type(block_type: GameConstants.PieceType) -> GameConstants.ColorType:
	# Map block types to colors for testing
	match block_type:
		GameConstants.PieceType.I:
			return GameConstants.ColorType.RED
		GameConstants.PieceType.O:
			return GameConstants.ColorType.BLUE
		GameConstants.PieceType.T:
			return GameConstants.ColorType.YELLOW
		GameConstants.PieceType.S:
			return GameConstants.ColorType.GREEN
		GameConstants.PieceType.Z:
			return GameConstants.ColorType.ORANGE
		GameConstants.PieceType.J:
			return GameConstants.ColorType.PURPLE
		GameConstants.PieceType.L:
			return GameConstants.ColorType.RED
		_:
			return GameConstants.ColorType.RED

func _create_color_feedback(world_pos: Vector2, effectiveness: float) -> void:
	# Create a temporary visual effect to show color effectiveness
	var feedback_color: Color
	
	if effectiveness >= 1.0:
		feedback_color = Color.GREEN  # Perfect match
	elif effectiveness >= 0.7:
		feedback_color = Color.YELLOW  # Good match
	elif effectiveness >= 0.3:
		feedback_color = Color.ORANGE  # Weak match
	else:
		feedback_color = Color.RED  # Poor match
	
	# This would create a particle effect or temporary sprite
	# For now, just print the feedback
	var effectiveness_text = ""
	if effectiveness >= 1.0:
		effectiveness_text = "PERFECT MATCH!"
	elif effectiveness >= 0.7:
		effectiveness_text = "Good Match"
	elif effectiveness >= 0.3:
		effectiveness_text = "Weak Match"
	else:
		effectiveness_text = "Poor Match"
	
	print("Visual Feedback at ", world_pos, ": ", effectiveness_text)

func _on_game_phase_changed(new_phase: GameConstants.GamePhase) -> void:
	print("Main scene received phase change: ", GameConstants.GamePhase.keys()[new_phase])
	
	# Pause/resume block system based on game phase
	if block_system:
		var should_pause = new_phase in [GameConstants.GamePhase.PAUSED, GameConstants.GamePhase.GAME_OVER]
		block_system.set_paused(should_pause)

func _on_block_placed(position: Vector2i, block_type: GameConstants.PieceType) -> void:
	print("Block placed at (", position.x, ", ", position.y, ") - Type: ", GameConstants.PieceType.keys()[block_type])

func _on_block_destroyed(position: Vector2i) -> void:
	print("Block destroyed at (", position.x, ", ", position.y, ")")
	# Force redraw to update visual
	if grid_system:
		grid_system.queue_redraw()

func _on_piece_generated(piece: TetrominoPiece) -> void:
	print("New piece generated: ", GameConstants.PieceType.keys()[piece.type])

func _on_piece_locked(piece: TetrominoPiece) -> void:
	print("Piece locked: ", GameConstants.PieceType.keys()[piece.type])
	GameManager.add_score(10)  # Basic scoring

func _on_piece_moved(piece: TetrominoPiece, direction: Vector2i) -> void:
	# Optional: Add sound effects or visual feedback here
	pass

func _on_piece_rotated(piece: TetrominoPiece, clockwise: bool) -> void:
	# Optional: Add sound effects or visual feedback here
	pass

func _on_color_match_achieved(attacker_color: GameConstants.ColorType, target_color: GameConstants.ColorType) -> void:
	print("PERFECT COLOR MATCH: ", GameConstants.ColorType.keys()[attacker_color], " vs ", GameConstants.ColorType.keys()[target_color])
	# Add bonus score for perfect matches
	GameManager.add_score(5)

func _on_projectile_fired(from: Vector2, to: Vector2, color: GameConstants.ColorType) -> void:
	print("Projectile fired from ", from, " to ", to, " with color ", GameConstants.ColorType.keys()[color])
	# This would create a visual projectile - for now just log it

func _on_enemy_damaged(enemy: Node, damage: float, color_match: bool) -> void:
	print("Enemy damaged: ", damage, " damage, color match: ", color_match)
	if color_match:
		GameManager.add_score(2)  # Bonus for color matching

# Turret system signal handlers
func _on_turret_placed(turret: Turret, position: Vector2i) -> void:
	print("Turret placed at ", position, " - Color: ", GameConstants.ColorType.keys()[turret.color])
	GameManager.add_score(5)  # Score for placing turret

func _on_turret_selected(turret: Turret) -> void:
	print("Turret selected - Stats: ", turret.get_turret_stats())
	_show_turret_ui(turret)

func _on_turret_deselected() -> void:
	print("Turret deselected")
	_hide_turret_ui()

func _on_turret_destroyed(turret: Turret, position: Vector2i) -> void:
	print("Turret destroyed at ", position)
	_hide_turret_ui()
	# Force redraw to update visual
	if grid_system:
		grid_system.queue_redraw()

# Turret UI management
func _show_turret_ui(turret: Turret) -> void:
	if turret_ui and turret_stats_label:
		var stats = turret.get_turret_stats()
		var current_score = GameManager.score if GameManager else 0
		var upgrade_cost = GameConstants.TURRET_UPGRADE_COST
		var can_afford = current_score >= upgrade_cost
		
		turret_stats_label.text = "Turret Stats:\nColor: %s\nDamage: %.1f\nRange: %.1f\nFire Rate: %.1f/s\nHealth: %.1f/%.1f\nPosition: %s\nHas Target: %s\n\nScore: %d | Upgrade Cost: %d\nCan Afford: %s" % [
			GameConstants.ColorType.keys()[stats.color],
			stats.damage,
			stats.range,
			stats.fire_rate,
			stats.health,
			stats.max_health,
			str(stats.grid_position),
			"Yes" if stats.has_target else "No",
			current_score,
			upgrade_cost,
			"Yes" if can_afford else "No"
		]
		
		# Enable/disable upgrade buttons based on affordability
		if upgrade_damage_button:
			upgrade_damage_button.disabled = not can_afford
		if upgrade_range_button:
			upgrade_range_button.disabled = not can_afford
		if upgrade_fire_rate_button:
			upgrade_fire_rate_button.disabled = not can_afford
		
		turret_ui.visible = true

func _hide_turret_ui() -> void:
	if turret_ui:
		turret_ui.visible = false

# Turret upgrade button handlers
func _on_upgrade_damage_pressed() -> void:
	if turret_system and turret_system.upgrade_selected_turret_damage(5.0):
		print("Turret damage upgraded!")
		# Refresh UI
		if turret_system.selected_turret:
			_show_turret_ui(turret_system.selected_turret)
	else:
		print("Upgrade failed - not enough score or no turret selected")

func _on_upgrade_range_pressed() -> void:
	if turret_system and turret_system.upgrade_selected_turret_range(32.0):
		print("Turret range upgraded!")
		# Refresh UI
		if turret_system.selected_turret:
			_show_turret_ui(turret_system.selected_turret)
	else:
		print("Upgrade failed - not enough score or no turret selected")

func _on_upgrade_fire_rate_pressed() -> void:
	if turret_system and turret_system.upgrade_selected_turret_fire_rate(0.5):
		print("Turret fire rate upgraded!")
		# Refresh UI
		if turret_system.selected_turret:
			_show_turret_ui(turret_system.selected_turret)
	else:
		print("Upgrade failed - not enough score or no turret selected")