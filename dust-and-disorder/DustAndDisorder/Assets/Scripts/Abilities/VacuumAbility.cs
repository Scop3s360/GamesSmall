using UnityEngine;
using System.Collections.Generic;

namespace DustAndDisorder.Abilities
{
    /// <summary>
    /// Vacuum ability - sucks in items (primary) or blows them out (secondary)
    /// </summary>
    public class VacuumAbility : BaseAbility
    {
        [Header("Vacuum Settings")]
        [SerializeField] private float suckForce = 15f;
        [SerializeField] private float blowForce = 20f;
        [SerializeField] private int maxCapacity = 10;
        [SerializeField] private float suckRadius = 2f;
        [SerializeField] private LayerMask vacuumableLayer;

        private List<GameObject> storedItems = new List<GameObject>();

        public int CurrentCapacity => storedItems.Count;
        public bool IsFull => storedItems.Count >= maxCapacity;

        protected override void OnExecutePrimary(float boostMultiplier)
        {
            // Start sucking
        }

        protected override void OnExecuteSecondary(float boostMultiplier)
        {
            // Blow out all stored items
            BlowOutItems(boostMultiplier);
        }

        public override void UpdatePrimary(float boostMultiplier)
        {
            // Continuous sucking while holding button
            if (!CanUseAbility(boostMultiplier)) return;

            SuckItems(boostMultiplier);
            DrainBattery(boostMultiplier * Time.deltaTime);
        }

        private void SuckItems(float boostMultiplier)
        {
            if (IsFull)
            {
                Debug.Log("Vacuum is full! Blow out items first.");
                return;
            }

            // Find all vacuumable items in range
            Collider[] colliders = Physics.OverlapSphere(transform.position, suckRadius, vacuumableLayer);

            foreach (Collider col in colliders)
            {
                if (IsFull) break;

                // Check if item is small enough to vacuum
                Rigidbody rb = col.GetComponent<Rigidbody>();
                if (rb != null && rb.mass <= 1f) // Only vacuum light items
                {
                    // Pull toward player
                    Vector3 direction = (transform.position - col.transform.position).normalized;
                    rb.AddForce(direction * suckForce * boostMultiplier, ForceMode.Force);

                    // If close enough, store it
                    float distance = Vector3.Distance(transform.position, col.transform.position);
                    if (distance < 0.5f)
                    {
                        StoreItem(col.gameObject);
                    }
                }
            }
        }

        private void StoreItem(GameObject item)
        {
            if (IsFull || storedItems.Contains(item)) return;

            storedItems.Add(item);
            item.SetActive(false); // Hide the item
            Debug.Log($"Vacuumed {item.name}. Capacity: {storedItems.Count}/{maxCapacity}");
        }

        private void BlowOutItems(float boostMultiplier)
        {
            if (storedItems.Count == 0)
            {
                Debug.Log("Vacuum is empty!");
                return;
            }

            // Blow out all items in a spread pattern
            for (int i = storedItems.Count - 1; i >= 0; i--)
            {
                GameObject item = storedItems[i];
                if (item == null)
                {
                    storedItems.RemoveAt(i);
                    continue;
                }

                // Reactivate item
                item.SetActive(true);
                
                // Position in front of player with some randomness
                Vector3 spawnPos = transform.position + transform.forward * 1.5f + Vector3.up;
                item.transform.position = spawnPos;

                // Apply random outward force
                Rigidbody rb = item.GetComponent<Rigidbody>();
                if (rb != null)
                {
                    Vector3 randomDir = (transform.forward + Random.insideUnitSphere * 0.5f).normalized;
                    rb.linearVelocity = Vector3.zero;
                    rb.AddForce(randomDir * blowForce * boostMultiplier, ForceMode.Impulse);
                }
            }

            Debug.Log($"Blew out {storedItems.Count} items!");
            storedItems.Clear();
        }

        private void OnDrawGizmosSelected()
        {
            // Visualize suck radius
            Gizmos.color = Color.cyan;
            Gizmos.DrawWireSphere(transform.position, suckRadius);
        }
    }
}
