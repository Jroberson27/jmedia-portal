import { useState, useEffect } from 'react';
export default function AnimatedBar({ value, color, height=5, delay=0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t=setTimeout(()=>setWidth(value),delay+300); return ()=>clearTimeout(t); }, [value,delay]);
  return (
    <div style={{ height, background:'rgba(255,255,255,0.06)', borderRadius:10, overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${width}%`, borderRadius:10, background:`linear-gradient(90deg, ${color}, ${color}cc)`, transition:'width 1.4s cubic-bezier(0.34,1.56,0.64,1)', boxShadow:`0 0 12px ${color}80` }}/>
    </div>
  );
}