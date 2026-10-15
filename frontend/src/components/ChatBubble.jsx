import { SENDER_NUMBER, RECEIVER_NUMBER } from '../config.js';

function formatPhone(number) {
  if (!number) return number;
  const digits = number.replace(/\D/g, '');
  if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return number;
}

function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatBubble({ message }) {
  const isFromSender = message.from === SENDER_NUMBER;

  return (
    <div
      className={`flex items-end w-full animate-fade-in-up ${
        isFromSender ? 'justify-start' : 'justify-end'
      }`}
    >
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] px-3.5 py-2 whatsapp-bubble-shadow ${
          isFromSender
            ? 'bg-white text-[#111b21] rounded-2xl rounded-tl-sm border border-[#e2ddd5]'
            : 'bg-[#d9fdd3] text-[#111b21] rounded-2xl rounded-tr-sm border border-[#c6e9be]'
        }`}
      >
        {/* Contact Name / Phone for incoming sender */}
        {isFromSender && (
          <div className="text-[12px] font-semibold text-[#008069] mb-0.5 leading-tight flex items-center justify-between gap-3">
            <span>{formatPhone(SENDER_NUMBER)}</span>
            {message.type && (
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-normal">
                {message.type}
              </span>
            )}
          </div>
        )}

        {/* Message Content */}
        <p className="text-[14px] leading-relaxed break-words pr-2">
          {message.text}
        </p>

        {/* Timestamp + WhatsApp double checks */}
        <div className="flex items-center justify-end gap-1 mt-1 text-[11px] text-[#667781] select-none">
          <span>{formatTime(message.receivedAt)}</span>

          {/* WhatsApp Checkmarks */}
          {!isFromSender ? (
            <span className="text-[#53bdeb] text-[13px] font-bold" title="Read">
              ✓✓
            </span>
          ) : (
            <span className="text-[#8696a0] text-[11px]" title="Delivered">
              ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
