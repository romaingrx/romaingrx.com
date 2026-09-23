import { useMemo, useState } from 'react';

import run from '../run.json';

type Interpolation = (typeof run.interpolations)[number];

function StepViewer({ interp }: { interp: Interpolation }) {
  const [step, setStep] = useState(0);
  const nSteps = interp.steps.length;
  const currentStep = nSteps === 0 ? 0 : Math.min(step, nSteps - 1);
  const latent = interp.z_steps[currentStep] ?? [0, 0];

  const diffs = useMemo(() => {
    return interp.steps.map((seq, stepIdx) => {
      const prev = stepIdx > 0 ? interp.steps[stepIdx - 1] : seq;
      return seq.split('').map((aa, i) => ({
        char: aa,
        changed: prev[i] !== aa,
        isStart: aa === interp.start[i],
        isEnd: aa === interp.end[i],
      }));
    });
  }, [interp]);

  if (nSteps === 0) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        No interpolation steps are available.
      </p>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4" data-pagefind-ignore>
      {nSteps > 1 ? (
        <div className="flex items-center gap-3" data-pagefind-ignore>
          <input
            type="range"
            min={0}
            max={nSteps - 1}
            value={currentStep}
            aria-label="Latent interpolation step"
            aria-valuetext={`Step ${currentStep + 1} of ${nSteps}; latent coordinates ${latent[0].toFixed(2)}, ${latent[1].toFixed(2)}`}
            onChange={(event) => setStep(Number(event.target.value))}
            className="h-11 flex-1 accent-foreground"
          />
          <output className="w-16 text-right font-mono text-xs text-muted-foreground tabular-nums">
            {currentStep + 1}/{nSteps}
          </output>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground" data-pagefind-ignore>
          Only interpolation step 1 of 1 is available.
        </p>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground" data-pagefind-ignore>
        <output className="font-mono">
          z = [{latent[0].toFixed(2)}, {latent[1].toFixed(2)}]
        </output>
        <span className="ml-auto">
          {currentStep === 0
            ? 'Start'
            : currentStep === nSteps - 1
              ? 'End'
              : `Step ${currentStep + 1}`}
        </span>
      </div>

      <div className="flex flex-wrap font-mono text-xs leading-relaxed" data-pagefind-ignore>
        {diffs[currentStep].map((d, i) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={`${i}-${d.char}`}
            className={`inline-block w-[0.65em] text-center transition-all duration-150 ${
              d.changed
                ? 'scale-110 rounded-sm bg-amber-500/15 font-bold text-amber-600 dark:text-amber-400'
                : d.isStart && d.isEnd
                  ? 'text-muted-foreground'
                  : d.isEnd
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-foreground'
            }`}
          >
            {d.char}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="space-y-0.5">
          <div className="font-medium text-muted-foreground">Start</div>
          <div className="font-mono leading-relaxed break-all text-muted-foreground/60">
            {interp.start}
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="font-medium text-muted-foreground">End</div>
          <div className="font-mono leading-relaxed break-all text-muted-foreground/60">
            {interp.end}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InterpolationViewer() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="my-4 space-y-3">
      <div>
        <h4 className="text-sm font-medium">Latent space interpolation</h4>
        <p className="text-sm text-muted-foreground">
          Linear interpolation between two proteins in latent space. Drag the slider to walk through
          decoded sequences. Changed residues highlighted in amber.
        </p>
      </div>

      {run.interpolations.length > 1 && (
        <div className="flex gap-1.5">
          {run.interpolations.map((interp, i) => (
            <button
              key={`${interp.start.slice(0, 8)}-${interp.end.slice(0, 8)}`}
              type="button"
              aria-pressed={selected === i}
              onClick={() => setSelected(i)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                selected === i
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Pair {i + 1}
            </button>
          ))}
        </div>
      )}

      {run.interpolations[selected] ? (
        <StepViewer
          key={`${run.interpolations[selected].start}-${run.interpolations[selected].end}`}
          interp={run.interpolations[selected]}
        />
      ) : (
        <p role="status" className="text-sm text-muted-foreground">
          No interpolation examples are available.
        </p>
      )}
    </div>
  );
}
