import { useEffect, useRef, useState, FormEvent, ChangeEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sendAssistantMessage, ChatMessage, ChatSuggestion, ChatAttachment } from "../api/assistantApi";
import "../styles/AssistantWidget.css";

interface DisplayMessage extends ChatMessage {
  suggestions?: ChatSuggestion[];
  attachmentName?: string;
}

const HISTORY_LIMIT = 30; // cap what's kept in localStorage per role
const MAX_FILE_BYTES = 3 * 1024 * 1024; // 3MB — matches the backend's validation cap
const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];

function historyKey(role: string | undefined): string {
  return `talabaty_assistant_history_${role || "guest"}`;
}

function loadHistory(role: string | undefined): DisplayMessage[] {
  try {
    const raw = localStorage.getItem(historyKey(role));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(role: string | undefined, messages: DisplayMessage[]) {
  try {
    localStorage.setItem(historyKey(role), JSON.stringify(messages.slice(-HISTORY_LIMIT)));
  } catch {
    // localStorage can fail (private browsing, quota) — losing history
    // persistence isn't worth surfacing an error over.
  }
}

function greetingFor(role: string | undefined): string {
  if (role === "partner") {
    return "Hello — I'm here to help with your store. Ask me about recent orders, your listings, or how Talabaty works for partners. You can also attach a photo of your menu or price list and I'll read it for you.";
  }
  if (role === "customer") {
    return "Hello — I can help you find a store, check a recent order, or answer questions about how Talabaty works. You can also attach a photo — a prescription or product, for example.";
  }
  return "Hello, and welcome to Talabaty. I can help you find a restaurant, supermarket, or pharmacy, or answer any questions about how ordering works here.";
}

function quickStartersFor(role: string | undefined): string[] {
  if (role === "partner") {
    return ["Summarize my recent orders", "How do I improve my listings?", "How does partner approval work?"];
  }
  if (role === "customer") {
    return ["Track my last order", "Recommend a nearby pharmacy", "How does delivery work?"];
  }
  return ["Find restaurants near me", "What payment methods do you accept?", "How do I become a partner?"];
}

// Renders **bold** spans within a single line of text.
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    )
  );
}

// Lightweight markdown renderer for assistant replies: turns "- " / "1. "
// lines into real <ul>/<ol> lists and **bold** into <strong>, without
// pulling in a full markdown library for what is, at most, a short list
// and a bit of emphasis.
function FormattedText({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushList = (key: string) => {
    if (!list) return;
    const items = list.items;
    blocks.push(
      list.type === "ul" ? (
        <ul key={key} className="assistant-list">
          {items.map((item, i) => (
            <li key={i}>{renderInline(item, `${key}-${i}`)}</li>
          ))}
        </ul>
      ) : (
        <ol key={key} className="assistant-list">
          {items.map((item, i) => (
            <li key={i}>{renderInline(item, `${key}-${i}`)}</li>
          ))}
        </ol>
      )
    );
    list = null;
  };

  lines.forEach((line, idx) => {
    const bullet = line.match(/^[-•]\s+(.*)/);
    const numbered = line.match(/^\d+[.)]\s+(.*)/);

    if (bullet) {
      if (!list || list.type !== "ul") {
        flushList(`block-${idx}`);
        list = { type: "ul", items: [] };
      }
      list.items.push(bullet[1]);
    } else if (numbered) {
      if (!list || list.type !== "ol") {
        flushList(`block-${idx}`);
        list = { type: "ol", items: [] };
      }
      list.items.push(numbered[1]);
    } else {
      flushList(`block-${idx}`);
      if (line.trim().length > 0) {
        blocks.push(
          <p key={`p-${idx}`} className="assistant-paragraph">
            {renderInline(line, `p-${idx}`)}
          </p>
        );
      }
    }
  });
  flushList("block-end");

  return <>{blocks}</>;
}

interface PendingAttachment {
  fileName: string;
  mimeType: string;
  base64: string;
}

