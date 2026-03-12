import { useState, useEffect } from 'react';
import { CLIENTS, CONTENT, INVOICES } from '../../lib/data';
import { CORAL, SUCCESS, WARNING, glass, FONT } from '../../lib/design';
import AnimatedNumber from '../shared/AnimatedNumber';
import AnimatedSparkline from '../shared/AnimatedSparkline';
import AnimatedBar from '../shared/AnimatedBar';
import StatusBadge from '../shared/StatusBadge';

export default function ClientPortal({ clientId, defaultTab = 'dashboard' }) {
  const [tab, setTab] = useState(defaultTab);
  const client = CLIENTS[clientId] || CLIENTS.vinoy;
  const content = CONTENT.filter(c => c.clientId === clientId);
  const invoices = INVOICES.filter(i => i.clientId === clientId);
  const accent = client.color;
  const directChange = Math.round(((client.directBookings - client.directLast) / client.directLast) * 100);
  const trafficChange = Math.round(((client.websiteTraffic - client.websiteTrafficLast) / client.websiteTrafficLast) * 100);

  // Sync tab when navigating via sidebar/bottom nav
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

      {/* ── DASHBOARD TAB ── */}
      {tab === 'dashboard' && (
        <>
          <div style={{ marginBottom:26 }}>
            <div style={{ fontSize:26, fontWeight:800, letterSpacing:'-0.02em' }}>Welcome back, {client.contact.split(' ')[0]} 👋</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.32)', marginTop:6 }}>Here's your overview for March 2026</div>
          </div>

          {/* Hero */}
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

          {/* KPI Cards */}
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

          {/* Next Shoot + Invoices */}
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
                <button style={{ width:'100%', background:`linear-gradient(145deg, ${accent}, ${accent}bb)`, border:'none', color:'#fff', padding:10, borderRadius:12, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:FONT, boxShadow:`0 4px 16px ${accent}40` }}>Pay Current Invoice →</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── CONTENT TAB ── */}
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

      {/* ── PERFORMANCE TAB ── */}
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

      {/* ── SHOOTS TAB ── */}
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

      {/* ── INVOICES TAB ── */}
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
            {invoices.map((inv,i) => (
              <div key={inv.id} style={{ padding:'18px 22px', borderBottom:i<invoices.length-1?'1px solid rgba(255,255,255,0.05)':'none' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700 }}>{inv.number}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:2 }}>{inv.issueDate} · Due {inv.dueDate}</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ fontSize:18, fontWeight:800 }}>${inv.amount.toLocaleString()}</div>
                    <StatusBadge status={inv.status}/>
                  </div>
                </div>
                {inv.status !== 'paid' && (
                  <button style={{ marginTop:10, background:`linear-gradient(145deg, ${accent}, ${accent}bb)`, border:'none', color:'#fff', padding:'8px 20px', borderRadius:10, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:FONT }}>Pay Now →</button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
