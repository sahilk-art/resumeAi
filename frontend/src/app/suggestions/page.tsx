"use client"

import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Lightbulb, TrendingUp, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function SuggestionsPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleGetSuggestions = async () => {
    if (!resumeText || !jobTitle) {
      toast.error('Please provide resume text and job title');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/suggestions', { resumeText, jobTitle });
      setData(data);
      toast.success('Suggestions generated!');
    } catch (error) {
      toast.error('Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
        <main className="app-container p-4 sm:p-6 xl:p-10 space-y-8">
          <div className="rounded-lg border border-border/70 bg-card/65 p-6 sm:p-8 shadow-2xl shadow-black/20">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">Suggestions</p>
            <h1 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight">AI Suggestions</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground text-sm sm:text-base">Turn a raw resume into targeted improvements for the role you want.</p>
          </div>

          {!data ? (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
              <Card className="bg-card/80 border-border/70 rounded-lg shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-black">Personalized Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label>Target Job Title</Label>
                    <Input
                      placeholder="e.g. Frontend Developer"
                      value={jobTitle}
                      onChange={e => setJobTitle(e.target.value)}
                      className="h-12 bg-muted/70 border-border rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Resume Content</Label>
                    <Textarea
                      rows={14}
                      placeholder="Paste your resume here..."
                      value={resumeText}
                      onChange={e => setResumeText(e.target.value)}
                      className="min-h-[390px] bg-muted/70 border-border rounded-lg resize-none p-5"
                    />
                  </div>
                  <Button onClick={handleGetSuggestions} disabled={loading} className="w-full grad-primary border-none h-14 gap-2 rounded-lg font-black uppercase tracking-[0.14em] shadow-lg shadow-primary/20">
                    {loading ? 'Thinking...' : <><Sparkles className="w-4 h-4" /> Get Suggestions</>}
                  </Button>
                </CardContent>
              </Card>
              <div className="grid gap-5 content-start">
                <Card className="bg-card/80 border-border/70 rounded-lg shadow-xl">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center mb-5">
                      <Lightbulb className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-black">Role Fit Snapshot</h2>
                    <p className="mt-2 text-sm text-muted-foreground">The suggestions engine reads the role title, resume language, missing skills, and weak achievement phrasing.</p>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-5">
                  <Card className="bg-card/80 border-border/70 rounded-lg">
                    <CardContent className="p-5">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-black">Resume</p>
                      <p className="mt-2 text-3xl font-black">{resumeText.trim().length.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/80 border-border/70 rounded-lg">
                    <CardContent className="p-5">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-black">Role</p>
                      <p className="mt-2 text-3xl font-black">{jobTitle.trim() ? '1' : '0'}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <Button variant="outline" onClick={() => setData(null)} className="border-border hover:bg-muted">← Back</Button>
                <div className="flex items-center gap-4 flex-wrap">
                   <div className="bg-accent/10 border border-accent/20 px-4 py-2 rounded-full flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      <span className="text-sm font-bold text-accent">Potential Score: +{data.suggestions.reduce((a:any, b:any) => a + b.impact, 0)} pts</span>
                   </div>
                   <div className="bg-muted border border-border px-4 py-2 rounded-full text-xs font-bold">
                     Analyzed by {data.aiProvider}
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {data.suggestions.map((s: any, i: number) => (
                  <Card key={i} className={cn(
                    "bg-card/80 rounded-lg border-l-4 overflow-hidden group hover:shadow-lg transition-all",
                    s.priority === 'High' ? 'border-l-destructive' : s.priority === 'Medium' ? 'border-l-warning' : 'border-l-primary'
                  )}>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-muted-foreground font-black text-[10px] uppercase tracking-widest">
                          <Zap className={cn("w-3 h-3", s.priority === 'High' ? 'text-destructive' : 'text-warning')} />
                          {s.category}
                        </div>
                        <div className="bg-muted px-2 py-1 rounded text-[10px] font-bold">+{s.impact} PTS</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{s.problem}</h3>
                        <p className="text-sm text-muted-foreground">{s.solution}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg border border-border italic text-xs text-accent">
                        &quot;{s.example}&quot;
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <Card className="bg-card border-border shadow-sm">
                    <CardHeader><CardTitle className="text-sm flex items-center gap-2 font-bold"><Lightbulb className="w-4 h-4 text-primary" /> Recommended Skills</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {data.recommendedSkills.map((skill: string) => (
                        <span key={skill} className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase border border-primary/20">{skill}</span>
                      ))}
                    </CardContent>
                 </Card>
                 <Card className="bg-card border-border shadow-sm">
                    <CardHeader><CardTitle className="text-sm flex items-center gap-2 font-bold"><CheckCircle2 className="w-4 h-4 text-accent" /> Power Verbs</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {data.powerVerbs.map((verb: string) => (
                        <span key={verb} className="px-2 py-1 bg-accent/10 text-accent text-[10px] font-bold rounded uppercase border border-accent/20">{verb}</span>
                      ))}
                    </CardContent>
                 </Card>
                 <Card className="bg-card border-border shadow-sm">
                    <CardHeader><CardTitle className="text-sm flex items-center gap-2 font-bold"><AlertCircle className="w-4 h-4 text-destructive" /> Missing Keywords</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {data.missingKeywords.map((word: string) => (
                        <span key={word} className="px-2 py-1 bg-destructive/10 text-destructive text-[10px] font-bold rounded uppercase border border-destructive/20">{word}</span>
                      ))}
                    </CardContent>
                 </Card>
              </div>
            </div>
          )}
        </main>
    </AppShell>
  );
}
