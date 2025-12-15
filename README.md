# 🦥 LazyPlanner v2.0

> **Automate your laziness.** Let AI plan your work and study tasks, then watch them magically appear in Trello with color-coded labels—no effort required.

LazyPlanner is a zero-budget automation bridge that takes your AI-generated work/study plans (ChatGPT, Claude, Gemini) and automatically creates categorized Trello cards using a local n8n instance. No APIs to pay for, no cloud webhooks, just pure automation bliss.

**New in v2.0:**
- 🔵 **Work** / 🟢 **Study** / 🔴 **Urgent** category labels
- 📋 **Backlog** and **Done** lists support
- Professional focus (work and study tasks only)

## 🎯 The Problem

You chat with AI to plan your week. It gives you a beautiful breakdown. Then you manually create 20+ Trello cards. One. By. One.

**Not anymore.**

## ✨ The Solution

1. Chat with your favorite AI about your week
2. Copy the JSON output
3. Paste it into a simple HTML interface
4. Click "Send to n8n"
5. Watch your Trello board populate automatically

## 🏗️ Architecture

```
You → GenAI → Copy JSON → HTML Interface → n8n Webhook → Trello
```

**Local. Free. Fast.**

## 📋 Prerequisites

- **[n8n](https://n8n.io/)** - Running locally (default: `http://localhost:5678`)
- **[Trello Account](https://trello.com/)** - Free tier is perfect
- **Modern Browser** - Chrome, Firefox, Edge, etc.
- **Enthusiasm for automation** - Essential

## 🚀 Quick Start

### Step 1: Get Your Trello Credentials

1. **Get your Trello API Key & Token:**
   - Visit: https://trello.com/power-ups/admin
   - Click "New" to create a Power-Up (or use existing)
   - Note your **API Key**
   - Generate a **Token** with read/write permissions

2. **Find your Board ID:**
   - Open your Trello board
   - Add `.json` to the end of the URL
   - Example: `https://trello.com/b/ABC123/my-board.json`
   - Look for `"id"` in the JSON (near the top)

3. **Get your List IDs:**
   - In the same JSON, scroll to find the `"lists"` array
   - Each list has an `"id"` and `"name"`
   - Copy the IDs for Backlog, all day lists, and Done (9 lists total)

   ```json
   "lists": [
     {
       "id": "54a1b2c3d4e5f6g7h8i9j0k0",
       "name": "Backlog"
     },
     {
       "id": "64a1b2c3d4e5f6g7h8i9j0k1",
       "name": "Monday"
     },
     {
       "id": "74a1b2c3d4e5f6g7h8i9j0k2",
       "name": "Tuesday"
     }
   ]
   ```

4. **Get your Label IDs (for categories):**
   - In the same board JSON, find the `"labels"` array near the top
   - Create or find these three labels:
     - Blue label (for Work)
     - Green label (for Study)
     - Red label (for Urgent)
   - Copy their IDs

   ```json
   "labels": [
     {
       "id": "64a1b2c3d4e5f6g7h8i9j0k9",
       "name": "Work",
       "color": "blue"
     },
     {
       "id": "74a1b2c3d4e5f6g7h8i9j0k8",
       "name": "Study",
       "color": "green"
     },
     {
       "id": "84a1b2c3d4e5f6g7h8i9j0k7",
       "name": "Urgent",
       "color": "red"
     }
   ]
   ```

### Step 2: Set Up n8n Workflow

1. **Start n8n locally:**
   ```bash
   npx n8n
   ```

2. **Create a new workflow** with these nodes:

   **Node 1: Webhook (Trigger)**
   - Webhook Name: `weekly-plan`
   - HTTP Method: `POST`
   - Path: `weekly-plan`
   - Response Mode: `Immediately`
   - **CRITICAL:** Set CORS settings:
     - Option A: In webhook node settings → Allowed Origins: `*`
     - Option B: Set environment variable: `N8N_CORS_ORIGIN=*`
     - Without this, your browser will block the request!

   **Node 2: Code Node**
   - Copy the code from [`n8n-code-node.js`](n8n-code-node.js)
   - **IMPORTANT:** Update BOTH configuration objects:
     - `listMap`: Add your Trello List IDs (including Backlog and Done)
     - `labelMap`: Add your Trello Label IDs (Work=Blue, Study=Green, Urgent=Red)

   **Node 3: Trello Node**
   - Operation: `Create a Card`
   - Use expressions to map from Code Node output:
     - List ID: `{{ $json.listId }}`
     - Name: `{{ $json.task }}`
     - Description: `{{ $json.desc }}`
     - Labels: `{{ $json.idLabels }}`

   **IMPORTANT:** Type the Labels expression exactly as shown. No extra whitespace or characters, or you'll get "Invalid objectId" errors.

3. **Activate your workflow** (toggle switch in top-right)

4. **Test the webhook URL:**
   - The webhook URL will be: `http://localhost:5678/webhook/weekly-plan`
   - Make sure n8n is running when you use LazyPlanner

### Step 3: Generate Your Weekly Plan

1. Open [`prompt.md`](prompt.md)
2. Copy the "Golden Prompt"
3. Paste it into ChatGPT, Claude, or Gemini
4. Describe your week, goals, and tasks
5. The AI will output a JSON array—copy it!

### Step 4: Send to Trello

1. Open [`interface.html`](interface.html) in your browser
2. Paste the JSON into the text area
3. Click "Send to n8n"
4. Check your Trello board—your cards are there!

## 🔧 Configuration

### Customizing Day Names

If your Trello lists have different names (e.g., "Mon" instead of "Monday"):

1. Edit the `listMap` in [`n8n-code-node.js`](n8n-code-node.js)
2. Update the AI prompt in [`prompt.md`](prompt.md) to use your naming convention

### Using a Different Webhook Port

If your n8n runs on a different port:

1. Edit `interface.html`
2. Change the `WEBHOOK_URL` constant (around line 50)

## 🐛 Troubleshooting

### "Failed to fetch" Error

**Problem:** CORS is blocking the request.

**Solution:**
- Make sure n8n has CORS enabled (see Step 2 above)
- If using environment variable, restart n8n after setting it
- Try opening `interface.html` via `file://` protocol

### "Invalid JSON" Error

**Problem:** The AI output isn't valid JSON.

**Solution:**
- Make sure you copied ONLY the JSON array, not any explanatory text
- The JSON should start with `[` and end with `]`
- Use a JSON validator if needed

### Cards Going to Wrong Lists

**Problem:** List IDs are incorrect or day names don't match.

**Solution:**
- Double-check your Trello List IDs (use the `.json` trick)
- Make sure the `listMap` keys match the `"list"` values in your JSON
- Day names are case-sensitive!

### n8n Webhook Not Triggering

**Problem:** The workflow isn't activating.

**Solution:**
- Make sure the workflow is activated (toggle in top-right)
- Check n8n is running (`http://localhost:5678` should load)
- Verify the webhook path matches (`/webhook/weekly-plan`)

## 🎨 Customization Ideas

- Set due dates based on the day of week
- Add members to cards automatically
- Create checklists from task descriptions
- Send a Slack/Discord notification when complete
- Add a "delete all cards" button for quick resets
- Combine multiple labels (e.g., Work + Urgent)

## 📋 Trello Board Setup Guide

Before using LazyPlanner v2.0, set up your Trello board in this exact order:

### Step 1: Create Lists (left to right)
1. Backlog
2. Monday
3. Tuesday
4. Wednesday
5. Thursday
6. Friday
7. Saturday
8. Sunday
9. Done

### Step 2: Create Labels
Create exactly three labels with these settings:

| Label Name | Color | Purpose |
|------------|-------|---------|
| Work | Blue | Professional tasks, meetings, deliverables |
| Study | Green | Learning, courses, certifications, reading |
| Urgent | Red | Time-sensitive tasks requiring immediate attention |

**How to create labels:**
- Click on a card → Labels → Create new label
- Set the exact name and color as shown above

### Step 3: Get IDs (using the .json trick)
1. Open your Trello board
2. Add `.json` to the end of the URL (e.g., `https://trello.com/b/ABC123/my-board.json`)
3. Copy the following IDs:
   - **Board ID:** Near the top of the JSON
   - **All List IDs:** In the `"lists"` array (9 IDs total)
   - **All Label IDs:** In the `"labels"` array (3 IDs for Work, Study, Urgent)

### Step 4: Configure n8n
- Paste List IDs into `listMap` in the Code Node
- Paste Label IDs into `labelMap` in the Code Node
- Match colors: Work=Blue, Study=Green, Urgent=Red

**Visual Overview:**

For the best experience with work/study tracking:

**Labels:**
- 🔵 **Blue (Work)** - Professional tasks, meetings, deliverables
- 🟢 **Green (Study)** - Learning, courses, reading, practice
- 🔴 **Red (Urgent)** - High-priority or time-sensitive tasks

## 📝 Example Workflow

**You to AI:**
> "Help me plan my work week. I need to finish the Q4 report, review 3 PRs, and study for my AWS certification exam on Friday."

**AI generates:**
```json
[
  {"task": "Q4 Report - Draft sections 1-3", "list": "Monday", "category": "Work", "desc": "Focus on revenue analysis and market trends"},
  {"task": "AWS - Study EC2 basics", "list": "Monday", "category": "Study", "desc": "Watch tutorials on instance types and pricing models"},
  {"task": "Q4 Report - Complete financial charts", "list": "Tuesday", "category": "Work", "desc": "Use latest data from accounting"},
  {"task": "Review PR #234 - Auth refactor", "list": "Tuesday", "category": "Work", "desc": "Check security implications"},
  {"task": "AWS - S3 practice labs", "list": "Tuesday", "category": "Study", "desc": "Complete hands-on exercises for S3 storage"},
  {"task": "Review PR #235 - UI updates", "list": "Wednesday", "category": "Work", "desc": "Test responsive design"},
  {"task": "Review PR #236 - API optimization", "list": "Wednesday", "category": "Work", "desc": "Benchmark performance improvements"},
  {"task": "AWS - Practice exam 1", "list": "Thursday", "category": "Study", "desc": "Take full-length practice test and review weak areas"},
  {"task": "Friday Demo - Prepare slides", "list": "Thursday", "category": "Work", "desc": "Include live demo of new feature"},
  {"task": "Final review before exam", "list": "Friday", "category": "Urgent", "desc": "Quick review of key concepts before certification exam"}
]
```

**You:** Copy, paste, click. Done.

**Your Trello board:** Perfectly organized for the week.

## 🤝 Contributing

This is an open-source passion project! Fork it, adapt it, make it yours.

**Ideas for contributions:**
- Support for other project management tools (Notion, Asana, ClickUp)
- Browser extension for one-click sending
- Templates for different planning styles
- Multi-board support
- Drag-and-drop interface improvements

## 📄 License

MIT License - See [LICENSE](LICENSE)

## 🙏 Acknowledgments

Built with:
- [n8n](https://n8n.io/) - The workflow automation platform
- [Trello](https://trello.com/) - The kanban board that started it all
- **Your laziness** - The greatest motivator for automation

---

**Made with 🦥 by lazy developers, for lazy developers.**

*Remember: The best code is the code you don't have to write manually.*
