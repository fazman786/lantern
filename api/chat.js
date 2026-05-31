export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Make sure we have an API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured — variable missing" });
  }

  if (!apiKey.startsWith("sk-ant-")) {
    return res.status(500).json({ error: "API key format wrong — should start with sk-ant-" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    // If Anthropic returned an error, pass it through clearly
    if (!response.ok) {
      return res.status(response.status).json({
        error: "Anthropic API error",
        status: response.status,
        detail: data
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: "Proxy error", detail: err.message });
  }
}
