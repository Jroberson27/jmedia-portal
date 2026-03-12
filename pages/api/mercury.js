export default async function handler(req, res) {
  const key = process.env.MERCURY_API_KEY;
  if (!key || key === 'your_mercury_api_key') {
    return res.status(200).json({
      mock:true, balance:48320.00, pending:9000.00,
      recentTransactions:[
        {id:1,description:'The Vinoy Renaissance - Retainer Mar',amount:6000, date:'Mar 1, 2026',type:'credit'},
        {id:2,description:'Kimpton Surfcomber - Retainer Mar',   amount:5000, date:'Mar 1, 2026',type:'pending'},
        {id:3,description:'Biltmore Hotel - Retainer Feb',       amount:4000, date:'Feb 1, 2026',type:'credit'},
        {id:4,description:'HubSpot Subscription',               amount:-100, date:'Mar 1, 2026',type:'debit'},
        {id:5,description:'Adobe Creative Cloud',               amount:-55,  date:'Mar 3, 2026',type:'debit'},
      ],
    });
  }
  try {
    const r = await fetch('https://backend.mercury.com/api/v1/accounts', { headers:{ Authorization:`Bearer ${key}` } });
    res.status(200).json(await r.json());
  } catch(e) { res.status(500).json({ error:e.message }); }
}