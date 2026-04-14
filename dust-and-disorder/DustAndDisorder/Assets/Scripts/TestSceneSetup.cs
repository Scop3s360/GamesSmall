using UnityEngine;
using DustAndDisorder.Player;
using DustAndDisorder.Objects;
using DustAndDisorder.Environment;

namespace DustAndDisorder
{
    /// <summary>
    /// Quick scene setup script for testing - attach to empty GameObject
    /// </summary>
    public class TestSceneSetup : MonoBehaviour
    {
        [Header("Setup Options")]
        [SerializeField] private bool autoSetupOnStart = true;

        private void Start()
        {
            if (autoSetupOnStart)
            {
                SetupTestScene();
            }
        }

        [ContextMenu("Setup Test Scene")]
        public void SetupTestScene()
        {
            Debug.Log("Setting up test scene...");

            // Create floor
            CreateFloor();

            // Create player
            CreatePlayer();

            // Create charging base
            CreateChargingBase();

            // Create test objects
            CreateTestObjects();

            // Setup camera
            SetupCamera();

            Debug.Log("Test scene setup complete!");
        }

        private void CreateFloor()
        {
            GameObject floor = GameObject.CreatePrimitive(PrimitiveType.Plane);
            floor.name = "Floor";
            floor.transform.position = Vector3.zero;
            floor.transform.localScale = new Vector3(5, 1, 5);
            
            // Set floor material to gray
            Renderer renderer = floor.GetComponent<Renderer>();
            if (renderer != null)
            {
                renderer.material.color = new Color(0.8f, 0.8f, 0.8f);
            }
        }

        private void CreatePlayer()
        {
            GameObject player = new GameObject("Player");
            player.tag = "Player";
            player.transform.position = new Vector3(0, 1, 0);

            // Add CharacterController
            CharacterController cc = player.AddComponent<CharacterController>();
            cc.radius = 0.5f;
            cc.height = 2f;
            cc.center = new Vector3(0, 1, 0);

            // Add player scripts
            player.AddComponent<PlayerController>();
            player.AddComponent<BatterySystem>();
            player.AddComponent<AbilitySystem>();

            // Add abilities
            player.AddComponent<DustAndDisorder.Abilities.PushAbility>();
            player.AddComponent<DustAndDisorder.Abilities.PullAbility>();
            player.AddComponent<DustAndDisorder.Abilities.VacuumAbility>();
            player.AddComponent<DustAndDisorder.Abilities.MopAbility>();

            // Add visual representation
            GameObject visual = GameObject.CreatePrimitive(PrimitiveType.Capsule);
            visual.name = "Visual";
            visual.transform.SetParent(player.transform);
            visual.transform.localPosition = new Vector3(0, 1, 0);
            Destroy(visual.GetComponent<Collider>()); // Remove collider from visual

            // Color the player blue
            Renderer renderer = visual.GetComponent<Renderer>();
            if (renderer != null)
            {
                renderer.material.color = new Color(0.2f, 0.5f, 1f);
            }

            Debug.Log("Player created at (0, 1, 0)");
        }

        private void CreateChargingBase()
        {
            GameObject chargingBase = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            chargingBase.name = "ChargingBase";
            chargingBase.tag = "ChargingBase";
            chargingBase.transform.position = new Vector3(-8, 0.5f, -8);
            chargingBase.transform.localScale = new Vector3(2, 0.5f, 2);

            // Add charging base script
            chargingBase.AddComponent<ChargingBase>();

            // Add trigger collider
            SphereCollider trigger = chargingBase.AddComponent<SphereCollider>();
            trigger.isTrigger = true;
            trigger.radius = 2f;

            // Color it yellow
            Renderer renderer = chargingBase.GetComponent<Renderer>();
            if (renderer != null)
            {
                renderer.material.color = Color.yellow;
            }

            Debug.Log("Charging base created at (-8, 0.5, -8)");
        }

        private void CreateTestObjects()
        {
            // Create various test objects around the scene

            // Light objects (lamps)
            CreateInteractiveObject("Lamp_1", new Vector3(3, 0.5f, 3), 0.5f, 1f, Color.white, false);
            CreateInteractiveObject("Lamp_2", new Vector3(-3, 0.5f, 3), 0.5f, 1f, Color.white, false);

            // Medium objects (trash cans)
            CreateInteractiveObject("TrashCan_1", new Vector3(5, 1f, 0), 1f, 2f, Color.gray, false);
            CreateInteractiveObject("TrashCan_2", new Vector3(-5, 1f, 0), 1f, 2f, Color.gray, false);

            // Heavy objects (plants)
            CreateInteractiveObject("Plant_1", new Vector3(3, 1f, -3), 5f, 3f, Color.green, true);
            CreateInteractiveObject("Plant_2", new Vector3(-3, 1f, -3), 5f, 3f, Color.green, true);

            // Small vacuumable items
            CreateVacuumableItem("Book_1", new Vector3(2, 0.2f, 0), Color.red);
            CreateVacuumableItem("Book_2", new Vector3(2.5f, 0.2f, 0.5f), Color.blue);
            CreateVacuumableItem("Book_3", new Vector3(1.5f, 0.2f, -0.5f), Color.green);

            Debug.Log("Test objects created");
        }

        private void CreateInteractiveObject(string name, Vector3 position, float weight, float messValue, Color color, bool isHeavy)
        {
            GameObject obj = GameObject.CreatePrimitive(PrimitiveType.Cube);
            obj.name = name;
            obj.transform.position = position;

            // Add Rigidbody
            Rigidbody rb = obj.AddComponent<Rigidbody>();
            rb.mass = weight;

            // Add InteractiveObject script
            InteractiveObject interactive = obj.AddComponent<InteractiveObject>();
            // Note: You'll need to set these via reflection or make them public
            // For now, they'll use default values

            // Color the object
            Renderer renderer = obj.GetComponent<Renderer>();
            if (renderer != null)
            {
                renderer.material.color = color;
            }
        }

        private void CreateVacuumableItem(string name, Vector3 position, Color color)
        {
            GameObject obj = GameObject.CreatePrimitive(PrimitiveType.Cube);
            obj.name = name;
            obj.transform.position = position;
            obj.transform.localScale = new Vector3(0.3f, 0.3f, 0.3f);
            obj.layer = LayerMask.NameToLayer("Default"); // Set to vacuumable layer if you create one

            // Add Rigidbody
            Rigidbody rb = obj.AddComponent<Rigidbody>();
            rb.mass = 0.1f;

            // Color the object
            Renderer renderer = obj.GetComponent<Renderer>();
            if (renderer != null)
            {
                renderer.material.color = color;
            }
        }

        private void SetupCamera()
        {
            Camera mainCam = Camera.main;
            if (mainCam != null)
            {
                // Add camera controller
                CameraController camController = mainCam.gameObject.AddComponent<CameraController>();
                
                // Find player
                GameObject player = GameObject.FindGameObjectWithTag("Player");
                if (player != null)
                {
                    camController.SetTarget(player.transform);
                }

                Debug.Log("Camera controller added");
            }
        }
    }
}
