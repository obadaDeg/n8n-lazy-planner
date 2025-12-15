/**
 * LazyPlanner - n8n Code Node
 *
 * This code should be pasted into an n8n "Code" node.
 * It maps day names (Monday, Tuesday, etc.) to your Trello List IDs.
 *
 * IMPORTANT: Update the listMap object below with YOUR Trello List IDs!
 *
 * How to get List IDs:
 * 1. Open your Trello board
 * 2. Add .json to the URL (e.g., https://trello.com/b/ABC123/my-board.json)
 * 3. Find the "lists" array and copy the ID for each day
 */

// ============================================
// CONFIGURATION - UPDATE THIS WITH YOUR IDS!
// ============================================

const listMap = {
  // Replace these IDs with your actual Trello List IDs
  "Monday":    "YOUR_MONDAY_LIST_ID_HERE",
  "Tuesday":   "YOUR_TUESDAY_LIST_ID_HERE",
  "Wednesday": "YOUR_WEDNESDAY_LIST_ID_HERE",
  "Thursday":  "YOUR_THURSDAY_LIST_ID_HERE",
  "Friday":    "YOUR_FRIDAY_LIST_ID_HERE",
  "Saturday":  "YOUR_SATURDAY_LIST_ID_HERE",
  "Sunday":    "YOUR_SUNDAY_LIST_ID_HERE"
};

// Example with real IDs (yours will look different):
// const listMap = {
//   "Monday":    "64a1b2c3d4e5f6g7h8i9j0k1",
//   "Tuesday":   "74a1b2c3d4e5f6g7h8i9j0k2",
//   "Wednesday": "84a1b2c3d4e5f6g7h8i9j0k3",
//   "Thursday":  "94a1b2c3d4e5f6g7h8i9j0k4",
//   "Friday":    "a4a1b2c3d4e5f6g7h8i9j0k5",
//   "Saturday":  "b4a1b2c3d4e5f6g7h8i9j0k6",
//   "Sunday":    "c4a1b2c3d4e5f6g7h8i9j0k7"
// };

// ============================================
// PROCESSING LOGIC - DON'T MODIFY BELOW
// ============================================

// Get the incoming data from the webhook
const items = $input.all();

// This will hold our processed tasks
const processedTasks = [];

// Process each item from the webhook
for (const item of items) {
  // The webhook body contains the array of tasks
  const tasks = item.json.body || item.json;

  // Handle both single object and array inputs
  const taskArray = Array.isArray(tasks) ? tasks : [tasks];

  for (const task of taskArray) {
    // Validate required fields
    if (!task.task || !task.list || !task.desc) {
      console.error('Invalid task format:', task);
      continue; // Skip invalid tasks
    }

    // Get the Trello List ID from our mapping
    const listId = listMap[task.list];

    // If we don't have a mapping for this day, log an error
    if (!listId) {
      console.error(`No List ID mapping found for day: ${task.list}`);
      console.error('Available mappings:', Object.keys(listMap));
      continue; // Skip this task
    }

    // Check if the list ID has been configured
    if (listId.includes('YOUR_') && listId.includes('_LIST_ID_HERE')) {
      throw new Error(
        `List ID not configured for ${task.list}! ` +
        `Please update the listMap in the Code Node with your actual Trello List IDs. ` +
        `See the README for instructions on getting List IDs.`
      );
    }

    // Create the formatted object for Trello
    processedTasks.push({
      json: {
        listId: listId,           // The Trello List ID
        task: task.task,          // Card title
        desc: task.desc,          // Card description
        originalDay: task.list    // Keep the original day for reference
      }
    });
  }
}

// Validation: Check if we processed any tasks
if (processedTasks.length === 0) {
  throw new Error(
    'No valid tasks were processed. Possible issues:\n' +
    '1. The incoming JSON is empty or invalid\n' +
    '2. No List ID mappings match the "list" values in your tasks\n' +
    '3. Required fields (task, list, desc) are missing\n\n' +
    'Check the n8n execution log for details.'
  );
}

// Log summary for debugging
console.log(`Successfully processed ${processedTasks.length} tasks`);
console.log('Tasks by day:');
const dayCount = {};
processedTasks.forEach(item => {
  const day = item.json.originalDay;
  dayCount[day] = (dayCount[day] || 0) + 1;
});
console.log(dayCount);

// Return the processed tasks
// n8n will pass each item to the next node (Trello)
return processedTasks;
