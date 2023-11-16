import dynamic from 'next/dynamic';
import Math from './Math';
import { default as _Link } from '../core/Link';

const Pre = dynamic(() => import('@/components/core/CodeBlock/Pre'));
const Callout = dynamic(() => import('@/components/core/Callout'));
const BlockQuote = dynamic(() => import('@/components/core/BlockQuote'));

const mdxComponents = {
  pre: Pre,
  span: (props: any) => {
    if (props.className?.split(' ').includes('math')) {
      return <Math {...props} />;
    }
    return <span {...props} />;
  },
  a: _Link,
  Callout,
  BlockQuote,
};

export default mdxComponents;
