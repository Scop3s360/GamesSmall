using UnityEngine;

namespace DustAndDisorder.Objects
{
    /// <summary>
    /// Base class for all interactive objects in the game
    /// </summary>
    [RequireComponent(typeof(Rigidbody))]
    public class InteractiveObject : MonoBehaviour
    {
        [Header("Object Properties")]
        [SerializeField] private float weight = 1f;
        [SerializeField] private bool isHeavy = false;
        [SerializeField] private float messValue = 1f; // Contribution to mess percentage

        [Header("State")]
        [SerializeField] private bool isMessy = false;

        private Rigidbody rb;
        private Vector3 originalPosition;
        private Quaternion originalRotation;

        public bool IsMessy => isMessy;
        public float MessValue => messValue;
        public bool IsHeavy => isHeavy;

        private void Awake()
        {
            rb = GetComponent<Rigidbody>();
            rb.mass = weight;

            originalPosition = transform.position;
            originalRotation = transform.rotation;
        }

        public virtual void OnPushed()
        {
            if (!isMessy)
            {
                SetMessy(true);
            }
        }

        public virtual void OnPulled()
        {
            if (!isMessy)
            {
                SetMessy(true);
            }
        }

        public virtual void OnVacuumed()
        {
            if (!isMessy)
            {
                SetMessy(true);
            }
        }

        protected void SetMessy(bool messy)
        {
            if (isMessy == messy) return;

            isMessy = messy;

            // Notify mess manager
            var messManager = FindObjectOfType<DustAndDisorder.Managers.MessManager>();
            if (messManager != null)
            {
                if (isMessy)
                    messManager.AddMess(messValue);
                else
                    messManager.RemoveMess(messValue);
            }

            // Visual feedback
            UpdateVisuals();
        }

        protected virtual void UpdateVisuals()
        {
            // Override in derived classes for specific visual changes
            // For now, just change color slightly
            Renderer renderer = GetComponent<Renderer>();
            if (renderer != null)
            {
                if (isMessy)
                {
                    renderer.material.color = Color.gray;
                }
                else
                {
                    renderer.material.color = Color.white;
                }
            }
        }

        public void ResetToOriginal()
        {
            transform.position = originalPosition;
            transform.rotation = originalRotation;
            rb.linearVelocity = Vector3.zero;
            rb.angularVelocity = Vector3.zero;
            SetMessy(false);
        }

        public void Clean(float percentage)
        {
            // Random chance to be cleaned based on percentage
            if (isMessy && Random.value < percentage)
            {
                ResetToOriginal();
            }
        }
    }
}
