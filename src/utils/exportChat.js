export function exportChatAsText(chat, messages) {
  const header = `Mohan-ai-workspace - Chat Export\nTitle: ${chat.title}\nCategory: ${chat.category}\nExported: ${new Date().toLocaleString()}\n${'='.repeat(50)}\n\n`;

  const body = messages
    .map((message) => `[${message.timestamp ?? '-'}] ${message.role === 'assistant' ? 'AI' : 'You'}:\n${message.text}\n`)
    .join('\n');

  return header + body;
}

export function exportChatAsJSON(chat, messages) {
  return JSON.stringify(
    {
      title: chat.title,
      category: chat.category,
      exportedAt: new Date().toISOString(),
      messages,
    },
    null,
    2
  );
}

export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
