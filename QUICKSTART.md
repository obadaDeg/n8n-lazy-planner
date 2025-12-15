# ⚡ LazyPlanner Quick Start Guide

Get LazyPlanner running in **5 minutes** or less!

## 🎯 What You Need

- [ ] Trello account (free)
- [ ] Node.js installed (for n8n)
- [ ] 5 minutes of your time

## 🚀 Step-by-Step Setup

### 1️⃣ Get Trello Ready (2 minutes)

**Create your board structure:**

1. Go to [Trello](https://trello.com) and create a new board called "Weekly Planner"

2. Create these 9 lists (in this exact order):
   - Backlog
   - Monday
   - Tuesday
   - Wednesday
   - Thursday
   - Friday
   - Saturday
   - Sunday
   - Done

3. Create 3 labels:
   - **Work** (Blue color)
   - **Study** (Green color)
   - **Urgent** (Red color)

4. Get your IDs:
   - Add `.json` to your board URL: `https://trello.com/b/YOUR-BOARD/weekly-planner.json`
   - Copy the **Board ID** (near the top)
   - Copy **9 List IDs** from the "lists" array
   - Copy **3 Label IDs** from the "labels" array

**Pro tip:** Keep a text file open and paste your IDs there. You'll need them in the next step!

---

### 2️⃣ Set Up n8n (2 minutes)

**Start n8n:**
```bash
npx n8n
```

**Import the workflow:**

1. Open http://localhost:5678
2. Click **Workflows** → **Import from File**
3. Select `lazyplanner-workflow.json` from this folder
4. The workflow opens automatically!

**Configure the workflow:**

1. **Trello Credentials** (do this first):
   - Click the "Create Trello Card" node
   - Click "Create New Credential"
   - Get your API Key: https://trello.com/power-ups/admin
   - Generate a Token (read/write permissions)
   - Paste both into n8n
   - Click "Save"

2. **Update the Code Node:**
   - Click the "Map to Trello Format" node
   - Find `listMap` (around line 20)
   - Replace all `YOUR_..._LIST_ID_HERE` with your actual List IDs
   - Find `labelMap` (around line 35)
   - Replace all `YOUR_..._LABEL_ID_HERE` with your actual Label IDs
   - Click "Save"

3. **Update the Trello Node:**
   - Click the "Create Trello Card" node
   - Change "Board ID" from `YOUR_BOARD_ID_HERE` to your actual Board ID
   - Click "Save"

4. **Activate the workflow:**
   - Click the toggle switch in the top-right (should turn green)
   - You'll see "Webhook waiting for requests"

---

### 3️⃣ Test It! (1 minute)

**Open the interface:**

1. Double-click `interface.html` in this folder
2. It opens in your browser

**Test with example data:**

1. Click "Load example JSON"
2. Click "Send to n8n 🚀"
3. Check your Trello board!

You should see:
- Cards in Monday, Tuesday, etc.
- Blue labels on Work tasks
- Green labels on Study tasks
- Red labels on Urgent tasks

**Success?** You're done! 🎉

**Not working?** Jump to [Troubleshooting](#-troubleshooting) below.

---

## 🎨 Daily Usage

### Generate Your Weekly Plan

1. **Copy the prompt** from `prompt.md`
2. **Paste into ChatGPT/Claude/Gemini**
3. **Describe your week:**
   ```
   I need to finish the Q4 report, study for AWS exam,
   and fix a production bug. I have meetings Monday
   and Wednesday.
   ```
4. **Copy the JSON output** (just the array, no extra text)
5. **Open `interface.html`**
6. **Paste and click "Send to n8n"**
7. **Check your Trello board** - all cards are there!

### Example Conversation

**You:**
> Help me plan my work week. I need to deploy a feature by Friday and study for a certification exam.

**AI returns:**
```json
[
  {"task": "Complete feature testing", "list": "Monday", "category": "Work", "desc": "..."},
  {"task": "Study AWS EC2", "list": "Monday", "category": "Study", "desc": "..."},
  {"task": "Deploy to production", "list": "Friday", "category": "Urgent", "desc": "..."}
]
```

**You:** Copy → Paste → Click → Done! ✨

---

## 🛠️ Troubleshooting

### "Failed to fetch" error

**Problem:** Browser can't reach n8n

**Fix:**
1. Make sure n8n is running (`npx n8n`)
2. Check the URL in browser: http://localhost:5678 should load
3. In n8n, check workflow is **activated** (green toggle)

### "Invalid JSON" error

**Problem:** The AI output isn't valid JSON

**Fix:**
1. Copy **only** the JSON array (starting with `[` and ending with `]`)
2. Don't include any explanatory text from the AI
3. Use a JSON validator if unsure: https://jsonlint.com

### Cards not appearing in Trello

**Problem:** n8n is working but no cards show up

**Fix:**
1. Check n8n execution log (click on workflow execution)
2. Look for error messages about List IDs or Label IDs
3. Verify your IDs are correct (common mistake: mixing them up)
4. Make sure Trello credentials are valid (test by opening Trello)

### "List ID not configured" error

**Problem:** You didn't update the placeholder IDs in the Code Node

**Fix:**
1. Click the "Map to Trello Format" node in n8n
2. Replace **all** `YOUR_..._LIST_ID_HERE` with real IDs
3. Replace **all** `YOUR_..._LABEL_ID_HERE` with real IDs
4. Don't forget the Board ID in the Trello node!
5. Click "Save" and re-run

### Wrong labels on cards

**Problem:** Work tasks getting Study labels, etc.

**Fix:**
1. Check your `labelMap` in the Code Node
2. Make sure:
   - "Work" → Blue label ID
   - "Study" → Green label ID
   - "Urgent" → Red label ID
3. In Trello board JSON, verify label colors match

---

## 📁 File Reference

### Core Files (You'll Use These)

| File | Purpose | When to Use |
|------|---------|-------------|
| `interface.html` | The tool you use daily | Every time you want to add tasks |
| `prompt.md` | Template for AI | Copy this into ChatGPT/Claude |
| `lazyplanner-workflow.json` | n8n workflow | Import once during setup |

### Documentation (Read When Needed)

| File | Purpose |
|------|---------|
| `README.md` | Complete setup guide and documentation |
| `WORKFLOW.md` | Technical details of how it works |
| `QUICKSTART.md` | This file - fast setup guide |

### Reference Files (Don't Edit These)

| File | Purpose |
|------|---------|
| `n8n-code-node.js` | Code reference (already in workflow) |
| `.gitignore` | Git configuration |
| `LICENSE` | MIT License |

---

## 🎓 Next Steps

Now that you're set up:

1. **Start using it daily:**
   - Sunday evening: Plan your week with AI
   - Send to Trello
   - Start Monday with organized tasks

2. **Customize it:**
   - Add more lists (e.g., "Next Week", "Maybe Later")
   - Create additional labels (e.g., "High Priority", "Quick Win")
   - Modify the AI prompt to match your planning style

3. **Share it:**
   - This is open source!
   - Fork it on GitHub
   - Adapt it for your team
   - Create your own version

---

## 💡 Pro Tips

### Tip 1: Weekly Planning Ritual
Set aside 15 minutes every Sunday evening to plan your week with LazyPlanner. You'll start Monday stress-free!

### Tip 2: Use Backlog Wisely
Tasks without a specific day? Put them in Backlog:
```json
{"task": "Learn Docker", "list": "Backlog", "category": "Study", "desc": "..."}
```

### Tip 3: Combine with Time Blocking
After creating cards, drag them to specific time slots using Trello's Calendar Power-Up (free).

### Tip 4: Archive Completed Tasks
At the end of each week, move everything from "Done" to Trello's archive. Fresh start!

### Tip 5: Mobile Workflow
- Plan on desktop with AI
- Execute on mobile with Trello app
- Trello labels make it easy to filter Work vs Study on the go

---

## ❓ Getting Help

**Something not working?**

1. Check [Troubleshooting](#-troubleshooting) above
2. Read the full [README.md](README.md)
3. Check the [Workflow Architecture](WORKFLOW.md) for technical details
4. Open an issue on GitHub (if this is from GitHub)

**Want to customize?**

- See the "Customization Ideas" section in [README.md](README.md)
- The workflow is just JavaScript - edit it however you want!
- Add fields, change logic, integrate other tools

---

## 🎉 You're All Set!

You now have:
- ✅ A Trello board ready for weekly planning
- ✅ An n8n workflow processing your tasks
- ✅ A simple HTML interface to use daily
- ✅ An AI prompt that generates perfect JSON

**Time to automate your laziness!** 🦥

---

**Made with 🦥 by lazy developers, for lazy developers.**

*Remember: The best productivity system is the one you actually use. LazyPlanner makes it so easy, you have no excuse!*
