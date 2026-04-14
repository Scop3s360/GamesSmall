using UnityEngine;
using TMPro;
using DustAndDisorder.Managers;

namespace DustAndDisorder.UI
{
    /// <summary>
    /// Displays day counter and remaining time
    /// </summary>
    public class DayTimer : MonoBehaviour
    {
        [Header("UI Elements")]
        [SerializeField] private TextMeshProUGUI dayText;
        [SerializeField] private TextMeshProUGUI timerText;

        private DayNightCycle dayNightCycle;

        private void Start()
        {
            dayNightCycle = FindObjectOfType<DayNightCycle>();

            if (dayNightCycle != null)
            {
                dayNightCycle.OnTimeChanged += UpdateTimer;
            }

            UpdateDayCounter();
        }

        private void OnDestroy()
        {
            if (dayNightCycle != null)
            {
                dayNightCycle.OnTimeChanged -= UpdateTimer;
            }
        }

        private void UpdateTimer(float remainingTime)
        {
            if (timerText == null) return;

            int minutes = Mathf.FloorToInt(remainingTime / 60f);
            int seconds = Mathf.FloorToInt(remainingTime % 60f);

            timerText.text = $"Time: {minutes:00}:{seconds:00}";
        }

        public void UpdateDayCounter()
        {
            if (dayText == null) return;

            int currentDay = GameManager.Instance?.CurrentDay ?? 1;
            dayText.text = $"Day {currentDay}";
        }
    }
}
