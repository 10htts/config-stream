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
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

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

type SortField = keyof TableData | null;
type SortDirection = 'asc' | 'desc' | null;

interface ColumnFilter {
  field: keyof TableData;
  values: string[];
}

export default function Tables() {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filters, setFilters] = useState<ColumnFilter[]>([]);

  const handleSort = (field: keyof TableData) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilter = (field: keyof TableData, value: string, checked: boolean) => {
    setFilters(prev => {
      const existingFilter = prev.find(f => f.field === field);
      if (existingFilter) {
        if (checked) {
          return prev.map(f => 
            f.field === field 
              ? { ...f, values: [...f.values, value] }
              : f
          );
        } else {
          const newValues = existingFilter.values.filter(v => v !== value);
          if (newValues.length === 0) {
            return prev.filter(f => f.field !== field);
          }
          return prev.map(f => 
            f.field === field 
              ? { ...f, values: newValues }
              : f
          );
        }
      } else if (checked) {
        return [...prev, { field, values: [value] }];
      }
      return prev;
    });
  };

  const getSortIcon = (field: keyof TableData) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="h-4 w-4 text-primary" />;
    } else if (sortDirection === 'desc') {
      return <ChevronDown className="h-4 w-4 text-primary" />;
    }
    return <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />;
  };

  const getUniqueValues = (field: keyof TableData) => {
    return [...new Set(mockTables.map(table => String(table[field])))];
  };

  const isFilterActive = (field: keyof TableData) => {
    return filters.some(f => f.field === field);
  };

  // Apply filters and sorting
  let filteredTables = mockTables.filter(table => {
    return filters.every(filter => {
      if (filter.values.length === 0) return true;
      return filter.values.includes(String(table[filter.field]));
    });
  });

  if (sortField && sortDirection) {
    filteredTables.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }
  return (
    <div className="min-h-screen flex w-full bg-background">
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

          {/* Export Actions */}
          <Card className="bg-gradient-card border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-end space-x-4">
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
                  {filteredTables.length} of {mockTables.length} tables
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-table-border bg-form-background">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-table-header hover:bg-table-header">
                      <TableHead className="w-[300px]">
                        <div className="flex items-center justify-between">
                          <span>Table</span>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-muted"
                              onClick={() => handleSort('name')}
                            >
                              {getSortIcon('name')}
                            </Button>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-muted"
                                >
                                  <Filter className={`h-3 w-3 ${isFilterActive('name') ? 'text-primary' : 'text-muted-foreground'}`} />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-56" align="start">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm">Filter by Table</h4>
                                  {getUniqueValues('name').map(value => (
                                    <div key={value} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`name-${value}`}
                                        checked={filters.find(f => f.field === 'name')?.values.includes(value) || false}
                                        onCheckedChange={(checked) => handleFilter('name', value, checked as boolean)}
                                      />
                                      <label htmlFor={`name-${value}`} className="text-sm">{value}</label>
                                    </div>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center justify-between">
                          <span>Connection</span>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-muted"
                              onClick={() => handleSort('connection')}
                            >
                              {getSortIcon('connection')}
                            </Button>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-muted"
                                >
                                  <Filter className={`h-3 w-3 ${isFilterActive('connection') ? 'text-primary' : 'text-muted-foreground'}`} />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-56" align="start">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm">Filter by Connection</h4>
                                  {getUniqueValues('connection').map(value => (
                                    <div key={value} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`connection-${value}`}
                                        checked={filters.find(f => f.field === 'connection')?.values.includes(value) || false}
                                        onCheckedChange={(checked) => handleFilter('connection', value, checked as boolean)}
                                      />
                                      <label htmlFor={`connection-${value}`} className="text-sm">{value}</label>
                                    </div>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center justify-between">
                          <span>Schema</span>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-muted"
                              onClick={() => handleSort('schema')}
                            >
                              {getSortIcon('schema')}
                            </Button>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-muted"
                                >
                                  <Filter className={`h-3 w-3 ${isFilterActive('schema') ? 'text-primary' : 'text-muted-foreground'}`} />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-56" align="start">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm">Filter by Schema</h4>
                                  {getUniqueValues('schema').map(value => (
                                    <div key={value} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`schema-${value}`}
                                        checked={filters.find(f => f.field === 'schema')?.values.includes(value) || false}
                                        onCheckedChange={(checked) => handleFilter('schema', value, checked as boolean)}
                                      />
                                      <label htmlFor={`schema-${value}`} className="text-sm">{value}</label>
                                    </div>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center justify-between">
                          <span>Rows</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-muted"
                            onClick={() => handleSort('rows')}
                          >
                            {getSortIcon('rows')}
                          </Button>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center justify-between">
                          <span>Columns</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-muted"
                            onClick={() => handleSort('columns')}
                          >
                            {getSortIcon('columns')}
                          </Button>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center justify-between">
                          <span>Status</span>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-muted"
                              onClick={() => handleSort('status')}
                            >
                              {getSortIcon('status')}
                            </Button>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-muted"
                                >
                                  <Filter className={`h-3 w-3 ${isFilterActive('status') ? 'text-primary' : 'text-muted-foreground'}`} />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-56" align="start">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm">Filter by Status</h4>
                                  {getUniqueValues('status').map(value => (
                                    <div key={value} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`status-${value}`}
                                        checked={filters.find(f => f.field === 'status')?.values.includes(value) || false}
                                        onCheckedChange={(checked) => handleFilter('status', value, checked as boolean)}
                                      />
                                      <label htmlFor={`status-${value}`} className="text-sm capitalize">{value}</label>
                                    </div>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center justify-between">
                          <span>Last Modified</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-muted"
                            onClick={() => handleSort('lastModified')}
                          >
                            {getSortIcon('lastModified')}
                          </Button>
                        </div>
                      </TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTables.map((table) => (
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