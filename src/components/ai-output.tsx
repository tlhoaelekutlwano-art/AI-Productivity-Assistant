import { Check, Copy, Info, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function Disclaimer() {
  return (
    <p className="flex items-start gap-2 rounded-2xl bg-muted/70 px-4 py-3 text-xs text-muted-foreground">
      <Info className="mt-0.5 size-3.5 shrink-0" />
      AI-generated content may require human review.
    </p>
  );
}

/** Lightweight markdown renderer: headings, bullets, tables, bold. */
function renderMarkdown(md: string): ReactNode[] {
  const lines = md.split("\n");
  const out: ReactNode[] = [];
  let list: string[] = [];
  let table: string[][] = [];

  const inline = (text: string) =>
    text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      ),
    );

  const flushList = () => {
    if (!list.length) return;
    out.push(
      <ul key={`ul-${out.length}`} className="ml-1 space-y-1.5">
        {list.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>{inline(item)}</span>
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  const flushTable = () => {
    if (!table.length) return;
    const [head, ...body] = table;
    out.push(
      <div key={`t-${out.length}`} className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/70">
            <tr>
              {(head ?? []).map((c, i) => (
                <th key={i} className="px-3 py-2 font-medium">
                  {inline(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, r) => (
              <tr key={r} className="border-t border-border">
                {row.map((c, i) => (
                  <td key={i} className="px-3 py-2 align-top">
                    {inline(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
    table = [];
  };

  const flushAll = () => {
    flushList();
    flushTable();
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^\|(.+)\|$/.test(line.trim())) {
      flushList();
      const cells = line
        .trim()
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());
      if (cells.every((c) => /^-{2,}:?$/.test(c) || /^:?-{2,}:?$/.test(c))) continue;
      table.push(cells);
      continue;
    }
    flushTable();

    if (!line.trim()) {
      flushList();
      continue;
    }
    if (/^#{1,6}\s/.test(line)) {
      flushAll();
      const text = line.replace(/^#{1,6}\s/, "");
      out.push(
        <h3 key={`h-${out.length}`} className="pt-2 text-base font-semibold">
          {inline(text)}
        </h3>,
      );
      continue;
    }
    if (/^\s*([-*•]|\d+\.)\s+/.test(line)) {
      list.push(line.replace(/^\s*([-*•]|\d+\.)\s+/, ""));
      continue;
    }
    flushList();
    out.push(
      <p key={`p-${out.length}`} className="text-sm leading-relaxed text-foreground/90">
        {inline(line)}
      </p>,
    );
  }
  flushAll();
  return out;
}

export function OutputPanel({
  title,
  loading,
  result,
  emptyHint,
}: {
  title: string;
  loading: boolean;
  result: string;
  emptyHint: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Card className="rounded-3xl border-border/70 shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        {result && !loading ? (
          <Button
            variant="secondary"
            size="sm"
            className="rounded-xl"
            onClick={() => {
              void navigator.clipboard.writeText(result);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3" aria-live="polite">
            <Skeleton className="h-5 w-2/5 rounded-xl" />
            <Skeleton className="h-4 w-full rounded-xl" />
            <Skeleton className="h-4 w-11/12 rounded-xl" />
            <Skeleton className="h-4 w-3/4 rounded-xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <p className="text-xs text-muted-foreground">Composing your draft…</p>
          </div>
        ) : result ? (
          <div className="space-y-3">{renderMarkdown(result)}</div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-muted/50 px-6 py-12 text-center">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-pastel">
              <Sparkles className="size-5 text-primary" />
            </span>
            <p className="max-w-sm text-sm text-muted-foreground">{emptyHint}</p>
          </div>
        )}
        <Disclaimer />
      </CardContent>
    </Card>
  );
}
