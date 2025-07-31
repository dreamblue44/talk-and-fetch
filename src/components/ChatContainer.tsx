import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatContainerProps {
  messages: Message[];
  isLoading?: boolean;
}

export const ChatContainer = ({ messages, isLoading }: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-background">
      <div className="container mx-auto max-w-4xl">
        {messages.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto animate-float">
                <div className="w-8 h-8 bg-primary-foreground rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Welcome to AI Assistant
              </h3>
              <p className="text-muted-foreground max-w-md">
                Choose a mode and start chatting. I can help you with database queries, 
                web searches, or sending emails.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            
            {isLoading && (
              <div className="flex gap-3 p-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
                </div>
                <div className="bg-chat-assistant text-chat-assistant-foreground rounded-2xl px-4 py-3 border border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};