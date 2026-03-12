// Full animated Client Portal with tab routing
import { useState, useEffect } from 'react';
import { CLIENTS, CONTENT, INVOICES } from '../../lib/data';
import { CORAL, SUCCESS, WARNING, glass, FONT } from '../../lib/design';
import AnimatedNumber from '../shared/AnimatedNumber';
import AnimatedSparkline from '../shared/AnimatedSparkline';
import AnimatedBar from '../shared/AnimatedBar';
import StatusBadge from '../shared/StatusBadge';

export default function ClientPortal({ clientId, defaultTab='dashboard' }) {
  const client = CLIENTS[clientId] || CLIENTS.vinoy;
  const content = CONTENT.filter(c => c.clientId === clientId);
  const invoices = INVOICES.filter(i => i.clientId === clientId);
  const accent = client.color;
  const directChange = Math.round(((client.directBookings - client.directLast) / client.directLast) * 100);
  const trafficChange = Math.round(((client.websiteTraffic - client.websiteTrafficLast) / client.websiteTrafficLast) * 100);

  return (
    <div style={{ color:'#fff', fontFamily:FONT }}>
      {/* Welcome */}
      <div style={{ marginBottom:26 }}>
        <div style={{ fontSize:26, fontWeight:800, letterSpacing:'-0.02em' }}>Welcome back, {client.contact.split(' ')[0]} 👋</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.32)', marginTop:6 }}>Here's your overview for March 2026</div>
      </div>

      {/* Hero */}
      <div style={{ ...glass, background:`linear-gradient(135deg, ${accent}18 0%, rgba(255,255,255,0.04) 60%)`, border:`1px solid ${accent}35`, padding:'28px 32px', marginBottom:22, display:'flex', alignItems:'center', gap:40 }}>
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
        <div style={{ width:1, height:70, background:'rgba(255,255,255,0.08)', flexShrink:0 }}/>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:8 }}>6-Month Trend</div>
          <AnimatedSparkline points={client.directTrend} color={accent} height={52}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:'rgba(255,255,255,0.2)', marginTop:4, letterSpacing:'0.06em' }}>
            {['OCT','NOV','DEC','JAN','FEB','MAR'].map(m=><span key={m}>{m}</span>)}
          </div>
        </div>
        <div style={{ width:1, height:70, background:'rgba(255,255,255,0.08)', flexShrink:0 }}/>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:10 }}>Est. Commission Saved</div>
          <AnimatedNumber target={client.commissionSaved} prefix="$" color={SUCCESS} fontSize={34} duration={2200}/>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:4 }}>this month</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:22 }}>
        {[
          { label:'Content Delivered', value:client.contentDelivered, suffix:'', color:'#fff', sub:`of ${client.contentPlanned} planned` },
          { label:'Avg Views / Content', value:Math.round(client.avgViews/1000*10)/10, suffix:'K', color:accent, sub:'across all platforms' },
          { label:'Website Sessions', value:client.websiteTraffic, suffix:'', color:'#fff', sub:`↑ +${trafficChange}% vs last month` },
          { label:'Commission Saved', value:client.commissionSaved, prefix:'$', color:SUCCESS, sub:'vs full OTA dependency' },
        ].map((k,i) => (
          <div key={i} style={{ ...glass, padding:20 }}>
            <div style={{ fontSize:10, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:12 }}>{k.label}</div>
            <AnimatedNumber target={k.value} prefix={k.prefix||''} suffix={k.suffix} color={k.color} fontSize={32} duration={1400+i*100}/>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:8 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Next Shoot + Invoices */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, marginBottom:22 }}>
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
          <div style={{ padding:'16px 22px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
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

      {/* Content Library */}
      <div style={{ ...glass, overflow:'hidden' }}>
        <div style={{ padding:'16px 22px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.7)' }}>Your Content Library</span>
        </div>
        <div style={{ padding:22, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
          {content.slice(0,8).map((v,i) => (
            <div key={v.id} style={{ borderRadius:16, overflow:'hidden', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', opacity:1, transition:'border-color 0.2s', cursor:'pointer' }}>
              <div style={{ aspectRatio:'16/9', background:`linear-gradient(135deg, ${accent}12, rgba(255,255,255,0.02))`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                <span style={{ fontSize:26, opacity:0.12 }}>▶</span>
                <span style={{ position:'absolute', top:8, left:8, background:accent, color:'#fff', fontSize:7, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', padding:'3px 8px', borderRadius:7 }}>{v.tag}</span>
                {v.hot&&<span style={{ position:'absolute', top:8, right:8, background:`${accent}25`, color:accent, fontSize:9, fontWeight:600, padding:'3px 7px', borderRadius:7 }}>🔥</span>}
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
    </div>
  );
}