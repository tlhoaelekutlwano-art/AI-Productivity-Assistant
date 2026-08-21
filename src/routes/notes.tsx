import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Wand2 } from "lucide-react";
import { useState } from "react";

import { OutputPanel } from "@/components/ai-output";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/hooks/use-ai";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Kutlwano" },
      {
        name: "description",
        content: "Paste raw notes or a transcript and get key points, decisions, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Kutlwano" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into key points, decisions and action items.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");
  const { loading, result, generate } = useAI("notes");

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Key points, decisions, owners and deadlines — extracted in seconds."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-border/70 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Raw notes or transcript</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="notes">Paste everything — messy is fine</Label>
              <Textarea
                id="notes"
                rows={14}
                className="rounded-2xl"
                placeholder="e.g. Studio sync 10:00 — Thabo: moodboard v3 done, waiting on client sign-off Friday. Lerato to re-cut the hero video by Wed…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button className="w-full rounded-2xl" disabled={loading} onClick={() => void generate(notes)}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              {loading ? "Summarising…" : "Summarise meeting"}
            </Button>
          </CardContent>
        </Card>

        <OutputPanel
          title="Summary"
          loading={loading}
          result={result}
          emptyHint="You'll get a summary, key points, decisions, an action-item table and open questions."
        />
      </div>
    </AppShell>
  );
}
