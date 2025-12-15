# 🔄 LazyPlanner Workflow Architecture

This document explains how the n8n workflow processes your weekly plans.

## 📊 Workflow Diagram

```
┌─────────────────────┐
│   HTML Interface    │
│   (Your Browser)    │
└──────────┬──────────┘
           │ POST JSON
           │ [{"task": "...", "list": "Monday", "category": "Work", "desc": "..."}]
           ▼
┌─────────────────────┐
│  Node 1: Webhook    │
│  /webhook/weekly-   │  ← Receives POST request from browser
│       plan          │  ← CORS enabled to allow local file access
└──────────┬──────────┘
           │ Raw JSON Array
           │
           ▼
┌─────────────────────┐
│ Node 2: Code Node   │
│  "Map to Trello     │  ← Maps days → List IDs
│      Format"        │  ← Maps categories → Label IDs
│                     │  ← Validates all required fields
└──────────┬──────────┘
           │ Transformed JSON
           │ [{"listId": "abc123", "task": "...", "idLabels": ["xyz789"], ...}]
           │
           ▼
┌─────────────────────┐
│ Node 3: Trello API  │
│  "Create Trello     │  ← Creates card in specified list
│      Card"          │  ← Applies colored label
│                     │  ← Sets title and description
└──────────┬──────────┘
           │ Card Created Response
           │
           ▼
┌─────────────────────┐
│ Node 4: Response    │
│  "Webhook Response" │  ← Sends success message back to browser
│                     │  ← Shows how many cards were created
└─────────────────────┘
           │
           ▼
    Success message displayed
    in HTML interface
```

## 🔍 Detailed Node Breakdown

### Node 1: Webhook Trigger
**Type:** `n8n-nodes-base.webhook`

**Purpose:** Receives the JSON array from the HTML interface

**Configuration:**
- **Path:** `weekly-plan`
- **Method:** POST
- **CORS:** Allowed Origins = `*` (critical for local file access)
- **Response Mode:** Respond to Webhook (async response)

**Input Example:**
```json
[
  {
    "task": "Complete project proposal",
    "list": "Monday",
    "category": "Work",
    "desc": "Draft initial version focusing on timeline"
  },
  {
    "task": "AWS certification study",
    "list": "Tuesday",
    "category": "Study",
    "desc": "Review EC2 and S3 concepts"
  }
]
```

**Output:** Passes raw JSON to next node

---

### Node 2: Code Node (JavaScript)
**Type:** `n8n-nodes-base.code`

**Purpose:** Transform the input JSON to match Trello's API requirements

**Processing Steps:**
1. **Load Configuration:**
   - `listMap`: Maps day names to Trello List IDs
   - `labelMap`: Maps categories to Trello Label IDs

2. **Validate Each Task:**
   - Check for required fields: `task`, `list`, `desc`, `category`
   - Verify `list` exists in `listMap`
   - Verify `category` exists in `labelMap`
   - Throw error if any validation fails

3. **Transform Data:**
   - Look up `listId` from `listMap[task.list]`
   - Look up `labelId` from `labelMap[task.category]`
   - Create output object with Trello-compatible format

4. **Logging:**
   - Count tasks by list (Monday, Tuesday, etc.)
   - Count tasks by category (Work, Study, Urgent)
   - Log summary to n8n console

**Input:**
```json
{
  "task": "Complete project proposal",
  "list": "Monday",
  "category": "Work",
  "desc": "Draft initial version"
}
```

**Output:**
```json
{
  "listId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "task": "Complete project proposal",
  "desc": "Draft initial version",
  "idLabels": ["e4a1b2c3d4e5f6g7h8i9j0k9"],
  "originalDay": "Monday",
  "category": "Work"
}
```

---

### Node 3: Trello Card Creation
**Type:** `n8n-nodes-base.trello`

**Purpose:** Create cards in Trello using the transformed data

**Configuration:**
- **Operation:** Create a Card
- **Board ID:** Your Trello Board ID
- **List ID:** `{{ $json.listId }}` (from Code Node)
- **Card Name:** `{{ $json.task }}` (from Code Node)
- **Description:** `{{ $json.desc }}` (from Code Node)
- **Labels:** `{{ $json.idLabels }}` (from Code Node)

**API Call:**
```
POST https://api.trello.com/1/cards
{
  "idList": "64a1b2c3d4e5f6g7h8i9j0k1",
  "name": "Complete project proposal",
  "desc": "Draft initial version",
  "idLabels": ["e4a1b2c3d4e5f6g7h8i9j0k9"]
}
```

