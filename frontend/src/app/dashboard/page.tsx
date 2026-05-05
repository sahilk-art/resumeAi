"use client"

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { FileText, Award, Target, Briefcase, Plus, Search, ArrowUpRight, Clock, Trash2, Edit3, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [resumes, setResumes] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, avgScore: 0, coverLetters: 0, atsPass: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [resumesRes, historyRes, clRes] = await Promise.all([
        api.get('/resumes'),
        api.get('/analyzer/history'),
        api.get('/cover-letter/history'),
      ]);
      setResumes(resumesRes.data);

      const total = resumesRes.data.length;
      const scores = resumesRes.data.filter((r: any) => r.lastScore).map((r: any) => r.lastScore);
      const avgScore = scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;

      setStats({
        total,
        avgScore,
        coverLetters: clRes.data.length,
        atsPass: scores.filter((s: number) => s >= 80).length
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteResume = async (id: string) => {
    if (confirm('Delete this resume?')) {
      await api.delete(`/resumes/${id}`);
      fetchData();
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-10 space-y-10 max-w-7xl mx-auto">
          <div className="flex justify-between items-end">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-1"
            >
              <h1 className="text-4xl font-black tracking-tight italic">Welcome, {user?.name.split(' ')[0]}!</h1>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-[3px] opacity-70">Your Career Control Center</p>
            </motion.div>
            <div className="flex gap-4">
               <Link href="/analyzer">
                 <Button variant="outline" className="border-border/50 hover:bg-muted font-bold gap-2 rounded-xl">
                   <Search className="w-4 h-4" /> Quick Scan
                 </Button>
               </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={FileText} label="Total Resumes" value={stats.total} color="text-primary" />
            <StatCard icon={Award} label="Avg Score" value={`${stats.avgScore}%`} color="text-accent" />
            <StatCard icon={Briefcase} label="Cover Letters" value={stats.coverLetters} color="text-secondary" />
            <TargetCard value={`${stats.atsPass}`} label="ATS Ready" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" /> Recent Activity
                </h2>
                <Link href="/builder/new" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  View All Resumes <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl bg-card border-border" />)
                ) : resumes.length > 0 ? (
                  resumes.map((resume, idx) => (
                    <ResumeCard key={resume.id} resume={resume} delay={idx * 0.1} onDelete={() => deleteResume(resume.id)} />
                  ))
                ) : (
                  <Card className="col-span-2 flex flex-col items-center justify-center p-16 bg-muted/20 border-dashed border-2 border-border/50 rounded-3xl">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
                       <Plus className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-bold text-lg mb-2">No resumes found</p>
                    <p className="text-muted-foreground/60 text-sm mb-8 text-center max-w-xs">Start your journey by creating your first professional AI-powered resume.</p>
                    <Link href="/builder/new">
                      <Button className="grad-primary border-none font-bold px-8 rounded-xl shadow-xl shadow-primary/20">Build My First Resume</Button>
                    </Link>
                  </Card>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-black flex items-center gap-3">
                <Target className="w-5 h-5 text-secondary" /> AI Tools
              </h2>
              <div className="space-y-4">
                <QuickActionLink
                  href="/analyzer"
                  icon={Search}
                  title="Resume Scanner"
                  desc="Instant scoring and full keyword analysis."
                  color="bg-blue-500"
                />
                <QuickActionLink
                  href="/cover-letter"
                  icon={FileText}
                  title="Cover Letter Pro"
                  desc="Generate matching letters for any job."
                  color="bg-pink-500"
                />
                <QuickActionLink
                  href="/rewriter"
                  icon={Edit3}
                  title="Bullet Polisher"
                  desc="Transform weak points into achievements."
                  color="bg-purple-500"
                />
                <QuickActionLink
                  href="/ats-checker"
                  icon={Target}
                  title="ATS Matcher"
                  desc="Compare against actual job descriptions."
                  color="bg-emerald-500"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-card border-border/50 shadow-xl shadow-black/10 hover:border-primary/20 transition-all rounded-2xl overflow-hidden group">
        <CardContent className="p-7 flex items-center gap-5">
          <div className={cn("p-4 rounded-2xl bg-muted/50 group-hover:scale-110 transition-transform duration-300", color)}>
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black tracking-tighter">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TargetCard({ value, label }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="grad-primary text-white overflow-hidden relative border-none shadow-2xl shadow-primary/30 rounded-2xl">
        <CardContent className="p-7">
          <div className="relative z-10">
            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
            <p className="text-4xl font-black tracking-tighter">{value}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter">
               High ATS Compatibility
            </div>
          </div>
          <Target className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10 rotate-12" />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ResumeCard({ resume, delay, onDelete }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer bg-card border-border/50 rounded-2xl overflow-hidden shadow-xl shadow-black/5">
        <div className="h-2 grad-primary opacity-30 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="pb-4 pt-6 flex flex-row items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-black group-hover:text-primary transition-colors tracking-tight line-clamp-1">
              {resume.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground opacity-60">
              <Clock className="w-3 h-3" /> Updated {new Date(resume.updatedAt).toLocaleDateString()}
            </div>
          </div>
          <DropdownMenu>
             <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted"><MoreVertical className="w-4 h-4" /></Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="bg-card border-border w-32">
                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={onDelete}>Delete</DropdownMenuItem>
             </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
               </div>
               <span className="text-xs font-bold capitalize opacity-80">{resume.template} Template</span>
            </div>
            {resume.lastScore && (
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-black shadow-lg",
                resume.lastScore >= 80 ? "bg-accent/10 text-accent" :
                resume.lastScore >= 60 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
              )}>
                {resume.lastScore}%
              </div>
            )}
          </div>
          <div className="mt-8 flex gap-3">
            <Link href={`/builder/${resume.id}`} className="flex-1">
              <Button size="sm" className="w-full text-xs font-black uppercase tracking-widest rounded-xl h-10 grad-primary border-none shadow-lg shadow-primary/10">Edit</Button>
            </Link>
            <Link href="/analyzer" className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-xs font-black uppercase tracking-widest rounded-xl h-10 border-border/50 hover:bg-muted">Score</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function QuickActionLink({ href, icon: Icon, title, desc, color }: any) {
  return (
    <Link href={href}>
      <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 400 }}>
        <Card className="hover:bg-muted/30 transition-all cursor-pointer group bg-card border-border/50 rounded-2xl overflow-hidden">
          <CardContent className="p-5 flex items-center gap-5">
            <div className={cn("p-3 rounded-xl text-white shadow-lg", color)}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-black text-sm tracking-tight">{title}</p>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 line-clamp-1">{desc}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
