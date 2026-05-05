"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResumeData } from '@/lib/types';
import { Plus, Trash2, Sparkles, Cpu, Star } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function SkillsForm({ data, onChange }: Props) {
  const [isSuggesting, setIsSuggesting] = useState(false);

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
    setIsSuggesting(true);
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
      toast.success('AI Skills mapping complete');
    } catch (e) {
      toast.error('AI suggestion failed');
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center px-1">
        <div className="space-y-1">
           <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Hard & Soft Skills</Label>
           <p className="text-[10px] text-muted-foreground ml-1">Add your technical and core competencies.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-primary border-primary/20 hover:bg-primary/10 rounded-lg h-8 px-3 transition-all active:scale-95"
          onClick={suggestSkills}
          disabled={isSuggesting}
        >
          <Cpu className={cn("w-3.5 h-3.5", isSuggesting && "animate-pulse")} />
          <span className="text-[10px] font-black uppercase tracking-widest">{isSuggesting ? 'Analyzing...' : 'AI Suggest'}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AnimatePresence>
          {data.skills.map((skill, idx) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center bg-muted/30 p-1 pl-3 rounded-xl border border-border/50 group relative hover:border-primary/30 transition-all"
            >
              <div className="flex-1 flex items-center gap-2">
                <Star className="w-3 h-3 text-primary opacity-30" />
                <Input
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  placeholder="e.g. React"
                  className="h-8 text-xs bg-transparent border-none focus-visible:ring-0 placeholder:opacity-50 font-bold"
                />
              </div>

              <div className="flex items-center gap-1 pr-1">
                 <div className="flex gap-0.5 px-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                       <button
                          key={i}
                          onClick={() => updateSkill(skill.id, 'level', i * 20)}
                          className={cn(
                            "w-1.5 h-3 rounded-full transition-all",
                            (skill.level/20) >= i ? "bg-primary" : "bg-muted-foreground/20"
                          )}
                       />
                    ))}
                 </div>
                 <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeSkill(skill.id)}
                 >
                    <Trash2 className="w-3.5 h-3.5" />
                 </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button
         onClick={addSkill}
         variant="ghost"
         className="w-full h-12 rounded-2xl border-2 border-dashed border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[2px]"
      >
        <Plus className="w-4 h-4" /> Add Skill Manually
      </Button>
    </div>
  );
}

import { useState } from 'react';
