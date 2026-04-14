using UnityEngine;
using UnityEngine.UI;
using TMPro;
using DustAndDisorder.Player;
using DustAndDisorder.Managers;

namespace DustAndDisorder.UI
{
    /// <summary>
    /// Main UI manager that coordinates all UI elements
    /// </summary>
    public class UIManager : MonoBehaviour
    {
        public static UIManager Instance { get; private set; }

        [Header("UI References")]
        [SerializeField] private BatteryMeter batteryMeter;
        [SerializeField] private MessMeter messMeter;
        [SerializeField] private DayTimer dayTimer;
        [SerializeField] private GameObject winScreen;
        [SerializeField] private GameObject loseScreen;
        [SerializeField] private GameObject pauseScreen;

        [Header("Player Reference")]
        [SerializeField] private BatterySystem playerBattery;

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
            // Find player if not assigned
            if (playerBattery == null)
            {
                playerBattery = FindObjectOfType<BatterySystem>();
            }

            // Subscribe to events
            if (playerBattery != null && batteryMeter != null)
            {
                playerBattery.OnBatteryChanged += batteryMeter.UpdateBattery;
                playerBattery.OnBatteryDepleted += OnBatteryDepleted;
            }

            if (MessManager.Instance != null && messMeter != null)
            {
                MessManager.Instance.OnMessChanged += messMeter.UpdateMess;
            }

            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnGameStateChanged += OnGameStateChanged;
            }

            // Hide screens initially
            if (winScreen != null) winScreen.SetActive(false);
            if (loseScreen != null) loseScreen.SetActive(false);
            if (pauseScreen != null) pauseScreen.SetActive(false);
        }

        private void OnDestroy()
        {
            // Unsubscribe from events
            if (playerBattery != null && batteryMeter != null)
            {
                playerBattery.OnBatteryChanged -= batteryMeter.UpdateBattery;
                playerBattery.OnBatteryDepleted -= OnBatteryDepleted;
            }

            if (MessManager.Instance != null && messMeter != null)
            {
                MessManager.Instance.OnMessChanged -= messMeter.UpdateMess;
            }

            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnGameStateChanged -= OnGameStateChanged;
            }
        }

        private void OnBatteryDepleted()
        {
            GameManager.Instance?.LoseGame("Battery depleted!");
        }

        private void OnGameStateChanged(GameManager.GameState newState)
        {
            switch (newState)
            {
                case GameManager.GameState.Won:
                    if (winScreen != null) winScreen.SetActive(true);
                    break;
                case GameManager.GameState.Lost:
                    if (loseScreen != null) loseScreen.SetActive(true);
                    break;
                case GameManager.GameState.Paused:
                    if (pauseScreen != null) pauseScreen.SetActive(true);
                    break;
                case GameManager.GameState.Playing:
                    if (pauseScreen != null) pauseScreen.SetActive(false);
                    break;
            }
        }

        public void OnRestartButtonClicked()
        {
            GameManager.Instance?.RestartGame();
        }

        public void OnQuitButtonClicked()
        {
            GameManager.Instance?.QuitGame();
        }
    }
}
