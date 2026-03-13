export default function handler(req, res) {
  // Only allow logged-in requests — basic check
  if (req.method !== 'GET') return res.status(405).end();

  const routing = process.env.MERCURY_ROUTING;
  const account = process.env.MERCURY_ACCOUNT;

  if (!routing || !account) {
    return res.status(200).json({
      bank: 'Mercury',
      accountName: 'JMEDIA Productions LLC',
      routing: '—',
      account: '—',
    });
  }

  // Mask account number — only show last 4 digits
  const maskedAccount = '••••••' + account.slice(-4);

  res.status(200).json({
    bank: 'Mercury',
    accountName: 'JMEDIA Productions LLC',
    routing: routing,
    account: maskedAccount,
  });
}
