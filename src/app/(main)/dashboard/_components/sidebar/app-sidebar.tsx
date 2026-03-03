"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();

  const items = [
    { label: "Slide 1 - Overview", href: "/dashboard/slide-1" },
    { label: "Slide 2 - Weighted CV", href: "/dashboard/slide-2" },
    { label: "Slide 3", href: "/dashboard/slide-3" },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between gap-2">
        <div className="text-sm font-bold">Dashboard</div>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Slides</SidebarGroupLabel>

          <SidebarMenu>
            {items.map((it) => (
              <SidebarMenuItem key={it.href}>
                <SidebarMenuButton asChild data-active={pathname === it.href}>
                  <Link href={it.href}>{it.label}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="text-xs text-muted-foreground">Navigation</div>
      </SidebarFooter>
    </Sidebar>
  );
}
