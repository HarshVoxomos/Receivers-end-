import Header from './components/Header.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import { useRealtimeMessages } from './hooks/useRealtimeMessages.js';

export default function App() {
  const { messages, status, lastUpdated } = useRealtimeMessages();

  return (
    <div className="h-full flex flex-col bg-[#efeae2]">
      {/* WhatsApp Header */}
      <Header
        status={status}
        lastUpdated={lastUpdated}
        messageCount={messages.length}
      />

      {/* Main WhatsApp Chat Body with iconic wallpaper */}
      <div className="flex-1 flex flex-col overflow-hidden whatsapp-wallpaper relative">
        <div className="flex-1 flex flex-col overflow-hidden max-w-4xl w-full mx-auto">
          <ChatWindow messages={messages} />
        </div>
      </div>

      {/* WhatsApp Bottom Bar */}
      <footer className="bg-[#f0f2f5] px-4 py-2.5 flex items-center gap-3 border-t border-[#d1d7db] z-10">
        {/* Emoji Button */}
        <button
          className="text-[#54656f] hover:text-[#111b21] p-1.5 transition-colors"
          title="Emojis"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {/* Attachment Paperclip */}
        <button
          className="text-[#54656f] hover:text-[#111b21] p-1.5 transition-colors"
          title="Attach"
        >
          <svg className="w-6 h-6 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        {/* Message Input Box */}
        <div className="flex-1 bg-white rounded-lg px-4 py-2 flex items-center border border-white shadow-sm">
          <input
            type="text"
            readOnly
            placeholder="Messages arrive here via Telnyx Webhook (Read-only Receiver)"
            className="w-full text-sm text-[#111b21] placeholder-[#8696a0] bg-transparent outline-none cursor-default"
          />
        </div>

        {/* WhatsApp Voice / Send Button */}
        <div
          className="w-10 h-10 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow hover:bg-[#008f6f] transition-colors cursor-pointer"
          title="Microphone"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </div>
      </footer>
    </div>
  );
}
