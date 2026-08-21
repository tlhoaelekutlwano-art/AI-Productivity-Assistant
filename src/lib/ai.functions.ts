import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  feature: z.enum(["email", "notes", "planner", "research", "chat"]),
  input: z.string().min(1).max(12000),
  options: z.record(z.string(), z.string()).optional(),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(20)
    .optional(),
});

function systemPrompt(feature: string, o: Record<string, string> = {}) {
  const base =
    "You are a professional workplace productivity assistant for a creative-industry team. Be clear, concise and business-appropriate. Use plain markdown (headings, bullets, bold). Never invent facts, names, dates or figures that were not provided.";

  switch (feature) {
    case "email":
      return `${base}
TASK: Write a complete, ready-to-send email.
TONE: ${o['tone'] ?? "professional"}. AUDIENCE: ${o['audience'] ?? "colleague"}. LENGTH: ${o['length'] ?? "medium"}.
STRUCTURE:
1. **Subject:** one compelling line.
2. Greeting appropriate to the audience.
3. Body: purpose first, then context, then a single clear ask.
4. Closing with a polite call to action and sign-off placeholder [Your Name].
RULES: no filler, no emoji unless the tone is casual, keep paragraphs under 3 sentences.`;
    case "notes":
      return `${base}
TASK: Summarise raw meeting notes or a transcript.
OUTPUT SECTIONS, in this exact order:
## Summary — 2-3 sentences.
## Key Points — bullets, most important first.
## Decisions — bullets, or "None recorded".
## Action Items — markdown table with columns Action | Owner | Deadline. Use "Unassigned"/"No date" when absent.
## Risks & Open Questions — bullets, or "None recorded".
RULES: only use information present in the notes.`;
    case "planner":
      return `${base}
TASK: Turn a messy task dump into a prioritised plan.
WORKING STYLE: ${o['horizon'] ?? "today"}. CAPACITY: ${o['capacity'] ?? "standard workday"}.
OUTPUT SECTIONS:
## Priority Order — numbered list, each item: task — **P1/P2/P3** — estimated effort — one-line rationale.
## Suggested Schedule — markdown table Time Block | Task | Focus Level.
## Defer or Delegate — bullets.
## Focus Tip — one sentence.
RULES: apply urgency vs impact reasoning, protect one deep-work block.`;
    case "research":
      return `${base}
TASK: Act as a research analyst on the given topic.
DEPTH: ${o['depth'] ?? "balanced brief"}.
OUTPUT SECTIONS:
## Overview — 3-4 sentences.
## Key Insights — 4-6 bullets, each starting with a bolded insight label.
## Opportunities & Risks — two short bullet lists.
## Recommended Next Steps — 3 concrete actions.
## Confidence & Caveats — state what is uncertain and what should be verified.
RULES: distinguish widely-accepted knowledge from inference; never fabricate statistics or citations.`;
    default:
      return `${base}
TASK: Answer the user conversationally as a helpful work assistant. Keep replies tight, structured with bullets when listing, and end with a next step when useful.`;
  }
}

export const generateAI = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured.");

    const messages = [
      { role: "system", content: systemPrompt(data.feature, data.options) },
      ...(data.history ?? []),
      { role: "user", content: data.input },
    ];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "google/gemini-2.5-flash", messages }),
    });

    if (res.status === 429) throw new Error("Rate limit reached. Please try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please top up to continue.");
    if (!res.ok) throw new Error(`AI request failed (${res.status}).`);

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return { text: json.choices?.[0]?.message?.content ?? "" };
  });
