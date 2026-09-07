import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface RememberCalloutProps {
  text: string;
  hinglishText?: string;
  title?: string;
  className?: string;
}

export const RememberCallout: React.FC<RememberCalloutProps> = ({
  text,
  hinglishText,
  title,
  className = ''
}) => {
  const { language, t } = useLanguage();
  const displayTitle = title || t('Remember', 'Yaad Rakhein');
  const displayText = (language === 'hinglish' && hinglishText) ? hinglishText : text;

  return (
    <div
      className={`my-4 p-3.5 border-l-4 border-amber-500 bg-amber-50/50 rounded-r-lg text-sm text-slate-800 ${className}`}
    >
      <strong className="text-amber-950 font-semibold mr-1.5">{displayTitle}:</strong>
      <span className="text-slate-700 italic">"{displayText}"</span>
    </div>
  );
};
