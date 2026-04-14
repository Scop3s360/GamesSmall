// Ship UI - Ship configuration and loadout management

const ShipUI = {
    // Render ship tab
    renderShipTab() {
        const container = document.getElementById('ship-container');
        if (!container) return;
        
        const ship = CombatSystem.ship;
        const equippedSlots = CombatSystem.getEquippedSlots();
        const maxSlots = CombatSystem.getMaxSlots();
        const damage = CombatSystem.calculateDamage();
        const hullData = HullTypes[ship.hullType];
        const attacksPerSecond = (1 / hullData.attackSpeed).toFixed(2);
        
        let html = `
            <div class="card" style="margin-bottom: 20px;">
                <h3>🚀 Your Ship - ${hullData.name}</h3>
                <p><strong>Hull Type:</strong> ${hullData.name}</p>
                <p><strong>Weapon Slots:</strong> ${equippedSlots.weapons} / ${maxSlots.weapons} used</p>
                <p><strong>Armor Slots:</strong> ${equippedSlots.armor} / ${maxSlots.armor} used</p>
                <p><strong>Shield Slots:</strong> ${equippedSlots.shields} / ${maxSlots.shields} used</p>
                <p><strong>Hull HP:</strong> ${ship.hp} / ${ship.maxHp}</p>
                <p><strong>Shield:</strong> ${ship.shield} / ${ship.maxShield}</p>
                <p><strong>Damage Output:</strong> ${damage} per attack</p>
                <p><strong>Attack Speed:</strong> ${attacksPerSecond} attacks/second (${hullData.attackSpeed}s per attack)</p>
                <p><strong>DPS:</strong> ${(damage / hullData.attackSpeed).toFixed(1)}</p>
                ${equippedSlots.weapons === 0 ? '<p style="color: #f80; margin-top: 10px;">⚠️ Equip weapons before combat!</p>' : ''}
            </div>
            
            <div class="card" style="margin-bottom: 20px;">
                <h3>🔧 Change Hull Type</h3>
                <p style="opacity: 0.7; margin-bottom: 10px;">Larger hulls have more equipment slots and HP</p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    ${Object.keys(HullTypes).map(hullId => {
                        const hull = HullTypes[hullId];
                        const isCurrent = ship.hullType === hullId;
                        return `
                            <button class="btn" 
                                    onclick="changeHullTypeFromUI('${hullId}')"
                                    ${isCurrent ? 'disabled' : ''}
                                    style="${isCurrent ? 'background: #0a0; cursor: default;' : ''}">
                                ${hull.name} (W:${hull.weaponSlots} A:${hull.armorSlots} S:${hull.shieldSlots})
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <h3 style="margin-bottom: 15px;">Ship Equipment</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <h4 style="margin-bottom: 10px;">🔫 Weapons</h4>
                    ${this.renderWeaponsList()}
                </div>
                <div>
                    <h4 style="margin-bottom: 10px;">🛡️ Defense</h4>
                    ${this.renderDefenseList()}
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <h4 style="margin-bottom: 10px;">📦 Station Inventory</h4>
                    ${this.renderStationInventory()}
                </div>
                <div>
                    <h4 style="margin-bottom: 10px;">🚀 Ship Loadout</h4>
                    ${this.renderShipLoadout()}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    },
    
    // Render weapons list
    renderWeaponsList() {
        const weapons = ['laserTurrets', 'missileLaunchers', 'railguns', 'plasmaCannons'];
        let html = '<div class="grid">';
        
        weapons.forEach(weapon => {
            const res = Resources[weapon];
            const equipped = CombatSystem.ship.weapons[weapon];
            const available = Game.resources[weapon];
            let damagePerUnit = 0;
            
            if (weapon === 'laserTurrets') damagePerUnit = 10;
            if (weapon === 'missileLaunchers') damagePerUnit = 25;
            if (weapon === 'railguns') damagePerUnit = 50;
            if (weapon === 'plasmaCannons') damagePerUnit = 100;
            
            html += `
                <div class="card">
                    <h4>${res.icon} ${res.name}</h4>
                    <p><strong>Damage:</strong> ${damagePerUnit}/attack</p>
                    <p><strong>Equipped:</strong> ${equipped}</p>
                    <p><strong>Available:</strong> ${available}</p>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    },
    
    // Render defense list
    renderDefenseList() {
        const defenses = ['shieldGenerators', 'armorPlates', 'pointDefense'];
        let html = '<div class="grid">';
        
        defenses.forEach(defense => {
            const res = Resources[defense];
            const equipped = CombatSystem.ship.defense[defense];
            const available = Game.resources[defense];
            let effect = '';
            
            if (defense === 'shieldGenerators') effect = '+100 Shield each';
            if (defense === 'armorPlates') effect = '+50 HP each';
            if (defense === 'pointDefense') effect = '-2 Damage each';
            
            html += `
                <div class="card">
                    <h4>${res.icon} ${res.name}</h4>
                    <p><strong>Effect:</strong> ${effect}</p>
                    <p><strong>Equipped:</strong> ${equipped}</p>
                    <p><strong>Available:</strong> ${available}</p>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    },
    
    // Render station inventory
    renderStationInventory() {
        const combatResources = ['laserTurrets', 'missileLaunchers', 'railguns', 'plasmaCannons',
                                  'shieldGenerators', 'armorPlates', 'pointDefense'];
        let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
        
        combatResources.forEach(resource => {
            const res = Resources[resource];
            const amount = Game.resources[resource];
            const isWeapon = ['laserTurrets', 'missileLaunchers', 'railguns', 'plasmaCannons'].includes(resource);
            
            html += `
                <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
                    <span>${res.icon} ${res.name}: ${amount}</span>
                    <button class="btn" style="width: auto; margin: 0;" 
                            onclick="${isWeapon ? 'equipWeaponFromUI' : 'equipDefenseFromUI'}('${resource}')"
                            ${amount <= 0 ? 'disabled' : ''}>
                        Equip →
                    </button>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    },
    
    // Render ship loadout
    renderShipLoadout() {
        const ship = CombatSystem.ship;
        let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
        
        // Weapons
        Object.keys(ship.weapons).forEach(weapon => {
            const res = Resources[weapon];
            const amount = ship.weapons[weapon];
            
            if (amount > 0) {
                html += `
                    <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
                        <span>${res.icon} ${res.name}: ${amount}</span>
                        <button class="btn" style="width: auto; margin: 0;" 
                                onclick="unequipWeaponFromUI('${weapon}')">
                            ← Unequip
                        </button>
                    </div>
                `;
            }
        });
        
        // Defense
        Object.keys(ship.defense).forEach(defense => {
            const res = Resources[defense];
            const amount = ship.defense[defense];
            
            if (amount > 0) {
                html += `
                    <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
                        <span>${res.icon} ${res.name}: ${amount}</span>
                        <button class="btn" style="width: auto; margin: 0;" 
                                onclick="unequipDefenseFromUI('${defense}')">
                            ← Unequip
                        </button>
                    </div>
                `;
            }
        });
        
        if (Object.values(ship.weapons).every(v => v === 0) && Object.values(ship.defense).every(v => v === 0)) {
            html += '<p style="text-align: center; opacity: 0.5;">No equipment installed</p>';
        }
        
        html += '</div>';
        return html;
    }
};
