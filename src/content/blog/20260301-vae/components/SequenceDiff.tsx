import { useMemo } from 'react';

import run from '../run.json';
import { buildSequenceDiffPositions } from './sequence-diff';

type Reconstruction = (typeof run.reconstructions)[number];

function DiffRow({ recon }: { recon: Reconstruction }) {
  const chars = useMemo(() => {
    return buildSequenceDiffPositions(recon.original, recon.reconstructed);
  }, [recon]);

  const pct = Math.round(recon.accuracy * 100);
  const statusColor =
    pct >= 80
      ? 'bg-status-success/15 text-status-success'
      : pct >= 50
        ? 'bg-status-warning/15 text-status-warning'
        : 'bg-status-error/15 text-status-error';
  const progressColor =
    pct >= 80 ? 'bg-status-success' : pct >= 50 ? 'bg-status-warning' : 'bg-status-error';

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}
        >
          {pct}% match
        </span>
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
          <div
            role="progressbar"
            aria-label="Sequence match accuracy"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            className={`h-full rounded-full transition-all ${progressColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="mb-2 text-xs text-muted-foreground">
        Each position: source / reconstruction / status
      </div>
      <div
        className="flex flex-wrap gap-1 font-mono text-xs leading-relaxed"
        role="list"
        aria-label="Sequence differences by position"
      >
        {chars.map((char, index) => (
          <div
            key={index}
            role="listitem"
            aria-label={`Position ${index + 1}: source ${char.original ?? 'none'}, reconstructed ${char.reconstructed ?? 'none'}, ${char.match ? 'match' : 'mismatch'}`}
            className="flex min-w-9 flex-col items-center rounded-sm border border-border/60 px-1 py-1"
          >
            <span className="text-muted-foreground">{char.original ?? '—'}</span>
            <span className={char.match ? 'text-status-success' : 'font-bold text-status-error'}>
              {char.reconstructed ?? '—'}
            </span>
            <span
              className={
                char.match
                  ? 'text-[0.625rem] text-status-success'
                  : 'text-[0.625rem] font-semibold text-status-error'
              }
            >
              {char.match ? 'Match' : 'Mismatch'}
            </span>
          </div>
        ))}
        {chars.length === 0 && (
          <span className="text-sm text-muted-foreground">No residues to compare.</span>
        )}
      </div>
    </div>
  );
}

export default function SequenceDiff() {
  const sorted = useMemo(() => run.reconstructions.toSorted((a, b) => b.accuracy - a.accuracy), []);

  return (
    <div className="my-4 space-y-3">
      <div>
        <h4 className="text-sm font-medium">Sequence reconstruction</h4>
        <p className="text-sm text-muted-foreground">
          Original (src) vs reconstructed (rec) amino acid sequences. Every residue position stays
          grouped as sequences wrap; missing and extra residues count as mismatches.
        </p>
      </div>
      {sorted.slice(0, 5).map((recon) => (
        <DiffRow key={recon.original} recon={recon} />
      ))}
    </div>
  );
}
