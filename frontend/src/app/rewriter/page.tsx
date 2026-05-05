"use client"

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
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
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Navbar />
        <main className="p-8 max-w-5xl mx-auto w-full space-y-8 text-foreground">
          <div>
            <h1 className="text-3xl font-bold">Smart Bullet Rewriter</h1>
            <p className="text-muted-foreground mt-1">Transform weak bullet points into high-impact professional achievements.</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <Card className="bg-card border-border shadow-md">
              <CardHeader><CardTitle>Achievment Rewriter</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Job Title (Optional)</Label>
                  <Input
                    placeholder="e.g. Project Manager"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    className="bg-muted border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Original Bullet Point</Label>
                  <Textarea
                    rows={3}
                    placeholder="e.g. Responsible for managing a team of 10 people"
                    value={bullet}
                    onChange={e => setBullet(e.target.value)}
                    className="bg-muted border-border"
                  />
                </div>
                <Button onClick={handleRewrite} disabled={loading || !bullet} className="w-full bg-primary h-12 gap-2 hover:bg-primary/90 text-lg">
                  {loading ? 'Rewriting Achievement...' : <><Sparkles className="w-5 h-5" /> Rewrite with AI</>}
                </Button>
              </CardContent>
            </Card>

            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in duration-300">
                <Card className="bg-muted/20 border-border">
                  <CardHeader><CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest">Original Draft</CardTitle></CardHeader>
                  <CardContent><p className="text-sm opacity-70 italic">&quot;{result.original}&quot;</p></CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20 relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 p-3">
                    <div className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <TrendingUp className="w-3 h-3" /> +{result.scoreImpact} IMPACT
                    </div>
                  </div>
                  <CardHeader><CardTitle className="text-xs font-black text-primary uppercase tracking-widest">AI Polished Achievement</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-lg font-bold leading-relaxed text-foreground">{result.rewritten}</p>
                    <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-all gap-2" onClick={() => { navigator.clipboard.writeText(result.rewritten); toast.success('Copied to clipboard!'); }}>
                      <CheckCircle2 className="w-4 h-4" /> Copy Polished Version
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
