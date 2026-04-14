using UnityEngine;
using DustAndDisorder.Player;

namespace DustAndDisorder.Environment
{
    /// <summary>
    /// Charging base that recharges player battery and refills water
    /// </summary>
    public class ChargingBase : MonoBehaviour
    {
        [Header("Visual Feedback")]
        [SerializeField] private Light chargingLight;
        [SerializeField] private Color idleColor = Color.yellow;
        [SerializeField] private Color chargingColor = Color.green;

        private void Start()
        {
            // Set up visual indicator
            if (chargingLight == null)
            {
                GameObject lightObj = new GameObject("ChargingLight");
                lightObj.transform.SetParent(transform);
                lightObj.transform.localPosition = Vector3.up * 0.5f;
                chargingLight = lightObj.AddComponent<Light>();
                chargingLight.type = LightType.Point;
                chargingLight.range = 3f;
                chargingLight.intensity = 2f;
            }

            chargingLight.color = idleColor;

            // Make sure this has the correct tag
            gameObject.tag = "ChargingBase";
        }

        private void OnTriggerEnter(Collider other)
        {
            if (other.CompareTag("Player"))
            {
                chargingLight.color = chargingColor;
                
                // Refill water for mop ability
                var mopAbility = other.GetComponent<DustAndDisorder.Abilities.MopAbility>();
                if (mopAbility != null)
                {
                    mopAbility.RefillWater();
                }
            }
        }

        private void OnTriggerExit(Collider other)
        {
            if (other.CompareTag("Player"))
            {
                chargingLight.color = idleColor;
            }
        }
    }
}
