import React from 'react';

interface FormattedDescriptionProps {
  text?: string;
  className?: string;
  bulletColor?: string;
}

/**
 * Formats job experience and description bullet points with professional Hanging Indent.
 * Ensures the second and subsequent wrapped lines align directly under the text, not under the bullet symbol.
 */
export const FormattedDescription: React.FC<FormattedDescriptionProps> = ({
  text,
  className = 'text-xs text-slate-700 leading-relaxed',
  bulletColor,
}) => {
  if (!text || !text.trim()) return null;

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const hasBullets = lines.some((l) => /^[•\-\*]\s*/.test(l));

  if (!hasBullets) {
    return (
      <div className={`whitespace-pre-line leading-relaxed ${className}`}>
        {text}
      </div>
    );
  }

  return (
    <div className="space-y-1 pt-0.5">
      {lines.map((line, idx) => {
        const isBullet = /^[•\-\*]\s*/.test(line);
        const cleanText = line.replace(/^[•\-\*]\s*/, '').trim();

        if (isBullet) {
          return (
            <div key={idx} className={`flex items-start gap-2 ${className}`}>
              <span
                className="select-none shrink-0 font-bold leading-relaxed"
                style={bulletColor ? { color: bulletColor } : undefined}
                aria-hidden="true"
              >
                •
              </span>
              <span className="flex-1 leading-relaxed">{cleanText}</span>
            </div>
          );
        }

        return (
          <div key={idx} className={`leading-relaxed ${className}`}>
            {line}
          </div>
        );
      })}
    </div>
  );
};
