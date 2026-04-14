extends Node
class_name GeneratorManager

## Manages all generator types and their income

signal income_updated(new_income: float)

# Generator data structure
var generators: Array[Dictionary] = []
var total_income: float = 0.0

func _ready() -> void:
	initialize_generators()
	calculate_total_income()

func initialize_generators() -> void:
	"""Initialize all generator types with base stats"""
	generators = [
		{
			"name": "Beat Maker",
			"base_cost": 10.0,
			"base_income": 0.1,
			"owned": 0,
			"cost_multiplier": 1.15
		},
		{
			"name": "Rhythm Machine",
			"base_cost": 100.0,
			"base_income": 1.0,
			"owned": 0,
			"cost_multiplier": 1.15
		},
		{
			"name": "Tempo Tower",
			"base_cost": 1000.0,
			"base_income": 10.0,
			"owned": 0,
			"cost_multiplier": 1.15
		},
		{
			"name": "Melody Factory",
			"base_cost": 10000.0,
			"base_income": 100.0,
			"owned": 0,
			"cost_multiplier": 1.15
		},
		{
			"name": "Symphony Station",
			"base_cost": 100000.0,
			"base_income": 1000.0,
			"owned": 0,
			"cost_multiplier": 1.15
		},
		{
			"name": "Harmony Hub",
			"base_cost": 1000000.0,
			"base_income": 10000.0,
			"owned": 0,
			"cost_multiplier": 1.15
		}
	]

func get_generator_cost(generator_index: int) -> float:
	"""Calculate current cost for a generator"""
	if generator_index < 0 or generator_index >= generators.size():
		return 0.0
	
	var generator = generators[generator_index]
	return generator.base_cost * pow(generator.cost_multiplier, generator.owned)

func get_generator_income(generator_index: int) -> float:
	"""Calculate current income for a generator"""
	if generator_index < 0 or generator_index >= generators.size():
		return 0.0
	
	var generator = generators[generator_index]
	return generator.base_income * generator.owned

func can_afford_generator(generator_index: int, currency: float) -> bool:
	"""Check if player can afford a generator"""
	return currency >= get_generator_cost(generator_index)

func purchase_generator(generator_index: int, currency: float) -> float:
	"""Purchase a generator and return remaining currency"""
	if not can_afford_generator(generator_index, currency):
		return currency
	
	var cost = get_generator_cost(generator_index)
	generators[generator_index].owned += 1
	
	calculate_total_income()
	income_updated.emit(total_income)
	
	print("Purchased ", generators[generator_index].name, " (", generators[generator_index].owned, " owned)")
	return currency - cost

func calculate_total_income() -> void:
	"""Calculate total income from all generators"""
	total_income = 0.0
	
	for generator in generators:
		total_income += generator.base_income * generator.owned
	
	print("Total income updated: ", total_income, "/sec")

func get_total_income() -> float:
	"""Get current total income per second"""
	return total_income

func get_generator_data(generator_index: int) -> Dictionary:
	"""Get generator data for UI display"""
	if generator_index < 0 or generator_index >= generators.size():
		return {}
	
	var generator = generators[generator_index]
	return {
		"name": generator.name,
		"owned": generator.owned,
		"cost": get_generator_cost(generator_index),
		"income": get_generator_income(generator_index),
		"base_income": generator.base_income
	}

func get_all_generators_data() -> Array[Dictionary]:
	"""Get all generators data for UI"""
	var all_data: Array[Dictionary] = []
	
	for i in range(generators.size()):
		all_data.append(get_generator_data(i))
	
	return all_data

func reset_all_generators() -> void:
	"""Reset all generators (for prestige)"""
	for generator in generators:
		generator.owned = 0
	
	calculate_total_income()
	income_updated.emit(total_income)
	print("All generators reset")