"use client"

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Copy, Trash2, History } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function CoverLetterPage() {
  const [formData, setFormData] = useState({
    name: '', jobTitle: '', company: '', skills: '', experience: '', achievement: '', whyCompany: '',
    tone: 'Professional & Formal', length: 'Medium (4 para)', language: 'English'
  });
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/cover-letter/history');
      setHistory(data);
    } catch (e) {}
  };

  const handleGenerate = async () => {
    if (!formData.name || !formData.jobTitle || !formData.company) {
      toast.error('Please fill in Name, Job Title, and Company');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/cover-letter/generate', formData);
      setGenerated(data.content);
      toast.success('Cover Letter generated!');
      fetchHistory();
    } catch (error) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
        <main className="app-container p-4 sm:p-6 xl:p-10 space-y-8 text-foreground">
          <div className="rounded-lg border border-border/70 bg-card/65 p-6 sm:p-8 shadow-2xl shadow-black/20">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">Cover Letter</p>
            <h1 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight">AI Cover Letter Generator</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground text-sm sm:text-base">Draft a tailored letter from role details, company context, and your strongest achievement.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6">
            <Card className="bg-card/80 border-border/70 rounded-lg shadow-2xl h-fit">
              <CardHeader><CardTitle className="text-2xl font-black">Letter Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Your Name</Label>
                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-11 bg-muted/70 border-border rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} className="h-11 bg-muted/70 border-border rounded-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="h-11 bg-muted/70 border-border rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <Select onValueChange={v => setFormData({...formData, tone: v})} defaultValue={formData.tone}>
                      <SelectTrigger className="h-11 bg-muted/70 border-border rounded-lg"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Professional & Formal">Professional & Formal</SelectItem>
                        <SelectItem value="Friendly & Warm">Friendly & Warm</SelectItem>
                        <SelectItem value="Bold & Confident">Bold & Confident</SelectItem>
                        <SelectItem value="Startup Energy">Startup Energy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Top Achievement</Label>
                  <Input value={formData.achievement} onChange={e => setFormData({...formData, achievement: e.target.value})} className="h-11 bg-muted/70 border-border rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label>Why this company?</Label>
                  <Textarea rows={5} value={formData.whyCompany} onChange={e => setFormData({...formData, whyCompany: e.target.value})} className="min-h-[150px] bg-muted/70 border-border rounded-lg resize-none p-4" />
                </div>
                <Button onClick={handleGenerate} disabled={loading} className="w-full grad-primary border-none gap-2 h-14 rounded-lg font-black uppercase tracking-[0.14em] shadow-lg shadow-primary/20">
                  {loading ? 'Writing...' : <><Sparkles className="w-4 h-4" /> Generate Cover Letter</>}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-card/80 border-border/70 rounded-lg min-h-[620px] flex flex-col shadow-2xl overflow-hidden">
                <CardHeader className="flex flex-row justify-between items-center border-b border-border bg-muted/20">
                  <CardTitle className="text-sm font-black uppercase tracking-widest opacity-70">AI Generated Content</CardTitle>
                  {generated && (
                    <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(generated); toast.success('Copied!'); }} className="h-8 border-primary/30 text-primary">
                      <Copy className="w-3 h-3 mr-2" /> Copy
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-auto">
                  {generated ? (
                    <div className="p-8 sm:p-10 whitespace-pre-wrap text-base leading-8 font-serif text-foreground/90">
                      {generated}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 p-12 text-center">
                      <Sparkles className="w-16 h-16 mb-6 opacity-20" />
                      <p className="max-w-[200px]">Fill in the details to see your high-converting cover letter here</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {history.length > 0 && (
                <Card className="bg-card/80 border-border/70 rounded-lg shadow-sm">
                  <CardHeader className="pb-3"><CardTitle className="text-xs font-black uppercase tracking-[2px] flex items-center gap-2 opacity-50"><History className="w-3 h-3" /> Recent History</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {history.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg group cursor-pointer hover:bg-muted/50 border border-transparent hover:border-border transition-all" onClick={() => setGenerated(item.content)}>
                        <div>
                          <p className="text-sm font-bold">{item.jobTitle} @ {item.company}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black">{item.tone}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); api.delete(`/cover-letter/${item.id}`).then(fetchHistory); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
    </AppShell>
  );
}
