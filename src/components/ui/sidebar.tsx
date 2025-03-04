
import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type SidebarContextType = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function Sidebar({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { collapsed } = useSidebar();

  return (
    <div
      className={cn(
        "border-r border-border transition-all duration-300 ease-in-out",
        collapsed ? "w-[75px]" : "w-64",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarTrigger({
  className,
}: {
  className?: string;
}) {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <button
      onClick={() => setCollapsed(!collapsed)}
      className={cn(
        "h-9 w-9 rounded-md border border-border bg-background hover:bg-accent",
        className
      )}
    >
      {collapsed ? "→" : "←"}
    </button>
  );
}

export function SidebarHeader({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-14 items-center border-b border-border px-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("p-3", className)}>
      {children}
    </div>
  );
}

export function SidebarFooter({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mt-auto flex h-14 items-center border-t border-border px-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarGroup({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("mb-4 last:mb-0", className)}>
      {children}
    </div>
  );
}

export function SidebarGroupLabel({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { collapsed } = useSidebar();

  if (collapsed) {
    return null;
  }

  return (
    <div className={cn("mb-1 text-xs font-medium text-muted-foreground", className)}>
      {children}
    </div>
  );
}

export function SidebarGroupContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("", className)}>
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
  return (
    <div className={cn("space-y-1", className)}>
      {children}
    </div>
  );
}

export function SidebarMenuItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
}

export function SidebarMenuButton({
  className,
  children,
  asChild = false,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>) {
  const { collapsed } = useSidebar();
  const Comp = asChild ? React.Fragment : "button";

  return (
    <Comp
      className={cn(
        "flex w-full items-center rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        collapsed && "justify-center px-2",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
