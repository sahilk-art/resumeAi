"use client"

import { Bell, User } from 'lucide-react';

type NavbarProps = {
  onMenuClick?: () => void;
};

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="h-16 border-b border-border/50 bg-background/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 transition-colors"
            aria-label="Open menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-foreground"
            >
              <path
                d="M4 7H20M4 12H20M4 17H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
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
