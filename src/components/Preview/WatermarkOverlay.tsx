'use client';

import React from 'react';

interface WatermarkOverlayProps {
  className?: string;
  text?: string;
}

/**
 * High-performance, razor-sharp vector watermark overlay for CV & Document Previews.
 * Uses SVG Pattern with diagonal repeat and center preview stamp.
 * Completely click-through (pointer-events: none) and non-selectable.
 */
export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  className = '',
  text = 'cvbagus.id',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`cv-watermark-overlay absolute inset-0 pointer-events-none select-none overflow-hidden z-25 ${className}`}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* 1. Repeating Diagonal Vector Pattern across full document */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <pattern
            id="cvbagus-watermark-grid"
            width="280"
            height="150"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-28)"
          >
            {/* Primary line: bold brand */}
            <text
              x="20"
              y="45"
              fill="rgba(15, 23, 42, 0.11)"
              style={{
                fontFamily:
                  'Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
                fontSize: '22px',
                fontWeight: 900,
                letterSpacing: '2px',
              }}
            >
              {text}
            </text>

            {/* Secondary line: subtle repeat offset */}
            <text
              x="140"
              y="115"
              fill="rgba(15, 23, 42, 0.08)"
              style={{
                fontFamily:
                  'Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '3px',
              }}
            >
              • {text} •
            </text>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#cvbagus-watermark-grid)" />
      </svg>

      {/* 2. Elegant Center Stamp / Watermark Badge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none select-none">
        <div className="border-[2.5px] border-dashed border-slate-900/[0.13] rounded-2xl px-7 py-2.5 bg-white/20 backdrop-blur-[0.5px] shadow-xs text-center">
          <span
            className="block text-2xl font-black tracking-widest text-slate-900/[0.14] uppercase"
            style={{
              fontFamily:
                'Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
            }}
          >
            {text}
          </span>
          <span className="block text-[9.5px] font-bold tracking-[3px] text-slate-800/[0.14] uppercase mt-0.5">
            Pratinjau Resmi Dokumen
          </span>
        </div>
      </div>

      {/* 3. Subtle Footer Brand Marking */}
      <div className="absolute bottom-2.5 right-4 pointer-events-none select-none flex items-center gap-1.5 opacity-35">
        <span className="text-[10px] font-bold tracking-wider text-slate-700">
          Pratinjau • {text}
        </span>
      </div>
    </div>
  );
};
