import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { generateAI } from "@/lib/ai.functions";

type Feature = "email" | "notes" | "planner" | "research" | "chat";

export function useAI(feature: Feature) {
  const run = useServerFn(generateAI);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function generate(
    input: string,
    options?: Record<string, string>,
    history?: { role: "user" | "assistant"; content: string }[],
  ) {
    if (!input.trim()) {
      toast.error("Add some details first.");
      return null;
    }
    setLoading(true);
    try {
      const res = await run({ data: { feature, input, options, history } });
      setResult(res.text);
      return res.text;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { loading, result, setResult, generate };
}
