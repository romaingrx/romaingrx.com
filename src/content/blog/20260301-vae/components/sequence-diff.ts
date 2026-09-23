export type SequencePosition = {
  original: string | null;
  reconstructed: string | null;
  match: boolean;
};

export function buildSequenceDiffPositions(original: string, reconstructed: string) {
  const source = Array.from(original);
  const result = Array.from(reconstructed);

  return Array.from({ length: Math.max(source.length, result.length) }, (_, index) => {
    const sourceChar = source[index] ?? null;
    const resultChar = result[index] ?? null;

    return {
      original: sourceChar,
      reconstructed: resultChar,
      match: sourceChar !== null && sourceChar === resultChar,
    } satisfies SequencePosition;
  });
}
