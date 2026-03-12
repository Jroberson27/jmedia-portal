// PASTE the complete AdminDashboard component from the session here
// It uses: CLIENTS, INVOICES from lib/data.js and design tokens from lib/design.js
import { useState } from 'react';
import { CLIENTS, INVOICES } from '../../lib/data';
import { CORAL, SUCCESS, WARNING, INFO, glass, FONT } from '../../lib/design';
import AnimatedNumber from '../shared/AnimatedNumber';
import AnimatedSparkline from '../shared/AnimatedSparkline';
import AnimatedBar from '../shared/AnimatedBar';
import StatusBadge from '../shared/StatusBadge';

export default function AdminDashboard() {
  const clients = Object.values(CLIENTS);
  const mrr = clients.reduce((s,c) => s+c.retainer, 0);
  const expenses = 1200;
  const net = mrr - expenses;

  return (
    <div style={{ color:'#fff', fontFamily:FONT }}>
      {/* MRR Strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:22 }}>
        {[
          { label:'Monthly Recurring Revenue', value:mrr,      prefix:'$', color:CORAL,   sub:'across 3 active clients' },
          { label:'Total Expenses',             value:expenses, prefix:'$', color:WARNING, sub:'tools, subscriptions' },
          { label:'Net Profit',                 value:net,      prefix:'$', color:SUCCESS, sub:'this month' },
        ].map((k,i) => (
          <div key={i} style={{ ...glass, padding:'22px 24px' }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:10 }}>{k.label}</div>
            <AnimatedNumber target={k.value} prefix={k.prefix} color={k.color} fontSize={32} duration={1600+i*200}/>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:8 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Client Health Table */}
      <div style={{ ...glass, overflow:'hidden' }}>
        <div style={{ padding:'16px 22px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)' }}>Active Client Health</span>
        </div>
        {clients.map((c,i) => (
          <div key={c.id} style={{ display:'grid', gridTemplateColumns:'1fr 100px 120px 100px 80px 120px', alignItems:'center', padding:'16px 22px', borderBottom:i<clients.length-1?'1px solid rgba(255,255,255,0.04)':'none', gap:16 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{c.name}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginTop:2 }}>{c.contact}</div>
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>${c.retainer.toLocaleString()}<span style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:400 }}>/mo</span></div>
            <StatusBadge status={c.health}/>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>Mar {c.nextShoot.replace('Mar ','')}</div>
            <StatusBadge status={c.invoiceStatus}/>
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:10, color:'rgba(255,255,255,0.35)' }}>Direct</span>
                <span style={{ fontSize:10, fontWeight:700, color:CORAL }}>{c.directBookings}%</span>
              </div>
              <AnimatedBar value={c.directBookings} color={CORAL} height={4} delay={i*100}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}