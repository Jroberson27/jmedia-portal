import { useState, useEffect } from 'react';
import { CLIENTS, CONTENT, INVOICES } from '../../lib/data';
import { CORAL, SUCCESS, WARNING, glass, FONT } from '../../lib/design';
import AnimatedNumber from '../shared/AnimatedNumber';
import AnimatedSparkline from '../shared/AnimatedSparkline';
import AnimatedBar from '../shared/AnimatedBar';
import StatusBadge from '../shared/StatusBadge';

function InvoiceRow({ inv, client, accent, isLast }) {
  const [paying, setPaying] = useState(false);
  const [payMethod, setPayMethod] = useState(null);

  const handleCardPay = async () => {
    setPaying(true);
    try {
      const r = await fetch('/api/square-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: inv.amount,
          clientName: client.name,
          invoiceNumber: inv.number,
          clientEmail: client.email,
        }),
      });
      const data = await r.json();
      if (data.mock) {
        alert('Square not configured yet — add SQUARE_ACCESS_TOKEN to Vercel.');
        return;
      }
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div style={{ padding:'20px 22px', borderBottom:isLast?'none':'1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10, marginBottom: inv.status !== 'paid' ? 16 : 0 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700 }}>{inv.number}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:2 }}>Issued {inv.issueDate} · Due {inv.dueDate}</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ fontSize:18, fontWeight:800 }}>${inv.amount.toLocaleString()}</div>
          <StatusBadge status={inv.status}/>
        </div>
      </div>

      {inv.status !== 'paid' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {/* ACH Tile */}
          <div
            onClick={() => setPayMethod(payMethod === 'ach' ? null : 'ach')}
            style={{ padding:'14px 16px', borderRadius:14, border:`1px solid ${payMethod === 'ach' ? accent+'60' : 'rgba(255,255,255,0.1)'}`, background: payMethod === 'ach' ? `${accent}0A` : 'rgba(255,255,255,0.03)', cursor:'pointer', transition:'all 0.2s' }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <span style={{ fontSize:18 }}>🏦</span>
              <div>
                <div style={{ fontSize:12, fontWeight:700 }}>ACH Bank Transfer</div>
                <div style={{ fontSize:10, color:'#4CAF50', fontWeight:600 }}>No fees</div>
              </div>
            </div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Wire directly from your bank — recommended for retainers</div>
          </div>

          {/* Card Tile */}
          <div
            onClick={() => setPayMethod(payMethod === 'card' ? null : 'card')}
            style={{ padding:'14px 16px', borderRadius:14, border:`1px solid ${payMethod === 'card' ? accent+'60' : 'rgba(255,255,255,0.1)'}`, background: payMethod === 'card' ? `${accent}0A` : 'rgba(255,255,255,0.03)', cursor:'pointer', transition:'all 0.2s' }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <span style={{ fontSize:18 }}>💳</span>
              <div>
                <div style={{ fontSize:12, fontWeight:700 }}>Credit / Debit Card</div>
                <div style={{ fontSize:10, color:'#FFA500', fontWeight:600 }}>~2.6% fee applies</div>
              </div>
            </div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Instant payment via Square secure checkout</div>
          </div>

          {/* ACH Expanded */}
          {payMethod === 'ach' && (
            <div style={{ gridColumn:'1 / -1', padding:'16px 18px', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', marginBottom:12 }}>ACH Transfer Details</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginBottom:14 }}>
                {[
                  { label:'Bank',           value:'Mercury' },
                  { label:'Account Name',   value:'JMEDIA Productions LLC' },
                  { label:'Routing Number', value:process.env.NEXT_PUBLIC_ROUTING || '—' },
                  { label:'Account Number', value:process.env.NEXT_PUBLIC_ACCOUNT || '—' },
                ].map((f,i) => (
                  <div key={i}>
                    <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:4 }}>{f.label}</div>
                    <div style={{ fontSize:13, fontWeight:600, fontFamily:'monospace' }}>{f.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding:'10px 14px', background:`${accent}10`, border:`1px solid ${accent}30`, borderRadius:10, fontSize:11, color:'rgba(255,255,255,0.6)' }}>
                📋 Use <strong style={{ color:'#fff' }}>{inv.number}</strong> as the memo/reference so we can match your payment
              </div>
            </div>
          )}

          {/* Card Expanded */}
          {payMethod === 'card' && (
            <div style={{ gridColumn:'1 / -1', padding:'16px 18px', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:14, lineHeight:1.6 }}>
                You'll be taken to a secure Square checkout page. Your card details are handled directly by Square — JMEDIA never sees your card number.
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, padding:'10px 14px', background:'rgba(255,165,0,0.08)', border:'1px solid rgba(255,165,0,0.2)', borderRadius:10 }}>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>Total with processing fee (~2.6%)</span>
                <span style={{ fontSize:14, fontWeight:800, color:'#FFA500' }}>${(inv.amount * 1.026).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
              </div>
              <button
                onClick={handleCardPay}
                disabled={paying}
                style={{ width:'100%', background:`linear-gradient(145deg, ${accent}, ${accent}bb)`, border:'none', color:'#fff', padding:'12px 20px', borderRadius:12, fontSize:13, fontWeight:700, cursor:paying?'not-allowed':'pointer', fontFamily:'Inter,sans-serif', opacity:paying?0.7:1, boxShadow:`0 4px 16px ${accent}40` }}
              >
                {paying ? 'Opening checkout...' : `Pay $${(inv.amount * 1.026).toLocaleString(undefined, {maximumFractionDigits:0})} via Square →`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ClientPortal({ clientId, defaultTab = 'dashboard' }) {
  const [tab, setTab] = useState(defaultTab);
  const client = CLIENTS[clientId] || CLIENTS.vinoy;
  const content = CONTENT.filter(c => c.clientId === clientId);
  const invoices = INVOICES.filter(i => i.clientId === clientId);
  const accent = client.color;
  const directChange = Math.round(((client.directBookings - client.directLast) / client.directLast) * 100);
  const trafficChange = Math.round(((client.websiteTraffic - client.websiteTrafficLast) / client.websiteTrafficLast) * 100);

  useEffect(() => { setTab(defaultTab); }, [defaultTab]);

  return (
    <div style={{ color:'#fff', fontFamily:FONT }}>
      <style>{`
        .client-kpi-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 22px; }
        .client-two-col  { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 22px; }
        .client-content-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; padding: 22px; }
        .perf-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 22px; }
        @media (max-width: 768px) {
          .client-kpi-grid  { grid-template-columns: repeat(2,1fr) !important; }
          .client-two-col   { grid-template-columns: 1fr !important; }
          .client-content-grid { grid-template-columns: repeat(2,1fr) !important; padding: 14px !important; }
          .perf-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* DASHBOARD */}
      {tab === 'dashboard' && (
        <>
          <div style={{ marginBottom:26 }}>
            <div style={{ fontSize:26, fontWeight:800, letterSpacing:'-0.02em' }}>Welcome back, {client.contact.split(' ')[0]} 👋</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.32)', marginTop:6 }}>Here's your overview for March 2026</div>
          </div>
          <div style={{ ...glass, background:`linear-gradient(135deg, ${accent}18 0%, rgba(255,255,255,0.04) 60%)`, border:`1px solid ${accent}35`, padding:'28px 32px', marginBottom:22 }}>
            <div style={{ display:'flex', alignItems:'center', gap:40, flexWrap:'wrap' }}>
              <div>
                <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', marginBottom:10 }}>Direct Bookings This Month</div>
                <div style={{ display:'flex', alignItems:'flex-end', gap:14 }}>
                  <AnimatedNumber target={client.directBookings} suffix="%" color={accent} fontSize={64} duration={2000}/>
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:SUCCESS }}>↑ +{directChange}% vs last month</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:3 }}>Was {client.directLast}% in February</div>
                  </div>
                </div>
              </div>
              <div style={{ flex:1, minWidth:180 }}>
                <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:8 }}>6-Month Trend</div>
                <AnimatedSparkline points={client.directTrend} color={accent} height={52}/>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:'rgba(255,255,255,0.2)', marginTop:4 }}>
                  {['OCT','NOV','DEC','JAN','FEB','MAR'].map(m=><span key={m}>{m}</span>)}
                </div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:10 }}>Est. Commission Saved</div>
                <AnimatedNumber target={client.commissionSaved} prefix="$" color={SUCCESS} fontSize={34} duration={2200}/>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:4 }}>this month</div>
              </div>
            </div>
          </div>
          <div className="client-kpi-grid">
            {[
              { label:'Content Delivered', value:client.contentDelivered, suffix:'',  color:'#fff',    sub:`of ${client.contentPlanned} planned` },
              { label:'Avg Views / Content', value:Math.round(client.avgViews/100)/10, suffix:'K', color:accent, sub:'across all platforms' },
              { label:'Website Sessions',  value:client.websiteTraffic,    suffix:'',  color:'#fff',    sub:`↑ +${trafficChange}% vs last month` },
              { label:'Commission Saved',  value:client.commissionSaved,   prefix:'$', color:SUCCESS,   sub:'vs full OTA dependency' },
            ].map((k,i) => (
              <div key={i} style={{ ...glass, padding:20 }}>
                <div style={{ fontSize:10, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:12 }}>{k.label}</div>
                <AnimatedNumber target={k.value} prefix={k.prefix||''} suffix={k.suffix} color={k.color} fontSize={32} duration={1400+i*100}/>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:8 }}>{k.sub}</div>
              </div>
            ))}
          </div>
          <div className="client-two-col">
            <div style={{ ...glass, background:`linear-gradient(135deg, ${accent}0F 0%, rgba(255,255,255,0.03) 100%)`, border:`1px solid ${accent}28`, padding:24 }}>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:accent, marginBottom:16 }}>Next Shoot</div>
              <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:18 }}>
                <div>
                  <div style={{ fontSize:52, fontWeight:800, color:accent, letterSpacing:'-0.03em', lineHeight:1 }}>{client.nextShoot.replace('Mar ','')}</div>
                  <div style={{ fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.5)', letterSpacing:'0.06em' }}>MARCH</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginBottom:6 }}>{client.shootTime}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginBottom:12 }}>📍 {client.shootLocation}</div>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:`${accent}18`, border:`1px solid ${accent}28`, borderRadius:10, padding:'5px 12px', fontSize:11, fontWeight:600, color:accent }}>
                    ⏱ {client.daysUntil} days away
                  </div>
                </div>
              </div>
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:14 }}>
                {client.shootDeliverables.map((d,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'rgba(255,255,255,0.7)', marginBottom:6 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:accent, flexShrink:0 }}/>{d}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ ...glass, overflow:'hidden' }}>
              <div style={{ padding:'16px 22px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.7)' }}>Invoice History</span>
              </div>
              {invoices.slice(0,3).map((inv,i) => (
                <div key={inv.id} style={{ display:'flex', alignItems:'center', padding:'14px 22px', borderBottom:i<2?'1px solid rgba(255,255,255,0.04)':'none' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>{inv.issueDate}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{inv.number}</div>
                  </div>
                  <div style={{ fontSize:16, fontWeight:700, marginRight:14 }}>${inv.amount.toLocaleString()}</div>
                  <StatusBadge status={inv.status}/>
                </div>
              ))}
              <div style={{ padding:'14px 22px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={() => setTab('invoices')}
                  style={{ width:'100%', background:`linear-gradient(145deg, ${accent}, ${accent}bb)`, border:'none', color:'#fff', padding:10, borderRadius:12, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:FONT, boxShadow:`0 4px 16px ${accent}40` }}
                >
                  View All Invoices →
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CONTENT */}
      {tab === 'content' && (
        <>
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:24, fontWeight:800, letterSpacing:'-0.02em' }}>Content Library</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.32)', marginTop:6 }}>{content.length} pieces delivered · {client.name}</div>
          </div>
          <div style={{ ...glass, overflow:'hidden' }}>
            <div className="client-content-grid">
              {content.map((v) => (
                <div key={v.id} style={{ borderRadius:16, overflow:'hidden', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', cursor:'pointer' }}>
                  <div style={{ aspectRatio:'16/9', background:`linear-gradient(135deg, ${accent}12, rgba(255,255,255,0.02))`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                    <span style={{ fontSize:26, opacity:0.12 }}>▶</span>
                    <span style={{ position:'absolute', top:8, left:8, background:accent, color:'#fff', fontSize:7, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', padding:'3px 8px', borderRadius:7 }}>{v.tag}</span>
                    {v.hot && <span style={{ position:'absolute', top:8, right:8, background:`${accent}25`, color:accent, fontSize:9, fontWeight:600, padding:'3px 7px', borderRadius:7 }}>🔥</span>}
                  </div>
                  <div style={{ padding:'12px 14px' }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', marginBottom:5 }}>{v.title}</div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:10 }}>
                      <span style={{ color:'rgba(255,255,255,0.3)' }}>{v.date}</span>
                      <span style={{ color:v.hot?accent:'rgba(255,255,255,0.3)', fontWeight:600 }}>{v.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* PERFORMANCE */}
      {tab === 'performance' && (
        <>
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:24, fontWeight:800, letterSpacing:'-0.02em' }}>Performance</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.32)', marginTop:6 }}>Booking trends & traffic · {client.name}</div>
          </div>
          <div className="perf-grid">
            {[
              { label:'Direct Bookings', value:client.directBookings, suffix:'%', color:accent, trend:client.directTrend, sub:`↑ +${directChange}% vs last month` },
              { label:'Website Sessions', value:client.websiteTraffic, suffix:'', color:SUCCESS, trend:client.trafficTrend, sub:`↑ +${trafficChange}% vs last month` },
              { label:'OTA Dependency', value:100-client.directBookings, suffix:'%', color:WARNING, trend:client.otaTrend, sub:'decreasing — good trend' },
            ].map((k,i) => (
              <div key={i} style={{ ...glass, padding:24 }}>
                <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:10 }}>{k.label}</div>
                <AnimatedNumber target={k.value} suffix={k.suffix} color={k.color} fontSize={40} duration={1600+i*200}/>
                <div style={{ margin:'16px 0 8px' }}>
                  <AnimatedSparkline points={k.trend} color={k.color} height={60}/>
                </div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:8 }}>{k.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ ...glass, padding:24 }}>
            <div style={{ fontSize:12, fontWeight:700, marginBottom:16 }}>Direct vs OTA — 6 Month Breakdown</div>
            {client.directTrend.map((val, i) => {
              const months = ['Oct','Nov','Dec','Jan','Feb','Mar'];
              return (
                <div key={i} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <span style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>{months[i]}</span>
                    <span style={{ fontSize:11, fontWeight:600, color:accent }}>{val}% direct</span>
                  </div>
                  <AnimatedBar value={val} color={accent} height={6} delay={i*80}/>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* SHOOTS */}
      {tab === 'shoots' && (
        <>
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:24, fontWeight:800, letterSpacing:'-0.02em' }}>Shoot Schedule</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.32)', marginTop:6 }}>{client.name}</div>
          </div>
          <div style={{ ...glass, background:`linear-gradient(135deg, ${accent}0F 0%, rgba(255,255,255,0.03) 100%)`, border:`1px solid ${accent}28`, padding:32, marginBottom:20 }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:accent, marginBottom:20 }}>Next Scheduled Shoot</div>
            <div style={{ display:'flex', alignItems:'center', gap:32, flexWrap:'wrap' }}>
              <div>
                <div style={{ fontSize:80, fontWeight:800, color:accent, letterSpacing:'-0.04em', lineHeight:1 }}>{client.nextShoot.replace('Mar ','')}</div>
                <div style={{ fontSize:16, fontWeight:600, color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em', marginTop:4 }}>MARCH 2026</div>
              </div>
              <div style={{ flex:1, minWidth:200 }}>
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.08em' }}>Time</div>
                  <div style={{ fontSize:16, fontWeight:600 }}>{client.shootTime}</div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.08em' }}>Location</div>
                  <div style={{ fontSize:16, fontWeight:600 }}>📍 {client.shootLocation}</div>
                </div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`${accent}20`, border:`1px solid ${accent}40`, borderRadius:12, padding:'8px 16px', fontSize:13, fontWeight:700, color:accent }}>
                  ⏱ {client.daysUntil} days away
                </div>
              </div>
            </div>
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', marginTop:24, paddingTop:20 }}>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:14 }}>Deliverables This Shoot</div>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {client.shootDeliverables.map((d,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:10, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', fontSize:12, color:'rgba(255,255,255,0.8)' }}>
                    <span style={{ width:7, height:7, borderRadius:'50%', background:accent }}/>{d}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ ...glass, padding:24 }}>
            <div style={{ fontSize:12, fontWeight:700, marginBottom:16 }}>Content Delivered This Month</div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>Progress</span>
              <span style={{ fontSize:13, fontWeight:700, color:accent }}>{client.contentDelivered} / {client.contentPlanned} pieces</span>
            </div>
            <AnimatedBar value={Math.round((client.contentDelivered/client.contentPlanned)*100)} color={accent} height={8}/>
          </div>
        </>
      )}

      {/* INVOICES */}
      {tab === 'invoices' && (
        <>
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:24, fontWeight:800, letterSpacing:'-0.02em' }}>Invoices</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.32)', marginTop:6 }}>{client.name} · Billing history</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:22 }}>
            {[
              { label:'Total Paid',    value:invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount,0),    prefix:'$', color:SUCCESS },
              { label:'Outstanding',   value:invoices.filter(i=>i.status==='pending').reduce((s,i)=>s+i.amount,0), prefix:'$', color:WARNING },
              { label:'Overdue',       value:invoices.filter(i=>i.status==='overdue').reduce((s,i)=>s+i.amount,0), prefix:'$', color:CORAL },
            ].map((k,i) => (
              <div key={i} style={{ ...glass, padding:'18px 20px' }}>
                <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:10 }}>{k.label}</div>
                <AnimatedNumber target={k.value} prefix={k.prefix} color={k.color} fontSize={28}/>
              </div>
            ))}
          </div>
          <div style={{ ...glass, overflow:'hidden' }}>
            {invoices.map((inv, i) => (
              <InvoiceRow
                key={inv.id}
                inv={inv}
                client={client}
                accent={accent}
                isLast={i === invoices.length - 1}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
