import { useMemo, useState } from 'react';
import run from '../run.json';

type Interpolation = (typeof run.interpolations)[number];

function StepViewer({ interp }: { interp: Interpolation }) {
  const [step, setStep] = useState(0);
  const nSteps = interp.steps.length;

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

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={nSteps - 1}
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          className="flex-1 accent-foreground"
        />
        <span className="text-muted-foreground text-xs font-mono tabular-nums w-16 text-right">
          {step}/{nSteps - 1}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono">
          z = [{interp.z_steps[step][0].toFixed(2)}, {interp.z_steps[step][1].toFixed(2)}]
        </span>
        <span className="ml-auto">
          {step === 0 ? 'Start' : step === nSteps - 1 ? 'End' : `Step ${step}`}
        </span>
      </div>

      <div className="font-mono text-xs leading-relaxed flex flex-wrap">
        {diffs[step].map((d, i) => (
          <span
            key={i}
            className={`inline-block w-[0.65em] text-center transition-all duration-150 ${
              d.changed
                ? 'text-amber-600 dark:text-amber-400 bg-amber-500/15 rounded-sm font-bold scale-110'
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
          <div className="text-muted-foreground font-medium">Start</div>
          <div className="font-mono text-muted-foreground/60 break-all leading-relaxed">
            {interp.start}
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-muted-foreground font-medium">End</div>
          <div className="font-mono text-muted-foreground/60 break-all leading-relaxed">
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
        <p className="text-muted-foreground text-sm">
          Linear interpolation between two proteins in latent space. Drag the slider to walk through
          decoded sequences. Changed residues highlighted in amber.
        </p>
      </div>

      {run.interpolations.length > 1 && (
        <div className="flex gap-1.5">
          {run.interpolations.map((_, i) => (
            <button
              key={i}
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

      <StepViewer interp={run.interpolations[selected]} />
    </div>
  );
}
