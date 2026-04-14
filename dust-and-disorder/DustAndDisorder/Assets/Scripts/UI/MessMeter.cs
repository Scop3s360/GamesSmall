using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace DustAndDisorder.UI
{
    /// <summary>
    /// Displays mess percentage with visual feedback
    /// </summary>
    public class MessMeter : MonoBehaviour
    {
        [Header("UI Elements")]
        [SerializeField] private Slider messSlider;
        [SerializeField] private Image fillImage;
        [SerializeField] private TextMeshProUGUI messText;

        [Header("Colors")]
        [SerializeField] private Color startColor = Color.white;
        [SerializeField] private Color endColor = Color.red;

        public void UpdateMess(float percentage)
        {
            // Update slider
            if (messSlider != null)
            {
                messSlider.value = percentage;
                messSlider.maxValue = 100f;
            }

            // Update text
            if (messText != null)
            {
                messText.text = $"Mess: {percentage:F1}%";
            }

            // Update color (gradient from white to red)
            if (fillImage != null)
            {
                fillImage.color = Color.Lerp(startColor, endColor, percentage / 100f);
            }
        }
    }
}
