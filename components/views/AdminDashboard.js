import { useState } from 'react';
import { CLIENTS, INVOICES } from '../../lib/data';
import { CORAL, SUCCESS, WARNING, INFO, glass, FONT } from '../../lib/design';
import AnimatedNumber from '../shared/AnimatedNumber';
import AnimatedBar from '../shared/AnimatedBar';
import StatusBadge from '../shared/StatusBadge';

export default function AdminDashboard() {
  const clients = Object.values(CLIENTS);
  const mrr = clients.reduce((s,c) => s+c.retainer, 0);
  const expenses = 1200;
  const net = mrr - expenses;

  return (
    <div style={{ color:'#fff', fontFamily:FONT }}>
      <style>{`
        .admin-kpi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 22px; }
        .admin-stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 22px; }
        .admin-table-row { display: grid; grid-template-columns: 1fr 100px 120px 100px 80px 150px; align-items: center; padding: 16px 22px; gap: 8px; }
        .admin-table-head { display: grid; grid-template-columns: 1fr 100px 120px 100px 80px 150px; padding: 10px 22px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        @media (max-width: 768px) {
          .admin-kpi-grid { grid-template-columns: 1fr !important; }
          .admin-stat-grid { grid-template-columns: repeat(2,1fr) !important; }
          .admin-table-row { grid-template-columns: 1fr 1fr !important; }
          .admin-table-head { display: none !important; }
        }
      `}</style>

      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:26, fontWeight:800, letterSpacing:'-0.02em' }}>Welcome back, Jordan 👋</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.32)', marginTop:6 }}>JMEDIA Productions · March 2026</div>
      </div>

      {/* MRR Strip */}
      <div className="admin-kpi-grid">
        {[
          { label:'Monthly Recurring Revenue', value:mrr,      prefix:'$', color:CORAL,   sub:'across 3 active clients' },
          { label:'Total Expenses',             value:expenses, prefix:'$', color:WARNING, sub:'tools & subscriptions' },
          { label:'Net Profit',                 value:net,      prefix:'$', color:SUCCESS, sub:'this month' },
        ].map((k,i) => (
          <div key={i} style={{ ...glass, padding:'22px 24px' }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:10 }}>{k.label}</div>
            <AnimatedNumber target={k.value} prefix={k.prefix} color={k.color} fontSize={32} duration={1600+i*200}/>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:8 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="admin-stat-grid">
        {[
          { label:'Active Clients', value:3,  suffix:'',  color:'#fff',    sub:'all on retainer' },
          { label:'MRR Growth',     value:18, suffix:'%', color:SUCCESS,   sub:'month over month' },
          { label:'Avg Direct %',   value:55, suffix:'%', color:CORAL,     sub:'across all properties' },
          { label:'Content Pieces', value:33, suffix:'',  color:INFO,      sub:'delivered this month' },
        ].map((k,i)=>(
          <div key={i} style={{ ...glass, padding:'18px 20px' }}>
            <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:10 }}>{k.label}</div>
            <AnimatedNumber target={k.value} suffix={k.suffix} color={k.color} fontSize={28} duration={1400+i*100}/>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:6 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Client Health Table */}
      <div style={{ ...glass, overflow:'hidden' }}>
        <div style={{ padding:'16px 22px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)' }}>Active Client Health</span>
        </div>
        <div className="admin-table-head">
          {['Property','Retainer','Health','Next Shoot','Invoice','Direct Bookings'].map(h=>(
            <div key={h} style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)' }}>{h}</div>
          ))}
        </div>
        {clients.map((c,i) => (
          <div key={c.id} className="admin-table-row" style={{ borderBottom:i<clients.length-1?'1px solid rgba(255,255,255,0.04)':'none' }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700 }}>{c.name}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginTop:2 }}>{c.contact}</div>
            </div>
            <div style={{ fontSize:13, fontWeight:700 }}>${c.retainer.toLocaleString()}<span style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:400 }}>/mo</span></div>
            <StatusBadge status={c.health}/>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>{c.nextShoot}</div>
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
