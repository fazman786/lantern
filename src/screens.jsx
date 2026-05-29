import { useState, useEffect } from 'react';
import { C, SERIF, SANS, CATS, COUNTRY_CONFIG, getCountryConfig, detectCountry, FREE_LIMIT } from './config.js';
import { Lantern, Accordion, urgencyColor, urgencyEmoji, DeadlineBanner, EscalationCard, FollowUpChat } from './components.jsx';

const COUNTRY_LIST = [
  // English-speaking
  { code:"gb", name:"United Kingdom",       flag:"🇬🇧" },
  { code:"us", name:"United States",        flag:"🇺🇸" },
  { code:"au", name:"Australia",            flag:"🇦🇺" },
  { code:"ca", name:"Canada",               flag:"🇨🇦" },
  { code:"ie", name:"Ireland",              flag:"🇮🇪" },
  { code:"nz", name:"New Zealand",          flag:"🇳🇿" },
  { code:"za", name:"South Africa",         flag:"🇿🇦" },
  { code:"ng", name:"Nigeria",              flag:"🇳🇬" },
  { code:"ke", name:"Kenya",                flag:"🇰🇪" },
  { code:"gh", name:"Ghana",                flag:"🇬🇭" },
  { code:"ph", name:"Philippines",          flag:"🇵🇭" },
  { code:"sg", name:"Singapore",            flag:"🇸🇬" },
  { code:"hk", name:"Hong Kong",            flag:"🇭🇰" },
  { code:"pk", name:"Pakistan",             flag:"🇵🇰" },
  { code:"bd", name:"Bangladesh",           flag:"🇧🇩" },
  { code:"in", name:"India",                flag:"🇮🇳" },
  { code:"my", name:"Malaysia",             flag:"🇲🇾" },
  // Middle East
  { code:"ae", name:"UAE",                  flag:"🇦🇪" },
  { code:"sa", name:"Saudi Arabia",         flag:"🇸🇦" },
  { code:"qa", name:"Qatar",                flag:"🇶🇦" },
  { code:"bh", name:"Bahrain",              flag:"🇧🇭" },
  { code:"kw", name:"Kuwait",               flag:"🇰🇼" },
  { code:"om", name:"Oman",                 flag:"🇴🇲" },
  { code:"eg", name:"Egypt",                flag:"🇪🇬" },
  // Asia
  { code:"jp", name:"Japan",                flag:"🇯🇵" },
  // Europe
  { code:"de", name:"Germany",              flag:"🇩🇪" },
  { code:"fr", name:"France",               flag:"🇫🇷" },
  { code:"es", name:"Spain",                flag:"🇪🇸" },
  { code:"nl", name:"Netherlands",          flag:"🇳🇱" },
  { code:"se", name:"Sweden",               flag:"🇸🇪" },
  { code:"no", name:"Norway",               flag:"🇳🇴" },
  { code:"ch", name:"Switzerland",          flag:"🇨🇭" },
  { code:"pt", name:"Portugal",             flag:"🇵🇹" },
  { code:"be", name:"Belgium",              flag:"🇧🇪" },
  // Americas
  { code:"mx", name:"Mexico",               flag:"🇲🇽" },
  { code:"br", name:"Brazil",               flag:"🇧🇷" },
  // Other
  { code:"other", name:"Other country",     flag:"🌍" },
];

export function CountryPicker({ value, onChange, detecting }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {detecting && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: C.accentBg, border: `1px solid rgba(233,168,76,0.25)`, borderRadius: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, animation: "pulse 1.4s ease-in-out infinite" }}/>
          <span style={{ fontFamily: SANS, fontSize: 13, color: C.text2 }}>Detecting your location…</span>
        </div>
      )}
      {COUNTRY_LIST.map(c => (
        <button key={c.code} onClick={() => onChange(c.code)} style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "14px 16px", borderRadius: 14,
          background: value === c.code ? C.accentBg : C.surf,
          border: `1.5px solid ${value === c.code ? C.accent : C.border}`,
          cursor: "pointer", transition: "all 0.18s",
        }}>
          <span style={{ fontSize: 24 }}>{c.flag}</span>
          <span style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: value === c.code ? C.accent : C.text, flex: 1, textAlign: "left" }}>{c.name}</span>
          {value === c.code && <span style={{ color: C.accent, fontSize: 16 }}>✓</span>}
        </button>
      ))}
    </div>
  );
}

