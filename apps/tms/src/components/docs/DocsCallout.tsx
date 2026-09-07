import React from 'react';
import { Info, Lightbulb, AlertTriangle, AlertCircle } from 'lucide-react';
import { DocCalloutData } from '../../docs/types';

interface Props {
  callout: DocCalloutData;
}

export const DocsCallout: React.FC<Props> = ({ callout }) => {
  const styles = {
    note: {
      bg: 'bg-blue-50/80 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-800/60',
      text: 'text-blue-900 dark:text-blue-200',
      titleText: 'text-blue-950 dark:text-blue-100',
      icon: <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />,
      defaultTitle: 'Note',
    },
    tip: {
      bg: 'bg-emerald-50/80 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      text: 'text-emerald-900 dark:text-emerald-200',
      titleText: 'text-emerald-950 dark:text-emerald-100',
      icon: <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />,
      defaultTitle: 'Tip',
    },
    warning: {
      bg: 'bg-amber-50/80 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800/60',
      text: 'text-amber-900 dark:text-amber-200',
      titleText: 'text-amber-950 dark:text-amber-100',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />,
      defaultTitle: 'Warning',
    },
    important: {
      bg: 'bg-rose-50/80 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-800/60',
      text: 'text-rose-900 dark:text-rose-200',
      titleText: 'text-rose-950 dark:text-rose-100',
      icon: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />,
      defaultTitle: 'Important',
    },
  }[callout.type || 'note'];

  return (
    <div
      className={`my-4 p-4 rounded-xl border ${styles.bg} ${styles.border} flex items-start gap-3 shadow-xs`}
    >
      {styles.icon}
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${styles.titleText}`}>
          {callout.title || styles.defaultTitle}
        </div>
        <div className={`text-xs leading-relaxed ${styles.text}`}>
          {callout.content}
        </div>
      </div>
    </div>
  );
};
