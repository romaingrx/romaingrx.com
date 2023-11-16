import { styled } from '@/design';

const StyledPre = styled('pre', {
  marginTop: '0',
  marginBottom: '0',
  textAlign: 'left',
  padding: '8px 0px',
  overflow: 'auto',
  borderBottomLeftRadius: 'var(--border-radius-2)',
  borderBottomRightRadius: 'var(--border-radius-2)',
  backgroundColor: 'var(--code-snippet-background)',
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--font-size-1)',
  lineHeight: '26px',

  '.token.parameter,.token.imports,.token.plain,.token.comment,.token.prolog,.token.doctype,.token.cdata':
    {
      color: 'var(--token-comment)',
    },

  '.token.punctuation': {
    color: 'var(--token-punctuation)',
  },

  '.token.property,.token.tag,.token.boolean,.token.number,.token.constant,.token.symbol,.token.deleted':
    {
      color: 'var(--token-symbol)',
    },

  '.token.selector,.token.attr-name,.token.char,.token.builtin,.token.number,.token.string,.token.inserted':
    {
      color: 'var(--token-selector)',
    },

  '.token.operator,.token.entity,.token.url,.language-css .style': {
    color: 'var(--token-operator)',
  },

  '.token.atrule,.token.attr-value,.token.keyword': {
    color: 'var(--token-keyword)',
  },
  '.token.function,.token.maybe-class-name,.token.class-name': {
    color: 'var(--token-function)',
  },

  '.token.regex,.token.important,.token.variable': {
    color: 'var(--token-operator)',
  },
});


const StyledLine = styled('div', {
  display: 'table',
  borderCollapse: 'collapse',
  padding: '0px 14px',
  borderLeft: '3px solid transparent',

  '&.highlight-line': {
    background: 'var(--romaingrx-colors-emphasis)',
    borderColor: 'var(--romaingrx-colors-brand)',
  },

  '&:hover': {
    backgroundColor: 'var(--romaingrx-colors-emphasis)',
  },
});

const StyledLineNo = styled('div', {
  width: '45px',
  padding: '0 12px',
  userSelect: 'none',
  opacity: '1',
  color: 'var(--romaingrx-colors-typeface-tertiary)',
});

const StyledLineContent = styled('span', {
  display: 'table-cell',
  width: '100%',
});

const StyledCodeSnippetTitle = styled('p', {
  marginBlockStart: '0px',
  fontSize: 'var(--font-size-1)',
  marginBottom: '0px',
  color: 'var(--romaingrx-colors-typeface-primary)',
  fontWeight: '500',
});

export {
    StyledPre,
    StyledLine,
    StyledLineNo,
    StyledLineContent,
    StyledCodeSnippetTitle,
}