/* Country badge shown in HomeTab header */
export function CountryBadge({ countryCode, onPress }) {
  const country = getCountryConfig(countryCode);
  return (
    <button onClick={onPress} style={{
      display: "flex", alignItems: "center", gap: 6,
      background: C.surf, border: `1px solid ${C.border}`,
      borderRadius: 20, padding: "5px 12px 5px 8px",
      cursor: "pointer",
    }}>
      <span style={{ fontSize: 16 }}>{country.flag}</span>
      <span style={{ fontFamily: SANS, fontSize: 12, color: C.text2, fontWeight: 600 }}>{country.name}</span>
      <span style={{ fontFamily: SANS, fontSize: 10, color: C.text3 }}>▾</span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════
   SPLASH SCREEN
═══════════════════════════════════════════════════════ */
export function SplashScreen({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", inset: 0, background: C.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 22,
      animation: "fadeIn 0.6s ease",
    }}>
      <Lantern size={88} glow />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontSize: 40, color: C.accent, letterSpacing: 3, fontWeight: 600 }}>Lantern</div>
        <div style={{ fontFamily: SANS, fontSize: 13, color: C.text2, marginTop: 6, letterSpacing: 0.5 }}>Your guide through the overwhelming</div>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: C.accent, animation: `dotPulse 1.4s ease-in-out ${i * 0.22}s infinite`, opacity: 0.7 }}/>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ONBOARDING
═══════════════════════════════════════════════════════ */
const OB_SLIDES = [
  {
    visual: <Lantern size={80} glow />,
    title: "Light in the dark",
    body: "Lantern turns confusing legal, financial, and employment situations into clear, calm guidance you can actually act on.",
  },
  {
    visual: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {CATS.map(c => (
          <div key={c.id} style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 22 }}>{c.emoji}</div>
            <div style={{ fontFamily: SANS, fontSize: 10, color: C.text2, marginTop: 4, lineHeight: 1.3 }}>{c.label}</div>
          </div>
        ))}
      </div>
    ),
    title: "Six situations covered",
    body: "Debt · Legal · Contracts · Tax · Benefits · Employment. Upload a letter or describe your situation — plain English every time.",
  },
  {
    visual: (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 72, lineHeight: 1 }}>🔓</div>
        <div style={{ fontFamily: SANS, fontSize: 28, fontWeight: 700, color: C.accent, marginTop: 12, letterSpacing: -0.5 }}>Free to start</div>
      </div>
    ),
    title: "Start free today",
    body: "3 free guidance sessions every month. Upgrade to Pro for unlimited access at just £6.99/month.",
  },
];

