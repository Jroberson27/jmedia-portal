export default async function handler(req, res) {
  const token = process.env.HUBSPOT_TOKEN;
  const { endpoint } = req.query;
  // STUB - remove mock block once real token is set in Vercel
  if (!token || token === 'your_hubspot_private_app_token') {
    const mock = {
      contacts: { results: [
        {id:'1',properties:{firstname:'Sarah',lastname:'Chen',  email:'sarah@alfondinn.com', jobtitle:'General Manager',    company:'The Alfond Inn'}},
        {id:'2',properties:{firstname:'Tom',  lastname:'Mills', email:'tom@greyfieldinn.com',jobtitle:'Owner',              company:'Greyfield Inn'}},
        {id:'3',properties:{firstname:'Ana',  lastname:'Ruiz',  email:'ana@hotelhaya.com',   jobtitle:'Marketing Director', company:'Hotel Haya'}},
        {id:'4',properties:{firstname:'James',lastname:'Patel', email:'james@orchardinn.com',jobtitle:'General Manager',    company:'The Orchard Inn'}},
        {id:'5',properties:{firstname:'Mike', lastname:'Torres',email:'mike@ranchoinn.com',  jobtitle:'Owner',              company:'Inn at Rancho'}},
      ]},
      deals: { results: [
        {id:'101',properties:{dealname:'The Vinoy Renaissance',amount:'6000',dealstage:'closedwon',     closedate:'2026-01-01'}},
        {id:'102',properties:{dealname:'Kimpton Surfcomber',   amount:'5000',dealstage:'closedwon',     closedate:'2026-02-01'}},
        {id:'103',properties:{dealname:'Biltmore Hotel',       amount:'4000',dealstage:'closedwon',     closedate:'2026-02-01'}},
        {id:'104',properties:{dealname:'The Alfond Inn',       amount:'5000',dealstage:'contractsent',  closedate:'2026-04-01'}},
        {id:'105',properties:{dealname:'Hotel Haya',           amount:'4500',dealstage:'appointmentscheduled',closedate:'2026-05-01'}},
      ]},
    };
    return res.status(200).json(mock[endpoint] || { results:[] });
  }
  // LIVE
  const map = {
    contacts:'/crm/v3/objects/contacts?limit=100&properties=firstname,lastname,email,jobtitle,company,phone',
    deals:   '/crm/v3/objects/deals?limit=100&properties=dealname,amount,dealstage,closedate,pipeline',
  };
  if (!map[endpoint]) return res.status(400).json({ error:'Unknown endpoint' });
  try {
    const r = await fetch(`https://api.hubapi.com${map[endpoint]}`, { headers:{ Authorization:`Bearer ${token}` } });
    res.status(r.status).json(await r.json());
  } catch(e) { res.status(500).json({ error:e.message }); }
}