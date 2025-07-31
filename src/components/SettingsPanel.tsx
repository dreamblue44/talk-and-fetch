import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Database, Globe, Mail } from "lucide-react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const [settings, setSettings] = useState({
    database: {
      connectionString: "",
      defaultTable: ""
    },
    web: {
      searchEngine: "google",
      maxResults: "5"
    },
    email: {
      smtpServer: "",
      smtpPort: "587",
      username: "",
      password: ""
    }
  });

  const handleSave = () => {
    // Save settings to localStorage or backend
    localStorage.setItem("chatbot-settings", JSON.stringify(settings));
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-background">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Configure your chatbot settings for different modes
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <Tabs defaultValue="database" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="database" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Database
              </TabsTrigger>
              <TabsTrigger value="web" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Web
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="database" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Database Configuration</CardTitle>
                  <CardDescription>
                    Configure your database connection for queries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="connectionString">Connection String</Label>
                    <Textarea
                      id="connectionString"
                      placeholder="postgresql://username:password@host:port/database"
                      value={settings.database.connectionString}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        database: { ...prev.database, connectionString: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultTable">Default Table</Label>
                    <Input
                      id="defaultTable"
                      placeholder="users"
                      value={settings.database.defaultTable}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        database: { ...prev.database, defaultTable: e.target.value }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="web" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Web Search Configuration</CardTitle>
                  <CardDescription>
                    Configure web search parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="searchEngine">Search Engine</Label>
                    <Input
                      id="searchEngine"
                      placeholder="google"
                      value={settings.web.searchEngine}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        web: { ...prev.web, searchEngine: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxResults">Max Results</Label>
                    <Input
                      id="maxResults"
                      type="number"
                      placeholder="5"
                      value={settings.web.maxResults}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        web: { ...prev.web, maxResults: e.target.value }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="email" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Configuration</CardTitle>
                  <CardDescription>
                    Configure SMTP settings for sending emails
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="smtpServer">SMTP Server</Label>
                    <Input
                      id="smtpServer"
                      placeholder="smtp.gmail.com"
                      value={settings.email.smtpServer}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, smtpServer: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      placeholder="587"
                      value={settings.email.smtpPort}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, smtpPort: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailUsername">Username</Label>
                    <Input
                      id="emailUsername"
                      placeholder="your-email@gmail.com"
                      value={settings.email.username}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, username: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailPassword">Password</Label>
                    <Input
                      id="emailPassword"
                      type="password"
                      placeholder="your-app-password"
                      value={settings.email.password}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, password: e.target.value }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};