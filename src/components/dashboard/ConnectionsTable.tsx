import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, ExternalLink, Settings, AlertCircle } from "lucide-react";

interface Connection {
  id: string;
  name: string;
  type: "postgresql" | "mysql" | "sqlite" | "mssql";
  status: "connected" | "disconnected" | "error";
  lastSync: string;
  tables: number;
  environment: "production" | "staging" | "development";
}

const connections: Connection[] = [
  {
    id: "1",
    name: "Production DB",
    type: "postgresql",
    status: "connected",
    lastSync: "2 minutes ago",
    tables: 24,
    environment: "production",
  },
  {
    id: "2",
    name: "Analytics DB",
    type: "mysql",
    status: "connected",
    lastSync: "5 minutes ago",
    tables: 8,
    environment: "production",
  },
  {
    id: "3",
    name: "Staging DB",
    type: "postgresql",
    status: "connected",
    lastSync: "1 hour ago",
    tables: 18,
    environment: "staging",
  },
  {
    id: "4",
    name: "Local Development",
    type: "sqlite",
    status: "disconnected",
    lastSync: "3 days ago",
    tables: 12,
    environment: "development",
  },
];

const getStatusColor = (status: Connection["status"]) => {
  switch (status) {
    case "connected":
      return "bg-success text-success-foreground";
    case "disconnected":
      return "bg-muted text-muted-foreground";
    case "error":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getEnvironmentColor = (environment: Connection["environment"]) => {
  switch (environment) {
    case "production":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "staging":
      return "bg-warning/10 text-warning border-warning/20";
    case "development":
      return "bg-success/10 text-success border-success/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getTypeIcon = (type: Connection["type"]) => {
  return <Database className="h-4 w-4" />;
};

export function ConnectionsTable() {
  return (
    <Card className="bg-gradient-card border-0 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Database Connections</CardTitle>
          <Button size="sm" className="bg-gradient-primary hover:opacity-90">
            <Database className="h-4 w-4 mr-2" />
            Add Connection
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-table-border bg-form-background">
          <Table>
            <TableHeader>
              <TableRow className="bg-table-header hover:bg-table-header">
                <TableHead className="w-[200px]">Connection</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Tables</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connections.map((connection) => (
                <TableRow key={connection.id} className="hover:bg-table-row-hover">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        {getTypeIcon(connection.type)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{connection.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {connection.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {connection.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(connection.status)}>
                        {connection.status}
                      </Badge>
                      {connection.status === "error" && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getEnvironmentColor(connection.environment)}>
                      {connection.environment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{connection.tables}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{connection.lastSync}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}