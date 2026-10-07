'use client';

import React, { useRef, useState, useEffect } from 'react';
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
  zoom?: number; // Zoom level in percentage: 35, 45, 75, 100, etc.
}

export const CVCanvas: React.FC<CVCanvasProps> = ({ data, zoom = 100 }) => {
  const docRef = useRef<HTMLDivElement>(null);
  const [docHeight, setDocHeight] = useState<number>(1123);

  // Measure natural document height to size outer container perfectly
  useEffect(() => {
    if (!docRef.current) return;
    const updateHeight = () => {
      if (docRef.current) {
        const height = docRef.current.offsetHeight;
        if (height > 0) {
          setDocHeight(Math.max(1123, height));
        }
      }
    };

    updateHeight();
    const observer = new ResizeObserver(() => {
      updateHeight();
    });
    observer.observe(docRef.current);
    return () => observer.disconnect();
  }, [data]);

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
      ? 'cv-font-serif font-serif'
      : data.theme.fontFamily === 'mono'
      ? 'cv-font-mono font-mono'
      : 'cv-font-sans font-sans';

  const fontFamilyStyle =
    data.theme.fontFamily === 'serif'
      ? 'Georgia, Cambria, "Times New Roman", Times, serif'
      : data.theme.fontFamily === 'mono'
      ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
      : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

  const scale = zoom / 100;
  const scaledWidth = Math.round(794 * scale);
  const scaledHeight = Math.round(docHeight * scale);

  return (
    <div
      className="cv-canvas-wrapper flex justify-center items-start min-w-0 mx-auto transition-all duration-150 shrink-0"
      style={{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        position: 'relative',
      }}
    >
      <div
        ref={docRef}
        id="cv-paper-document"
        className={`cv-a4-page bg-white shadow-xl rounded-lg border border-slate-200/60 ${fontClass}`}
        style={{
          width: '794px',
          minHeight: '1123px',
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
          fontFamily: fontFamilyStyle,
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};
