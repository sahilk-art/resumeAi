import { ResumeData } from '@/lib/types';

interface Props {
  data: ResumeData;
  accentColor: string;
}

export function ExecutiveBoldTemplate({ data, accentColor }: Props) {
  return (
    <div className="h-full p-8 bg-slate-950 text-white">
      <div className="border-b border-slate-700 pb-6 mb-6">
        <h1 className="text-4xl font-black">{data.personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-lg text-slate-300">{data.personalInfo.jobTitle || 'Executive Title'}</p>
      </div>
      <p className="text-sm leading-6 opacity-80">{data.summary || 'A strong professional summary gives recruiters more confidence in your skills.'}</p>
      <div className="mt-8 text-sm grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">LinkedIn</p>
          <p>{data.personalInfo.linkedin || 'linkedin.com/in/username'}</p>
        </div>
        <div>
          <p className="font-semibold">Website</p>
          <p>{data.personalInfo.website || 'yourwebsite.com'}</p>
        </div>
      </div>
    </div>
  );
}
