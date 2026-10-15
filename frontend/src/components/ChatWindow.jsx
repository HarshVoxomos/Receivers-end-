import { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble.jsx';

import { SENDER_NUMBER, RECEIVER_NUMBER } from '../config.js';

export default function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
      {/* WhatsApp Security Banner */}
      <div className="flex justify-center my-1">
        <div className="bg-[#ffeecd] border border-[#f5e0b7] text-[#54656f] text-[11px] leading-relaxed px-3.5 py-1.5 rounded-lg shadow-sm max-w-md text-center flex items-center gap-1.5">
          <span>🔒</span>
          <span>
            Messages and calls are end-to-end encrypted with Telnyx Webhooks. No one outside of this chat can read them.
          </span>
        </div>
      </div>

      {/* Date Pill (WhatsApp style) */}
      <div className="flex justify-center my-1">
        <span className="bg-[#ffffff]/80 backdrop-blur-sm text-[#54656f] text-[11px] font-medium px-3 py-1 rounded-md shadow-sm uppercase tracking-wide border border-[#e9edef]">
          Today
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
          <div className="w-16 h-16 rounded-full bg-[#dcf8c6] border border-[#c1e7a6] flex items-center justify-center shadow-md">
            <svg className="w-8 h-8 text-[#075E54]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.92-9.91-9.92zm5.78 14.01c-.24.67-1.39 1.28-1.92 1.36-.51.08-1.17.11-3.37-.8-2.82-1.17-4.63-4.06-4.77-4.25-.14-.19-1.14-1.52-1.14-2.9 0-1.38.72-2.06.98-2.34.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.15.12.33.02.53-.1.2-.15.32-.3.49-.15.18-.31.4-.44.53-.15.14-.3.3-.13.6.17.29.77 1.27 1.65 2.05 1.13 1.01 2.08 1.32 2.38 1.47.3.15.47.13.65-.07.18-.2.76-.89.96-1.19.2-.3.41-.25.68-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.7-.17 1.37z" />
            </svg>
          </div>

          <div className="text-center">
            <h3 className="text-[#111b21] font-semibold text-base">Waiting for Incoming Message</h3>
            <p className="text-[#667781] text-xs mt-1 max-w-xs">
              Send a curl request from your terminal to <span className="font-semibold text-[#008069]">{RECEIVER_NUMBER}</span>.
            </p>
          </div>

          {/* Quick Start Card */}
          <div className="w-full max-w-lg bg-white rounded-xl border border-[#d1d7db] p-4 shadow-sm text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#008069] uppercase tracking-wider">
                ⚡ Test cURL Command
              </span>
              <span className="text-[10px] text-[#8696a0]">Sender → Receiver</span>
            </div>
            <pre className="text-[12px] bg-[#f0f2f5] text-[#111b21] p-3 rounded-lg overflow-x-auto font-mono leading-relaxed border border-[#e9edef]">
{`curl -X POST https://api.telnyx.com/v2/messages \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "${SENDER_NUMBER}",
    "to": "${RECEIVER_NUMBER}",
    "text": "Hello from Telnyx SMS!"
  }'`}
            </pre>
          </div>
        </div>
      ) : (
        messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)
      )}

      <div ref={bottomRef} />
    </div>
  );
}
