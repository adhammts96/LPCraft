// @ts-nocheck 
import { useState, useEffect, useRef } from 'react';

const FRAMEWORKS = [
  'CCSS',
  'Cambridge',
  'IB',
  'CELTA Style',
  '5Es Model',
  'SIOP',
  "Bloom's Taxonomy",
  'UbD',
  'Montessori',
  'STEAM',
  'General English',
  'Project-Based Learning',
  'Competency-Based',
  'Flipped Classroom',
];

const AGE_LEVELS = [
  {
    label: 'Early Childhood',
    sub: 'Ages 3–5',
    value: 'early_childhood',
    emoji: '🌱',
  },
  { label: 'Primary', sub: 'Ages 6–11', value: 'primary', emoji: '📚' },
  {
    label: 'Middle School',
    sub: 'Ages 12–14',
    value: 'middle_school',
    emoji: '🔬',
  },
  {
    label: 'High School',
    sub: 'Ages 15–18',
    value: 'high_school',
    emoji: '🎓',
  },
  { label: 'Adult / Higher Ed', sub: '18+', value: 'adult', emoji: '🏛️' },
  { label: 'Mixed / Flexible', sub: 'Open range', value: 'mixed', emoji: '♾️' },
];

const GRADE_MAP = {
  early_childhood: ['Pre-K', 'Kindergarten'],
  primary: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
  middle_school: ['Grade 7', 'Grade 8', 'Grade 9'],
  high_school: ['Grade 10', 'Grade 11', 'Grade 12'],
  adult: ['Undergraduate', 'Postgraduate', 'Professional', 'N/A'],
  mixed: ['N/A'],
};

const PLANS = [
  { name: 'Starter', credits: 50, price: '$4.99', note: 'one-time' },
  {
    name: 'Pro',
    credits: 200,
    price: '$9.99',
    note: 'one-time',
    popular: true,
  },
  { name: 'Unlimited', credits: '∞', price: '$19.99', note: 'per month' },
];

const G = {
  bg: '#07111d',
  surface: '#0d1e2e',
  card: '#101f30',
  border: '#1a3048',
  gold: '#e8a020',
  goldLight: '#f5c660',
  cream: '#f0ece4',
  muted: '#5a7a96',
  blue: '#2a8fff',
};

