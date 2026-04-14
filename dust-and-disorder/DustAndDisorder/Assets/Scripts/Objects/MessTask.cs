using UnityEngine;

namespace DustAndDisorder.Objects
{
    /// <summary>
    /// Represents a specific mess task (e.g., "Knock over lamp")
    /// </summary>
    public class MessTask : InteractiveObject
    {
        [Header("Task Info")]
        [SerializeField] private string taskName = "Mess Task";
        [SerializeField] private string taskDescription = "";
        [SerializeField] private MessTaskType taskType = MessTaskType.KnockOver;

        public string TaskName => taskName;
        public MessTaskType TaskType => taskType;

        public enum MessTaskType
        {
            KnockOver,      // Push to knock over
            Pull,           // Pull to open/spill
            Scatter,        // Vacuum to scatter
            WaterSpill      // Mop to create puddle
        }

        public override void OnPushed()
        {
            if (taskType == MessTaskType.KnockOver)
            {
                CompleteTask();
            }
            base.OnPushed();
        }

        public override void OnPulled()
        {
            if (taskType == MessTaskType.Pull)
            {
                CompleteTask();
            }
            base.OnPulled();
        }

        public override void OnVacuumed()
        {
            if (taskType == MessTaskType.Scatter)
            {
                CompleteTask();
            }
            base.OnVacuumed();
        }

        private void CompleteTask()
        {
            Debug.Log($"Completed mess task: {taskName}");
            // Could trigger achievement/notification here
        }
    }
}
