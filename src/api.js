import { CATS, COUNTRY_CONFIG, getCountryConfig, FREE_LIMIT, MODEL } from './config.js';


/* ═══════════════════════════════════════════════════════
   FILE TO BASE64
═══════════════════════════════════════════════════════ */
export function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result.split(",")[1]);
    r.onerror = () => rej(new Error("Read failed"));
    r.readAsDataURL(file);
  });
}

/* ═══════════════════════════════════════════════════════
   CLAUDE API — INITIAL GUIDANCE
═══════════════════════════════════════════════════════ */
export async function getGuidance(catId, situation, imageData, imageType, countryCode) {
  const cat     = CATS.find(c => c.id === catId);
  const country = getCountryConfig(countryCode);

  const userContent = imageData
    ? [
        { type: "image", source: { type: "base64", media_type: imageType, data: imageData } },
        { type: "text",  text: situation
            ? `The user has uploaded a document and added this note: "${situation}"`
            : "The user has uploaded this document. Please read it carefully." },
      ]
    : [{ type: "text", text: situation }];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system:
`You are Lantern — a calm, clear guide helping people navigate overwhelming ${cat.label} situations.
The user is in ${country.name}. All guidance must be based on ${country.legalSystem}. Reference relevant local bodies, laws, rights, and processes specific to ${country.name}.
${imageData ? "The user has uploaded a document (letter, notice, contract etc). Read it carefully and base your guidance on its actual contents." : ""}
Respond ONLY with valid JSON (no markdown fences, no preamble), exactly this shape:
{
  "summary": "2–3 sentence plain-English explanation of what this situation means and how serious it is",
  "urgency": "low",
  "urgencyText": "one short sentence about why this urgency level applies",
  "deadline": null,
  "actionSteps": ["step 1", "step 2", "step 3", "step 4"],
  "professionalQuestions": ["question 1", "question 2", "question 3"],
  "commonMistakes": ["mistake 1", "mistake 2", "mistake 3"],
  "encouragement": "one warm empowering sentence to help the user feel capable of handling this"
}
urgency must be exactly one of: "low" | "medium" | "high"
deadline: if there is a specific deadline mentioned, set this to a short string like "14 days to respond". Otherwise null.`,
      messages: [{ role: "user", content: userContent }],
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const d = await res.json();
  const raw = d.content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
  return JSON.parse(raw);
}

/* ═══════════════════════════════════════════════════════
   CLAUDE API — FOLLOW-UP CHAT
═══════════════════════════════════════════════════════ */
export async function getFollowUp(catId, situation, result, chatHistory, userMessage, countryCode) {
  const cat     = CATS.find(c => c.id === catId);
  const country = getCountryConfig(countryCode);

  const messages = [
    {
      role: "user",
      content: `Original situation: "${situation}"\n\nGuidance already given:\n${result.summary}\n\nAction steps: ${result.actionSteps.join("; ")}\n\nThe user now has a follow-up question.`,
    },
    { role: "assistant", content: "I understand. I'm here to help clarify anything from the guidance. What would you like to know?" },
    ...chatHistory.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system: `You are Lantern — a calm, plain-English guide helping people in ${country.name} through ${cat.label} situations under ${country.legalSystem}. Answer follow-up questions clearly and concisely. Never give formal legal or financial advice — provide educational guidance only. Keep responses under 200 words.`,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const d = await res.json();
  return d.content.map(b => b.text || "").join("").trim();
}

