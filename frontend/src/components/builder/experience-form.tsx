"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResumeData } from '@/lib/types';
import { Plus, Trash2, Sparkles, Briefcase, Calendar, MapPin, GripVertical } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="p-6 space-y-8">
      <AnimatePresence>
        {data.experience.map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 bg-muted/20 rounded-3xl border border-border/50 relative group"
          >
            <div className="absolute -top-3 -right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 rounded-full shadow-lg"
                onClick={() => removeExperience(exp.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Job Title</Label>
                  <Input
                    value={exp.jobTitle}
                    onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                    className="h-10 bg-card border-border"
                    placeholder="e.g. Lead Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="h-10 bg-card border-border"
                    placeholder="e.g. Google"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                       value={exp.location}
                       onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                       className="h-10 pl-10 bg-card border-border"
                       placeholder="City, State"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Start Date</Label>
                    <Input
                       value={exp.startDate}
                       onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                       className="h-10 bg-card border-border text-xs"
                       placeholder="MM/YYYY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">End Date</Label>
                    <Input
                       value={exp.endDate}
                       onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                       className="h-10 bg-card border-border text-xs"
                       placeholder="MM/YYYY"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center px-1">
                   <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Achievements & Responsibilities</Label>
                </div>
                <div className="space-y-3">
                  {exp.bullets.map((bullet, i) => (
                    <div key={i} className="flex gap-2 items-start group/bullet">
                      <Input
                        value={bullet}
                        onChange={(e) => updateBullet(exp.id, i, e.target.value)}
                        className="h-9 bg-card border-border text-sm"
                        placeholder="Action verb + Task + Result..."
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 shrink-0 text-primary hover:bg-primary/10 rounded-lg opacity-40 group-hover/bullet:opacity-100 transition-all"
                        onClick={() => improveBullet(exp.id, i)}
                      >
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                   variant="ghost"
                   size="sm"
                   onClick={() => addBullet(exp.id)}
                   className="w-full border-dashed border border-border mt-2 h-9 text-[10px] font-bold uppercase tracking-widest hover:bg-muted"
                >
                  <Plus className="w-3.5 h-3.5 mr-2" /> Add Achievement
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button
         onClick={addExperience}
         className="w-full h-14 rounded-3xl bg-primary/10 text-primary hover:bg-primary hover:text-white border-2 border-dashed border-primary/30 transition-all active:scale-[0.98] font-black uppercase tracking-widest text-xs"
      >
        <Plus className="w-5 h-5 mr-3" /> Add Professional Experience
      </Button>
    </div>
  );
}
