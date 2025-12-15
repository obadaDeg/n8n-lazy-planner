# 🎯 The Golden Prompt

Copy and paste this prompt into ChatGPT, Claude, Gemini, or any AI assistant to generate your weekly plan in the correct format.

---

## The Prompt

```
I need you to help me plan my work and study tasks for the week. Please listen to my goals, tasks, and constraints, then output a structured weekly plan.

CRITICAL: Your final output MUST be a valid JSON array following this exact format:

[
  {
    "task": "Clear, actionable task name",
    "list": "DayOfWeek or Backlog",
    "category": "Work or Study or Urgent",
    "desc": "Detailed description with context, dependencies, or notes"
  }
]

RULES FOR THE JSON OUTPUT:
1. The "list" field MUST be one of: "Backlog", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Done"
2. The "category" field MUST be one of: "Work", "Study", "Urgent"
3. Use "Backlog" for tasks without a specific day assigned yet
4. Use "Done" for already completed tasks (if tracking them)
5. Each task should be specific and actionable
6. Descriptions should provide context, not just repeat the task name
7. Output ONLY the JSON array - no explanatory text before or after
8. Ensure the JSON is valid (proper quotes, commas, brackets)

CATEGORY GUIDELINES:
- "Work": Professional tasks, meetings, deliverables, code reviews, client work
  ✓ Examples: "Complete Q4 report", "Deploy to production", "Client presentation", "Review team PRs"

- "Study": Learning, courses, certifications, technical reading, skill development
  ✓ Examples: "AWS certification practice", "Read React documentation", "Complete online course module", "Practice coding problems"

- "Urgent": Time-sensitive tasks requiring immediate attention (can be work or study)
  ✓ Examples: "Fix production bug", "Submit proposal before deadline", "Study for exam tomorrow", "Emergency client call"

NOTE: This system is designed for professional productivity (work and study). Personal life tasks (groceries, errands, social events) should use a separate system.

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

I'm launching a new feature on Friday and also need to study for my AWS certification exam. I need to:
- Finish the API endpoints (currently 70% done)
- Write unit tests for the new code
- Update the documentation
- Get design approval on the UI mockups
- Do a security review
- Deploy to staging and test
- Prepare a demo for stakeholders
- Study AWS EC2 and S3 concepts
- Complete 2 practice exams

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
    "category": "Work",
    "desc": "Finish the remaining 30% of API development. Focus on the user profile and settings endpoints. Test locally before committing."
  },
  {
    "task": "Write unit tests for new API endpoints",
    "list": "Monday",
    "category": "Work",
    "desc": "Aim for 80%+ coverage. Focus on edge cases and error handling. Use existing test patterns."
  },
  {
    "task": "AWS - Study EC2 basics",
    "list": "Monday",
    "category": "Study",
    "desc": "Watch tutorial videos on EC2 instance types, pricing models, and basic configuration. Take notes for exam."
  },
  {
    "task": "Submit UI mockups for design review",
    "list": "Monday",
    "category": "Work",
    "desc": "Share Figma links with design team. Highlight the new onboarding flow and settings panel. Request feedback by EOD Tuesday."
  },
  {
    "task": "Security review - API authentication",
    "list": "Tuesday",
    "category": "Work",
    "desc": "Review OAuth implementation, rate limiting, and input validation. Check OWASP top 10 compliance."
  },
  {
    "task": "Security review - Data validation",
    "list": "Tuesday",
    "category": "Work",
    "desc": "Audit all user inputs for XSS, SQL injection, and CSRF vulnerabilities. Test with malicious payloads."
  },
  {
    "task": "AWS - Study S3 storage",
    "list": "Tuesday",
    "category": "Study",
    "desc": "Learn about S3 buckets, storage classes, lifecycle policies, and security. Practice with hands-on labs."
  },
  {
    "task": "Incorporate design feedback on UI",
    "list": "Wednesday",
    "category": "Work",
    "desc": "Update mockups based on Tuesday's design review. Get final approval before implementation."
  },
  {
    "task": "Deploy to staging environment",
    "list": "Wednesday",
    "category": "Work",
    "desc": "Deploy latest code to staging. Run smoke tests. Share staging URL with QA team."
  },
  {
    "task": "AWS - Practice exam 1",
    "list": "Wednesday",
    "category": "Study",
    "desc": "Complete first full-length practice exam. Review incorrect answers and note weak areas."
  },
  {
    "task": "Update API documentation",
    "list": "Thursday",
    "category": "Work",
    "desc": "Document all new endpoints in Swagger. Include request/response examples and authentication requirements."
  },
  {
    "task": "End-to-end testing on staging",
    "list": "Thursday",
    "category": "Work",
    "desc": "Test complete user flows. Verify integration with existing features. Check mobile responsiveness."
  },
  {
    "task": "Prepare stakeholder demo",
    "list": "Thursday",
    "category": "Work",
    "desc": "Create demo script and slides. Prepare talking points for business value. Anticipate questions about timeline and scalability."
  },
  {
    "task": "Final checks and monitoring setup",
    "list": "Friday",
    "category": "Urgent",
    "desc": "Verify production deploy checklist. Set up error monitoring and alerts. Have rollback plan ready."
  },
  {
    "task": "Launch new feature",
    "list": "Friday",
    "category": "Urgent",
    "desc": "Deploy to production during low-traffic window. Monitor logs and metrics. Be available for immediate fixes."
  },
  {
    "task": "AWS - Practice exam 2",
    "list": "Backlog",
    "category": "Study",
    "desc": "Second practice exam to take when time allows. Focus on areas identified as weak in exam 1."
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

### Using Backlog Effectively

The "Backlog" list is perfect for:
- Tasks without a specific deadline
- Ideas for future work or study
- Tasks that depend on external factors
- Items to schedule once the week becomes clearer

Example:
```json
{
  "task": "Research Docker containerization",
  "list": "Backlog",
  "category": "Study",
  "desc": "Learn Docker basics when I have extra time. Not urgent."
}
```

### Different List Names

If your Trello board uses different list names, modify the prompt:

```
The "list" field MUST be one of: "Ideas", "Mon", "Tue", "Wed", "Thu", "Fri", "Completed"
```

### Additional Fields

Want to add more data? Extend the JSON format:

```json
{
  "task": "Task name",
  "list": "Monday",
  "category": "Work",
  "desc": "Description",
  "priority": "High",
  "estimate": "2 hours"
}
```

Then update your n8n Code Node to handle the extra fields.

---

## 🚀 Ready to Plan?

1. Copy the prompt above
2. Paste into your favorite AI
3. Describe your week
4. Get your JSON
5. Send it to LazyPlanner!

**Happy planning! 🦥**
