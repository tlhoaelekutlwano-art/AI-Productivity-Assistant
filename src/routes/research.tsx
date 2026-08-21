import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";

import { OutputPanel } from "@/components/ai-output";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/hooks/use-ai";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Aurelia" },
      {
        name: "description",
        content: "Get structured research briefs with insights, opportunities, risks and next steps.",
      },
      { property: "og:title", content: "AI Research Assistant — Aurelia" },
      {
        property: "og:description",
        content: "Structured research briefs with insights, risks and recommended next steps.",
      },
    ],
  }),
  component: ResearchPage,
});

const depths = ["Quick scan", "Balanced brief", "Deep dive"];

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [depth, setDepth] = useState("Balanced brief");
  const { loading, result, generate } = useAI("research");

  return (
    <AppShell
      title="AI Research Assistant"
      description="Insights, opportunities and risks — structured for a creative brief."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-border/70 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Research request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                className="rounded-2xl"
                placeholder="e.g. Gen-Z attitudes to sustainable fashion in South Africa"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Context (optional)</Label>
              <Textarea
                id="context"
                rows={6}
                className="rounded-2xl"
                placeholder="Who's the client, what decision does this inform, what have you already ruled out?"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {depths.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full rounded-2xl"
              disabled={loading}
              onClick={() =>
                void generate(
                  context.trim() ? `Topic: ${topic}\n\nContext: ${context}` : `Topic: ${topic}`,
                  { depth },
                )
              }
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
              {loading ? "Researching…" : "Research topic"}
            </Button>
          </CardContent>
        </Card>

        <OutputPanel
          title="Brief"
          loading={loading}
          result={result}
          emptyHint="You'll get an overview, key insights, opportunities and risks, next steps and caveats."
        />
      </div>
    </AppShell>
  );
}
