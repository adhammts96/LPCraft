// @ts-nocheck 
// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://corocoodowuwktyjygin.supabase.co",
  "sb_publishable_EGtulsTAfpETwlR-4Ldplg_-ysE2XMb"
);

const LOGO_URL = "https://althikr.edu.sa/wp-content/uploads/2025/03/DASC_Horizontal-Logo-EN-250x82-1.png";
const API_URL = `${window.location.origin}/api/generate`;

const TRANSLATIONS = {
  en: {
    tagline: "Turn your teaching ideas into brilliant lesson plans — in seconds! ✨",
    chooseMode: "Choose your mode",
    templateMode: "Template Mode",
    templateDesc: "Upload your school template. AI fills every section with rich, curriculum-aligned content.",
    templateTag: "Structured Format",
    freeMode: "Free Input Mode",
    freeDesc: "Just chat! Describe your lesson and AI builds it from scratch. Refine in real-time.",
    freeTag: "Quick & Flexible",
    americanMode: "American Pathway",
    americanDesc: "Dar Al-Thikr's official 5Es template — AI fills it completely in English or Arabic.",
    americanTag: "Dar Al-Thikr Official",
    history: "History",
    signOut: "Sign Out",
    credits: "credits",
    back: "← Back",
    continue: "Continue →",
    generate: "Generate Lesson Plan (1 credit)",
    download: "↓ Download",
    creating: "Another",
    welcome: "Welcome back! 👋",
    noHistory: "No history yet",
    noHistoryDesc: "Your generated lesson plans will appear here",
    lessonReady: "Lesson Plan Ready ✓",
    building: "Building your lesson plan…",
    poweredBy: "Powered by Claude AI",
    describeLesson: "Describe your lesson",
    describeHint: "Tell me the topic, grade, duration, and any goals. Refine it after!",
    example: "Example",
    exampleText: "A 45-min lesson on the water cycle for Grade 5. Include a hands-on activity.",
    followUp: "Follow up or ask to refine…",
    downloading: "↓ Download this plan",
    attachFiles: "📎",
    send: "→",
    selectFrameworks: "Curriculum Framework(s)",
    selectAll: "Select all that apply",
    ageLevel: "Age Level",
    gradeLevel: "Grade Level",
    optional: "— optional",
    yourTemplate: "Your Template *",
    uploadTemplate: "📄  Upload Template (.txt / .docx)",
    refFiles: "Reference Files",
    attachRef: "+  Attach Reference Files",
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email address",
    password: "Password",
    fullName: "Full Name",
    signInBtn: "Sign In →",
    signUpBtn: "Create Account →",
    pleaseWait: "Please wait…",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    emailConfirm: "Account created! Please check your email to verify.",
    watchAd: "📺 Watch an Ad",
    watchAdDesc: "Earn 1 free credit · 5 seconds",
    creditAdded: "✓ Credit added!",
    watch: "Watch",
    yourCredits: "Your Credits",
    creditsLeft: "left this week · resets Monday",
    viewAll: "View all →",
    recentPlans: "📋 Recent Lesson Plans",
    pastPlan: "Past Lesson Plan",
    lessonSetup: "Lesson Setup",
    americanSetup: "American Pathway Setup",
    subject: "Subject / Course",
    subjectHint: "e.g. Wonders McGraw-Hill, Math, Science",
    topic: "Lesson Topic",
    topicHint: "e.g. Expository Writing, Fractions, Ecosystems",
    classField: "Class",
    classHint: "e.g. 4A / 4B",
    unit: "Unit",
    unitHint: "e.g. Unit 2",
    lessonNum: "Lesson Number(s)",
    lessonNumHint: "e.g. Lessons 7, 8, 9",
    week: "Week",
    weekHint: "e.g. Week 10",
    standards: "Standards / Objectives",
    standardsHint: "e.g. W.4.2 – Refer to details and examples...",
    duration: "Lesson Duration",
    outputLang: "Generate lesson plan in:",
    english: "English",
    arabic: "Arabic",
    generateAmerican: "Generate American Pathway Plan (1 credit)",
  },
  ar: {
    tagline: "حوّل أفكارك التدريسية إلى خطط دروس رائعة — في ثوانٍ! ✨",
    chooseMode: "اختر الوضع",
    templateMode: "وضع القالب",
    templateDesc: "ارفع قالب مدرستك. يقوم الذكاء الاصطناعي بملء كل قسم بمحتوى غني ومتوافق مع المناهج.",
    templateTag: "تنسيق منظم",
    freeMode: "وضع الإدخال الحر",
    freeDesc: "فقط تحدث! صف درسك ويبنيه الذكاء الاصطناعي من الصفر. نقّحه في الوقت الفعلي.",
    freeTag: "سريع ومرن",
    americanMode: "المسار الأمريكي",
    americanDesc: "قالب دار الذكر الرسمي بنموذج 5Es — يملأه الذكاء الاصطناعي بالكامل بالعربية أو الإنجليزية.",
    americanTag: "دار الذكر الرسمي",
    history: "السجل",
    signOut: "تسجيل الخروج",
    credits: "رصيد",
    back: "→ رجوع",
    continue: "← متابعة",
    generate: "إنشاء خطة الدرس (رصيد واحد)",
    download: "↓ تحميل",
    creating: "جديدة",
    welcome: "أهلاً بك! 👋",
    noHistory: "لا يوجد سجل بعد",
    noHistoryDesc: "ستظهر هنا خطط الدروس التي أنشأتها",
    lessonReady: "خطة الدرس جاهزة ✓",
    building: "جارٍ بناء خطة درسك…",
    poweredBy: "مدعوم بتقنية Claude AI",
    describeLesson: "صف درسك",
    describeHint: "أخبرني بالموضوع والصف والمدة وأي أهداف. نقّحها بعد ذلك!",
    example: "مثال",
    exampleText: "درس مدته 45 دقيقة حول دورة المياه للصف الخامس. تضمين نشاط عملي.",
    followUp: "تابع أو اطلب التعديل…",
    downloading: "↓ تحميل هذه الخطة",
    attachFiles: "📎",
    send: "←",
    selectFrameworks: "إطار المنهج الدراسي",
    selectAll: "اختر كل ما ينطبق",
    ageLevel: "المرحلة العمرية",
    gradeLevel: "الصف الدراسي",
    optional: "— اختياري",
    yourTemplate: "قالبك *",
    uploadTemplate: "📄  ارفع القالب (.txt / .docx)",
    refFiles: "ملفات مرجعية",
    attachRef: "+  إرفاق ملفات مرجعية",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    fullName: "الاسم الكامل",
    signInBtn: "← تسجيل الدخول",
    signUpBtn: "← إنشاء الحساب",
    pleaseWait: "يرجى الانتظار…",
    noAccount: "ليس لديك حساب؟",
    haveAccount: "لديك حساب بالفعل؟",
    emailConfirm: "تم إنشاء الحساب! يرجى التحقق من بريدك الإلكتروني.",
    watchAd: "📺 شاهد إعلاناً",
    watchAdDesc: "اكسب رصيداً مجانياً · 5 ثوانٍ",
    creditAdded: "✓ تمت إضافة الرصيد!",
    watch: "شاهد",
    yourCredits: "رصيدك",
    creditsLeft: "متبقٍ هذا الأسبوع · يُجدَّد الاثنين",
    viewAll: "عرض الكل ←",
    recentPlans: "📋 خطط الدروس الأخيرة",
    pastPlan: "خطة درس سابقة",
    lessonSetup: "إعداد الدرس",
    americanSetup: "إعداد المسار الأمريكي",
    subject: "المادة / المقرر",
    subjectHint: "مثال: Wonders McGraw-Hill، الرياضيات، العلوم",
    topic: "موضوع الدرس",
    topicHint: "مثال: الكتابة التوضيحية، الكسور، النظم البيئية",
    classField: "الفصل",
    classHint: "مثال: 4A / 4B",
    unit: "الوحدة",
    unitHint: "مثال: الوحدة 2",
    lessonNum: "رقم الدرس",
    lessonNumHint: "مثال: الدروس 7، 8، 9",
    week: "الأسبوع",
    weekHint: "مثال: الأسبوع 10",
    standards: "المعايير / الأهداف",
    standardsHint: "مثال: W.4.2 – الرجوع إلى التفاصيل والأمثلة...",
    duration: "مدة الدرس",
    outputLang: "إنشاء خطة الدرس بـ:",
    english: "الإنجليزية",
    arabic: "العربية",
    generateAmerican: "إنشاء خطة المسار الأمريكي (رصيد واحد)",
  }
};