const injectStyles = () => {
  if (document.getElementById('lc-styles')) return;
  const s = document.createElement('style');
  s.id = 'lc-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
    @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
    .lc-fade { animation: fadeUp .35s ease both; }
    .lc-mode:hover { transform: translateY(-2px); box-shadow: 0 8px 32px #00000060; }
    .lc-chip:hover { opacity: .85; }
    .lc-age:hover { border-color: #e8a02080 !important; }
  `;
  document.head.appendChild(s);
};

export default function App() {
  const [screen, setScreen] = useState('home');
  const [mode, setMode] = useState(null);
  const [frameworks, setFrameworks] = useState([]);
  const [ageLevel, setAgeLevel] = useState(null);
  const [gradeLevel, setGradeLevel] = useState('');
  const [extraFiles, setExtraFiles] = useState([]);
  const [templateFile, setTemplateFile] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [credits, setCredits] = useState(10);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [adTimer, setAdTimer] = useState(null);
  const [copied, setCopied] = useState(false);
  const [adDone, setAdDone] = useState(false);

  const extraRef = useRef();
  const templateRef = useRef();

  useEffect(() => {
    injectStyles();
    (async () => {
      try {
        const r = await window.storage.get('lc_v1');
        if (r) {
          const d = JSON.parse(r.value);
          const weekMs = 7 * 24 * 60 * 60 * 1000;
          if (Date.now() - d.weekStart > weekMs) {
            const n = { credits: 10, weekStart: Date.now() };
            await window.storage.set('lc_v1', JSON.stringify(n));
            setCredits(10);
          } else {
            setCredits(d.credits);
          }
        } else {
          await window.storage.set(
            'lc_v1',
            JSON.stringify({ credits: 10, weekStart: Date.now() })
          );
        }
      } catch {}
    })();
  }, []);

  const saveCredits = async (n) => {
    setCredits(n);
    try {
      const r = await window.storage.get('lc_v1');
      const weekStart = r ? JSON.parse(r.value).weekStart : Date.now();
      await window.storage.set(
        'lc_v1',
        JSON.stringify({ credits: n, weekStart })
      );
    } catch {}
  };

  const watchAd = () => {
    if (adTimer !== null) return;
    setAdDone(false);
    setAdTimer(5);
    const t = setInterval(() => {
      setAdTimer((p) => {
        if (p <= 1) {
          clearInterval(t);
          setAdTimer(null);
          setAdDone(true);
          saveCredits(credits + 1);
          return null;
        }
        return p - 1;
      });
    }, 1000);
  };

  const toggleFw = (fw) =>
    setFrameworks((p) =>
      p.includes(fw) ? p.filter((f) => f !== fw) : [...p, fw]
    );

  const readAsText = (file) =>
    new Promise((res) => {
      const r = new FileReader();
      r.onload = (e) => res(e.target.result);
      r.onerror = () => res(`[${file.name}]`);
      r.readAsText(file);
    });

  const generate = async () => {
    if (credits <= 0) {
      setShowModal(true);
      return;
    }
    setScreen('generating');
    setError('');
    try {
      const fwStr = frameworks.length
        ? frameworks.join(', ')
        : 'General curriculum';
      const ageInfo = AGE_LEVELS.find((a) => a.value === ageLevel);
      const ageStr = ageInfo
        ? `${ageInfo.label} (${ageInfo.sub})`
        : 'Not specified';
      let extra = '';
      for (const f of extraFiles) {
        const txt = await readAsText(f);
        extra += `\n\n[Reference: ${f.name}]\n${txt.slice(0, 2000)}`;
      }
      const sys = `You are an expert lesson plan designer with mastery of: ${fwStr}.
Create a thorough, classroom-ready lesson plan using these sections:
## Lesson Overview
## Learning Objectives  
## Materials & Resources
## Lesson Sequence (with timing)
## Assessment Strategies
## Differentiation & Inclusion
## Extension / Homework

Student profile — Age: ${ageStr} | Grade: ${
        gradeLevel || 'Not specified'
      } | Frameworks: ${fwStr}
${extra ? `\nTeacher's reference materials:${extra}` : ''}
Be specific, practical, and pedagogically rigorous. Use bullet points and clear timing within the Lesson Sequence.`;

      let userMsg;
      if (mode === 1 && templateFile) {
        const tmpl = await readAsText(templateFile);
        userMsg = `Use this template as your exact structure and fill every section completely:\n\nTEMPLATE:\n${tmpl.slice(
          0,
          3000
        )}\n\nTEACHER NOTES:\n${userInput || 'None provided'}`;
      } else {
        userMsg = userInput;
      }

      const res = await fetch('https:///api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: sys,
          messages: [{ role: 'user', content: userMsg }],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content.map((b) => b.text || '').join('\n');
      setResult(text);
      await saveCredits(credits - 1);
      setScreen('result');
    } catch (e) {
      setError(e.message || 'Generation failed. Please try again.');
      setScreen('input');
    }
  };

  const download = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'lesson-plan.txt';
    a.click();
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setScreen('home');
    setMode(null);
    setFrameworks([]);
    setAgeLevel(null);
    setGradeLevel('');
    setExtraFiles([]);
    setTemplateFile(null);
    setUserInput('');
    setResult('');
    setError('');
  };

  // ──── shared styles ────
  const base = {
    fontFamily: "'DM Sans',sans-serif",
    background: G.bg,
    minHeight: '100vh',
    color: G.cream,
  };
  const card = (extra = {}) => ({
    background: G.card,
    border: `1px solid ${G.border}`,
    borderRadius: 16,
    padding: '20px',
    ...extra,
  });
  const btn = (v = 'gold') => ({
    padding: '13px 24px',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'DM Sans',sans-serif",
    fontWeight: 600,
    fontSize: 14,
    transition: 'all .2s',
    ...(v === 'gold'
      ? {
          background: `linear-gradient(135deg,${G.gold},${G.goldLight})`,
          color: '#07111d',
        }
      : v === 'ghost'
      ? {
          background: 'transparent',
          color: G.muted,
          border: `1px solid ${G.border}`,
        }
      : {
          background: G.surface,
          color: G.cream,
          border: `1px solid ${G.border}`,
        }),
  });
  const label = {
    fontSize: 12,
    fontWeight: 600,
    color: G.goldLight,
    letterSpacing: '.08em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 10,
  };

  // ──── GENERATING ────
  if (screen === 'generating')
    return (
      <div
        style={{
          ...base,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: `3px solid ${G.border}`,
            borderTopColor: G.gold,
            animation: 'spin 1s linear infinite',
          }}
        />
        <p
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 22,
            color: G.gold,
          }}
        >
          Crafting your lesson plan…
        </p>
        <p style={{ color: G.muted, fontSize: 13 }}>
          Powered by Claude · Usually takes 10–20 seconds
        </p>
      </div>
    );

  // ──── RESULT ────
  if (screen === 'result') {
    const sections = result.split(/\n##\s+/).filter(Boolean);
    const firstIsTitle = !result.trimStart().startsWith('##');
    return (
      <div style={{ ...base, padding: '20px 16px' }} className="lc-fade">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 20,
                color: G.gold,
              }}
            >
              Lesson Plan Ready
            </h2>
            <p style={{ color: G.muted, fontSize: 12, marginTop: 3 }}>
              ⚡ {credits} credits remaining
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={copy} style={btn('outline')}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
            <button onClick={download} style={btn('outline')}>
              ↓ Save
            </button>
          </div>
        </div>

        <div
          style={{
            ...card(),
            maxHeight: '65vh',
            overflowY: 'auto',
            fontSize: 13.5,
            lineHeight: 1.85,
            marginBottom: 20,
          }}
        >
          {firstIsTitle && sections.length > 0 ? (
            <>
              <p style={{ color: G.muted, fontSize: 13, marginBottom: 16 }}>
                {sections[0]}
              </p>
              {sections.slice(1).map((s, i) => {
                const nl = s.indexOf('\n');
                const title = nl > -1 ? s.slice(0, nl) : s;
                const body = nl > -1 ? s.slice(nl + 1) : '';
                return (
                  <div key={i} style={{ marginBottom: 20 }}>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        color: G.goldLight,
                        fontSize: 15,
                        marginBottom: 6,
                        borderBottom: `1px solid ${G.border}`,
                        paddingBottom: 5,
                      }}
                    >
                      {title}
                    </h3>
                    <p style={{ color: '#c5bdb0', whiteSpace: 'pre-wrap' }}>
                      {body}
                    </p>
                  </div>
                );
              })}
            </>
          ) : (
            sections.map((s, i) => {
              const nl = s.indexOf('\n');
              const title = nl > -1 ? s.slice(0, nl) : s;
              const body = nl > -1 ? s.slice(nl + 1) : '';
              return (
                <div key={i} style={{ marginBottom: 20 }}>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      color: G.goldLight,
                      fontSize: 15,
                      marginBottom: 6,
                      borderBottom: `1px solid ${G.border}`,
                      paddingBottom: 5,
                    }}
                  >
                    {title}
                  </h3>
                  <p style={{ color: '#c5bdb0', whiteSpace: 'pre-wrap' }}>
                    {body}
                  </p>
                </div>
              );
            })
          )}
        </div>

        <button onClick={reset} style={{ ...btn('gold'), width: '100%' }}>
          + Create Another Lesson Plan
        </button>
      </div>
    );
  }

  // ──── INPUT ────
  if (screen === 'input') {
    const canGo =
      mode === 2
        ? userInput.trim().length > 10
        : templateFile || userInput.trim().length > 5;
    return (
      <div style={{ ...base, padding: '20px 16px' }} className="lc-fade">
        {/* nav */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 22,
          }}
        >
          <button
            onClick={() => setScreen('setup')}
            style={{
              background: 'none',
              border: 'none',
              color: G.muted,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            ← Back
          </button>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: `${G.gold}18`,
              border: `1px solid ${G.gold}40`,
              borderRadius: 20,
              padding: '5px 14px',
              color: G.goldLight,
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            ⚡ {credits} credits
          </button>
        </div>

        <h2
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 22,
            marginBottom: 5,
          }}
        >
          {mode === 1 ? 'Upload Your Template' : 'Describe Your Lesson'}
        </h2>
        <p style={{ color: G.muted, fontSize: 13, marginBottom: 22 }}>
          {mode === 1
            ? 'Upload a template file — AI will fill every section for you'
            : 'Describe the lesson in plain language, as much or as little detail as you like'}
        </p>

        {error && (
          <div
            style={{
              background: '#200a0a',
              border: `1px solid #e05555`,
              borderRadius: 10,
              padding: 14,
              marginBottom: 18,
              color: '#ff9090',
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {mode === 1 && (
          <div style={{ marginBottom: 18 }}>
            <span style={label}>Your Template File</span>
            <input
              type="file"
              ref={templateRef}
              onChange={(e) => setTemplateFile(e.target.files[0])}
              accept=".txt,.doc,.docx,.pdf"
              style={{ display: 'none' }}
            />
            <button
              onClick={() => templateRef.current.click()}
              style={{ ...btn('outline'), width: '100%', textAlign: 'center' }}
            >
              {templateFile
                ? `✓  ${templateFile.name}`
                : '📄  Choose Template File (.txt / .docx / .pdf)'}
            </button>
          </div>
        )}

        <div style={{ marginBottom: 18 }}>
          <span style={label}>
            {mode === 1
              ? 'Additional Notes for the AI (optional)'
              : 'Lesson Description'}
          </span>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={
              mode === 1
                ? 'Any specific instructions, preferred activities, or context for the AI…'
                : "e.g. A 45-minute lesson on the water cycle for Grade 5. Include a hands-on activity, group work, and an exit ticket assessment. We've covered evaporation last week."
            }
            style={{
              width: '100%',
              minHeight: 140,
              background: G.surface,
              border: `1px solid ${G.border}`,
              borderRadius: 10,
              color: G.cream,
              padding: '12px 14px',
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 13.5,
              resize: 'vertical',
              lineHeight: 1.65,
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <span style={label}>Reference Files (optional)</span>
          <input
            type="file"
            ref={extraRef}
            multiple
            onChange={(e) => setExtraFiles([...e.target.files])}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => extraRef.current.click()}
            style={{ ...btn('ghost'), width: '100%' }}
          >
            {extraFiles.length > 0
              ? `📎  ${extraFiles.length} file(s) attached`
              : '+  Attach Textbook Pages, Rubrics, or Notes'}
          </button>
        </div>

        <button
          onClick={generate}
          disabled={!canGo}
          style={{ ...btn('gold'), width: '100%', opacity: canGo ? 1 : 0.4 }}
        >
          Generate Lesson Plan (1 credit)
        </button>
      </div>
    );
  }

  // ──── SETUP ────
  if (screen === 'setup') {
    const grades = ageLevel ? GRADE_MAP[ageLevel] : [];
    const canContinue = frameworks.length > 0 && ageLevel;
    return (
      <div style={{ ...base, padding: '20px 16px' }} className="lc-fade">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 22,
          }}
        >
          <button
            onClick={() => setScreen('home')}
            style={{
              background: 'none',
              border: 'none',
              color: G.muted,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            ← Back
          </button>
          <span style={{ fontSize: 12, color: G.muted }}>
            {mode === 1 ? 'Template Mode' : 'Free Input Mode'}
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 22,
            marginBottom: 4,
          }}
        >
          Lesson Setup
        </h2>
        <p style={{ color: G.muted, fontSize: 13, marginBottom: 26 }}>
          Configure your teaching context
        </p>

        {/* Frameworks */}
        <div style={{ marginBottom: 26 }}>
          <span style={label}>
            Curriculum Framework(s){' '}
            <span
              style={{
                color: G.muted,
                textTransform: 'none',
                letterSpacing: 0,
              }}
            >
              — pick all that apply
            </span>
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {FRAMEWORKS.map((fw) => {
              const on = frameworks.includes(fw);
              return (
                <button
                  key={fw}
                  className="lc-chip"
                  onClick={() => toggleFw(fw)}
                  style={{
                    padding: '6px 13px',
                    borderRadius: 20,
                    border: `1px solid ${on ? G.gold : G.border}`,
                    background: on ? `${G.gold}22` : G.surface,
                    color: on ? G.goldLight : G.muted,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontFamily: "'DM Sans',sans-serif",
                    transition: 'all .15s',
                  }}
                >
                  {fw}
                </button>
              );
            })}
          </div>
        </div>

        {/* Age Level */}
        <div style={{ marginBottom: 24 }}>
          <span style={label}>Age Level</span>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
          >
            {AGE_LEVELS.map((al) => {
              const on = ageLevel === al.value;
              return (
                <button
                  key={al.value}
                  className="lc-age"
                  onClick={() => {
                    setAgeLevel(al.value);
                    setGradeLevel('');
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: 12,
                    border: `1px solid ${on ? G.gold : G.border}`,
                    background: on ? `${G.gold}18` : G.surface,
                    color: on ? G.cream : G.muted,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: "'DM Sans',sans-serif",
                    transition: 'all .15s',
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 3 }}>
                    {al.emoji}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {al.label}
                  </div>
                  <div style={{ fontSize: 11 }}>{al.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grade */}
        {grades.length > 0 && (
          <div style={{ marginBottom: 26 }}>
            <span style={label}>
              Grade Level{' '}
              <span
                style={{
                  color: G.muted,
                  textTransform: 'none',
                  letterSpacing: 0,
                }}
              >
                — optional
              </span>
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {grades.map((g) => {
                const on = gradeLevel === g;
                return (
                  <button
                    key={g}
                    onClick={() => setGradeLevel(on ? '' : g)}
                    style={{
                      padding: '6px 13px',
                      borderRadius: 20,
                      border: `1px solid ${on ? G.gold : G.border}`,
                      background: on ? `${G.gold}22` : G.surface,
                      color: on ? G.goldLight : G.muted,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontFamily: "'DM Sans',sans-serif",
                      transition: 'all .15s',
                    }}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={() => setScreen('input')}
          disabled={!canContinue}
          style={{
            ...btn('gold'),
            width: '100%',
            opacity: canContinue ? 1 : 0.4,
          }}
        >
          Continue →
        </button>
      </div>
    );
  }

  // ──── HOME ────
  return (
    <div style={base} className="lc-fade">
      {/* Credits pill */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '16px 18px 0',
        }}
      >
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: `${G.gold}18`,
            border: `1px solid ${G.gold}40`,
            borderRadius: 20,
            padding: '6px 16px',
            cursor: 'pointer',
            color: G.goldLight,
            fontSize: 13,
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          ⚡ {credits} credits this week
        </button>
      </div>

      {/* Hero */}
      <div style={{ padding: '36px 20px 28px', textAlign: 'center' }}>
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: 20,
            background: `linear-gradient(135deg,${G.gold},${G.goldLight})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            fontSize: 30,
            boxShadow: `0 10px 40px ${G.gold}50`,
          }}
        >
          📝
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 34,
            lineHeight: 1.15,
            marginBottom: 10,
          }}
        >
          LessonCraft
          <br />
          <em style={{ color: G.gold }}>AI</em>
        </h1>
        <p
          style={{
            color: G.muted,
            fontSize: 14,
            maxWidth: 290,
            margin: '0 auto',
            lineHeight: 1.65,
          }}
        >
          Professional, curriculum-aligned lesson plans — generated in seconds
        </p>
      </div>

      {/* Mode Cards */}
      <div style={{ padding: '0 18px 32px' }}>
        <p
          style={{
            fontSize: 11,
            color: G.muted,
            textTransform: 'uppercase',
            letterSpacing: '.12em',
            marginBottom: 14,
          }}
        >
          Choose your mode
        </p>

        {[
          {
            id: 1,
            icon: '📋',
            color: G.gold,
            title: 'Template Mode',
            desc: 'Upload your own template. AI reads its structure and fills every section with rich, curriculum-aligned content.',
            tag: 'Best for structured formats',
          },
          {
            id: 2,
            icon: '💬',
            color: G.blue,
            title: 'Free Input Mode',
            desc: 'Just describe what you need. AI builds a complete lesson plan from scratch, tailored to your students.',
            tag: 'Best for quick creation',
          },
        ].map((m) => (
          <div
            key={m.id}
            className="lc-mode"
            onClick={() => {
              setMode(m.id);
              setScreen('setup');
            }}
            style={{
              ...card(),
              marginBottom: 14,
              cursor: 'pointer',
              transition: 'all .2s',
              borderColor: `${m.color}40`,
            }}
          >
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 13,
                  flexShrink: 0,
                  background: `${m.color}20`,
                  border: `1px solid ${m.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                }}
              >
                {m.icon}
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 17,
                    marginBottom: 5,
                  }}
                >
                  {m.title}
                </h3>
                <p style={{ color: G.muted, fontSize: 13, lineHeight: 1.65 }}>
                  {m.desc}
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: 10,
                    background: `${m.color}18`,
                    borderRadius: 6,
                    padding: '3px 10px',
                    color: m.color,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '.05em',
                  }}
                >
                  {m.tag.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Credits Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#00000095',
            zIndex: 200,
            display: 'flex',
            alignItems: 'flex-end',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              ...card(),
              width: '100%',
              borderRadius: '20px 20px 0 0',
              padding: '28px 20px 36px',
              animation: 'slideUp .3s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 20,
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 20,
                  }}
                >
                  Your Credits
                </h3>
                <p style={{ color: G.muted, fontSize: 13, marginTop: 3 }}>
                  <strong style={{ color: G.goldLight }}>
                    {credits} credits
                  </strong>{' '}
                  remaining this week — resets every Monday
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: G.muted,
                  cursor: 'pointer',
                  fontSize: 22,
                }}
              >
                ×
              </button>
            </div>

            {/* Watch Ad */}
            <div
              style={{
                background: G.surface,
                borderRadius: 12,
                padding: '14px 16px',
                marginBottom: 16,
                border: `1px solid ${G.border}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, marginBottom: 3 }}>
                    📺 Watch an Ad
                  </p>
                  <p style={{ color: G.muted, fontSize: 12 }}>
                    Earn 1 free credit · Takes 5 seconds
                  </p>
                  {adDone && (
                    <p style={{ color: '#60d080', fontSize: 12, marginTop: 4 }}>
                      ✓ Credit added!
                    </p>
                  )}
                </div>
                <button
                  onClick={watchAd}
                  disabled={adTimer !== null}
                  style={{ ...btn('gold'), padding: '9px 18px', fontSize: 13 }}
                >
                  {adTimer !== null ? `${adTimer}s…` : 'Watch'}
                </button>
              </div>
              {adTimer !== null && (
                <div
                  style={{
                    marginTop: 10,
                    height: 4,
                    borderRadius: 2,
                    background: G.border,
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 2,
                      background: G.gold,
                      width: `${((5 - adTimer) / 5) * 100}%`,
                      transition: 'width 1s linear',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Upgrade */}
            <p
              style={{
                fontSize: 11,
                color: G.muted,
                textTransform: 'uppercase',
                letterSpacing: '.1em',
                marginBottom: 12,
              }}
            >
              Upgrade Plans
            </p>
            {PLANS.map((p) => (
              <div
                key={p.name}
                style={{
                  background: p.popular ? `${G.gold}10` : G.surface,
                  border: `1px solid ${p.popular ? G.gold : G.border}`,
                  borderRadius: 10,
                  padding: '12px 16px',
                  marginBottom: 10,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>
                    {p.name}{' '}
                    {p.popular && (
                      <span style={{ color: G.gold, fontSize: 11 }}>
                        ★ Popular
                      </span>
                    )}
                  </p>
                  <p style={{ color: G.muted, fontSize: 12 }}>
                    {p.credits} credits · {p.note}
                  </p>
                </div>
                <button
                  style={{
                    ...btn('outline'),
                    padding: '8px 16px',
                    fontSize: 13,
                  }}
                >
                  {p.price}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
