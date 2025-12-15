# 🎯 The Golden Prompt

Copy and paste this prompt into ChatGPT, Claude, Gemini, or any AI assistant to generate your weekly plan in the correct format.

---

## The Prompt

```
I need you to help me plan my work week. Please listen to my goals, tasks, and constraints, then output a structured weekly plan.

CRITICAL: Your final output MUST be a valid JSON array following this exact format:

[
  {
    "task": "Clear, actionable task name",
    "list": "DayOfWeek",
    "desc": "Detailed description with context, dependencies, or notes"
  }
]

RULES FOR THE JSON OUTPUT:
1. The "list" field MUST be one of these exact day names: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
2. Use standard day capitalization (first letter uppercase)
3. Each task should be specific and actionable
4. Descriptions should provide context, not just repeat the task name
5. Output ONLY the JSON array - no explanatory text before or after
6. Ensure the JSON is valid (proper quotes, commas, brackets)

Now, here's what I need to accomplish this week:

[DESCRIBE YOUR WEEK HERE - your goals, meetings, deadlines, projects, etc.]

Please analyze my needs and create a day-by-day breakdown. Consider:
- Task dependencies (what needs to happen first)
- Cognitive load (don't overload any single day)
- Energy levels (harder tasks earlier in the week)
- Buffer time for unexpected issues
- Realistic time estimates

After your analysis, output the JSON array.
```

---

## 📝 Example Usage

### Input to AI:

```
I need you to help me plan my work week. Please listen to my goals, tasks, and constraints, then output a structured weekly plan.

[... paste the full prompt above ...]

Now, here's what I need to accomplish this week:

I'm launching a new feature on Friday. I need to:
- Finish the API endpoints (currently 70% done)
- Write unit tests for the new code
- Update the documentation
- Get design approval on the UI mockups
- Do a security review
- Deploy to staging and test
- Prepare a demo for stakeholders

I also have regular commitments:
- Monday morning standup
- Wednesday 1:1 with my manager
- Thursday code review session

I want to keep Friday afternoon light so I can handle any last-minute issues before the launch.
```

### Expected AI Output:

```json
[
  {
    "task": "Complete API endpoints",
    "list": "Monday",
    "desc": "Finish the remaining 30% of API development. Focus on the user profile and settings endpoints. Test locally before committing."
  },
  {
    "task": "Write unit tests for new API endpoints",
    "list": "Monday",
    "desc": "Aim for 80%+ coverage. Focus on edge cases and error handling. Use existing test patterns."
  },
  {
    "task": "Submit UI mockups for design review",
    "list": "Monday",
    "desc": "Share Figma links with design team. Highlight the new onboarding flow and settings panel. Request feedback by EOD Tuesday."
  },
  {
    "task": "Security review - API authentication",
    "list": "Tuesday",
    "desc": "Review OAuth implementation, rate limiting, and input validation. Check OWASP top 10 compliance."
  },
  {
    "task": "Security review - Data validation",
    "list": "Tuesday",
    "desc": "Audit all user inputs for XSS, SQL injection, and CSRF vulnerabilities. Test with malicious payloads."
  },
  {
    "task": "Incorporate design feedback on UI",
    "list": "Wednesday",
    "desc": "Update mockups based on Tuesday's design review. Get final approval before implementation."
  },
  {
    "task": "Deploy to staging environment",
    "list": "Wednesday",
    "desc": "Deploy latest code to staging. Run smoke tests. Share staging URL with QA team."
  },
  {
    "task": "Update API documentation",
    "list": "Thursday",
    "desc": "Document all new endpoints in Swagger. Include request/response examples and authentication requirements."
  },
  {
    "task": "End-to-end testing on staging",
    "list": "Thursday",
    "desc": "Test complete user flows. Verify integration with existing features. Check mobile responsiveness."
  },
  {
    "task": "Prepare stakeholder demo",
    "list": "Thursday",
    "desc": "Create demo script and slides. Prepare talking points for business value. Anticipate questions about timeline and scalability."
  },
  {
    "task": "Final checks and monitoring setup",
    "list": "Friday",
    "desc": "Verify production deploy checklist. Set up error monitoring and alerts. Have rollback plan ready."
  },
  {
    "task": "Launch new feature",
    "list": "Friday",
    "desc": "Deploy to production during low-traffic window. Monitor logs and metrics. Be available for immediate fixes."
  },
  {
    "task": "Buffer time - Launch support",
    "list": "Friday",
    "desc": "Keep afternoon clear for addressing any launch issues, user feedback, or unexpected bugs."
  }
]
```

---

## 💡 Tips for Better Results

### Be Specific About Your Context

**Instead of:**
> "I need to work on the project this week."

**Try:**
> "I'm building a user authentication system. I have the database schema done but need to build the API, add rate limiting, write tests, and deploy to staging. I'm blocked on getting the OAuth credentials from the client."

### Include Your Constraints

- Time constraints ("I'm only available Monday-Wednesday")
- Energy levels ("I'm not good at creative work in the afternoons")
- Dependencies ("I can't start testing until Bob finishes the DB migration")
- Meetings and commitments
- Deadlines and priorities

### Iterate and Refine

If the AI's first output isn't quite right:
- Ask it to move tasks around
- Request more or fewer tasks per day
- Ask for more detailed descriptions
- Have it split large tasks into smaller ones

Example follow-up:
> "That's too much for Monday. Can you move 2 tasks to Tuesday and make sure each day has no more than 4 tasks?"

---

## 🎨 Customization

### Different List Names

If your Trello board uses different list names (e.g., "Mon" instead of "Monday"), modify the prompt:

```
The "list" field MUST be one of: "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
```

### Additional Fields

Want to add more data? Extend the JSON format:

```json
{
  "task": "Task name",
  "list": "Monday",
  "desc": "Description",
  "priority": "High",
  "estimate": "2 hours",
  "tags": ["frontend", "urgent"]
}
```

Then update your n8n Code Node to handle the extra fields.

### Non-Week-Based Planning

Planning by project phase instead of days?

```
The "list" field MUST be one of: "Planning", "Development", "Testing", "Review", "Complete"
```

---

## 🚀 Ready to Plan?

1. Copy the prompt above
2. Paste into your favorite AI
3. Describe your week
4. Get your JSON
5. Send it to LazyPlanner!

**Happy planning! 🦥**
