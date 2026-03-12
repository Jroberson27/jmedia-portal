import { useState } from 'react';
import { CLIENTS, INVOICES } from '../../lib/data';
import { CORAL, SUCCESS, WARNING, INFO, glass, FONT } from '../../lib/design';
import AnimatedNumber from '../shared/AnimatedNumber';
import StatusBadge from '../shared/StatusBadge';

export default function BillingSystem() {
  const [invoices, setInvoices] = useState(INVOICES);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const markPaid = (id) => setInvoices(prev => prev.map(i => i.id===id ? {...i,status:'paid'} : i));
  const filtered = filter==='all' ? invoices : invoices.filter(i=>i.status===filter);
  const totalCollected = invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount,0);
  const outstanding = invoices.filter(i=>i.status!=='paid').reduce((s,i)=>s+i.amount,0);
  const mrr = Object.values(CLIENTS).reduce((s,c)=>s+c.retainer,0);

  return (
    <div style={{ color:'#fff', fontFamily:FONT }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <div style={{ fontSize:24, fontWeight:800, letterSpacing:'-0.02em' }}>Billing & Invoices</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.32)', marginTop:6 }}>Auto-billing active · Next run Apr 1, 2026</div>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', borderRadius:12, background:'rgba(76,175,80,0.1)', border:'1px solid rgba(76,175,80,0.25)', fontSize:11, fontWeight:600, color:SUCCESS }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:SUCCESS }}/>
            Auto-billing ON
          </div>
          <button style={{ background:`linear-gradient(145deg, ${CORAL}, #d45550)`, border:'none', color:'#fff', padding:'9px 20px', borderRadius:12, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:FONT }}>+ New Invoice</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {[
          { label:'Total Collected', value:totalCollected, prefix:'$', color:SUCCESS, icon:'💰' },
          { label:'Monthly Recurring', value:mrr, prefix:'$', color:CORAL, icon:'🔄' },
          { label:'Outstanding', value:outstanding, prefix:'$', color:WARNING, icon:'⏳' },
          { label:'Overdue', value:invoices.filter(i=>i.status==='overdue').reduce((s,i)=>s+i.amount,0), prefix:'$', color:CORAL, icon:'⚠️' },
        ].map((k,i)=>(
          <div key={i} style={{ ...glass, padding:'20px 22px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)' }}>{k.label}</div>
              <span style={{ fontSize:18 }}>{k.icon}</span>
            </div>
            <AnimatedNumber target={k.value} prefix={k.prefix} color={k.color} fontSize={28} duration={1600+i*100}/>
          </div>
        ))}
      </div>

      <div style={{ ...glass, overflow:'hidden' }}>
        <div style={{ padding:'16px 22px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)' }}>Invoice History</span>
          <div style={{ display:'flex', gap:6 }}>
            {['all','paid','pending','overdue'].map(f=>(
              <div key={f} onClick={()=>setFilter(f)} style={{ padding:'5px 12px', borderRadius:8, fontSize:10, fontWeight:600, cursor:'pointer', textTransform:'capitalize', background:filter===f?CORAL:'rgba(255,255,255,0.06)', color:filter===f?'#fff':'rgba(255,255,255,0.4)', border:filter===f?`1px solid ${CORAL}`:'1px solid rgba(255,255,255,0.08)' }}>{f}</div>
            ))}
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'120px 1fr 1fr 100px 110px 90px', padding:'10px 22px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          {['Invoice #','Client','Property','Amount','Due Date','Status'].map((h,i)=>(
            <div key={h} style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)', textAlign:i>=3?'right':'left' }}>{h}</div>
          ))}
        </div>
        {filtered.map((inv,i)=>(
          <div key={inv.id} onClick={()=>setSelected(selected?.id===inv.id?null:inv)} style={{ display:'grid', gridTemplateColumns:'120px 1fr 1fr 100px 110px 90px', padding:'16px 22px', cursor:'pointer', borderBottom:i<filtered.length-1?'1px solid rgba(255,255,255,0.04)':'none', background:selected?.id===inv.id?'rgba(255,255,255,0.03)':'transparent', transition:'background 0.15s' }}>
            <div style={{ fontSize:12, fontWeight:700, color:CORAL }}>{inv.number}</div>
            <div style={{ fontSize:12, fontWeight:600 }}>{inv.client}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)' }}>{inv.property}</div>
            <div style={{ fontSize:14, fontWeight:800, letterSpacing:'-0.02em', textAlign:'right' }}>${inv.amount.toLocaleString()}</div>
            <div style={{ fontSize:11, color:inv.status==='overdue'?CORAL:'rgba(255,255,255,0.4)', textAlign:'right', fontWeight:inv.status==='overdue'?700:400 }}>{inv.dueDate}</div>
            <div style={{ textAlign:'right' }}><StatusBadge status={inv.status}/></div>
          </div>
        ))}
        {selected&&(
          <div style={{ padding:'20px 22px', borderTop:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div style={{ fontSize:14, fontWeight:700 }}>{selected.number} — {selected.property}</div>
              {selected.status!=='paid'&&<button onClick={()=>markPaid(selected.id)} style={{ background:`linear-gradient(145deg, ${CORAL}, #d45550)`, border:'none', color:'#fff', padding:'8px 18px', borderRadius:10, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:FONT }}>Mark as Paid</button>}
            </div>
            {selected.lineItems.map((item,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:12 }}>
                <div><div style={{ color:'#fff', fontWeight:500 }}>{item.description}</div><div style={{ color:'rgba(255,255,255,0.3)', fontSize:10, marginTop:2 }}>{item.note}</div></div>
                <div style={{ fontWeight:700, color:'#fff' }}>${item.amount.toLocaleString()}</div>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'flex-end', marginTop:14, fontSize:18, fontWeight:800, color:CORAL }}>Total: ${selected.amount.toLocaleString()}</div>
          </div>
        )}
        <div style={{ padding:'14px 22px', borderTop:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{filtered.length} invoices</span>
          <span style={{ fontSize:14, fontWeight:800 }}>Total: <span style={{ color:CORAL }}>${filtered.reduce((s,i)=>s+i.amount,0).toLocaleString()}</span></span>
        </div>
      </div>
    </div>
  );
}