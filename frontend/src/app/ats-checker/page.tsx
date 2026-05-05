"use client"

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Target, CheckCircle2, AlertCircle, Search, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AtsCheckerPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    if (!resumeText || !jobDescription) {
      toast.error('Both resume and job description are required');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/ats/check', { resumeText, jobDescription });
      setResult(data);
      toast.success('ATS Check complete!');
    } catch (error) {
      toast.error('ATS Check failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Navbar />
        <main className="p-8 max-w-7xl mx-auto w-full space-y-8 text-foreground">
          <div>
            <h1 className="text-3xl font-bold">ATS Keyword Matcher</h1>
            <p className="text-muted-foreground mt-1">See how well your resume matches a specific job description.</p>
          </div>

          {!result ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                   <Label className="text-lg font-bold">Your Resume</Label>
                </div>
                <Textarea rows={18} placeholder="Paste resume text here..." value={resumeText} onChange={e => setResumeText(e.target.value)} className="bg-muted border-border resize-none" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                   <Label className="text-lg font-bold">Job Description</Label>
                </div>
                <Textarea rows={14} placeholder="Paste job description here..." value={jobDescription} onChange={e => setJobDescription(e.target.value)} className="bg-muted border-border resize-none" />
                <Button onClick={handleCheck} disabled={loading} className="w-full bg-primary h-14 gap-2 text-xl hover:bg-primary/90 shadow-lg shadow-primary/20">
                  {loading ? 'Analyzing Compatibility...' : <><ShieldCheck className="w-6 h-6" /> Check ATS Match</>}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => setResult(null)} className="border-border hover:bg-muted">← Match Another</Button>
                <div className="bg-muted/50 border border-border px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest opacity-60">
                  Analyzed by Gemini AI
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="bg-card border-border flex flex-col items-center justify-center p-8 shadow-xl">
                  <div className={cn(
                    "text-7xl font-black mb-2",
                    result.matchPercentage >= 80 ? 'text-accent' : result.matchPercentage >= 60 ? 'text-primary' : 'text-destructive'
                  )}>
                    {result.matchPercentage}%
                  </div>
                  <p className="text-xs uppercase tracking-[3px] font-black opacity-50">Overall Match</p>
                </Card>

                <Card className="bg-card border-border lg:col-span-3 shadow-lg">
                  <CardHeader className="pb-2"><CardTitle className="text-xs font-black uppercase tracking-[2px] flex items-center gap-2 text-accent"><CheckCircle2 className="w-4 h-4" /> Keywords Found</CardTitle></CardHeader>
                  <CardContent className="flex flex-wrap gap-2 pt-2">
                    {result.matchedKeywords.map((kw: string) => (
                      <span key={kw} className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full border border-accent/20">{kw}</span>
                    ))}
                    {result.matchedKeywords.length === 0 && <p className="text-sm text-muted-foreground italic">No matching keywords found.</p>}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Card className="bg-card border-border shadow-md">
                    <CardHeader className="pb-2"><CardTitle className="text-xs font-black uppercase tracking-[2px] flex items-center gap-2 text-destructive"><AlertCircle className="w-4 h-4" /> Missing Keywords</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2 pt-2">
                      {result.missingKeywords.map((kw: string) => (
                        <span key={kw} className="px-3 py-1 bg-destructive/10 text-destructive text-xs font-bold rounded-full border border-destructive/20">{kw}</span>
                      ))}
                      {result.missingKeywords.length === 0 && <p className="text-sm text-accent italic">Excellent! No major keywords missing.</p>}
                    </CardContent>
                 </Card>

                 <Card className="bg-card border-border shadow-md">
                    <CardHeader className="pb-2"><CardTitle className="text-xs font-black uppercase tracking-[2px] flex items-center gap-2 text-primary"><Target className="w-4 h-4" /> Section Feedback</CardTitle></CardHeader>
                    <CardContent className="space-y-4 pt-2">
                      {result.sectionAnalysis.map((sec: any, i: number) => (
                        <div key={i} className="flex justify-between items-start border-b border-border/50 pb-3 last:border-0 last:pb-0">
                          <div className="max-w-[80%]">
                            <p className="font-bold text-sm mb-0.5">{sec.section}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{sec.feedback}</p>
                          </div>
                          <div className={cn("px-2 py-1 rounded text-[9px] font-black tracking-widest", sec.status === 'Good' ? 'bg-accent/20 text-accent' : 'bg-warning/20 text-warning')}>
                            {sec.status.toUpperCase()}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                 </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
