import dynamic from 'next/dynamic';
import Math from './Math';

import {
  Text,
  EM,
  H1,
  H2,
  H3,
  Strong,
  Link,
  Callout,
  BlockQuote,
} from '@/components/core';

const Pre = dynamic(() => import('@/components/core/CodeBlock/Pre'));

const mdxComponents = {
  pre: Pre,
  span: (props: React.HTMLAttributes<HTMLSpanElement>) => {
    if (props.className?.split(' ').includes('math')) {
      return <Math {...props} />;
    }
    return <span {...props} />;
  },
  a: Link,
  Callout,
  BlockQuote,
  h1: H1,
  h2: H2,
  h3: H3,
  em: EM,
  strong: Strong,
  p: Text,
};

export default mdxComponents;
