using UnityEngine;

namespace DustAndDisorder.Abilities
{
    /// <summary>
    /// Mop ability - squirts water to create puddle messes
    /// </summary>
    public class MopAbility : BaseAbility
    {
        [Header("Mop Settings")]
        [SerializeField] private float maxWater = 50f;
        [SerializeField] private float currentWater = 50f;
        [SerializeField] private float waterPerSquirt = 5f;
        [SerializeField] private float squirtDistance = 3f;
        [SerializeField] private GameObject puddlePrefab;

        public float CurrentWater => currentWater;
        public float MaxWater => maxWater;
        public bool HasWater => currentWater > 0f;

        private void Start()
        {
            currentWater = maxWater;
        }

        protected override void OnExecutePrimary(float boostMultiplier)
        {
            SquirtWater(boostMultiplier);
        }

        protected override void OnExecuteSecondary(float boostMultiplier)
        {
            // Could be a different spray pattern
            SquirtWater(boostMultiplier);
        }

        private void SquirtWater(float boostMultiplier)
        {
            if (currentWater < waterPerSquirt)
            {
                Debug.Log("Out of water! Return to charging base to refill.");
                return;
            }

            // Calculate squirt position
            Vector3 squirtPos = transform.position + transform.forward * squirtDistance;
            
            // Raycast to find ground
            if (Physics.Raycast(squirtPos + Vector3.up * 2f, Vector3.down, out RaycastHit hit, 5f))
            {
                squirtPos = hit.point;
            }

            // Create puddle
            CreatePuddle(squirtPos, boostMultiplier);

            // Consume water
            currentWater = Mathf.Max(0f, currentWater - waterPerSquirt);
            Debug.Log($"Squirted water! Remaining: {currentWater}/{maxWater}");
        }

        private void CreatePuddle(Vector3 position, float boostMultiplier)
        {
            if (puddlePrefab != null)
            {
                GameObject puddle = Instantiate(puddlePrefab, position, Quaternion.identity);
                
                // Scale puddle based on boost
                float scale = 1f * boostMultiplier;
                puddle.transform.localScale = new Vector3(scale, 0.1f, scale);
            }
            else
            {
                // Create simple puddle if no prefab
                GameObject puddle = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                puddle.name = "WaterPuddle";
                puddle.transform.position = position;
                puddle.transform.localScale = new Vector3(1f, 0.05f, 1f);
                
                // Make it blue
                Renderer renderer = puddle.GetComponent<Renderer>();
                if (renderer != null)
                {
                    renderer.material.color = new Color(0.2f, 0.5f, 1f, 0.5f);
                }

                // Remove collider so it doesn't block movement
                Destroy(puddle.GetComponent<Collider>());
            }
        }

        public void RefillWater()
        {
            currentWater = maxWater;
            Debug.Log("Water refilled!");
        }
    }
}
