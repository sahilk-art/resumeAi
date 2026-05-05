import { ResumeData } from '@/lib/types';

interface Props {
  data: ResumeData;
  accentColor: string;
}

export function TechDarkTemplate({ data }: Props) {
  return (
    <div className="h-full p-8 bg-slate-900 text-slate-100">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold">{data.personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-sm text-slate-400">{data.personalInfo.jobTitle || 'Tech Professional'}</p>
      </div>
      <div className="grid gap-4 text-sm">
        <div className="bg-slate-800 p-4 rounded-xl">
          <p className="font-semibold mb-2">Summary</p>
          <p className="text-slate-300">{data.summary || 'Summarize your technical strengths clearly and concisely.'}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl">
          <p className="font-semibold mb-2">Contact</p>
          <p>{data.personalInfo.email || 'email@example.com'}</p>
          <p>{data.personalInfo.phone || '(123) 456-7890'}</p>
        </div>
      </div>
    </div>
  );
}
