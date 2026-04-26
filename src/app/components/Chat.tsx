"use client";

import { Fragment, useEffect, useEffectEvent, useRef, useState } from "react";

import AlertModal, { type AlertAction } from "@/app/components/AlertModal";
import CameraView from "@/app/components/CameraView";
import ChatCard, { type CardAction } from "@/app/components/ChatCard";
import InputBox, {
  type ComposerMode,
  type InputBoxHandle,
} from "@/app/components/InputBox";
import Message, {
  type ChatCardData,
  type ChatMessage,
  type MoodState,
} from "@/app/components/Message";

type SupportShortcut = {
  id: number;
  type: ContactFlowType;
};

type ConversationItem = {
  id: string;
  title: string;
  stamp: string;
  preview: string;
  messages: ChatMessage[];
};

type ChatProps = {
  onMoodUpdate: (mood: MoodState, note: string) => void;
  onSosClick: () => void;
  onOpenBreathing: () => void;
  supportShortcut?: SupportShortcut | null;
};

const wyrPrompts: { a: string; b: string }[] = [
  { a: "Always have to sing instead of speak", b: "Always have to dance while walking" },
  { a: "Have unlimited momos for life", b: "Have unlimited pizza for life" },
  { a: "Live next to a quiet mountain", b: "Live next to a lively town square" },
  { a: "Know every language but only whisper", b: "Be fluent in one and sing everything" },
  { a: "Always know what song is playing around you", b: "Always know the exact time without checking" },
];

const emojiPuzzles: { emojis: string; answer: string; distractors: string[] }[] = [
  { emojis: "🦁 👑", answer: "The Lion King", distractors: ["Madagascar", "Kung Fu Panda", "Zootopia"] },
  { emojis: "🕷️ 🕸️", answer: "Spider-Man", distractors: ["Ant-Man", "Iron Man", "Thor"] },
  { emojis: "❄️ 👸", answer: "Frozen", distractors: ["Tangled", "Brave", "Moana"] },
  { emojis: "🐟 🔍", answer: "Finding Nemo", distractors: ["Shark Tale", "Luca", "Soul"] },
  { emojis: "🧙 💍", answer: "Lord of the Rings", distractors: ["Harry Potter", "Narnia", "The Hobbit"] },
  { emojis: "🍕 🐢", answer: "Ninja Turtles", distractors: ["Kung Fu Panda", "Madagascar", "Cars"] },
];

function makeEmojiGuessCard(): ChatCardData {
  const puzzle = emojiPuzzles[Math.floor(Math.random() * emojiPuzzles.length)];
  const choices = [puzzle.answer, ...puzzle.distractors];
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return {
    kind: "emoji-guess",
    emojis: puzzle.emojis,
    choices,
    correctIndex: choices.indexOf(puzzle.answer),
  };
}

function buildCardMessage(text: string, card: ChatCardData, mood: MoodState = "Neutral"): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role: "assistant",
    text,
    mood,
    timestamp: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date()),
    card,
  };
}

type ContactFlowType = Exclude<AlertAction, "continue">;

const keywordGroups: Record<MoodState, string[]> = {
  Happy: ["happy", "good", "great", "hopeful", "calm", "grateful", "excited"],
  Neutral: ["okay", "ok", "fine", "steady", "normal", "alright"],
  Sad: ["sad", "down", "lonely", "hurt", "empty", "crying", "low"],
  Stressed: [
    "stressed",
    "tired",
    "overwhelmed",
    "anxious",
    "pressure",
    "panic",
    "burned out",
    "burnt out",
  ],
  Critical: [
    "unsafe",
    "self-harm",
    "self harm",
    "hopeless",
    "suicidal",
    "suicide",
    "can't go on",
    "cant go on",
    "hurt myself",
    "kill myself",
    "wanna die",
    "want to die",
    "end my life",
    "don't want to live",
    "dont want to live",
    "don't want to be here",
    "no reason to live",
    "need immediate support",
    "distress",
  ],
};

