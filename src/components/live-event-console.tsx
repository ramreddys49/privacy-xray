import { DecisionBadge } from "@/components/decision-badge";
import { PURPOSE_LABELS } from "@/lib/consent-policy";
import { formatEventTime } from "@/lib/events";
import type { PrivacyEvent } from "@/types/privacy";

interface LiveEventConsoleProps {
  events: PrivacyEvent[];
  selectedEventId: string | null;
  onSelect: (eventId: string) => void;
}

const MAX_ROWS = 8;

export function LiveEventConsole({
  events,
  selectedEventId,
  onSelect,
}: LiveEventConsoleProps) {
  const rows = events.slice(0, MAX_ROWS);

  return (
    <section
      id="live-event-stream"
      className="flex h-52 flex-col rounded-xl border border-violet-300/20 bg-black/40 px-3 py-3"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-100">
          Live event console
        </h2>
        <span className="font-mono text-[10px] text-slate-500">
          {rows.length}/{MAX_ROWS}
        </span>
      </div>
      <div className="mt-2 min-h-0 flex-1 overflow-auto">
        {rows.length === 0 ? (
          <p className="px-1 py-6 text-center text-[11px] text-slate-500">
            Waiting for interactions.
          </p>
        ) : (
          <table className="w-full table-fixed border-separate border-spacing-y-1 text-left">
            <thead className="sticky top-0 bg-[#070b14] text-[9px] uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="w-[4.5rem] px-1 py-1 font-medium">Time</th>
                <th className="px-1 py-1 font-medium">Event</th>
                <th className="w-[5.5rem] px-1 py-1 font-medium">Purpose</th>
                <th className="w-[4.6rem] px-1 py-1 font-medium">Decision</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((event) => {
                const selected = event.id === selectedEventId;
                return (
                  <tr key={event.id}>
                    <td colSpan={4} className="p-0">
                      <button
                        type="button"
                        onClick={() => onSelect(event.id)}
                        className={`grid w-full grid-cols-[4.5rem_minmax(0,1fr)_5.5rem_4.6rem] items-center rounded-md px-1 py-1.5 text-left transition ${
                          selected
                            ? "bg-violet-400/20 ring-1 ring-violet-300/45"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <time
                          dateTime={event.timestamp}
                          className="font-mono text-[10px] text-slate-400"
                        >
                          {formatEventTime(event.timestamp)}
                        </time>
                        <span className="truncate font-mono text-[10px] text-slate-200">
                          {event.type}
                        </span>
                        <span className="truncate text-[10px] uppercase tracking-[0.08em] text-slate-400">
                          {PURPOSE_LABELS[event.purpose]}
                        </span>
                        <span className="justify-self-end">
                          <DecisionBadge decision={event.decision} />
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
