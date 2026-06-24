export const categoryResponses = {
  marketing:
    'For marketing copy, lead with a customer insight, state the transformation clearly, and end with one strong CTA. Keep the tone confident but approachable.',
  sales:
    'In sales messaging, prioritize the prospect\'s pain point first, then your unique value, and finish with a low-friction next step like a 15-minute call.',
  hr: 'HR content should be structured, inclusive, and transparent. Define role expectations, evaluation criteria, and culture signals explicitly.',
  coding:
    'For technical issues, break the problem into reproducible steps, identify root cause, propose a fix, and note any edge cases or tests to add.',
  business:
    'Business summaries should focus on impact metrics, key decisions, risks, and actionable next steps that leadership can act on immediately.',
};

export const predefinedQA = [
  {
    keywords: ['launch', 'email', 'product launch'],
    answer:
      'Here is a launch email structure:\n\n1. Subject: "[Product] is live — [one-line benefit]"\n2. Hook: Name the problem your audience feels daily\n3. Solution: Introduce your product in 2 sentences\n4. Proof: One metric or testimonial\n5. CTA: "Start free" or "Book a demo"\n\nKeep it under 150 words for mobile readability.',
  },
  {
    keywords: ['follow up', 'follow-up', 'warm lead'],
    answer:
      'Follow-up template:\n\n"Hi [Name], following up on our conversation about [topic]. Teams like yours typically see [specific outcome] within [timeframe]. Would [day/time] work for a quick 15-min sync?"\n\nSend within 48 hours. Reference something specific from your last call.',
  },
  {
    keywords: ['hiring', 'recruit', 'interview', 'rubric'],
    answer:
      'Hiring rubric framework:\n\n• Must-have skills (weighted 40%)\n• Culture & collaboration (25%)\n• Problem-solving (25%)\n• Growth potential (10%)\n\nUse a 1–4 scale per criterion. Require two interviewers to score independently before debrief.',
  },
  {
    keywords: ['react', 'state', 'debug', 'bug', 'render'],
    answer:
      'React debugging checklist:\n\n1. Verify state updates use functional setState when depending on prev state\n2. Check useEffect dependency arrays\n3. Look for direct object/array mutation\n4. Use React DevTools Profiler for unnecessary re-renders\n5. Add console logs or breakpoints at state update points',
  },
  {
    keywords: ['okr', 'growth', 'review', 'quarterly', 'metrics'],
    answer:
      'Weekly growth review template:\n\n• North star metric: [current vs target]\n• Wins: Top 2 accomplishments\n• Blockers: What slowed progress\n• Experiments: What we tested and learned\n• Next week: 3 prioritized actions with owners',
  },
  {
    keywords: ['linkedin', 'social', 'campaign'],
    answer:
      '7-day LinkedIn campaign plan:\n\nMon: Problem awareness post\nTue: Customer story / case study\nWed: Product tip carousel\nThu: Behind-the-scenes / team culture\nFri: Industry insight or data point\nSat: Poll or question to drive engagement\nSun: Week recap + soft CTA',
  },
  {
    keywords: ['price', 'objection', 'too expensive', 'cost'],
    answer:
      'Price objection response:\n\n"I understand budget matters. Most clients initially felt the same until they calculated [specific ROI — e.g., 8 hrs/week saved × team size]. Would it help if I walked through the numbers for your team specifically?"\n\nNever discount immediately — reframe around value.',
  },
  {
    keywords: ['onboarding', 'new hire', '30-day'],
    answer:
      '30-day engineer onboarding:\n\nWeek 1: Environment setup, codebase tour, shadow standups\nWeek 2: First small PR with mentor review\nWeek 3: Own a feature slice end-to-end\nWeek 4: Present learnings, propose one improvement\n\nAssign a dedicated buddy and schedule daily 15-min check-ins.',
  },
  {
    keywords: ['api', 'rest', 'endpoint'],
    answer:
      'REST API conventions:\n\n• Use nouns for resources: /users, /users/:id\n• HTTP verbs: GET (read), POST (create), PUT/PATCH (update), DELETE\n• Version via header or path: /v1/users\n• Consistent error format: { error, message, code }\n• Paginate list endpoints: ?page=1&limit=20',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'help'],
    answer:
      'Hello! I\'m your Celume AI assistant. I can help with marketing copy, sales outreach, HR workflows, coding questions, and business planning. Try a prompt template from the sidebar or ask me anything.',
  },
];

export const defaultResponse =
  'That\'s a solid prompt. Here\'s my take: break your request into a clear goal, context, and desired output format. I\'d recommend starting with the outcome you want, then adding constraints like tone, length, and audience. Would you like me to draft something specific?';
