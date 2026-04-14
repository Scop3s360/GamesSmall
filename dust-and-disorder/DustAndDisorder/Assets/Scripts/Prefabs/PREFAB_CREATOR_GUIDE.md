# Prefab Creator Guide

## Overview

The `PrefabCreator.cs` script automatically generates all 32 interactive objects for the Dust & Disorder game. It creates properly configured GameObjects with physics, colors, and mess values.

## How to Use

### Method 1: Context Menu (Recommended)
1. Create an empty GameObject in your scene
2. Add the `PrefabCreator` component to it
3. Right-click the component in Inspector
4. Select one of:
   - **"Create All Prefabs"** - Creates all 32 objects
   - **"Create Bedroom Prefabs"** - Creates 8 bedroom objects
   - **"Create Kitchen Prefabs"** - Creates 8 kitchen objects
   - **"Create Bathroom Prefabs"** - Creates 8 bathroom objects
   - **"Create Front Room Prefabs"** - Creates 8 front room objects

### Method 2: Auto-Create on Start
1. Add `PrefabCreator` component to a GameObject
2. Check the "Create On Start" checkbox
3. Press Play - objects will be created automatically

## What Gets Created

### Bedroom (8 objects)
| Object | Position | Weight | Mess Value | Heavy? |
|--------|----------|--------|------------|--------|
| Lamp | (15, 0.5, 15) | 0.5 | 1.0 | No |
| Wardrobe | (18, 1, 15) | 10.0 | 2.0 | Yes |
| Laundry Basket | (15, 0.5, 18) | 1.0 | 2.0 | No |
| Bed | (20, 0.3, 20) | 15.0 | 3.0 | Yes |
| Dresser | (18, 1, 22) | 8.0 | 2.0 | No |
| Closet | (22, 1, 15) | 12.0 | 2.0 | Yes |
| Plant | (18, 1, 22) | 5.0 | 3.0 | Yes |
| Bookshelf | (22, 1.5, 22) | 10.0 | 2.0 | Yes |

### Kitchen (8 objects)
| Object | Position | Weight | Mess Value | Heavy? |
|--------|----------|--------|------------|--------|
| Trash Can | (-15, 0.75, 15) | 1.0 | 2.0 | No |
| Cabinet | (-18, 1, 15) | 8.0 | 2.0 | No |
| Dish Rack | (-15, 0.5, 18) | 1.5 | 2.0 | No |
| Counter Items | (-20, 0.5, 15) | 0.8 | 1.0 | No |
| Fruit Bowl | (-15, 0.5, 20) | 0.7 | 1.5 | No |
| Fridge | (-22, 1.5, 15) | 20.0 | 3.0 | Yes |
| Pet Bowl | (-18, 0.2, 22) | 0.5 | 1.0 | No |
| Mop Bucket | (-22, 0.5, 22) | 1.5 | 1.5 | No |

### Bathroom (8 objects)
| Object | Position | Weight | Mess Value | Heavy? |
|--------|----------|--------|------------|--------|
| Toiletries | (-15, 0.5, -15) | 0.5 | 1.0 | No |
| Towel Rack | (-18, 1.5, -15) | 1.0 | 1.5 | No |
| Trash Bin | (-15, 0.5, -18) | 1.0 | 2.0 | No |
| Toilet Paper | (-20, 0.5, -15) | 0.2 | 0.5 | No |
| Bath Mat | (-15, 0.1, -20) | 0.5 | 1.0 | No |
| Medicine Cabinet | (-22, 1.5, -15) | 3.0 | 2.0 | No |
| Soap Dispenser | (-18, 0.5, -22) | 0.3 | 0.5 | No |
| Water Source | (-22, 0.5, -22) | 1.0 | 1.0 | No |

### Front Room (8 objects)
| Object | Position | Weight | Mess Value | Heavy? |
|--------|----------|--------|------------|--------|
| Coffee Table | (0, 0.3, 0) | 5.0 | 2.0 | No |
| Bookshelf | (5, 1.5, 0) | 10.0 | 2.0 | Yes |
| Plant | (0, 1, 5) | 5.0 | 3.0 | Yes |
| Lamp | (-5, 0.5, 0) | 0.5 | 1.0 | No |
| Magazines | (0, 0.2, -5) | 0.3 | 1.0 | No |
| Couch Cushions | (5, 0.5, 5) | 0.8 | 1.5 | No |
| Decorative Items | (-5, 0.5, 5) | 0.5 | 1.0 | No |
| Dust Pile | (5, 0.1, -5) | 0.1 | 1.0 | No |

## Room Layout

The objects are positioned in 4 quadrants:
- **Bedroom**: Positive X, Positive Z (15-22, 15-22)
- **Kitchen**: Negative X, Positive Z (-15 to -22, 15-22)
- **Bathroom**: Negative X, Negative Z (-15 to -22, -15 to -22)
- **Front Room**: Around origin (0, 0) with charging base at (-8, -8)

## Object Properties

Each object is created with:
- **Rigidbody** - For physics interactions
- **Collider** - Primitive collider based on shape
- **InteractiveObject** component - Tracks mess state
- **Color** - Visual identification
- **Weight** - Affects push/pull difficulty
- **Mess Value** - Contribution to total mess percentage

## Heavy Objects

Heavy objects (marked "Yes" in tables) require the **Boost** mechanic (hold Shift) to push effectively. These include:
- Large furniture (wardrobes, beds, fridges)
- Plants
- Bookshelves

## Tips

- Objects spawn at their designated positions
- You can adjust positions manually after creation
- Heavy objects have higher mass (5.0+)
- Mess values range from 0.5 to 3.0
- Total possible mess: ~50-60 points across all objects

## Next Steps

After creating objects:
1. Adjust positions if needed
2. Test push/pull interactions
3. Verify mess tracking works
4. Add visual polish (materials, textures)
5. Create actual prefabs from the objects (drag to Prefabs folder)
