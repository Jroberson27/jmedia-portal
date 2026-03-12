import { useState } from 'react';
import { PMS_SYSTEMS } from '../../lib/data';
import { CORAL, SUCCESS, WARNING, INFO, glass, FONT } from '../../lib/design';

export default function APIConfig() {
  const [connected, setConnected] = useState(new Set(['cloudbeds']));
  const [domain, setDomain] = useState('');
  const [fetching, setFetching] = useState(false);
  const [brand, setBrand] = useState(null);
  const [activeTab, setActiveTab] = useState('pms');

  const detectBrand = async () => {
    if (!domain) return;
    setFetching(true); setBrand(null);
    try {
      const r = await fetch(`/api/brand?domain=${encodeURIComponent(domain)}`);
      setBrand(await r.json());
    } catch { setBrand({ name:domain, primary:'#333', secondary:'#666', font:null }); }
    setFetching(false);
  };

  const tabs = [
    { id:'pms',      label:'PMS Integrations', icon:'🔌' },
    { id:'api',      label:'API Reference',     icon:'⚡' },
    { id:'brand',    label:'Brand Detection',   icon:'🎨' },
  ];

  return (
    <div style={{ color:'#fff', fontFamily:FONT }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:24, fontWeight:800, letterSpacing:'-0.02em' }}>API & Integrations</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.32)', marginTop:6 }}>PMS connectivity, open API, and brand auto-detection</div>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:24 }}>
        {tabs.map(t=>(
          <div key={t.id} onClick={()=>setActiveTab(t.id)} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:12, cursor:'pointer', fontSize:12, fontWeight:activeTab===t.id?700:500, background:activeTab===t.id?`${CORAL}18`:'rgba(255,255,255,0.05)', border:activeTab===t.id?`1px solid ${CORAL}50`:'1px solid rgba(255,255,255,0.08)', color:activeTab===t.id?'#fff':'rgba(255,255,255,0.45)' }}>
            <span>{t.icon}</span>{t.label}
          </div>
        ))}
      </div>

      {activeTab==='pms'&&(
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
          {PMS_SYSTEMS.map(pms=>(
            <div key={pms.id} style={{ ...glass, padding:20, border:connected.has(pms.id)?`1px solid ${SUCCESS}40`:'1px solid rgba(255,255,255,0.1)', background:connected.has(pms.id)?'rgba(76,175,80,0.05)':'rgba(255,255,255,0.04)' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:22 }}>{pms.icon}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700 }}>{pms.name}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginTop:1 }}>{pms.vendor} · {pms.tier}</div>
                  </div>
                </div>
                {connected.has(pms.id)
                  ? <span style={{ padding:'4px 10px', borderRadius:8, fontSize:9, fontWeight:700, background:'rgba(76,175,80,0.15)', color:SUCCESS, border:`1px solid ${SUCCESS}30` }}>● Connected</span>
                  : <span style={{ padding:'4px 10px', borderRadius:8, fontSize:9, fontWeight:700, background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.1)' }}>Available</span>
                }
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', marginBottom:12, lineHeight:1.5 }}>{pms.description}</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:12 }}>
                {pms.dataPoints.slice(0,4).map(dp=>(
                  <span key={dp} style={{ padding:'3px 8px', borderRadius:6, fontSize:9, fontWeight:600, background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.08)' }}>{dp}</span>
                ))}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>{pms.authType}</span>
                <button onClick={()=>setConnected(prev=>{ const n=new Set(prev); n.has(pms.id)?n.delete(pms.id):n.add(pms.id); return n; })} style={{ padding:'5px 14px', borderRadius:8, fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:FONT, border:'none', background:connected.has(pms.id)?'rgba(255,255,255,0.08)':`linear-gradient(145deg, ${CORAL}, #d45550)`, color:connected.has(pms.id)?'rgba(255,255,255,0.5)':'#fff' }}>
                  {connected.has(pms.id)?'Disconnect':'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab==='api'&&(
        <div>
          <div style={{ ...glass, overflow:'hidden', marginBottom:18 }}>
            <div style={{ padding:'16px 22px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)' }}>Base URL</span>
              <span style={{ fontFamily:'monospace', fontSize:13, color:CORAL, fontWeight:600 }}>https://api.jmediaproductions.com/v1</span>
            </div>
          </div>
          <div style={{ ...glass, overflow:'hidden' }}>
            {[
              { method:'GET',  path:'/api/v1/clients/:id/metrics',  desc:'Live booking metrics, OTA split, revenue', color:SUCCESS },
              { method:'POST', path:'/api/v1/webhooks/pms',          desc:'Inbound PMS booking events',               color:INFO },
              { method:'GET',  path:'/api/v1/clients/:id/content',   desc:'Delivered content library',                color:SUCCESS },
              { method:'GET',  path:'/api/v1/clients/:id/invoices',  desc:'Invoice history & payment status',         color:SUCCESS },
              { method:'POST', path:'/api/v1/clients/:id/brand',     desc:'Update brand config (colors, fonts, logo)',color:INFO },
              { method:'GET',  path:'/api/v1/clients/:id/timeline',  desc:'Project timeline & Gantt data',            color:SUCCESS },
            ].map((ep,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 22px', borderBottom:i<5?'1px solid rgba(255,255,255,0.04)':'none' }}>
                <span style={{ width:50, padding:'3px 0', borderRadius:6, fontSize:10, fontWeight:800, color:ep.color, textAlign:'center', background:`${ep.color}15`, border:`1px solid ${ep.color}30`, flexShrink:0 }}>{ep.method}</span>
                <code style={{ flex:1, fontSize:12, color:'#fff', fontFamily:'monospace' }}>{ep.path}</code>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', flex:1 }}>{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab==='brand'&&(
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          <div style={{ ...glass, padding:24 }}>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:8 }}>Auto-Detection via Brandfetch</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', lineHeight:1.6, marginBottom:18 }}>Enter a hotel domain to auto-pull their logo, brand colors, and font. Pre-fills the client portal on first login.</div>
            <div style={{ display:'flex', gap:10, marginBottom:14 }}>
              <input value={domain} onChange={e=>setDomain(e.target.value)} onKeyDown={e=>e.key==='Enter'&&detectBrand()} placeholder="e.g. vinoyrenaissance.com" style={{ flex:1, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, padding:'10px 14px', fontSize:12, color:'#fff', fontFamily:FONT, outline:'none' }}/>
              <button onClick={detectBrand} style={{ background:`linear-gradient(145deg, ${CORAL}, #d45550)`, border:'none', color:'#fff', padding:'10px 20px', borderRadius:12, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:FONT, whiteSpace:'nowrap' }}>{fetching?'Fetching...':'Detect →'}</button>
            </div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)' }}>Try: vinoyrenaissance.com · biltmorehotel.com · surfcomber.com</div>
            {brand&&!fetching&&(
              <div style={{ marginTop:16, borderRadius:14, overflow:'hidden', border:`1px solid ${brand.primary}40` }}>
                <div style={{ background:brand.primary, padding:'14px 18px', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:10, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'#fff' }}>{brand.name?.[0]}</div>
                  <div style={{ fontSize:14, fontWeight:800, color:'#fff' }}>{brand.name}</div>
                </div>
                <div style={{ padding:'14px 18px', background:'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>Detected colors</div>
                  <div style={{ display:'flex', gap:8 }}>
                    {[brand.primary, brand.secondary].filter(Boolean).map((c,i)=>(
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <div style={{ width:20, height:20, borderRadius:6, background:c, boxShadow:`0 0 8px ${c}60` }}/>
                        <span style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontFamily:'monospace' }}>{c}</span>
                      </div>
                    ))}
                  </div>
                  {brand.font&&<div style={{ marginTop:8, fontSize:11, color:'rgba(255,255,255,0.4)' }}>Font: <span style={{ color:brand.primary, fontWeight:600 }}>{brand.font}</span></div>}
                </div>
              </div>
            )}
          </div>
          <div style={{ ...glass, padding:22 }}>
            <div style={{ fontSize:12, fontWeight:700, marginBottom:14 }}>What Gets Themed Per Client</div>
            {[
              { label:'Primary accent color',  val:'--brand-primary',  desc:'Buttons, highlights, charts' },
              { label:'Secondary color',        val:'--brand-secondary',desc:'Hover states, badges' },
              { label:'Logo',                   val:'brand.logoUrl',    desc:'Sidebar, reports, invoices' },
              { label:'Font family',            val:'--brand-font',     desc:'All headings, client text' },
            ].map((t,i)=>(
              <div key={i} style={{ display:'flex', gap:14, padding:'10px 0', borderBottom:i<3?'1px solid rgba(255,255,255,0.05)':'none' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600 }}>{t.label}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{t.desc}</div>
                </div>
                <code style={{ fontSize:10, color:CORAL, fontFamily:'monospace', alignSelf:'center', background:`${CORAL}12`, padding:'3px 8px', borderRadius:6 }}>{t.val}</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}