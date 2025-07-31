import { useState } from "react";
import { ChatContainer } from "./ChatContainer";
import { ChatInput } from "./ChatInput";
import { ModeSelector, ChatMode } from "./ModeSelector";
import { SettingsPanel } from "./SettingsPanel";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMode, setCurrentMode] = useState<ChatMode>("database");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

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

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await simulateResponse(content, currentMode);
      
      const assistantMessage: Message = {
        id: generateId(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
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
    toast({
      title: "Mode changed",
      description: `Switched to ${mode} mode.`,
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-background">
      <ModeSelector
        currentMode={currentMode}
        onModeChange={handleModeChange}
        onSettingsClick={() => setShowSettings(true)}
      />
      
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
    </div>
  );
};