const FRAMEWORKS = ["CCSS","Cambridge","IB","CELTA Style","5Es Model","SIOP","Bloom's Taxonomy","UbD","Montessori","STEAM","General English","Project-Based Learning","Competency-Based","Flipped Classroom"];
const AGE_LEVELS = [
  { label:"Early Childhood", labelAr:"الطفولة المبكرة", sub:"Ages 3–5", subAr:"3–5 سنوات", value:"early_childhood", emoji:"🌱" },
  { label:"Primary", labelAr:"المرحلة الابتدائية", sub:"Ages 6–11", subAr:"6–11 سنة", value:"primary", emoji:"📚" },
  { label:"Middle School", labelAr:"المرحلة الإعدادية", sub:"Ages 12–14", subAr:"12–14 سنة", value:"middle_school", emoji:"🔬" },
  { label:"High School", labelAr:"المرحلة الثانوية", sub:"Ages 15–18", subAr:"15–18 سنة", value:"high_school", emoji:"🎓" },
  { label:"Adult / Higher Ed", labelAr:"البالغون / التعليم العالي", sub:"18+", subAr:"18+", value:"adult", emoji:"🏛️" },
  { label:"Mixed / Flexible", labelAr:"مختلط / مرن", sub:"Open range", subAr:"نطاق مفتوح", value:"mixed", emoji:"♾️" },
];
const GRADE_MAP = {
  early_childhood:["Pre-K","Kindergarten"],
  primary:["Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6"],
  middle_school:["Grade 7","Grade 8","Grade 9"],
  high_school:["Grade 10","Grade 11","Grade 12"],
  adult:["Undergraduate","Postgraduate","Professional","N/A"],
  mixed:["N/A"]
};
const DURATIONS = ["30 minutes","45 minutes","60 minutes","90 minutes","2 hours"];

const G = {
  bg:"#f4f9f6", white:"#ffffff", primary:"#1a6b42", accentLight:"#e8f5ee",
  text:"#0f2018", muted:"#5a7a68", border:"#cce4d8", surface:"#edf6f1", red:"#e05555",
};