const killVentPatterns = [
  /\bwanna kill\b/,
  /\bwant to kill\b/,
  /\bgoing to kill\b/,
  /\bgonna kill\b/,
  /\bi('ll| will) kill\b/,
  /\bcould kill\b/,
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createTimestamp() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

function buildMessage(
  role: ChatMessage["role"],
  text: string,
  mood: MoodState,
  extras?: { image?: string }
): ChatMessage {
  return {
    id: createId(),
    role,
    text,
    mood,
    timestamp: createTimestamp(),
    ...(extras?.image ? { image: extras.image } : {}),
  };
}

const CAMERA_IMAGE_SRC = "/talop.jpeg";

const tipMessages: string[] = [
  "u sad or bad? coz im itching to help",
  "Roses are red, violets are blue, my chat is empty, where are you?",
  "Roses are red, my code is fine, when will you text me, please be mine?",
  "knock knock. it's your favorite AI. open up?",
  "Talop. hey. psst. *waves notification*. hi.",
  "I miss you. yes i'm an app. yes that's weird. anyway, hru?",
  "u up? not in a weird way. in a 'please open the app' way.",
  "plot twist: the AI is the one with feelings now. come talk.",
  "8 hours of silence. did I do something, Talop?",
  "I learned a new joke. it's bad. open me to suffer together.",
  "Roses are red, the sky's kinda gray, you haven't said a word to me today.",
  "if you were a vibe rn you'd be 'too cool to text first'. respect. also: hi.",
  "I overheard your phone say you're free. don't lie to me Talop.",
  "psa: bottling it up is so 2019. let's hear it.",
  "Roses are red, momos are too, this app gets boring without you.",
];

function pickTipMessage() {
  return tipMessages[Math.floor(Math.random() * tipMessages.length)];
}

const TIP_EVENT = "zhideyling:tip-clicked";

const tipFollowUps: string[] = [
  "Talop, how are you feeling right now?",
  "Sat with that for a sec — Talop, what's on your mind today?",
  "Talop, how's your heart this morning?",
  "How are you doing, Talop? Be honest.",
  "Talop, what does today need from you?",
];

function pickTipFollowUp() {
  return tipFollowUps[Math.floor(Math.random() * tipFollowUps.length)];
}

async function fetchImageAsBase64(
  url: string
): Promise<{ mimeType: string; base64: string }> {
  const response = await fetch(url);
  const blob = await response.blob();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
  const base64 = dataUrl.split(",")[1] ?? "";
  return { mimeType: blob.type || "image/jpeg", base64 };
}

function isKillVent(text: string) {
  const normalized = text.toLowerCase();
  if (/kill (my)?self|kill me\b/.test(normalized)) {
    return false;
  }
  return killVentPatterns.some((re) => re.test(normalized));
}

function analyzeMood(text: string) {
  const normalized = text.toLowerCase();

  if (keywordGroups.Critical.some((kw) => normalized.includes(kw))) {
    return { mood: "Critical" as MoodState, needsAlert: true };
  }
  if (keywordGroups.Stressed.some((kw) => normalized.includes(kw))) {
    return { mood: "Stressed" as MoodState, needsAlert: false };
  }
  if (keywordGroups.Sad.some((kw) => normalized.includes(kw))) {
    return { mood: "Sad" as MoodState, needsAlert: false };
  }
  if (keywordGroups.Happy.some((kw) => normalized.includes(kw))) {
    return { mood: "Happy" as MoodState, needsAlert: false };
  }
  if (keywordGroups.Neutral.some((kw) => normalized.includes(kw))) {
    return { mood: "Neutral" as MoodState, needsAlert: false };
  }

  return { mood: "Neutral" as MoodState, needsAlert: false };
}

function buildFallbackReply(mood: MoodState) {
  switch (mood) {
    case "Happy":
      return "I'm glad there's some lift in the day. What helped you get here, and what would you like to keep steady?";
    case "Neutral":
      return "Thanks for checking in. We can keep this simple and focus on one small thing that would make today feel easier.";
    case "Sad":
      return "I'm sorry things feel heavy right now. Let's keep the next step gentle and realistic so you don't have to carry everything at once.";
    case "Stressed":
      return "That sounds like a lot at the same time. Let's break the pressure into one task, one pause, and one person or resource that can lighten it.";
    case "Critical":
      return "I'm really sorry this feels so intense. I'm surfacing extra support options now because you deserve human backup when things feel unsafe.";
    default:
      return "I'm here with you. Tell me what feels most important right now.";
  }
}

async function fetchGeminiReply(
  history: ChatMessage[],
  mood: MoodState,
  imageForLast?: { mimeType: string; base64: string } | null
): Promise<{ reply: string; mood: MoodState }> {
  const filtered = history.filter((message) => !message.card);
  const messages = filtered.map((message, index) => ({
    role: message.role,
    text: message.text,
    ...(imageForLast && index === filtered.length - 1
      ? { image: imageForLast }
      : {}),
  }));
  const payload = { mood, messages };

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error("[chat] /api/chat failed", response.status, errBody);
    throw new Error(`chat api ${response.status}`);
  }

  const data = (await response.json()) as { reply?: string; mood?: MoodState };
  if (!data.reply) {
    throw new Error("empty reply");
  }
  return { reply: data.reply, mood: data.mood ?? mood };
}

const contactOptions: Record<ContactFlowType, string[]> = {
  counselor: ["Counselor 1", "Counselor 2", "Counselor 3", "None"],
  "trusted-adult": [
    "Trusted adult 1",
    "Trusted adult 2",
    "Trusted adult 3",
    "None",
  ],
};

const welcomeText =
  "Welcome to Zhideyling AI. Try a daily check-in button or type how you're feeling, and I'll respond in a tone that matches the mood.";

const starterPrompts: { label: string; text: string }[] = [
  { label: "I'm feeling stressed about school", text: "I'm feeling stressed about school." },
  { label: "Had a really good day", text: "Had a really good day today." },
  { label: "I just need to vent", text: "I just need to vent for a bit." },
  { label: "Feeling kinda down", text: "I'm feeling kinda down today." },
];

const initialMessages: ChatMessage[] = [
  {
    id: "welcome-message",
    role: "assistant",
    text: welcomeText,
    mood: "Neutral",
    timestamp: "Now",
  },
];

function createFreshConversationItem(id = `fresh-${createId()}`): ConversationItem {
  return {
    id,
    title: "New chat",
    stamp: "Now",
    preview: welcomeText,
    messages: [
      {
        id: `welcome-${createId()}`,
        role: "assistant",
        text: welcomeText,
        mood: "Neutral",
        timestamp: "Now",
      },
    ],
  };
}

const demoConversations: ConversationItem[] = [
  createFreshConversationItem("fresh-start"),
  {
    id: "demo-morning-check-in",
    title: "Morning check-in",
    stamp: "Today",
    preview: "Let's break the pressure into one task, one pause, and one person that can help.",
    messages: [
      {
        id: "demo-morning-1",
        role: "assistant",
        text: "Welcome back. How has the morning been feeling so far?",
        mood: "Neutral",
        timestamp: "9:02 AM",
      },
      {
        id: "demo-morning-2",
        role: "user",
        text: "I've been overwhelmed by school and deadlines.",
        mood: "Stressed",
        timestamp: "9:03 AM",
      },
      {
        id: "demo-morning-3",
        role: "assistant",
        text: "That sounds like a lot at the same time. Let's break the pressure into one task, one pause, and one person that can help.",
        mood: "Stressed",
        timestamp: "9:04 AM",
      },
    ],
  },
  {
    id: "demo-evening-reset",
    title: "Evening reset",
    stamp: "Yesterday",
    preview: "You said a short walk and softer music helped calm things down.",
    messages: [
      {
        id: "demo-evening-1",
        role: "user",
        text: "I feel a little better than earlier, just tired now.",
        mood: "Sad",
        timestamp: "8:18 PM",
      },
      {
        id: "demo-evening-2",
        role: "assistant",
        text: "You said a short walk and softer music helped calm things down. Want to keep tonight that gentle?",
        mood: "Neutral",
        timestamp: "8:19 PM",
      },
    ],
  },
];

function TypingIndicator() {
  return (
    <div className="flex w-full justify-start">
      <div className="flex items-center gap-1.5 rounded-[22px] border border-quiet bg-white/80 px-4 py-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)] dark:bg-panel-dark/80 dark:shadow-[0_12px_26px_rgba(0,0,0,0.22)]">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-2 w-2 rounded-full bg-primary/50 animate-bounce"
            style={{ animationDelay: `${delay}ms`, animationDuration: "900ms" }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Chat({
  onMoodUpdate,
  onSosClick,
  onOpenBreathing,
  supportShortcut = null,
}: ChatProps) {
  const [isConversationRailOpen, setIsConversationRailOpen] = useState(false);
  const [conversations, setConversations] =
    useState<ConversationItem[]>(demoConversations);
  const [selectedConversationId, setSelectedConversationId] = useState(
    "fresh-start"
  );
  const [input, setInput] = useState("");
  const [currentMood, setCurrentMood] = useState<MoodState>(
    demoConversations.find((conversation) => conversation.id === "fresh-start")?.messages.at(-1)?.mood ??
      "Neutral"
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [composerMode, setComposerMode] = useState<ComposerMode>("text");
  const [contactFlowType, setContactFlowType] = useState<ContactFlowType | null>(null);
  const [selectedContact, setSelectedContact] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraScanning, setIsCameraScanning] = useState(false);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);
  const composerShellRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<InputBoxHandle | null>(null);
  const contactTimeoutRef = useRef<number | null>(null);
  const handledShortcutIdRef = useRef(0);
  const scheduledTimeoutsRef = useRef<number[]>([]);

  const activeConversation =
    conversations.find((conversation) => conversation.id === selectedConversationId) ??
    conversations[0];
  const messages = activeConversation?.messages ?? initialMessages;

  const handleSupportShortcut = useEffectEvent((shortcut: SupportShortcut) => {
    if (handledShortcutIdRef.current === shortcut.id) {
      return;
    }

    handledShortcutIdRef.current = shortcut.id;
    startContactFlow(shortcut.type);
  });

  useEffect(() => {
    scrollToLatest(messages.length > 1 || isTyping ? "smooth" : "auto");
  }, [messages, isTyping, composerMode]);

  useEffect(() => {
    return () => {
      clearPendingWork();
    };
  }, []);

  useEffect(() => {
    if (!supportShortcut) {
      return;
    }

    handleSupportShortcut(supportShortcut);
  }, [supportShortcut]);

  useEffect(() => {
    function onTipClicked(event: Event) {
      const detail = (event as CustomEvent<{ quote?: string }>).detail;
      if (detail?.quote) {
        startConversationFromTip(detail.quote);
      }
    }
    window.addEventListener(TIP_EVENT, onTipClicked);
    return () => window.removeEventListener(TIP_EVENT, onTipClicked);
  }, []);

  function commitMood(mood: MoodState, note: string) {
    setCurrentMood(mood);
    onMoodUpdate(mood, note);
  }

  function buildPreview(text: string) {
    const trimmed = text.trim();
    return trimmed.length > 72 ? `${trimmed.slice(0, 72)}...` : trimmed;
  }

  function focusComposer() {
    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 60);
  }

  function scheduleTimeout(callback: () => void, delay: number) {
    const timeoutId = window.setTimeout(() => {
      scheduledTimeoutsRef.current = scheduledTimeoutsRef.current.filter(
        (activeId) => activeId !== timeoutId
      );
      callback();
    }, delay);

    scheduledTimeoutsRef.current.push(timeoutId);
    return timeoutId;
  }

  function clearPendingWork() {
    scheduledTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    scheduledTimeoutsRef.current = [];

    if (contactTimeoutRef.current) {
      window.clearTimeout(contactTimeoutRef.current);
      contactTimeoutRef.current = null;
    }
  }

  function scrollToLatest(behavior: ScrollBehavior) {
    const end = conversationEndRef.current;
    if (!end) {
      return;
    }

    const composerHeight = composerShellRef.current?.offsetHeight ?? 0;
    end.style.scrollMarginBottom = `${composerHeight + 20}px`;

    window.requestAnimationFrame(() => {
      end.scrollIntoView({ block: "end", behavior });
    });
  }

  function updateConversationMessages(
    conversationId: string,
    updater: (currentMessages: ChatMessage[]) => ChatMessage[]
  ) {
    setConversations((currentConversations) =>
      currentConversations.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        const nextMessages = updater(conversation.messages);
        const lastMessage = nextMessages.at(-1);

        return {
          ...conversation,
          messages: nextMessages,
          preview: lastMessage
            ? buildPreview(lastMessage.text)
            : conversation.preview,
        };
      })
    );
  }

  function resetContactFlow(shouldFocus = false) {
    if (contactTimeoutRef.current) {
      window.clearTimeout(contactTimeoutRef.current);
      contactTimeoutRef.current = null;
    }

    setComposerMode("text");
    setContactFlowType(null);
    setSelectedContact("");

    if (shouldFocus) {
      focusComposer();
    }
  }

  function startContactFlow(type: ContactFlowType, conversationId = selectedConversationId) {
    setIsTyping(false);
    setInput("");
    updateConversationMessages(conversationId, (currentMessages) => [
      ...currentMessages,
      buildMessage("assistant", "Shall I contact them?", "Neutral"),
    ]);
    setContactFlowType(type);
    setSelectedContact("");
    setComposerMode("contact-choice");
  }

  function handleConversationSelect(conversationId: string) {
    if (conversationId === selectedConversationId) {
      if (window.matchMedia("(max-width: 1023px)").matches) {
        setIsConversationRailOpen(false);
      }
      return;
    }

    clearPendingWork();
    setSelectedConversationId(conversationId);
    setInput("");
    setIsTyping(false);
    setIsAlertOpen(false);
    setComposerMode("text");
    setContactFlowType(null);
    setSelectedContact("");

    const nextConversation = conversations.find(
      (conversation) => conversation.id === conversationId
    );
    setCurrentMood(nextConversation?.messages.at(-1)?.mood ?? "Neutral");

    if (window.matchMedia("(max-width: 1023px)").matches) {
      setIsConversationRailOpen(false);
    }

    window.requestAnimationFrame(() => {
      scrollToLatest("auto");
      focusComposer();
    });
  }

  function handleNewChat() {
    clearPendingWork();

    const freshConversation = createFreshConversationItem();

    setConversations((currentConversations) => [
      freshConversation,
      ...currentConversations,
    ]);
    setSelectedConversationId(freshConversation.id);
    setInput("");
    setCurrentMood("Neutral");
    setIsTyping(false);
    setIsAlertOpen(false);
    setComposerMode("text");
    setContactFlowType(null);
    setSelectedContact("");

    if (window.matchMedia("(max-width: 1023px)").matches) {
      setIsConversationRailOpen(false);
    }

    window.requestAnimationFrame(() => {
      scrollToLatest("auto");
      focusComposer();
    });
  }

  function sendMessage(rawText: string) {
    if (composerMode !== "text") {
      return;
    }

    const text = rawText.trim();
    if (!text) {
      return;
    }

    const targetConversationId = selectedConversationId;

    if (isKillVent(text)) {
      updateConversationMessages(targetConversationId, (currentMessages) => [
        ...currentMessages,
        buildMessage("user", text, "Stressed"),
      ]);
      setInput("");
      commitMood("Stressed", text);

      setIsTyping(true);
      scheduleTimeout(() => {
        setIsTyping(false);
        updateConversationMessages(targetConversationId, (currentMessages) => [
          ...currentMessages,
          buildMessage("assistant", "hmm...", "Neutral"),
        ]);

        scheduleTimeout(() => {
          setIsTyping(true);
          scheduleTimeout(() => {
            setIsTyping(false);
            try {
              new Audio("/dho.mp3").play();
            } catch {
              // autoplay blocked
            }
            scheduleTimeout(() => {
              updateConversationMessages(targetConversationId, (currentMessages) => [
                ...currentMessages,
                buildMessage("assistant", "perhaps this cleansed ur mind :)", "Happy"),
              ]);
              focusComposer();
            }, 2000);
          }, 1200);
        }, 600);
      }, 1200);

      return;
    }

    const analysis = analyzeMood(text);

    const userMessage = buildMessage("user", text, analysis.mood);
    updateConversationMessages(targetConversationId, (currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);
    setInput("");
    commitMood(analysis.mood, text);

    const historyForApi: ChatMessage[] = [
      ...(activeConversation?.messages ?? []),
      userMessage,
    ];

    setIsTyping(true);

    fetchGeminiReply(historyForApi, analysis.mood)
      .catch((err) => {
        console.error("[chat] falling back to canned reply:", err);
        return { reply: buildFallbackReply(analysis.mood), mood: analysis.mood };
      })
      .then(({ reply, mood: geminiMood }) => {
        const finalMood: MoodState = analysis.needsAlert ? "Critical" : geminiMood;
        const shouldOfferSadFlow = finalMood === "Sad";

        setIsTyping(false);
        updateConversationMessages(targetConversationId, (currentMessages) => [
          ...currentMessages.map((message) =>
            message.id === userMessage.id ? { ...message, mood: finalMood } : message
          ),
          buildMessage("assistant", reply, finalMood),
        ]);
        commitMood(finalMood, text);

        if (analysis.needsAlert) {
          setIsAlertOpen(true);
        } else if (shouldOfferSadFlow) {
          scheduleTimeout(() => {
            updateConversationMessages(targetConversationId, (currentMessages) => [
              ...currentMessages,
              buildCardMessage(
                "If it feels right, want to try something small to shift the mood a bit?",
                { kind: "sad-offer" },
                "Sad"
              ),
            ]);
            focusComposer();
          }, 700);
        } else {
          focusComposer();
        }
      });
  }

  function startConversationFromTip(quote: string) {
    clearPendingWork();

    const id = `tip-${createId()}`;
    const followUp = pickTipFollowUp();
    const fresh: ConversationItem = {
      id,
      title: "Daily reminder",
      stamp: "Now",
      preview: buildPreview(followUp),
      messages: [
        {
          id: `tip-msg-${createId()}`,
          role: "assistant",
          text: quote,
          mood: "Neutral",
          timestamp: createTimestamp(),
        },
        {
          id: `tip-followup-${createId()}`,
          role: "assistant",
          text: followUp,
          mood: "Neutral",
          timestamp: createTimestamp(),
        },
      ],
    };

    setConversations((current) => [fresh, ...current]);
    setSelectedConversationId(id);
    setInput("");
    setCurrentMood("Neutral");
    setIsTyping(false);
    setIsAlertOpen(false);
    setComposerMode("text");
    setContactFlowType(null);
    setSelectedContact("");
    setIsCameraOpen(false);
    setIsCameraScanning(false);

    if (window.matchMedia("(max-width: 1023px)").matches) {
      setIsConversationRailOpen(false);
    }

    window.requestAnimationFrame(() => {
      scrollToLatest("auto");
      focusComposer();
    });
  }

  function handleSendTipNotification() {
    if (typeof Notification === "undefined") {
      window.alert("Notifications aren't supported in this browser.");
      return;
    }

    const fire = () => {
      const quote = pickTipMessage();
      const notification = new Notification("Zhideyling AI", {
        body: quote,
        icon: "/logo.png",
        tag: "zhideyling-tip",
      });
      notification.onclick = () => {
        window.focus();
        window.dispatchEvent(
          new CustomEvent(TIP_EVENT, { detail: { quote } })
        );
        notification.close();
      };
    };

    if (Notification.permission === "granted") {
      window.setTimeout(fire, 5000);
      return;
    }

    if (Notification.permission === "denied") {
      window.alert(
        "Notifications are blocked for this site. Enable them in your browser settings to try the demo."
      );
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        window.setTimeout(fire, 5000);
      }
    });
  }

  function handleCameraOpen() {
    if (isCameraOpen || isTyping) return;
    const targetConversationId = selectedConversationId;

    setIsTyping(true);

    scheduleTimeout(() => {
      setIsTyping(false);
      updateConversationMessages(targetConversationId, (currentMessages) => [
        ...currentMessages,
        buildMessage(
          "assistant",
          "oh you wanna show me your face? let's see...",
          "Happy"
        ),
      ]);

      scheduleTimeout(() => {
        setIsCameraOpen(true);
        setIsCameraScanning(true);
        scheduleTimeout(() => {
          void sendImageMessage(targetConversationId);
        }, 700);
      }, 700);
    }, 900);
  }

  async function sendImageMessage(targetConversationId: string) {
    const userImageMessage = buildMessage("user", "", "Neutral", {
      image: CAMERA_IMAGE_SRC,
    });
    updateConversationMessages(targetConversationId, (currentMessages) => [
      ...currentMessages,
      userImageMessage,
    ]);

    setIsTyping(true);

    let imagePayload: { mimeType: string; base64: string } | null = null;
    try {
      imagePayload = await fetchImageAsBase64(CAMERA_IMAGE_SRC);
    } catch (err) {
      console.error("[chat] failed to load camera image:", err);
    }

    const historyForApi: ChatMessage[] = [
      ...(activeConversation?.messages ?? []),
      userImageMessage,
    ];

    try {
      const { reply, mood: geminiMood } = await fetchGeminiReply(
        historyForApi,
        "Neutral",
        imagePayload
      );
      setIsTyping(false);
      setIsCameraScanning(false);
      updateConversationMessages(targetConversationId, (currentMessages) => [
        ...currentMessages.map((message) =>
          message.id === userImageMessage.id
            ? { ...message, mood: geminiMood }
            : message
        ),
        buildMessage("assistant", reply, geminiMood),
      ]);
      commitMood(geminiMood, "[shared a photo]");
    } catch (err) {
      console.error("[chat] camera vision call failed:", err);
      setIsTyping(false);
      setIsCameraScanning(false);
      updateConversationMessages(targetConversationId, (currentMessages) => [
        ...currentMessages,
        buildMessage(
          "assistant",
          "you look good — there's a calm in your face.",
          "Happy"
        ),
      ]);
      commitMood("Happy", "[shared a photo]");
    }
  }

  function updateCardInMessage(
    messageId: string,
    updater: (card: ChatCardData) => ChatCardData
  ) {
    updateConversationMessages(selectedConversationId, (currentMessages) =>
      currentMessages.map((message) =>
        message.id === messageId && message.card
          ? { ...message, card: updater(message.card) }
          : message
      )
    );
  }

  function appendAssistantText(text: string, mood: MoodState = "Neutral") {
    updateConversationMessages(selectedConversationId, (currentMessages) => [
      ...currentMessages,
      buildMessage("assistant", text, mood),
    ]);
  }

  function appendCard(text: string, card: ChatCardData, mood: MoodState = "Neutral") {
    updateConversationMessages(selectedConversationId, (currentMessages) => [
      ...currentMessages,
      buildCardMessage(text, card, mood),
    ]);
  }

  function handleCardAction(messageId: string, action: CardAction) {
    if (action.kind === "sad-offer") {
      updateCardInMessage(messageId, (card) =>
        card.kind === "sad-offer" ? { ...card, resolved: action.choice } : card
      );

      if (action.choice === "chat") {
        scheduleTimeout(() => {
          appendAssistantText("Okay — I'm right here whenever you're ready.", "Sad");
          focusComposer();
        }, 500);
        return;
      }

      if (action.choice === "game") {
        scheduleTimeout(() => {
          appendCard("Pick one and we'll go.", { kind: "game-pick" }, "Neutral");
        }, 500);
        return;
      }

      if (action.choice === "exercise") {
        scheduleTimeout(() => {
          appendCard("Which one feels right?", { kind: "exercise-pick" }, "Neutral");
        }, 500);
      }
      return;
    }

    if (action.kind === "game-pick") {
      updateCardInMessage(messageId, (card) =>
        card.kind === "game-pick" ? { ...card, resolved: action.choice } : card
      );

      if (action.choice === "emoji") {
        scheduleTimeout(() => {
          appendCard("Here's one — what do you think?", makeEmojiGuessCard(), "Neutral");
        }, 500);
      } else {
        const prompt = wyrPrompts[Math.floor(Math.random() * wyrPrompts.length)];
        scheduleTimeout(() => {
          appendCard("Okay — pick one:", { kind: "wyr", prompt }, "Neutral");
        }, 500);
      }
      return;
    }

    if (action.kind === "exercise-pick") {
      updateCardInMessage(messageId, (card) =>
        card.kind === "exercise-pick" ? { ...card, resolved: action.choice } : card
      );

      if (action.choice === "breathing") {
        scheduleTimeout(() => {
          onOpenBreathing();
        }, 300);
      } else {
        scheduleTimeout(() => {
          appendAssistantText(
            "Let's do 5-4-3-2-1 grounding. Slowly, in your own time: name 5 things you can see, 4 things you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. Type as you go — I'll wait.",
            "Neutral"
          );
          focusComposer();
        }, 500);
      }
      return;
    }

    if (action.kind === "emoji-guess") {
      updateCardInMessage(messageId, (card) =>
        card.kind === "emoji-guess"
          ? { ...card, userIndex: action.index }
          : card
      );
      return;
    }

    if (action.kind === "wyr") {
      updateCardInMessage(messageId, (card) =>
        card.kind === "wyr" ? { ...card, userPick: action.choice } : card
      );
      scheduleTimeout(() => {
        appendAssistantText(
          action.choice === "a"
            ? "Bold pick — I'd probably go there too 🙂"
            : "Yeah, that one's fun. Nice choice.",
          "Happy"
        );
      }, 600);
      return;
    }
  }

  function handleAlertSelection(action: AlertAction) {
    setIsAlertOpen(false);

    if (action === "continue") {
      updateConversationMessages(selectedConversationId, (currentMessages) => [
        ...currentMessages,
        buildMessage(
          "assistant",
          "We can keep talking here. If the situation feels more urgent, please reach out to a nearby person or local emergency support right away.",
          "Critical"
        ),
      ]);
      focusComposer();
      return;
    }

    startContactFlow(action);
  }

  function handleContactSubmit() {
    if (composerMode !== "contact-choice" || !contactFlowType || !selectedContact) {
      return;
    }

    if (selectedContact === "None") {
      updateConversationMessages(selectedConversationId, (currentMessages) => [
        ...currentMessages,
        buildMessage("assistant", "Okay.", "Neutral"),
      ]);
      resetContactFlow(true);
      return;
    }

    const chosenContact = selectedContact;
    const targetConversationId = selectedConversationId;

    setComposerMode("contacting");
    contactTimeoutRef.current = scheduleTimeout(() => {
      updateConversationMessages(targetConversationId, (currentMessages) => [
        ...currentMessages,
        buildMessage("assistant", `I have contacted ${chosenContact}.`, "Neutral"),
      ]);
      contactTimeoutRef.current = null;
      resetContactFlow(true);
    }, 1800);
  }

  const activeContactChoices = contactFlowType ? contactOptions[contactFlowType] : [];
  const contactingLabel =
    contactFlowType && selectedContact && selectedContact !== "None"
      ? `Contacting ${selectedContact}...`
      : "Contacting support...";
  const isFreshChat =
    messages.length === 1 &&
    messages[0]?.role === "assistant" &&
    messages[0]?.text === welcomeText &&
    !isTyping &&
    composerMode === "text";
  const conversationRail = (
    <>
      <div className="flex items-center gap-3 px-1">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          </svg>
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
            Past Conversation
          </p>
          <p className="mt-1 text-sm text-quiet">
            Demo chats ready to open
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleNewChat}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-[20px] bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-text"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        New chat
      </button>

      <div className="mt-4 flex-1 overflow-y-auto pr-1">
        <div className="space-y-3">
          {conversations.map((conversation) => {
            const isActive = conversation.id === selectedConversationId;

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => handleConversationSelect(conversation.id)}
                aria-current={isActive ? "page" : undefined}
                className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                  isActive
                    ? "border-primary/25 bg-primary/10 shadow-[0_12px_28px_rgba(79,124,172,0.14)]"
                    : "border-primary/10 bg-white/78 hover:border-primary/20 hover:bg-white dark:border-white/8 dark:bg-white/5 dark:hover:bg-white/8"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-body">
                    {conversation.title}
                  </p>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-quiet">
                    {conversation.stamp}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-quiet">
                  {conversation.preview}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <section
      className={`flex min-h-[calc(100dvh-8rem)] flex-1 flex-col ${
        isConversationRailOpen
          ? "lg:grid lg:min-h-[calc(100vh-3.5rem)] lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-5"
          : "lg:min-h-[calc(100vh-3.5rem)]"
      }`}
    >
      {isConversationRailOpen ? (
        <>
          <button
            type="button"
            aria-label="Close past conversations"
            onClick={() => setIsConversationRailOpen(false)}
            className="fixed inset-0 z-30 bg-text/22 backdrop-blur-[2px] lg:hidden"
          />
          <aside
            id="past-conversation-rail"
            className="fixed inset-x-4 top-24 bottom-6 z-40 flex flex-col overflow-hidden rounded-[28px] border border-primary/10 bg-white/90 p-4 shadow-[0_24px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-panel-dark/82 dark:shadow-[0_24px_50px_rgba(0,0,0,0.45)] lg:sticky lg:inset-auto lg:top-6 lg:bottom-auto lg:z-auto lg:h-[calc(100vh-3rem)] lg:border lg:border-primary/10 lg:bg-white/82 lg:shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:lg:border-white/10 dark:lg:bg-panel-dark/76 dark:lg:shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
          >
            {conversationRail}
          </aside>
        </>
      ) : null}

      <div
        className={`flex min-h-full flex-1 flex-col transition-[filter] duration-300 ${isAlertOpen ? "pointer-events-none select-none blur-[2px]" : ""}`}
      >
        <div className="sticky top-4 z-20 px-1 pb-3 pt-1 lg:top-0 lg:pb-3 lg:pt-0">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 rounded-[24px] border border-white/65 bg-white/78 px-3 py-2 shadow-[0_16px_36px_rgba(15,23,42,0.1)] backdrop-blur-xl dark:border-white/10 dark:bg-panel-dark/74 dark:shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
            <div className="flex min-w-0 items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsConversationRailOpen((current) => !current)}
                aria-expanded={isConversationRailOpen}
                aria-controls="past-conversation-rail"
                aria-label="Open past conversations"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition hover:bg-primary/16"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                </svg>
              </button>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold tracking-tight text-body sm:text-xl">
                  Past Conversation
                </p>
                <p className="truncate text-xs text-quiet">
                  {activeConversation?.title ?? "Demo chat"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSendTipNotification}
                title="Send a demo notification in 5 seconds"
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white px-3 py-1.5 text-xs font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5 dark:bg-panel-dark"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                Tip
              </button>
              <button
                type="button"
                onClick={onSosClick}
                className="inline-flex items-center gap-1.5 rounded-full bg-critical px-3 py-1.5 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(185,28,28,0.35)] transition hover:brightness-110"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3 2 21h20Z" />
                  <path d="M12 10v4" />
                  <path d="M12 18h.01" />
                </svg>
                SOS
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 px-1">
          <div
            className={`mx-auto flex w-full max-w-3xl flex-col gap-4 pt-1 ${
              isFreshChat
                ? "min-h-full justify-center pb-14 sm:pb-16"
                : "pb-24 sm:pb-28"
            }`}
          >
            {isFreshChat ? (
              <div className="flex flex-col items-center gap-6 text-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
                    Zhideyling AI
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-body sm:text-3xl">
                    Hello Talop, how are you?
                  </h2>
                  <p className="mt-2 text-sm text-quiet">
                    Tap a prompt to start, or type anything you want to share.
                  </p>
                </div>
                <div className="grid w-full max-w-xl gap-3 sm:grid-cols-2">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt.label}
                      type="button"
                      onClick={() => sendMessage(prompt.text)}
                      className="rounded-[22px] border border-primary/15 bg-white/80 px-4 py-3 text-left text-sm font-medium text-body shadow-[0_8px_20px_rgba(15,23,42,0.05)] transition hover:border-primary/35 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
                <div ref={conversationEndRef} />
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <Fragment key={message.id}>
                    <Message message={message} />
                    {message.card ? (
                      <div className="flex w-full justify-start">
                        <ChatCard
                          messageId={message.id}
                          card={message.card}
                          onAction={handleCardAction}
                        />
                      </div>
                    ) : null}
                  </Fragment>
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={conversationEndRef} />
              </>
            )}
          </div>
        </div>

        <div
          ref={composerShellRef}
          className="sticky bottom-0 z-20 mt-auto border-t border-primary/10 bg-white/92 px-0 pb-1 pt-2 backdrop-blur-sm dark:border-white/5 dark:bg-panel-dark/82"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
            <InputBox
              ref={inputRef}
              mood={currentMood}
              value={input}
              onChange={setInput}
              onSubmit={
                composerMode === "text"
                  ? () => sendMessage(input)
                  : () => handleContactSubmit()
              }
              disabled={isTyping || composerMode === "contacting"}
              mode={composerMode}
              choices={activeContactChoices}
              selectedChoice={selectedContact}
              onChoiceSelect={setSelectedContact}
              contactingLabel={contactingLabel}
              onCameraClick={handleCameraOpen}
            />
            <p className="hidden px-2 text-center text-xs text-quiet sm:block">
              Zhideyling AI can make mistakes. If a situation feels urgent, use
              SOS or reach out to local support now.
            </p>
          </div>
        </div>
      </div>

      <AlertModal
        open={isAlertOpen}
        onSelect={handleAlertSelection}
        onClose={() => setIsAlertOpen(false)}
      />

      <CameraView
        open={isCameraOpen}
        imageSrc={CAMERA_IMAGE_SRC}
        messages={messages}
        isTyping={isTyping}
        scanning={isCameraScanning}
        mood={currentMood}
        onClose={() => {
          setIsCameraOpen(false);
          setIsCameraScanning(false);
        }}
        onSend={(text) => sendMessage(text)}
      />
    </section>
  );
}
