import { useMemo } from 'react';
import run from '../run.json';

type Reconstruction = (typeof run.reconstructions)[number];

function DiffRow({ recon }: { recon: Reconstruction }) {
  const chars = useMemo(() => {
    const orig = recon.original.split('');
    const reco = recon.reconstructed.split('');
    return orig.map((o, i) => ({
      original: o,
      reconstructed: reco[i] ?? '?',
      match: o === reco[i],
    }));
  }, [recon]);

  const pct = Math.round(recon.accuracy * 100);

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              pct >= 80
                ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                : pct >= 50
                  ? 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400'
                  : 'bg-red-500/15 text-red-600 dark:text-red-400'
            }`}
          >
            {pct}% match
          </span>
        </div>
        <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="font-mono text-xs leading-relaxed space-y-0.5">
        <div className="flex flex-wrap">
          <span className="text-muted-foreground w-8 shrink-0 select-none">src</span>
          {chars.map((c, i) => (
            <span
              key={i}
              className={`inline-block w-[0.65em] text-center ${
                c.match ? 'text-muted-foreground' : 'text-red-600 dark:text-red-400 font-bold'
              }`}
            >
              {c.original}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap">
          <span className="text-muted-foreground w-8 shrink-0 select-none">rec</span>
          {chars.map((c, i) => (
            <span
              key={i}
              className={`inline-block w-[0.65em] text-center ${
                c.match
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400 bg-red-500/10 rounded-sm font-bold'
              }`}
            >
              {c.reconstructed}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap">
          <span className="w-8 shrink-0" />
          {chars.map((c, i) => (
            <span
              key={i}
              className={`inline-block w-[0.65em] text-center ${
                c.match
                  ? 'text-green-600/40 dark:text-green-400/40'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {c.match ? '·' : '×'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SequenceDiff() {
  const sorted = useMemo(
    () => [...run.reconstructions].sort((a, b) => b.accuracy - a.accuracy),
    []
  );

  return (
    <div className="my-4 space-y-3">
      <div>
        <h4 className="text-sm font-medium">Sequence reconstruction</h4>
        <p className="text-muted-foreground text-sm">
          Original (src) vs reconstructed (rec) amino acid sequences. Mismatches highlighted in red.
        </p>
      </div>
      {sorted.slice(0, 5).map((recon, i) => (
        <DiffRow key={i} recon={recon} />
      ))}
    </div>
  );
}
