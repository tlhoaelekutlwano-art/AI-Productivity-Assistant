import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  CalendarCheck,
  LayoutDashboard,
  Mail,
  Menu,
  NotebookPen,
  Search,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, tint: "bg-lilac text-lilac-foreground" },
  { to: "/email", label: "Email Generator", icon: Mail, tint: "bg-sky text-sky-foreground" },
  { to: "/notes", label: "Meeting Notes", icon: NotebookPen, tint: "bg-mint text-mint-foreground" },
  { to: "/planner", label: "Task Planner", icon: CalendarCheck, tint: "bg-butter text-butter-foreground" },
  { to: "/research", label: "Research", icon: Search, tint: "bg-blush text-blush-foreground" },
  { to: "/chat", label: "Assistant Chat", icon: Bot, tint: "bg-lilac text-lilac-foreground" },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <span className={cn("flex size-8 items-center justify-center rounded-xl", item.tint)}>
              <Icon className="size-4" />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-1 py-1">
      <span className="flex size-10 items-center justify-center rounded-2xl bg-pastel">
        <Sparkles className="size-5 text-primary" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-base font-semibold">Kutlwano</span>
        <span className="block text-xs text-muted-foreground">Creative work assistant</span>
      </span>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col justify-between border-r border-sidebar-border bg-sidebar p-5 lg:flex">
        <div className="flex flex-col gap-8">
          <Brand />
          <NavLinks />
        </div>
        <p className="rounded-2xl bg-muted/70 p-3 text-xs leading-relaxed text-muted-foreground">
          AI-generated content may require human review.
        </p>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl lg:hidden">
                  <Menu className="size-5" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar p-5">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex flex-col gap-8">
                  <Brand />
                  <NavLinks onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">{description}</p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-5 pb-16 pt-6">{children}</main>
      </div>
    </div>
  );
}
