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
    const cleanText = text.trim();
    if (!cleanText) return;
    setDraftPrompt('');
    await sendMessage(cleanText, notify);
  };

  const handleSelectTemplate = (text) => {
    setDraftPrompt(text);
    notify('Template loaded', 'Prompt inserted into the input box.');
  };

  const exportName = selectedChat.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'chat';

  const handleExportText = () => {
    downloadFile(exportChatAsText(selectedChat, messages), `${exportName}.txt`, 'text/plain');
    notify('Chat exported', 'Text export downloaded.');
  };

  const handleExportJSON = () => {
    downloadFile(exportChatAsJSON(selectedChat, messages), `${exportName}.json`, 'application/json');
    notify('Chat exported', 'JSON export downloaded.');
  };

  const handleNewChat = () => {
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
