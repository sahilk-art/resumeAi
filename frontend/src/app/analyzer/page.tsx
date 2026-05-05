"use client"

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Upload, FileText, CheckCircle2, AlertCircle, Sparkles, ShieldCheck, FileUp } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/analyzer/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumeText(data.text);
      toast.success('Resume parsed successfully!');
    } catch (error) {
      toast.error('Failed to parse PDF');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText || !jobTitle) {
      toast.error('Please provide resume text and job title');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/analyzer/analyze', {
        resumeText,
        jobTitle,
        jobDescription
      });
      setAnalysis(data);
      toast.success('Deep Analysis complete!');
    } catch (error) {
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Navbar />
        <main className="p-10 max-w-7xl mx-auto w-full space-y-10">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-4xl font-black italic tracking-tight">Resume Scanner</h1>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-[3px] opacity-70">Deep ATS & Content Analysis</p>
            </div>
            {analysis && (
              <Button variant="outline" onClick={() => setAnalysis(null)} className="rounded-xl border-border/50 font-bold">
                 Scan Another
              </Button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!analysis ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">1. Resume Content</Label>
                    <div className="relative">
                       <input type="file" id="resume-up" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                       <label htmlFor="resume-up">
                          <div className={cn(
                            "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary cursor-pointer hover:underline transition-all",
                            uploading && "animate-pulse pointer-events-none"
                          )}>
                             <FileUp className="w-3.5 h-3.5" />
                             {uploading ? 'Extracting...' : 'Upload PDF'}
                          </div>
                       </label>
                    </div>
                  </div>
                  <Card className="bg-card border-border/50 shadow-2xl rounded-3xl overflow-hidden">
                    <Textarea
                      rows={20}
                      placeholder="Paste your resume text here, or upload a PDF above..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className="bg-transparent border-none p-8 resize-none leading-relaxed text-sm focus-visible:ring-0"
                    />
                  </Card>
                </div>

                <div className="space-y-6">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">2. Target Role Details</Label>
                  <Card className="bg-card border-border/50 shadow-2xl rounded-3xl p-8 space-y-8">
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Target Job Title</Label>
                      <Input
                        placeholder="e.g. Senior Product Manager"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="h-12 bg-muted/30 border-border rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Job Description (Optional)</Label>
                      <Textarea
                        rows={10}
                        placeholder="Paste the target JD here for a more precise match..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="bg-muted/30 border-border rounded-xl resize-none p-4"
                      />
                    </div>
                    <Button onClick={handleAnalyze} disabled={loading} className="w-full h-14 grad-primary border-none shadow-2xl shadow-primary/20 text-lg font-black uppercase tracking-widest rounded-2xl gap-3 active:scale-[0.98] transition-all">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Analyzing Deeply...
                        </>
                      ) : (
                        <><ShieldCheck className="w-6 h-6" /> Start AI Analysis</>
                      )}
                    </Button>
                  </Card>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <Card className="bg-card border-border/50 lg:col-span-1 shadow-2xl rounded-3xl flex flex-col items-center justify-center p-12 relative overflow-hidden group">
                    <div className="absolute inset-0 grad-primary opacity-[0.03] group-hover:opacity-[0.07] transition-opacity" />
                    <div className="relative z-10 text-center">
                       <p className="text-[10px] font-black uppercase tracking-[4px] text-muted-foreground mb-4">ATS Compatibility</p>
                       <div className={cn(
                          "text-9xl font-black tracking-tighter mb-4",
                          resultColor(analysis.totalScore)
                       )}>
                          {analysis.totalScore}
                       </div>
                       <div className="inline-flex items-center gap-2 bg-muted px-4 py-1.5 rounded-full border border-border">
                          <div className={cn("w-2 h-2 rounded-full", analysis.totalScore >= 70 ? 'bg-accent animate-pulse' : 'bg-destructive')} />
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                             {analysis.totalScore >= 80 ? 'Excellent Match' : analysis.totalScore >= 60 ? 'Good Potential' : 'Needs Improvement'}
                          </span>
                       </div>
                    </div>
                  </Card>

                  <Card className="bg-card border-border/50 lg:col-span-2 shadow-2xl rounded-3xl p-10 flex flex-col justify-center border-l-4 border-l-primary">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 rounded-xl grad-primary flex items-center justify-center shadow-lg shadow-primary/20">
                          <Sparkles className="w-5 h-5 text-white" />
                       </div>
                       <h3 className="text-xl font-black italic">AI Assessment</h3>
                    </div>
                    <p className="text-xl leading-relaxed text-muted-foreground italic font-medium">
                       &quot;{analysis.summary}&quot;
                    </p>
                    <div className="mt-8 flex items-center gap-4 border-t border-border/50 pt-6">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[8px] font-black uppercase tracking-widest">{analysis.aiProvider[0]}</div>)}
                       </div>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Validated by multiple AI models</p>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="text-xl font-black flex items-center gap-3 px-2">
                       <AlertCircle className="w-5 h-5 text-destructive" /> Critical Issues
                    </h3>
                    <div className="space-y-4">
                      {analysis.issues.map((issue: any, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex gap-4 p-5 bg-destructive/5 border border-destructive/10 rounded-2xl hover:bg-destructive/10 transition-colors"
                        >
                          <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0 shadow-lg",
                            issue.type === 'error' ? 'bg-destructive shadow-destructive/50' : 'bg-warning shadow-warning/50'
                          )} />
                          <p className="text-sm font-medium leading-relaxed">{issue.message}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-black flex items-center gap-3 px-2">
                       <CheckCircle2 className="w-5 h-5 text-accent" /> Key Strengths
                    </h3>
                    <div className="space-y-4">
                      {analysis.strengths.map((strength: string, i: number) => (
                        <motion.div
                           key={i}
                           initial={{ opacity: 0, x: 10 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.05 }}
                           className="flex gap-4 p-5 bg-accent/5 border border-accent/10 rounded-2xl hover:bg-accent/10 transition-colors"
                        >
                          <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                          <p className="text-sm font-medium leading-relaxed">{strength}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function resultColor(score: number) {
  if (score >= 80) return 'text-accent';
  if (score >= 60) return 'text-primary';
  if (score >= 40) return 'text-warning';
  return 'text-destructive';
}
