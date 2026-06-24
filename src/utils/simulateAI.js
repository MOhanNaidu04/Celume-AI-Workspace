import { categoryResponses, predefinedQA, defaultResponse } from '../data/aiResponses';

const TYPING_DELAY_MS = 900;

function findMatchingAnswer(prompt) {
  const lower = prompt.toLowerCase();

  for (const qa of predefinedQA) {
    if (qa.keywords.some((kw) => lower.includes(kw))) {
      return qa.answer;
    }
  }

  return null;
}

export function simulateAIResponse(prompt, category) {
  return new Promise((resolve) => {
    const matched = findMatchingAnswer(prompt);
    const categoryHint = categoryResponses[category] ?? categoryResponses.business;

    const answer = matched
      ? matched
      : `${categoryHint}\n\nBased on your prompt: "${prompt.slice(0, 120)}${prompt.length > 120 ? '...' : ''}"\n\n${defaultResponse}`;

    setTimeout(() => resolve(answer), TYPING_DELAY_MS);
  });
}
