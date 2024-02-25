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
import type { MDXComponents } from 'mdx/types';
import { Component, DetailedHTMLProps } from 'react';
import { ArrowIcon } from '../core/Icon/Icon';
import clsx from 'clsx';

const Pre = dynamic(() => import('@/components/core/CodeBlock/Pre'));

const mdxComponents: MDXComponents = {
  pre: Pre,
  span: (props: React.HTMLAttributes<HTMLSpanElement>) => {
    if (props.className?.split(' ').includes('math')) {
      return <Math {...props} />;
    }
    return <span {...props} />;
  },
  a: (
    props: DetailedHTMLProps<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
  ) => {
    if (!props.href) return <a {...props} />;
    return (
      <Link
        href={props.href}
        variant={'underline'}
        className={clsx('inline-block w-fit', props.className)}
        {...props}
      >
        {props.children}
      </Link>
    );
  },
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
