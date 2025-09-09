import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Save, Shield, Bell, Database, Palette, Globe, Key, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function Settings() {
  const [settings, setSettings] = useState({
    // General
    appName: "FormBuilder Admin",
    appDescription: "Configuration-driven Admin Dashboard",
    defaultPageSize: "25",
    timezone: "UTC",
    
    // Security
    enableTwoFactor: true,
    sessionTimeout: "30",
    passwordMinLength: "8",
    enableApiTokens: true,
    
    // Notifications
    emailNotifications: true,
    browserNotifications: false,
    slackWebhook: "",
    
    // Database
    queryTimeout: "30",
    maxConnections: "10",
    enableQueryLogging: false,
    
    // AI Assistant
    enableAiAssist: true,
    aiProvider: "openrouter",
    aiModel: "openai/gpt-4",
    aiMaxTokens: "2048",
    
    // Appearance
    defaultTheme: "system",
    compactMode: false,
    enableAnimations: true
  });

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully`);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="border-b border-border bg-surface-elevated px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Configure your application settings and preferences
            </p>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 bg-gradient-surface">
          <div className="space-y-6">

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <Database className="h-4 w-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Key className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="appName">Application Name</Label>
                  <Input
                    id="appName"
                    value={settings.appName}
                    onChange={(e) => handleSettingChange('appName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="appDescription">Application Description</Label>
                <Textarea
                  id="appDescription"
                  value={settings.appDescription}
                  onChange={(e) => handleSettingChange('appDescription', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="defaultPageSize">Default Page Size</Label>
                <Select value={settings.defaultPageSize} onValueChange={(value) => handleSettingChange('defaultPageSize', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 items</SelectItem>
                    <SelectItem value="25">25 items</SelectItem>
                    <SelectItem value="50">50 items</SelectItem>
                    <SelectItem value="100">100 items</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />
              <Button onClick={() => handleSave('General')}>
                <Save className="h-4 w-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableTwoFactor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                </div>
                <Switch
                  id="enableTwoFactor"
                  checked={settings.enableTwoFactor}
                  onCheckedChange={(checked) => handleSettingChange('enableTwoFactor', checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleSettingChange('passwordMinLength', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableApiTokens">API Tokens</Label>
                  <p className="text-sm text-muted-foreground">Allow users to create API tokens</p>
                </div>
                <Switch
                  id="enableApiTokens"
                  checked={settings.enableApiTokens}
                  onCheckedChange={(checked) => handleSettingChange('enableApiTokens', checked)}
                />
              </div>

              <Separator />
              <Button onClick={() => handleSave('Security')}>
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send system notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="browserNotifications">Browser Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show browser push notifications</p>
                </div>
                <Switch
                  id="browserNotifications"
                  checked={settings.browserNotifications}
                  onCheckedChange={(checked) => handleSettingChange('browserNotifications', checked)}
                />
              </div>

              <div>
                <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
                <Input
                  id="slackWebhook"
                  placeholder="https://hooks.slack.com/services/..."
                  value={settings.slackWebhook}
                  onChange={(e) => handleSettingChange('slackWebhook', e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Optional: Send system alerts to Slack
                </p>
              </div>

              <Separator />
              <Button onClick={() => handleSave('Notifications')}>
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="queryTimeout">Query Timeout (seconds)</Label>
                  <Input
                    id="queryTimeout"
                    type="number"
                    value={settings.queryTimeout}
                    onChange={(e) => handleSettingChange('queryTimeout', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxConnections">Max Connections per Pool</Label>
                  <Input
                    id="maxConnections"
                    type="number"
                    value={settings.maxConnections}
                    onChange={(e) => handleSettingChange('maxConnections', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableQueryLogging">Query Logging</Label>
                  <p className="text-sm text-muted-foreground">Log all database queries for debugging</p>
                </div>
                <Switch
                  id="enableQueryLogging"
                  checked={settings.enableQueryLogging}
                  onCheckedChange={(checked) => handleSettingChange('enableQueryLogging', checked)}
                />
              </div>

              <Separator />
              <Button onClick={() => handleSave('Database')}>
                <Save className="h-4 w-4 mr-2" />
                Save Database Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                AI Assistant Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableAiAssist">Enable AI Assistant</Label>
                  <p className="text-sm text-muted-foreground">Allow AI-powered configuration suggestions</p>
                </div>
                <Switch
                  id="enableAiAssist"
                  checked={settings.enableAiAssist}
                  onCheckedChange={(checked) => handleSettingChange('enableAiAssist', checked)}
                />
              </div>

              {settings.enableAiAssist && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="aiProvider">AI Provider</Label>
                      <Select value={settings.aiProvider} onValueChange={(value) => handleSettingChange('aiProvider', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openrouter">OpenRouter</SelectItem>
                          <SelectItem value="openai">OpenAI Direct</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="aiModel">AI Model</Label>
                      <Select value={settings.aiModel} onValueChange={(value) => handleSettingChange('aiModel', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai/gpt-4">GPT-4</SelectItem>
                          <SelectItem value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          <SelectItem value="anthropic/claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                          <SelectItem value="anthropic/claude-3-haiku">Claude 3 Haiku</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="aiMaxTokens">Max Tokens per Request</Label>
                    <Input
                      id="aiMaxTokens"
                      type="number"
                      value={settings.aiMaxTokens}
                      onChange={(e) => handleSettingChange('aiMaxTokens', e.target.value)}
                    />
                  </div>
                </>
              )}

              <Separator />
              <Button onClick={() => handleSave('AI Assistant')}>
                <Save className="h-4 w-4 mr-2" />
                Save AI Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="defaultTheme">Default Theme</Label>
                <Select value={settings.defaultTheme} onValueChange={(value) => handleSettingChange('defaultTheme', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compactMode">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">Use smaller spacing and components</p>
                </div>
                <Switch
                  id="compactMode"
                  checked={settings.compactMode}
                  onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableAnimations">Enable Animations</Label>
                  <p className="text-sm text-muted-foreground">Show smooth transitions and animations</p>
                </div>
                <Switch
                  id="enableAnimations"
                  checked={settings.enableAnimations}
                  onCheckedChange={(checked) => handleSettingChange('enableAnimations', checked)}
                />
              </div>

              <Separator />
              <Button onClick={() => handleSave('Appearance')}>
                <Save className="h-4 w-4 mr-2" />
                Save Appearance Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}