using UnityEngine;
using System;

namespace DustAndDisorder.Managers
{
    /// <summary>
    /// Manages the day/night cycle and timer
    /// </summary>
    public class DayNightCycle : MonoBehaviour
    {
        [Header("Timer Settings")]
        [SerializeField] private float dayDuration = 300f; // 5 minutes in seconds
        [SerializeField] private float currentTime = 0f;

        public event Action OnDayStart;
        public event Action OnDayEnd;
        public event Action<float> OnTimeChanged; // Sends remaining time

        public float RemainingTime => Mathf.Max(0f, dayDuration - currentTime);
        public float DayProgress => currentTime / dayDuration;
        public bool IsDayOver => currentTime >= dayDuration;

        private bool dayActive = false;

        private void Start()
        {
            StartDay();
        }

        private void Update()
        {
            if (!dayActive) return;

            // Only count time when game is playing
            if (GameManager.Instance != null && 
                GameManager.Instance.CurrentState != GameManager.GameState.Playing)
            {
                return;
            }

            currentTime += Time.deltaTime;
            OnTimeChanged?.Invoke(RemainingTime);

            if (IsDayOver)
            {
                EndDay();
            }
        }

        public void StartDay()
        {
            currentTime = 0f;
            dayActive = true;
            OnDayStart?.Invoke();
            Debug.Log($"Day {GameManager.Instance?.CurrentDay ?? 1} started! You have {dayDuration} seconds.");
        }

        private void EndDay()
        {
            dayActive = false;
            OnDayEnd?.Invoke();
            Debug.Log("Day ended! Owner is coming home...");

            // Trigger owner cleaning
            StartCoroutine(OwnerCleaningSequence());
        }

        private System.Collections.IEnumerator OwnerCleaningSequence()
        {
            // Change game state to day end
            GameManager.Instance?.SetGameState(GameManager.GameState.DayEnd);

            // Wait a moment for dramatic effect
            yield return new WaitForSecondsRealtime(2f);

            // Owner cleans
            MessManager.Instance?.OwnerClean();

            // Wait another moment
            yield return new WaitForSecondsRealtime(2f);

            // Start next day
            GameManager.Instance?.StartNextDay();
            StartDay();
        }

        public void AddTime(float seconds)
        {
            currentTime = Mathf.Max(0f, currentTime - seconds);
        }

        public void SetDayDuration(float seconds)
        {
            dayDuration = seconds;
        }
    }
}
