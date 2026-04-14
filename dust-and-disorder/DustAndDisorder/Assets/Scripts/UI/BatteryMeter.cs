using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace DustAndDisorder.UI
{
    /// <summary>
    /// Displays battery level with visual feedback
    /// </summary>
    public class BatteryMeter : MonoBehaviour
    {
        [Header("UI Elements")]
        [SerializeField] private Slider batterySlider;
        [SerializeField] private Image fillImage;
        [SerializeField] private TextMeshProUGUI batteryText;

        [Header("Colors")]
        [SerializeField] private Color fullColor = Color.green;
        [SerializeField] private Color mediumColor = Color.yellow;
        [SerializeField] private Color lowColor = Color.red;

        public void UpdateBattery(float current, float max)
        {
            float percentage = (current / max) * 100f;

            // Update slider
            if (batterySlider != null)
            {
                batterySlider.value = current;
                batterySlider.maxValue = max;
            }

            // Update text
            if (batteryText != null)
            {
                batteryText.text = $"Battery: {percentage:F0}%";
            }

            // Update color
            if (fillImage != null)
            {
                if (percentage > 50f)
                    fillImage.color = fullColor;
                else if (percentage > 25f)
                    fillImage.color = mediumColor;
                else
                    fillImage.color = lowColor;
            }
        }
    }
}
