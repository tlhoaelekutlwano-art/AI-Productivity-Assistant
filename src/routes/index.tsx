import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Sparkles, TrendingUp } from "lucide-react";

import { AppShell, navItems } from "@/components/app-shell";
import { Disclaimer } from "@/components/ai-output";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Aurelia AI Workplace Assistant" },
      {
        name: "description",
        content:
          "One calm workspace for AI email drafting, meeting summaries, task planning, research briefs and chat.",
      },
      { property: "og:title", content: "Dashboard — Aurelia AI Workplace Assistant" },
      {
        property: "og:description",
        content: "One calm workspace for AI email drafting, meeting summaries, task planning and research.",
      },
    ],
  }),
  component: Index,
});

const blurbs: Record<string, string> = {
  "/email": "Tone- and audience-aware drafts, ready to send.",
  "/notes": "Turn transcripts into decisions, owners and deadlines.",
  "/planner": "Prioritised task order with a realistic schedule.",
  "/research": "Structured briefs with insights and next steps.",
  "/chat": "Ask anything about your day's work.",
};

const stats = [
  { label: "Tools ready", value: "5", icon: Sparkles, tint: "bg-lilac text-lilac-foreground" },
  { label: "Avg. draft time", value: "12s", icon: Clock, tint: "bg-mint text-mint-foreground" },
  { label: "Prompt templates", value: "Structured", icon: TrendingUp, tint: "bg-butter text-butter-foreground" },
];

function Index() {
  const tools = navItems.filter((i) => i.to !== "/");

  return (
    <AppShell
      title="Good day, let's make it lighter"
      description="Your creative-team assistant for the admin that gets in the way of the work."
    >
      <div className="space-y-8">
        <section className="overflow-hidden rounded-3xl bg-pastel p-7 shadow-soft sm:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/60">
            AI workplace productivity
          </p>
          <h2 className="mt-3 max-w-xl text-2xl font-semibold sm:text-3xl">
            Draft, summarise, plan and research — without breaking your creative flow.
          </h2>
          <Link
            to="/email"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-card px-5 py-2.5 text-sm font-medium shadow-soft transition-transform hover:-translate-y-0.5"
          >
            Start with an email <ArrowRight className="size-4" />
          </Link>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.label} className="rounded-3xl border-border/70 shadow-soft">
              <CardContent className="flex items-center gap-4 py-5">
                <span className={cn("flex size-11 items-center justify-center rounded-2xl", s.tint)}>
                  <s.icon className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-xl font-semibold">{s.value}</span>
                  <span className="block text-xs text-muted-foreground">{s.label}</span>
                </span>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <Link key={tool.to} to={tool.to} className="group">
              <Card className="h-full rounded-3xl border-border/70 shadow-soft transition-transform group-hover:-translate-y-1">
                <CardHeader className="space-y-3">
                  <span className={cn("flex size-11 items-center justify-center rounded-2xl", tool.tint)}>
                    <tool.icon className="size-5" />
                  </span>
                  <CardTitle className="text-base">{tool.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{blurbs[tool.to]}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        <Disclaimer />
      </div>
    </AppShell>
  );
}
