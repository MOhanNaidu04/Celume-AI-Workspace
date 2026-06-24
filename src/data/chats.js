export const initialChats = [
  {
    id: '01',
    title: 'Marketing launch plan',
    category: 'marketing',
    lastMessage: "Let's refine the campaign angle for the email sequence.",
    updatedAt: 'Today, 11:08 AM',
    thread: [
      { role: 'user', text: 'Help me write a launch email for a new AI workspace product.' },
      {
        role: 'assistant',
        text: 'Start with a customer insight, then highlight the outcome and CTA. Lead with the pain point: scattered tools slowing teams down. Position Celume as the unified workspace. End with a clear trial CTA.',
      },
      { role: 'user', text: 'Can you make it sound modern and professional?' },
      {
        role: 'assistant',
        text: 'Absolutely. Here is a refined opening: "Your team deserves one place to think, create, and ship — not five tabs and a spreadsheet." Keep sentences short, use active voice, and avoid jargon.',
      },
    ],
  },
  {
    id: '02',
    title: 'Sales outreach copy',
    category: 'sales',
    lastMessage: 'A concise value-first outreach line works better.',
    updatedAt: 'Yesterday, 4:30 PM',
    thread: [
      { role: 'user', text: 'I need a cold outreach message for a product design tool.' },
      {
        role: 'assistant',
        text: 'Lead with customer pain and a quick value proposition. Example: "Most design teams lose 6+ hours/week on handoffs. We cut that in half — worth a 15-min look?"',
      },
    ],
  },
  {
    id: '03',
    title: 'Interview prep',
    category: 'hr',
    lastMessage: 'Prepare a candidate scorecard and set of behavioral questions.',
    updatedAt: '2 days ago',
    thread: [
      { role: 'user', text: 'Create a hiring rubric for a junior product manager.' },
      {
        role: 'assistant',
        text: 'Score on four axes: communication (25%), ownership (25%), product thinking (30%), and collaboration (20%). Use behavioral questions like "Tell me about a time you prioritized under ambiguity."',
      },
    ],
  },
  {
    id: '04',
    title: 'React state debugging',
    category: 'coding',
    lastMessage: 'Check dependency arrays and stale closures first.',
    updatedAt: '3 days ago',
    thread: [
      { role: 'user', text: 'My React component is not re-rendering when state updates.' },
      {
        role: 'assistant',
        text: 'Common causes: mutating state directly, missing dependency arrays in useEffect, or stale closures in callbacks. Use React DevTools to trace state changes and verify setState is called with new references.',
      },
    ],
  },
];

export const createEmptyChat = (category = 'business') => ({
  id: `chat-${Date.now()}`,
  title: 'New conversation',
  category,
  lastMessage: 'Start typing to begin...',
  updatedAt: 'Just now',
  thread: [],
});
