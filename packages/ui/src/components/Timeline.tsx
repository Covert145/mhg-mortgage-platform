import * as React from "react";
import { cn } from "../lib/cn";

export interface TimelineItem {
  id: string;
  title: React.ReactNode;
  timestamp: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  items: TimelineItem[];
}

/** Contact 360 / loan-file activity feed — docs/architecture/database-schema.md #2. */
export function Timeline({ items, className, ...props }: TimelineProps) {
  return (
    <ol className={cn("relative space-y-6 border-l border-ink-200 pl-6", className)} {...props}>
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute -left-[1.65rem] flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            {item.icon ?? <span className="h-2 w-2 rounded-full bg-brand-600" />}
          </span>
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-sm font-medium text-ink-900">{item.title}</p>
            <time className="shrink-0 text-xs text-ink-400">{item.timestamp}</time>
          </div>
          {item.description ? <p className="mt-0.5 text-sm text-ink-500">{item.description}</p> : null}
        </li>
      ))}
    </ol>
  );
}
