import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Table,
  Plus,
  Settings,
  Users,
  Shield,
  BarChart3,
  Workflow,
  Bot,
  ChevronLeft,
  ChevronRight,
  Home,
  Layers,
  Zap,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: "Dashboard",
    icon: Home,
    href: "/",
    current: true,
  },
  {
    name: "Connections",
    icon: Database,
    href: "/connections",
    current: false,
    badge: "4",
  },
  {
    name: "Tables",
    icon: Table,
    href: "/tables",
    current: true,
    badge: "12",
  },
  {
    name: "Forms",
    icon: Layers,
    href: "/forms",
    current: false,
  },
  {
    name: "Workflows",
    icon: Workflow,
    href: "/workflows",
    current: false,
  },
  {
    name: "AI Assistant",
    icon: Bot,
    href: "/assist",
    current: false,
    badge: "New",
  },
];

const adminNavigation = [
  {
    name: "Users & Roles",
    icon: Users,
    href: "/admin/users",
    current: false,
  },
  {
    name: "Permissions",
    icon: Shield,
    href: "/admin/permissions",
    current: false,
  },
  {
    name: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
    current: false,
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/settings",
    current: false,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-sidebar-foreground">FormBuilder</h1>
              <p className="text-xs text-sidebar-foreground/60">Admin Dashboard</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {/* Main Navigation */}
          <div>
            {!collapsed && (
              <h2 className="mb-2 px-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                Main
              </h2>
            )}
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant={item.current ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 text-sm",
                      item.current
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      collapsed && "justify-center px-0"
                    )}
                    onClick={() => window.location.href = item.href}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        {item.badge && (
                          <Badge
                            variant={item.badge === "New" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Quick Actions */}
          {!collapsed && (
            <div>
              <h2 className="mb-2 px-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                Quick Actions
              </h2>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
                >
                  <Plus className="h-3 w-3" />
                  New Connection
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
                >
                  <Plus className="h-3 w-3" />
                  Create Form
                </Button>
              </div>
            </div>
          )}

          {/* Admin Section */}
          <div>
            {!collapsed && (
              <h2 className="mb-2 px-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                Administration
              </h2>
            )}
            <nav className="space-y-1">
              {adminNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      collapsed && "justify-center px-0"
                    )}
                    onClick={() => window.location.href = item.href}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span className="flex-1 text-left">{item.name}</span>}
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">admin@formbuilder.dev</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}