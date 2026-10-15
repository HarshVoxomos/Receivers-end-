import { SENDER_NUMBER, RECEIVER_NUMBER } from '../config.js';

function formatPhone(number) {
  if (!number) return number;
  const digits = number.replace(/\D/g, '');
  if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return number;
}

export default function Header({ status, lastUpdated, messageCount }) {
  return (
    <header className="bg-[#008069] text-white px-4 py-2.5 flex items-center justify-between whatsapp-header-shadow z-20">
      {/* Left: WhatsApp Contact Profile */}
      <div className="flex items-center gap-3">
        {/* Back button icon (WhatsApp style) */}
        <button className="text-white/80 hover:text-white p-1 rounded-full transition-colors md:hidden">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Sender Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-[#dfe5e7] text-[#54656f] flex items-center justify-center font-bold text-sm shadow-inner border border-black/10">
            <svg className="w-6 h-6 text-[#738289]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          {status === 'live' && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-[#008069] rounded-full" />
          )}
        </div>

        {/* Sender Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-semibold text-white tracking-wide">
              {formatPhone(SENDER_NUMBER)}
            </h1>
            <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded text-white font-medium">
              Sender
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#e0f2fe]">
            {status === 'live' ? (
              <span className="flex items-center gap-1 text-[#bbf7d0] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                online
              </span>
            ) : status === 'connecting' ? (
              <span className="text-amber-200">connecting...</span>
            ) : (
              <span className="text-red-200">offline</span>
            )}
            <span className="text-white/40">·</span>
            <span className="text-white/80">
              {messageCount} {messageCount === 1 ? 'message' : 'messages'}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Receiver Pill */}
      <div className="flex items-center gap-3">
        {/* Receiver Identity Pill */}
        <div className="flex items-center gap-1.5 bg-[#006a57] border border-emerald-400/30 px-3 py-1 rounded-full text-xs text-white shadow-sm">
          <span className="text-[10px] text-emerald-200 uppercase tracking-wider font-semibold">You:</span>
          <span className="font-mono font-medium text-emerald-100">{formatPhone(RECEIVER_NUMBER)}</span>
        </div>
      </div>
    </header>
  );
}
