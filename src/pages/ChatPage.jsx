import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import ChatWindow from '../components/chat/ChatWindow';
import { promptTemplates } from '../data/prompts';
import { downloadFile, exportChatAsJSON, exportChatAsText } from '../utils/exportChat';
import { useNavigate } from 'react-router-dom';

export default function ChatPage() {
  const {
    selectedChat,
    messages,
    loading,
    sendMessage,
    draftPrompt,
    setDraftPrompt,
    createNewChat,
  } = useApp();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const handleSendMessage = async (text) => {
    const cleanText = text?.trim();

    if (!cleanText) {
      console.warn('[ChatPage] Attempted to send an empty message — ignored.');
      return;
    }

    console.log('[ChatPage] Sending message to chat "%s": "%s"', selectedChat?.title, cleanText.slice(0, 60));
    setDraftPrompt('');
    await sendMessage(cleanText, notify);
  };

  const handleSelectTemplate = (text) => {
    if (!text?.trim()) {
      console.warn('[ChatPage] Template selected with empty text — ignored.');
      return;
    }
    console.log('[ChatPage] Prompt template loaded into input.');
    setDraftPrompt(text);
    notify('Template loaded', 'Prompt inserted into the input box.');
  };

  const exportName =
    selectedChat?.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'chat';

  const handleExportText = () => {
    if (!messages || messages.length === 0) {
      console.warn('[ChatPage] Export TXT requested but no messages exist in this chat.');
      notify('Nothing to export', 'This chat has no messages to export yet.', 'error');
      return;
    }
    console.log('[ChatPage] Exporting chat "%s" as TXT (%d messages)', selectedChat?.title, messages.length);
    downloadFile(exportChatAsText(selectedChat, messages), `${exportName}.txt`, 'text/plain');
    notify('Chat exported', 'Text export downloaded successfully.');
  };

  const handleExportJSON = () => {
    if (!messages || messages.length === 0) {
      console.warn('[ChatPage] Export JSON requested but no messages exist in this chat.');
      notify('Nothing to export', 'This chat has no messages to export yet.', 'error');
      return;
    }
    console.log('[ChatPage] Exporting chat "%s" as JSON (%d messages)', selectedChat?.title, messages.length);
    downloadFile(exportChatAsJSON(selectedChat, messages), `${exportName}.json`, 'application/json');
    notify('Chat exported', 'JSON export downloaded successfully.');
  };

  const handleNewChat = () => {
    console.log('[ChatPage] Creating new chat in category "business".');
    createNewChat('business');
    setDraftPrompt('');
    navigate('/chat');
    notify('New chat created', 'Start typing to begin a fresh conversation.');
  };

  return (
    <ChatWindow
      activeChat={selectedChat}
      messages={messages}
      loading={loading}
      promptValue={draftPrompt}
      onPromptChange={setDraftPrompt}
      onSendMessage={handleSendMessage}
      onSelectTemplate={handleSelectTemplate}
      quickTemplates={promptTemplates}
      onExportText={handleExportText}
      onExportJSON={handleExportJSON}
      onNewChat={handleNewChat}
    />
  );
}