// SpeechRecognition isn't in TS's default DOM lib typings, and only
// Chrome/Edge/Safari support it (as webkitSpeechRecognition) — Firefox
// doesn't, so the mic button simply doesn't render there.
function getSpeechRecognitionCtor(): (new () => any) | null {
  const w = window as unknown as { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export default function AssistantWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>(() => loadHistory(user?.role));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingAttachment, setPendingAttachment] = useState<PendingAttachment | null>(null);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const speechSupported = typeof window !== "undefined" && !!getSpeechRecognitionCtor();

  // Reload the right conversation if the user's role changes mid-session
  // (e.g. they log in while the widget already has guest history loaded).
  useEffect(() => {
    setMessages(loadHistory(user?.role));
  }, [user?.role]);

  useEffect(() => {
    saveHistory(user?.role, messages);
  }, [messages, user?.role]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, loading, pendingAttachment]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Stop any in-progress recognition if the widget closes or unmounts.
  useEffect(() => {
    if (!open) recognitionRef.current?.stop();
    return () => recognitionRef.current?.stop();
  }, [open]);

  // Admin has its own dedicated dashboard tooling; the assistant is for
  // guests, customers, and partners.
  if (user?.role === "admin") return null;

  const sendMessage = async (text: string, appendUserBubble = true, attachment?: ChatAttachment, attachmentName?: string) => {
    const trimmed = text.trim();
    if ((!trimmed && !attachment) || loading) return;

    const history = messages.map(({ role, content }) => ({ role, content }));
    const outgoingText = trimmed || "Please take a look at this attachment.";

    if (appendUserBubble) {
      setMessages((prev) => [...prev, { role: "user", content: outgoingText, attachmentName }]);
      setInput("");
    }
    setPendingAttachment(null);
    setLoading(true);
    setError(null);

    try {
      const res = await sendAssistantMessage(outgoingText, history, attachment);
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply, suggestions: res.suggestions }]);
    } catch {
      setError("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pendingAttachment) {
      sendMessage(
        input,
        true,
        { mimeType: pendingAttachment.mimeType, data: pendingAttachment.base64 },
        pendingAttachment.fileName
      );
    } else {
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setError(null);
    setPendingAttachment(null);
    saveHistory(user?.role, []);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later

    if (!file) return;
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Please attach a PNG, JPEG, WEBP image, or a PDF.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("That file is too large — please attach something under 3MB.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] || "";
      setPendingAttachment({ fileName: file.name, mimeType: file.type, base64 });
    };
    reader.onerror = () => setError("Couldn't read that file. Please try again.");
    reader.readAsDataURL(file);
  };

  const toggleListening = () => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  return (
    <div className="assistant-widget">
      {open && (
        <div className="assistant-panel shadow-card">
          <div className="assistant-panel-header">
            <span className="d-flex align-items-center gap-2 fw-bold">
              <i className="bi bi-stars" aria-hidden="true" />
              Talabaty Assistant
            </span>
            <div className="d-flex align-items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  className="assistant-close-btn"
                  onClick={handleReset}
                  aria-label="Start a new conversation"
                  title="Start a new conversation"
                >
                  <i className="bi bi-arrow-clockwise" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                className="assistant-close-btn"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="assistant-messages" ref={scrollRef}>
            <div className="assistant-bubble assistant-bubble-bot">
              <FormattedText text={greetingFor(user?.role)} />
            </div>

            {messages.length === 0 && (
              <div className="assistant-quick-starters">
                {quickStartersFor(user?.role).map((starter, i) => (
                  <button key={i} type="button" className="assistant-quick-chip" onClick={() => sendMessage(starter)}>
                    {starter}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`assistant-bubble ${m.role === "user" ? "assistant-bubble-user" : "assistant-bubble-bot"}`}>
                {m.attachmentName && (
                  <div className="assistant-attachment-tag">
                    <i className="bi bi-paperclip" aria-hidden="true" />
                    {m.attachmentName}
                  </div>
                )}
                <FormattedText text={m.content} />
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="assistant-suggestions">
                    {m.suggestions.map((s, j) => (
                      <Link key={j} to={`/store/${s.partnerId}`} className="assistant-suggestion-chip" onClick={() => setOpen(false)}>
                        {s.type === "store" ? <i className="bi bi-shop" aria-hidden="true" /> : <i className="bi bi-bag" aria-hidden="true" />}
                        {s.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="assistant-bubble assistant-bubble-bot assistant-bubble-loading">
                <span className="assistant-dot" />
                <span className="assistant-dot" />
                <span className="assistant-dot" />
              </div>
            )}

            {error && (
              <div className="assistant-error">
                {error}{" "}
                <button
                  type="button"
                  className="assistant-retry-btn"
                  onClick={() => sendMessage(messages[messages.length - 1]?.content || "", false)}
                >
                  Retry
                </button>
              </div>
            )}
          </div>

          {pendingAttachment && (
            <div className="assistant-pending-attachment">
              <i className="bi bi-paperclip" aria-hidden="true" />
              <span className="assistant-pending-name">{pendingAttachment.fileName}</span>
              <button
                type="button"
                className="assistant-pending-remove"
                onClick={() => setPendingAttachment(null)}
                aria-label="Remove attachment"
              >
                <i className="bi bi-x" aria-hidden="true" />
              </button>
            </div>
          )}

          <form className="assistant-input-row" onSubmit={handleSubmit}>
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_FILE_TYPES.join(",")}
              className="d-none"
              onChange={handleFileSelect}
            />
            <button
              type="button"
              className="assistant-icon-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              aria-label="Attach a file"
              title="Attach an image or PDF"
            >
              <i className="bi bi-paperclip" aria-hidden="true" />
            </button>

            {speechSupported && (
              <button
                type="button"
                className={`assistant-icon-btn ${listening ? "assistant-icon-btn-active" : ""}`}
                onClick={toggleListening}
                disabled={loading}
                aria-label={listening ? "Stop voice input" : "Start voice input"}
                title={listening ? "Stop voice input" : "Speak your question"}
              >
                <i className={`bi ${listening ? "bi-mic-fill" : "bi-mic"}`} aria-hidden="true" />
              </button>
            )}

            <input
              ref={inputRef}
              type="text"
              className="form-control"
              placeholder={listening ? "Listening..." : user?.role === "partner" ? "Ask about your store..." : "What are you craving?"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
              disabled={loading}
            />
            <button
              type="submit"
              className="assistant-send-btn"
              disabled={loading || (!input.trim() && !pendingAttachment)}
              aria-label="Send"
            >
              <i className="bi bi-send-fill" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="assistant-fab shadow-card"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
      >
        <i className={`bi ${open ? "bi-x-lg" : "bi-chat-dots-fill"}`} aria-hidden="true" />
      </button>
    </div>
  );
}
