import { useState } from "react";
import { ChatContainer } from "./ChatContainer";
import { ChatInput } from "./ChatInput";
import { ModeSelector, ChatMode } from "./ModeSelector";
import { SettingsPanel } from "./SettingsPanel";
import { AppSidebar } from "./AppSidebar";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  name: string;
  mode: ChatMode;
  createdAt: Date;
  lastMessage?: string;
  messages: Message[];
}

export const ChatInterface = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<ChatMode>("database");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  const currentChat = chatSessions.find(chat => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  const generateChatName = (firstMessage: string): string => {
    const words = firstMessage.split(' ').slice(0, 4);
    return words.join(' ') + (words.length === 4 && firstMessage.split(' ').length > 4 ? '...' : '');
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const simulateResponse = async (userMessage: string, mode: ChatMode): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    switch (mode) {
      case "database":
        return `I searched the database for "${userMessage}". Here are the results:\n\n• Found 3 matching records\n• Last updated: ${new Date().toLocaleDateString()}\n• Status: Active\n\nWould you like me to provide more specific details about any of these records?`;
      
      case "web":
        return `I searched the web for "${userMessage}". Here's what I found:\n\n• Recent articles and news\n• Technical documentation\n• Community discussions\n• Related resources\n\nThe most relevant information suggests that this topic is currently trending. Would you like me to dive deeper into any specific aspect?`;
      
      case "email":
        return `I've prepared an email based on your request: "${userMessage}"\n\nTo complete the email sending process, please provide:\n• Target email address\n• Email subject\n• Any additional formatting preferences\n\nOnce you provide these details, I'll send the email immediately.`;
      
      default:
        return "I'm not sure how to handle that request. Please try again or check your settings.";
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      content,
      isUser: true,
      timestamp: new Date()
    };

    let targetChatId = currentChatId;

    // Update or create chat session
    if (!currentChatId) {
      // Create new chat session
      const newChatId = generateId();
      targetChatId = newChatId;
      const newSession: ChatSession = {
        id: newChatId,
        name: generateChatName(content),
        mode: currentMode,
        createdAt: new Date(),
        lastMessage: content,
        messages: [userMessage]
      };
      
      setChatSessions(prev => [newSession, ...prev]);
      setCurrentChatId(newChatId);
    } else {
      // Add to existing chat
      setChatSessions(prev => prev.map(session => 
        session.id === currentChatId 
          ? { ...session, messages: [...session.messages, userMessage], lastMessage: content }
          : session
      ));
    }

    setIsLoading(true);

    try {
      const response = await simulateResponse(content, currentMode);
      
      const assistantMessage: Message = {
        id: generateId(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };

      // Add assistant response to chat session
      setChatSessions(prev => prev.map(session => 
        session.id === targetChatId 
          ? { ...session, messages: [...session.messages, assistantMessage] }
          : session
      ));
      
      toast({
        title: "Response received",
        description: `Successfully processed your ${currentMode} request.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (mode: ChatMode) => {
    setCurrentMode(mode);
    setCurrentChatId(null); // Clear current chat when switching modes
    toast({
      title: "Mode changed",
      description: `Switched to ${mode} mode.`,
    });
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    toast({
      title: "New chat",
      description: "Started a new conversation.",
    });
  };

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
    const selectedChat = chatSessions.find(chat => chat.id === chatId);
    if (selectedChat && selectedChat.mode !== currentMode) {
      setCurrentMode(selectedChat.mode);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
    toast({
      title: "Chat deleted",
      description: "Chat has been removed.",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-background">
        <AppSidebar
          currentMode={currentMode}
          currentChatId={currentChatId}
          chatSessions={chatSessions}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />
        
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header with mode selector */}
          <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="h-12 flex items-center px-4">
              <SidebarTrigger className="mr-4" />
              <ModeSelector
                currentMode={currentMode}
                onModeChange={handleModeChange}
                onSettingsClick={() => setShowSettings(true)}
              />
            </div>
          </div>
          
          <ChatContainer
            messages={messages}
            isLoading={isLoading}
          />
          
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
          
          <SettingsPanel
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};