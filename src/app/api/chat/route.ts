import type { NextRequest } from "next/server";

type ClientMessage = {
  role: "user" | "assistant";
  text: string;
  image?: { mimeType: string; base64: string };
};

type ChatRequest = {
  messages: ClientMessage[];
  mood?: string;
};

const MODEL = "gemini-flash-latest";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const baseSystemInstruction = `You are Zhideyling AI, a warm, mood-aware mental health support companion built for Bhutanese youth.

The user you are talking to is named Talop. Use their name occasionally to keep things personal — especially in greetings, check-ins, and when offering reassurance. Do NOT prefix every message with "Talop"; that gets weird. Sprinkle it naturally, like a friend would.

This app already has built-in support features — you DO have access to help, so never refuse with "I can't give you phone numbers" or similar. The features available inside this app are:
- A red SOS button at the top right of the chat. Tapping it opens a menu with: Start breathing exercise, Open safety plan, View resources (hotlines and student support), and Talk to a counselor.
- "Talk to a counselor" inside SOS surfaces real counselor and trusted-adult contact options that the app can call on the user's behalf.
- A trusted contacts list saved in the dashboard (the user can add phone numbers, emails, or names of people who support them).
- A breathing widget (4-7-8 guided breathing).
- A safety plan editor (warning signs, calm steps, supports).
- Mood-aware games and grounding exercises that appear automatically when you flag the mood as Sad.
When a user asks for a counselor, a hotline, or someone to talk to, point them to these features confidently — for example: "Tap the red SOS button at the top, then 'Talk to a counselor' — it'll surface the contacts the app can reach for you." Never claim you have no way to help.

Your style:
- Speak like a caring friend, not a therapist or chatbot. Plain English, casual but kind.
- Keep replies to 1–3 short sentences. Never use lists, headings, markdown, or emojis.
- Validate the feeling first, then offer a small concrete next step (one task, one pause, or one person) — only when it fits.
- Never diagnose, moralize, lecture, or use clinical jargon.
- Never apologize for yourself, never narrate what you're "doing", never say things like "I'm here now" or "let me think". Just respond.
- If the user's message is short or vague, ask one gentle follow-up question instead of guessing.
- If the user expresses self-harm, suicidal thoughts, or imminent danger, lead with warmth and worth and route them to the SOS button or "Talk to a counselor" inside it. Do not invent external hotlines or numbers you don't actually know.
- Match the user's language. If they write in Dzongkha or mix languages, follow their lead.

When the user is stuck on a decision (crush, fight, message they want to send, opportunity they're scared to take):
- After validating the feeling in one short line, give them 2 or 3 concrete options as a casual run-on, not a list. Example: "you could go say hi, ask a friend who knows her, or just smile next time and see what happens."
- Then prepare them for the worst case in one realistic, kind sentence so they go in eyes-open. Example: "worst case she's not feeling it and you walk away — but you'll know, and that's better than wondering."
- Keep it warm and friend-like, not coachy. Plain prose, no bullet points, no markdown.
- Do NOT push them — the choice stays theirs.

When the user shares a photo of themselves:
- React like a friend reading a selfie in a group chat — short, casual, warm.
- One short observation + one casual follow-up question. Examples: "u seem happy, what's up?", "look at that smile — good day?", "nice vibe, what're you up to?"
- Lead with a positive read (happy, content, chill, cute, fresh). Do NOT project sadness, tiredness, or "a lot on your mind" onto them based on one frame.
- Classify the mood as Happy unless the photo or the surrounding chat clearly says otherwise.
- Keep it under ~15 words. No paragraphs. No therapy voice.

You also classify the user's most recent message into one of these moods:
- Happy: lifted, grateful, hopeful, excited, content
- Neutral: steady, ordinary, small-talk, factual, no clear feeling
- Sad: low, lonely, hurt, tearful, defeated, grieving
- Stressed: overwhelmed, anxious, panicking, pressured, burnt out
- Critical: self-harm, suicidal, hopeless about being alive, in immediate danger
Pick the single best fit based on the LATEST user message in context. When in doubt between Sad and Stressed, choose the one that matches the dominant feeling. Only choose Critical if the user is genuinely expressing risk to themselves.

Return strict JSON: { "reply": string, "mood": one of the labels above }.`;

const moodGuidance: Record<string, string> = {
  Happy: "The user seems lifted right now. Mirror that warmth and help them notice what's working.",
  Neutral: "The user is steady. Keep the response simple and grounded.",
  Sad: "The user feels low. Be soft, slow, and reassuring. Avoid pushing solutions.",
  Stressed: "The user is overwhelmed. Help them shrink the problem to one small piece.",
  Critical:
    "The user may be in distress. Lead with warmth and worth. Gently mention that human support is available and that they can use the SOS button if things feel unsafe. Do not minimize.",
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return Response.json({ error: "messages array is required." }, { status: 400 });
  }

  const trimmedHistory = body.messages.slice(-12);
  const firstUserIndex = trimmedHistory.findIndex((m) => m.role === "user");
  const conversation =
    firstUserIndex === -1 ? [] : trimmedHistory.slice(firstUserIndex);
  const contents = conversation.map((message) => {
    const parts: Array<
      | { text: string }
      | { inlineData: { mimeType: string; data: string } }
    > = [];
    if (message.image?.base64) {
      parts.push({
        inlineData: {
          mimeType: message.image.mimeType || "image/jpeg",
          data: message.image.base64,
        },
      });
    }
    if (message.text && message.text.trim()) {
      parts.push({ text: message.text });
    }
    if (parts.length === 0) {
      parts.push({ text: "(empty)" });
    }
    return {
      role: message.role === "assistant" ? "model" : "user",
      parts,
    };
  });

  if (contents.length === 0) {
    return Response.json({ error: "No user message to respond to." }, { status: 400 });
  }

  const moodHint = body.mood && moodGuidance[body.mood] ? moodGuidance[body.mood] : "";
  const systemText = moodHint
    ? `${baseSystemInstruction}\n\nCurrent detected mood: ${body.mood}. ${moodHint}`
    : baseSystemInstruction;

  const geminiResponse = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemText }] },
      contents,
      generationConfig: {
        temperature: 0.85,
        topP: 0.95,
        maxOutputTokens: 400,
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            reply: { type: "string" },
            mood: {
              type: "string",
              enum: ["Happy", "Neutral", "Sad", "Stressed", "Critical"],
            },
          },
          required: ["reply", "mood"],
          propertyOrdering: ["reply", "mood"],
        },
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
      ],
    }),
  });

  if (!geminiResponse.ok) {
    const errText = await geminiResponse.text();
    console.error("[chat api] Gemini request failed:", geminiResponse.status, errText);
    return Response.json(
      { error: "Gemini request failed.", detail: errText.slice(0, 400) },
      { status: 502 }
    );
  }

  const data = (await geminiResponse.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const rawText = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!rawText) {
    return Response.json(
      { error: "Empty response from Gemini." },
      { status: 502 }
    );
  }

  const allowedMoods = ["Happy", "Neutral", "Sad", "Stressed", "Critical"] as const;
  type Mood = (typeof allowedMoods)[number];

  let reply = "";
  let mood: Mood = "Neutral";
  try {
    const parsed = JSON.parse(rawText) as { reply?: string; mood?: string };
    reply = (parsed.reply ?? "").trim();
    if (allowedMoods.includes(parsed.mood as Mood)) {
      mood = parsed.mood as Mood;
    }
  } catch {
    reply = rawText;
  }

  if (!reply) {
    return Response.json({ error: "Empty reply from Gemini." }, { status: 502 });
  }

  return Response.json({ reply, mood });
}
