import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";

import { OutputPanel } from "@/components/ai-output";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/hooks/use-ai";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Kutlwano" },
      {
        name: "description",
        content: "Generate polished work emails tuned to the tone, audience and length you need.",
      },
      { property: "og:title", content: "Smart Email Generator — Kutlwano" },
      {
        property: "og:description",
        content: "Generate polished work emails tuned to tone, audience and length.",
      },
    ],
  }),
  component: EmailPage,
});

const tones = ["Professional", "Friendly", "Direct", "Persuasive", "Apologetic", "Enthusiastic"];
const audiences = ["Client", "Manager", "Teammate", "Freelancer", "Vendor", "New prospect"];
const lengths = ["Short", "Medium", "Detailed"];

function EmailPage() {
  const [brief, setBrief] = useState("");
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("Client");
  const [length, setLength] = useState("Medium");
  const { loading, result, generate } = useAI("email");

  return (
    <AppShell
      title="Smart Email Generator"
      description="Describe the message — pick the tone and audience, get a send-ready draft."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-border/70 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="brief">What do you need to say?</Label>
              <Textarea
                id="brief"
                rows={7}
                className="rounded-2xl"
                placeholder="e.g. Tell the client the campaign shoot moves to 14 May, apologise for the shift and confirm the revised delivery date."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Tone", value: tone, set: setTone, options: tones },
                { label: "Audience", value: audience, set: setAudience, options: audiences },
                { label: "Length", value: length, set: setLength, options: lengths },
              ].map((field) => (
                <div key={field.label} className="space-y-2">
                  <Label>{field.label}</Label>
                  <Select value={field.value} onValueChange={field.set}>
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <Button
              className="w-full rounded-2xl"
              disabled={loading}
              onClick={() => void generate(brief, { tone, audience, length })}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              {loading ? "Drafting…" : "Generate email"}
            </Button>
          </CardContent>
        </Card>

        <OutputPanel
          title="Draft"
          loading={loading}
          result={result}
          emptyHint="Your generated email will appear here, complete with subject line and sign-off."
        />
      </div>
    </AppShell>
  );
}
