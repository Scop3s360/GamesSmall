extends Node

# Singleton GameManager - handles overall game state and coordination

signal game_phase_changed(new_phase: GameConstants.GamePhase)
signal wave_completed(wave_number: int)
signal game_over(final_score: int)

var current_phase: GameConstants.GamePhase = GameConstants.GamePhase.BUILDING
var current_wave: int = 1
var score: int = 0
var lives: int = GameConstants.INITIAL_LIVES
var is_paused: bool = false

# References to other systems (will be set when systems are created)
var grid_system: GridSystem
var block_system: BlockSystem
var combat_system: CombatSystem
var turret_system: TurretSystem
var wave_system: WaveSystem

func _ready() -> void:
	# Set up the singleton
	set_process(true)
	print("GameManager initialized")

func _input(event: InputEvent) -> void:
	# Handle global input like pause
	if event.is_action_pressed("ui_cancel"):  # ESC key
		toggle_pause()

func toggle_pause() -> void:
	is_paused = !is_paused
	if is_paused:
		change_phase(GameConstants.GamePhase.PAUSED)
		get_tree().paused = true
	else:
		get_tree().paused = false
		# Return to previous phase (for now, assume BUILDING)
		change_phase(GameConstants.GamePhase.BUILDING)

func change_phase(new_phase: GameConstants.GamePhase) -> void:
	if current_phase == new_phase:
		return
	
	var old_phase = current_phase
	current_phase = new_phase
	
	print("Game phase changed from ", GameConstants.GamePhase.keys()[old_phase], 
		  " to ", GameConstants.GamePhase.keys()[new_phase])
	
	game_phase_changed.emit(new_phase)

func start_new_game() -> void:
	current_wave = 1
	score = 0
	lives = GameConstants.INITIAL_LIVES
	change_phase(GameConstants.GamePhase.BUILDING)
	
	# Reset turret system if available
	if turret_system:
		# Clear any existing turrets
		for turret in turret_system.get_all_turrets():
			turret.queue_free()
		turret_system.active_turrets.clear()
		turret_system.selected_turret = null
	
	print("New game started")

func add_score(points: int) -> void:
	score += points
	print("Score: ", score, " (+", points, ")")

func lose_life() -> void:
	lives -= 1
	print("Life lost! Lives remaining: ", lives)
	
	if lives <= 0:
		game_over.emit(score)
		change_phase(GameConstants.GamePhase.GAME_OVER)

func complete_wave() -> void:
	print("Wave ", current_wave, " completed!")
	wave_completed.emit(current_wave)
	current_wave += 1
	change_phase(GameConstants.GamePhase.UPGRADE)

func start_next_wave() -> void:
	change_phase(GameConstants.GamePhase.COMBAT)
	print("Starting wave ", current_wave)

# Utility functions for other systems
func is_game_active() -> bool:
	return current_phase in [GameConstants.GamePhase.BUILDING, GameConstants.GamePhase.COMBAT]

func get_game_state() -> Dictionary:
	return {
		"phase": current_phase,
		"wave": current_wave,
		"score": score,
		"lives": lives,
		"paused": is_paused
	}