extends Control
class_name MainUI

## Main UI controller for Rhythm Rush

# UI References
@onready var currency_label: Label = $VBoxContainer/TopPanel/CurrencyLabel
@onready var income_label: Label = $VBoxContainer/TopPanel/IncomeLabel
@onready var combo_label: Label = $VBoxContainer/TopPanel/ComboLabel

@onready var bpm_label: Label = $VBoxContainer/RhythmPanel/BPMLabel
@onready var beat_feedback_label: Label = $VBoxContainer/RhythmPanel/BeatFeedbackLabel

@onready var click_area: Button = $VBoxContainer/GameArea/ClickArea
@onready var generators_container: VBoxContainer = $VBoxContainer/GameArea/GeneratorsScroll/GeneratorsContainer

# Game Manager reference
var game_manager: GameManager

# Generator UI elements
var generator_buttons: Array[Button] = []

# Feedback timer
var feedback_timer: float = 0.0
var feedback_duration: float = 1.0

func _ready() -> void:
	print("Main UI initialized")

func setup(gm: GameManager) -> void:
	"""Setup UI with game manager reference"""
	game_manager = gm
	
	# Connect signals
	game_manager.currency_changed.connect(_on_currency_changed)
	game_manager.combo_changed.connect(_on_combo_changed)
	game_manager.beat_hit.connect(_on_beat_hit)
	game_manager.beat_missed.connect(_on_beat_missed)
	
	# Connect click area
	click_area.pressed.connect(_on_click_area_pressed)
	
	# Setup generators UI
	setup_generators_ui()
	
	# Initial UI update
	update_all_ui()

func _process(delta: float) -> void:
	# Update feedback timer
	if feedback_timer > 0:
		feedback_timer -= delta
		if feedback_timer <= 0:
			beat_feedback_label.text = "Click to the beat!"
			beat_feedback_label.modulate = Color.WHITE

func setup_generators_ui() -> void:
	"""Create UI elements for all generators"""
	var generators_data = game_manager.generator_manager.get_all_generators_data()
	
	for i in range(generators_data.size()):
		var generator_data = generators_data[i]
		
		# Create generator container
		var generator_container = HBoxContainer.new()
		generators_container.add_child(generator_container)
		
		# Generator info label
		var info_label = Label.new()
		info_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		info_label.text = "%s (0 owned) - $%.1f/sec each" % [generator_data.name, generator_data.base_income]
		generator_container.add_child(info_label)
		
		# Buy button
		var buy_button = Button.new()
		buy_button.text = "Buy ($%.1f)" % generator_data.cost
		buy_button.pressed.connect(_on_generator_buy_pressed.bind(i))
		generator_container.add_child(buy_button)
		
		generator_buttons.append(buy_button)

func _on_click_area_pressed() -> void:
	"""Handle click area press"""
	game_manager.handle_click()

func _on_generator_buy_pressed(generator_index: int) -> void:
	"""Handle generator purchase"""
	var current_currency = game_manager.get_currency()
	var remaining_currency = game_manager.generator_manager.purchase_generator(generator_index, current_currency)
	
	if remaining_currency != current_currency:
		# Purchase successful, update currency
		game_manager.currency = remaining_currency
		game_manager.currency_changed.emit(remaining_currency)
		update_generators_ui()

func _on_currency_changed(new_amount: float) -> void:
	"""Update currency display"""
	currency_label.text = "Currency: $%s" % game_manager.format_number(new_amount)
	update_generators_ui()

func _on_combo_changed(combo: int, multiplier: float) -> void:
	"""Update combo display"""
	if combo > 0:
		combo_label.text = "Combo: %d (%.1fx)" % [combo, multiplier]
		combo_label.modulate = Color.GREEN
	else:
		combo_label.text = "Combo: 0 (1.0x)"
		combo_label.modulate = Color.WHITE

func _on_beat_hit(accuracy: float) -> void:
	"""Handle successful beat hit"""
	var accuracy_percent = accuracy * 100
	beat_feedback_label.text = "PERFECT! (%.0f%%)" % accuracy_percent
	beat_feedback_label.modulate = Color.GREEN
	feedback_timer = feedback_duration

func _on_beat_missed() -> void:
	"""Handle missed beat"""
	beat_feedback_label.text = "OFF BEAT!"
	beat_feedback_label.modulate = Color.RED
	feedback_timer = feedback_duration

func update_generators_ui() -> void:
	"""Update all generator UI elements"""
	var generators_data = game_manager.generator_manager.get_all_generators_data()
	var current_currency = game_manager.get_currency()
	
	for i in range(generators_data.size()):
		var generator_data = generators_data[i]
		
		# Update info label
		var generator_container = generators_container.get_child(i) as HBoxContainer
		var info_label = generator_container.get_child(0) as Label
		
		var income_text = ""
		if generator_data.owned > 0:
			income_text = " - $%s/sec total" % game_manager.format_number(generator_data.income)
		else:
			income_text = " - $%s/sec each" % game_manager.format_number(generator_data.base_income)
		
		info_label.text = "%s (%d owned)%s" % [
			generator_data.name,
			generator_data.owned,
			income_text
		]
		
		# Update buy button
		var buy_button = generator_container.get_child(1) as Button
		buy_button.text = "Buy ($%s)" % game_manager.format_number(generator_data.cost)
		buy_button.disabled = current_currency < generator_data.cost

func update_all_ui() -> void:
	"""Update all UI elements"""
	_on_currency_changed(game_manager.get_currency())
	_on_combo_changed(game_manager.get_current_combo(), game_manager.get_combo_multiplier())
	
	# Update income display
	income_label.text = "Income: $%s/sec" % game_manager.format_number(game_manager.get_income_per_second())
	
	# Update BPM display
	bpm_label.text = "BPM: %.0f" % game_manager.get_bpm()
	
	# Update generators
	update_generators_ui()
	
	# Initial feedback
	beat_feedback_label.text = "Click to the beat!"
	beat_feedback_label.modulate = Color.WHITE