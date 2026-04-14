using UnityEngine;
using DustAndDisorder.Abilities;

namespace DustAndDisorder.Player
{
    /// <summary>
    /// Manages ability selection and execution
    /// </summary>
    [RequireComponent(typeof(BatterySystem))]
    public class AbilitySystem : MonoBehaviour
    {
        [Header("Abilities")]
        [SerializeField] private PushAbility pushAbility;
        [SerializeField] private PullAbility pullAbility;
        [SerializeField] private VacuumAbility vacuumAbility;
        [SerializeField] private MopAbility mopAbility;

        [Header("Settings")]
        [SerializeField] private float boostMultiplier = 2f;
        
        private BaseAbility currentAbility;
        private BatterySystem batterySystem;
        private int currentAbilityIndex = 0;

        private BaseAbility[] abilities;

        private void Awake()
        {
            batterySystem = GetComponent<BatterySystem>();
            
            // Initialize abilities array
            abilities = new BaseAbility[4];
        }

        private void Start()
        {
            // Get or create ability components
            pushAbility = GetComponent<PushAbility>() ?? gameObject.AddComponent<PushAbility>();
            pullAbility = GetComponent<PullAbility>() ?? gameObject.AddComponent<PullAbility>();
            vacuumAbility = GetComponent<VacuumAbility>() ?? gameObject.AddComponent<VacuumAbility>();
            mopAbility = GetComponent<MopAbility>() ?? gameObject.AddComponent<MopAbility>();

            abilities[0] = pushAbility;
            abilities[1] = pullAbility;
            abilities[2] = vacuumAbility;
            abilities[3] = mopAbility;

            // Initialize all abilities
            foreach (var ability in abilities)
            {
                if (ability != null)
                {
                    ability.Initialize(batterySystem);
                }
            }

            // Select first ability
            SelectAbility(0);
        }

        private void Update()
        {
            HandleAbilitySelection();
            HandleAbilityExecution();
        }

        private void HandleAbilitySelection()
        {
            // Number keys 1-4
            if (Input.GetKeyDown(KeyCode.Alpha1)) SelectAbility(0);
            if (Input.GetKeyDown(KeyCode.Alpha2)) SelectAbility(1);
            if (Input.GetKeyDown(KeyCode.Alpha3)) SelectAbility(2);
            if (Input.GetKeyDown(KeyCode.Alpha4)) SelectAbility(3);

            // Mouse scroll wheel
            float scroll = Input.GetAxis("Mouse ScrollWheel");
            if (scroll > 0f)
            {
                SelectAbility((currentAbilityIndex + 1) % abilities.Length);
            }
            else if (scroll < 0f)
            {
                SelectAbility((currentAbilityIndex - 1 + abilities.Length) % abilities.Length);
            }
        }

        private void HandleAbilityExecution()
        {
            if (currentAbility == null || batterySystem.IsDepleted) return;

            bool isBoost = Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift);
            float boostValue = isBoost ? boostMultiplier : 1f;

            // Primary action (left mouse button)
            if (Input.GetMouseButtonDown(0))
            {
                currentAbility.ExecutePrimary(boostValue);
            }

            // Secondary action (right mouse button)
            if (Input.GetMouseButtonDown(1))
            {
                currentAbility.ExecuteSecondary(boostValue);
            }

            // Continuous actions (hold button)
            if (Input.GetMouseButton(0))
            {
                currentAbility.UpdatePrimary(boostValue);
            }

            if (Input.GetMouseButton(1))
            {
                currentAbility.UpdateSecondary(boostValue);
            }
        }

        private void SelectAbility(int index)
        {
            if (index < 0 || index >= abilities.Length) return;

            currentAbilityIndex = index;
            currentAbility = abilities[index];

            Debug.Log($"Selected ability: {currentAbility?.GetType().Name ?? "None"}");
        }

        public BaseAbility CurrentAbility => currentAbility;
        public int CurrentAbilityIndex => currentAbilityIndex;
    }
}
