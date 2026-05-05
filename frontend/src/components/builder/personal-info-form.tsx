"use client"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResumeData } from '@/lib/types';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function PersonalInfoForm({ data, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [name]: value,
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Full Name</Label>
          <div className="relative group">
            <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input name="fullName" value={data.personalInfo.fullName} onChange={handleChange} className="pl-10 h-11 bg-muted/30 border-border focus:ring-1" placeholder="John Doe" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Desired Job Title</Label>
          <Input name="jobTitle" value={data.personalInfo.jobTitle} onChange={handleChange} className="h-11 bg-muted/30 border-border" placeholder="Senior Software Engineer" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Email</Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input name="email" value={data.personalInfo.email} onChange={handleChange} className="pl-10 h-11 bg-muted/30 border-border" placeholder="john@example.com" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Phone</Label>
          <div className="relative group">
            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input name="phone" value={data.personalInfo.phone} onChange={handleChange} className="pl-10 h-11 bg-muted/30 border-border" placeholder="+1 234 567 890" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Location</Label>
        <div className="relative group">
          <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input name="location" value={data.personalInfo.location} onChange={handleChange} className="pl-10 h-11 bg-muted/30 border-border" placeholder="New York, USA" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">LinkedIn</Label>
          <div className="relative group">
            <Linkedin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input name="linkedin" value={data.personalInfo.linkedin} onChange={handleChange} className="pl-10 h-11 bg-muted/30 border-border" placeholder="linkedin.com/in/..." />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">GitHub</Label>
          <div className="relative group">
            <Github className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input name="github" value={data.personalInfo.github} onChange={handleChange} className="pl-10 h-11 bg-muted/30 border-border" placeholder="github.com/..." />
          </div>
        </div>
      </div>
    </div>
  );
}
