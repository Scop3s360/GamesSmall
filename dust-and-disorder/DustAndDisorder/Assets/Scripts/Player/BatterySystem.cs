using UnityEngine;
using System;

namespace DustAndDisorder.Player
{
    /// <summary>
    /// Manages player battery capacity, drain, and recharging
    /// </summary>
    public class BatterySystem : MonoBehaviour
    {
        [Header("Battery Settings")]
        [SerializeField] private float maxBattery = 100f;
        [SerializeField] private float currentBattery = 100f;
        [SerializeField] private float rechargeRate = 20f; // Battery per second when charging
        
        [Header("Charging")]
        [SerializeField] private float chargeRange = 2f; // Distance to charging base
        
        private Transform chargingBase;
        private bool isCharging;

        // Events for UI updates
        public event Action<float, float> OnBatteryChanged; // current, max
        public event Action OnBatteryDepleted;
        public event Action<bool> OnChargingStateChanged;

        public bool IsDepleted => currentBattery <= 0f;
        public float CurrentBattery => currentBattery;
        public float MaxBattery => maxBattery;
        public float BatteryPercentage => (currentBattery / maxBattery) * 100f;
        public bool IsCharging => isCharging;

        private void Start()
        {
            // Find charging base in scene
            GameObject baseObject = GameObject.FindGameObjectWithTag("ChargingBase");
            if (baseObject != null)
            {
                chargingBase = baseObject.transform;
            }
            else
            {
                Debug.LogWarning("No ChargingBase found in scene! Player won't be able to recharge.");
            }

            currentBattery = maxBattery;
            OnBatteryChanged?.Invoke(currentBattery, maxBattery);
        }

        private void Update()
        {
            CheckChargingRange();

            if (isCharging)
            {
                RechargeBattery(rechargeRate * Time.deltaTime);
            }
        }

        private void CheckChargingRange()
        {
            if (chargingBase == null) return;

            float distance = Vector3.Distance(transform.position, chargingBase.position);
            bool wasCharging = isCharging;
            isCharging = distance <= chargeRange;

            if (wasCharging != isCharging)
            {
                OnChargingStateChanged?.Invoke(isCharging);
            }
        }

        public void DrainBattery(float amount)
        {
            if (amount <= 0f) return;

            currentBattery = Mathf.Max(0f, currentBattery - amount);
            OnBatteryChanged?.Invoke(currentBattery, maxBattery);

            if (currentBattery <= 0f)
            {
                OnBatteryDepleted?.Invoke();
            }
        }

        public void RechargeBattery(float amount)
        {
            if (amount <= 0f || currentBattery >= maxBattery) return;

            currentBattery = Mathf.Min(maxBattery, currentBattery + amount);
            OnBatteryChanged?.Invoke(currentBattery, maxBattery);
        }

        public void SetChargingBase(Transform baseTransform)
        {
            chargingBase = baseTransform;
        }

        private void OnDrawGizmosSelected()
        {
            // Visualize charging range in editor
            if (chargingBase != null)
            {
                Gizmos.color = Color.yellow;
                Gizmos.DrawWireSphere(chargingBase.position, chargeRange);
            }
        }
    }
}
