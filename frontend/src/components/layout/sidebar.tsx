"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, BarChart3, Lightbulb, FileEdit, CheckCircle2, Settings, LogOut, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'My Resumes', href: '/builder/new' },
  { icon: BarChart3, label: 'Analyzer', href: '/analyzer' },
  { icon: Lightbulb, label: 'Suggestions', href: '/suggestions' },
  { icon: FileEdit, label: 'Cover Letter', href: '/cover-letter' },
  { icon: PenTool, label: 'Bullet Rewriter', href: '/rewriter' },
  { icon: CheckCircle2, label: 'ATS Checker', href: '/ats-checker' },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6">
        <h1 className="text-2xl font-black text-primary tracking-tighter">RESUME AI</h1>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group",
              pathname === item.href
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted hover:text-white"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
