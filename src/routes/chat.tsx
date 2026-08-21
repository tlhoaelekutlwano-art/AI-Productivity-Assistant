import { createFileRoute } from "@tanstack/react-router";
import { Bot, Loader2, SendHorizonal, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Disclaimer } from "@/components/ai-output";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAI } from "@/hooks/use-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Assistant Chat — Kutlwano" },
      {
        name: "description",
        content: "Chat with an AI work assistant for quick answers, rewrites and next steps.",
      },
      { property: "og:title", content: "Assistant Chat — Kutlwano" },
      {
        property: "og:description",
        content: "Chat with an AI work assistant for quick answers, rewrites and next steps.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Rewrite this line so it sounds warmer",
  "How do I chase an overdue client invoice politely?",
  "Give me three campaign concepts for a coffee brand",
];

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Kutlwano. Ask me to rewrite something, unblock a task, or think through a creative problem.",
    },
  ]);
  const [input, setInput] = useState("");
  const { loading, generate } = useAI("chat");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const history = messages.slice(1);
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setInput("");
    const reply = await generate(trimmed, undefined, history);
    if (reply) setMessages((m) => [...m, { role: "assistant", content: reply }]);
  }

  return (
    <AppShell title="Assistant Chat" description="A quick back-and-forth for everything else.">
      <div className="space-y-4">
        <Card className="rounded-3xl border-border/70 shadow-soft">
          <CardContent className="flex h-[26rem] flex-col gap-4 overflow-y-auto py-6 sm:h-[32rem]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "flex-row")}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-xl",
                    m.role === "user" ? "bg-blush text-blush-foreground" : "bg-lilac text-lilac-foreground",
                  )}
                >
                  {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                </span>
                <div
                  className={cn(
                    "max-w-[80%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-relaxed",
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading ? (
              <div className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-lilac text-lilac-foreground">
                  <Bot className="size-4" />
                </span>
                <div className="flex items-center gap-1.5 rounded-3xl bg-muted px-4 py-4">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="size-2 animate-bounce rounded-full bg-muted-foreground/60"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              </div>
            ) : null}
            <div ref={endRef} />
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => void send(s)}
              className="rounded-2xl bg-muted px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <Input
            className="rounded-2xl"
            placeholder="Ask Kutlwano anything…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" className="rounded-2xl" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <SendHorizonal className="size-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>

        <Disclaimer />
      </div>
    </AppShell>
  );
}
