import { useState, useEffect, useRef } from 'react';
import { C, SERIF, SANS, CATS, getCountryConfig } from './config.js';
import { getFollowUp } from './api.js';

/* ═══════════════════════════════════════════════════════
   LANTERN SVG ICON
═══════════════════════════════════════════════════════ */
export function Lantern({ size = 48, glow = false }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {glow && (
        <div style={{
          position: "absolute", inset: -size * 0.35, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(233,168,76,0.22) 0%, transparent 68%)",
          animation: "pulse 2.4s ease-in-out infinite", pointerEvents: "none",
        }} />
      )}
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <path d="M24 6 L24 12" stroke="#E9A84C" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M21 8.5 C21 7 22 6 24 6 C26 6 27 7 27 8.5" stroke="#E9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M17 14 Q24 11 31 14" stroke="#E9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <rect x="15" y="14" width="18" height="22" rx="3" fill="rgba(233,168,76,0.07)" stroke="#E9A84C" strokeWidth="1.4"/>
        <line x1="15" y1="21" x2="15" y2="29" stroke="#E9A84C" strokeWidth="1" opacity="0.45"/>
        <line x1="33" y1="21" x2="33" y2="29" stroke="#E9A84C" strokeWidth="1" opacity="0.45"/>
        <line x1="15" y1="25" x2="33" y2="25" stroke="#E9A84C" strokeWidth="0.6" opacity="0.2"/>
        <ellipse cx="24" cy="26" rx="4.5" ry="6" fill="rgba(233,168,76,0.45)"/>
        <ellipse cx="24" cy="24.5" rx="2.8" ry="4" fill="rgba(255,220,140,0.75)"/>
        <ellipse cx="24" cy="23" rx="1.4" ry="2.2" fill="rgba(255,250,230,0.92)"/>
        <path d="M17 36 Q24 39 31 36" stroke="#E9A84C" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6"/>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ACCORDION
═══════════════════════════════════════════════════════ */
export function Accordion({ title, emoji, items, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 10 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 18px", background: "none", border: "none", cursor: "pointer",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{emoji}</span>
          <span style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text }}>{title}</span>
        </div>
        <span style={{
          color: C.text2, fontSize: 16,
          transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease", display: "inline-block",
        }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: "0 18px 16px", borderTop: `1px solid ${C.border}` }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: color + "22", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, color }}>{i + 1}</span>
              </div>
              <span style={{ fontFamily: SANS, fontSize: 14, color: C.text, lineHeight: 1.65 }}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   URGENCY HELPERS
═══════════════════════════════════════════════════════ */
export function urgencyColor(u) { return u === "high" ? C.danger : u === "medium" ? C.warning : C.success; }
export function urgencyEmoji(u) { return u === "high" ? "🔴" : u === "medium" ? "🟡" : "🟢"; }

