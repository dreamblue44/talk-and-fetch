import { Button } from "@/components/ui/button";
import { Database, Globe, Mail, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChatMode = "database" | "web" | "email";

interface ModeSelectorProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  onSettingsClick: () => void;
}

export const ModeSelector = ({ currentMode, onModeChange, onSettingsClick }: ModeSelectorProps) => {
  const modes = [
    {
      id: "database" as ChatMode,
      label: "Database",
      icon: Database,
      description: "Search client database"
    },
    {
      id: "web" as ChatMode,
      label: "Web Search",
      icon: Globe,
      description: "Search the internet"
    },
    {
      id: "email" as ChatMode,
      label: "Email",
      icon: Mail,
      description: "Send emails"
    }
  ];

  return (
    <div className="flex items-center justify-between flex-1">
      <div className="flex gap-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          
          return (
            <Button
              key={mode.id}
              variant={isActive ? "default" : "outline"}
              onClick={() => onModeChange(mode.id)}
              className={cn(
                "transition-all duration-200 h-9",
                isActive 
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md" 
                  : "hover:bg-muted border-border"
              )}
              size="sm"
            >
              <Icon className="w-4 h-4 mr-2" />
              {mode.label}
            </Button>
          );
        })}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onSettingsClick}
        className="hover:bg-muted border-border transition-all duration-200"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
};