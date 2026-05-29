import { useState, useEffect } from 'react';
import { C, SANS, CATS, getCountryConfig, FREE_LIMIT, MODEL, S, monthKey } from './config.js';
import { fileToBase64, getGuidance, getFollowUp } from './api.js';
import { Lantern, VoiceInput, DocumentUpload, EscalationCard, DeadlineBanner, FollowUpChat, urgencyColor, urgencyEmoji, Accordion } from './components.jsx';
import { CountryPicker, CountryBadge, SplashScreen, OnboardingScreen, BottomNav, HomeTab, ChatScreen } from './screens.jsx';

/* ═══════════════════════════════════════════════════════
   RESULT SCREEN  (with follow-up chat + escalation + deadline)
═══════════════════════════════════════════════════════ */
function ResultScreen({ catId, situation, result, onBack, onSave, saved, chatHistory, onNewChatMessage, countryCode }) {
  const cat = CATS.find(c => c.id === catId);
  const uc = urgencyColor(result.urgency);

  function copyAll() {
    const lines = [
      `LANTERN GUIDANCE — ${cat.label}`, ``,
      `Situation: ${situation}`, ``,
      `Summary:`, result.summary, ``,
      `Urgency: ${result.urgency.toUpperCase()} — ${result.urgencyText}`, ``,
      result.deadline ? `Deadline: ${result.deadline}` : null, ``,
      `What to do next:`, ...result.actionSteps.map((s, i) => `  ${i + 1}. ${s}`), ``,
      `Questions for a professional:`, ...result.professionalQuestions.map((q, i) => `  ${i + 1}. ${q}`), ``,
      `Common mistakes to avoid:`, ...result.commonMistakes.map((m, i) => `  ${i + 1}. ${m}`), ``,
      result.encouragement, ``,
      `— Lantern provides educational guidance only, not legal or financial advice.`,
    ].filter(l => l !== null).join("\n");
    navigator.clipboard.writeText(lines).catch(() => {});
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "54px 20px 16px", borderBottom: `1px solid ${C.border}`, background: C.surf, position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.text2, fontSize: 22, cursor: "pointer", padding: "4px 8px 4px 0" }}>←</button>
        <span style={{ fontSize: 20 }}>{cat.emoji}</span>
        <span style={{ fontFamily: SANS, fontSize: 15, fontWeight: 700, color: C.text, flex: 1 }}>{cat.label}</span>
        <button onClick={copyAll} style={{ background: C.surf2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 13px", color: C.text2, fontFamily: SANS, fontSize: 12, cursor: "pointer" }}>Copy all</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "22px 20px 140px" }}>
        {/* Urgency */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: uc + "1A", border: `1px solid ${uc}55`, borderRadius: 20, padding: "7px 16px", marginBottom: 8 }}>
          <span>{urgencyEmoji(result.urgency)}</span>
          <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: uc, textTransform: "uppercase", letterSpacing: 0.8 }}>{result.urgency} urgency</span>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 13, color: C.text2, marginBottom: 18, lineHeight: 1.5 }}>{result.urgencyText}</div>

        {/* Deadline banner */}
        <DeadlineBanner deadline={result.deadline} />

        {/* Escalation card */}
        <EscalationCard catId={catId} urgency={result.urgency} countryCode={countryCode} />

        {/* Summary */}
        <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderLeft: `4px solid ${cat.color}`, borderRadius: 14, padding: "20px", marginBottom: 20 }}>
          <div style={{ fontFamily: SERIF, fontSize: 19, color: C.text, marginBottom: 10, fontWeight: 600 }}>What this means</div>
          <div style={{ fontFamily: SANS, fontSize: 14, color: C.text, lineHeight: 1.75 }}>{result.summary}</div>
        </div>

        {/* Accordions */}
        <Accordion title="What to do next"               emoji="✅" items={result.actionSteps}          color={cat.color} />
        <Accordion title="Questions for a professional"  emoji="🗣️" items={result.professionalQuestions} color={cat.color} />
        <Accordion title="Common mistakes to avoid"      emoji="⚠️" items={result.commonMistakes}        color={cat.color} />

        {/* Follow-up chat */}
        <FollowUpChat
          catId={catId}
          situation={situation}
          result={result}
          chatHistory={chatHistory}
          onNewMessage={onNewChatMessage}
          countryCode={countryCode}
        />

        {/* Encouragement */}
        <div style={{ background: C.accentBg, border: `1px solid rgba(233,168,76,0.3)`, borderRadius: 14, padding: "22px", marginBottom: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
          <Lantern size={36} glow />
          <div style={{ fontFamily: SERIF, fontSize: 17, color: C.accent, lineHeight: 1.65, fontStyle: "italic" }}>
            "{result.encouragement}"
          </div>
        </div>

        <div style={{ fontFamily: SANS, fontSize: 11, color: C.text3, lineHeight: 1.65, textAlign: "center", marginBottom: 20 }}>
          Lantern provides educational guidance only — not legal or financial advice. Always consult a qualified professional for your specific situation.
        </div>

        <button onClick={onSave} disabled={saved} style={{
          width: "100%", padding: "17px 0", borderRadius: 16, border: "none",
          cursor: saved ? "default" : "pointer",
          background: saved ? C.surf2 : C.accent,
          fontFamily: SANS, fontSize: 15, fontWeight: 700,
          color: saved ? C.text2 : "#1A0E00", transition: "all 0.2s",
        }}>
          {saved ? "✓ Saved to history" : "Save to history"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAYWALL SCREEN
═══════════════════════════════════════════════════════ */
function PaywallScreen({ onBack }) {
  const rows = [
    { label: "Sessions per month",  free: "3",  pro: "Unlimited" },
    { label: "All 6 categories",    free: "✓",  pro: "✓"        },
    { label: "Document upload",     free: "✓",  pro: "✓"        },
    { label: "Follow-up questions", free: "✓",  pro: "✓"        },
    { label: "Save to history",     free: "✓",  pro: "✓"        },
    { label: "Priority guidance",   free: "✗",  pro: "✓"        },
    { label: "Offline access",      free: "✗",  pro: "✓"        },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "54px 20px 18px", borderBottom: `1px solid ${C.border}`, background: C.surf }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.text2, fontSize: 22, cursor: "pointer" }}>←</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 24px 60px", textAlign: "center" }}>
        <Lantern size={72} glow />
        <div style={{ fontFamily: SERIF, fontSize: 34, color: C.accent, margin: "20px 0 8px", fontWeight: 600 }}>Upgrade to Pro</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.text2, lineHeight: 1.75, maxWidth: 280, margin: "0 auto 32px" }}>
          You've used your 3 free sessions this month. Upgrade for unlimited guidance whenever you need it.
        </div>
        <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 28, textAlign: "left" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px", padding: "12px 18px", background: C.surf2, borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontFamily: SANS, fontSize: 12, color: C.text3 }}>Feature</span>
            <span style={{ fontFamily: SANS, fontSize: 12, color: C.text3, textAlign: "center" }}>Free</span>
            <span style={{ fontFamily: SANS, fontSize: 12, color: C.accent, textAlign: "center", fontWeight: 700 }}>Pro</span>
          </div>
          {rows.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px", padding: "13px 18px", borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.text }}>{row.label}</span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: row.free === "✗" ? C.text3 : C.text2, textAlign: "center" }}>{row.free}</span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.accent, fontWeight: 700, textAlign: "center" }}>{row.pro}</span>
            </div>
          ))}
        </div>
        <button onClick={() => alert("Payment integration coming soon!\nLantern Pro will be £6.99/month.")} style={{
          width: "100%", padding: "19px 0", borderRadius: 16, border: "none", cursor: "pointer",
          background: `linear-gradient(135deg, ${C.accent}, #F5C26B)`,
          fontFamily: SANS, fontSize: 17, fontWeight: 700, color: "#1A0E00",
          boxShadow: "0 6px 28px rgba(233,168,76,0.35)", marginBottom: 12,
        }}>Upgrade to Pro — £6.99/month</button>
        <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3 }}>Cancel anytime · Secure payment · Instant access</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HISTORY TAB
