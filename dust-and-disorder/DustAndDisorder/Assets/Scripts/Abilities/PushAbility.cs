using UnityEngine;
using DustAndDisorder.Objects;

namespace DustAndDisorder.Abilities
{
    /// <summary>
    /// Push ability - pushes objects away from player
    /// </summary>
    public class PushAbility : BaseAbility
    {
        [Header("Push Settings")]
        [SerializeField] private float pushForce = 10f;
        [SerializeField] private float heavyObjectThreshold = 5f; // Rigidbody mass threshold

        protected override void OnExecutePrimary(float boostMultiplier)
        {
            RaycastHit hit = GetTargetFromPlayer();
            
            if (hit.collider != null)
            {
                PushObject(hit, boostMultiplier);
            }
        }

        protected override void OnExecuteSecondary(float boostMultiplier)
        {
            // Secondary could be a wider area push or different behavior
            OnExecutePrimary(boostMultiplier);
        }

        private void PushObject(RaycastHit hit, float boostMultiplier)
        {
            Rigidbody rb = hit.collider.GetComponent<Rigidbody>();
            if (rb == null) return;

            // Check if object is too heavy without boost
            if (rb.mass >= heavyObjectThreshold && boostMultiplier < 1.5f)
            {
                Debug.Log("Object too heavy! Hold Shift to boost.");
                return;
            }

            // Calculate push direction (away from player)
            Vector3 pushDirection = (hit.point - transform.position).normalized;
            pushDirection.y = 0; // Keep push horizontal

            // Apply force
            float totalForce = pushForce * boostMultiplier;
            rb.AddForce(pushDirection * totalForce, ForceMode.Impulse);

            // Notify interactive object if it has one
            InteractiveObject interactiveObj = hit.collider.GetComponent<InteractiveObject>();
            interactiveObj?.OnPushed();

            Debug.Log($"Pushed {hit.collider.name} with force {totalForce}");
        }
    }
}
