import { ResumeData } from "@/lib/types";
import { ModernPurpleTemplate } from "./templates/modern-purple";
import { ClassicMinimalTemplate } from "./templates/classic-minimal";
import { ExecutiveBoldTemplate } from "./templates/executive-bold";
import { TechDarkTemplate } from "./templates/tech-dark";
import { CleanCorporateTemplate } from "./templates/clean-corporate";
import { ElegantTwoColumnTemplate } from "./templates/elegant-two-column";
import { AtsSafeSimpleTemplate } from "./templates/ats-safe-simple";
import { CreativeSidebarTemplate } from "./templates/creative-sidebar";

interface Props {
  data: ResumeData;
  template: string;
  accentColor: string;
}

export function ResumePreview({ data, template, accentColor }: Props) {
  const renderTemplate = () => {
    switch (template) {
      case 'modern': return <ModernPurpleTemplate data={data} accentColor={accentColor} />;
      case 'classic': return <ClassicMinimalTemplate data={data} accentColor={accentColor} />;
      case 'executive': return <ExecutiveBoldTemplate data={data} accentColor={accentColor} />;
      case 'tech': return <TechDarkTemplate data={data} accentColor={accentColor} />;
      case 'corporate': return <CleanCorporateTemplate data={data} accentColor={accentColor} />;
      case 'elegant': return <ElegantTwoColumnTemplate data={data} accentColor={accentColor} />;
      case 'ats': return <AtsSafeSimpleTemplate data={data} accentColor={accentColor} />;
      case 'creative': return <CreativeSidebarTemplate data={data} accentColor={accentColor} />;
      default: return <ModernPurpleTemplate data={data} accentColor={accentColor} />;
    }
  };

  return (
    <div id="resume-preview" className="bg-white text-black w-full aspect-[1/1.414] shadow-2xl origin-top scale-[0.8] mx-auto overflow-hidden">
      {renderTemplate()}
    </div>
  );
}
