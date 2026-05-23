// @ts-nocheck 
// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const LOGO_URL = "https://althikr.edu.sa/wp-content/uploads/2025/03/DASC_Horizontal-Logo-EN-250x82-1.png";

const FRAMEWORKS = [
  "CCSS","Cambridge","IB","CELTA Style","5Es Model","SIOP",
  "Bloom's Taxonomy","UbD","Montessori","STEAM","General English",
  "Project-Based Learning","Competency-Based","Flipped Classroom"
];

const AGE_LEVELS = [
  { label:"Early Childhood", sub:"Ages 3–5", value:"early_childhood", emoji:"🌱" },
  { label:"Primary", sub:"Ages 6–11", value:"primary", emoji:"📚" },
  { label:"Middle School", sub:"Ages 12–14", value:"middle_school", emoji:"🔬" },
  { label:"High School", sub:"Ages 15–18", value:"high_school", emoji:"🎓" },
  { label:"Adult / Higher Ed", sub:"18+", value:"adult", emoji:"🏛️" },
  { label:"Mixed / Flexible", sub:"Open range", value:"mixed", emoji:"♾️" },
];

const GRADE_MAP = {
  early_childhood:["Pre-K","Kindergarten"],
  primary:["Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6"],
  middle_school:["Grade 7","Grade 8","Grade 9"],
  high_school:["Grade 10","Grade 11","Grade 12"],
  adult:["Undergraduate","Postgraduate","Professional","N/A"],
  mixed:["N/A"]
};

const G = {
  bg:"#f4f9f6", white:"#ffffff", primary:"#1a6b42", primaryLight:"#2e8b5a",
  accent:"#4db87a", accentLight:"#e8f5ee", text:"#0f2018", muted:"#5a7a68",
  border:"#cce4d8", surface:"#edf6f1", red:"#e05555",
};

