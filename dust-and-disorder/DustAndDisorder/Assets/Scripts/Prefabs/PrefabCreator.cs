using UnityEngine;
using DustAndDisorder.Objects;

namespace DustAndDisorder.Prefabs
{
    /// <summary>
    /// Creates all prefabs for the game - run this in Unity Editor
    /// </summary>
    public class PrefabCreator : MonoBehaviour
    {
        [Header("Prefab Settings")]
        [SerializeField] private bool createOnStart = false;
        
        [ContextMenu("Create All Prefabs")]
        public void CreateAllPrefabs()
        {
            Debug.Log("Creating all prefabs...");
            
            CreateBedroomPrefabs();
            CreateKitchenPrefabs();
            CreateBathroomPrefabs();
            CreateFrontRoomPrefabs();
            
            Debug.Log("All prefabs created!");
        }

        private void Start()
        {
            if (createOnStart)
            {
                CreateAllPrefabs();
            }
        }

        #region Bedroom Prefabs (8 tasks)

        [ContextMenu("Create Bedroom Prefabs")]
        public void CreateBedroomPrefabs()
        {
            Debug.Log("Creating bedroom prefabs...");

            // 1. Nightstand lamp
            CreateLamp("Bedroom_Lamp", new Vector3(15, 0.5f, 15), Color.white);

            // 2. Wardrobe with clothes (container)
            CreateWardrobe("Bedroom_Wardrobe", new Vector3(18, 1f, 15));

            // 3. Laundry basket
            CreateLaundryBasket("Bedroom_LaundryBasket", new Vector3(15, 0.5f, 18));

            // 4. Bed (unmake bed task)
            CreateBed("Bedroom_Bed", new Vector3(20, 0.3f, 20));

            // 5. Dresser with items
            CreateDresser("Bedroom_Dresser", new Vector3(15, 1f, 22));

            // 6. Closet with shoes
            CreateCloset("Bedroom_Closet", new Vector3(22, 1f, 15));

            // 7. Potted plant (heavy)
            CreatePlant("Bedroom_Plant", new Vector3(18, 1f, 22), true);

            // 8. Bookshelf
            CreateBookshelf("Bedroom_Bookshelf", new Vector3(22, 1.5f, 22));
        }

        #endregion

        #region Kitchen Prefabs (8 tasks)

        [ContextMenu("Create Kitchen Prefabs")]
        public void CreateKitchenPrefabs()
        {
            Debug.Log("Creating kitchen prefabs...");

            // 1. Trash can
            CreateTrashCan("Kitchen_TrashCan", new Vector3(-15, 0.75f, 15));

            // 2. Cabinets
            CreateCabinet("Kitchen_Cabinet", new Vector3(-18, 1f, 15));

            // 3. Dish rack
            CreateDishRack("Kitchen_DishRack", new Vector3(-15, 0.5f, 18));

            // 4. Counter items
            CreateCounterItems("Kitchen_CounterItems", new Vector3(-20, 0.5f, 15));

            // 5. Fruit bowl
            CreateFruitBowl("Kitchen_FruitBowl", new Vector3(-15, 0.5f, 20));

            // 6. Fridge
            CreateFridge("Kitchen_Fridge", new Vector3(-22, 1.5f, 15));

            // 7. Pet food bowl
            CreatePetBowl("Kitchen_PetBowl", new Vector3(-18, 0.2f, 22));

            // 8. Mop bucket (for water)
            CreateMopBucket("Kitchen_MopBucket", new Vector3(-22, 0.5f, 22));
        }

        #endregion

        #region Bathroom Prefabs (8 tasks)

        [ContextMenu("Create Bathroom Prefabs")]
        public void CreateBathroomPrefabs()
        {
            Debug.Log("Creating bathroom prefabs...");

            // 1. Toiletries on counter
            CreateToiletries("Bathroom_Toiletries", new Vector3(-15, 0.5f, -15));

            // 2. Towel rack
            CreateTowelRack("Bathroom_TowelRack", new Vector3(-18, 1.5f, -15));

            // 3. Trash bin
            CreateTrashCan("Bathroom_TrashBin", new Vector3(-15, 0.5f, -18));

            // 4. Toilet paper
            CreateToiletPaper("Bathroom_ToiletPaper", new Vector3(-20, 0.5f, -15));

            // 5. Bath mat
            CreateBathMat("Bathroom_BathMat", new Vector3(-15, 0.1f, -20));

            // 6. Medicine cabinet
            CreateMedicineCabinet("Bathroom_MedicineCabinet", new Vector3(-22, 1.5f, -15));

            // 7. Soap dispenser
            CreateSoapDispenser("Bathroom_SoapDispenser", new Vector3(-18, 0.5f, -22));

            // 8. Water source (for squirting)
            CreateWaterSource("Bathroom_WaterSource", new Vector3(-22, 0.5f, -22));
        }

