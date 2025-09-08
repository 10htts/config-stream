import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Database,
  Table,
  User,
  Settings,
  Bot,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface Activity {
  id: string;
  type: "connection" | "table" | "user" | "config" | "ai" | "error" | "success";
  title: string;
  description: string;
  user: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "ai",
    title: "AI Assistant Generated Form Config",
    description: "Automatically configured 'User Profile' form with 12 fields and validation rules",
    user: "AI Assistant",
    timestamp: "2 minutes ago",
    metadata: { table: "users", fields: 12 },
  },
  {
    id: "2",
    type: "connection",
    title: "New Database Connection",
    description: "Connected to PostgreSQL production database 'analytics-db'",
    user: "John Smith",
    timestamp: "15 minutes ago",
    metadata: { connection: "analytics-db", type: "postgresql" },
  },
  {
    id: "3",
    type: "table",
    title: "Table Permissions Updated",
    description: "Modified read/write permissions for 'orders' table",
    user: "Sarah Johnson",
    timestamp: "1 hour ago",
    metadata: { table: "orders", action: "permissions" },
  },
  {
    id: "4",
    type: "success",
    title: "Data Sync Completed",
    description: "Successfully synced 1,247 records from staging to production",
    user: "System",
    timestamp: "2 hours ago",
    metadata: { records: 1247 },
  },
  {
    id: "5",
    type: "user",
    title: "New User Created",
    description: "Added new admin user 'mike.wilson@company.com'",
    user: "Admin",
    timestamp: "3 hours ago",
    metadata: { role: "admin" },
  },
  {
    id: "6",
    type: "error",
    title: "Connection Error",
    description: "Failed to connect to 'legacy-db' - authentication timeout",
    user: "System",
    timestamp: "4 hours ago",
    metadata: { connection: "legacy-db", error: "timeout" },
  },
];

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "connection":
      return <Database className="h-4 w-4" />;
    case "table":
      return <Table className="h-4 w-4" />;
    case "user":
      return <User className="h-4 w-4" />;
    case "config":
      return <Settings className="h-4 w-4" />;
    case "ai":
      return <Bot className="h-4 w-4" />;
    case "error":
      return <AlertTriangle className="h-4 w-4" />;
    case "success":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getActivityColor = (type: Activity["type"]) => {
  switch (type) {
    case "ai":
      return "bg-primary/10 text-primary";
    case "connection":
      return "bg-blue-500/10 text-blue-600";
    case "table":
      return "bg-purple-500/10 text-purple-600";
    case "user":
      return "bg-green-500/10 text-green-600";
    case "config":
      return "bg-orange-500/10 text-orange-600";
    case "error":
      return "bg-destructive/10 text-destructive";
    case "success":
      return "bg-success/10 text-success";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getBadgeVariant = (type: Activity["type"]) => {
  switch (type) {
    case "ai":
      return "default";
    case "error":
      return "destructive";
    case "success":
      return "default";
    default:
      return "secondary";
  }
};

export function ActivityFeed() {
  return (
    <Card className="bg-gradient-card border-0 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-surface hover:bg-surface-elevated transition-colors">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getBadgeVariant(activity.type)} className="text-xs">
                        {activity.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {activity.user === "AI Assistant" ? "AI" : 
                           activity.user === "System" ? "SY" :
                           activity.user.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{activity.user}</span>
                    </div>
                    {activity.metadata && (
                      <div className="flex space-x-2">
                        {Object.entries(activity.metadata).slice(0, 2).map(([key, value]) => (
                          <span key={key} className="text-xs bg-muted px-2 py-1 rounded">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}