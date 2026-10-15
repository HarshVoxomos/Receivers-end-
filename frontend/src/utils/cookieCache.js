const COOKIE_NAME = 'telnyx_chat_cache';
const STORAGE_KEY = 'telnyx_chat_storage_backup';
const MAX_COOKIE_BYTES = 2800; // Stay well below browser 4096-byte limit & avoid HTTP 431

/**
 * Safely writes messages to a cookie (with 7-day persistence)
 * and syncs with localStorage as a safety layer for overflow.
 */
export function saveMessagesToCache(messages) {
  if (!Array.isArray(messages)) return;

  try {
    // 1. Always save full messages to localStorage (5MB+ safe storage)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));

    // 2. Prepare cookie payload (trimmed if necessary to fit cookie limits)
    let safeMessages = [...messages];
    let serialized = encodeURIComponent(JSON.stringify(safeMessages));

    // Trim older messages if the payload exceeds safe cookie size
    while (serialized.length > MAX_COOKIE_BYTES && safeMessages.length > 1) {
      safeMessages.shift(); // remove oldest message
      serialized = encodeURIComponent(JSON.stringify(safeMessages));
    }

    // Set cookie with 7-day expiration, root path, SameSite=Lax
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    document.cookie = `${COOKIE_NAME}=${serialized}; max-age=${maxAge}; path=/; SameSite=Lax`;
  } catch (err) {
    console.warn('[CookieCache] Failed to save cache:', err);
  }
}

/**
 * Reads messages from cookie first (with fallback to localStorage).
 * Returns array of cached messages.
 */
export function getMessagesFromCache() {
  try {
    // 1. Attempt reading from cookie
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      const trimmed = c.trim();
      if (trimmed.startsWith(`${COOKIE_NAME}=`)) {
        const raw = trimmed.substring(COOKIE_NAME.length + 1);
        const parsed = JSON.parse(decodeURIComponent(raw));
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with localStorage if localStorage has more complete history
          const backupRaw = localStorage.getItem(STORAGE_KEY);
          if (backupRaw) {
            const backupParsed = JSON.parse(backupRaw);
            if (Array.isArray(backupParsed) && backupParsed.length >= parsed.length) {
              return backupParsed;
            }
          }
          return parsed;
        }
      }
    }

    // 2. Fallback to localStorage if cookie was cleared or empty
    const backupRaw = localStorage.getItem(STORAGE_KEY);
    if (backupRaw) {
      const backupParsed = JSON.parse(backupRaw);
      if (Array.isArray(backupParsed)) return backupParsed;
    }
  } catch (err) {
    console.warn('[CookieCache] Error reading cache:', err);
  }

  return [];
}
