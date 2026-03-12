import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import { CORAL } from '../lib/design';

const ADMIN_NAV = [
  { href:'/admin/dashboard',  icon:'⊞',  label:'Dashboard' },
  { href:'/admin/gantt',      icon:'📅', label:'Timeline' },
  { href:'/admin/billing',    icon:'💳', label:'Billing' },
  { href:'/admin/api-config', icon:'🔌', label:'API' },
];
const CLIENT_NAV = [
  { href:'/client/dashboard',   icon:'⊞',  label:'Home' },
  { href:'/client/content',     icon:'🎬', label:'Content' },
  { href:'/client/performance', icon:'📈', label:'Stats' },
  { href:'/client/shoots',      icon:'📅', label:'Shoots' },
  { href:'/client/invoices',    icon:'💳', label:'Invoices' },
];

export default function Layout({ children, title = 'JMEDIA Portal' }) {
  const { user, logout } = useAuth();
  const { brand } = useBrand();
  const router = useRouter();
  const isAdmin = user?.role === 'admin';
  const nav = isAdmin ? ADMIN_NAV : CLIENT_NAV;
  const accent = isAdmin ? CORAL : brand.primary;

  return (
    <div style={{ display:'flex', height:'100vh', background:'radial-gradient(ellipse at 20% 20%, #1c0c0b 0%, #0A0A0E 45%, #07070F 100%)', color:'#fff', overflow:'hidden', fontFamily:'Inter,sans-serif' }}>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside style={{ width:230, height:'100vh', flexShrink:0, zIndex:10, background:'rgba(255,255,255,0.035)', backdropFilter:'blur(50px)', borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column' }}
        className="desktop-sidebar">
        <div style={{ padding:'24px 20px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:16, background:`linear-gradient(145deg, ${accent}, ${accent}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, fontWeight:800, color:'#fff', flexShrink:0, boxShadow:`0 6px 24px ${accent}70` }}>J</div>
            <div>
              <div style={{ fontSize:15, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase' }}>JMEDIA</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.28)', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:3 }}>{isAdmin ? 'Admin' : 'Client Portal'}</div>
            </div>
          </div>
        </div>
        <nav style={{ flex:1, padding:'12px 0', overflowY:'auto' }}>
          {nav.map((item, i) => {
            const active = router.pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 20px', fontSize:13, fontWeight:active?600:400, cursor:'pointer', color:active?'#fff':'rgba(255,255,255,0.38)', background:active?`${accent}18`:'transparent', borderLeft:active?`3px solid ${accent}`:'3px solid transparent', borderRadius:active?'0 14px 14px 0':0, marginRight:10, transition:'all 0.2s' }}>
                  <span style={{ fontSize:15 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:13, background:`linear-gradient(145deg, ${accent}, ${accent}99)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, flexShrink:0 }}>{user?.name?.[0] || 'U'}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.28)' }}>{isAdmin ? 'Admin' : 'Client'}</div>
          </div>
          <div onClick={logout} style={{ fontSize:11, color:'rgba(255,255,255,0.3)', cursor:'pointer', padding:'5px 8px', borderRadius:7, background:'rgba(255,255,255,0.05)' }}>Out</div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0, position:'relative', zIndex:1 }}>

        {/* Top bar */}
        <div style={{ height:62, flexShrink:0, background:'rgba(255,255,255,0.025)', backdropFilter:'blur(30px)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:32, height:32, borderRadius:12, background:`linear-gradient(145deg, ${accent}, ${accent}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'#fff' }}>J</div>
            <div style={{ fontSize:14, fontWeight:700 }}>{title}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', padding:'6px 14px', borderRadius:10 }}>March 2026</div>
            <div onClick={logout} style={{ fontSize:11, color:'rgba(255,255,255,0.4)', cursor:'pointer', padding:'6px 12px', borderRadius:9, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }} className="mobile-logout">Out</div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex:1, overflowY:'auto', padding:24, paddingBottom:80 }}>
          {children}
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <div className="mobile-nav" style={{ display:'none', position:'fixed', bottom:0, left:0, right:0, height:64, background:'rgba(10,10,14,0.95)', backdropFilter:'blur(30px)', borderTop:'1px solid rgba(255,255,255,0.08)', zIndex:100, alignItems:'center', justifyContent:'space-around', padding:'0 8px' }}>
        {nav.map(item => {
          const active = router.pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'8px 12px', borderRadius:12, background:active?`${accent}18`:'transparent', minWidth:52 }}>
                <span style={{ fontSize:20 }}>{item.icon}</span>
                <span style={{ fontSize:9, fontWeight:active?700:400, color:active?accent:'rgba(255,255,255,0.35)', letterSpacing:'0.04em' }}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-logout { display: none !important; }
        }
      `}</style>
    </div>
  );
}
