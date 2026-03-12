import crypto from 'crypto';

export const config = { api: { bodyParser: false } };

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const buf = await buffer(req);
  const raw = buf.toString('utf8');

  // Verify Square signature
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (signatureKey) {
    const squareSig = req.headers['x-square-hmacsha256-signature'];
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/square-webhook`;
    const hmac = crypto.createHmac('sha256', signatureKey);
    hmac.update(url + raw);
    const expected = hmac.digest('base64');
    if (squareSig !== expected) {
      return res.status(403).json({ error: 'Invalid signature' });
    }
  }

  const event = JSON.parse(raw);
  console.log('[Square Webhook]', event.type);

  switch (event.type) {
    case 'payment.completed':
      const payment = event.data?.object?.payment;
      console.log(`[+] Payment completed: ${payment?.id} — $${(payment?.amount_money?.amount || 0) / 100}`);
      break;
    case 'payment.failed':
      console.log(`[-] Payment failed:`, event.data?.object?.payment?.id);
      break;
    case 'refund.completed':
      console.log(`[~] Refund completed:`, event.data?.object?.refund?.id);
      break;
    default:
      console.log(`[?] Unhandled event: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
