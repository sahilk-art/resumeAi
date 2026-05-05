"use client"

import { useAIStore } from '@/lib/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sparkles, ChevronDown, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const providers = [
  { id: 'gemini', name: 'Gemini 1.5 Flash', color: 'bg-blue-400' },
  { id: 'openai', name: 'GPT-4o', color: 'bg-emerald-400' },
  { id: 'groq', name: 'LLaMA3 (Groq)', color: 'bg-orange-400' },
] as const;

export function Navbar() {
  const { activeProvider, setProvider } = useAIStore();
  const current = providers.find(p => p.id === activeProvider);

  return (
    <header className="h-16 border-b border-border/50 bg-background/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-2">
         <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Engine</span>
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 bg-muted/50 px-4 py-1.5 rounded-full border border-border hover:bg-muted transition-all focus:outline-none group">
              <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse", current?.color)} />
              <span className="text-sm font-bold tracking-tight">{current?.name}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-card border-border w-48 p-1 rounded-xl shadow-2xl">
            {providers.map((p) => (
              <DropdownMenuItem
                key={p.id}
                onClick={() => setProvider(p.id)}
                className="flex items-center gap-3 cursor-pointer focus:bg-primary/10 focus:text-primary-foreground rounded-lg py-2"
              >
                <div className={cn("w-2 h-2 rounded-full", p.color)} />
                <span className="font-medium text-sm">{p.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="w-5 h-5" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-secondary rounded-full border-2 border-background" />
        </button>
        <div className="w-9 h-9 rounded-full grad-primary flex items-center justify-center border-2 border-white/10 shadow-lg cursor-pointer hover:scale-105 transition-transform">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    </header>
  );
}
