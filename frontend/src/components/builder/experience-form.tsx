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

export function ExperienceForm({ data, onChange }: Props) {
  const addExperience = () => {
    const newExp = {
      id: Math.random().toString(36).substr(2, 9),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: [''],
    };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter((e) => e.id !== id) });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const addBullet = (expId: string) => {
    onChange({
      ...data,
      experience: data.experience.map((exp) =>
        exp.id === expId ? { ...exp, bullets: [...exp.bullets, ''] } : exp
      ),
    });
  };

  const updateBullet = (expId: string, index: number, value: string) => {
    onChange({
      ...data,
      experience: data.experience.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              bullets: exp.bullets.map((b, i) => (i === index ? value : b)),
            }
          : exp
      ),
    });
  };

  const improveBullet = async (expId: string, index: number) => {
    const exp = data.experience.find(e => e.id === expId);
    if (!exp || !exp.bullets[index]) return;

    try {
      const { data: aiRes } = await api.post('/ai/improve-bullet', {
        bullet: exp.bullets[index],
        jobTitle: exp.jobTitle || data.personalInfo.jobTitle
      });
      updateBullet(expId, index, aiRes.rewritten);
      toast.success('Bullet improved!');
    } catch (e) {
      toast.error('AI Improvement failed');
    }
  };

  return (
    <div className="p-4 space-y-6">
      {data.experience.map((exp) => (
        <div key={exp.id} className="p-4 bg-muted/30 rounded-lg border border-border relative group">
          <button
            onClick={() => removeExperience(exp.id)}
            className="absolute -top-2 -right-2 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input value={exp.jobTitle} onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)} className="bg-card border-border h-8 text-sm" />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="bg-card border-border h-8 text-sm" />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input value={exp.startDate} placeholder="MM/YYYY" onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="bg-card border-border h-8 text-sm" />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input value={exp.endDate} placeholder="MM/YYYY" onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} className="bg-card border-border h-8 text-sm" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label className="text-xs uppercase font-black opacity-50 tracking-widest">Responsibilities</Label>
            {exp.bullets.map((bullet, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input value={bullet} onChange={(e) => updateBullet(exp.id, i, e.target.value)} className="bg-card border-border h-8 text-sm" />
                <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => improveBullet(exp.id, i)}>
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => addBullet(exp.id)} className="w-full border-dashed border border-border mt-2 h-8 text-xs">
              <Plus className="w-3 h-3 mr-2" /> Add Bullet Point
            </Button>
          </div>
        </div>
      ))}
      <Button onClick={addExperience} className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 h-10 border-dashed">
        <Plus className="w-4 h-4 mr-2" /> Add Work Experience
      </Button>
    </div>
  );
}
