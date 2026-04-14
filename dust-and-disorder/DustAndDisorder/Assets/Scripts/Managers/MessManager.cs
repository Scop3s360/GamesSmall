using UnityEngine;
using System;
using System.Collections.Generic;
using DustAndDisorder.Objects;

namespace DustAndDisorder.Managers
{
    /// <summary>
    /// Tracks total mess percentage and handles owner cleaning
    /// </summary>
    public class MessManager : MonoBehaviour
    {
        public static MessManager Instance { get; private set; }

        [Header("Mess Settings")]
        [SerializeField] private float currentMessPercentage = 0f;
        [SerializeField] private float maxMessValue = 100f; // Total mess value from all tasks
        [SerializeField] private float ownerCleaningPercentage = 0.25f; // 25% cleaned per day

        public event Action<float> OnMessChanged; // Sends percentage 0-100
        public event Action OnMessMaxReached;

        public float CurrentMessPercentage => currentMessPercentage;
        private float currentMessValue = 0f;

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void Start()
        {
            // Calculate max mess value from all interactive objects
            CalculateMaxMessValue();
            UpdateMessPercentage();
        }

        private void CalculateMaxMessValue()
        {
            InteractiveObject[] allObjects = FindObjectsOfType<InteractiveObject>();
            maxMessValue = 0f;

            foreach (var obj in allObjects)
            {
                maxMessValue += obj.MessValue;
            }

            Debug.Log($"Total possible mess value: {maxMessValue}");
        }

        public void AddMess(float messValue)
        {
            currentMessValue += messValue;
            UpdateMessPercentage();
        }

        public void RemoveMess(float messValue)
        {
            currentMessValue = Mathf.Max(0f, currentMessValue - messValue);
            UpdateMessPercentage();
        }

        private void UpdateMessPercentage()
        {
            if (maxMessValue <= 0f)
            {
                currentMessPercentage = 0f;
                return;
            }

            currentMessPercentage = (currentMessValue / maxMessValue) * 100f;
            currentMessPercentage = Mathf.Clamp(currentMessPercentage, 0f, 100f);

            OnMessChanged?.Invoke(currentMessPercentage);

            // Check for win condition
            if (currentMessPercentage >= 100f)
            {
                OnMessMaxReached?.Invoke();
                GameManager.Instance?.WinGame();
            }

            Debug.Log($"Mess: {currentMessPercentage:F1}%");
        }

        public void OwnerClean()
        {
            Debug.Log($"Owner is cleaning {ownerCleaningPercentage * 100}% of the mess...");

            // Get all messy objects
            InteractiveObject[] allObjects = FindObjectsOfType<InteractiveObject>();
            
            foreach (var obj in allObjects)
            {
                obj.Clean(ownerCleaningPercentage);
            }

            // Recalculate mess after cleaning
            RecalculateMess();
        }

        private void RecalculateMess()
        {
            currentMessValue = 0f;
            InteractiveObject[] allObjects = FindObjectsOfType<InteractiveObject>();

            foreach (var obj in allObjects)
            {
                if (obj.IsMessy)
                {
                    currentMessValue += obj.MessValue;
                }
            }

            UpdateMessPercentage();
        }

        public void ResetMess()
        {
            currentMessValue = 0f;
            currentMessPercentage = 0f;

            InteractiveObject[] allObjects = FindObjectsOfType<InteractiveObject>();
            foreach (var obj in allObjects)
            {
                obj.ResetToOriginal();
            }

            OnMessChanged?.Invoke(0f);
        }
    }
}
