import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Database,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Settings,
  Filter,
  Calendar,
  Users,
  FileText,
  ShoppingCart,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";

interface TableData {
  id: string;
  name: string;
  connection: string;
  schema: string;
  rows: number;
  columns: number;
  lastModified: string;
  type: "users" | "orders" | "products" | "audit" | "content";
  status: "active" | "archived" | "syncing";
}

const mockTables: TableData[] = [
  {
    id: "1",
    name: "users",
    connection: "Production DB",
    schema: "public",
    rows: 12547,
    columns: 8,
    lastModified: "2 hours ago",
    type: "users",
    status: "active",
  },
  {
    id: "2",
    name: "orders",
    connection: "Production DB",
    schema: "public",
    rows: 45621,
    columns: 12,
    lastModified: "15 minutes ago",
    type: "orders",
    status: "active",
  },
  {
    id: "3",
    name: "products",
    connection: "Production DB",
    schema: "public",
    rows: 2341,
    columns: 15,
    lastModified: "1 hour ago",
    type: "products",
    status: "active",
  },
  {
    id: "4",
    name: "audit_logs",
    connection: "Analytics DB",
    schema: "logging",
    rows: 156789,
    columns: 6,
    lastModified: "5 minutes ago",
    type: "audit",
    status: "syncing",
  },
  {
    id: "5",
    name: "content_pages",
    connection: "Production DB",
    schema: "cms",
    rows: 892,
    columns: 10,
    lastModified: "3 days ago",
    type: "content",
    status: "archived",
  },
  {
    id: "6",
    name: "user_sessions",
    connection: "Production DB",
    schema: "auth",
    rows: 8934,
    columns: 5,
    lastModified: "30 minutes ago",
    type: "users",
    status: "active",
  },
];

const getTypeIcon = (type: TableData["type"]) => {
  switch (type) {
    case "users":
      return <Users className="h-4 w-4" />;
    case "orders":
      return <ShoppingCart className="h-4 w-4" />;
    case "products":
      return <Database className="h-4 w-4" />;
    case "audit":
      return <FileText className="h-4 w-4" />;
    case "content":
      return <FileText className="h-4 w-4" />;
    default:
      return <Database className="h-4 w-4" />;
  }
};

const getStatusColor = (status: TableData["status"]) => {
  switch (status) {
    case "active":
      return "bg-success text-success-foreground";
    case "syncing":
      return "bg-warning text-warning-foreground";
    case "archived":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Tables() {
  return (
    <div className="min-h-screen flex w-full bg-app-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Tables
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and explore your database tables across all connections
              </p>
            </div>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Create Table
            </Button>
          </div>

          {/* Search and Filters */}
          <Card className="bg-gradient-card border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tables..."
                    className="pl-10 bg-form-background border-input-border"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tables Grid */}
          <Card className="bg-gradient-card border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Database Tables</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {mockTables.length} tables
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-table-border bg-form-background">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-table-header hover:bg-table-header">
                      <TableHead className="w-[300px]">Table</TableHead>
                      <TableHead>Connection</TableHead>
                      <TableHead>Schema</TableHead>
                      <TableHead>Rows</TableHead>
                      <TableHead>Columns</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTables.map((table) => (
                      <TableRow key={table.id} className="hover:bg-table-row-hover">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                              {getTypeIcon(table.type)}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{table.name}</div>
                              <div className="text-sm text-muted-foreground">
                                ID: {table.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {table.connection}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {table.schema}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {table.rows.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">{table.columns}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(table.status)}>
                            {table.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {table.lastModified}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px]">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Data
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Schema
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Configure
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-card border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tables</p>
                    <p className="text-2xl font-bold">{mockTables.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Rows</p>
                    <p className="text-2xl font-bold">
                      {mockTables.reduce((sum, table) => sum + table.rows, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">
                      {mockTables.filter(t => t.status === 'active').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Syncing</p>
                    <p className="text-2xl font-bold">
                      {mockTables.filter(t => t.status === 'syncing').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}