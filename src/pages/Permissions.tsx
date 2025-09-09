import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Plus,
  Search,
  MoreVertical,
  Lock,
  Unlock,
  Eye,
  Edit,
  Trash2,
  Database,
  Table as TableIcon,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const mockPermissions = [
  {
    id: 1,
    name: "Database Read",
    description: "View database connections and schemas",
    resource: "Database",
    action: "Read",
    enabled: true,
    assignedRoles: ["Admin", "Editor", "Viewer"],
  },
  {
    id: 2,
    name: "Database Write", 
    description: "Create and modify database connections",
    resource: "Database",
    action: "Write",
    enabled: true,
    assignedRoles: ["Admin", "Editor"],
  },
  {
    id: 3,
    name: "Database Delete",
    description: "Delete database connections",
    resource: "Database", 
    action: "Delete",
    enabled: true,
    assignedRoles: ["Admin"],
  },
  {
    id: 4,
    name: "Table Read",
    description: "View table data and structure",
    resource: "Table",
    action: "Read", 
    enabled: true,
    assignedRoles: ["Admin", "Editor", "Viewer"],
  },
  {
    id: 5,
    name: "Table Write",
    description: "Create and modify tables",
    resource: "Table",
    action: "Write",
    enabled: true,
    assignedRoles: ["Admin", "Editor"],
  },
  {
    id: 6,
    name: "Table Delete",
    description: "Delete tables and their data",
    resource: "Table",
    action: "Delete",
    enabled: false,
    assignedRoles: ["Admin"],
  },
  {
    id: 7,
    name: "User Management",
    description: "Manage system users and roles",
    resource: "Users",
    action: "Manage",
    enabled: true,
    assignedRoles: ["Admin"],
  },
  {
    id: 8,
    name: "System Settings",
    description: "Access and modify system settings",
    resource: "Settings",
    action: "Manage",
    enabled: true,
    assignedRoles: ["Admin"],
  },
];

// Mock hierarchical database structure
const mockDatabaseStructure = [
  {
    id: "db1",
    name: "Database1",
    tables: [
      {
        id: "db1_users",
        name: "UserTable",
        fields: [
          { id: "db1_users_id", name: "ID" },
          { id: "db1_users_fullname", name: "FullName" },
          { id: "db1_users_email", name: "Email" },
          { id: "db1_users_role", name: "Role" },
        ],
      },
      {
        id: "db1_orders",
        name: "OrderTable",
        fields: [
          { id: "db1_orders_id", name: "ID" },
          { id: "db1_orders_amount", name: "Amount" },
          { id: "db1_orders_date", name: "Date" },
        ],
      },
    ],
  },
  {
    id: "db2",
    name: "Database2",
    tables: [
      {
        id: "db2_products",
        name: "ProductTable",
        fields: [
          { id: "db2_products_id", name: "ID" },
          { id: "db2_products_name", name: "Name" },
          { id: "db2_products_price", name: "Price" },
        ],
      },
    ],
  },
];

// Permission types
type PermissionLevel = "None" | "Read" | "Write" | "Delete";

// Role permissions with hierarchy
interface RolePermissions {
  role: string;
  defaultPermission: PermissionLevel;
  databasePermissions: Record<string, PermissionLevel>;
  tablePermissions: Record<string, PermissionLevel>;
  fieldPermissions: Record<string, PermissionLevel>;
}

const mockRolePermissions: RolePermissions[] = [
  {
    role: "Admin",
    defaultPermission: "Delete",
    databasePermissions: {},
    tablePermissions: {},
    fieldPermissions: {},
  },
  {
    role: "Editor",
    defaultPermission: "Write",
    databasePermissions: {},
    tablePermissions: {},
    fieldPermissions: {},
  },
  {
    role: "Viewer",
    defaultPermission: "Read",
    databasePermissions: {},
    tablePermissions: {},
    fieldPermissions: {},
  },
];

const Permissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"permissions" | "roles">("permissions");
  const [selectedResource, setSelectedResource] = useState<string>("All");
  const [selectedRole, setSelectedRole] = useState<string>("Admin");
  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>(mockRolePermissions);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["db1", "db2"]));

  const resources = ["All", "Database", "Table", "Users", "Settings"];

  const filteredPermissions = mockPermissions.filter((permission) => {
    const matchesSearch = 
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResource = selectedResource === "All" || permission.resource === selectedResource;
    return matchesSearch && matchesResource;
  });

  const getResourceIcon = (resource: string) => {
    const icons = {
      Database: Database,
      Table: TableIcon,
      Users: Users,
      Settings: Settings,
    };
    const Icon = icons[resource as keyof typeof icons] || Shield;
    return <Icon className="h-4 w-4" />;
  };

  const getActionBadge = (action: string) => {
    const colors = {
      Read: "bg-success/10 text-success border-success/20",
      Write: "bg-warning/10 text-warning border-warning/20", 
      Delete: "bg-destructive/10 text-destructive border-destructive/20",
      Manage: "bg-primary/10 text-primary border-primary/20",
      None: "bg-muted/10 text-muted-foreground border-muted/20",
    };
    return (
      <Badge variant="outline" className={colors[action as keyof typeof colors] || ""}>
        {action}
      </Badge>
    );
  };

  const getPermissionBadge = (permission: PermissionLevel) => {
    const colors = {
      None: "bg-muted/10 text-muted-foreground border-muted/20",
      Read: "bg-success/10 text-success border-success/20",
      Write: "bg-warning/10 text-warning border-warning/20",
      Delete: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return (
      <Badge variant="outline" className={colors[permission] || ""}>
        {permission}
      </Badge>
    );
  };

  // Get effective permission for an item (considering inheritance)
  const getEffectivePermission = (
    itemId: string,
    itemType: "database" | "table" | "field",
    databaseId?: string,
    tableId?: string
  ): PermissionLevel => {
    const currentRole = rolePermissions.find(r => r.role === selectedRole);
    if (!currentRole) return "None";

    // Check specific permission first
    if (itemType === "field" && currentRole.fieldPermissions[itemId]) {
      return currentRole.fieldPermissions[itemId];
    }
    if (itemType === "table" && currentRole.tablePermissions[itemId]) {
      return currentRole.tablePermissions[itemId];
    }
    if (itemType === "database" && currentRole.databasePermissions[itemId]) {
      return currentRole.databasePermissions[itemId];
    }

    // Inherit from parent
    if (itemType === "field" && tableId) {
      const tablePermission = getEffectivePermission(tableId, "table", databaseId);
      if (tablePermission !== currentRole.defaultPermission) return tablePermission;
    }
    if ((itemType === "table" || itemType === "field") && databaseId) {
      const dbPermission = getEffectivePermission(databaseId, "database");
      if (dbPermission !== currentRole.defaultPermission) return dbPermission;
    }

    return currentRole.defaultPermission;
  };

  // Update permission and cascade to children if needed
  const updatePermission = (
    itemId: string,
    itemType: "database" | "table" | "field",
    newPermission: PermissionLevel,
    databaseId?: string,
    tableId?: string
  ) => {
    setRolePermissions(prev => prev.map(role => {
      if (role.role !== selectedRole) return role;

      const updated = { ...role };

      // Set the specific permission
      if (itemType === "database") {
        updated.databasePermissions = { ...updated.databasePermissions, [itemId]: newPermission };
        
        // If setting database to a specific permission, remove child overrides that match
        Object.keys(updated.tablePermissions).forEach(tableId => {
          if (tableId.startsWith(itemId + "_") && updated.tablePermissions[tableId] === newPermission) {
            delete updated.tablePermissions[tableId];
          }
        });
        Object.keys(updated.fieldPermissions).forEach(fieldId => {
          if (fieldId.startsWith(itemId + "_") && updated.fieldPermissions[fieldId] === newPermission) {
            delete updated.fieldPermissions[fieldId];
          }
        });
      } else if (itemType === "table") {
        updated.tablePermissions = { ...updated.tablePermissions, [itemId]: newPermission };
        
        // Remove field overrides that match
        Object.keys(updated.fieldPermissions).forEach(fieldId => {
          if (fieldId.startsWith(itemId + "_") && updated.fieldPermissions[fieldId] === newPermission) {
            delete updated.fieldPermissions[fieldId];
          }
        });
      } else if (itemType === "field") {
        updated.fieldPermissions = { ...updated.fieldPermissions, [itemId]: newPermission };
      }

      return updated;
    }));
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="border-b border-border bg-surface-elevated px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Permissions</h1>
              <p className="text-sm text-muted-foreground">
                Configure system permissions and role-based access control
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Permission Groups
              </Button>
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Permission
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 bg-gradient-surface">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-card border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Permissions</p>
                    <p className="text-2xl font-bold text-foreground">{mockPermissions.length}</p>
                  </div>
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-success">
                      {mockPermissions.filter(p => p.enabled).length}
                    </p>
                  </div>
                  <Unlock className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Disabled</p>
                    <p className="text-2xl font-bold text-muted-foreground">
                      {mockPermissions.filter(p => !p.enabled).length}
                    </p>
                  </div>
                  <Lock className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resources</p>
                    <p className="text-2xl font-bold text-foreground">{resources.length - 1}</p>
                  </div>
                  <Database className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === "permissions" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("permissions")}
              className="px-4"
            >
              Permissions
            </Button>
            <Button
              variant={activeTab === "roles" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("roles")}
              className="px-4"
            >
              Role Matrix
            </Button>
          </div>

          {/* Content */}
          {activeTab === "permissions" ? (
            <Card className="bg-gradient-card border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">System Permissions</CardTitle>
                  <div className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          {selectedResource} Resources
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {resources.map((resource) => (
                          <DropdownMenuItem
                            key={resource}
                            onClick={() => setSelectedResource(resource)}
                          >
                            {resource}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search permissions..."
                        className="pl-8 w-80"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned Roles</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{permission.name}</p>
                            <p className="text-sm text-muted-foreground">{permission.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getResourceIcon(permission.resource)}
                            <span>{permission.resource}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getActionBadge(permission.action)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch checked={permission.enabled} />
                            <span className="text-sm">
                              {permission.enabled ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {permission.assignedRoles.map((role) => (
                              <Badge key={role} variant="secondary" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Permission
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Permission
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gradient-card border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Role Matrix</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium">Role:</label>
                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {rolePermissions.map((role) => (
                            <SelectItem key={role.role} value={role.role}>
                              {role.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium">Default:</label>
                      <Select 
                        value={rolePermissions.find(r => r.role === selectedRole)?.defaultPermission || "None"}
                        onValueChange={(value: PermissionLevel) => {
                          setRolePermissions(prev => prev.map(role => 
                            role.role === selectedRole 
                              ? { ...role, defaultPermission: value }
                              : role
                          ));
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Read">Read</SelectItem>
                          <SelectItem value="Write">Write</SelectItem>
                          <SelectItem value="Delete">Delete</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDatabaseStructure.map((database) => (
                    <div key={database.id} className="border rounded-lg p-4 bg-surface">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleExpanded(database.id)}
                          >
                            {expandedItems.has(database.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          <Database className="h-4 w-4 text-primary" />
                          <span className="font-medium">{database.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPermissionBadge(getEffectivePermission(database.id, "database"))}
                          <Select
                            value={getEffectivePermission(database.id, "database")}
                            onValueChange={(value: PermissionLevel) => 
                              updatePermission(database.id, "database", value)
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="None">None</SelectItem>
                              <SelectItem value="Read">Read</SelectItem>
                              <SelectItem value="Write">Write</SelectItem>
                              <SelectItem value="Delete">Delete</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {expandedItems.has(database.id) && (
                        <div className="ml-6 space-y-3">
                          {database.tables.map((table) => (
                            <div key={table.id} className="border-l-2 border-muted pl-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0"
                                    onClick={() => toggleExpanded(table.id)}
                                  >
                                    {expandedItems.has(table.id) ? (
                                      <ChevronDown className="h-3 w-3" />
                                    ) : (
                                      <ChevronRight className="h-3 w-3" />
                                    )}
                                  </Button>
                                  <TableIcon className="h-4 w-4 text-secondary" />
                                  <span className="text-sm font-medium">{table.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getPermissionBadge(getEffectivePermission(table.id, "table", database.id))}
                                  <Select
                                    value={getEffectivePermission(table.id, "table", database.id)}
                                    onValueChange={(value: PermissionLevel) => 
                                      updatePermission(table.id, "table", value, database.id)
                                    }
                                  >
                                    <SelectTrigger className="w-20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="None">None</SelectItem>
                                      <SelectItem value="Read">Read</SelectItem>
                                      <SelectItem value="Write">Write</SelectItem>
                                      <SelectItem value="Delete">Delete</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {expandedItems.has(table.id) && (
                                <div className="ml-4 space-y-2">
                                  {table.fields.map((field) => (
                                    <div key={field.id} className="flex items-center justify-between py-1">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-4" /> {/* Spacer for alignment */}
                                        <span className="text-xs text-muted-foreground">•</span>
                                        <span className="text-sm">{field.name}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        {getPermissionBadge(getEffectivePermission(field.id, "field", database.id, table.id))}
                                        <Select
                                          value={getEffectivePermission(field.id, "field", database.id, table.id)}
                                          onValueChange={(value: PermissionLevel) => 
                                            updatePermission(field.id, "field", value, database.id, table.id)
                                          }
                                        >
                                          <SelectTrigger className="w-20">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="None">None</SelectItem>
                                            <SelectItem value="Read">Read</SelectItem>
                                            <SelectItem value="Write">Write</SelectItem>
                                            <SelectItem value="Delete">Delete</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Permissions;