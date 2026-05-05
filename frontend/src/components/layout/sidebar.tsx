"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, BarChart3, Lightbulb, FileEdit, CheckCircle2, LogOut, PenTool, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: BarChart3, label: 'Analyzer', href: '/analyzer' },
  { icon: Lightbulb, label: 'Suggestions', href: '/suggestions' },
  { icon: FileEdit, label: 'Cover Letter', href: '/cover-letter' },
  { icon: PenTool, label: 'Rewriter', href: '/rewriter' },
  { icon: CheckCircle2, label: 'ATS Checker', href: '/ats-checker' },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="w-64 h-screen bg-card border-r border-border/50 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl grad-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">RESUME AI</h1>
        </Link>
      </div>

      <div className="px-6 mb-4">
        <Link href="/builder/new">
          <button className="w-full grad-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
            <PlusCircle className="w-5 h-5" /> Create New
          </button>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 py-4">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[2px] px-4 mb-4 opacity-50">Main Menu</p>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {pathname === item.href && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
              />
            )}
            <item.icon className={cn("w-5 h-5 transition-colors", pathname === item.href ? "text-primary" : "group-hover:text-foreground")} />
            <span className="font-bold text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-border/50">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 font-bold text-sm group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

import { Sparkles } from 'lucide-react';
