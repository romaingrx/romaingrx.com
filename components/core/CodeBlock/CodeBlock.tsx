'use client';
import { Card, CardBody, CardHeader, code } from '@nextui-org/react';
import { CodeBlockProps, HighlightedCodeTextProps } from './CodeBlock.types';
import { Prism, Highlight } from 'prism-react-renderer';
import {
  StyledLine,
  StyledLineContent,
  StyledLineNo,
  StyledPre,
} from './CodeBlock.styles';
import CopyButton from '@/components/core/Button/Copy';
import { unpackMetastring } from './utils';

// @ts-ignore
(typeof global !== 'undefined' ? global : window).Prism = Prism;


export const HighlightedCodeText = (props: HighlightedCodeTextProps) => {
  const { codeString, language, highlightLine } = props;

  if (!codeString) return null;

  return (
    <Highlight
      theme={{ plain: {}, styles: [] }}
      code={codeString}
      // @ts-ignore let glsl be a valid language
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <StyledPre className={className} style={style}>
          {tokens.map((line, index) => {
            const { className: lineClassName } = getLineProps({
              className:
                highlightLine && highlightLine(index) ? 'highlight-line' : '',
              key: index,
              line,
            });

            return (
              <StyledLine
                data-testid={
                  highlightLine && highlightLine(index)
                    ? 'highlight-line'
                    : 'line'
                }
                key={index}
                className={lineClassName}
              >
                <StyledLineNo data-testid="number-line">
                  {index + 1}
                </StyledLineNo>
                <StyledLineContent>
                  {line.map((token, key) => {
                    return (
                      <span
                        data-testid="content-line"
                        key={key}
                        {...getTokenProps({
                          key,
                          token,
                        })}
                      />
                    );
                  })}
                </StyledLineContent>
              </StyledLine>
            );
          })}
        </StyledPre>
      )}
    </Highlight>
  );
};

function CodeBlock({ codeString, language, metastring }: CodeBlockProps) {
  const { title, highlightLineFn } = unpackMetastring(metastring);
  // TODO romaingrx : Implement my own card
  return (
    <Card className="w-full p-0" style={{
      overflow: 'visible'
    }}>
      {title ? (
        <CardHeader
          style={{
            padding: '6px 16px',
            borderBottom: '1px solid var(--code-snippet-border)',
            backgroundColor: 'var(--code-snippet-background)',
          }}
        >
          <div className="flex w-full flex-row justify-between">
            <span className="my-auto">{title}</span>
            <CopyButton value={codeString} />
          </div>
        </CardHeader>
      ) : null}
      <CardBody className="p-0">
        <HighlightedCodeText
          codeString={codeString}
          language={language}
          highlightLine={highlightLineFn}
        />
      </CardBody>
    </Card>
  );
}

export { CodeBlock };
