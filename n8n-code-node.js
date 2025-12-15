/**
 * LazyPlanner v2.0 - n8n Code Node
 *
 * This code should be pasted into an n8n "Code" node.
 * It maps day names and categories to your Trello List IDs and Label IDs.
 *
 * IMPORTANT: Update BOTH configuration objects below with YOUR Trello IDs!
 *
 * How to get IDs:
 * 1. Open your Trello board
 * 2. Add .json to the URL (e.g., https://trello.com/b/ABC123/my-board.json)
 * 3. Find the "lists" array and copy IDs for Backlog, days, and Done
 * 4. Find the "labels" array and copy IDs for Work (blue), Study (green), Urgent (red)
 */

// ============================================
// CONFIGURATION - UPDATE THIS WITH YOUR IDS!
// ============================================

const listMap = {
  // Replace these IDs with your actual Trello List IDs
  "Backlog":   "YOUR_BACKLOG_LIST_ID_HERE",
  "Monday":    "YOUR_MONDAY_LIST_ID_HERE",
  "Tuesday":   "YOUR_TUESDAY_LIST_ID_HERE",
  "Wednesday": "YOUR_WEDNESDAY_LIST_ID_HERE",
  "Thursday":  "YOUR_THURSDAY_LIST_ID_HERE",
  "Friday":    "YOUR_FRIDAY_LIST_ID_HERE",
  "Saturday":  "YOUR_SATURDAY_LIST_ID_HERE",
  "Sunday":    "YOUR_SUNDAY_LIST_ID_HERE",
  "Done":      "YOUR_DONE_LIST_ID_HERE"
};

// Map categories to Trello Label IDs
// Get these by adding .json to your board URL and finding the "labels" array
const labelMap = {
  "Work":   "YOUR_BLUE_LABEL_ID_HERE",    // Blue label for work tasks
  "Study":  "YOUR_GREEN_LABEL_ID_HERE",   // Green label for study tasks
  "Urgent": "YOUR_RED_LABEL_ID_HERE"      // Red label for urgent tasks
};

// Example with real IDs (yours will look different):
// const listMap = {
//   "Backlog":   "54a1b2c3d4e5f6g7h8i9j0k0",
//   "Monday":    "64a1b2c3d4e5f6g7h8i9j0k1",
//   "Tuesday":   "74a1b2c3d4e5f6g7h8i9j0k2",
//   "Wednesday": "84a1b2c3d4e5f6g7h8i9j0k3",
//   "Thursday":  "94a1b2c3d4e5f6g7h8i9j0k4",
//   "Friday":    "a4a1b2c3d4e5f6g7h8i9j0k5",
//   "Saturday":  "b4a1b2c3d4e5f6g7h8i9j0k6",
//   "Sunday":    "c4a1b2c3d4e5f6g7h8i9j0k7",
//   "Done":      "d4a1b2c3d4e5f6g7h8i9j0k8"
// };
//
// const labelMap = {
//   "Work":   "e4a1b2c3d4e5f6g7h8i9j0k9",
//   "Study":  "f4a1b2c3d4e5f6g7h8i9j0ka",
//   "Urgent": "g4a1b2c3d4e5f6g7h8i9j0kb"
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
    if (!task.task || !task.list || !task.desc || !task.category) {
      console.error('Invalid task format (missing required fields):', task);
      continue; // Skip invalid tasks
    }

    // Get the Trello List ID from our mapping
    const listId = listMap[task.list];

    // If we don't have a mapping for this list, throw error
    if (!listId) {
      throw new Error(
        `No List ID mapping found for list: "${task.list}". ` +
        `This task should have been caught by validation. ` +
        `Available lists: ${Object.keys(listMap).join(', ')}`
      );
    }

    // Check if the list ID has been configured
    if (listId.includes('YOUR_') && listId.includes('_LIST_ID_HERE')) {
      throw new Error(
        `List ID not configured for ${task.list}! ` +
        `Please update the listMap in the Code Node with your actual Trello List IDs. ` +
        `See the README for instructions on getting List IDs.`
      );
    }

    // Get the Trello Label ID from our mapping
    const labelId = labelMap[task.category];

    // Validate label mapping exists - STRICT FAILURE (consistent with validation philosophy)
    if (!labelId) {
      throw new Error(
        `No Label ID mapping found for category: "${task.category}". ` +
        `This task should have been caught by validation. ` +
        `Valid categories: ${Object.keys(labelMap).join(', ')}`
      );
    }

    // Check if the label ID has been configured
    if (labelId.includes('YOUR_') && labelId.includes('_LABEL_ID_HERE')) {
      throw new Error(
        `Label ID not configured for ${task.category}! ` +
        `Please update the labelMap in the Code Node with your actual Trello Label IDs. ` +
        `See the README for instructions on getting Label IDs.`
      );
    }

    // Create the formatted object for Trello
    processedTasks.push({
      json: {
        listId: listId,              // The Trello List ID
        task: task.task,             // Card title
        desc: task.desc,             // Card description
        idLabels: [labelId],         // Array of Trello Label IDs
        originalDay: task.list,      // Keep the original day for reference
        category: task.category      // Keep category for logging
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
    '3. Required fields (task, list, desc, category) are missing\n\n' +
    'Check the n8n execution log for details.'
  );
}

// Log summary for debugging
console.log(`Successfully processed ${processedTasks.length} tasks`);

console.log('\nTasks by list:');
const dayCount = {};
processedTasks.forEach(item => {
  const day = item.json.originalDay;
  dayCount[day] = (dayCount[day] || 0) + 1;
});
console.log(dayCount);

console.log('\nTasks by category:');
const categoryCount = {};
processedTasks.forEach(item => {
  const cat = item.json.category;
  categoryCount[cat] = (categoryCount[cat] || 0) + 1;
});
console.log(categoryCount);

// Return the processed tasks
// n8n will pass each item to the next node (Trello)
return processedTasks;
