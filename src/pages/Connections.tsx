import { useState } from "react";
import { Plus, Database, Edit, Trash2, TestTube, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Connection {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql' | 'sqlite' | 'mssql';
  host?: string;
  port?: number;
  database: string;
  username?: string;
  status: 'connected' | 'disconnected' | 'error';
  lastTested: string;
  tableCount?: number;
}

const mockConnections: Connection[] = [
  {
    id: '1',
    name: 'Main Production DB',
    type: 'postgresql',
    host: 'prod-db.company.com',
    port: 5432,
    database: 'production',
    username: 'app_user',
    status: 'connected',
    lastTested: '2024-01-15T10:30:00Z',
    tableCount: 47
  },
  {
    id: '2',
    name: 'Analytics Warehouse',
    type: 'mysql',
    host: 'analytics.company.com',
    port: 3306,
    database: 'warehouse',
    username: 'analytics_user',
    status: 'connected',
    lastTested: '2024-01-15T09:45:00Z',
    tableCount: 23
  },
  {
    id: '3',
    name: 'Local Development',
    type: 'sqlite',
    database: '/data/dev.db',
    status: 'connected',
    lastTested: '2024-01-15T11:15:00Z',
    tableCount: 12
  },
  {
    id: '4',
    name: 'Legacy System',
    type: 'mssql',
    host: 'legacy-db.company.com',
    port: 1433,
    database: 'legacy_system',
    username: 'legacy_user',
    status: 'error',
    lastTested: '2024-01-14T16:20:00Z',
    tableCount: 0
  }
];

const databaseTypes = [
  { value: 'postgresql', label: 'PostgreSQL', icon: '🐘' },
  { value: 'mysql', label: 'MySQL', icon: '🐬' },
  { value: 'sqlite', label: 'SQLite', icon: '💎' },
  { value: 'mssql', label: 'SQL Server', icon: '🏢' }
];

export default function Connections() {
  const [connections, setConnections] = useState<Connection[]>(mockConnections);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: ''
  });

  const filteredConnections = connections.filter(conn =>
    conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.database.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Connection['status']) => {
    switch (status) {
      case 'connected': return 'bg-success text-success-foreground';
      case 'disconnected': return 'bg-muted text-muted-foreground';
      case 'error': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleTestConnection = async (connectionId: string) => {
    toast.info("Testing connection...");
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.3;
      if (success) {
        toast.success("Connection test successful");
        setConnections(prev => prev.map(conn => 
          conn.id === connectionId 
            ? { ...conn, status: 'connected' as const, lastTested: new Date().toISOString() }
            : conn
        ));
      } else {
        toast.error("Connection test failed");
        setConnections(prev => prev.map(conn => 
          conn.id === connectionId 
            ? { ...conn, status: 'error' as const, lastTested: new Date().toISOString() }
            : conn
        ));
      }
    }, 2000);
  };

  const handleSaveConnection = () => {
    if (!formData.name || !formData.type || !formData.database) {
      toast.error("Please fill in required fields");
      return;
    }

    const newConnection: Connection = {
      id: editingConnection?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type as Connection['type'],
      host: formData.host || undefined,
      port: formData.port ? parseInt(formData.port) : undefined,
      database: formData.database,
      username: formData.username || undefined,
      status: 'disconnected',
      lastTested: new Date().toISOString(),
      tableCount: 0
    };

    if (editingConnection) {
      setConnections(prev => prev.map(conn => 
        conn.id === editingConnection.id ? newConnection : conn
      ));
      toast.success("Connection updated successfully");
    } else {
      setConnections(prev => [...prev, newConnection]);
      toast.success("Connection added successfully");
    }

    setIsDialogOpen(false);
    setEditingConnection(null);
    setFormData({ name: '', type: '', host: '', port: '', database: '', username: '', password: '' });
  };

  const handleEditConnection = (connection: Connection) => {
    setEditingConnection(connection);
    setFormData({
      name: connection.name,
      type: connection.type,
      host: connection.host || '',
      port: connection.port?.toString() || '',
      database: connection.database,
      username: connection.username || '',
      password: ''
    });
    setIsDialogOpen(true);
  };

  const handleDeleteConnection = (connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    toast.success("Connection deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Database Connections</h1>
          <p className="text-muted-foreground mt-1">
            Manage your database connections and data sources
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingConnection(null);
                setFormData({ name: '', type: '', host: '', port: '', database: '', username: '', password: '' });
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Connection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingConnection ? 'Edit Connection' : 'Add New Connection'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Connection Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Database"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Database Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select database type" />
                  </SelectTrigger>
                  <SelectContent>
                    {databaseTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.type !== 'sqlite' && (
                <>
                  <div>
                    <Label htmlFor="host">Host</Label>
                    <Input
                      id="host"
                      value={formData.host}
                      onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
                      placeholder="localhost"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      type="number"
                      value={formData.port}
                      onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
                      placeholder="5432"
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="database">Database *</Label>
                <Input
                  id="database"
                  value={formData.database}
                  onChange={(e) => setFormData(prev => ({ ...prev, database: e.target.value }))}
                  placeholder={formData.type === 'sqlite' ? '/path/to/database.db' : 'database_name'}
                />
              </div>

              {formData.type !== 'sqlite' && (
                <>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="username"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveConnection}>
                  {editingConnection ? 'Update' : 'Add'} Connection
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search connections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredConnections.map((connection) => (
          <Card key={connection.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{connection.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {databaseTypes.find(t => t.value === connection.type)?.icon} {connection.type.toUpperCase()}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(connection.status)}`}>
                        {connection.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditConnection(connection)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTestConnection(connection.id)}>
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Connection
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteConnection(connection.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Database</p>
                  <p className="font-medium">{connection.database}</p>
                </div>
                {connection.host && (
                  <div>
                    <p className="text-muted-foreground">Host</p>
                    <p className="font-medium">{connection.host}:{connection.port}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Tables</p>
                  <p className="font-medium">{connection.tableCount || 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Tested</p>
                  <p className="font-medium">
                    {new Date(connection.lastTested).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredConnections.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No connections found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No connections match your search." : "Get started by adding your first database connection."}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Connection
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}