extends Control
class_name GameManager

## Main game controller for Rhythm Rush

signal currency_changed(new_amount: float)
signal combo_changed(combo: int, multiplier: float)
signal beat_hit(accuracy: float)
signal beat_missed()

# Game state
var currency: float = 0.0
var total_earned: float = 0.0
var base_click_value: float = 1.0
var income_per_second: float = 0.0

# Rhythm system
var current_combo: int = 0
var max_combo: int = 0
var combo_multiplier: float = 1.0
var beat_tolerance: float = 0.2  # Seconds tolerance for "on beat"

# Beat tracking
var bpm: float = 120.0  # Beats per minute
var beat_interval: float = 0.5  # Seconds between beats (60/BPM)
var last_beat_time: float = 0.0
var next_beat_time: float = 0.0
var game_start_time: float = 0.0

# Managers
@onready var generator_manager: GeneratorManager = $GeneratorManager
@onready var rhythm_manager: RhythmManager = $RhythmManager
@onready var main_ui: MainUI = $MainUI

# Income timer
var income_timer: float = 0.0

func _ready() -> void:
	# Setup managers
	generator_manager.income_updated.connect(_on_income_updated)
	rhythm_manager.setup(bpm)
	
	# Setup UI
	main_ui.setup(self)
	
	# Initialize beat timing
	game_start_time = Time.get_time_dict_from_system()["unix"]
	beat_interval = 60.0 / bpm
	next_beat_time = game_start_time + beat_interval
	
	print("Rhythm Rush - Game Manager Ready!")
	print("BPM: ", bpm)
	print("Beat interval: ", beat_interval, " seconds")

func _process(delta: float) -> void:
	# Update beat timing
	update_beat_timing()
	
	# Generate passive income
	if income_per_second > 0:
		income_timer += delta
		if income_timer >= 0.1:  # Update 10 times per second
			add_currency(income_per_second * 0.1)
			income_timer = 0.0

func update_beat_timing() -> void:
	"""Update beat timing and visual indicators"""
	var current_time = Time.get_time_dict_from_system()["unix"]
	
	# Check if we've passed the next beat
	if current_time >= next_beat_time:
		last_beat_time = next_beat_time
		next_beat_time += beat_interval
		rhythm_manager.trigger_beat()

func _input(event: InputEvent) -> void:
	if event.is_action_pressed("click_beat"):
		handle_click()

func handle_click() -> void:
	"""Handle player click and check rhythm accuracy"""
	var current_time = Time.get_time_dict_from_system()["unix"]
	var time_to_beat = abs(current_time - next_beat_time)
	var time_from_last_beat = abs(current_time - last_beat_time)
	
	# Check if click is close to a beat (either next or last)
	var accuracy = min(time_to_beat, time_from_last_beat)
	var is_on_beat = accuracy <= beat_tolerance
	
	var click_value = base_click_value
	var accuracy_multiplier = 1.0
	
	if is_on_beat:
		# Calculate accuracy multiplier (2x to 5x based on precision)
		var precision = 1.0 - (accuracy / beat_tolerance)
		accuracy_multiplier = 2.0 + (precision * 3.0)  # 2x to 5x
		
		# Build combo
		current_combo += 1
		max_combo = max(max_combo, current_combo)
		update_combo_multiplier()
		
		beat_hit.emit(precision)
		print("On beat! Accuracy: %.2f, Multiplier: %.1fx" % [precision, accuracy_multiplier])
	else:
		# Off beat - reduced value and reset combo
		accuracy_multiplier = 0.5
		current_combo = 0
		update_combo_multiplier()
		
		beat_missed.emit()
		print("Off beat! Reduced value")
	
	# Calculate final click value
	click_value *= accuracy_multiplier * combo_multiplier
	add_currency(click_value)
	
	# Update UI
	combo_changed.emit(current_combo, combo_multiplier)

func update_combo_multiplier() -> void:
	"""Update combo multiplier based on current combo"""
	if current_combo == 0:
		combo_multiplier = 1.0
	else:
		# Combo multiplier: 1x to 10x based on combo length
		combo_multiplier = 1.0 + min(current_combo * 0.1, 9.0)

func add_currency(amount: float) -> void:
	"""Add currency and update totals"""
	currency += amount
	total_earned += amount
	currency_changed.emit(currency)

func spend_currency(amount: float) -> bool:
	"""Spend currency if available"""
	if currency >= amount:
		currency -= amount
		currency_changed.emit(currency)
		return true
	return false

func _on_income_updated(new_income: float) -> void:
	"""Update income per second from generators"""
	income_per_second = new_income
	print("Income updated: ", income_per_second, "/sec")

func change_bpm(new_bpm: float) -> void:
	"""Change the BPM of the rhythm"""
	bpm = new_bpm
	beat_interval = 60.0 / bpm
	rhythm_manager.setup(bpm)
	print("BPM changed to: ", bpm)

func get_currency() -> float:
	return currency

func get_total_earned() -> float:
	return total_earned

func get_current_combo() -> int:
	return current_combo

func get_max_combo() -> int:
	return max_combo

func get_combo_multiplier() -> float:
	return combo_multiplier

func get_income_per_second() -> float:
	return income_per_second

func get_bpm() -> float:
	return bpm

func get_beat_progress() -> float:
	"""Get progress to next beat (0.0 to 1.0)"""
	var current_time = Time.get_time_dict_from_system()["unix"]
	var time_since_last_beat = current_time - last_beat_time
	return fmod(time_since_last_beat / beat_interval, 1.0)

func format_number(num: float) -> String:
	"""Format large numbers with suffixes"""
	if num < 1000:
		return "%.1f" % num
	elif num < 1000000:
		return "%.1fK" % (num / 1000.0)
	elif num < 1000000000:
		return "%.1fM" % (num / 1000000.0)
	elif num < 1000000000000:
		return "%.1fB" % (num / 1000000000.0)
	else:
		return "%.1fT" % (num / 1000000000000.0)