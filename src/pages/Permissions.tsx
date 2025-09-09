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

const mockRolePermissions = [
  {
    role: "Admin",
    permissions: [
      "Database Read", "Database Write", "Database Delete",
      "Table Read", "Table Write", "Table Delete", 
      "User Management", "System Settings"
    ],
  },
  {
    role: "Editor", 
    permissions: [
      "Database Read", "Database Write",
      "Table Read", "Table Write"
    ],
  },
  {
    role: "Viewer",
    permissions: [
      "Database Read", "Table Read"
    ],
  },
];

const Permissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"permissions" | "roles">("permissions");
  const [selectedResource, setSelectedResource] = useState<string>("All");

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
    };
    return (
      <Badge variant="outline" className={colors[action as keyof typeof colors] || ""}>
        {action}
      </Badge>
    );
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
            <div className="space-y-6">
              {mockRolePermissions.map((roleData) => (
                <Card key={roleData.role} className="bg-gradient-card border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-primary" />
                      {roleData.role} Role
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {roleData.permissions.map((permission) => {
                        const permissionData = mockPermissions.find(p => p.name === permission);
                        return (
                          <div
                            key={permission}
                            className="flex items-center space-x-2 p-3 rounded-lg bg-surface border"
                          >
                            {permissionData && getResourceIcon(permissionData.resource)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {permission}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {permissionData?.action}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Permissions;