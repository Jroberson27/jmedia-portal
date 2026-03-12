import { useSparklineProgress } from '../../lib/hooks';
export default function AnimatedSparkline({ points, color, height=52, delay=0 }) {
  const progress = useSparklineProgress(delay);
  const w=160, h=height;
  const max=Math.max(...points), min=Math.min(...points), range=max-min||1;
  const step=w/(points.length-1);
  const toY=p=>h-((p-min)/range)*(h-8)-4;
  const count=Math.max(2,Math.ceil(progress*points.length));
  const visible=points.slice(0,count);
  const coords=visible.map((p,i)=>`${i*step},${toY(p)}`).join(' ');
  const fill=coords+` ${(count-1)*step},${h} 0,${h}`;
  const lx=(count-1)*step, ly=toY(visible[visible.length-1]);
  const id=`sg_${color.replace('#','')}`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{overflow:'visible'}}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.35"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      {count>1&&<><polygon points={fill} fill={`url(#${id})`}/><polyline points={coords} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" style={{filter:`drop-shadow(0 0 5px ${color})`}}/><circle cx={lx} cy={ly} r="4" fill={color} style={{filter:`drop-shadow(0 0 8px ${color})`}}><animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite"/></circle></>}
    </svg>
  );
}