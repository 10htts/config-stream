import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  GripVertical, 
  Type, 
  Mail, 
  Phone, 
  Calendar, 
  CheckSquare, 
  ToggleLeft,
  FileText,
  Hash,
  MapPin,
  Link,
  Star,
  Upload,
  Settings
} from "lucide-react";
import { Link as RouterLink, useParams } from "react-router-dom";

interface FormField {
  id: string;
  type: "text" | "email" | "phone" | "date" | "checkbox" | "select" | "textarea" | "number" | "url" | "file" | "rating";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

const fieldTypes = [
  { type: "text", label: "Text Input", icon: Type },
  { type: "email", label: "Email", icon: Mail },
  { type: "phone", label: "Phone", icon: Phone },
  { type: "date", label: "Date", icon: Calendar },
  { type: "number", label: "Number", icon: Hash },
  { type: "url", label: "URL", icon: Link },
  { type: "textarea", label: "Text Area", icon: FileText },
  { type: "select", label: "Dropdown", icon: ToggleLeft },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare },
  { type: "file", label: "File Upload", icon: Upload },
  { type: "rating", label: "Rating", icon: Star },
];

export default function FormBuilder() {
  const { id } = useParams();
  const isEditing = !!id;
  
  const [formName, setFormName] = useState(isEditing ? "Customer Feedback Survey" : "");
  const [formDescription, setFormDescription] = useState(isEditing ? "Collect customer satisfaction and improvement suggestions" : "");
  const [formCategory, setFormCategory] = useState(isEditing ? "Survey" : "");
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  
  const [fields, setFields] = useState<FormField[]>(
    isEditing ? [
      {
        id: "1",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true
      },
      {
        id: "2",
        type: "email",
        label: "Email Address",
        placeholder: "your@email.com",
        required: true
      },
      {
        id: "3",
        type: "rating",
        label: "Overall Satisfaction",
        required: true
      },
      {
        id: "4",
        type: "textarea",
        label: "Additional Comments",
        placeholder: "Share your thoughts...",
        required: false
      }
    ] : []
  );

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `${fieldTypes.find(ft => ft.type === type)?.label} Field`,
      required: false,
      ...(type === "select" && { options: ["Option 1", "Option 2"] })
    };
    setFields([...fields, newField]);
    setSelectedField(newField);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates });
    }
  };

  const deleteField = (fieldId: string) => {
    setFields(fields.filter(field => field.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  };

  const renderFieldPreview = (field: FormField) => {
    const baseProps = {
      placeholder: field.placeholder,
      required: field.required,
      className: "w-full"
    };

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "url":
        return <Input {...baseProps} type={field.type} />;
      case "number":
        return <Input {...baseProps} type="number" />;
      case "date":
        return <Input {...baseProps} type="date" />;
      case "textarea":
        return <Textarea {...baseProps} rows={3} />;
      case "select":
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, idx) => (
                <SelectItem key={idx} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <input type="checkbox" id={field.id} />
            <Label htmlFor={field.id}>I agree to the terms</Label>
          </div>
        );
      case "file":
        return <Input type="file" />;
      case "rating":
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-6 w-6 cursor-pointer hover:text-yellow-400" />
            ))}
          </div>
        );
      default:
        return <Input {...baseProps} />;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <RouterLink to="/forms">
              <Button variant="ghost" size="sm">← Back to Forms</Button>
            </RouterLink>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {isEditing ? "Edit Form" : "Create New Form"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditing ? "Modify your existing form" : "Build your form with drag and drop"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" className="bg-gradient-primary hover:bg-gradient-primary/90 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Form
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Field Types Sidebar */}
        <div className="w-64 border-r bg-muted/20 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Add Fields</h3>
              <div className="grid grid-cols-1 gap-2">
                {fieldTypes.map((fieldType) => {
                  const IconComponent = fieldType.icon;
                  return (
                    <Button
                      key={fieldType.type}
                      variant="outline"
                      size="sm"
                      className="justify-start h-auto p-3 text-left"
                      onClick={() => addField(fieldType.type as FormField["type"])}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      <span className="text-sm">{fieldType.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Form Builder */}
          <div className="flex-1 p-6">
            <Tabs defaultValue="builder" className="h-full">
              <TabsList>
                <TabsTrigger value="builder">Form Builder</TabsTrigger>
                <TabsTrigger value="settings">Form Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="builder" className="flex-1 mt-4">
                <ScrollArea className="h-full pr-4">
                  <Card>
                    <CardHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="form-name">Form Name</Label>
                          <Input
                            id="form-name"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="Enter form name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="form-description">Description</Label>
                          <Textarea
                            id="form-description"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            placeholder="Describe what this form is for"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {fields.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No fields added yet</p>
                          <p className="text-sm">Drag fields from the left panel to get started</p>
                        </div>
                      ) : (
                        fields.map((field) => (
                          <div
                            key={field.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedField?.id === field.id 
                                ? "border-primary bg-primary/5" 
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedField(field)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <Label className="text-sm font-medium">{field.label}</Label>
                                  {field.required && <Badge variant="secondary" className="ml-2 text-xs">Required</Badge>}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteField(field.id);
                                }}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            {renderFieldPreview(field)}
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Form Settings</CardTitle>
                    <CardDescription>Configure form behavior and appearance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formCategory} onValueChange={setFormCategory}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Survey">Survey</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="Events">Events</SelectItem>
                          <SelectItem value="Product">Product</SelectItem>
                          <SelectItem value="Development">Development</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Submission Settings</h4>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="allow-multiple">Allow multiple submissions</Label>
                        <Switch id="allow-multiple" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="require-login">Require login to submit</Label>
                        <Switch id="require-login" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications">Email notifications</Label>
                        <Switch id="email-notifications" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Field Properties Panel */}
          {selectedField && (
            <div className="w-80 border-l bg-muted/20 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Field Properties</h3>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="field-label">Label</Label>
                    <Input
                      id="field-label"
                      value={selectedField.label}
                      onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="field-placeholder">Placeholder</Label>
                    <Input
                      id="field-placeholder"
                      value={selectedField.placeholder || ""}
                      onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="field-required">Required</Label>
                    <Switch
                      id="field-required"
                      checked={selectedField.required}
                      onCheckedChange={(checked) => updateField(selectedField.id, { required: checked })}
                    />
                  </div>
                  
                  {selectedField.type === "select" && (
                    <div>
                      <Label>Options</Label>
                      <div className="mt-1 space-y-2">
                        {selectedField.options?.map((option, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(selectedField.options || [])];
                                newOptions[idx] = e.target.value;
                                updateField(selectedField.id, { options: newOptions });
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newOptions = selectedField.options?.filter((_, i) => i !== idx);
                                updateField(selectedField.id, { options: newOptions });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newOptions = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`];
                            updateField(selectedField.id, { options: newOptions });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Option
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}