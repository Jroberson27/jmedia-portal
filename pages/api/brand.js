export default async function handler(req, res) {
  const { domain } = req.query;
  if (!domain) return res.status(400).json({ error:'Domain required' });
  const key = process.env.BRANDFETCH_API_KEY;
  if (!key || key === 'your_brandfetch_key') {
    const mocks = {
      vinoyrenaissance:{ name:'The Vinoy Renaissance',primary:'#1B3A4B',secondary:'#C9A84C',font:'Playfair Display' },
      surfcomber:      { name:'Kimpton Surfcomber',   primary:'#0077B6',secondary:'#48CAE4',font:'Montserrat' },
      biltmorehotel:   { name:'Biltmore Hotel',       primary:'#2C1810',secondary:'#8B6914',font:'Cormorant Garamond' },
    };
    const k = Object.keys(mocks).find(k => domain.toLowerCase().includes(k));
    return res.status(200).json(k ? mocks[k] : { name:domain, primary:'#333', secondary:'#666', font:null });
  }
  try {
    const r = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, { headers:{ Authorization:`Bearer ${key}` } });
    const d = await r.json();
    const colors = d.colors || [];
    res.status(200).json({
      name: d.name,
      primary: colors.find(c=>c.type==='brand')?.hex || colors[0]?.hex || '#333',
      secondary: colors[1]?.hex || null,
      font: d.fonts?.[0]?.name || null,
      logo: d.logos?.[0]?.formats?.[0]?.src || null,
    });
  } catch(e) { res.status(500).json({ error:e.message }); }
}