import { ResumeData } from '@/lib/types';

interface Props {
  data: ResumeData;
  accentColor: string;
}

export function ClassicMinimalTemplate({ data }: Props) {
  return (
    <div className="h-full p-8 bg-white text-slate-900 border border-slate-200">
      <h1 className="text-3xl font-bold">{data.personalInfo.fullName || 'Your Name'}</h1>
      <p className="text-sm text-slate-500 mb-6">{data.personalInfo.jobTitle || 'Your Title'}</p>
      <p className="text-sm leading-6 mb-6">{data.summary || 'Add a compelling summary to introduce your experience and strengths.'}</p>
      <div className="grid gap-4 text-sm">
        <div>
          <p className="font-semibold">Contact</p>
          <p>{data.personalInfo.email || 'email@example.com'}</p>
        </div>
        <div>
          <p className="font-semibold">Location</p>
          <p>{data.personalInfo.location || 'Your City, Country'}</p>
        </div>
      </div>
    </div>
  );
}
