type highlightFnType = (index: number) => boolean;

function unpackHighlightedLines(metastring: string | null): highlightFnType {
  const regex = /{([\d,-]+)}/;
  if (!metastring || !regex.test(metastring)) {
    return () => false;
  }

  const lineNumbers = regex
    .exec(metastring)![1]
    .split(',')
    .map((v) => v.split('-').map((val) => parseInt(val, 10)));
  return (index: number) => {
    const line = index + 1;
    return lineNumbers.some(([start, end]) =>
      end ? line >= start && line <= end : line == start,
    );
  };
}

function unpackTitle(metastring: string | null): string {
  const regex = /title=[A-Za-z](.+)/;
  if (!metastring || !regex.test(metastring)) {
    return '';
  }
  return regex.exec(metastring)![0].split('title=')[1];
}

function unpackMetastring(metastring: string | null): {
  highlightLineFn: highlightFnType;
  title: string;
} {
  return {
    highlightLineFn: unpackHighlightedLines(metastring),
    title: unpackTitle(metastring),
  };
}

export { unpackMetastring };
