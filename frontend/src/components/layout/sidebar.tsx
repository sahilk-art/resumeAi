"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart3, Lightbulb, FileEdit, CheckCircle2, LogOut, PenTool, PlusCircle, Sparkles, X } from 'lucide-react';
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

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="w-64 h-full bg-card border-r border-border/50 flex flex-col">
      <div className="p-8">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl grad-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">RESUME AI</h1>
        </Link>
      </div>

      <div className="px-6 mb-4">
        <Link href="/builder/new" onClick={onNavigate}>
          <button className="w-full grad-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
            <PlusCircle className="w-5 h-5" /> Create New
          </button>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 py-4 overflow-y-auto">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[2px] px-4 mb-4 opacity-50">Main Menu</p>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
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

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 h-screen fixed left-0 top-0 z-50">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
        aria-label="Close menu backdrop"
      />

      <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] shadow-2xl">
        <div className="h-16 px-4 flex items-center justify-end border-b border-border/50 bg-card">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent onNavigate={onClose} />
      </div>
    </div>
  );
}