**Output:** Trello card object with card ID, URL, etc.

---

### Node 4: Webhook Response
**Type:** `n8n-nodes-base.respondToWebhook`

**Purpose:** Send success message back to the HTML interface

**Response Format:**
```json
{
  "success": true,
  "message": "Successfully created 2 Trello cards!",
  "cards": ["card-id-1", "card-id-2"]
}
```

This is displayed in the HTML interface as a success notification.

---

## 🎯 Data Flow Example

### Example Input (3 Tasks)

```json
[
  {"task": "Write report", "list": "Monday", "category": "Work", "desc": "Q4 analysis"},
  {"task": "Study AWS", "list": "Monday", "category": "Study", "desc": "EC2 concepts"},
  {"task": "Fix bug", "list": "Tuesday", "category": "Urgent", "desc": "Auth issue"}
]
```

### After Code Node Transformation

```json
[
  {
    "listId": "64a1...k1",        // Monday list
    "task": "Write report",
    "desc": "Q4 analysis",
    "idLabels": ["e4a1...k9"],    // Blue (Work) label
    "originalDay": "Monday",
    "category": "Work"
  },
  {
    "listId": "64a1...k1",        // Monday list
    "task": "Study AWS",
    "desc": "EC2 concepts",
    "idLabels": ["f4a1...ka"],    // Green (Study) label
    "originalDay": "Monday",
    "category": "Study"
  },
  {
    "listId": "74a1...k2",        // Tuesday list
    "task": "Fix bug",
    "desc": "Auth issue",
    "idLabels": ["g4a1...kb"],    // Red (Urgent) label
    "originalDay": "Tuesday",
    "category": "Urgent"
  }
]
```

### Result in Trello

**Monday List:**
- 🔵 "Write report" (Blue label - Work)
- 🟢 "Study AWS" (Green label - Study)

**Tuesday List:**
- 🔴 "Fix bug" (Red label - Urgent)

---

## 🔧 Configuration Checklist

Before activating the workflow, ensure:

- [ ] **Webhook node:** CORS is set to allow `*`
- [ ] **Code node:** `listMap` has all 9 list IDs (Backlog + 7 days + Done)
- [ ] **Code node:** `labelMap` has all 3 label IDs (Work, Study, Urgent)
- [ ] **Trello node:** Board ID is configured
- [ ] **Trello node:** Trello credentials are set up
- [ ] **Workflow:** Is activated (toggle switch on)

---

## 📝 Error Handling

### Common Errors and Solutions

**Error:** "List ID not configured for Monday!"
- **Cause:** Placeholder IDs still in `listMap`
- **Fix:** Update `listMap` with real Trello List IDs

**Error:** "Label ID not configured for Work!"
- **Cause:** Placeholder IDs still in `labelMap`
- **Fix:** Update `labelMap` with real Trello Label IDs

**Error:** "No List ID mapping found for list: 'Monday'"
- **Cause:** Day name in JSON doesn't match `listMap` keys
- **Fix:** Ensure exact spelling (case-sensitive)

**Error:** Invalid objectId (from Trello API)
- **Cause:** Extra whitespace in expression fields
- **Fix:** Re-type the expression exactly as documented

---

## 🚀 Testing the Workflow

1. **Test with one task:**
   ```json
   [{"task": "Test", "list": "Monday", "category": "Work", "desc": "Testing"}]
   ```

2. **Check n8n execution log:**
   - Should show "Successfully processed 1 tasks"
   - Should show task distribution by list and category

3. **Verify in Trello:**
   - Card appears in Monday list
   - Has blue "Work" label
   - Title is "Test"
   - Description is "Testing"

4. **Test with multiple tasks:**
   - Different days
   - Different categories
   - Backlog and Done lists

---

## 💡 Advanced Customization

### Add Due Dates

In the Code Node output, add:
```javascript
dueDate: calculateDueDate(task.list)  // Your custom function
```

In the Trello Node, add to Additional Fields:
```
Due Date: {{ $json.dueDate }}
```

### Add Members

In the Trello Node, add to Additional Fields:
```
Members: {{ ["member-id-1", "member-id-2"] }}
```

### Add Checklists

Use a separate "Trello" node after card creation:
- Operation: "Create a Checklist"
- Card ID: `{{ $json.id }}` (from previous Trello node)

---

**Need help?** Check the [README](README.md) for troubleshooting tips!
