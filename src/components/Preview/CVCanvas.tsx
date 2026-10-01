'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { ModernTemplate } from './templates/ModernTemplate';
import { ATSClassicTemplate } from './templates/ATSClassicTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { TimelineTemplate } from './templates/TimelineTemplate';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { CompactTemplate } from './templates/CompactTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { StripeTemplate } from './templates/StripeTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { AcademicTemplate } from './templates/AcademicTemplate';

interface CVCanvasProps {
  data: CVData;
  zoom?: number; // Zoom level in percentage: 70, 85, 100, 115, etc.
}

export const CVCanvas: React.FC<CVCanvasProps> = ({ data, zoom = 100 }) => {
  const renderTemplate = () => {
    switch (data.theme.template) {
      case 'ats_classic':
        return <ATSClassicTemplate data={data} />;
      case 'executive':
        return <ExecutiveTemplate data={data} />;
      case 'timeline':
        return <TimelineTemplate data={data} />;
      case 'minimalist':
        return <MinimalistTemplate data={data} />;
      case 'compact':
        return <CompactTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'stripe':
        return <StripeTemplate data={data} />;
      case 'corporate':
        return <CorporateTemplate data={data} />;
      case 'academic':
        return <AcademicTemplate data={data} />;
      case 'modern':
      default:
        return <ModernTemplate data={data} />;
    }
  };

  const fontClass =
    data.theme.fontFamily === 'serif'
      ? 'font-serif'
      : data.theme.fontFamily === 'mono'
      ? 'font-mono'
      : 'font-sans';

  const scale = zoom / 100;

  return (
    <div
      className="flex justify-center w-full transition-all duration-150"
      style={{
        width: `${scale * 100}%`,
        maxWidth: '100%',
      }}
    >
      <div
        id="cv-paper-document"
        className={`cv-a4-page w-full max-w-[210mm] min-h-[297mm] bg-white shadow-xl rounded-lg overflow-hidden border border-slate-200/60 transition-all duration-200 origin-top ${fontClass}`}
        style={{
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
          marginBottom: scale < 1 ? `calc((1 - ${scale}) * -297mm)` : undefined,
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};