const injectStyles = () => {
  if (document.getElementById("lc-styles")) return;
  const s = document.createElement("style");
  s.id = "lc-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&family=Noto+Kufi+Arabic:wght@400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    .fade{animation:fadeUp .3s ease both;}
    .msg{animation:msgIn .25s ease both;}
    ::-webkit-scrollbar{width:4px;}
    ::-webkit-scrollbar-thumb{background:#cce4d8;border-radius:2px;}
    textarea:focus,input:focus,select:focus{outline:2px solid #4db87a;outline-offset:1px;}
  `;
  document.head.appendChild(s);
};

export default function App() {
  const [lang, setLang] = useState("en");
  const t = TRANSLATIONS[lang];
  const isAr = lang === "ar";
  const fontFamily = isAr ? "'Noto Kufi Arabic', sans-serif" : "'DM Sans', sans-serif";
  const dir = isAr ? "rtl" : "ltr";

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

  // American Pathway fields
  const [apSubject, setApSubject] = useState("");
  const [apTopic, setApTopic] = useState("");
  const [apGrade, setApGrade] = useState("");
  const [apClass, setApClass] = useState("");
  const [apUnit, setApUnit] = useState("");
  const [apLesson, setApLesson] = useState("");
  const [apWeek, setApWeek] = useState("");
  const [apStandards, setApStandards] = useState("");
  const [apDuration, setApDuration] = useState("45 minutes");
  const [apOutputLang, setApOutputLang] = useState("en");

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
        if (Date.now() - new Date(data.credits_reset_at).getTime() > weekMs) {
          await supabase.from("profiles").update({ credits:10, credits_reset_at: new Date().toISOString() }).eq("id", userId);
          setCredits(10);
        } else { setCredits(data.credits); }
      }
      const h = localStorage.getItem("lc_history");
      if (h) setHistory(JSON.parse(h));
    } catch {}
  };

  const saveCredits = async (n) => {
    setCredits(n);
    if (user) await supabase.from("profiles").update({ credits: n }).eq("id", user.id);
  };

  const saveToHistory = async (content, title) => {
    const entry = { id:Date.now(), date:new Date().toLocaleDateString(), frameworks:frameworks.join(", "), ageLevel:AGE_LEVELS.find(a=>a.value===ageLevel)?.[isAr?"labelAr":"label"]||"", gradeLevel, mode:mode===1?"Template":mode===3?"American Pathway":"Free Input", title:title||content.split("\n")[0].replace(/[#*]/g,"").trim().slice(0,60), content };
    const updated = [entry, ...history].slice(0,20);
    setHistory(updated);
    localStorage.setItem("lc_history", JSON.stringify(updated));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(""); setAuthSubmitting(true); setAuthSuccess("");
    try {
      if (authTab==="signup") {
        const { error } = await supabase.auth.signUp({ email:authEmail, password:authPassword, options:{ data:{ full_name:authName } } });
        if (error) throw error;
        setAuthSuccess(t.emailConfirm);
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
    const t2 = setInterval(() => {
      setAdTimer(p => { if (p<=1) { clearInterval(t2); setAdTimer(null); setAdDone(true); saveCredits(credits+1); return null; } return p-1; });
    }, 1000);
  };

  const toggleFw = fw => setFrameworks(p => p.includes(fw)?p.filter(f=>f!==fw):[...p,fw]);
  const readAsText = file => new Promise(res => { const r=new FileReader(); r.onload=e=>res(e.target.result); r.onerror=()=>res(`[${file.name}]`); r.readAsText(file); });

  const buildSystem = async (extraContent="") => {
    const fwStr = frameworks.length?frameworks.join(", "):"General curriculum";
    const ageInfo = AGE_LEVELS.find(a=>a.value===ageLevel);
    const ageStr = ageInfo?`${ageInfo.label} (${ageInfo.sub})`:"Not specified";
    return `You are an expert lesson plan designer for Dar Al-Thikr School, Jeddah. Frameworks: ${fwStr}.
Student: Age ${ageStr} | Grade ${gradeLevel||"Not specified"} | Frameworks ${fwStr}
${extraContent?`\nReference:\n${extraContent}`:""}
Create thorough classroom-ready plans with ## headers. Be specific and practical.`;
  };

  // American Pathway generation
  const generateAmericanPathway = async () => {
    if (credits<=0) { setShowModal(true); return; }
    if (!apSubject||!apTopic) return;
    setScreen("generating"); setError("");
    const outputInArabic = apOutputLang === "ar";
    try {
      const langInstruction = outputInArabic
        ? "Generate the ENTIRE lesson plan in Arabic. Use proper educational Arabic terminology. The document should be fully in Arabic, right-to-left."
        : "Generate the entire lesson plan in English.";

      const sys = `You are an expert American Pathway curriculum designer at Dar Al-Thikr School, Jeddah. You specialize in the 5Es instructional model.
${langInstruction}
Follow the EXACT structure below. Be detailed, specific, and classroom-ready.`;

      const today = new Date().toLocaleDateString();
      const userMsg = `Create a complete Dar Al-Thikr American Pathway lesson plan with this information:

Course: ${apSubject}
Date: ${today}
Grade: ${apGrade}
Class: ${apClass}
Unit: ${apUnit}
Lesson: ${apLesson}
Topic: ${apTopic}
Week: ${apWeek}
Duration: ${apDuration}
Standards: ${apStandards || "CCSS aligned standards for this grade and topic"}

Follow this EXACT 5Es structure:

## LESSON OVERVIEW
(Fill: Course, Instructor, Date, Grade, Class, Unit, Lesson, Topic, Week)

## STANDARDS & LEARNING OBJECTIVES
(List specific CCSS or curriculum standards. Format: By the end of this lesson, students will be able to...)

## LESSON STRUCTURE
Beginning: Engage, Explore | Middle: Explain, Elaborate | End: Evaluate

## INTRODUCTION (Engage)
**Hook:** (Compelling, relevant hook activity - 5-7 minutes. Include specific questions and student actions)
**Learning Intentions:** (3-4 "I am learning to..." statements)
**Success Criteria:** (3-4 checkmarked "I can..." statements)
**Prior Learning:** (What students already know. Bridge question to activate prior knowledge)
**Key Vocabulary:** (6-8 content-specific words with student-friendly definitions)
**Transition Statement:** (Bridge from intro to presentation)

## PRESENTATION (Explain)
(Detailed explicit teaching - 10-15 minutes. Include think-aloud, modeling, anchor charts, check for understanding questions. Be very specific about what teacher says and does.)

## GUIDED PRACTICE (Elaborate)
(Collaborative activity - 10-15 minutes. Include specific partner/group tasks, graphic organizers, teacher circulation prompts, discussion questions.)

## INDEPENDENT PRACTICE, ASSESSMENT & DIFFERENTIATION
**Independent Task:** (Specific worksheet or task with exact instructions)
**Extension:** (For early finishers)
**Formal Assessment:** (How you'll collect and evaluate work)
**Informal Assessment:** (Observation, questioning strategies)
**Support/Scaffold:** (For students who need help - sentence frames, visuals, partner reading)
**Challenge:** (For advanced students)

## REVIEW & CLOSURE (Evaluate)
**Connection to Learning Intentions:** (Self-assessment strategy)
**Exit Ticket:** (2 specific prompts students answer on index card)
**Closing Discussion:** (1-2 discussion questions)
**Preview Next Lesson:** (Brief teaser)`;

      const res = await fetch(API_URL, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:sys, messages:[{ role:"user", content:userMsg }] })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content.map(b=>b.text||"").join("\n");
      await saveCredits(credits-1);
      await saveToHistory(text, `${apTopic} - Grade ${apGrade}`);
      setMessages([{ role:"assistant", content:text, ts:Date.now(), outputLang:apOutputLang }]);
      setScreen("result");
    } catch(e) { setError(e.message||"Generation failed."); setScreen("american"); }
  };

  const sendChat = async () => {
    if (!chatInput.trim()||isLoading) return;
    if (credits<=0) { setShowModal(true); return; }
    const userMsg = { role:"user", content:chatInput.trim(), ts:Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages); setChatInput(""); setIsLoading(true); setError("");
    try {
      let extra="";
      for (const f of extraFiles) { const tx=await readAsText(f); extra+=`\n[${f.name}]\n${tx.slice(0,1500)}`; }
      const sys = await buildSystem(extra);
      const isFirst = messages.length===0;
      const langNote = isAr ? "\nGenerate the lesson plan in Arabic with proper educational terminology." : "";
      const res = await fetch(API_URL, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:sys+(isFirst?`\n\nCreate complete lesson plan with sections: ## Lesson Overview ## Learning Objectives ## Materials & Resources ## Lesson Sequence ## Assessment Strategies ## Differentiation & Inclusion ## Extension${langNote}`:"\n\nRefine based on teacher feedback."),
          messages:newMessages.map(m=>({role:m.role,content:m.content})) })
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
      for (const f of extraFiles) { const tx=await readAsText(f); extra+=`\n[${f.name}]\n${tx.slice(0,1500)}`; }
      const tmpl = await readAsText(templateFile);
      const sys = await buildSystem(extra);
      const langNote = isAr ? "\nGenerate all content in Arabic." : "";
      const res = await fetch(API_URL, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:sys+"\n\nFill the template completely. Follow its structure exactly."+langNote,
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
    const b=new Blob([content],{type:"text/plain"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=filename; a.click();
  };

  const resetToHome = () => {
    setScreen("home"); setMode(null); setFrameworks([]); setAgeLevel(null);
    setGradeLevel(""); setExtraFiles([]); setTemplateFile(null);
    setMessages([]); setChatInput(""); setError("");
    setApSubject(""); setApTopic(""); setApGrade(""); setApClass("");
    setApUnit(""); setApLesson(""); setApWeek(""); setApStandards("");
  };

  // SHARED STYLES
  const S = {
    app:{ fontFamily, background:G.bg, minHeight:"100vh", color:G.text, maxWidth:480, margin:"0 auto", direction:dir },
    card:{ background:G.white, border:`1px solid ${G.border}`, borderRadius:16, padding:"18px" },
    btnPrimary:{ background:G.primary, color:"#fff", border:"none", borderRadius:10, padding:"14px 20px", fontFamily, fontWeight:600, fontSize:15, width:"100%", display:"block", cursor:"pointer" },
    btnOutline:{ background:"transparent", color:G.primary, border:`1.5px solid ${G.primary}`, borderRadius:10, padding:"10px 18px", fontFamily, fontWeight:600, fontSize:14, cursor:"pointer" },
    btnGhost:{ background:"transparent", color:G.muted, border:`1px solid ${G.border}`, borderRadius:10, padding:"10px 18px", fontFamily, fontSize:14, cursor:"pointer" },
    label:{ fontSize:12, fontWeight:700, color:G.primary, letterSpacing:".06em", textTransform:"uppercase", display:"block", marginBottom:8 },
    chip:(on)=>({ padding:"7px 14px", borderRadius:20, border:`1.5px solid ${on?G.primary:G.border}`, background:on?G.accentLight:G.white, color:on?G.primary:G.muted, cursor:"pointer", fontSize:13, fontFamily, fontWeight:on?600:400 }),
    input:{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${G.border}`, fontFamily, fontSize:14, color:G.text, background:G.white, direction:dir },
    topBar:(bg="#1a6b42")=>({ background:bg, padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }),
    langToggle:{ background:"rgba(255,255,255,.2)", border:"1px solid rgba(255,255,255,.4)", borderRadius:20, padding:"4px 12px", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily },
  };

  const LangBtn = () => (
    <button onClick={()=>setLang(isAr?"en":"ar")} style={S.langToggle}>{isAr?"EN":"عر"}</button>
  );

  const renderSections = (content, resultOutputLang) => {
    const resultIsAr = resultOutputLang === "ar";
    const sections = content.split(/\n##\s+/).filter(Boolean);
    return sections.map((s,i)=>{
      const nl=s.indexOf("\n"); const title=nl>-1?s.slice(0,nl):s; const body=nl>-1?s.slice(nl+1):"";
      return (
        <div key={i} style={{marginBottom:20,direction:resultIsAr?"rtl":"ltr"}}>
          <h3 style={{fontFamily:resultIsAr?"'Noto Kufi Arabic',sans-serif":"'Plus Jakarta Sans',sans-serif",color:G.primary,fontSize:14,fontWeight:700,marginBottom:6,borderBottom:`2px solid ${G.accentLight}`,paddingBottom:4}}>{title}</h3>
          <p style={{color:G.text,fontSize:13.5,lineHeight:1.9,whiteSpace:"pre-wrap",fontFamily:resultIsAr?"'Noto Kufi Arabic',sans-serif":fontFamily}}>{body}</p>
        </div>
      );
    });
  };

  // LOADING
  if (authLoading) return (
    <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <div style={{width:40,height:40,borderRadius:"50%",border:`3px solid ${G.border}`,borderTopColor:G.primary,animation:"spin 1s linear infinite"}}/>
    </div>
  );

  // AUTH
  if (!user) return (
    <div style={{...S.app,minHeight:"100vh",display:"flex",flexDirection:"column"}} className="fade">
      <div style={{background:G.white,borderBottom:`1px solid ${G.border}`,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <img src={LOGO_URL} alt="Dar Al-Thikr" style={{height:38,objectFit:"contain"}} onError={e=>e.target.style.display='none'}/>
        <button onClick={()=>setLang(isAr?"en":"ar")} style={{background:G.accentLight,border:`1px solid ${G.border}`,borderRadius:20,padding:"5px 14px",color:G.primary,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily}}>{isAr?"EN":"عر"}</button>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 20px"}}>
        <div style={{width:64,height:64,borderRadius:18,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:16,boxShadow:`0 8px 24px ${G.primary}30`}}>📝</div>
        <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:26,color:G.primary,marginBottom:6}}>EduBudd</h1>
        <p style={{color:G.muted,fontSize:14,marginBottom:28,textAlign:"center"}}>{t.tagline}</p>
        <div style={{width:"100%",maxWidth:360}}>
          <div style={{display:"flex",background:G.surface,borderRadius:10,padding:4,marginBottom:20}}>
            {["signin","signup"].map(tab=>(
              <button key={tab} onClick={()=>{setAuthTab(tab);setAuthError("");setAuthSuccess("");}} style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:authTab===tab?G.white:"transparent",color:authTab===tab?G.primary:G.muted,fontFamily,fontWeight:600,fontSize:14,boxShadow:authTab===tab?"0 1px 4px #00000015":"none",cursor:"pointer"}}>
                {tab==="signin"?t.signIn:t.signUp}
              </button>
            ))}
          </div>
          <form onSubmit={handleAuth} style={{display:"flex",flexDirection:"column",gap:12}}>
            {authTab==="signup"&&<input value={authName} onChange={e=>setAuthName(e.target.value)} placeholder={t.fullName} style={S.input} required/>}
            <input type="email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder={t.email} style={S.input} required/>
            <input type="password" value={authPassword} onChange={e=>setAuthPassword(e.target.value)} placeholder={t.password} style={S.input} required minLength={6}/>
            {authError&&<div style={{background:"#fff0f0",border:"1px solid #fcc",borderRadius:8,padding:"10px 12px",color:G.red,fontSize:13}}>{authError}</div>}
            {authSuccess&&<div style={{background:G.accentLight,border:`1px solid ${G.border}`,borderRadius:8,padding:"10px 12px",color:G.primary,fontSize:13}}>{authSuccess}</div>}
            <button type="submit" disabled={authSubmitting} style={{...S.btnPrimary,opacity:authSubmitting?.7:1,marginTop:4}}>
              {authSubmitting?t.pleaseWait:authTab==="signin"?t.signInBtn:t.signUpBtn}
            </button>
          </form>
          <p style={{textAlign:"center",color:G.muted,fontSize:12,marginTop:16}}>
            {authTab==="signin"?t.noAccount:t.haveAccount}{" "}
            <button onClick={()=>setAuthTab(authTab==="signin"?"signup":"signin")} style={{background:"none",border:"none",color:G.primary,fontWeight:600,cursor:"pointer",fontSize:12,fontFamily}}>
              {authTab==="signin"?t.signUp:t.signIn}
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
      <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:20,color:G.primary}}>{t.building}</p>
      <p style={{color:G.muted,fontSize:13}}>{t.poweredBy}</p>
    </div>
  );

  // RESULT (Template + American Pathway)
  if (screen==="result") {
    const content = messages[0]?.content||"";
    const resultLang = messages[0]?.outputLang || lang;
    return (
      <div style={{...S.app,padding:"0 0 32px"}} className="fade">
        <div style={S.topBar()}>
          <button onClick={resetToHome} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>{t.back}</button>
          <span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15}}>{t.lessonReady}</span>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <LangBtn/>
            <button onClick={()=>downloadText(content)} style={{background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.4)",borderRadius:8,padding:"6px 12px",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>{t.download}</button>
          </div>
        </div>
        <div style={{padding:"16px"}}>
          <div style={{...S.card,maxHeight:"72vh",overflowY:"auto"}}>{renderSections(content, resultLang)}</div>
          <button onClick={resetToHome} style={{...S.btnPrimary,marginTop:14}}>+ {t.creating}</button>
        </div>
      </div>
    );
  }

  // HISTORY DETAIL
  if (viewingHistory) {
    return (
      <div style={{...S.app,padding:"0 0 32px"}} className="fade">
        <div style={S.topBar()}>
          <button onClick={()=>setViewingHistory(null)} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>{t.back}</button>
          <span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14}}>{t.pastPlan}</span>
          <div style={{display:"flex",gap:8}}><LangBtn/><button onClick={()=>downloadText(viewingHistory.content)} style={{background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.4)",borderRadius:8,padding:"6px 12px",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>{t.download}</button></div>
        </div>
        <div style={{padding:"16px"}}>
          <div style={{background:G.accentLight,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:G.primary}}>📅 {viewingHistory.date} · {viewingHistory.ageLevel} · {viewingHistory.mode}</div>
          <div style={{...S.card,maxHeight:"70vh",overflowY:"auto"}}>{renderSections(viewingHistory.content, "en")}</div>
        </div>
      </div>
    );
  }

  // HISTORY LIST
  if (screen==="history") return (
    <div style={{...S.app,padding:"0 0 32px"}} className="fade">
      <div style={S.topBar()}>
        <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>{t.back}</button>
        <span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:16}}>{t.history}</span>
        <LangBtn/>
      </div>
      <div style={{padding:"16px"}}>
        {history.length===0?(
          <div style={{textAlign:"center",padding:"60px 20px",color:G.muted}}>
            <div style={{fontSize:40,marginBottom:12}}>📋</div>
            <p style={{fontWeight:600}}>{t.noHistory}</p>
            <p style={{fontSize:13,marginTop:4}}>{t.noHistoryDesc}</p>
          </div>
        ):history.map(h=>(
          <div key={h.id} onClick={()=>setViewingHistory(h)} style={{...S.card,marginBottom:10,cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:14,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.title||"Lesson Plan"}</p>
                <p style={{fontSize:12,color:G.muted}}>{h.ageLevel} · {h.frameworks?.split(",")[0]}</p>
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
        <div style={S.topBar()}>
          <button onClick={resetToHome} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>{t.back}</button>
          <div style={{textAlign:"center"}}>
            <p style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14}}>{t.freeMode}</p>
            <p style={{color:"rgba(255,255,255,.7)",fontSize:11}}>{frameworks.slice(0,2).join(", ")} · {AGE_LEVELS.find(a=>a.value===ageLevel)?.[isAr?"labelAr":"label"]}</p>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <LangBtn/>
            <button onClick={()=>setShowModal(true)} style={{background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.3)",borderRadius:14,padding:"4px 10px",color:"#fff",fontSize:12,cursor:"pointer"}}>⚡{credits}</button>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
          {messages.length===0&&(
            <div style={{textAlign:"center",padding:"32px 20px",color:G.muted}} className="fade">
              <div style={{fontSize:36,marginBottom:10}}>💬</div>
              <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:16,color:G.primary,marginBottom:6}}>{t.describeLesson}</p>
              <p style={{fontSize:13,lineHeight:1.6}}>{t.describeHint}</p>
              <div style={{background:G.accentLight,borderRadius:10,padding:"12px",marginTop:16,textAlign:isAr?"right":"left"}}>
                <p style={{fontSize:12,color:G.primary,fontWeight:600,marginBottom:4}}>{t.example}:</p>
                <p style={{fontSize:12,color:G.muted,lineHeight:1.6}}>{t.exampleText}</p>
              </div>
            </div>
          )}
          {messages.map((m,i)=>(
            <div key={i} className="msg" style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?(isAr?"flex-start":"flex-end"):(isAr?"flex-end":"flex-start")}}>
              {m.role==="user"?(
                <div style={{background:G.primary,color:"#fff",borderRadius:isAr?"16px 16px 16px 4px":"16px 16px 4px 16px",padding:"10px 14px",maxWidth:"82%",fontSize:14,lineHeight:1.6}}>{m.content}</div>
              ):(
                <div style={{maxWidth:"92%"}}>
                  <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:isAr?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"14px",fontSize:13.5,lineHeight:1.8,color:G.text}}>
                    {renderSections(m.content, lang)}
                  </div>
                  <button onClick={()=>downloadText(m.content)} style={{background:"none",border:"none",color:G.primary,fontSize:12,fontWeight:600,marginTop:6,padding:"2px 4px",cursor:"pointer"}}>{t.downloading}</button>
                </div>
              )}
            </div>
          ))}
          {isLoading&&(
            <div className="msg" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:G.white,border:`1px solid ${G.border}`,borderRadius:12,width:"fit-content"}}>
              <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${G.border}`,borderTopColor:G.primary,animation:"spin 1s linear infinite"}}/>
              <span style={{fontSize:13,color:G.muted}}>{t.building}</span>
            </div>
          )}
          {error&&<div style={{background:"#fff0f0",border:"1px solid #fcc",borderRadius:10,padding:"10px 14px",color:G.red,fontSize:13}}>{error}</div>}
          <div ref={chatEndRef}/>
        </div>
        <div style={{padding:"0 12px 4px",flexShrink:0}}>
          <input type="file" ref={extraRef} multiple onChange={e=>setExtraFiles([...e.target.files])} style={{display:"none"}}/>
          {extraFiles.length>0&&<p style={{fontSize:11,color:G.primary,marginBottom:4}}>📎 {extraFiles.length}</p>}
        </div>
        <div style={{padding:"8px 12px 16px",background:G.white,borderTop:`1px solid ${G.border}`,flexShrink:0,display:"flex",gap:8,alignItems:"flex-end",flexDirection:isAr?"row-reverse":"row"}}>
          <button onClick={()=>extraRef.current.click()} style={{background:G.accentLight,border:"none",borderRadius:10,padding:"10px",color:G.primary,flexShrink:0,fontSize:16,cursor:"pointer"}}>📎</button>
          <textarea value={chatInput} onChange={e=>setChatInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}
            placeholder={messages.length===0?t.describeLesson:t.followUp}
            style={{flex:1,minHeight:42,maxHeight:120,background:G.surface,border:`1px solid ${G.border}`,borderRadius:10,padding:"10px 12px",fontFamily,fontSize:14,resize:"none",color:G.text,lineHeight:1.5,direction:dir}} rows={1}/>
          <button onClick={sendChat} disabled={!canSend} style={{background:canSend?G.primary:G.border,border:"none",borderRadius:10,padding:"10px 14px",color:"#fff",fontWeight:700,fontSize:16,flexShrink:0,cursor:"pointer"}}>{t.send}</button>
        </div>
      </div>
    );
  }

  // AMERICAN PATHWAY SCREEN
  if (screen==="american") {
    const canGenerate = apSubject.trim()&&apTopic.trim();
    return (
      <div style={{...S.app,padding:"0 0 32px"}} className="fade">
        <div style={S.topBar()}>
          <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>{t.back}</button>
          <span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15}}>{t.americanSetup}</span>
          <LangBtn/>
        </div>
        <div style={{padding:"16px"}}>
          {error&&<div style={{background:"#fff0f0",border:"1px solid #fcc",borderRadius:10,padding:"12px",marginBottom:14,color:G.red,fontSize:13}}>{error}</div>}

          <div style={{...S.card,marginBottom:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div>
                <span style={S.label}>{t.subject} *</span>
                <input value={apSubject} onChange={e=>setApSubject(e.target.value)} placeholder={t.subjectHint} style={S.input}/>
              </div>
              <div>
                <span style={S.label}>{t.gradeLevel}</span>
                <input value={apGrade} onChange={e=>setApGrade(e.target.value)} placeholder="e.g. Grade 4" style={S.input}/>
              </div>
            </div>
            <span style={S.label}>{t.topic} *</span>
            <input value={apTopic} onChange={e=>setApTopic(e.target.value)} placeholder={t.topicHint} style={{...S.input,marginBottom:10}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              <div><span style={S.label}>{t.classField}</span><input value={apClass} onChange={e=>setApClass(e.target.value)} placeholder={t.classHint} style={S.input}/></div>
              <div><span style={S.label}>{t.unit}</span><input value={apUnit} onChange={e=>setApUnit(e.target.value)} placeholder={t.unitHint} style={S.input}/></div>
              <div><span style={S.label}>{t.week}</span><input value={apWeek} onChange={e=>setApWeek(e.target.value)} placeholder={t.weekHint} style={S.input}/></div>
            </div>
          </div>

          <div style={{...S.card,marginBottom:14}}>
            <span style={S.label}>{t.lessonNum}</span>
            <input value={apLesson} onChange={e=>setApLesson(e.target.value)} placeholder={t.lessonNumHint} style={{...S.input,marginBottom:10}}/>
            <span style={S.label}>{t.duration}</span>
            <select value={apDuration} onChange={e=>setApDuration(e.target.value)} style={{...S.input,marginBottom:10}}>
              {DURATIONS.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
            <span style={S.label}>{t.standards}</span>
            <textarea value={apStandards} onChange={e=>setApStandards(e.target.value)} placeholder={t.standardsHint} style={{...S.input,minHeight:70,resize:"vertical"}}/>
          </div>

          <div style={{...S.card,marginBottom:16}}>
            <span style={S.label}>{t.outputLang}</span>
            <div style={{display:"flex",gap:10}}>
              {["en","ar"].map(l=>(
                <button key={l} onClick={()=>setApOutputLang(l)} style={{...S.chip(apOutputLang===l),flex:1,textAlign:"center"}}>
                  {l==="en"?"🇬🇧 "+t.english:"🇸🇦 "+t.arabic}
                </button>
              ))}
            </div>
          </div>

          <button onClick={generateAmericanPathway} disabled={!canGenerate} style={{...S.btnPrimary,opacity:canGenerate?1:.4}}>
            {t.generateAmerican}
          </button>
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
        <div style={S.topBar()}>
          <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>{t.back}</button>
          <span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:16}}>{t.lessonSetup}</span>
          <LangBtn/>
        </div>
        <div style={{padding:"16px"}}>
          <div style={{...S.card,marginBottom:14}}>
            <span style={S.label}>{t.selectFrameworks}</span>
            <p style={{fontSize:12,color:G.muted,marginBottom:10}}>{t.selectAll}</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {FRAMEWORKS.map(fw=>(<button key={fw} onClick={()=>toggleFw(fw)} style={S.chip(frameworks.includes(fw))}>{fw}</button>))}
            </div>
          </div>
          <div style={{...S.card,marginBottom:14}}>
            <span style={S.label}>{t.ageLevel}</span>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {AGE_LEVELS.map(al=>{const on=ageLevel===al.value; return (
                <button key={al.value} onClick={()=>{setAgeLevel(al.value);setGradeLevel("");}} style={{padding:"12px",borderRadius:10,border:`1.5px solid ${on?G.primary:G.border}`,background:on?G.accentLight:G.white,textAlign:isAr?"right":"left",cursor:"pointer"}}>
                  <div style={{fontSize:18,marginBottom:2}}>{al.emoji}</div>
                  <div style={{fontSize:13,fontWeight:600,color:on?G.primary:G.text}}>{isAr?al.labelAr:al.label}</div>
                  <div style={{fontSize:11,color:G.muted}}>{isAr?al.subAr:al.sub}</div>
                </button>
              );})}
            </div>
          </div>
          {grades.length>0&&(
            <div style={{...S.card,marginBottom:14}}>
              <span style={S.label}>{t.gradeLevel} <span style={{color:G.muted,textTransform:"none",letterSpacing:0,fontWeight:400}}>{t.optional}</span></span>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {grades.map(g=>(<button key={g} onClick={()=>setGradeLevel(gradeLevel===g?"":g)} style={S.chip(gradeLevel===g)}>{g}</button>))}
              </div>
            </div>
          )}
          <button onClick={()=>setScreen(mode===1?"input":"chat")} disabled={!canContinue} style={{...S.btnPrimary,opacity:canContinue?1:.4}}>{t.continue}</button>
        </div>
      </div>
    );
  }

  // TEMPLATE INPUT
  if (screen==="input") return (
    <div style={{...S.app,padding:"0 0 32px"}} className="fade">
      <div style={S.topBar()}>
        <button onClick={()=>setScreen("setup")} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>{t.back}</button>
        <span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:16}}>{t.templateMode}</span>
        <div style={{display:"flex",gap:6}}><LangBtn/><button onClick={()=>setShowModal(true)} style={{background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.3)",borderRadius:14,padding:"4px 10px",color:"#fff",fontSize:12,cursor:"pointer"}}>⚡{credits}</button></div>
      </div>
      <div style={{padding:"16px"}}>
        {error&&<div style={{background:"#fff0f0",border:"1px solid #fcc",borderRadius:10,padding:"12px",marginBottom:14,color:G.red,fontSize:13}}>{error}</div>}
        <div style={{...S.card,marginBottom:14}}>
          <span style={S.label}>{t.yourTemplate}</span>
          <input type="file" ref={templateRef} onChange={e=>setTemplateFile(e.target.files[0])} accept=".txt,.doc,.docx" style={{display:"none"}}/>
          <button onClick={()=>templateRef.current.click()} style={{...S.btnOutline,width:"100%",padding:"14px"}}>
            {templateFile?`✓  ${templateFile.name}`:t.uploadTemplate}
          </button>
        </div>
        <div style={{...S.card,marginBottom:14}}>
          <span style={S.label}>{t.refFiles} <span style={{color:G.muted,textTransform:"none",letterSpacing:0,fontWeight:400}}>{t.optional}</span></span>
          <input type="file" ref={extraRef} multiple onChange={e=>setExtraFiles([...e.target.files])} style={{display:"none"}}/>
          <button onClick={()=>extraRef.current.click()} style={{...S.btnGhost,width:"100%",padding:"12px"}}>
            {extraFiles.length>0?`📎  ${extraFiles.length}`:t.attachRef}
          </button>
        </div>
        <button onClick={generateTemplate} disabled={!templateFile} style={{...S.btnPrimary,opacity:templateFile?1:.4}}>{t.generate}</button>
      </div>
    </div>
  );

  // HOME
  return (
    <div style={S.app} className="fade">
      <div style={{background:G.white,borderBottom:`1px solid ${G.border}`,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <img src={LOGO_URL} alt="Dar Al-Thikr" style={{height:36,objectFit:"contain"}} onError={e=>e.target.style.display='none'}/>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>setLang(isAr?"en":"ar")} style={{background:G.accentLight,border:`1px solid ${G.border}`,borderRadius:20,padding:"5px 12px",color:G.primary,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily}}>{isAr?"EN":"عر"}</button>
          <button onClick={()=>setScreen("history")} style={{...S.btnGhost,padding:"7px 12px",fontSize:13}}>📋</button>
          <button onClick={()=>setShowModal(true)} style={{background:G.accentLight,border:`1px solid ${G.border}`,borderRadius:10,padding:"7px 12px",color:G.primary,fontSize:13,fontWeight:600,cursor:"pointer"}}>⚡{credits}</button>
          <button onClick={signOut} style={{...S.btnGhost,padding:"7px 12px",fontSize:13}}>{t.signOut}</button>
        </div>
      </div>

      <div style={{padding:"28px 18px 20px",textAlign:"center",background:`linear-gradient(180deg,${G.white} 0%,${G.bg} 100%)`}}>
        <div style={{width:60,height:60,borderRadius:18,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:28,boxShadow:`0 8px 24px ${G.primary}30`}}>📝</div>
        <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:26,color:G.primary,marginBottom:8}}>EduBudd</h1>
        <p style={{color:G.muted,fontSize:14,lineHeight:1.65,maxWidth:300,margin:"0 auto"}}>{t.tagline}</p>
        <p style={{color:G.primary,fontSize:13,marginTop:8,fontWeight:600}}>{t.welcome}</p>
      </div>

      <div style={{padding:"0 16px 32px"}}>
        <p style={{fontSize:11,color:G.muted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:12,fontWeight:600}}>{t.chooseMode}</p>

        {[
          {id:1,icon:"📋",title:t.templateMode,desc:t.templateDesc,tag:t.templateTag,color:G.primary,bg:G.accentLight,onClick:()=>{setMode(1);setScreen("setup");}},
          {id:2,icon:"💬",title:t.freeMode,desc:t.freeDesc,tag:t.freeTag,color:"#2a6eb5",bg:"#e8f0fb",onClick:()=>{setMode(2);setScreen("setup");}},
          {id:3,icon:"🏫",title:t.americanMode,desc:t.americanDesc,tag:t.americanTag,color:"#7a3a9a",bg:"#f3eafc",onClick:()=>{setMode(3);setScreen("american");}},
        ].map(m=>(
          <div key={m.id} onClick={m.onClick} style={{...S.card,marginBottom:12,cursor:"pointer",display:"flex",gap:14,alignItems:"flex-start",transition:"box-shadow .15s"}}>
            <div style={{width:48,height:48,borderRadius:13,background:m.bg,border:`1px solid ${m.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{m.icon}</div>
            <div>
              <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:16,color:G.text,marginBottom:4}}>{m.title}</h3>
              <p style={{color:G.muted,fontSize:13,lineHeight:1.6}}>{m.desc}</p>
              <span style={{display:"inline-block",marginTop:8,background:m.bg,borderRadius:6,padding:"3px 10px",color:m.color,fontSize:11,fontWeight:700}}>{m.tag.toUpperCase()}</span>
            </div>
          </div>
        ))}

        {history.length>0&&(
          <div style={{...S.card,background:G.accentLight,borderColor:G.border,marginTop:4}}>
            <p style={{fontSize:12,fontWeight:600,color:G.primary,marginBottom:8}}>{t.recentPlans}</p>
            {history.slice(0,2).map(h=>(
              <div key={h.id} onClick={()=>setViewingHistory(h)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${G.border}`,cursor:"pointer"}}>
                <div>
                  <p style={{fontSize:13,fontWeight:600,color:G.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:220}}>{h.title}</p>
                  <p style={{fontSize:11,color:G.muted}}>{h.ageLevel} · {h.date}</p>
                </div>
                <span style={{color:G.primary,fontSize:13}}>→</span>
              </div>
            ))}
            <button onClick={()=>setScreen("history")} style={{background:"none",border:"none",color:G.primary,fontSize:12,fontWeight:600,marginTop:8,padding:0,cursor:"pointer"}}>{t.viewAll}</button>
          </div>
        )}
      </div>

      {showModal&&(
        <div style={{position:"fixed",inset:0,background:"#00000070",zIndex:200,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowModal(false)}>
          <div style={{...S.card,width:"100%",maxWidth:480,margin:"0 auto",borderRadius:"20px 20px 0 0",padding:"24px 20px 36px",animation:"slideUp .3s ease"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:18}}>{t.yourCredits}</h3>
                <p style={{color:G.muted,fontSize:13,marginTop:2}}><strong style={{color:G.primary}}>{credits} {t.credits}</strong> {t.creditsLeft}</p>
              </div>
              <button onClick={()=>setShowModal(false)} style={{background:"none",border:"none",color:G.muted,fontSize:22,cursor:"pointer"}}>×</button>
            </div>
            <div style={{background:G.accentLight,border:`1px solid ${G.border}`,borderRadius:12,padding:"14px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{fontWeight:600,fontSize:14,marginBottom:2}}>{t.watchAd}</p>
                  <p style={{color:G.muted,fontSize:12}}>{t.watchAdDesc}</p>
                  {adDone&&<p style={{color:G.primary,fontSize:12,marginTop:3,fontWeight:600}}>{t.creditAdded}</p>}
                </div>
                <button onClick={watchAd} disabled={adTimer!==null} style={{background:G.primary,color:"#fff",border:"none",borderRadius:8,padding:"10px 18px",fontFamily,fontWeight:600,fontSize:13,cursor:"pointer"}}>
                  {adTimer!==null?`${adTimer}s…`:t.watch}
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
