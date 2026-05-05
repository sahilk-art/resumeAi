"use client"

import { Bell, User } from 'lucide-react';

export function Navbar() {
  return (
    <header className="h-16 border-b border-border/50 bg-background/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      <div />

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
