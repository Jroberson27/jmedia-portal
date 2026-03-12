const MAP = {
  paid:      {color:'#4CAF50',label:'\u2713 Paid',      bg:'rgba(76,175,80,0.15)'},
  pending:   {color:'#FFA500',label:'\u23F3 Pending',   bg:'rgba(255,165,0,0.15)'},
  overdue:   {color:'#E8625A',label:'\u26A0 Overdue',   bg:'rgba(232,98,90,0.15)'},
  draft:     {color:'rgba(255,255,255,0.35)',label:'\u25CB Draft',bg:'rgba(255,255,255,0.06)'},
  'On Track':{color:'#4CAF50',label:'\u25CF On Track',  bg:'rgba(76,175,80,0.12)'},
  'Attention':{color:'#FFA500',label:'\u26A0 Attention',bg:'rgba(255,165,0,0.12)'},
};
export default function StatusBadge({ status }) {
  const s = MAP[status]||MAP.draft;
  return <span style={{ padding:'5px 12px', borderRadius:10, fontSize:10, fontWeight:700, background:s.bg, color:s.color, border:`1px solid ${s.color}30`, whiteSpace:'nowrap' }}>{s.label}</span>;
}