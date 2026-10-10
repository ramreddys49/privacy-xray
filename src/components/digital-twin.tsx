"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  profileStrength,
  rankedInterests,
  relativeUpdated,
  type RankedInterest,
} from "@/lib/experience";
import type { InterestProfile, PipelineContext } from "@/types/privacy";

interface DigitalTwinProps {
  profile: InterestProfile;
  analyticsEnabled: boolean;
  pipelineContext: PipelineContext | null;
}

const RANK_LABELS = ["Primary Interest", "Secondary Interest", "Emerging Interest"] as const;

function DigitalTwinComponent({
  profile,
  analyticsEnabled,
  pipelineContext,
}: DigitalTwinProps) {
  const previousPercents = useRef<Record<string, number>>({});
  const previousRaw = useRef<Record<string, number>>({});
  const [deltas, setDeltas] = useState<Partial<Record<string, number>>>({});
  const [changed, setChanged] = useState<Partial<Record<string, boolean>>>({});
  const [now, setNow] = useState(0);
  const ranked = useMemo(() => rankedInterests(profile), [profile]);
  const visible = ranked.filter((category) => category.raw > 0).slice(0, 3);
  const hasSignal = visible.length > 0;
  const strength = profileStrength(profile);

  useEffect(() => {
    const start = window.setTimeout(() => setNow(Date.now()), 0);
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const show = window.setTimeout(() => {
      const next: Partial<Record<string, number>> = {};
      const touched: Partial<Record<string, boolean>> = {};
      for (const category of ranked) {
        const beforePercent = previousPercents.current[category.id];
        const beforeRaw = previousRaw.current[category.id];
        if (beforePercent !== undefined && category.percent !== beforePercent) {
          next[category.id] = category.percent - beforePercent;
        }
        if (beforeRaw !== undefined && category.raw !== beforeRaw) {
          touched[category.id] = true;
        }
      }
      previousPercents.current = Object.fromEntries(
        ranked.map((category) => [category.id, category.percent]),
      );
      previousRaw.current = Object.fromEntries(
        ranked.map((category) => [category.id, category.raw]),
      );
      setDeltas(next);
      setChanged(touched);
    }, 0);
    const hide = window.setTimeout(() => {
      setDeltas({});
      setChanged({});
    }, 1400);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [ranked]);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4" aria-live="polite">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
        Digital twin
      </h2>
      <p className="mt-1 text-[11px] leading-5 text-slate-500">
        What this site currently believes
      </p>

      {!analyticsEnabled ? (
        <div className="mt-3 rounded-xl border border-amber-300/25 bg-amber-400/10 px-3 py-2.5">
          <p className="text-sm font-medium text-amber-100">Profiling paused</p>
          <p className="mt-1 text-[11px] leading-5 text-amber-100/75">
            Interactions still happen, but analytics processing is blocked. The
            profile does not learn from new events.
          </p>
        </div>
      ) : !hasSignal ? (
        <p className="mt-3 text-sm text-slate-300">No behavioral profile yet.</p>
      ) : (
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          {visible.map((category, index) => (
            <div
              key={category.id}
              className="rounded-xl border border-white/8 bg-black/20 px-3 py-2"
            >
              <dt className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                {RANK_LABELS[index]}
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-50">
                {category.title}
              </dd>
            </div>
          ))}
          <div className="rounded-xl border border-white/8 bg-black/20 px-3 py-2">
            <dt className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
              Profile Strength
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-50">{strength}</dd>
          </div>
          <div className="rounded-xl border border-white/8 bg-black/20 px-3 py-2">
            <dt className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
              Updated
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-50">
              {now === 0
                ? "—"
                : relativeUpdated(pipelineContext?.event.timestamp, now)}
            </dd>
          </div>
        </dl>
      )}

      <ul className="mt-3 space-y-2">
        {(hasSignal ? visible : ranked.slice(0, 3)).map((category) => (
          <InterestRow
            key={category.id}
            category={category}
            delta={deltas[category.id] ?? 0}
            highlight={Boolean(changed[category.id])}
            muted={!analyticsEnabled}
            empty={!hasSignal}
          />
        ))}
      </ul>
    </section>
  );
}

function InterestRow({
  category,
  delta,
  highlight,
  muted,
  empty,
}: {
  category: RankedInterest;
  delta: number;
  highlight: boolean;
  muted: boolean;
  empty: boolean;
}) {

  return (
    <li
      className={`rounded-xl px-1 py-1 transition-colors duration-500 ${
        highlight ? "bg-cyan-400/8 ring-1 ring-cyan-300/25" : ""
      }`}
    >
      <div className="mb-1 flex items-center justify-between gap-2 text-[12px]">
        <span className="text-slate-200">{category.title}</span>
        <span className="flex items-center gap-2 font-mono text-slate-300">
          {delta !== 0 ? (
            <span className="delta-fade text-[10px] text-cyan-200">
              {delta > 0 ? `↑ +${delta}` : `↓ ${delta}`}
            </span>
          ) : null}
          {empty ? "0%" : `${category.percent}%`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${empty ? 0 : category.percent}%`,
            background: muted ? "#64748b" : category.accent,
            opacity: muted ? 0.5 : 1,
          }}
        />
      </div>
    </li>
  );
}

export const DigitalTwin = memo(DigitalTwinComponent);
