"use client"

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ResumeData } from '@/lib/types';
import { Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function SummaryForm({ data, onChange }: Props) {
  const [loading, setLoading] = useState(false);

  const handleAI = async () => {
    if (!data.personalInfo.jobTitle) {
      toast.error('Add your Job Title first for better generation');
    }
    setLoading(true);
    try {
      const { data: aiRes } = await api.post('/ai/generate-summary', {
        name: data.personalInfo.fullName,
        title: data.personalInfo.jobTitle,
        experience: data.experience.map(e => e.jobTitle).join(', '),
        skills: data.skills.map(s => s.name).join(', '),
      });
      onChange({ ...data, summary: aiRes.summary });
      toast.success('AI Profile Summary generated!');
    } catch (error) {
      toast.error('AI generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center px-1">
        <div className="space-y-1">
           <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Professional Profile</Label>
           <p className="text-[10px] text-muted-foreground ml-1">A short summary of your career & goals.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-primary border-primary/20 hover:bg-primary/10 rounded-lg h-8 px-3 transition-all active:scale-95 shadow-lg shadow-primary/5"
          onClick={handleAI}
          disabled={loading}
        >
          <Sparkles className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          <span className="text-[10px] font-black uppercase tracking-widest">{loading ? 'Writing...' : 'AI Generate'}</span>
        </Button>
      </div>

      <div className="relative group">
        <Textarea
          rows={10}
          value={data.summary}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          placeholder="e.g. Dedicated Software Engineer with 5+ years of experience in building scalable web applications..."
          className="bg-muted/20 border-border p-4 resize-none leading-relaxed text-sm focus:ring-1 transition-all"
        />
        <div className="absolute bottom-3 right-3 text-[10px] font-bold text-muted-foreground opacity-30 group-focus-within:opacity-100 transition-opacity">
          {data.summary.length} characters
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-4 items-start">
         <div className="p-2 rounded-xl bg-primary/20">
            <Zap className="w-4 h-4 text-primary" />
         </div>
         <div className="space-y-1">
            <p className="text-xs font-bold text-primary">Pro Tip</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">Focus on your quantifiable impact and most relevant skills for the job you want. Keep it between 3-5 sentences.</p>
         </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
