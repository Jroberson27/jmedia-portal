export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === 'your_stripe_secret_key') {
    return res.status(200).json({ clientSecret:'pi_stub_secret', mock:true });
  }
  const Stripe = require('stripe');
  const stripe = Stripe(key);
  const { amount, customerId, invoiceId } = req.body;
  try {
    const pi = await stripe.paymentIntents.create({ amount:amount*100, currency:'usd', customer:customerId, metadata:{ invoiceId } });
    res.status(200).json({ clientSecret:pi.client_secret });
  } catch(e) { res.status(500).json({ error:e.message }); }
}