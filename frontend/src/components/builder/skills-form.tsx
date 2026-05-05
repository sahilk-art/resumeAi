"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResumeData } from '@/lib/types';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function SkillsForm({ data, onChange }: Props) {
  const addSkill = () => {
    const newSkill = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      level: 80,
      type: 'technical' as const,
    };
    onChange({ ...data, skills: [...data.skills, newSkill] });
  };

  const removeSkill = (id: string) => {
    onChange({ ...data, skills: data.skills.filter((s) => s.id !== id) });
  };

  const updateSkill = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      skills: data.skills.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    });
  };

  const suggestSkills = async () => {
    try {
      const { data: aiRes } = await api.post('/ai/suggest-skills', {
        jobTitle: data.personalInfo.jobTitle,
        currentSkills: data.skills.map(s => s.name).join(', ')
      });
      const newSkills = aiRes.suggestedSkills.map((name: string) => ({
        id: Math.random().toString(36).substr(2, 9),
        name,
        level: 80,
        type: 'technical'
      }));
      onChange({ ...data, skills: [...data.skills, ...newSkills] });
      toast.success('Skills suggested!');
    } catch (e) {
      toast.error('AI suggestion failed');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <Label>Skills & Expertise</Label>
        <Button variant="outline" size="sm" className="gap-2 text-primary border-primary/30 hover:bg-primary/10" onClick={suggestSkills}>
          <Sparkles className="w-4 h-4" /> AI Suggest
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {data.skills.map((skill) => (
          <div key={skill.id} className="flex gap-2 items-center bg-muted/30 p-2 rounded-lg border border-border group relative">
            <Input
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
              placeholder="e.g. React"
              className="h-8 text-sm bg-card border-border"
            />
            <button onClick={() => removeSkill(skill.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <Button onClick={addSkill} variant="ghost" className="w-full border-dashed border border-border h-10 text-xs">
        <Plus className="w-4 h-4 mr-2" /> Add Skill
      </Button>
    </div>
  );
}
