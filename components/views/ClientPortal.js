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
              <div key={i} style={{ ...glass, padding:20
