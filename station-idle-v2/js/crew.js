// Crew System - Automated production and resource management

const CrewSystem = {
    // Crew consumption rates (per crew member per second)
    consumptionRates: {
        water: 0.25 / 3600,   // 0.25 water per hour per crew (10 crew = 2.5/hr, 1 crew produces 900/hr)
        food: 0.2 / 3600,     // 0.2 food per hour per crew (10 crew = 2/hr, 1 crew produces 720/hr)
        power: 1 / 3600       // 1 power per hour per crew (10 crew = 10/hr, solar generates 36/hr)
    },
    
    // Initialize crew system
    init() {
        if (!Game.crew) {
            Game.crew = {
                total: 0,           // Current crew count
                capacity: 0,        // Max crew capacity
                assignments: {}     // { recipeId: { progress: 0 } }
            };
        }
        Log.info('Crew system initialized', Game.crew);
    },
    
    // Update crew consumption and production
    update(deltaTime) {
        this.consumeResources(deltaTime);
        this.updateCrewProduction(deltaTime);
    },
    
    // Consume resources based on crew count
    consumeResources(deltaTime) {
        if (Game.crew.total === 0) return;
        
        const waterNeeded = this.consumptionRates.water * Game.crew.total * deltaTime;
        const foodNeeded = this.consumptionRates.food * Game.crew.total * deltaTime;
        const powerNeeded = this.consumptionRates.power * Game.crew.total * deltaTime;
        
        // Consume water
        if (Game.resources.water >= waterNeeded) {
            Game.resources.water -= waterNeeded;
        } else {
            Log.warn('Insufficient water for crew!');
            // Crew become inactive if resources run out
            return;
        }
        
        // Consume food
        if (Game.resources.food >= foodNeeded) {
            Game.resources.food -= foodNeeded;
        } else {
            Log.warn('Insufficient food for crew!');
            return;
        }
        
        // Consume power
        if (Game.resources.power >= powerNeeded) {
            Game.resources.power -= powerNeeded;
        } else {
            Log.warn('Insufficient power for crew!');
            return;
        }
    },
    
    // Update crew production assignments
    updateCrewProduction(deltaTime) {
        Object.keys(Game.crew.assignments).forEach(recipeId => {
            const recipe = Recipes[recipeId];
            if (!recipe) return;
            
            const assignment = Game.crew.assignments[recipeId];
            
            // Check if can produce
            if (!canProduce(recipe)) {
                return;
            }
            
            // Progress production
            assignment.progress += deltaTime;
            
            // Complete cycle
            if (assignment.progress >= recipe.duration) {
                completeProduction(recipe);
                assignment.progress = 0;
                Log.game(`Crew completed: ${recipe.name}`);
            }
        });
    },
    
    // Assign crew to a recipe
    assignCrew(recipeId) {
        const recipe = Recipes[recipeId];
        if (!recipe || !recipe.unlocked) {
            Log.warn(`Cannot assign crew to ${recipeId} - not unlocked`);
            return false;
        }
        
        // Check if crew available
        const assignedCount = Object.keys(Game.crew.assignments).length;
        if (assignedCount >= Game.crew.total) {
            Log.warn('No available crew to assign');
            return false;
        }
        
        // Check if already assigned
        if (Game.crew.assignments[recipeId]) {
            Log.warn(`Crew already assigned to ${recipeId}`);
            return false;
        }
        
        // Assign crew
        Game.crew.assignments[recipeId] = { progress: 0 };
        Log.game(`Crew assigned to: ${recipe.name}`);
        return true;
    },
    
    // Unassign crew from a recipe
    unassignCrew(recipeId) {
        if (!Game.crew.assignments[recipeId]) {
            Log.warn(`No crew assigned to ${recipeId}`);
            return false;
        }
        
        const recipe = Recipes[recipeId];
        delete Game.crew.assignments[recipeId];
        Log.game(`Crew unassigned from: ${recipe.name}`);
        return true;
    },
    
    // Get available crew count
    getAvailableCrew() {
        const assignedCount = Object.keys(Game.crew.assignments).length;
        return Game.crew.total - assignedCount;
    },
    
    // Get consumption rates per hour
    getConsumptionRates() {
        return {
            water: this.consumptionRates.water * 3600 * Game.crew.total,
            food: this.consumptionRates.food * 3600 * Game.crew.total,
            power: this.consumptionRates.power * 3600 * Game.crew.total
        };
    },
    
    // Add crew (called when building habitation modules)
    addCrew(count) {
        Game.crew.total += count;
        Game.crew.capacity += count;
        Log.game(`Added ${count} crew members (Total: ${Game.crew.total})`);
    }
};

// Initialize on load
CrewSystem.init();