        #endregion

        #region Front Room Prefabs (8 tasks)

        [ContextMenu("Create Front Room Prefabs")]
        public void CreateFrontRoomPrefabs()
        {
            Debug.Log("Creating front room prefabs...");

            // 1. Coffee table items
            CreateCoffeeTable("FrontRoom_CoffeeTable", new Vector3(0, 0.3f, 0));

            // 2. Bookshelf
            CreateBookshelf("FrontRoom_Bookshelf", new Vector3(5, 1.5f, 0));

            // 3. Plant pot (heavy)
            CreatePlant("FrontRoom_Plant", new Vector3(0, 1f, 5), true);

            // 4. Side table lamp
            CreateLamp("FrontRoom_Lamp", new Vector3(-5, 0.5f, 0), Color.yellow);

            // 5. Magazines/newspapers
            CreateMagazines("FrontRoom_Magazines", new Vector3(0, 0.2f, -5));

            // 6. Couch cushions
            CreateCouchCushions("FrontRoom_CouchCushions", new Vector3(5, 0.5f, 5));

            // 7. Decorative items
            CreateDecorativeItems("FrontRoom_Decorations", new Vector3(-5, 0.5f, 5));

            // 8. Vacuum dust (special)
            CreateDustPile("FrontRoom_DustPile", new Vector3(5, 0.1f, -5));
        }

        #endregion

        #region Helper Methods

        private GameObject CreateInteractiveBase(string name, Vector3 position, PrimitiveType shape, Vector3 scale, Color color, float weight, float messValue, bool isHeavy = false)
        {
            GameObject obj = GameObject.CreatePrimitive(shape);
            obj.name = name;
            obj.transform.position = position;
            obj.transform.localScale = scale;

            // Add Rigidbody
            Rigidbody rb = obj.AddComponent<Rigidbody>();
            rb.mass = weight;

            // Add InteractiveObject
            InteractiveObject interactive = obj.AddComponent<InteractiveObject>();
            // Note: Since fields are private, we'd need to expose them or use SerializedObject
            // For now, the component will use default values

            // Set color
            Renderer renderer = obj.GetComponent<Renderer>();
            if (renderer != null)
            {
                renderer.material.color = color;
            }

            return obj;
        }

        // Bedroom objects
        private void CreateLamp(string name, Vector3 pos, Color color)
        {
            GameObject lamp = CreateInteractiveBase(name, pos, PrimitiveType.Cylinder, 
                new Vector3(0.3f, 0.5f, 0.3f), color, 0.5f, 1f);
        }

        private void CreateWardrobe(string name, Vector3 pos)
        {
            GameObject wardrobe = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(2f, 2f, 1f), new Color(0.6f, 0.4f, 0.2f), 10f, 2f, true);
        }

        private void CreateLaundryBasket(string name, Vector3 pos)
        {
            GameObject basket = CreateInteractiveBase(name, pos, PrimitiveType.Cylinder,
                new Vector3(0.8f, 0.5f, 0.8f), new Color(0.8f, 0.8f, 0.6f), 1f, 2f);
        }

