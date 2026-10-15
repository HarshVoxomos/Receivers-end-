import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ─── In-memory store & Active Real-Time Clients ──────────────────────────────
const messages = [];
const seenIds = new Set(); // Idempotency guard
const clients = new Set(); // Active connected frontend clients for real-time push

// ─── Real-Time Push Stream (SSE) ─────────────────────────────────────────────
// Frontend opens this ONCE. The server keeps the connection open and
// pushes messages directly to the UI the instant they arrive. No polling.
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send current message history immediately upon connection
  res.write(`data: ${JSON.stringify({ type: 'INIT', messages })}\n\n`);

  clients.add(res);
  console.log(`[REALTIME] Client connected. Active streams: ${clients.size}`);

  req.on('close', () => {
    clients.delete(res);
    console.log(`[REALTIME] Client disconnected. Active streams: ${clients.size}`);
  });
});

// Helper to push a message to all active browser windows in real time
function broadcastMessage(message) {
  const payload = `data: ${JSON.stringify({ type: 'MESSAGE', message })}\n\n`;
  for (const client of clients) {
    client.write(payload);
  }
}

// ─── Webhook endpoint (Telnyx posts here) ────────────────────────────────────
app.post('/webhook', (req, res) => {
  // Always respond 200 immediately — Telnyx requires response within 2s
  res.sendStatus(200);

  const data = req.body?.data;

  // Ignore anything that isn't an inbound message
  if (!data || data.event_type !== 'message.received') return;

  const eventId = data.id;

  // ── Idempotency check ──────────────────────────────────────────────────────
  if (seenIds.has(eventId)) {
    console.log(`[DUPLICATE] Skipping already-processed event: ${eventId}`);
    return;
  }
  seenIds.add(eventId);
  // ──────────────────────────────────────────────────────────────────────────

  const payload = data.payload;

  const message = {
    id: eventId,
    from: payload.from?.phone_number,
    to: payload.to?.[0]?.phone_number,
    text: payload.text,
    type: payload.type, // SMS or MMS
    receivedAt: payload.received_at || data.occurred_at,
  };

  messages.push(message);
  console.log(`[NEW MESSAGE] From: ${message.from} → "${message.text}"`);

  // PUSH DIRECTLY TO CONNECTED BROWSERS INSTANTLY (0ms delay)
  broadcastMessage(message);
});

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    activeClients: clients.size,
    messageCount: messages.length,
    uptime: process.uptime(),
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log(`   POST /webhook ← Telnyx sends inbound messages here`);
  console.log(`   GET  /events  ← Real-time push stream to React UI`);
});
