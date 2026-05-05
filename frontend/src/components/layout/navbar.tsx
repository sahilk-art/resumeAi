"use client"

import { useAIStore } from '@/lib/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sparkles, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const providers = [
  { id: 'gemini', name: 'Gemini 1.5 Flash', color: 'bg-blue-500' },
  { id: 'openai', name: 'GPT-4o', color: 'bg-green-500' },
  { id: 'groq', name: 'LLaMA3 (Groq)', color: 'bg-orange-500' },
] as const;

export function Navbar() {
  const { activeProvider, setProvider } = useAIStore();
  const current = providers.find(p => p.id === activeProvider);

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-end px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground font-medium">AI Engine:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full border border-border hover:bg-muted/80 transition-colors focus:outline-none">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", current?.color)} />
              <span className="text-sm font-semibold">{current?.name}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            {providers.map((p) => (
              <DropdownMenuItem
                key={p.id}
                onClick={() => setProvider(p.id)}
                className="flex items-center gap-2 cursor-pointer focus:bg-primary/10 focus:text-white"
              >
                <div className={cn("w-2 h-2 rounded-full", p.color)} />
                {p.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
      </div>
    </header>
  );
}
