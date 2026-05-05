"use client"

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Upload, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

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
      toast.success('Analysis complete!');
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
        <main className="p-8 max-w-6xl mx-auto w-full space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Resume Analyzer</h1>
            <p className="text-muted-foreground mt-1">Get instant AI feedback and scoring on your resume.</p>
          </div>

          {!analysis ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-card border-border h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" /> Resume Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Paste Resume Text</Label>
                    <Textarea
                      rows={15}
                      placeholder="Paste your resume content here..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className="bg-muted border-border"
                    />
                  </div>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/30">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Drag and drop your PDF here (Coming Soon)</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary" /> Job Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Target Job Title</Label>
                    <Input
                      placeholder="e.g. Senior Software Engineer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="bg-muted border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Job Description (Optional)</Label>
                    <Textarea
                      rows={10}
                      placeholder="Paste the job description for better ATS matching..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="bg-muted border-border"
                    />
                  </div>
                  <Button onClick={handleAnalyze} disabled={loading} className="w-full bg-primary h-12 text-lg gap-2 hover:bg-primary/90">
                    {loading ? 'Analyzing...' : <><Sparkles className="w-5 h-5" /> Analyze Now</>}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <AnalysisResult result={analysis} onReset={() => setAnalysis(null)} />
          )}
        </main>
      </div>
    </div>
  );
}

function AnalysisResult({ result, onReset }: any) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-accent';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onReset} className="border-border hover:bg-muted">← Analyze Another</Button>
        <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full border border-border">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold">Analyzed by {result.aiProvider}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-card border-border lg:col-span-1 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Overall Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center pb-8">
            <div className={cn("text-8xl font-black mb-2", getScoreColor(result.totalScore))}>
              {result.totalScore}
            </div>
            <p className="text-muted-foreground font-medium uppercase tracking-widest">Out of 100</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>AI Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg italic leading-relaxed text-muted-foreground border-l-4 border-primary/30 pl-6 py-2">&quot;{result.summary}&quot;</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-card border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" /> Issues to Fix
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.issues.map((issue: any, i: number) => (
              <div key={i} className="flex gap-3 p-3 bg-destructive/5 border border-destructive/10 rounded-lg group hover:bg-destructive/10 transition-colors">
                <div className={cn("w-1.5 h-1.5 rounded-full mt-2 shrink-0",
                  issue.type === 'error' ? 'bg-destructive' : 'bg-warning'
                )} />
                <p className="text-sm">{issue.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <CheckCircle2 className="w-5 h-5" /> Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.strengths.map((strength: string, i: number) => (
              <div key={i} className="flex gap-3 p-3 bg-accent/5 border border-accent/10 rounded-lg group hover:bg-accent/10 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <p className="text-sm">{strength}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