        private void CreateBed(string name, Vector3 pos)
        {
            GameObject bed = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(2f, 0.3f, 3f), new Color(0.9f, 0.9f, 1f), 15f, 3f, true);
        }

        private void CreateDresser(string name, Vector3 pos)
        {
            GameObject dresser = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(1.5f, 1f, 0.5f), new Color(0.5f, 0.3f, 0.2f), 8f, 2f);
        }

        private void CreateCloset(string name, Vector3 pos)
        {
            GameObject closet = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(1.5f, 2f, 0.8f), new Color(0.7f, 0.5f, 0.3f), 12f, 2f, true);
        }

        private void CreatePlant(string name, Vector3 pos, bool isHeavy)
        {
            GameObject plant = CreateInteractiveBase(name, pos, PrimitiveType.Cylinder,
                new Vector3(0.6f, 1f, 0.6f), new Color(0.2f, 0.6f, 0.2f), 5f, 3f, isHeavy);
        }

        private void CreateBookshelf(string name, Vector3 pos)
        {
            GameObject shelf = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(1.5f, 2f, 0.4f), new Color(0.6f, 0.4f, 0.2f), 10f, 2f, true);
        }

        // Kitchen objects
        private void CreateTrashCan(string name, Vector3 pos)
        {
            GameObject trash = CreateInteractiveBase(name, pos, PrimitiveType.Cylinder,
                new Vector3(0.5f, 0.75f, 0.5f), Color.gray, 1f, 2f);
        }

        private void CreateCabinet(string name, Vector3 pos)
        {
            GameObject cabinet = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(1f, 1f, 0.5f), new Color(0.7f, 0.5f, 0.3f), 8f, 2f);
        }

        private void CreateDishRack(string name, Vector3 pos)
        {
            GameObject rack = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(0.8f, 0.3f, 0.5f), new Color(0.9f, 0.9f, 0.9f), 1.5f, 2f);
        }

        private void CreateCounterItems(string name, Vector3 pos)
        {
            GameObject items = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(0.5f, 0.3f, 0.5f), new Color(0.8f, 0.7f, 0.6f), 0.8f, 1f);
        }

        private void CreateFruitBowl(string name, Vector3 pos)
        {
            GameObject bowl = CreateInteractiveBase(name, pos, PrimitiveType.Sphere,
                new Vector3(0.5f, 0.3f, 0.5f), new Color(1f, 0.8f, 0.2f), 0.7f, 1.5f);
        }

        private void CreateFridge(string name, Vector3 pos)
        {
            GameObject fridge = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(1f, 2f, 1f), Color.white, 20f, 3f, true);
        }

        private void CreatePetBowl(string name, Vector3 pos)
        {
            GameObject bowl = CreateInteractiveBase(name, pos, PrimitiveType.Cylinder,
                new Vector3(0.3f, 0.1f, 0.3f), new Color(0.8f, 0.6f, 0.4f), 0.5f, 1f);
        }

        private void CreateMopBucket(string name, Vector3 pos)
        {
            GameObject bucket = CreateInteractiveBase(name, pos, PrimitiveType.Cylinder,
                new Vector3(0.4f, 0.5f, 0.4f), Color.blue, 1.5f, 1.5f);
        }

        // Bathroom objects
        private void CreateToiletries(string name, Vector3 pos)
        {
            GameObject items = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(0.4f, 0.3f, 0.4f), new Color(0.9f, 0.8f, 0.7f), 0.5f, 1f);
        }

        private void CreateTowelRack(string name, Vector3 pos)
        {
            GameObject rack = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(0.8f, 0.1f, 0.1f), new Color(0.9f, 0.9f, 0.9f), 1f, 1.5f);
        }

        private void CreateToiletPaper(string name, Vector3 pos)
        {
            GameObject tp = CreateInteractiveBase(name, pos, PrimitiveType.Cylinder,
                new Vector3(0.2f, 0.1f, 0.2f), Color.white, 0.2f, 0.5f);
        }

        private void CreateBathMat(string name, Vector3 pos)
        {
            GameObject mat = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(1f, 0.05f, 0.6f), new Color(0.6f, 0.8f, 1f), 0.5f, 1f);
        }

        private void CreateMedicineCabinet(string name, Vector3 pos)
        {
            GameObject cabinet = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(0.6f, 0.8f, 0.2f), Color.white, 3f, 2f);
        }

        private void CreateSoapDispenser(string name, Vector3 pos)
        {
            GameObject soap = CreateInteractiveBase(name, pos, PrimitiveType.Cylinder,
                new Vector3(0.15f, 0.3f, 0.15f), new Color(0.7f, 1f, 0.7f), 0.3f, 0.5f);
        }

        private void CreateWaterSource(string name, Vector3 pos)
        {
            GameObject water = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(0.5f, 0.3f, 0.5f), new Color(0.5f, 0.7f, 1f), 1f, 1f);
        }

        // Front room objects
        private void CreateCoffeeTable(string name, Vector3 pos)
        {
            GameObject table = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(1.5f, 0.4f, 0.8f), new Color(0.6f, 0.4f, 0.2f), 5f, 2f);
        }

        private void CreateMagazines(string name, Vector3 pos)
        {
            GameObject mags = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(0.4f, 0.1f, 0.3f), new Color(0.9f, 0.7f, 0.5f), 0.3f, 1f);
        }

        private void CreateCouchCushions(string name, Vector3 pos)
        {
            GameObject cushion = CreateInteractiveBase(name, pos, PrimitiveType.Cube,
                new Vector3(0.6f, 0.3f, 0.6f), new Color(0.8f, 0.6f, 0.4f), 0.8f, 1.5f);
        }

        private void CreateDecorativeItems(string name, Vector3 pos)
        {
            GameObject decor = CreateInteractiveBase(name, pos, PrimitiveType.Sphere,
                new Vector3(0.3f, 0.3f, 0.3f), new Color(0.9f, 0.5f, 0.3f), 0.5f, 1f);
        }

        private void CreateDustPile(string name, Vector3 pos)
        {
            GameObject dust = CreateInteractiveBase(name, pos, PrimitiveType.Sphere,
                new Vector3(0.5f, 0.1f, 0.5f), new Color(0.6f, 0.6f, 0.6f), 0.1f, 1f);
        }

        #endregion
    }
}
