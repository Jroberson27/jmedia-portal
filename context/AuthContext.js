import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(null);
const USERS = {
'info@j-mediaproductions.com':{ password:'Tench!468522477', role:'admin', name:'Jordan' },
  'maria@vinoy.com':             { password:'vinoy2026',  role:'client', name:'Maria Rodriguez', clientId:'vinoy' },
  'david@surfcomber.com':        { password:'surf2026',   role:'client', name:'David Kim',       clientId:'surfcomber' },
  'sandra@biltmore.com':         { password:'bilt2026',   role:'client', name:'Sandra Okafor',   clientId:'biltmore' },
};
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try { const s = sessionStorage.getItem('jmedia_user'); if (s) setUser(JSON.parse(s)); } catch {}
    setLoading(false);
  }, []);
  const login = (email, password) => {
    const match = USERS[email.toLowerCase()];
    if (!match || match.password !== password) return { error: 'Invalid credentials' };
    const u = { email, role:match.role, name:match.name, clientId:match.clientId||null };
    setUser(u);
    try { sessionStorage.setItem('jmedia_user', JSON.stringify(u)); } catch {}
    return { success:true, role:match.role };
  };
  const logout = () => { setUser(null); try { sessionStorage.removeItem('jmedia_user'); } catch {} };
  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
