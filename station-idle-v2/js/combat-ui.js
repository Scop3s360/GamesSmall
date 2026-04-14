// Combat UI - Ship management and combat display

const CombatUI = {
    // Render combat tab
    renderCombatTab() {
        const container = document.getElementById('combat-container');
        if (!container) return;
        
        let html = '';
        
        // Combat status
        if (CombatSystem.inCombat) {
            html += this.renderCombatView();
        } else {
            html += this.renderPrepView();
        }
        
        container.innerHTML = html;
    },
    
    // Update only the dynamic parts during combat (HP bars, etc)
    updateCombatDisplay() {
        if (!CombatSystem.inCombat || !CombatSystem.enemy) return;
        
        const ship = CombatSystem.ship;
        const enemy = CombatSystem.enemy;
        const shipHpPercent = (ship.hp / ship.maxHp) * 100;
        const shipShieldPercent = ship.maxShield > 0 ? (ship.shield / ship.maxShield) * 100 : 0;
        const enemyHpPercent = (CombatSystem.enemyHp / CombatSystem.enemyMaxHp) * 100;
        
        // Update ship HP
        const shipHpBar = document.getElementById('ship-hp-bar');
        const shipHpText = document.getElementById('ship-hp-text');
        const shipHpValue = document.getElementById('ship-hp-value');
        if (shipHpBar && shipHpText && shipHpValue) {
            shipHpBar.style.width = `${shipHpPercent}%`;
            shipHpText.textContent = `${Math.floor(shipHpPercent)}%`;
            shipHpValue.textContent = `${Math.floor(ship.hp)} / ${ship.maxHp}`;
        }
        
        // Update ship shield
        if (ship.maxShield > 0) {
            const shipShieldBar = document.getElementById('ship-shield-bar');
            const shipShieldText = document.getElementById('ship-shield-text');
            const shipShieldValue = document.getElementById('ship-shield-value');
            if (shipShieldBar && shipShieldText && shipShieldValue) {
                shipShieldBar.style.width = `${shipShieldPercent}%`;
                shipShieldText.textContent = `${Math.floor(shipShieldPercent)}%`;
                shipShieldValue.textContent = `${Math.floor(ship.shield)} / ${ship.maxShield}`;
            }
        }
        
        // Update enemy HP
        const enemyHpBar = document.getElementById('enemy-hp-bar');
        const enemyHpText = document.getElementById('enemy-hp-text');
        const enemyHpValue = document.getElementById('enemy-hp-value');
        if (enemyHpBar && enemyHpText && enemyHpValue) {
            enemyHpBar.style.width = `${enemyHpPercent}%`;
            enemyHpText.textContent = `${Math.floor(enemyHpPercent)}%`;
            enemyHpValue.textContent = `${Math.floor(CombatSystem.enemyHp)} / ${CombatSystem.enemyMaxHp}`;
        }
        
        // Update pending rewards
        const pendingRewardsContainer = document.getElementById('pending-rewards-container');
        if (pendingRewardsContainer && Object.keys(CombatSystem.pendingRewards).length > 0) {
            let rewardsHtml = '';
            Object.keys(CombatSystem.pendingRewards).forEach(resource => {
                const amount = CombatSystem.pendingRewards[resource];
                const res = Resources[resource];
                rewardsHtml += `<span>${res.icon} ${res.name}: ${amount}</span>`;
            });
            pendingRewardsContainer.innerHTML = rewardsHtml;
        }
    },
    
    // Render preparation view (not in combat)
    renderPrepView() {
        let html = `
            <div class="card" style="margin-bottom: 20px;">
                <h3>🌍 Select Combat Zone</h3>
                <p style="opacity: 0.7;">Choose a zone and enemy to engage in combat</p>
                <p style="margin-top: 10px;">Configure your ship in the <strong>🚀 Ship</strong> tab before combat</p>
            </div>
            
            <div class="grid">
                ${this.renderZoneCards()}
            </div>
        `;
        
        return html;
    },
    
    // Render zone selection cards
    renderZoneCards() {
        let html = '';
        Object.values(CombatZones).forEach(zone => {
            html += `
                <div class="card">
                    <h3>${zone.icon} ${zone.name}</h3>
                    <p style="opacity: 0.7; margin-bottom: 15px;">${zone.description}</p>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${zone.enemies.map(enemy => `
                            <button class="btn" onclick="startCombatFromUI('${zone.id}', '${enemy.id}')" 
                                    ${Object.values(CombatSystem.ship.weapons).reduce((a,b)=>a+b,0) === 0 ? 'disabled' : ''}>
                                ${enemy.icon} ${enemy.name} (HP: ${enemy.hp}, DMG: ${enemy.damage})
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        return html;
    },
    
    // Render combat view (during combat)
    renderCombatView() {
        const ship = CombatSystem.ship;
        const enemy = CombatSystem.enemy;
        const zone = CombatZones[CombatSystem.currentZone];
        const hullData = HullTypes[ship.hullType];
        const enemyHpPercent = (CombatSystem.enemyHp / CombatSystem.enemyMaxHp) * 100;
        const shipHpPercent = (ship.hp / ship.maxHp) * 100;
        const shipShieldPercent = ship.maxShield > 0 ? (ship.shield / ship.maxShield) * 100 : 0;
        const attacksPerSecond = (1 / hullData.attackSpeed).toFixed(2);
        
        // Render pending rewards
        let pendingRewardsHtml = '';
        if (Object.keys(CombatSystem.pendingRewards).length > 0) {
            pendingRewardsHtml = '<div id="pending-rewards-box" style="margin-top: 15px; padding: 10px; background: rgba(255, 200, 0, 0.1); border: 1px solid #fc0; border-radius: 5px;">';
            pendingRewardsHtml += '<h4 style="margin: 0 0 10px 0; color: #fc0;">💰 Pending Rewards (Retreat to Collect)</h4>';
            pendingRewardsHtml += '<div id="pending-rewards-container" style="display: flex; flex-wrap: wrap; gap: 10px;">';
            Object.keys(CombatSystem.pendingRewards).forEach(resource => {
                const amount = CombatSystem.pendingRewards[resource];
                const res = Resources[resource];
                pendingRewardsHtml += `<span>${res.icon} ${res.name}: ${amount}</span>`;
            });
            pendingRewardsHtml += '</div></div>';
        }
        
        return `
            <div class="card" style="margin-bottom: 20px;">
                <h3>⚔️ Combat - ${zone.icon} ${zone.name}</h3>
                <p style="text-align: center; font-size: 1.2em; margin: 10px 0;">
                    Enemies Defeated: ${Game.combat.enemiesDefeated}
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="card">
                    <h3>🚀 Your Ship</h3>
                    <p><strong>Hull HP:</strong> <span id="ship-hp-value">${Math.floor(ship.hp)} / ${ship.maxHp}</span></p>
                    <div class="progress">
                        <div id="ship-hp-bar" class="progress-fill" style="width: ${shipHpPercent}%; background: linear-gradient(90deg, #f00, #0f0);"></div>
                        <span id="ship-hp-text" class="progress-text">${Math.floor(shipHpPercent)}%</span>
                    </div>
                    ${ship.maxShield > 0 ? `
                        <p style="margin-top: 10px;"><strong>Shield:</strong> <span id="ship-shield-value">${Math.floor(ship.shield)} / ${ship.maxShield}</span></p>
                        <div class="progress">
                            <div id="ship-shield-bar" class="progress-fill" style="width: ${shipShieldPercent}%; background: linear-gradient(90deg, #00f, #0ff);"></div>
                            <span id="ship-shield-text" class="progress-text">${Math.floor(shipShieldPercent)}%</span>
                        </div>
                    ` : ''}
                    <p style="margin-top: 10px;"><strong>Damage:</strong> ${CombatSystem.calculateDamage()} per attack</p>
                    <p><strong>Attack Speed:</strong> ${attacksPerSecond} attacks/second</p>
                    <p><strong>DPS:</strong> ${(CombatSystem.calculateDamage() / hullData.attackSpeed).toFixed(1)}</p>
                </div>
                
                <div class="card">
                    <h3>${enemy.icon} ${enemy.name}</h3>
                    <p><strong>HP:</strong> <span id="enemy-hp-value">${Math.floor(CombatSystem.enemyHp)} / ${CombatSystem.enemyMaxHp}</span></p>
                    <div class="progress">
                        <div id="enemy-hp-bar" class="progress-fill" style="width: ${enemyHpPercent}%; background: linear-gradient(90deg, #f00, #f0f);"></div>
                        <span id="enemy-hp-text" class="progress-text">${Math.floor(enemyHpPercent)}%</span>
                    </div>
                    <p style="margin-top: 10px;"><strong>Damage:</strong> ${enemy.damage} per attack</p>
                    <p><strong>Attack Speed:</strong> 1 attack/second</p>
                </div>
            </div>
            
            <div class="card" style="margin-top: 20px; text-align: center;">
                <p style="font-size: 1.5em; margin: 20px 0;">⚔️ COMBAT IN PROGRESS ⚔️</p>
                <p style="opacity: 0.7; margin-bottom: 15px;">Damage is exchanged every second</p>
                ${pendingRewardsHtml}
                <button class="btn" onclick="retreatFromCombatUI()" style="background: #f80; width: 200px; margin: 15px auto 0;">
                    🏃 Retreat & Collect Rewards
                </button>
                <p style="opacity: 0.5; font-size: 0.9em; margin-top: 10px;">⚠️ If defeated, all pending rewards are lost!</p>
            </div>
        `;
    }
};

// Global functions for onclick handlers
function equipWeaponFromUI(weaponType) {
    if (CombatSystem.equipWeapon(weaponType)) {
        if (typeof ShipUI !== 'undefined') ShipUI.renderShipTab();
        CombatUI.renderCombatTab();
        updateUI();
    }
}

function unequipWeaponFromUI(weaponType) {
    if (CombatSystem.unequipWeapon(weaponType)) {
        if (typeof ShipUI !== 'undefined') ShipUI.renderShipTab();
        CombatUI.renderCombatTab();
        updateUI();
    }
}

function equipDefenseFromUI(defenseType) {
    if (CombatSystem.equipDefense(defenseType)) {
        if (typeof ShipUI !== 'undefined') ShipUI.renderShipTab();
        CombatUI.renderCombatTab();
        updateUI();
    }
}

function unequipDefenseFromUI(defenseType) {
    if (CombatSystem.unequipDefense(defenseType)) {
        if (typeof ShipUI !== 'undefined') ShipUI.renderShipTab();
        CombatUI.renderCombatTab();
        updateUI();
    }
}

function startCombatFromUI(zoneId, enemyId) {
    if (CombatSystem.startCombat(zoneId, enemyId)) {
        CombatUI.renderCombatTab();
    }
}

function changeHullTypeFromUI(hullType) {
    if (CombatSystem.changeHullType(hullType)) {
        if (typeof ShipUI !== 'undefined') ShipUI.renderShipTab();
        CombatUI.renderCombatTab();
        updateUI();
    }
}

function retreatFromCombatUI() {
    if (CombatSystem.retreat()) {
        CombatUI.renderCombatTab();
        updateUI();
    }
}
