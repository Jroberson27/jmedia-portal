import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import { CORAL } from '../lib/design';
const ADMIN_NAV = [
  { group:'Overview', items:[
    { href:'/admin/dashboard', icon:'\u229E', label:'Dashboard' },
    { href:'/admin/gantt',     icon:'\uD83D\uDCC5', label:'Timeline' },
    { href:'/admin/billing',   icon:'\uD83D\uDCB3', label:'Billing' },
  ]},
  { group:'Tools', items:[
    { href:'/admin/api-config', icon:'\uD83D\uDD0C', label:'API & Integrations' },
  ]},
];
const CLIENT_NAV = [
  { group:'My Portal', items:[
    { href:'/client/dashboard',   icon:'\u229E', label:'My Dashboard' },
    { href:'/client/content',     icon:'\uD83C\uDFAC', label:'Content Library' },
    { href:'/client/performance', icon:'\uD83D\uDCC8', label:'Performance' },
    { href:'/client/shoots',      icon:'\uD83D\uDCC5', label:'Shoot Schedule' },
    { href:'/client/invoices',    icon:'\uD83D\uDCB3', label:'Invoices' },
  ]},
];
export default function Layout({ children, title='JMEDIA Portal' }) {
  const { user, logout } = useAuth();
  const { brand } = useBrand();
  const router = useRouter();
  const isAdmin = user?.role === 'admin';
  const nav = isAdmin ? ADMIN_NAV : CLIENT_NAV;
  const accent = isAdmin ? CORAL : brand.primary;
  return (
    <div style={{ display:'flex', height:'100vh', background:'radial-gradient(ellipse at 20% 20%, #1c0c0b 0%, #0A0A0E 45%, #07070F 100%)', color:'#fff', overflow:'hidden', fontFamily:'Inter,sans-serif' }}>
      <div style={{ position:'fixed', top:-160, left:-100, width:500, height:500, borderRadius:'50%', background:`radial-gradient(circle, ${accent}0F 0%, transparent 70%)`, pointerEvents:'none', zIndex:0 }}/>
      <aside style={{ width:230, height:'100vh', flexShrink:0, zIndex:10, background:'rgba(255,255,255,0.035)', backdropFilter:'blur(50px)', WebkitBackdropFilter:'blur(50px)', borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'24px 20px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:16, background:`linear-gradient(145deg, ${accent}, ${accent}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, fontWeight:800, color:'#fff', flexShrink:0, boxShadow:`0 6px 24px ${accent}70` }}>J</div>
            <div>
              <div style={{ fontSize:15, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase' }}>JMEDIA</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.28)', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:3 }}>{isAdmin?'Admin':'Client Portal'}</div>
            </div>
          </div>
        </div>
        <nav style={{ flex:1, padding:'12px 0', overflowY:'auto' }}>
          {nav.map((g,gi)=>(
            <div key={gi} style={{ marginBottom:16 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)', padding:'0 20px 8px' }}>{g.group}</div>
              {g.items.map(item=>{
                const active=router.pathname===item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 20px', fontSize:13, fontWeight:active?600:400, cursor:'pointer', color:active?'#fff':'rgba(255,255,255,0.38)', background:active?`${accent}18`:'transparent', borderLeft:active?`3px solid ${accent}`:'3px solid transparent', borderRadius:active?'0 14px 14px 0':0, marginRight:10, transition:'all 0.2s' }}>
                      <span style={{ fontSize:15 }}>{item.icon}</span><span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:13, background:`linear-gradient(145deg, ${accent}, ${accent}99)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, flexShrink:0 }}>{user?.name?.[0]||'U'}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.28)' }}>{isAdmin?'Admin':'Client'}</div>
          </div>
          <div onClick={logout} style={{ fontSize:11, color:'rgba(255,255,255,0.3)', cursor:'pointer', padding:'5px 8px', borderRadius:7, background:'rgba(255,255,255,0.05)' }}>Out</div>
        </div>
      </aside>
      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0, position:'relative', zIndex:1 }}>
        <div style={{ height:62, flexShrink:0, background:'rgba(255,255,255,0.025)', backdropFilter:'blur(30px)', WebkitBackdropFilter:'blur(30px)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px' }}>
          <div style={{ fontSize:14, fontWeight:700 }}>{title}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', padding:'6px 14px', borderRadius:10 }}>March 2026</div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:28 }}>{children}</div>
      </main>
    </div>
  );
}