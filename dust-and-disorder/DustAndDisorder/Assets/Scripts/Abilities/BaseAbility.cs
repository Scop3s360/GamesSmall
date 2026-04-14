using UnityEngine;
using DustAndDisorder.Player;

namespace DustAndDisorder.Abilities
{
    /// <summary>
    /// Base class for all player abilities
    /// </summary>
    public abstract class BaseAbility : MonoBehaviour
    {
        [Header("Ability Settings")]
        [SerializeField] protected float batteryCost = 5f;
        [SerializeField] protected float range = 3f;
        [SerializeField] protected LayerMask interactableLayer;

        protected BatterySystem batterySystem;
        protected Camera mainCamera;

        public virtual void Initialize(BatterySystem battery)
        {
            batterySystem = battery;
            mainCamera = Camera.main;
        }

        /// <summary>
        /// Execute primary action (left mouse button press)
        /// </summary>
        public virtual void ExecutePrimary(float boostMultiplier)
        {
            if (!CanUseAbility(boostMultiplier)) return;
            
            DrainBattery(boostMultiplier);
            OnExecutePrimary(boostMultiplier);
        }

        /// <summary>
        /// Execute secondary action (right mouse button press)
        /// </summary>
        public virtual void ExecuteSecondary(float boostMultiplier)
        {
            if (!CanUseAbility(boostMultiplier)) return;
            
            DrainBattery(boostMultiplier);
            OnExecuteSecondary(boostMultiplier);
        }

        /// <summary>
        /// Update primary action (left mouse button held)
        /// </summary>
        public virtual void UpdatePrimary(float boostMultiplier) { }

        /// <summary>
        /// Update secondary action (right mouse button held)
        /// </summary>
        public virtual void UpdateSecondary(float boostMultiplier) { }

        protected abstract void OnExecutePrimary(float boostMultiplier);
        protected abstract void OnExecuteSecondary(float boostMultiplier);

        protected virtual bool CanUseAbility(float boostMultiplier)
        {
            float cost = batteryCost * boostMultiplier;
            return batterySystem != null && batterySystem.CurrentBattery >= cost;
        }

        protected virtual void DrainBattery(float boostMultiplier)
        {
            float cost = batteryCost * boostMultiplier;
            batterySystem?.DrainBattery(cost);
        }

        protected RaycastHit GetTargetFromMouse()
        {
            Ray ray = mainCamera.ScreenPointToRay(Input.mousePosition);
            Physics.Raycast(ray, out RaycastHit hit, range, interactableLayer);
            return hit;
        }

        protected RaycastHit GetTargetFromPlayer()
        {
            Vector3 origin = transform.position + Vector3.up;
            Vector3 direction = transform.forward;
            Physics.Raycast(origin, direction, out RaycastHit hit, range, interactableLayer);
            return hit;
        }
    }
}
