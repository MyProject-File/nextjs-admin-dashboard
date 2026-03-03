"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type SidebarContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  const value = React.useMemo(
    () => ({
      open,
      setOpen,
      toggle: () => setOpen((v) => !v),
    }),
    [open]
  );

  return (
    <SidebarContext.Provider value={value}>
      <div className="flex min-h-screen w-full bg-background">{children}</div>
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside <SidebarProvider />");
  return ctx;
}

export function SidebarInset({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <main className={cn("flex-1 min-w-0 p-4", className)}>{children}</main>
  );
}

export function Sidebar({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useSidebar();

  return (
    <aside
      className={cn(
        "border-r bg-white",
        open ? "w-64" : "w-16",
        "transition-all duration-200",
        className
      )}
    >
      <div className="h-full flex flex-col">{children}</div>
    </aside>
  );
}

export function SidebarHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("p-3 border-b", className)}>{children}</div>;
}

export function SidebarContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("flex-1 p-2", className)}>{children}</div>;
}

export function SidebarFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("p-3 border-t", className)}>{children}</div>;
}

export function SidebarGroup({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <section className={cn("mb-3", className)}>{children}</section>;
}

export function SidebarGroupLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useSidebar();
  if (!open) return null;

  return (
    <div className={cn("px-2 py-2 text-xs font-semibold text-muted-foreground", className)}>
      {children}
    </div>
  );
}

export function SidebarMenu({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <ul className={cn("space-y-1", className)}>{children}</ul>;
}

export function SidebarMenuItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <li className={cn("", className)}>{children}</li>;
}

export function SidebarMenuButton({
  asChild,
  className,
  children,
  "data-active": dataActive,
}: {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
  "data-active"?: boolean;
}) {
  const Comp: any = asChild ? Slot : "button";
  const { open } = useSidebar();

  return (
    <Comp
      className={cn(
        "w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted transition",
        dataActive ? "bg-muted font-semibold" : "",
        !open ? "justify-center px-0" : "",
        className
      )}
    >
      {children}
    </Comp>
  );
}

export function SidebarTrigger({
  className,
}: {
  className?: string;
}) {
  const { toggle } = useSidebar();
  return (
    <button
      onClick={toggle}
      className={cn(
        "rounded-md border px-2 py-1 text-xs hover:bg-muted",
        className
      )}
      type="button"
    >
      Toggle
    </button>
  );
}