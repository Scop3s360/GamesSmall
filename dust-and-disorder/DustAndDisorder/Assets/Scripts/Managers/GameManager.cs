using UnityEngine;
using System;

namespace DustAndDisorder.Managers
{
    /// <summary>
    /// Manages overall game state, win/lose conditions, and scene flow
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("Game State")]
        [SerializeField] private GameState currentState = GameState.Playing;
        [SerializeField] private int currentDay = 1;
        [SerializeField] private int maxDays = 10;

        public event Action<GameState> OnGameStateChanged;
        public event Action<int> OnDayChanged;
        public event Action OnGameWon;
        public event Action OnGameLost;

        public GameState CurrentState => currentState;
        public int CurrentDay => currentDay;

        public enum GameState
        {
            Menu,
            Playing,
            Paused,
            DayEnd,
            Won,
            Lost
        }

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void Start()
        {
            SetGameState(GameState.Playing);
        }

        private void Update()
        {
            // Pause functionality
            if (Input.GetKeyDown(KeyCode.Escape))
            {
                if (currentState == GameState.Playing)
                    SetGameState(GameState.Paused);
                else if (currentState == GameState.Paused)
                    SetGameState(GameState.Playing);
            }
        }

        public void SetGameState(GameState newState)
        {
            if (currentState == newState) return;

            currentState = newState;
            OnGameStateChanged?.Invoke(newState);

            // Handle state-specific logic
            switch (newState)
            {
                case GameState.Paused:
                    Time.timeScale = 0f;
                    break;
                case GameState.Playing:
                    Time.timeScale = 1f;
                    break;
                case GameState.Won:
                    OnGameWon?.Invoke();
                    Time.timeScale = 0f;
                    break;
                case GameState.Lost:
                    OnGameLost?.Invoke();
                    Time.timeScale = 0f;
                    break;
            }
        }

        public void StartNextDay()
        {
            currentDay++;
            OnDayChanged?.Invoke(currentDay);

            if (currentDay > maxDays)
            {
                // Too many days, player loses
                LoseGame("Ran out of days!");
            }
            else
            {
                SetGameState(GameState.Playing);
            }
        }

        public void WinGame()
        {
            Debug.Log("YOU WIN! 100% mess achieved!");
            SetGameState(GameState.Won);
        }

        public void LoseGame(string reason)
        {
            Debug.Log($"GAME OVER: {reason}");
            SetGameState(GameState.Lost);
        }

        public void RestartGame()
        {
            Time.timeScale = 1f;
            UnityEngine.SceneManagement.SceneManager.LoadScene(
                UnityEngine.SceneManagement.SceneManager.GetActiveScene().name
            );
        }

        public void QuitGame()
        {
            Application.Quit();
#if UNITY_EDITOR
            UnityEditor.EditorApplication.isPlaying = false;
#endif
        }
    }
}
