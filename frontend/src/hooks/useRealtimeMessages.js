import { useState, useEffect } from 'react';
import { getMessagesFromCache, saveMessagesToCache } from '../utils/cookieCache.js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

/**
 * Real-time event stream listener (SSE).
 * ZERO polling. Zero timers.
 * The backend pushes directly to this connection the exact millisecond
 * a webhook arrives.
 */
export function useRealtimeMessages() {
  const [messages, setMessages] = useState(() => getMessagesFromCache());
  const [status, setStatus] = useState('connecting'); // 'connecting' | 'live' | 'error'
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const url = BACKEND_URL ? `${BACKEND_URL}/events` : '/events';
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      setStatus('live');
    };

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload.type === 'INIT') {
          // Initial message history from server — merge with local cookie cache
          setMessages((prev) => {
            const map = new Map();
            prev.forEach((m) => map.set(m.id, m));
            payload.messages.forEach((m) => map.set(m.id, m));
            const merged = Array.from(map.values()).sort(
              (a, b) => new Date(a.receivedAt || 0) - new Date(b.receivedAt || 0)
            );
            saveMessagesToCache(merged);
            return merged;
          });
          setLastUpdated(new Date());
        } else if (payload.type === 'MESSAGE') {
          // Instant push of a single incoming message from Telnyx
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.message.id)) return prev;
            const updated = [...prev, payload.message];
            saveMessagesToCache(updated);
            return updated;
          });
          setLastUpdated(new Date());
        }
      } catch (err) {
        console.error('[SSE Parse Error]', err);
      }
    };

    eventSource.onerror = () => {
      setStatus('error');
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { messages, status, lastUpdated };
}
