import { ResumeData } from '@/lib/types';

interface Props {
  data: ResumeData;
  accentColor: string;
}

export function CreativeSidebarTemplate({ data }: Props) {
  return (
    <div className="h-full grid grid-cols-[1fr_260px] bg-slate-950 text-white">
      <div className="p-8">
        <h1 className="text-3xl font-bold">{data.personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-sm text-slate-300 mb-6">{data.personalInfo.jobTitle || 'Creative Title'}</p>
        <p className="text-sm leading-6 text-slate-300">{data.summary || 'A creative resume layout with a sidebar for contact and skills.'}</p>
      </div>
      <div className="p-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-semibold uppercase tracking-[0.18em] text-slate-400">Contact</p>
            <p>{data.personalInfo.email || 'email@example.com'}</p>
          </div>
          <div>
            <p className="font-semibold uppercase tracking-[0.18em] text-slate-400">Location</p>
            <p>{data.personalInfo.location || 'City, Country'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