═══════════════════════════════════════════════════════ */
function HistoryTab({ history, onItem, onDelete, onClear }) {
  if (history.length === 0) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 56 }}>📖</div>
        <div style={{ fontFamily: SERIF, fontSize: 24, color: C.text2, fontWeight: 400 }}>No history yet</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.text3, lineHeight: 1.7, maxWidth: 260 }}>
          Save guidance sessions and they'll appear here for easy reference whenever you need them.
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding: "0 20px 140px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 56, paddingBottom: 22 }}>
        <div style={{ fontFamily: SERIF, fontSize: 28, color: C.text, fontWeight: 400 }}>History</div>
        <button onClick={() => { if (window.confirm("Delete all saved history?")) onClear(); }} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", color: C.text3, fontFamily: SANS, fontSize: 12, cursor: "pointer" }}>Clear all</button>
      </div>
      {history.map(item => {
        const cat = CATS.find(c => c.id === item.catId);
        const uc = urgencyColor(item.result.urgency);
        const date = new Date(item.savedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" });
        return (
          <div key={item.id} style={{ background: C.surf, border: `1px solid ${C.border}`, borderLeft: `3px solid ${cat?.color || C.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1, cursor: "pointer" }} onClick={() => onItem(item)}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: SANS, fontSize: 12, color: C.text2 }}>{cat?.emoji} {cat?.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, color: uc, textTransform: "uppercase" }}>{item.result.urgency}</span>
                  <span style={{ fontFamily: SANS, fontSize: 11, color: C.text3 }}>{date}</span>
                </div>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 13, color: C.text, lineHeight: 1.5 }}>
                {item.situation.substring(0, 95)}{item.situation.length > 95 ? "…" : ""}
              </div>
              {item.result.deadline && (
                <div style={{ fontFamily: SANS, fontSize: 11, color: C.warning, marginTop: 6 }}>⏰ {item.result.deadline}</div>
              )}
            </div>
            <button onClick={() => onDelete(item.id)} style={{ background: "none", border: "none", color: C.text3, fontSize: 20, cursor: "pointer", padding: "0 2px", flexShrink: 0, lineHeight: 1 }}>×</button>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HISTORY DETAIL
═══════════════════════════════════════════════════════ */
function HistoryDetail({ item, onBack, onDelete }) {
  const cat = CATS.find(c => c.id === item.catId);
  const uc = urgencyColor(item.result.urgency);
  const date = new Date(item.savedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const [chatHistory, setChatHistory] = useState(item.chatHistory || []);

  return (
    <div style={{ position: "fixed", inset: 0, background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "54px 20px 16px", borderBottom: `1px solid ${C.border}`, background: C.surf }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.text2, fontSize: 22, cursor: "pointer", padding: "4px 8px 4px 0" }}>←</button>
        <span style={{ fontSize: 20 }}>{cat?.emoji}</span>
        <span style={{ fontFamily: SANS, fontSize: 15, fontWeight: 700, color: C.text, flex: 1 }}>{cat?.label}</span>
        <button onClick={() => { onDelete(item.id); onBack(); }} style={{ background: "none", border: `1px solid rgba(232,87,74,0.4)`, borderRadius: 8, padding: "6px 11px", color: C.danger, fontFamily: SANS, fontSize: 12, cursor: "pointer" }}>Delete</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "22px 20px 80px" }}>
        <div style={{ fontFamily: SANS, fontSize: 11, color: C.text3, marginBottom: 10 }}>{date}</div>
        <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ fontFamily: SANS, fontSize: 11, color: C.text3, marginBottom: 6 }}>Situation described</div>
          <div style={{ fontFamily: SANS, fontSize: 14, color: C.text, lineHeight: 1.65 }}>{item.situation}</div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: uc + "1A", border: `1px solid ${uc}55`, borderRadius: 20, padding: "7px 16px", marginBottom: 8 }}>
          <span>{urgencyEmoji(item.result.urgency)}</span>
          <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: uc, textTransform: "uppercase", letterSpacing: 0.8 }}>{item.result.urgency} urgency</span>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 13, color: C.text2, marginBottom: 18, lineHeight: 1.5 }}>{item.result.urgencyText}</div>
        <DeadlineBanner deadline={item.result.deadline} />
        <EscalationCard catId={item.catId} urgency={item.result.urgency} />
        <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderLeft: `4px solid ${cat?.color || C.border}`, borderRadius: 14, padding: "20px", marginBottom: 20 }}>
          <div style={{ fontFamily: SERIF, fontSize: 19, color: C.text, marginBottom: 10, fontWeight: 600 }}>What this means</div>
          <div style={{ fontFamily: SANS, fontSize: 14, color: C.text, lineHeight: 1.75 }}>{item.result.summary}</div>
        </div>
        <Accordion title="What to do next"               emoji="✅" items={item.result.actionSteps}          color={cat?.color || C.accent} />
        <Accordion title="Questions for a professional"  emoji="🗣️" items={item.result.professionalQuestions} color={cat?.color || C.accent} />
        <Accordion title="Common mistakes to avoid"      emoji="⚠️" items={item.result.commonMistakes}        color={cat?.color || C.accent} />
        <FollowUpChat
          catId={item.catId}
          situation={item.situation}
          result={item.result}
          chatHistory={chatHistory}
          onNewMessage={msg => setChatHistory(h => [...h, msg])}
        />
        <div style={{ background: C.accentBg, border: `1px solid rgba(233,168,76,0.3)`, borderRadius: 14, padding: "20px", textAlign: "center" }}>
          <div style={{ fontFamily: SERIF, fontSize: 16, color: C.accent, lineHeight: 1.7, fontStyle: "italic" }}>
            "{item.result.encouragement}"
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SETTINGS TAB
═══════════════════════════════════════════════════════ */
function SettingsTab({ usage, onClearHistory, onResetUsage, countryCode, onChangeCountry }) {
  const used = usage.count;
  const left = Math.max(0, FREE_LIMIT - used);
  const pct  = Math.min((used / FREE_LIMIT) * 100, 100);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const country = getCountryConfig(countryCode);
  const rows = [
    { label: "Rate Lantern ⭐",    action: () => alert("App store rating coming soon — thank you!"),                                          color: C.text   },
    { label: "Privacy Policy",      action: () => alert("Privacy policy URL coming soon."),                                                   color: C.text   },
    { label: "Terms of Service",    action: () => alert("Terms of service URL coming soon."),                                                 color: C.text   },
    { label: "Contact Support",     action: () => alert("Support contact coming soon."),                                                      color: C.text   },
    { label: "Clear all history",   action: () => { if (window.confirm("Delete all saved history? This can't be undone.")) onClearHistory(); }, color: C.danger },
    { label: "Reset usage counter", action: () => { if (window.confirm("Reset monthly usage count? (Testing only)")) onResetUsage(); },       color: C.text3  },
  ];
  return (
    <div style={{ padding: "0 20px 140px" }}>
      <div style={{ fontFamily: SERIF, fontSize: 28, color: C.text, paddingTop: 56, paddingBottom: 24, fontWeight: 400 }}>Settings</div>

      {/* Country section */}
      <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px", marginBottom: 20 }}>
        <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 14 }}>Your country</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: showCountryPicker ? 16 : 0 }}>
          <span style={{ fontSize: 28 }}>{country.flag}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text }}>{country.name}</div>
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, marginTop: 2 }}>{country.legalSystem}</div>
          </div>
          <button onClick={() => setShowCountryPicker(o => !o)} style={{
            background: C.surf2, border: `1px solid ${C.border}`, borderRadius: 8,
            padding: "7px 13px", color: C.text2, fontFamily: SANS, fontSize: 12, cursor: "pointer",
          }}>{showCountryPicker ? "Cancel" : "Change"}</button>
        </div>
        {showCountryPicker && (
          <CountryPicker
            value={countryCode}
            onChange={code => { onChangeCountry(code); setShowCountryPicker(false); }}
          />
        )}
      </div>

      <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px", marginBottom: 20 }}>
        <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 14 }}>This month's usage</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontFamily: SANS, fontSize: 13, color: C.text2 }}>Free sessions used</span>
          <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: left === 0 ? C.danger : C.accent }}>{used}/{FREE_LIMIT}</span>
        </div>
        <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: "hidden", marginBottom: 14 }}>
          <div style={{ height: "100%", borderRadius: 3, transition: "width 0.5s ease", width: `${pct}%`, background: left === 0 ? C.danger : `linear-gradient(90deg, ${C.accent}, #F5C26B)` }}/>
        </div>
        {left === 0 ? (
          <button onClick={() => alert("Payment integration coming soon!\nLantern Pro — £6.99/month.")} style={{ width: "100%", padding: "13px 0", borderRadius: 10, background: C.accent, border: "none", cursor: "pointer", fontFamily: SANS, fontSize: 14, fontWeight: 700, color: "#1A0E00" }}>
            Upgrade to Pro — £6.99/month
          </button>
        ) : (
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3 }}>{left} session{left !== 1 ? "s" : ""} remaining · resets next month</div>
        )}
      </div>
      {rows.map((row, i) => (
        <div key={i} onClick={row.action} style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
          <span style={{ fontFamily: SANS, fontSize: 14, color: row.color }}>{row.label}</span>
          <span style={{ color: C.text3, fontSize: 18 }}>›</span>
        </div>
      ))}
      <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, textAlign: "center", marginTop: 28, lineHeight: 1.7 }}>
        Lantern v1.1.0{"\n"}Educational guidance only — not legal or financial advice
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════ */
export default function App() {
  const [ready,       setReady]       = useState(false);
  const [showSplash,  setShowSplash]  = useState(true);
  const [onboarded,   setOnboarded]   = useState(false);
  const [tab,         setTab]         = useState("home");
  const [overlay,     setOverlay]     = useState(null);
  const [selCat,      setSelCat]      = useState(null);
  const [situation,   setSituation]   = useState("");
  const [result,      setResult]      = useState(null);
  const [resultSaved, setResultSaved] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [usage,       setUsage]       = useState({ month: "", count: 0 });
  const [history,     setHistory]     = useState([]);
  const [histItem,    setHistItem]    = useState(null);
  const [countryCode, setCountryCode] = useState("gb");
  const [showCountryOverlay, setShowCountryOverlay] = useState(false);

  useEffect(() => {
    (async () => {
      const ob      = await S.get("lantern_ob");
      const use     = await S.get("lantern_use");
      const hist    = await S.get("lantern_hist");
      const country = await S.get("lantern_country");
      if (ob) setOnboarded(true);
      if (country) setCountryCode(country);
      const m = monthKey();
      if (use && use.month === m) setUsage(use);
      else setUsage({ month: m, count: 0 });
      if (Array.isArray(hist)) setHistory(hist);
      setReady(true);
    })();
  }, []);

  async function handleChangeCountry(code) {
    setCountryCode(code);
    await S.set("lantern_country", code);
  }

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      html, body { margin: 0; padding: 0; background: #070C16; overflow: hidden; height: 100%; }
      textarea::placeholder, input::placeholder { color: #3A4E64; }
      ::-webkit-scrollbar { display: none; }
      @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp  { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pulse    { 0%,100% { opacity: 0.35; transform: scale(0.94); } 50% { opacity: 1; transform: scale(1.06); } }
      @keyframes dotPulse  { 0%,80%,100% { transform: scale(0.55); opacity: 0.35; } 40% { transform: scale(1); opacity: 1; } }
      @keyframes voiceBar  { from { transform: scaleY(0.4); } to { transform: scaleY(1.2); } }
    `;
    document.head.appendChild(style);
  }, []);

  async function markOnboarded(country) {
    await S.set("lantern_ob", true);
    if (country) { setCountryCode(country); await S.set("lantern_country", country); }
    setOnboarded(true);
  }

  function handleCatSelect(catId) {
    if (usage.count >= FREE_LIMIT) { setOverlay("paywall"); return; }
    setSelCat(catId);
    setResult(null);
    setResultSaved(false);
    setChatHistory([]);
    setOverlay("chat");
  }

  async function handleResult(res, sit) {
    const newUse = { month: monthKey(), count: usage.count + 1 };
    setUsage(newUse);
    await S.set("lantern_use", newUse);
    setSituation(sit);
    setResult(res);
    setResultSaved(false);
    setChatHistory([]);
    setOverlay("result");
  }

  async function handleSave() {
    const item = {
      id: Date.now().toString(),
      catId: selCat,
      situation,
      result,
      chatHistory,
      savedAt: Date.now(),
    };
    const newHist = [item, ...history].slice(0, 50);
    setHistory(newHist);
    setResultSaved(true);
    await S.set("lantern_hist", newHist);
  }

  async function handleDeleteHist(id) {
    const newHist = history.filter(h => h.id !== id);
    setHistory(newHist);
    if (newHist.length > 0) await S.set("lantern_hist", newHist);
    else await S.del("lantern_hist");
  }

  async function handleClearHistory() { setHistory([]); await S.del("lantern_hist"); }

  async function handleResetUsage() {
    const newUse = { month: monthKey(), count: 0 };
    setUsage(newUse);
    await S.set("lantern_use", newUse);
  }

  function openHistItem(item) { setHistItem(item); setOverlay("hist-detail"); }

  if (!ready || showSplash) return <SplashScreen onDone={() => setShowSplash(false)} />;
  if (!onboarded) return <OnboardingScreen onDone={markOnboarded} />;

  if (overlay === "chat") return (
    <ChatScreen catId={selCat} usage={usage} onBack={() => setOverlay(null)} onResult={handleResult} onPaywall={() => setOverlay("paywall")} countryCode={countryCode} />
  );

  if (overlay === "result" && result) return (
    <ResultScreen
      catId={selCat} situation={situation} result={result}
      onBack={() => setOverlay(null)} onSave={handleSave} saved={resultSaved}
      chatHistory={chatHistory}
      onNewChatMessage={msg => setChatHistory(h => [...h, msg])}
      countryCode={countryCode}
    />
  );

  if (overlay === "paywall") return <PaywallScreen onBack={() => setOverlay(null)} />;

  if (overlay === "hist-detail" && histItem) return (
    <HistoryDetail item={histItem} onBack={() => { setHistItem(null); setOverlay(null); }} onDelete={handleDeleteHist} />
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: C.bg, overflowY: "auto" }}>
      {tab === "home"     && <HomeTab usage={usage} onSelectCat={handleCatSelect} history={history} onHistItem={openHistItem} countryCode={countryCode} onChangeCountry={code => { setTab("settings"); handleChangeCountry(code); }} />}
      {tab === "history"  && <HistoryTab history={history} onItem={openHistItem} onDelete={handleDeleteHist} onClear={handleClearHistory} />}
      {tab === "settings" && <SettingsTab usage={usage} onClearHistory={handleClearHistory} onResetUsage={handleResetUsage} countryCode={countryCode} onChangeCountry={handleChangeCountry} />}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}
