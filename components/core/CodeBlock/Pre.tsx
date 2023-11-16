"use client"
import { ReactElement } from 'react';
import CodeBlock from '.';
import { CodeBlockProps } from './CodeBlock.types';
import { Language } from 'prism-react-renderer';

interface PreProps {
  children?: React.ReactNode;
}

function translateProps({ children }: PreProps): CodeBlockProps {
  children = children as
    | ReactElement<any, string | React.JSXElementConstructor<any>>
    | undefined;
  if (!children || !children.props) {
    return { codeString: '', language: '', metastring: '' };
  }

  const { children: codeString, className = '', ...props } = children.props;

  const languageMatch = className.match(/language-(?<lang>.*)/);
  const language = (languageMatch?.groups?.lang || '') as Language;

  return {
    codeString: codeString?.trim(),
    language,
    ...props,
  };
}

function Pre(props: PreProps) {
  const extractedProps = translateProps(props);
  return <CodeBlock {...extractedProps} />;
}

export default Pre;
