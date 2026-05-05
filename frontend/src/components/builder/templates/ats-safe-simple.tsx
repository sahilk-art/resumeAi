import { ResumeData } from '@/lib/types';

interface Props {
  data: ResumeData;
  accentColor: string;
}

export function AtsSafeSimpleTemplate({ data }: Props) {
  return (
    <div className="h-full p-8 bg-white text-slate-900 border border-slate-200">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{data.personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-sm text-slate-500">{data.personalInfo.jobTitle || 'ATS-Friendly Title'}</p>
      </div>
      <p className="text-sm leading-6 text-slate-600">{data.summary || 'Use a simple, ATS-safe resume structure for better parsing by hiring systems.'}</p>
      <div className="mt-6 text-sm">
        <p className="font-semibold mb-2">Contact</p>
        <p>{data.personalInfo.email || 'email@example.com'}</p>
        <p>{data.personalInfo.phone || '(123) 456-7890'}</p>
      </div>
    </div>
  );
}
