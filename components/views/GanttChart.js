// Paste full GanttChart component from session
import { useState } from 'react';
import { GANTT, CLIENTS } from '../../lib/data';
import { CORAL, SUCCESS, WARNING, INFO, PURPLE, glass, FONT } from '../../lib/design';

const PHASES = {
  preproduction: { color:INFO,   label:'Pre-Production', icon:'📋' },
  production:    { color:CORAL,  label:'Production',      icon:'🎬' },
  postproduction:{ color:PURPLE, label:'Post-Production', icon:'✂️' },
  review:        { color:WARNING,label:'Client Review',   icon:'👁' },
  delivery:      { color:SUCCESS,label:'Delivery',        icon:'✅' },
};

export default function GanttChart() {
  const [activeClient, setActiveClient] = useState('vinoy');
  const [activeTask, setActiveTask] = useState(null);
  const clients = Object.values(CLIENTS);
  const tasks = GANTT[activeClient] || [];
  const TOTAL = 35, TODAY = 18;
  const completed = tasks.filter(t=>t.status==='completed').length;
  const progress = Math.round((completed/tasks.length)*100);

  return (
    <div style={{ color:'#fff', fontFamily:FONT }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:24, fontWeight:800, letterSpacing:'-0.02em' }}>Project Timeline</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.32)', marginTop:6 }}>March 2026 · Production phases, deliverables & review periods</div>
      </div>

      {/* Client selector */}
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        {clients.map(c=>(
          <div key={c.id} onClick={()=>setActiveClient(c.id)} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 18px', borderRadius:12, cursor:'pointer', transition:'all 0.2s', background:activeClient===c.id?`${c.color}18`:'rgba(255,255,255,0.04)', border:activeClient===c.id?`1px solid ${c.color}50`:'1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:activeClient===c.id?c.color:'rgba(255,255,255,0.2)', boxShadow:activeClient===c.id?`0 0 8px ${c.color}`:'none', transition:'all 0.2s' }}/>
            <span style={{ fontSize:12, fontWeight:activeClient===c.id?700:400, color:activeClient===c.id?'#fff':'rgba(255,255,255,0.45)' }}>{c.name}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[
          { label:'Progress',   value:`${progress}%`, color:CORAL,   sub:`${completed} of ${tasks.length} phases` },
          { label:'Completed',  value:completed,         color:SUCCESS, sub:'phases done' },
          { label:'Active',     value:tasks.filter(t=>t.status==='active').length,   color:INFO,    sub:'in progress' },
          { label:'Upcoming',   value:tasks.filter(t=>t.status==='upcoming').length, color:WARNING, sub:'ahead' },
        ].map((s,i)=>(
          <div key={i} style={{ ...glass, padding:'16px 18px' }}>
            <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:8 }}>{s.label}</div>
            <div style={{ fontSize:26, fontWeight:800, color:s.color, letterSpacing:'-0.02em' }}>{s.value}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:5 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Gantt */}
      <div style={{ ...glass, overflow:'hidden' }}>
        <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width:220, flexShrink:0, padding:'12px 20px', fontSize:9, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)', borderRight:'1px solid rgba(255,255,255,0.06)' }}>Task</div>
          <div style={{ flex:1, padding:'12px 16px', display:'flex', justifyContent:'space-between' }}>
            {['Mar 1','Mar 6','Mar 11','Mar 16','Mar 21','Mar 26','Mar 31'].map(d=>(
              <span key={d} style={{ fontSize:9, fontWeight:600, color:'rgba(255,255,255,0.2)', letterSpacing:'0.06em' }}>{d}</span>
            ))}
          </div>
        </div>
        {tasks.map((task,i)=>{
          const phase = PHASES[task.phase];
          const left = (task.start/TOTAL)*100;
          const width = (task.duration/TOTAL)*100;
          const todayPct = (TODAY/TOTAL)*100;
          return (
            <div key={task.id} onClick={()=>setActiveTask(activeTask?.id===task.id?null:task)} style={{ display:'flex', borderBottom:i<tasks.length-1?'1px solid rgba(255,255,255,0.04)':'none', cursor:'pointer' }}>
              <div style={{ width:220, flexShrink:0, padding:'14px 20px', borderRight:'1px solid rgba(255,255,255,0.04)', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:13 }}>{phase.icon}</span>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:task.status==='upcoming'?'rgba(255,255,255,0.45)':'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{task.name}</div>
                  <div style={{ fontSize:9, color:phase.color, fontWeight:600, marginTop:2 }}>{phase.label}</div>
                </div>
              </div>
              <div style={{ flex:1, position:'relative', height:54, display:'flex', alignItems:'center', padding:'0 8px' }}>
                {/* Today line */}
                <div style={{ position:'absolute', left:`${todayPct}%`, top:0, bottom:0, width:2, background:CORAL, zIndex:5 }}>
                  <div style={{ position:'absolute', top:-5, left:'50%', transform:'translateX(-50%)', background:CORAL, color:'#fff', fontSize:7, fontWeight:800, padding:'2px 5px', borderRadius:4, whiteSpace:'nowrap' }}>TODAY</div>
                </div>
                {/* Bar */}
                <div style={{ position:'absolute', left:`${left}%`, width:`${width}%`, height:28, borderRadius:8, background:task.status==='upcoming'?`${phase.color}55`:phase.color, display:'flex', alignItems:'center', paddingLeft:10, overflow:'hidden', boxShadow:task.status==='active'?`0 0 12px ${phase.color}60`:'none', border:activeTask?.id===task.id?`2px solid rgba(255,255,255,0.8)`:'none' }}>
                  {task.status==='active'&&<span style={{ width:6, height:6, borderRadius:'50%', background:'#fff', marginRight:6, flexShrink:0 }}/>}
                  {task.status==='completed'&&<span style={{ fontSize:10, marginRight:5 }}>✓</span>}
                  <span style={{ fontSize:10, fontWeight:600, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{task.name}</span>
                </div>
              </div>
              <div style={{ width:50, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:600, color:'rgba(255,255,255,0.25)', borderLeft:'1px solid rgba(255,255,255,0.04)' }}>{task.duration}d</div>
            </div>
          );
        })}
      </div>

      {/* Task detail */}
      {activeTask&&(
        <div style={{ ...glass, padding:24, marginTop:16, border:`1px solid ${PHASES[activeTask.phase].color}40` }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:14 }}>
            <span style={{ fontSize:22 }}>{PHASES[activeTask.phase].icon}</span>
            <div>
              <div style={{ fontSize:16, fontWeight:700 }}>{activeTask.name}</div>
              <div style={{ fontSize:11, color:PHASES[activeTask.phase].color, fontWeight:600, marginTop:2 }}>{activeTask.startDate} — {activeTask.endDate} · {activeTask.duration} days · {activeTask.assignee}</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {activeTask.deliverables.map((d,i)=>(
              <span key={i} style={{ padding:'5px 12px', borderRadius:8, fontSize:11, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)' }}>{d}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}