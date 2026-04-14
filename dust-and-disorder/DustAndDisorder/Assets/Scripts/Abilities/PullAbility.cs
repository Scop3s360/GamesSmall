using UnityEngine;
using DustAndDisorder.Objects;

namespace DustAndDisorder.Abilities
{
    /// <summary>
    /// Pull ability - pulls objects toward player, opens doors/drawers
    /// </summary>
    public class PullAbility : BaseAbility
    {
        [Header("Pull Settings")]
        [SerializeField] private float pullForce = 8f;

        protected override void OnExecutePrimary(float boostMultiplier)
        {
            RaycastHit hit = GetTargetFromPlayer();
            
            if (hit.collider != null)
            {
                PullObject(hit, boostMultiplier);
            }
        }

        protected override void OnExecuteSecondary(float boostMultiplier)
        {
            // Same as primary for now
            OnExecutePrimary(boostMultiplier);
        }

        private void PullObject(RaycastHit hit, float boostMultiplier)
        {
            // Check for interactive object first (doors, drawers, etc.)
            InteractiveObject interactiveObj = hit.collider.GetComponent<InteractiveObject>();
            if (interactiveObj != null)
            {
                interactiveObj.OnPulled();
                return;
            }

            // Otherwise, apply pull force to rigidbody
            Rigidbody rb = hit.collider.GetComponent<Rigidbody>();
            if (rb == null) return;

            // Calculate pull direction (toward player)
            Vector3 pullDirection = (transform.position - hit.point).normalized;
            pullDirection.y = 0; // Keep pull horizontal

            // Apply force
            float totalForce = pullForce * boostMultiplier;
            rb.AddForce(pullDirection * totalForce, ForceMode.Impulse);

            Debug.Log($"Pulled {hit.collider.name} with force {totalForce}");
        }
    }
}
