"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PersonalInfoForm } from '@/components/builder/personal-info-form';
import { SummaryForm } from '@/components/builder/summary-form';
import { ExperienceForm } from '@/components/builder/experience-form';
import { SkillsForm } from '@/components/builder/skills-form';
import { ResumePreview } from '@/components/builder/resume-preview';
import { ResumeData, initialResumeData } from '@/lib/types';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Download, LayoutTemplate, ChevronLeft, ChevronRight, Sparkles, Wand2, Monitor, Smartphone, Maximize2, Plus, FileText, Palette, Save } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { id: 'personal', name: 'Identity', icon: '👤' },
  { id: 'summary', name: 'Profile', icon: '📝' },
  { id: 'experience', name: 'History', icon: '💼' },
  { id: 'skills', name: 'Expertise', icon: '⚡' },
];

const templates = [
  { id: 'modern', name: 'Modern Purple' },
  { id: 'classic', name: 'Classic Minimal' },
  { id: 'executive', name: 'Executive Bold' },
  { id: 'tech', name: 'Tech Dark' },
  { id: 'corporate', name: 'Clean Corporate' },
  { id: 'elegant', name: 'Elegant Two-Column' },
  { id: 'ats', name: 'ATS-Safe Simple' },
  { id: 'creative', name: 'Creative Sidebar' },
];

const colors = ['#8b5cf6', '#ec4899', '#10b981', '#3b82f6', '#f59e0b', '#0f172a'];

