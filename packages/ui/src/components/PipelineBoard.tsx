import * as React from "react";
import { cn } from "../lib/cn";
import { Badge } from "./Badge";
import { Card } from "./Card";

export interface PipelineCardData {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

export interface PipelineColumn {
  id: string;
  name: string;
  cards: PipelineCardData[];
}

export interface PipelineBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: PipelineColumn[];
  onCardClick?: (cardId: string, columnId: string) => void;
}

/**
 * Kanban-style pipeline view — docs/architecture/database-schema.md #3 (the
 * 20 default stages + Not Interested/Denied/Withdrawn/Nurture/Dead). Phase 1
 * ships this as a static/presentational component; drag-and-drop stage
 * transitions land in Phase 3.
 */
export function PipelineBoard({ columns, onCardClick, className, ...props }: PipelineBoardProps) {
  return (
    <div className={cn("flex gap-4 overflow-x-auto pb-2", className)} {...props}>
      {columns.map((column) => (
        <div key={column.id} className="flex w-72 shrink-0 flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-sm font-semibold text-ink-700">{column.name}</h4>
            <span className="text-xs text-ink-400">{column.cards.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            {column.cards.map((card) => (
              <Card
                key={card.id}
                role={onCardClick ? "button" : undefined}
                tabIndex={onCardClick ? 0 : undefined}
                onClick={() => onCardClick?.(card.id, column.id)}
                className={cn("p-3", onCardClick && "cursor-pointer hover:border-brand-300")}
              >
                <p className="text-sm font-medium text-ink-900">{card.title}</p>
                {card.subtitle ? <p className="mt-0.5 text-xs text-ink-500">{card.subtitle}</p> : null}
                {card.badge ? (
                  <Badge variant="neutral" className="mt-2">
                    {card.badge}
                  </Badge>
                ) : null}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
