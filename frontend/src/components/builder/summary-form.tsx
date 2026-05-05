"use client"

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ResumeData } from '@/lib/types';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function SummaryForm({ data, onChange }: Props) {
  const [loading, setLoading] = useState(false);

  const handleAI = async () => {
    setLoading(true);
    try {
      const { data: aiRes } = await api.post('/ai/generate-summary', {
        name: data.personalInfo.fullName,
        title: data.personalInfo.jobTitle,
        experience: data.experience.map(e => e.jobTitle).join(', '),
        skills: data.skills.map(s => s.name).join(', '),
      });
      onChange({ ...data, summary: aiRes.summary });
      toast.success('Summary generated!');
    } catch (error) {
      toast.error('AI generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Label>Professional Summary</Label>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-primary border-primary/30 hover:bg-primary/10"
          onClick={handleAI}
          disabled={loading}
        >
          <Sparkles className="w-4 h-4" />
          {loading ? 'Generating...' : 'AI Generate'}
        </Button>
      </div>
      <Textarea
        rows={6}
        value={data.summary}
        onChange={(e) => onChange({ ...data, summary: e.target.value })}
        placeholder="Briefly describe your professional background and key achievements..."
        className="bg-muted border-border resize-none"
      />
    </div>
  );
}
