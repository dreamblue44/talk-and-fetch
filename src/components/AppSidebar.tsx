import { useState } from "react";
import { Plus, Database, Globe, Mail, MessageSquare, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatMode } from "./ModeSelector";

interface ChatSession {
  id: string;
  name: string;
  mode: ChatMode;
  createdAt: Date;
  lastMessage?: string;
}

interface AppSidebarProps {
  currentMode: ChatMode;
  currentChatId: string | null;
  chatSessions: ChatSession[];
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export function AppSidebar({
  currentMode,
  currentChatId,
  chatSessions,
  onChatSelect,
  onNewChat,
  onDeleteChat,
}: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const currentModeSessions = chatSessions.filter(session => session.mode === currentMode);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <Sidebar
      className="border-r border-border bg-background"
      collapsible="icon"
    >
      <SidebarContent className="bg-background">
        {/* New Chat Button */}
        <div className="p-3 border-b border-border">
          <Button
            onClick={onNewChat}
            className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            {!collapsed && "New Chat"}
          </Button>
        </div>

        {/* Chat Sessions */}
        <SidebarGroup className="flex-1 overflow-hidden">
          <SidebarGroupLabel className={cn("px-3 text-muted-foreground font-medium", collapsed && "sr-only")}>
            Recent Chats
          </SidebarGroupLabel>
          
          <SidebarGroupContent className="overflow-y-auto">
            <SidebarMenu>
              {currentModeSessions.length === 0 ? (
                !collapsed && (
                  <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                    No chats yet. Start a new conversation!
                  </div>
                )
              ) : (
                currentModeSessions.map((session) => (
                  <SidebarMenuItem key={session.id}>
                    <SidebarMenuButton asChild>
                      <div
                        className={cn(
                          "flex items-center gap-2 w-full p-2 rounded-md cursor-pointer group hover:bg-muted transition-colors",
                          currentChatId === session.id && "bg-muted"
                        )}
                        onClick={() => onChatSelect(session.id)}
                      >
                        <MessageSquare className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <div className="flex-1 overflow-hidden">
                              <div className="text-sm font-medium truncate">
                                {truncateText(session.name, 20)}
                              </div>
                              {session.lastMessage && (
                                <div className="text-xs text-muted-foreground truncate">
                                  {truncateText(session.lastMessage, 30)}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteChat(session.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}