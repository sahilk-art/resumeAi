import { ResumeData } from '@/lib/types';

interface Props {
  data: ResumeData;
  accentColor: string;
}

export function CleanCorporateTemplate({ data }: Props) {
  return (
    <div className="h-full p-8 bg-white text-slate-900">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold">{data.personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-sm text-slate-500">{data.personalInfo.jobTitle || 'Corporate Title'}</p>
        </div>
        <div className="text-right text-xs uppercase tracking-[0.2em] text-slate-400">Corporate</div>
      </div>
      <p className="text-sm leading-6 text-slate-600">{data.summary || 'A clean, corporate resume layout that is easy to scan.'}</p>
    </div>
  );
}
