import crypto from 'crypto';
export const config = { api:{ bodyParser:false } };
async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const buf = await buffer(req);
  const raw = buf.toString('utf8');
  const secret = process.env.PMS_WEBHOOK_SECRET || 'dev-secret';
  const sig = req.headers['x-pms-signature'] || '';
  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(raw).digest('hex');
  if (sig && sig !== expected) return res.status(401).json({ error:'Invalid signature' });
  const event = JSON.parse(raw);
  console.log('[PMS Webhook]', event.pms, event.event, event.property_id);
  res.status(200).json({ received:true });
}