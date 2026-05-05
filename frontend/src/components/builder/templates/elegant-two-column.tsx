import { ResumeData } from '@/lib/types';

interface Props {
  data: ResumeData;
  accentColor: string;
}

export function ElegantTwoColumnTemplate({ data }: Props) {
  return (
    <div className="h-full grid grid-cols-2 gap-6 p-8 bg-slate-50 text-slate-900">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{data.personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-sm text-slate-500">{data.personalInfo.jobTitle || 'Elegant Title'}</p>
        <p className="text-sm leading-6">{data.summary || 'Elegant layout with a clean two-column structure.'}</p>
      </div>
      <div className="space-y-3 text-sm">
        <div>
          <p className="font-semibold">Email</p>
          <p>{data.personalInfo.email || 'email@example.com'}</p>
        </div>
        <div>
          <p className="font-semibold">Location</p>
          <p>{data.personalInfo.location || 'City, Country'}</p>
        </div>
      </div>
    </div>
  );
}