export function OnboardingScreen({ onDone }) {
  const [slide,      setSlide]      = useState(0);
  const [country,    setCountry]    = useState("gb");
  const [detecting,  setDetecting]  = useState(false);

  // Auto-detect on mount
  useEffect(() => {
    setDetecting(true);
    detectCountry().then(code => {
      if (code) setCountry(code === "other" ? "other" : (COUNTRY_CONFIG[code] ? code : "other"));
      setDetecting(false);
    });
  }, []);

  const SLIDES = [
    {
      title: "Light in the dark",
      body: "Lantern turns confusing legal, financial, and employment situations into clear, calm guidance you can actually act on.",
      visual: <Lantern size={80} glow />,
    },
    {
      title: "Six situations covered",
      body: "Debt · Legal · Contracts · Tax · Benefits · Employment. Speak, upload a document, or type — plain English every time.",
      visual: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {CATS.map(c => (
            <div key={c.id} style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 22 }}>{c.emoji}</div>
              <div style={{ fontFamily: SANS, fontSize: 10, color: C.text2, marginTop: 4, lineHeight: 1.3 }}>{c.label}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Where are you based?",
      body: "Lantern tailors its guidance to your country's laws and local resources.",
      visual: null, // replaced by picker below
      isCountry: true,
    },
    {
      title: "Free to start",
      body: "3 free guidance sessions every month. Upgrade to Pro for unlimited access.",
      visual: (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 72, lineHeight: 1 }}>🔓</div>
          <div style={{ fontFamily: SANS, fontSize: 28, fontWeight: 700, color: C.accent, marginTop: 12, letterSpacing: -0.5 }}>Start free</div>
        </div>
      ),
    },
  ];

  const last = slide === SLIDES.length - 1;
  const s = SLIDES[slide];

  return (
    <div style={{ position: "fixed", inset: 0, background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "56px 24px 0" }}>
        <button onClick={() => onDone(country)} style={{ background: "none", border: "none", color: C.text2, fontFamily: SANS, fontSize: 14, cursor: "pointer", padding: 4 }}>Skip</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
        {s.isCountry ? (
          <div style={{ paddingTop: 20 }}>
            <div style={{ fontFamily: SERIF, fontSize: 28, color: C.text, marginBottom: 8, fontWeight: 600, textAlign: "center" }}>{s.title}</div>
            <div style={{ fontFamily: SANS, fontSize: 14, color: C.text2, lineHeight: 1.7, textAlign: "center", marginBottom: 24 }}>{s.body}</div>
            <CountryPicker value={country} onChange={setCountry} detecting={detecting} />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 32, textAlign: "center", animation: "slideUp 0.35s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 140 }}>{s.visual}</div>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 32, color: C.text, lineHeight: 1.15, marginBottom: 14, fontWeight: 600 }}>{s.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 15, color: C.text2, lineHeight: 1.75, maxWidth: 290 }}>{s.body}</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "16px 24px 0" }}>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
          {SLIDES.map((_, i) => (
            <div key={i} style={{ height: 6, borderRadius: 3, width: i === slide ? 24 : 6, background: i === slide ? C.accent : C.text3, transition: "all 0.3s ease" }}/>
          ))}
        </div>
        <button onClick={last ? () => onDone(country) : () => setSlide(s => s + 1)} style={{
          width: "100%", padding: "17px 0", borderRadius: 16, marginBottom: 40,
          background: C.accent, border: "none", cursor: "pointer",
          fontFamily: SANS, fontSize: 16, fontWeight: 700, color: "#1A0E00",
          boxShadow: "0 4px 24px rgba(233,168,76,0.3)",
        }}>{last ? "Get Started →" : "Next →"}</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BOTTOM NAV
═══════════════════════════════════════════════════════ */
export function BottomNav({ tab, setTab }) {
  const items = [
    { id: "home",     emoji: "🏮", label: "Home"     },
    { id: "history",  emoji: "📖", label: "History"  },
    { id: "settings", emoji: "⚙️",  label: "Settings" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.surf, borderTop: `1px solid ${C.border}`, display: "flex", padding: "8px 0 26px", zIndex: 200 }}>
      {items.map(it => (
        <button key={it.id} onClick={() => setTab(it.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
          <span style={{ fontSize: 22 }}>{it.emoji}</span>
          <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: 0.3, color: tab === it.id ? C.accent : C.text3, transition: "color 0.2s" }}>{it.label}</span>
          {tab === it.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.accent, marginTop: 1 }}/>}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HOME TAB
═══════════════════════════════════════════════════════ */
export function HomeTab({ usage, onSelectCat, history, onHistItem, countryCode, onChangeCountry }) {
  const used = usage.count;
  const left = Math.max(0, FREE_LIMIT - used);
  const pct  = Math.min((used / FREE_LIMIT) * 100, 100);

  return (
    <div style={{ padding: "0 20px 140px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 56, paddingBottom: 28 }}>
        <Lantern size={40} glow />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: SERIF, fontSize: 30, color: C.accent, letterSpacing: 2, fontWeight: 600 }}>Lantern</div>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.text2 }}>Your guide through the overwhelming</div>
        </div>
        <CountryBadge countryCode={countryCode} onPress={onChangeCountry} />
      </div>

      {/* Usage pill */}
      <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 18px", marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontFamily: SANS, fontSize: 13, color: C.text2 }}>Free sessions this month</span>
          <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: left === 0 ? C.danger : C.accent }}>{used}/{FREE_LIMIT}</span>
        </div>
        <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 3, transition: "width 0.6s ease", width: `${pct}%`, background: left === 0 ? C.danger : `linear-gradient(90deg, ${C.accent}, #F5C26B)` }}/>
        </div>
        {left === 0 ? (
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.danger, marginTop: 10, lineHeight: 1.5 }}>Monthly limit reached — upgrade to Pro for unlimited access</div>
        ) : (
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, marginTop: 8 }}>{left} session{left !== 1 ? "s" : ""} remaining · resets next month</div>
        )}
      </div>

      <div style={{ fontFamily: SERIF, fontSize: 22, color: C.text, marginBottom: 14, fontWeight: 400 }}>What's your situation?</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
        {CATS.map(cat => (
          <button key={cat.id} onClick={() => onSelectCat(cat.id)} style={{
            background: C.surf, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 16px",
            cursor: "pointer", textAlign: "left", transition: "border-color 0.2s, background 0.2s",
            display: "flex", flexDirection: "column", gap: 8,
          }}
          onPointerDown={e => { e.currentTarget.style.background = C.surf2; e.currentTarget.style.borderColor = cat.color + "60"; }}
          onPointerUp={e => { e.currentTarget.style.background = C.surf; e.currentTarget.style.borderColor = C.border; }}
          >
            <span style={{ fontSize: 28 }}>{cat.emoji}</span>
            <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.35 }}>{cat.label}</span>
            <div style={{ width: 30, height: 3, borderRadius: 2, background: cat.color, opacity: 0.75 }}/>
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <div>
          <div style={{ fontFamily: SERIF, fontSize: 20, color: C.text, marginBottom: 14 }}>Recent</div>
          {history.slice(0, 3).map(item => {
            const cat = CATS.find(c => c.id === item.catId);
            const uc = urgencyColor(item.result.urgency);
            const date = new Date(item.savedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
            return (
              <div key={item.id} onClick={() => onHistItem(item)} style={{
                background: C.surf, border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${cat?.color || C.border}`,
                borderRadius: 12, padding: "14px 16px", marginBottom: 10, cursor: "pointer",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: SANS, fontSize: 12, color: C.text2 }}>{cat?.emoji} {cat?.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, color: uc, textTransform: "uppercase", letterSpacing: 0.5 }}>{item.result.urgency}</span>
                    <span style={{ fontFamily: SANS, fontSize: 11, color: C.text3 }}>{date}</span>
                  </div>
                </div>
                <div style={{ fontFamily: SANS, fontSize: 13, color: C.text, lineHeight: 1.5 }}>
                  {item.situation.substring(0, 85)}{item.situation.length > 85 ? "…" : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CHAT SCREEN  (with document upload)
═══════════════════════════════════════════════════════ */
export function ChatScreen({ catId, usage, onBack, onResult, onPaywall, countryCode }) {
  const cat = CATS.find(c => c.id === catId);
  const country = getCountryConfig(countryCode);
  const [text,    setText]    = useState("");
  const [file,    setFile]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const MAX = 1000;
  const MIN = 20;

  const hasFile    = !!file;
  const canSubmit  = hasFile || text.trim().length >= MIN;

  async function handleSubmit() {
    if (!canSubmit) {
      setError(`Please describe your situation (at least ${MIN} characters) or upload a document.`);
      return;
    }
    if (usage.count >= FREE_LIMIT) { onPaywall(); return; }
    setLoading(true);
    setError(null);
    try {
      let imageData = null;
      let imageType = null;
      if (file) {
        if (file.type === "application/pdf") {
          // For PDFs we still send as base64 image via conversion note
          imageType = "application/pdf";
        } else {
          imageType = file.type;
        }
        imageData = await fileToBase64(file);
      }
      const result = await getGuidance(catId, text.trim(), imageData, imageType, countryCode);
      onResult(result, text.trim() || (file ? `[Uploaded: ${file.name}]` : ""), imageData, imageType);
    } catch (e) {
      setError("Something went wrong. Please check your connection and try again.");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ position: "fixed", inset: 0, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 40 }}>
        <Lantern size={80} glow />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: SERIF, fontSize: 24, color: C.text, marginBottom: 10 }}>
            {file ? "Reading your document…" : "Reading your situation…"}
          </div>
          <div style={{ fontFamily: SANS, fontSize: 14, color: C.text2, lineHeight: 1.65, maxWidth: 260 }}>
            Lantern is carefully working through what you've shared to give you the clearest guidance possible.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: C.accent, animation: `dotPulse 1.3s ease-in-out ${i * 0.22}s infinite` }}/>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: C.bg, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "54px 20px 18px", borderBottom: `1px solid ${C.border}`, background: C.surf }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.text2, fontSize: 22, cursor: "pointer", padding: "4px 8px 4px 0" }}>←</button>
        <span style={{ fontSize: 24 }}>{cat.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 700, color: C.text }}>{cat.label}</div>
          <div style={{ fontFamily: SANS, fontSize: 11, color: C.text2 }}>{country.flag} {country.name} guidance</div>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: usage.count >= FREE_LIMIT ? C.danger : C.text2, background: C.surf2, borderRadius: 8, padding: "4px 10px" }}>
          {FREE_LIMIT - usage.count} left
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "22px 20px 0" }}>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.text2, lineHeight: 1.7, marginBottom: 18 }}>
          Speak, upload a document, or type — whatever is easiest right now.
        </div>

        {/* Voice input */}
        <VoiceInput
          disabled={loading}
          onTranscript={t => setText(prev => (prev ? prev + " " + t : t).slice(0, MAX))}
        />

        {/* Document upload */}
        <DocumentUpload file={file} onFile={setFile} onRemove={() => setFile(null)} />

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: C.border }}/>
          <span style={{ fontFamily: SANS, fontSize: 12, color: C.text3 }}>{file ? "Add context (optional)" : "Or type it out"}</span>
          <div style={{ flex: 1, height: 1, background: C.border }}/>
        </div>

        {/* Text input */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value.slice(0, MAX))}
          placeholder={file ? "Any extra context you want to add… (optional)" : cat.hint}
          style={{
            width: "100%", minHeight: 180, background: C.surf, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: "16px", color: C.text,
            fontFamily: SANS, fontSize: 15, lineHeight: 1.65,
            resize: "none", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = C.accent}
          onBlur={e => e.target.style.borderColor = C.border}
        />

        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 2px", marginBottom: 16 }}>
          <span style={{ fontFamily: SANS, fontSize: 12, color: canSubmit ? C.success : C.text3 }}>
            {canSubmit ? "✓ Ready" : `${MIN - text.trim().length} more characters needed`}
          </span>
          <span style={{ fontFamily: SANS, fontSize: 12, color: C.text3 }}>{text.length}/{MAX}</span>
        </div>

        {error && (
          <div style={{ background: "rgba(232,87,74,0.1)", border: `1px solid rgba(232,87,74,0.4)`, borderRadius: 12, padding: "13px 16px", marginBottom: 16, fontFamily: SANS, fontSize: 13, color: C.danger, lineHeight: 1.5 }}>{error}</div>
        )}

        <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 28, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
          <span style={{ fontFamily: SANS, fontSize: 12, color: C.text3, lineHeight: 1.6 }}>
            Lantern provides educational guidance only — not legal or financial advice. For complex situations, always consult a qualified professional.
          </span>
        </div>
      </div>

      <div style={{ padding: "16px 20px 40px", background: C.surf, borderTop: `1px solid ${C.border}` }}>
        <button onClick={handleSubmit} disabled={!canSubmit} style={{
          width: "100%", padding: "17px 0", borderRadius: 16, border: "none",
          cursor: canSubmit ? "pointer" : "not-allowed",
          background: canSubmit ? `linear-gradient(135deg, ${C.accent}, #F5C26B)` : C.surf2,
          fontFamily: SANS, fontSize: 16, fontWeight: 700,
          color: canSubmit ? "#1A0E00" : C.text3,
          boxShadow: canSubmit ? "0 4px 20px rgba(233,168,76,0.3)" : "none",
          transition: "all 0.2s",
        }}>
          {file && !text ? "Analyse Document 🔦" : "Get Guidance 🔦"}
        </button>
      </div>
    </div>
  );
