"use client"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResumeData } from '@/lib/types';

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
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input name="fullName" value={data.personalInfo.fullName} onChange={handleChange} className="bg-muted border-border" />
      </div>
      <div className="space-y-2">
        <Label>Job Title</Label>
        <Input name="jobTitle" value={data.personalInfo.jobTitle} onChange={handleChange} className="bg-muted border-border" />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input name="email" value={data.personalInfo.email} onChange={handleChange} className="bg-muted border-border" />
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input name="phone" value={data.personalInfo.phone} onChange={handleChange} className="bg-muted border-border" />
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <Input name="location" value={data.personalInfo.location} onChange={handleChange} className="bg-muted border-border" />
      </div>
      <div className="space-y-2">
        <Label>LinkedIn</Label>
        <Input name="linkedin" value={data.personalInfo.linkedin} onChange={handleChange} className="bg-muted border-border" />
      </div>
    </div>
  );
}
