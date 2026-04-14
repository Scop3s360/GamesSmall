using UnityEngine;

namespace DustAndDisorder.Player
{
    /// <summary>
    /// Controls player movement, rotation, and battery-based mechanics
    /// </summary>
    [RequireComponent(typeof(CharacterController))]
    [RequireComponent(typeof(BatterySystem))]
    public class PlayerController : MonoBehaviour
    {
        [Header("Movement Settings")]
        [SerializeField] private float moveSpeed = 5f;
        [SerializeField] private float rotationSpeed = 10f;
        
        [Header("Battery Drain")]
        [SerializeField] private float movementBatteryDrain = 1f; // Battery per second while moving
        
        private CharacterController characterController;
        private BatterySystem batterySystem;
        private AbilitySystem abilitySystem;
        
        private Vector3 moveDirection;
        private bool isMoving;

        private void Awake()
        {
            characterController = GetComponent<CharacterController>();
            batterySystem = GetComponent<BatterySystem>();
            abilitySystem = GetComponent<AbilitySystem>();
        }

        private void Update()
        {
            if (batterySystem.IsDepleted)
            {
                // Can't move if battery is dead
                return;
            }

            HandleMovement();
            HandleRotation();
        }

        private void HandleMovement()
        {
            // Get input
            float horizontal = Input.GetAxisRaw("Horizontal"); // A/D or Left/Right
            float vertical = Input.GetAxisRaw("Vertical");     // W/S or Up/Down

            // Calculate movement direction
            moveDirection = new Vector3(horizontal, 0f, vertical).normalized;
            
            isMoving = moveDirection.magnitude > 0.1f;

            if (isMoving)
            {
                // Move the character
                Vector3 move = moveDirection * moveSpeed * Time.deltaTime;
                characterController.Move(move);

                // Drain battery while moving
                batterySystem.DrainBattery(movementBatteryDrain * Time.deltaTime);
            }
        }

        private void HandleRotation()
        {
            // Rotate to face movement direction
            if (isMoving)
            {
                Quaternion targetRotation = Quaternion.LookRotation(moveDirection);
                transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, rotationSpeed * Time.deltaTime);
            }
        }

        public bool IsMoving => isMoving;
    }
}
