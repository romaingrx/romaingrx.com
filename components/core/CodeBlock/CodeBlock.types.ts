import { Language } from 'prism-react-renderer';

interface CodeBlockProps {
  codeString: string;
  language: Language;
  metastring: string | null;
}

interface HighlightedCodeTextProps {
  highlightLine: (lineNumber: number) => boolean;
  codeString: string;
  language: Language;
}

export type { CodeBlockProps, HighlightedCodeTextProps };
