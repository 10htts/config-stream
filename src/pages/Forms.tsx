import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, MoreHorizontal, Edit, Copy, Trash2, Eye, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface Form {
  id: string;
  name: string;
  description: string;
  status: "draft" | "published" | "archived";
  fields: number;
  submissions: number;
  lastModified: string;
  createdBy: string;
  category: string;
}

const mockForms: Form[] = [
  {
    id: "1",
    name: "Customer Feedback Survey",
    description: "Collect customer satisfaction and improvement suggestions",
    status: "published",
    fields: 12,
    submissions: 1247,
    lastModified: "2024-01-15",
    createdBy: "Sarah Johnson",
    category: "Survey"
  },
  {
    id: "2",
    name: "Employee Onboarding Form",
    description: "New hire information and documentation collection",
    status: "published",
    fields: 24,
    submissions: 89,
    lastModified: "2024-01-14",
    createdBy: "Mike Chen",
    category: "HR"
  },
  {
    id: "3",
    name: "Event Registration",
    description: "Annual conference registration with preferences",
    status: "draft",
    fields: 8,
    submissions: 0,
    lastModified: "2024-01-13",
    createdBy: "Emily Davis",
    category: "Events"
  },
  {
    id: "4",
    name: "Product Feature Request",
    description: "Customer requests for new features and enhancements",
    status: "published",
    fields: 6,
    submissions: 342,
    lastModified: "2024-01-12",
    createdBy: "Alex Rodriguez",
    category: "Product"
  },
  {
    id: "5",
    name: "Bug Report Template",
    description: "Standardized bug reporting for development team",
    status: "archived",
    fields: 15,
    submissions: 156,
    lastModified: "2024-01-10",
    createdBy: "David Kim",
    category: "Development"
  }
];

const getStatusColor = (status: Form["status"]) => {
  switch (status) {
    case "published":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "draft":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "archived":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

export default function Forms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredForms = mockForms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || form.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || form.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = Array.from(new Set(mockForms.map(form => form.category)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Forms</h1>
          <p className="text-muted-foreground">
            Create and manage your data collection forms
          </p>
        </div>
        <Link to="/forms/new">
          <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Form
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Forms</p>
                <p className="text-2xl font-bold text-foreground">{mockForms.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold text-green-500">
                  {mockForms.filter(f => f.status === "published").length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockForms.reduce((sum, form) => sum + form.submissions, 0).toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {mockForms.filter(f => f.status === "draft").length}
                </p>
              </div>
              <Edit className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Forms</CardTitle>
              <CardDescription>
                Manage your form templates and configurations
              </CardDescription>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fields</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredForms.map((form) => (
                <TableRow key={form.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{form.name}</div>
                      <div className="text-sm text-muted-foreground">{form.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{form.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(form.status)}>
                      {form.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground">{form.fields}</TableCell>
                  <TableCell className="text-foreground">{form.submissions.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{form.lastModified}</TableCell>
                  <TableCell className="text-muted-foreground">{form.createdBy}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background border shadow-md">
                        <Link to={`/forms/${form.id}/edit`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
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
        </CardContent>
      </Card>
    </div>
  );
}