export default function BuilderPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<ResumeData>(initialResumeData);
  const [template, setTemplate] = useState('modern');
  const [accentColor, setAccentColor] = useState('#8b5cf6');
  const [activeStep, setActiveStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(0.85);
  const [mobilePane, setMobilePane] = useState<'form' | 'preview'>('form');

  useEffect(() => {
    if (id && id !== 'new') {
      api.get(`/resumes/${id}`).then((res) => {
        setData(res.data.data);
        setTemplate(res.data.template);
        setAccentColor(res.data.accentColor || '#8b5cf6');
      });
    }
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (data.personalInfo.fullName) handleSave(true);
    }, 30000);
    return () => clearInterval(timer);
  }, [data, template, accentColor]);

  const handleSave = async (silent = false) => {
    setIsSaving(true);
    try {
      if (id === 'new') {
        const res = await api.post('/resumes', { title: data.personalInfo.fullName || 'Untitled', data, template, accentColor });
        router.push(`/builder/${res.data._id}`);
      } else {
        await api.put(`/resumes/${id}`, { data, template, accentColor });
      }
      if (!silent) toast.success('Changes synced');
    } catch (error) {
      if (!silent) toast.error('Sync failed');
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = () => activeStep < steps.length - 1 && setActiveStep(activeStep + 1);
  const prevStep = () => activeStep > 0 && setActiveStep(activeStep - 1);

  return (
    <AppShell
      contentClassName="flex-1 flex flex-col overflow-hidden bg-[#050508]"
      header={({ openMenu }) => (
        <header className="h-16 border-b border-border/40 bg-card/30 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={openMenu}
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 transition-colors"
              aria-label="Open menu"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-foreground"
              >
                <path
                  d="M4 7H20M4 12H20M4 17H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 hover:bg-muted">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="h-4 w-[1px] bg-border mx-1" />
            <div className="flex items-center gap-2">
              <h2 className="font-black italic tracking-tight text-lg">{data.personalInfo.fullName || 'Untitled Resume'}</h2>
              {isSaving && <div className="flex items-center gap-1 text-[10px] font-black uppercase text-primary animate-pulse ml-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Saving
              </div>}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
             <div className="lg:hidden flex items-center gap-2">
               <Button
                 type="button"
                 size="sm"
                 variant={mobilePane === 'form' ? 'secondary' : 'outline'}
                 className="rounded-xl border-border/50 font-bold h-9 gap-2"
                 onClick={() => setMobilePane('form')}
               >
                 <FileText className="w-4 h-4" /> Form
               </Button>
               <Button
                 type="button"
                 size="sm"
                 variant={mobilePane === 'preview' ? 'secondary' : 'outline'}
                 className="rounded-xl border-border/50 font-bold h-9 gap-2"
                 onClick={() => setMobilePane('preview')}
               >
                 <Monitor className="w-4 h-4" /> Preview
               </Button>
             </div>
             <Button variant="outline" size="sm" onClick={() => handleSave()} className="rounded-xl border-border/50 font-bold h-9">
               Save Draft
             </Button>
             <Button className="grad-primary border-none shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[11px] h-9 px-6 rounded-xl gap-2">
               <Download className="w-3.5 h-3.5" /> Export PDF
             </Button>
          </div>
        </header>
      )}
    >

        <div className="flex-1 flex overflow-hidden">
          {/* Left Side: Dynamic Form */}
          <div
            className={cn(
              "w-full lg:w-[450px] lg:border-r border-border/30 flex flex-col bg-card/20 relative z-20 shadow-2xl",
              mobilePane === 'form' ? "flex" : "hidden lg:flex"
            )}
          >
             {/* Progress Stepper */}
             <div className="p-6 border-b border-border/20 flex justify-between gap-1">
                {steps.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-2 py-2 rounded-xl transition-all duration-300",
                      activeStep === idx ? "bg-primary/10 text-primary scale-105" : "opacity-40 hover:opacity-100 hover:bg-muted"
                    )}
                  >
                    <span className="text-xl">{step.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{step.name}</span>
                  </button>
                ))}
             </div>

             <ScrollArea className="flex-1">
                <div className="p-6 pb-32">
                   <AnimatePresence mode="wait">
                      <motion.div
                        key={steps[activeStep].id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                         <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                           <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm">{steps[activeStep].icon}</span>
                           {steps[activeStep].name} Details
                         </h3>

                         <div className="bg-card/40 border border-border/40 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl">
                            {activeStep === 0 && <PersonalInfoForm data={data} onChange={setData} />}
                            {activeStep === 1 && <SummaryForm data={data} onChange={setData} />}
                            {activeStep === 2 && <ExperienceForm data={data} onChange={setData} />}
                            {activeStep === 3 && <SkillsForm data={data} onChange={setData} />}
                         </div>
                      </motion.div>
                   </AnimatePresence>
                </div>
             </ScrollArea>

             {/* Navigation Footer */}
             <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent pt-12">
                <div className="flex gap-4">
                  {activeStep > 0 && (
                    <Button variant="outline" className="flex-1 rounded-2xl h-12 border-border/50 font-bold" onClick={prevStep}>
                      Back
                    </Button>
                  )}
                  <Button className="flex-[2] rounded-2xl h-12 grad-primary font-black uppercase tracking-widest" onClick={activeStep === steps.length - 1 ? () => handleSave() : nextStep}>
                    {activeStep === steps.length - 1 ? 'Finish & Analyze' : 'Continue'}
                  </Button>
                </div>
             </div>
          </div>

          {/* Right Side: Visual Preview */}
          <div
            className={cn(
              "flex-1 bg-[#0a0a0f] p-4 sm:p-6 lg:p-12 flex flex-col items-center overflow-auto scrollbar-hide relative group/preview",
              mobilePane === 'preview' ? "flex" : "hidden lg:flex"
            )}
          >
             {/* Preview Controls */}
             <div className="mb-10 flex items-center gap-6 glass p-2 rounded-2xl border-white/5 shadow-2xl sticky top-0 z-30 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 px-4">
                   <Monitor className="w-4 h-4 text-muted-foreground" />
                   <div className="h-1 w-24 bg-muted rounded-full overflow-hidden">
                      <div className="h-full grad-primary w-full" />
                   </div>
                </div>

                <div className="h-6 w-[1px] bg-border/50" />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="font-bold gap-2 hover:bg-white/5">
                      <LayoutTemplate className="w-4 h-4 text-primary" /> {templates.find(t => t.id === template)?.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#11111a] border-white/10 w-56 rounded-2xl p-2 shadow-2xl">
                    {templates.map(t => (
                      <DropdownMenuItem key={t.id} onClick={() => setTemplate(t.id)} className="rounded-xl py-2 cursor-pointer focus:bg-primary/20">
                        {t.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-6 w-[1px] bg-border/50" />

                <div className="flex items-center gap-2 pr-4">
                   {colors.map(c => (
                     <button
                        key={c}
                        onClick={() => setAccentColor(c)}
                        className={cn(
                          "w-5 h-5 rounded-full border-2 border-transparent transition-all",
                          accentColor === c && "border-white scale-110 shadow-lg shadow-white/20"
                        )}
                        style={{ backgroundColor: c }}
                     />
                   ))}
                </div>
             </div>

             <div
                className="transition-transform duration-500 origin-top resume-shadow mb-32"
                style={{ transform: `scale(${previewZoom})` }}
              >
                <ResumePreview data={data} template={template} accentColor={accentColor} />
             </div>

             {/* Zoom Controls */}
             <div className="fixed bottom-10 right-10 flex flex-col gap-2">
                <Button variant="outline" size="icon" className="glass rounded-full border-white/10 hover:bg-white/5 shadow-2xl" onClick={() => setPreviewZoom(prev => Math.min(prev + 0.1, 1.2))}>
                   <Plus className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="glass rounded-full border-white/10 hover:bg-white/5 shadow-2xl" onClick={() => setPreviewZoom(prev => Math.max(prev - 0.1, 0.4))}>
                   <Maximize2 className="w-4 h-4" />
                </Button>
             </div>
          </div>
	        </div>
    </AppShell>
	  );
}
