'use client';

import React from 'react';

interface WatermarkOverlayProps {
  className?: string;
  text?: string;
}

/**
 * High-performance, clean & spacious vector watermark overlay for CV & Document Previews.
 * Uses spaced SVG diagonal repeat pattern to keep documents readable while protecting preview content.
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
      {/* Repeating Diagonal Vector Pattern with spacious breathing room */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <pattern
            id="cvbagus-watermark-grid"
            width="440"
            height="220"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-25)"
          >
            <text
              x="50"
              y="110"
              fill="rgba(15, 23, 42, 0.065)"
              style={{
                fontFamily:
                  'Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
                fontSize: '20px',
                fontWeight: 800,
                letterSpacing: '4px',
              }}
            >
              {text}
            </text>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#cvbagus-watermark-grid)" />
      </svg>

      {/* Subtle Footer Brand Marking */}
      <div className="absolute bottom-3 right-4 pointer-events-none select-none flex items-center gap-1.5 opacity-40">
        <span className="text-[10px] font-bold tracking-wider text-slate-500">
          Pratinjau • {text}
        </span>
      </div>
    </div>
  );
};
