export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;
  const environment = process.env.SQUARE_ENVIRONMENT || 'sandbox';

  // Stub if not configured
  if (!token || token === 'your_square_access_token') {
    return res.status(200).json({ checkoutUrl: null, mock: true });
  }

  const { amount, clientName, invoiceNumber, clientEmail } = req.body;

  const baseUrl = environment === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';

  try {
    const r = await fetch(`${baseUrl}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Square-Version': '2024-01-18',
      },
      body: JSON.stringify({
        idempotency_key: `${invoiceNumber}-${Date.now()}`,
        description: `JMEDIA Productions — ${invoiceNumber}`,
        order: {
          location_id: locationId,
          line_items: [
            {
              name: `JMEDIA Retainer — ${invoiceNumber}`,
              quantity: '1',
              base_price_money: {
                amount: amount * 100,
                currency: 'USD',
              },
            },
          ],
        },
        checkout_options: {
          redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/client/invoices`,
          ask_for_shipping_address: false,
          merchant_support_email: 'jordan@jmediaproductions.com',
        },
        pre_populated_data: {
          buyer_email: clientEmail || undefined,
        },
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        error: data.errors?.[0]?.detail || 'Square checkout failed',
      });
    }

    res.status(200).json({
      checkoutUrl: data.payment_link?.url,
      paymentLinkId: data.payment_link?.id,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
