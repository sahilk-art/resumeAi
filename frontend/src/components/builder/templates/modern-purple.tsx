import { ResumeData } from '@/lib/types';

interface Props {
  data: ResumeData;
  accentColor: string;
}

export function ModernPurpleTemplate({ data, accentColor }: Props) {
  return (
    <div className="h-full p-8 bg-gradient-to-br from-violet-900 via-purple-900 to-black text-white">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase">{data.personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-sm leading-6 opacity-80">{data.personalInfo.jobTitle || 'Your Title'}</p>
        </div>
        <div className="text-right text-xs uppercase tracking-[0.2em]" style={{ color: accentColor }}>
          ResumeAI
        </div>
      </div>

      <div className="space-y-4 text-sm opacity-90">
        <p>{data.summary || 'Professional summary goes here.'}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Email</p>
            <p>{data.personalInfo.email || 'email@example.com'}</p>
          </div>
          <div>
            <p className="font-semibold">Phone</p>
            <p>{data.personalInfo.phone || '(123) 456-7890'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
