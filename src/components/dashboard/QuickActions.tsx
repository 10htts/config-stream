import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Database,
  Plus,
  Bot,
  Table,
  Users,
  Zap,
  ExternalLink,
  Settings,
} from "lucide-react";

const quickActions = [
  {
    title: "New Connection",
    description: "Connect to a database",
    icon: Database,
    variant: "outline" as const,
    action: "connection",
  },
  {
    title: "Create Form",
    description: "Build a new form",
    icon: Plus,
    variant: "outline" as const,
    action: "form",
  },
  {
    title: "AI Assistant",
    description: "Generate configs with AI",
    icon: Bot,
    variant: "default" as const,
    action: "ai",
  },
  {
    title: "Manage Tables",
    description: "View and edit tables",
    icon: Table,
    variant: "outline" as const,
    action: "tables",
  },
  {
    title: "User Management",
    description: "Add users and roles",
    icon: Users,
    variant: "outline" as const,
    action: "users",
  },
  {
    title: "System Settings",
    description: "Configure system",
    icon: Settings,
    variant: "outline" as const,
    action: "settings",
  },
];

const recentlyUsed = [
  {
    name: "Customer Orders",
    type: "Table",
    lastAccessed: "5 minutes ago",
    icon: Table,
  },
  {
    name: "User Registration Form",
    type: "Form",
    lastAccessed: "15 minutes ago",
    icon: Plus,
  },
  {
    name: "Analytics Connection",
    type: "Connection",
    lastAccessed: "1 hour ago",
    icon: Database,
  },
];

export function QuickActions() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Zap className="h-5 w-5 mr-2 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.action}
                  variant={action.variant}
                  className={`h-auto p-4 flex-col items-start text-left space-y-2 ${
                    action.variant === "default" 
                      ? "bg-gradient-primary hover:opacity-90" 
                      : "hover:bg-accent/50"
                  }`}
                >
                  <div className="flex items-center space-x-2 w-full">
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium text-sm truncate">{action.title}</span>
                  </div>
                  <p className="text-xs opacity-80 text-left w-full">
                    {action.description}
                  </p>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recently Used */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Recently Used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentlyUsed.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-elevated transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.type} • {item.lastAccessed}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}