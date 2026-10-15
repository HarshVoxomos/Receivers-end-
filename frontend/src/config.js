// All phone numbers are strictly loaded from environment variables (.env)
export const SENDER_NUMBER = import.meta.env.VITE_SENDER_NUMBER || '';
export const RECEIVER_NUMBER = import.meta.env.VITE_RECEIVER_NUMBER || '';
