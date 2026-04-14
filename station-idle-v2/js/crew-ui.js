// Crew UI - Rendering and interaction

const CrewUI = {
    // Render crew management tab
    renderCrewTab() {
        const container = document.getElementById('crew-container');
        if (!container) return;
        
        if (Game.crew.capacity === 0) {
            container.innerHTML = '<p style="text-align:center;opacity:0.5;">Build a Habitation Module to recruit crew</p>';
            return;
        }
        
        const assignedCount = Object.keys(Game.crew.assignments).length;
        const availableCount = Game.crew.total - assignedCount;
        const rates = CrewSystem.getConsumptionRates();
        
        let html = `
            <div class="card" style="margin-bottom: 20px;">
                <h3>👥 Crew Status</h3>
                <p><strong>Total Crew:</strong> ${Game.crew.total} / ${Game.crew.capacity}</p>
                <p><strong>Assigned:</strong> ${assignedCount} | <strong>Available:</strong> ${availableCount}</p>
                <hr style="margin: 15px 0; border-color: #0ff;">
                <p><strong>Consumption Rates (per hour):</strong></p>
                <p>💧 Water: ${rates.water.toFixed(1)} | 🍎 Food: ${rates.food.toFixed(1)} | ⚡ Power: ${rates.power.toFixed(1)}</p>
            </div>
            
            <h3 style="margin-bottom: 15px;">Assigned Crew</h3>
        `;
        
        // Show assigned crew
        if (assignedCount === 0) {
            html += '<p style="text-align:center;opacity:0.5;margin-bottom:20px;">No crew assigned yet.</p>';
        } else {
            html += '<div class="grid">';
            Object.keys(Game.crew.assignments).forEach(recipeId => {
                const recipe = Recipes[recipeId];
                const assignment = Game.crew.assignments[recipeId];
                const progress = Math.min(100, (assignment.progress / recipe.duration) * 100);
                const output = Resources[Object.keys(recipe.output)[0]];
                
                html += `
                    <div class="card" data-crew-recipe="${recipeId}">
                        <h3>${output.icon} ${recipe.name}</h3>
                        <div class="progress">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                            <span class="progress-text">${Math.floor(progress)}%</span>
                        </div>
                        <button class="btn" onclick="unassignCrewFromUI('${recipeId}')">Unassign Crew</button>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        // Assign new crew section
        if (availableCount > 0) {
            html += `
                <h3 style="margin: 20px 0 15px 0;">Assign Available Crew (${availableCount})</h3>
                <div class="card" style="margin-bottom: 20px;">
                    <h4>Select Recipe to Automate</h4>
                    <select id="crew-recipe-select" style="width: 100%; padding: 10px; margin: 10px 0; background: #111; color: #0ff; border: 1px solid #0ff;">
                        <option value="">-- Select Recipe --</option>
                        ${this.getUnlockedRecipeOptions()}
                    </select>
                    <button class="btn" onclick="assignCrewFromDropdown()" style="width: 100%;">👤 Assign Crew to Selected Recipe</button>
                </div>
            `;
        }
        
        container.innerHTML = html;
    },
    
    // Update crew progress bars (called from game loop)
    updateCrewProgress() {
        Object.keys(Game.crew.assignments).forEach(recipeId => {
            const recipe = Recipes[recipeId];
            const assignment = Game.crew.assignments[recipeId];
            const progress = Math.min(100, (assignment.progress / recipe.duration) * 100);
            
            const card = document.querySelector(`[data-crew-recipe="${recipeId}"]`);
            if (card) {
                const fill = card.querySelector('.progress-fill');
                const text = card.querySelector('.progress-text');
                if (fill) fill.style.width = progress + '%';
                if (text) text.textContent = Math.floor(progress) + '%';
            }
        });
    },
    
    // Get unlocked recipe options for dropdown
    getUnlockedRecipeOptions() {
        let options = '';
        Object.values(Recipes).forEach(recipe => {
            if (recipe.unlocked && !Game.crew.assignments[recipe.id]) {
                const output = Resources[Object.keys(recipe.output)[0]];
                options += `<option value="${recipe.id}">${output.icon} ${recipe.name}</option>`;
            }
        });
        return options;
    },
    
    // Update production tab to show crew assignment buttons
    updateProductionWithCrew() {
        // This is called after renderProduction to add crew buttons
        const availableCrew = CrewSystem.getAvailableCrew();
        
        Object.values(Recipes).forEach(recipe => {
            if (!recipe.unlocked) return;
            
            const isAssigned = Game.crew.assignments[recipe.id] !== undefined;
            const card = document.querySelector(`[data-recipe="${recipe.id}"]`);
            
            if (card && availableCrew > 0 && !isAssigned) {
                const crewBtn = document.createElement('button');
                crewBtn.className = 'btn';
                crewBtn.style.marginTop = '5px';
                crewBtn.textContent = '👤 Assign Crew';
                crewBtn.onclick = () => assignCrewFromUI(recipe.id);
                card.appendChild(crewBtn);
            } else if (card && isAssigned) {
                const crewIndicator = document.createElement('p');
                crewIndicator.style.textAlign = 'center';
                crewIndicator.style.color = '#0f0';
                crewIndicator.style.marginTop = '10px';
                crewIndicator.textContent = '✓ Crew Assigned';
                card.appendChild(crewIndicator);
            }
        });
    }
};

// Global functions for onclick handlers
function assignCrewFromDropdown() {
    const select = document.getElementById('crew-recipe-select');
    const recipeId = select.value;
    
    if (!recipeId) {
        alert('Please select a recipe first');
        return;
    }
    
    if (CrewSystem.assignCrew(recipeId)) {
        CrewUI.renderCrewTab();
        updateUI();
    }
}

function assignCrewFromUI(recipeId) {
    if (CrewSystem.assignCrew(recipeId)) {
        renderProduction();
        CrewUI.renderCrewTab();
    }
}

function unassignCrewFromUI(recipeId) {
    if (CrewSystem.unassignCrew(recipeId)) {
        renderProduction();
        CrewUI.renderCrewTab();
    }
}