const injectStyles = () => {
  if (document.getElementById("lc-styles")) return;
  const s = document.createElement("style");
  s.id = "lc-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    .fade{animation:fadeUp .3s ease both;}
    .msg{animation:msgIn .25s ease both;}
    ::-webkit-scrollbar{width:4px;}
    ::-webkit-scrollbar-thumb{background:#cce4d8;border-radius:2px;}
    textarea:focus,input:focus{outline:2px solid #4db87a;outline-offset:1px;}
  `;
  document.head.appendChild(s);
};

const API_URL = `${window.location.origin}/api/generate`;

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authTab, setAuthTab] = useState("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState("");

  const [screen, setScreen] = useState("home");
  const [mode, setMode] = useState(null);
  const [frameworks, setFrameworks] = useState([]);
  const [ageLevel, setAgeLevel] = useState(null);
  const [gradeLevel, setGradeLevel] = useState("");
  const [extraFiles, setExtraFiles] = useState([]);
  const [templateFile, setTemplateFile] = useState(null);
  const [credits, setCredits] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [adTimer, setAdTimer] = useState(null);
  const [adDone, setAdDone] = useState(false);
  const [history, setHistory] = useState([]);
  const [viewingHistory, setViewingHistory] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const chatEndRef = useRef();
  const extraRef = useRef();
  const templateRef = useRef();

  useEffect(() => {
    injectStyles();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (session?.user) loadProfile(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const loadProfile = async (userId) => {
    try {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
      if (data) {
        const weekMs = 7*24*60*60*1000;
        const resetAt = new Date(data.credits_reset_at).getTime();
        if (Date.now() - resetAt > weekMs) {
          await supabase.from("profiles").update({ credits:10, credits_reset_at: new Date().toISOString() }).eq("id", userId);
          setCredits(10);
        } else { setCredits(data.credits); }
      }
      // Load history from localStorage as backup
      const h = localStorage.getItem("lc_history");
      if (h) setHistory(JSON.parse(h));
    } catch {}
  };

  const saveCredits = async (n) => {
    setCredits(n);
    if (user) await supabase.from("profiles").update({ credits: n }).eq("id", user.id);
  };

  const saveToHistory = async (content, title) => {
    const entry = {
      id: Date.now(), date: new Date().toLocaleDateString(),
      frameworks: frameworks.join(", "),
      ageLevel: AGE_LEVELS.find(a=>a.value===ageLevel)?.label||"",
      gradeLevel, mode: mode===1?"Template":"Free Input",
      title: title||content.split("\n")[0].replace(/[#*]/g,"").trim().slice(0,60),
      content
    };
    const updated = [entry, ...history].slice(0,20);
    setHistory(updated);
    localStorage.setItem("lc_history", JSON.stringify(updated));
  };

  // AUTH
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(""); setAuthSubmitting(true); setAuthSuccess("");
    try {
      if (authTab==="signup") {
        const { error } = await supabase.auth.signUp({ email:authEmail, password:authPassword, options:{ data:{ full_name:authName } } });
        if (error) throw error;
        setAuthSuccess("Account created! Please check your email to verify.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email:authEmail, password:authPassword });
        if (error) throw error;
      }
    } catch(e) { setAuthError(e.message); }
    finally { setAuthSubmitting(false); }
  };

  const signOut = async () => { await supabase.auth.signOut(); setUser(null); setCredits(0); setHistory([]); };

  const watchAd = () => {
    if (adTimer!==null) return;
    setAdDone(false); setAdTimer(5);
    const t = setInterval(() => {
      setAdTimer(p => {
        if (p<=1) { clearInterval(t); setAdTimer(null); setAdDone(true); saveCredits(credits+1); return null; }
        return p-1;
      });
    }, 1000);
  };

  const toggleFw = fw => setFrameworks(p => p.includes(fw)?p.filter(f=>f!==fw):[...p,fw]);
  const readAsText = file => new Promise(res => { const r=new FileReader(); r.onload=e=>res(e.target.result); r.onerror=()=>res(`[${file.name}]`); r.readAsText(file); });

  const buildSystem = async (extraContent="") => {
    const fwStr = frameworks.length?frameworks.join(", "):"General curriculum";
    const ageInfo = AGE_LEVELS.find(a=>a.value===ageLevel);
    const ageStr = ageInfo?`${ageInfo.label} (${ageInfo.sub})`:"Not specified";
    const histCtx = history.slice(0,2).map((h,i)=>`Previous Plan ${i+1}: ${h.title} | ${h.frameworks} | ${h.ageLevel}`).join("\n");
    return `You are an expert lesson plan designer for Dar Al-Thikr School, Jeddah. Frameworks: ${fwStr}.
Student: Age ${ageStr} | Grade ${gradeLevel||"Not specified"} | Frameworks ${fwStr}
${extraContent?`\nReference:\n${extraContent}`:""}
${histCtx?`\nTeacher's previous plans:\n${histCtx}`:""}
Create thorough classroom-ready plans with ## headers. Be specific and practical.`;
  };

  const sendChat = async () => {
    if (!chatInput.trim()||isLoading) return;
    if (credits<=0) { setShowModal(true); return; }
    const userMsg = { role:"user", content:chatInput.trim(), ts:Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages); setChatInput(""); setIsLoading(true); setError("");
    try {
      let extra="";
      for (const f of extraFiles) { const t=await readAsText(f); extra+=`\n[${f.name}]\n${t.slice(0,1500)}`; }
      const sys = await buildSystem(extra);
      const isFirst = messages.length===0;
      const res = await fetch(API_URL, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system: sys+(isFirst?"\n\nCreate complete lesson plan with sections: ## Lesson Overview ## Learning Objectives ## Materials & Resources ## Lesson Sequence ## Assessment Strategies ## Differentiation & Inclusion ## Extension":"\n\nRefine based on teacher feedback."),
          messages: newMessages.map(m=>({role:m.role,content:m.content})) })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content.map(b=>b.text||"").join("\n");
      setMessages([...newMessages, { role:"assistant", content:text, ts:Date.now() }]);
      if (isFirst) { await saveCredits(credits-1); await saveToHistory(text); }
    } catch(e) { setError(e.message||"Something went wrong."); }
    finally { setIsLoading(false); }
  };

  const generateTemplate = async () => {
    if (credits<=0) { setShowModal(true); return; }
    if (!templateFile) return;
    setScreen("generating"); setError("");
    try {
      let extra="";
      for (const f of extraFiles) { const t=await readAsText(f); extra+=`\n[${f.name}]\n${t.slice(0,1500)}`; }
      const tmpl = await readAsText(templateFile);
      const sys = await buildSystem(extra);
      const res = await fetch(API_URL, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system: sys+"\n\nFill the template completely. Follow its structure exactly.",
          messages:[{ role:"user", content:`Fill this template:\n\n${tmpl.slice(0,3000)}` }] })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content.map(b=>b.text||"").join("\n");
      await saveCredits(credits-1); await saveToHistory(text,`Template: ${templateFile.name}`);
      setMessages([{ role:"assistant", content:text, ts:Date.now() }]);
      setScreen("result");
    } catch(e) { setError(e.message||"Generation failed."); setScreen("input"); }
  };

  const downloadText = (content, filename="lesson-plan.txt") => {
    const b=new Blob([content],{type:"text/plain"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=filename; a.click();
  };

  const resetToHome = () => {
    setScreen("home"); setMode(null); setFrameworks([]); setAgeLevel(null);
    setGradeLevel(""); setExtraFiles([]); setTemplateFile(null);
    setMessages([]); setChatInput(""); setError("");
  };

  // STYLES
  const S = {
    app:{ fontFamily:"'DM Sans',sans-serif", background:G.bg, minHeight:"100vh", color:G.text, maxWidth:480, margin:"0 auto" },
    card:{ background:G.white, border:`1px solid ${G.border}`, borderRadius:16, padding:"18px" },
    btnPrimary:{ background:G.primary, color:"#fff", border:"none", borderRadius:10, padding:"14px 20px", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, width:"100%", display:"block", cursor:"pointer" },
    btnOutline:{ background:"transparent", color:G.primary, border:`1.5px solid ${G.primary}`, borderRadius:10, padding:"10px 18px", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14, cursor:"pointer" },
    btnGhost:{ background:"transparent", color:G.muted, border:`1px solid ${G.border}`, borderRadius:10, padding:"10px 18px", fontFamily:"'DM Sans',sans-serif", fontSize:14, cursor:"pointer" },
    label:{ fontSize:12, fontWeight:700, color:G.primary, letterSpacing:".08em", textTransform:"uppercase", display:"block", marginBottom:8 },
    chip:(on)=>({ padding:"7px 14px", borderRadius:20, border:`1.5px solid ${on?G.primary:G.border}`, background:on?G.accentLight:G.white, color:on?G.primary:G.muted, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:on?600:400 }),
    input:{ width:"100%", padding:"12px 14px", borderRadius:10, border:`1.5px solid ${G.border}`, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:G.text, background:G.white },
  };

  // LOADING
  if (authLoading) return (
    <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <div style={{width:40,height:40,borderRadius:"50%",border:`3px solid ${G.border}`,borderTopColor:G.primary,animation:"spin 1s linear infinite"}}/>
    </div>
  );

  // AUTH SCREEN
  if (!user) return (
    <div style={{...S.app,minHeight:"100vh",display:"flex",flexDirection:"column"}} className="fade">
      <div style={{background:G.white,borderBottom:`1px solid ${G.border}`,padding:"16px 20px",textAlign:"center"}}>
        <img src={LOGO_URL} alt="Dar Al-Thikr" style={{height:38,objectFit:"contain"}} onError={e=>e.target.style.display='none'}/>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 20px"}}>
        <div style={{width:64,height:64,borderRadius:18,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:16,boxShadow:`0 8px 24px ${G.primary}30`}}>📝</div>
        <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:26,color:G.primary,marginBottom:6}}>EduBudd</h1>
        <p style={{color:G.muted,fontSize:14,marginBottom:28,textAlign:"center"}}>AI-powered lesson plans for Dar Al-Thikr teachers ✨</p>

        <div style={{width:"100%",maxWidth:360}}>
          {/* Tabs */}
          <div style={{display:"flex",background:G.surface,borderRadius:10,padding:4,marginBottom:20}}>
            {["signin","signup"].map(tab=>(
              <button key={tab} onClick={()=>{setAuthTab(tab);setAuthError("");setAuthSuccess("");}} style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:authTab===tab?G.white:"transparent",color:authTab===tab?G.primary:G.muted,fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,boxShadow:authTab===tab?"0 1px 4px #00000015":"none",cursor:"pointer"}}>
                {tab==="signin"?"Sign In":"Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleAuth} style={{display:"flex",flexDirection:"column",gap:12}}>
            {authTab==="signup"&&(
              <input value={authName} onChange={e=>setAuthName(e.target.value)} placeholder="Full Name" style={S.input} required/>
            )}
            <input type="email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="Email address" style={S.input} required/>
            <input type="password" value={authPassword} onChange={e=>setAuthPassword(e.target.value)} placeholder="Password" style={S.input} required minLength={6}/>

            {authError&&<div style={{background:"#fff0f0",border:"1px solid #fcc",borderRadius:8,padding:"10px 12px",color:G.red,fontSize:13}}>{authError}</div>}
            {authSuccess&&<div style={{background:G.accentLight,border:`1px solid ${G.border}`,borderRadius:8,padding:"10px 12px",color:G.primary,fontSize:13}}>{authSuccess}</div>}

            <button type="submit" disabled={authSubmitting} style={{...S.btnPrimary,opacity:authSubmitting?.7:1,marginTop:4}}>
              {authSubmitting?"Please wait…":authTab==="signin"?"Sign In →":"Create Account →"}
            </button>
          </form>

          <p style={{textAlign:"center",color:G.muted,fontSize:12,marginTop:16}}>
            {authTab==="signin"?"Don't have an account? ":"Already have an account? "}
            <button onClick={()=>setAuthTab(authTab==="signin"?"signup":"signin")} style={{background:"none",border:"none",color:G.primary,fontWeight:600,cursor:"pointer",fontSize:12}}>
              {authTab==="signin"?"Sign Up":"Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  // GENERATING
  if (screen==="generating") return (
    <div style={{...S.app,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",gap:20}}>
      <div style={{width:52,height:52,borderRadius:"50%",border:`3px solid ${G.border}`,borderTopColor:G.primary,animation:"spin 1s linear infinite"}}/>
      <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:20,color:G.primary}}>Building your lesson plan…</p>
      <p style={{color:G.muted,fontSize:13}}>Powered by Claude AI</p>
    </div>
  );

  // TEMPLATE RESULT
  if (screen==="result") {
    const content = messages[0]?.content||"";
    const sections = content.split(/\n##\s+/).filter(Boolean);
    return (
      <div style={{...S.app,padding:"0 0 32px"}} className="fade">
        <div style={{background:G.primary,padding:"16px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={resetToHome} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>← Back</button>
          <span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15}}>Lesson Plan Ready ✓</span>
          <button onClick={()=>downloadText(content)} style={{background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.4)",borderRadius:8,padding:"6px 12px",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>↓ Download</button>
        </div>
        <div style={{padding:"16px"}}>
          <div style={{...S.card,maxHeight:"72vh",overflowY:"auto"}}>
            {sections.map((s,i)=>{ const nl=s.indexOf("\n"); const title=nl>-1?s.slice(0,nl):s; const body=nl>-1?s.slice(nl+1):"";
              return (<div key={i} style={{marginBottom:20}}>
                <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",color:G.primary,fontSize:14,fontWeight:700,marginBottom:6,borderBottom:`2px solid ${G.accentLight}`,paddingBottom:4}}>{title}</h3>
                <p style={{color:G.text,fontSize:13.5,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{body}</p>
              </div>);
            })}
          </div>
          <button onClick={resetToHome} style={{...S.btnPrimary,marginTop:14}}>+ Create Another</button>
        </div>
      </div>
    );
  }

  // HISTORY DETAIL
  if (viewingHistory) {
    const sections = viewingHistory.content.split(/\n##\s+/).filter(Boolean);
    return (
      <div style={{...S.app,padding:"0 0 32px"}} className="fade">
        <div style={{background:G.primary,padding:"16px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={()=>setViewingHistory(null)} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>← Back</button>
          <span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14}}>Past Lesson Plan</span>
          <button onClick={()=>downloadText(viewingHistory.content)} style={{background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.4)",borderRadius:8,padding:"6px 12px",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>↓ Download</button>
        </div>
        <div style={{padding:"16px"}}>
          <div style={{background:G.accentLight,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:G.primary}}>
            📅 {viewingHistory.date} · {viewingHistory.ageLevel} · {viewingHistory.frameworks}
          </div>
          <div style={{...S.card,maxHeight:"70vh",overflowY:"auto"}}>
            {sections.map((s,i)=>{ const nl=s.indexOf("\n"); const title=nl>-1?s.slice(0,nl):s; const body=nl>-1?s.slice(nl+1):"";
              return (<div key={i} style={{marginBottom:20}}>
                <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",color:G.primary,fontSize:14,fontWeight:700,marginBottom:6,borderBottom:`2px solid ${G.accentLight}`,paddingBottom:4}}>{title}</h3>
                <p style={{color:G.text,fontSize:13.5,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{body}</p>
              </div>);
            })}
          </div>
        </div>
      </div>
    );
  }

  // HISTORY LIST
  if (screen==="history") return (
    <div style={{...S.app,padding:"0 0 32px"}} className="fade">
      <div style={{background:G.primary,padding:"16px 18px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>← Back</button>
        <span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:16}}>Lesson History</span>
      </div>
      <div style={{padding:"16px"}}>
        {history.length===0?(
          <div style={{textAlign:"center",padding:"60px 20px",color:G.muted}}>
            <div style={{fontSize:40,marginBottom:12}}>📋</div>
            <p style={{fontWeight:600}}>No history yet</p>
            <p style={{fontSize:13,marginTop:4}}>Your generated lesson plans will appear here</p>
          </div>
        ):history.map(h=>(
          <div key={h.id} onClick={()=>setViewingHistory(h)} style={{...S.card,marginBottom:10,cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:14,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.title||"Lesson Plan"}</p>
                <p style={{fontSize:12,color:G.muted}}>{h.ageLevel} · {h.frameworks.split(",")[0]}</p>
              </div>
              <div style={{textAlign:"right",flexShrink:0,marginLeft:10}}>
                <p style={{fontSize:11,color:G.muted}}>{h.date}</p>
                <span style={{background:G.accentLight,color:G.primary,fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:10,display:"inline-block",marginTop:3}}>{h.mode}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // CHAT SCREEN
  if (screen==="chat") {
    const canSend = chatInput.trim().length>2&&!isLoading;
    return (
      <div style={{...S.app,display:"flex",flexDirection:"column",height:"100vh"}} className="fade">
        <div style={{background:G.primary,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <button onClick={resetToHome} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>← Back</button>
          <div style={{textAlign:"center"}}>
            <p style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14}}>Free Input Mode</p>
            <p style={{color:"rgba(255,255,255,.7)",fontSize:11}}>{frameworks.slice(0,2).join(", ")} · {AGE_LEVELS.find(a=>a.value===ageLevel)?.label}</p>
          </div>
          <button onClick={()=>setShowModal(true)} style={{background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.3)",borderRadius:14,padding:"4px 10px",color:"#fff",fontSize:12,cursor:"pointer"}}>⚡{credits}</button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
          {messages.length===0&&(
            <div style={{textAlign:"center",padding:"32px 20px",color:G.muted}} className="fade">
              <div style={{fontSize:36,marginBottom:10}}>💬</div>
              <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:16,color:G.primary,marginBottom:6}}>Describe your lesson</p>
              <p style={{fontSize:13,lineHeight:1.6}}>Tell me the topic, grade, duration, and any goals. Refine it after!</p>
              <div style={{background:G.accentLight,borderRadius:10,padding:"12px",marginTop:16,textAlign:"left"}}>
                <p style={{fontSize:12,color:G.primary,fontWeight:600,marginBottom:4}}>Example:</p>
                <p style={{fontSize:12,color:G.muted,lineHeight:1.6}}>"A 45-min lesson on the water cycle for Grade 5. Include a hands-on activity."</p>
              </div>
            </div>
          )}
          {messages.map((m,i)=>(
            <div key={i} className="msg" style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start"}}>
              {m.role==="user"?(
                <div style={{background:G.primary,color:"#fff",borderRadius:"16px 16px 4px 16px",padding:"10px 14px",maxWidth:"82%",fontSize:14,lineHeight:1.6}}>{m.content}</div>
              ):(
                <div style={{maxWidth:"92%"}}>
                  <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:"16px 16px 16px 4px",padding:"14px",fontSize:13.5,lineHeight:1.8,color:G.text}}>
                    {m.content.split(/\n##\s+/).filter(Boolean).map((s,j)=>{
                      const nl=s.indexOf("\n"); const title=nl>-1?s.slice(0,nl):s; const body=nl>-1?s.slice(nl+1):"";
                      return (<div key={j} style={{marginBottom:j>0?14:0}}>
                        {j>0&&<h4 style={{color:G.primary,fontSize:13,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",marginBottom:4,borderBottom:`1px solid ${G.accentLight}`,paddingBottom:3}}>{title}</h4>}
                        {j===0&&<p style={{whiteSpace:"pre-wrap"}}>{s}</p>}
                        {j>0&&<p style={{color:G.text,whiteSpace:"pre-wrap",fontSize:13}}>{body}</p>}
                      </div>);
                    })}
                  </div>
                  <button onClick={()=>downloadText(m.content)} style={{background:"none",border:"none",color:G.primary,fontSize:12,fontWeight:600,marginTop:6,padding:"2px 4px",cursor:"pointer"}}>↓ Download this plan</button>
                </div>
              )}
            </div>
          ))}
          {isLoading&&(
            <div className="msg" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:G.white,border:`1px solid ${G.border}`,borderRadius:12,width:"fit-content"}}>
              <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${G.border}`,borderTopColor:G.primary,animation:"spin 1s linear infinite"}}/>
              <span style={{fontSize:13,color:G.muted}}>Writing your lesson plan…</span>
            </div>
          )}
          {error&&<div style={{background:"#fff0f0",border:"1px solid #fcc",borderRadius:10,padding:"10px 14px",color:G.red,fontSize:13}}>{error}</div>}
          <div ref={chatEndRef}/>
        </div>

        <div style={{padding:"0 12px 4px",flexShrink:0}}>
          <input type="file" ref={extraRef} multiple onChange={e=>setExtraFiles([...e.target.files])} style={{display:"none"}}/>
          {extraFiles.length>0&&<p style={{fontSize:11,color:G.primary,marginBottom:4}}>📎 {extraFiles.length} file(s) attached</p>}
        </div>
        <div style={{padding:"8px 12px 16px",background:G.white,borderTop:`1px solid ${G.border}`,flexShrink:0,display:"flex",gap:8,alignItems:"flex-end"}}>
          <button onClick={()=>extraRef.current.click()} style={{background:G.accentLight,border:"none",borderRadius:10,padding:"10px",color:G.primary,flexShrink:0,fontSize:16,cursor:"pointer"}}>📎</button>
          <textarea value={chatInput} onChange={e=>setChatInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}
            placeholder={messages.length===0?"Describe your lesson…":"Follow up or ask to refine…"}
            style={{flex:1,minHeight:42,maxHeight:120,background:G.surface,border:`1px solid ${G.border}`,borderRadius:10,padding:"10px 12px",fontFamily:"'DM Sans',sans-serif",fontSize:14,resize:"none",color:G.text,lineHeight:1.5}} rows={1}/>
          <button onClick={sendChat} disabled={!canSend} style={{background:canSend?G.primary:G.border,border:"none",borderRadius:10,padding:"10px 14px",color:"#fff",fontWeight:700,fontSize:16,flexShrink:0,cursor:"pointer"}}>→</button>
        </div>
      </div>
    );
  }

  // SETUP
  if (screen==="setup") {
    const grades = ageLevel?GRADE_MAP[ageLevel]:[];
    const canContinue = frameworks.length>0&&ageLevel;
    return (
      <div style={{...S.app,padding:"0 0 32px"}} className="fade">
        <div style={{background:G.primary,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>← Back</button>
          <span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:16}}>Lesson Setup</span>
        </div>
        <div style={{padding:"16px"}}>
          <div style={{...S.card,marginBottom:14}}>
            <span style={S.label}>Curriculum Framework(s)</span>
            <p style={{fontSize:12,color:G.muted,marginBottom:10}}>Select all that apply</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {FRAMEWORKS.map(fw=>(<button key={fw} onClick={()=>toggleFw(fw)} style={S.chip(frameworks.includes(fw))}>{fw}</button>))}
            </div>
          </div>
          <div style={{...S.card,marginBottom:14}}>
            <span style={S.label}>Age Level</span>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {AGE_LEVELS.map(al=>{const on=ageLevel===al.value; return (
                <button key={al.value} onClick={()=>{setAgeLevel(al.value);setGradeLevel("");}} style={{padding:"12px",borderRadius:10,border:`1.5px solid ${on?G.primary:G.border}`,background:on?G.accentLight:G.white,textAlign:"left",cursor:"pointer"}}>
                  <div style={{fontSize:18,marginBottom:2}}>{al.emoji}</div>
                  <div style={{fontSize:13,fontWeight:600,color:on?G.primary:G.text}}>{al.label}</div>
                  <div style={{fontSize:11,color:G.muted}}>{al.sub}</div>
                </button>
              );})}
            </div>
          </div>
          {grades.length>0&&(
            <div style={{...S.card,marginBottom:14}}>
              <span style={S.label}>Grade Level <span style={{color:G.muted,textTransform:"none",letterSpacing:0,fontWeight:400}}>— optional</span></span>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {grades.map(g=>(<button key={g} onClick={()=>setGradeLevel(gradeLevel===g?"":g)} style={S.chip(gradeLevel===g)}>{g}</button>))}
              </div>
            </div>
          )}
          <button onClick={()=>setScreen(mode===1?"input":"chat")} disabled={!canContinue} style={{...S.btnPrimary,opacity:canContinue?1:.4}}>Continue →</button>
        </div>
      </div>
    );
  }

  // TEMPLATE INPUT
  if (screen==="input") return (
    <div style={{...S.app,padding:"0 0 32px"}} className="fade">
      <div style={{background:G.primary,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={()=>setScreen("setup")} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>← Back</button>
        <span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:16}}>Template Mode</span>
        <button onClick={()=>setShowModal(true)} style={{background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.3)",borderRadius:14,padding:"4px 10px",color:"#fff",fontSize:12,cursor:"pointer"}}>⚡{credits}</button>
      </div>
      <div style={{padding:"16px"}}>
        {error&&<div style={{background:"#fff0f0",border:"1px solid #fcc",borderRadius:10,padding:"12px",marginBottom:14,color:G.red,fontSize:13}}>{error}</div>}
        <div style={{...S.card,marginBottom:14}}>
          <span style={S.label}>Your Template *</span>
          <input type="file" ref={templateRef} onChange={e=>setTemplateFile(e.target.files[0])} accept=".txt,.doc,.docx" style={{display:"none"}}/>
          <button onClick={()=>templateRef.current.click()} style={{...S.btnOutline,width:"100%",padding:"14px"}}>
            {templateFile?`✓  ${templateFile.name}`:"📄  Upload Template (.txt / .docx)"}
          </button>
        </div>
        <div style={{...S.card,marginBottom:14}}>
          <span style={S.label}>Reference Files <span style={{color:G.muted,textTransform:"none",letterSpacing:0,fontWeight:400}}>— optional</span></span>
          <input type="file" ref={extraRef} multiple onChange={e=>setExtraFiles([...e.target.files])} style={{display:"none"}}/>
          <button onClick={()=>extraRef.current.click()} style={{...S.btnGhost,width:"100%",padding:"12px"}}>
            {extraFiles.length>0?`📎  ${extraFiles.length} file(s) attached`:"+  Attach Reference Files"}
          </button>
        </div>
        <button onClick={generateTemplate} disabled={!templateFile} style={{...S.btnPrimary,opacity:templateFile?1:.4}}>Generate & Fill Template (1 credit)</button>
      </div>
    </div>
  );

  // HOME
  return (
    <div style={S.app} className="fade">
      <div style={{background:G.white,borderBottom:`1px solid ${G.border}`,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <img src={LOGO_URL} alt="Dar Al-Thikr" style={{height:36,objectFit:"contain"}} onError={e=>e.target.style.display='none'}/>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>setScreen("history")} style={{...S.btnGhost,padding:"7px 12px",fontSize:13}}>📋</button>
          <button onClick={()=>setShowModal(true)} style={{background:G.accentLight,border:`1px solid ${G.border}`,borderRadius:10,padding:"7px 12px",color:G.primary,fontSize:13,fontWeight:600,cursor:"pointer"}}>⚡{credits}</button>
          <button onClick={signOut} style={{...S.btnGhost,padding:"7px 12px",fontSize:13}}>Sign Out</button>
        </div>
      </div>

      <div style={{padding:"28px 18px 20px",textAlign:"center",background:`linear-gradient(180deg,${G.white} 0%,${G.bg} 100%)`}}>
        <div style={{width:60,height:60,borderRadius:18,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:28,boxShadow:`0 8px 24px ${G.primary}30`}}>📝</div>
        <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:26,color:G.primary,marginBottom:8}}>EduBudd</h1>
        <p style={{color:G.muted,fontSize:14,lineHeight:1.65,maxWidth:300,margin:"0 auto"}}>Turn your teaching ideas into brilliant, curriculum-ready lesson plans — in seconds! ✨</p>
        <p style={{color:G.primary,fontSize:13,marginTop:8,fontWeight:600}}>Welcome back! 👋</p>
      </div>

      <div style={{padding:"0 16px 32px"}}>
        <p style={{fontSize:11,color:G.muted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:12,fontWeight:600}}>Choose your mode</p>
        {[
          {id:1,icon:"📋",title:"Template Mode",desc:"Upload your school template. AI fills every section with rich, curriculum-aligned content.",tag:"Structured Format",color:G.primary},
          {id:2,icon:"💬",title:"Free Input Mode",desc:"Just chat! Describe your lesson and AI builds it from scratch. Refine in real-time.",tag:"Quick & Flexible",color:"#2a6eb5"}
        ].map(m=>(
          <div key={m.id} onClick={()=>{setMode(m.id);setScreen("setup");}} style={{...S.card,marginBottom:12,cursor:"pointer",display:"flex",gap:14,alignItems:"flex-start",transition:"box-shadow .15s"}}>
            <div style={{width:48,height:48,borderRadius:13,background:m.id===1?G.accentLight:"#e8f0fb",border:`1px solid ${m.id===1?G.border:"#c0d4f0"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{m.icon}</div>
            <div>
              <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:16,color:G.text,marginBottom:4}}>{m.title}</h3>
              <p style={{color:G.muted,fontSize:13,lineHeight:1.6}}>{m.desc}</p>
              <span style={{display:"inline-block",marginTop:8,background:m.id===1?G.accentLight:"#e8f0fb",borderRadius:6,padding:"3px 10px",color:m.id===1?G.primary:"#2a6eb5",fontSize:11,fontWeight:700}}>{m.tag.toUpperCase()}</span>
            </div>
          </div>
        ))}

        {history.length>0&&(
          <div style={{...S.card,background:G.accentLight,borderColor:G.border,marginTop:4}}>
            <p style={{fontSize:12,fontWeight:600,color:G.primary,marginBottom:8}}>📋 Recent Lesson Plans</p>
            {history.slice(0,2).map(h=>(
              <div key={h.id} onClick={()=>setViewingHistory(h)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${G.border}`,cursor:"pointer"}}>
                <div>
                  <p style={{fontSize:13,fontWeight:600,color:G.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:220}}>{h.title}</p>
                  <p style={{fontSize:11,color:G.muted}}>{h.ageLevel} · {h.date}</p>
                </div>
                <span style={{color:G.primary,fontSize:13}}>→</span>
              </div>
            ))}
            <button onClick={()=>setScreen("history")} style={{background:"none",border:"none",color:G.primary,fontSize:12,fontWeight:600,marginTop:8,padding:0,cursor:"pointer"}}>View all →</button>
          </div>
        )}
      </div>

      {showModal&&(
        <div style={{position:"fixed",inset:0,background:"#00000070",zIndex:200,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowModal(false)}>
          <div style={{...S.card,width:"100%",maxWidth:480,margin:"0 auto",borderRadius:"20px 20px 0 0",padding:"24px 20px 36px",animation:"slideUp .3s ease"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:18}}>Your Credits</h3>
                <p style={{color:G.muted,fontSize:13,marginTop:2}}><strong style={{color:G.primary}}>{credits} credits</strong> left this week · resets Monday</p>
              </div>
              <button onClick={()=>setShowModal(false)} style={{background:"none",border:"none",color:G.muted,fontSize:22,cursor:"pointer"}}>×</button>
            </div>
            <div style={{background:G.accentLight,border:`1px solid ${G.border}`,borderRadius:12,padding:"14px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{fontWeight:600,fontSize:14,marginBottom:2}}>📺 Watch an Ad</p>
                  <p style={{color:G.muted,fontSize:12}}>Earn 1 free credit · 5 seconds</p>
                  {adDone&&<p style={{color:G.primary,fontSize:12,marginTop:3,fontWeight:600}}>✓ Credit added!</p>}
                </div>
                <button onClick={watchAd} disabled={adTimer!==null} style={{background:G.primary,color:"#fff",border:"none",borderRadius:8,padding:"10px 18px",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>
                  {adTimer!==null?`${adTimer}s…`:"Watch"}
                </button>
              </div>
              {adTimer!==null&&(
                <div style={{marginTop:10,height:4,borderRadius:2,background:G.border}}>
                  <div style={{height:"100%",borderRadius:2,background:G.primary,width:`${((5-adTimer)/5)*100}%`,transition:"width 1s linear"}}/>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
