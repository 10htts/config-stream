import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ConnectionsTable } from "@/components/dashboard/ConnectionsTable";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Table,
  Users,
  Bot,
  TrendingUp,
  Activity,
  Bell,
  Search,
} from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-surface-elevated px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Overview of your FormBuilder system
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Badge variant="default" className="bg-gradient-primary">
                4 Active
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 space-y-6 bg-gradient-surface">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Database Connections"
              value={4}
              description="Active connections"
              icon={Database}
              trend={{ value: 12, label: "vs last month", positive: true }}
            />
            <StatsCard
              title="Tables Managed"
              value={24}
              description="Across all databases"
              icon={Table}
              trend={{ value: 8, label: "new this week", positive: true }}
            />
            <StatsCard
              title="Active Users"
              value={127}
              description="System users"
              icon={Users}
              trend={{ value: 5, label: "vs last week", positive: true }}
            />
            <StatsCard
              title="AI Generations"
              value={89}
              description="Forms auto-generated"
              icon={Bot}
              trend={{ value: 23, label: "this month", positive: true }}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Wider */}
            <div className="lg:col-span-2 space-y-6">
              <ConnectionsTable />
              
              {/* Performance Overview */}
              <Card className="bg-gradient-card border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-surface">
                      <div className="text-2xl font-bold text-primary">99.9%</div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-surface">
                      <div className="text-2xl font-bold text-success">145ms</div>
                      <div className="text-sm text-muted-foreground">Avg Response</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-surface">
                      <div className="text-2xl font-bold text-warning">2.3k</div>
                      <div className="text-sm text-muted-foreground">Requests/min</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-surface">
                      <div className="text-2xl font-bold text-destructive">3</div>
                      <div className="text-sm text-muted-foreground">Errors Today</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <QuickActions />
              <ActivityFeed />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
