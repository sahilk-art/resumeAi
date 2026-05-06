"use client"

import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function RewriterPage() {
  const [bullet, setBullet] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRewrite = async () => {
    if (!bullet) return;
    setLoading(true);
    try {
      const { data } = await api.post('/rewriter/bullet', { bullet, jobTitle });
      setResult(data);
      toast.success('Bullet rewritten!');
    } catch (error) {
      toast.error('Rewrite failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
        <main className="app-container p-4 sm:p-6 xl:p-10 space-y-8 text-foreground">
          <div className="rounded-lg border border-border/70 bg-card/65 p-6 sm:p-8 shadow-2xl shadow-black/20">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">Rewriter</p>
            <h1 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight">Smart Bullet Rewriter</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground text-sm sm:text-base">Convert flat responsibilities into sharp, measurable resume achievements.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6">
            <Card className="bg-card/80 border-border/70 rounded-lg shadow-2xl h-fit">
              <CardHeader><CardTitle className="text-2xl font-black">Achievement Rewriter</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Target Job Title (Optional)</Label>
                  <Input
                    placeholder="e.g. Project Manager"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    className="h-12 bg-muted/70 border-border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Original Bullet Point</Label>
                  <Textarea
                    rows={8}
                    placeholder="e.g. Responsible for managing a team of 10 people"
                    value={bullet}
                    onChange={e => setBullet(e.target.value)}
                    className="min-h-[210px] bg-muted/70 border-border rounded-lg resize-none p-5"
                  />
                </div>
                <Button onClick={handleRewrite} disabled={loading || !bullet} className="w-full grad-primary border-none h-14 gap-2 rounded-lg font-black uppercase tracking-[0.14em] shadow-lg shadow-primary/20">
                  {loading ? 'Rewriting Achievement...' : <><Sparkles className="w-5 h-5" /> Rewrite with AI</>}
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-6 content-start">
              {result ? (
                <div className="grid grid-cols-1 gap-6 animate-in zoom-in duration-300">
                  <Card className="bg-card/80 border-border/70 rounded-lg">
                    <CardHeader><CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-[0.18em]">Original Draft</CardTitle></CardHeader>
                    <CardContent><p className="text-base opacity-80 italic leading-relaxed">&quot;{result.original}&quot;</p></CardContent>
                  </Card>
                  <Card className="bg-primary/5 border-primary/20 rounded-lg relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-4">
                      <div className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-md flex items-center gap-1 shadow-md">
                        <TrendingUp className="w-3 h-3" /> +{result.scoreImpact} IMPACT
                      </div>
                    </div>
                    <CardHeader><CardTitle className="text-xs font-black text-primary uppercase tracking-[0.18em]">AI Polished Achievement</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-2xl font-black leading-snug text-foreground">{result.rewritten}</p>
                      <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-all gap-2 rounded-lg h-11" onClick={() => { navigator.clipboard.writeText(result.rewritten); toast.success('Copied to clipboard!'); }}>
                        <CheckCircle2 className="w-4 h-4" /> Copy Polished Version
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="bg-card/80 border-border/70 rounded-lg shadow-xl min-h-[390px]">
                  <CardContent className="h-full p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="w-16 h-16 rounded-lg bg-muted/70 border border-border flex items-center justify-center">
                        <ArrowRight className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-foreground">Polished result appears here</h2>
                        <p className="mt-2 max-w-lg text-sm leading-relaxed">Add one bullet point and the rewritten version will show as a stronger, metric-focused achievement.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
    </AppShell>
  );
}
