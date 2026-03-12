import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
const CORAL = '#E8625A';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!authLoading && user) router.replace(user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard');
  }, [user, authLoading]);
  const handle = (e) => {
    e.preventDefault(); setLoading(true); setError('');
    const r = login(email, password);
    if (r.error) { setError(r.error); setLoading(false); return; }
    router.push(r.role === 'admin' ? '/admin/dashboard' : '/client/dashboard');
  };
  const inp = { width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:13, padding:'12px 16px', fontSize:13, color:'#fff', outline:'none', boxSizing:'border-box' };
  return (
    <div style={{ minHeight:'100vh', background:'radial-gradient(ellipse at 30% 30%, #1c0c0b 0%, #07070F 60%)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif' }}>
      <div style={{ width:420, padding:40, background:'rgba(255,255,255,0.055)', backdropFilter:'blur(30px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:24, color:'#fff' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:56, height:56, borderRadius:20, background:`linear-gradient(145deg, ${CORAL}, #c94d46)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:800, margin:'0 auto 14px', boxShadow:`0 8px 28px ${CORAL}50` }}>J</div>
          <div style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.02em' }}>JMEDIA Portal</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:5 }}>Sign in to your account</div>
        </div>
        <form onSubmit={handle}>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', display:'block', marginBottom:7 }}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="your@email.com" style={inp}/>
          </div>
          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', display:'block', marginBottom:7 }}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" style={inp}/>
          </div>
          {error && <div style={{ marginBottom:16, padding:'10px 14px', background:'rgba(232,98,90,0.15)', border:'1px solid rgba(232,98,90,0.3)', borderRadius:10, fontSize:12, color:CORAL }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width:'100%', background:`linear-gradient(145deg, ${CORAL}, #d45550)`, border:'none', color:'#fff', padding:13, borderRadius:13, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:`0 4px 20px ${CORAL}45` }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
        <div style={{ marginTop:24, padding:'14px 16px', background:'rgba(255,255,255,0.03)', borderRadius:12, border:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:8 }}>Demo Credentials</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', lineHeight:1.9 }}>
            <strong style={{ color:'rgba(255,255,255,0.6)' }}>Admin:</strong> jordan@jmediaproductions.com / jmedia2026<br/>
            <strong style={{ color:'rgba(255,255,255,0.6)' }}>Vinoy:</strong> maria@vinoy.com / vinoy2026<br/>
            <strong style={{ color:'rgba(255,255,255,0.6)' }}>Surfcomber:</strong> david@surfcomber.com / surf2026
          </div>
        </div>
      </div>
    </div>
  );
}