/* ═══════════════════════════════════════════════════════
   DEADLINE BANNER
═══════════════════════════════════════════════════════ */
export function DeadlineBanner({ deadline }) {
  if (!deadline) return null;
  return (
    <div style={{
      background: "rgba(240,165,0,0.12)", border: `1px solid rgba(240,165,0,0.4)`,
      borderRadius: 12, padding: "13px 16px", marginBottom: 16,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>⏰</span>
      <div>
        <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.warning, marginBottom: 2 }}>
          Deadline detected
        </div>
        <div style={{ fontFamily: SANS, fontSize: 13, color: C.text, lineHeight: 1.5 }}>{deadline}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ESCALATION CARD
═══════════════════════════════════════════════════════ */
export function EscalationCard({ catId, urgency, countryCode }) {
  const country = getCountryConfig(countryCode);
  const e = country.escalation[catId];
  if (!e || urgency === "low") return null;
  const isHigh = urgency === "high";

  return (
    <div style={{
      background: isHigh ? "rgba(232,87,74,0.08)" : "rgba(233,168,76,0.08)",
      border: `1px solid ${isHigh ? "rgba(232,87,74,0.35)" : "rgba(233,168,76,0.3)"}`,
      borderRadius: 14, padding: "18px", marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>{isHigh ? "🚨" : "👋"}</span>
        <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: isHigh ? C.danger : C.accent }}>
          {isHigh ? "Professional help recommended" : "Free help available"}
        </div>
      </div>
      <div style={{ fontFamily: SANS, fontSize: 13, color: C.text, marginBottom: 14, lineHeight: 1.5 }}>
        <strong style={{ color: C.text }}>{e.name}</strong> — {e.desc}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <a href={`tel:${e.phone.replace(/\s/g,"")}`} style={{
          flex: 1, padding: "11px 0", borderRadius: 10, border: `1px solid ${C.border}`,
          background: C.surf2, color: C.text, fontFamily: SANS, fontSize: 13,
          fontWeight: 600, textAlign: "center", textDecoration: "none",
          display: "block",
        }}>📞 {e.phone}</a>
        <a href={e.url} target="_blank" rel="noopener noreferrer" style={{
          flex: 1, padding: "11px 0", borderRadius: 10, border: "none",
          background: isHigh ? C.danger : C.accent,
          color: isHigh ? "#fff" : "#1A0E00",
          fontFamily: SANS, fontSize: 13, fontWeight: 700,
          textAlign: "center", textDecoration: "none", display: "block",
        }}>Visit website →</a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VOICE INPUT
═══════════════════════════════════════════════════════ */
export function VoiceInput({ onTranscript, disabled }) {
  const [state,      setState]      = useState("idle");   // idle | listening | unsupported
  const [interim,    setInterim]    = useState("");
  const recognitionRef = useRef(null);

  const supported = typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  function start() {
    if (!supported) { setState("unsupported"); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-GB";
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    let finalText = "";

    rec.onresult = e => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t + " ";
        else interim = t;
      }
      setInterim(interim);
      if (finalText) onTranscript(finalText.trim());
    };

    rec.onerror = () => { setState("idle"); setInterim(""); };
    rec.onend   = () => { setState("idle"); setInterim(""); };

    recognitionRef.current = rec;
    rec.start();
    setState("listening");
  }

  function stop() {
    recognitionRef.current?.stop();
    setState("idle");
    setInterim("");
  }

  useEffect(() => () => recognitionRef.current?.stop(), []);

  if (!supported) return null;

  const listening = state === "listening";

  return (
    <div style={{ marginBottom: 12 }}>
      <button
        onClick={listening ? stop : start}
        disabled={disabled}
        style={{
          width: "100%", padding: "15px 18px", borderRadius: 14,
          background: listening ? "rgba(232,87,74,0.1)" : C.surf,
          border: `1.5px solid ${listening ? C.danger : C.border}`,
          display: "flex", alignItems: "center", gap: 12,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s",
        }}
      >
        {/* Mic icon / waveform */}
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: listening ? C.danger : C.surf2,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: listening ? `0 0 0 6px rgba(232,87,74,0.18)` : "none",
          animation: listening ? "pulse 1.6s ease-in-out infinite" : "none",
          transition: "all 0.25s",
        }}>
          {listening ? (
            /* animated bars */
            <div style={{ display: "flex", gap: 2, alignItems: "center", height: 18 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{
                  width: 3, borderRadius: 2,
                  background: "#fff",
                  animation: `voiceBar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                  height: `${[10, 18, 14, 8][i]}px`,
                }}/>
              ))}
            </div>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="13" rx="3" fill={C.text2}/>
              <path d="M5 11a7 7 0 0 0 14 0" stroke={C.text2} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
              <line x1="12" y1="18" x2="12" y2="22" stroke={C.text2} strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="8" y1="22" x2="16" y2="22" stroke={C.text2} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          )}
        </div>

        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: listening ? C.danger : C.text }}>
            {listening ? "Recording… tap to stop" : "Speak your situation"}
          </div>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, marginTop: 2, lineHeight: 1.4, minHeight: 16 }}>
            {listening
              ? (interim || "Listening…")
              : "Easier than typing — just talk"}
          </div>
        </div>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DOCUMENT UPLOAD PICKER
═══════════════════════════════════════════════════════ */
export function DocumentUpload({ file, onFile, onRemove }) {
  const ref = useRef();

  return (
    <div style={{ marginBottom: 16 }}>
      {!file ? (
        <button
          onClick={() => ref.current.click()}
          style={{
            width: "100%", padding: "16px", borderRadius: 14,
            border: `1.5px dashed ${C.border}`, background: "transparent",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 10,
            transition: "border-color 0.2s, background 0.2s",
          }}
          onPointerDown={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = C.accentBg; }}
          onPointerUp={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "transparent"; }}
        >
          <span style={{ fontSize: 20 }}>📎</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text }}>
              Upload a document
            </div>
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, marginTop: 2 }}>
              Photo of a letter, PDF, or screenshot
            </div>
          </div>
        </button>
      ) : (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: C.surf, border: `1px solid ${C.accent}40`,
          borderRadius: 14, padding: "13px 16px",
        }}>
          <span style={{ fontSize: 22 }}>
            {file.type.startsWith("image") ? "🖼️" : "📄"}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {file.name}
            </div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: C.success, marginTop: 2 }}>
              ✓ Ready to analyse
            </div>
          </div>
          <button onClick={onRemove} style={{
            background: "none", border: "none", color: C.text3,
            fontSize: 20, cursor: "pointer", padding: "0 2px", lineHeight: 1, flexShrink: 0,
          }}>×</button>
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*,application/pdf"
        style={{ display: "none" }}
        onChange={e => { if (e.target.files[0]) onFile(e.target.files[0]); e.target.value = ""; }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FOLLOW-UP CHAT
═══════════════════════════════════════════════════════ */
export function FollowUpChat({ catId, situation, result, chatHistory, onNewMessage, countryCode }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    if (open && bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, open, loading]);

  async function send() {
    const msg = input.trim();
    if (!msg) return;
    setInput("");
    setLoading(true);
    onNewMessage({ role: "user", content: msg });
    try {
      const reply = await getFollowUp(catId, situation, result, chatHistory, msg, countryCode);
      onNewMessage({ role: "assistant", content: reply });
    } catch {
      onNewMessage({ role: "assistant", content: "Something went wrong. Please try again." });
    }
    setLoading(false);
  }

  const suggestions = [
    "What does this mean for me?",
    "How long do I have to respond?",
    "Can I ignore this?",
    "What if I can't afford a solicitor?",
  ];

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "15px 18px", borderRadius: 14,
          background: C.surf, border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>💬</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text }}>Ask a follow-up</div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: C.text3, marginTop: 1 }}>
              {chatHistory.length > 0 ? `${chatHistory.length} message${chatHistory.length !== 1 ? "s" : ""}` : "Have a question about your guidance?"}
            </div>
          </div>
        </div>
        <span style={{
          color: C.accent, fontSize: 16,
          transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease", display: "inline-block",
        }}>▾</span>
      </button>

      {open && (
        <div style={{
          background: C.surf2, border: `1px solid ${C.border}`,
          borderTop: "none", borderRadius: "0 0 14px 14px",
          overflow: "hidden",
        }}>
          {/* Messages */}
          <div style={{ maxHeight: 320, overflowY: "auto", padding: "16px 16px 0" }}>
            {chatHistory.length === 0 && (
              <div>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, textAlign: "center", marginBottom: 14 }}>
                  Tap a suggestion or type your question
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => setInput(s)} style={{
                      background: C.surf, border: `1px solid ${C.border}`,
                      borderRadius: 20, padding: "7px 13px",
                      fontFamily: SANS, fontSize: 12, color: C.text2, cursor: "pointer",
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {chatHistory.map((m, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}>
                <div style={{
                  maxWidth: "82%", padding: "10px 14px", borderRadius: 12,
                  background: m.role === "user" ? C.accent : C.surf,
                  border: m.role === "assistant" ? `1px solid ${C.border}` : "none",
                  fontFamily: SANS, fontSize: 13, lineHeight: 1.6,
                  color: m.role === "user" ? "#1A0E00" : C.text,
                  borderBottomRightRadius: m.role === "user" ? 4 : 12,
                  borderBottomLeftRadius: m.role === "assistant" ? 4 : 12,
                }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 5, padding: "8px 0 12px" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: "50%", background: C.accent,
                    animation: `dotPulse 1.3s ease-in-out ${i * 0.2}s infinite`,
                  }}/>
                ))}
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px 16px", display: "flex", gap: 10 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask anything about your situation…"
              style={{
                flex: 1, padding: "12px 14px", borderRadius: 10,
                background: C.surf, border: `1px solid ${C.border}`,
                color: C.text, fontFamily: SANS, fontSize: 14, outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = C.accent}
              onBlur={e => e.target.style.borderColor = C.border}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                width: 44, height: 44, borderRadius: 10, border: "none",
                background: input.trim() && !loading ? C.accent : C.surf2,
                color: input.trim() && !loading ? "#1A0E00" : C.text3,
                fontSize: 18, cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >↑</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COUNTRY PICKER  (used in onboarding + settings)
═══════════════════════════════════════════════════════ */
