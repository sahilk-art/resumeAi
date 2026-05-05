"use client"

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { FileText, Award, Target, Briefcase, Plus, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [resumes, setResumes] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, avgScore: 0, coverLetters: 0, atsPass: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resumesRes, historyRes] = await Promise.all([
          api.get('/resumes'),
          api.get('/analyzer/history'),
        ]);
        setResumes(resumesRes.data);

        const total = resumesRes.data.length;
        const scores = resumesRes.data.filter((r: any) => r.lastScore).map((r: any) => r.lastScore);
        const avgScore = scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;

        setStats({
          total,
          avgScore,
          coverLetters: 0,
          atsPass: scores.filter((s: number) => s >= 80).length
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your career platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={FileText} label="Total Resumes" value={stats.total} color="text-primary" />
            <StatCard icon={Award} label="Avg Score" value={`${stats.avgScore}%`} color="text-accent" />
            <StatCard icon={Briefcase} label="Cover Letters" value={stats.coverLetters} color="text-secondary" />
            <TargetCard value={`${stats.atsPass}`} label="ATS Ready" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Recent Resumes</h2>
                <Link href="/builder/new">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" /> New Resume
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                  Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)
                ) : resumes.length > 0 ? (
                  resumes.map((resume) => (
                    <ResumeCard key={resume.id} resume={resume} />
                  ))
                ) : (
                  <Card className="col-span-2 flex flex-col items-center justify-center p-12 bg-muted/50 border-dashed border-2">
                    <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No resumes yet. Start building one!</p>
                  </Card>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold">Quick Actions</h2>
              <div className="space-y-3">
                <QuickActionLink
                  href="/analyzer"
                  icon={Search}
                  title="Analyze Resume"
                  desc="Get instant AI feedback"
                  color="bg-primary"
                />
                <QuickActionLink
                  href="/cover-letter"
                  icon={FileText}
                  title="Generate Cover Letter"
                  desc="Personalized for any job"
                  color="bg-secondary"
                />
                <QuickActionLink
                  href="/ats-checker"
                  icon={Target}
                  title="ATS Check"
                  desc="Match against job description"
                  color="bg-accent"
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
    <Card className="bg-card border-border shadow-sm">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={cn("p-3 rounded-xl bg-muted", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TargetCard({ value, label }: any) {
  return (
    <Card className="bg-primary text-white overflow-hidden relative border-none shadow-lg shadow-primary/20">
      <CardContent className="p-6">
        <div className="relative z-10">
          <p className="text-primary-foreground/80 text-sm font-medium">{label}</p>
          <p className="text-3xl font-black mt-1">{value}</p>
          <p className="text-primary-foreground/60 text-xs mt-2">Resumes scoring 80+</p>
        </div>
        <Target className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
      </CardContent>
    </Card>
  );
}

function ResumeCard({ resume }: any) {
  return (
    <Card className="group hover:border-primary transition-all cursor-pointer bg-card">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
            {resume.title}
          </CardTitle>
          {resume.lastScore && (
            <div className={cn(
              "px-2 py-1 rounded text-xs font-bold",
              resume.lastScore >= 80 ? "bg-accent/20 text-accent" :
              resume.lastScore >= 60 ? "bg-primary/20 text-primary" : "bg-warning/20 text-warning"
            )}>
              {resume.lastScore}%
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">Updated {new Date(resume.updatedAt).toLocaleDateString()}</p>
        <div className="mt-4 flex gap-2">
          <Link href={`/builder/${resume.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full text-xs">Edit</Button>
          </Link>
          <Link href="/analyzer" className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs">Analyze</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionLink({ href, icon: Icon, title, desc, color }: any) {
  return (
    <Link href={href}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer group bg-card">
        <CardContent className="p-4 flex items-center gap-4">
          <div className={cn("p-2 rounded-lg text-white", color)}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{title}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
        </CardContent>
      </Card>
    </Link>
  );
}
