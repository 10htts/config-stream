import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Code, Sparkles, FileText, Settings, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/Sidebar";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  type?: "suggestion" | "implementation" | "analysis";
}

interface UIChange {
  id: string;
  description: string;
  component: string;
  changes: string;
  status: "pending" | "applied" | "rejected";
}

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI assistant. I can help you analyze your UI, suggest improvements, and implement changes in real-time. What would you like to work on?",
      role: "assistant",
      timestamp: new Date(),
      type: "analysis"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<UIChange[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const analyzeCurrentPage = () => {
    // Simulate analysis of current page
    const analysis = {
      route: window.location.pathname,
      components: ["Sidebar", "ConnectionsTable", "QuickActions"],
      suggestions: [
        "Add loading states to data tables",
        "Improve mobile responsiveness",
        "Add search functionality",
        "Implement dark mode toggle"
      ]
    };
    return analysis;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response with context awareness
    setTimeout(() => {
      const analysis = analyzeCurrentPage();
      let response = "";
      let messageType: "suggestion" | "implementation" | "analysis" = "analysis";

      if (input.toLowerCase().includes("analyze") || input.toLowerCase().includes("current page")) {
        response = `I can see you're on the ${analysis.route} page. This page contains: ${analysis.components.join(", ")}. Here are some suggestions:\n\n${analysis.suggestions.map(s => `• ${s}`).join("\n")}`;
        messageType = "analysis";
      } else if (input.toLowerCase().includes("improve") || input.toLowerCase().includes("suggest")) {
        response = "Based on your current page, I suggest adding a search bar to the connections table and improving the mobile layout. Would you like me to implement these changes?";
        messageType = "suggestion";
        
        // Add pending changes
        const newChange: UIChange = {
          id: Date.now().toString(),
          description: "Add search functionality to connections table",
          component: "ConnectionsTable",
          changes: "Add search input and filtering logic",
          status: "pending"
        };
        setPendingChanges(prev => [...prev, newChange]);
      } else if (input.toLowerCase().includes("implement") || input.toLowerCase().includes("apply")) {
        response = "I'll implement the suggested changes now. This includes adding search functionality and improving mobile responsiveness.";
        messageType = "implementation";
      } else {
        response = `I understand you want to: "${input}". I can help you implement UI changes, analyze your current page structure, or suggest improvements. What specific changes would you like me to make?`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
        type: messageType
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleImplementChange = (changeId: string) => {
    setPendingChanges(prev => 
      prev.map(change => 
        change.id === changeId 
          ? { ...change, status: "applied" }
          : change
      )
    );
    toast({
      title: "Change Implemented",
      description: "The UI change has been successfully implemented in your codebase.",
    });
  };

  const handleApplyChange = (changeId: string) => {
    setPendingChanges(prev => 
      prev.map(change => 
        change.id === changeId 
          ? { ...change, status: "applied" }
          : change
      )
    );
    toast({
      title: "Change Previewed", 
      description: "The change has been prepared for implementation.",
    });
  };

  const handleRejectChange = (changeId: string) => {
    setPendingChanges(prev => 
      prev.map(change => 
        change.id === changeId 
          ? { ...change, status: "rejected" }
          : change
      )
    );
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case "suggestion":
        return <Sparkles className="h-4 w-4 text-yellow-500" />;
      case "implementation":
        return <Code className="h-4 w-4 text-green-500" />;
      case "analysis":
        return <FileText className="h-4 w-4 text-blue-500" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <header className="border-b border-border bg-card/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Assistant</h1>
              <p className="text-muted-foreground mt-1">
                Context-aware chat for UI improvements and live implementation
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-2">
                <Sparkles className="h-3 w-3" />
                Live Updates Enabled
              </Badge>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/settings'}>
                <Settings className="h-4 w-4 mr-2" />
                AI Settings
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex justify-center p-6">
          {/* Chat Interface */}
          <div className="max-w-4xl w-full flex flex-col">
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Chat</h2>
              </div>
              
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {getMessageIcon(message.type)}
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </div>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      
                      {message.role === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about UI improvements, analyze current page, or request changes..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isTyping}
                    className="flex-1"
                  />
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Preview ({pendingChanges.length})
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[50vw] max-w-none">
                      <SheetHeader>
                        <SheetTitle>Preview Changes</SheetTitle>
                        <SheetDescription>
                          Review AI suggestions and implement when ready
                        </SheetDescription>
                      </SheetHeader>
                      
                      <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                        <div className="space-y-3 pr-4">
                          {pendingChanges.length === 0 ? (
                            <div className="text-center py-8">
                              <Code className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                              <p className="text-sm text-muted-foreground">No pending changes</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Ask the AI to suggest improvements to see previews here
                              </p>
                            </div>
                          ) : (
                            pendingChanges.map((change) => (
                              <div
                                key={change.id}
                                className="border border-border rounded-lg p-4 space-y-3"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <Badge 
                                    variant={
                                      change.status === "applied" ? "default" :
                                      change.status === "rejected" ? "destructive" : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {change.status}
                                  </Badge>
                                </div>
                                
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm">
                                    {change.description}
                                  </h4>
                                  <div className="text-xs text-muted-foreground">
                                    <span className="font-medium">Component:</span> {change.component}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    <span className="font-medium">Changes:</span> {change.changes}
                                  </div>
                                </div>
                                
                                {change.status === "pending" && (
                                  <div className="flex flex-col gap-2 pt-3 border-t border-border">
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        handleImplementChange(change.id);
                                        setIsSheetOpen(false);
                                      }}
                                      className="w-full"
                                    >
                                      <Code className="h-3 w-3 mr-2" />
                                      Implement Change
                                    </Button>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleApplyChange(change.id)}
                                        className="flex-1"
                                      >
                                        Preview
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleRejectChange(change.id)}
                                        className="flex-1"
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>
                  <Button onClick={handleSendMessage} disabled={isTyping || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}