import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Loader2 } from "lucide-react";
import { useState } from "react";

import { OutputPanel } from "@/components/ai-output";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/hooks/use-ai";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Aurelia" },
      {
        name: "description",
        content: "Turn a messy task list into a prioritised plan with time blocks and focus levels.",
      },
      { property: "og:title", content: "AI Task Planner — Aurelia" },
      {
        property: "og:description",
        content: "Prioritise tasks by urgency and impact, then get a realistic schedule.",
      },
    ],
  }),
  component: PlannerPage,
});

const horizons = ["Today", "This week", "Next two weeks"];
const capacities = ["Half day (4h)", "Standard workday (8h)", "Light day (2h)", "Deep-work day"];

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("Today");
  const [capacity, setCapacity] = useState("Standard workday (8h)");
  const { loading, result, generate } = useAI("planner");

  return (
    <AppShell
      title="AI Task Planner"
      description="Dump the list — get priorities, effort estimates and a schedule that fits."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-border/70 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Your tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="tasks">One per line, deadlines welcome</Label>
              <Textarea
                id="tasks"
                rows={10}
                className="rounded-2xl"
                placeholder={"Finish brand deck for Nando's pitch (Thu)\nReview intern portfolio\nInvoice studio hours\nStoryboard the launch film"}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Horizon</Label>
                <Select value={horizon} onValueChange={setHorizon}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {horizons.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Select value={capacity} onValueChange={setCapacity}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {capacities.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="w-full rounded-2xl"
              disabled={loading}
              onClick={() => void generate(tasks, { horizon, capacity })}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <ListChecks className="size-4" />}
              {loading ? "Planning…" : "Build my plan"}
            </Button>
          </CardContent>
        </Card>

        <OutputPanel
          title="Plan"
          loading={loading}
          result={result}
          emptyHint="You'll get a priority order, a time-blocked schedule and what to defer or delegate."
        />
      </div>
    </AppShell>
  );
}
