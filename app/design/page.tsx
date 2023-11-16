import clsx from 'clsx';
import Layout from '@/components/core/layout';
import {
  ArrowIcon,
  ExternalArrowIcon,
  WarningIcon,
} from '@/components/core/Icon/Icon';
import { StringTheme } from '@/lib/theme';
import Link from '@/components/Link';

import { Callout, BlockQuote, CodeBlock, Button } from '@/components/core';

function ColorPill({ color, name }: { color: string; name: string }) {
  return (
    <div className="flex gap-sm">
      <div
        style={{
          backgroundColor: color,
          border: '2px solid var(--romaingrx-colors-emphasis)',
        }}
        className={clsx('h-12 w-12 rounded-full', color)}
      />
      {name && <span className="my-auto font-wise">{name}</span>}
    </div>
  );
}

function Palette({ color = 'pink' }: { color?: string }) {
  const scales = Array.from({ length: 19 }, (_, i) =>
    ('0' + (i * 5 + 5)).slice(-2),
  );
  return (
    <div className="flex flex-col">
      <span className="font-wise text-2xl">{color}</span>
      <div className="grid w-52 grid-cols-4">
        {scales.map((scale) => (
          <div
            style={{ backgroundColor: `hsl(var(--palette-${color}-${scale}))` }}
            className="relative h-8 w-8 rounded-full"
            key={scale}
          >
            <div
              className="flex h-full w-full flex-col justify-center text-center text-white"
              style={{ mixBlendMode: 'difference' }}
            >
              {scale}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DesignPage() {
  return (
    <>
      <Layout>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h1 className="font-wise text-5xl">Theme colors</h1>
            <h2 className="text-lg">
              romaingrx-
              <StringTheme />
            </h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '2rem',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <ColorPill color="bg-romaingrx-brand" name="brand" />
            <ColorPill color="bg-romaingrx-body" name="body" />
            <ColorPill color="bg-romaingrx-emphasis" name="emphasis" />
            <ColorPill color="bg-romaingrx-header" name="header" />
            <ColorPill color="bg-romaingrx-foreground" name="foreground" />
            <ColorPill
              color="bg-romaingrx-typeface-primary"
              name="typeface-primary"
            />
            <ColorPill
              color="bg-romaingrx-typeface-secondary"
              name="typeface-secondary"
            />
            <ColorPill
              color="bg-romaingrx-typeface-tertiary"
              name="typeface-tertiary"
            />
          </div>
          <h1 className="font-wise text-5xl">Palettes</h1>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '2rem',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Palette color="gray" />
            <Palette color="pink" />
            <Palette color="blue" />
            <Palette color="indigo" />
            <Palette color="red" />
            <Palette color="orange" />
            <Palette color="green" />
            <Palette color="forest" />
          </div>
          <h1 className="font-wise text-5xl">Callouts</h1>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <Callout variant="info">Info</Callout>
            <Callout variant="warning">Warning</Callout>
            <Callout variant="danger">Danger</Callout>
            <Callout variant="success">Success</Callout>
            <Callout
              label={<WarningIcon />}
              css={{
                '--icon-background': 'hsl(var(--palette-orange-10))',
              }}
            >
              Custom
            </Callout>
          </div>
          <BlockQuote screenWidth={true}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </BlockQuote>
          <h1 className="font-wise text-5xl">Buttons</h1>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <Button variant="primary">Primary</Button>
            <Button variant="primary" endIcon={<ExternalArrowIcon />}>
              Primary
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="primary" type="icon">
              <ArrowIcon />
            </Button>
            <Button variant="primary" type="icon" disabled>
              <ArrowIcon />
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="secondary" type="icon">
              <ArrowIcon />
            </Button>
          </div>
          <h1 className="font-wise text-5xl">Typography</h1>
          <h2 className="font-wise text-3xl">Anchors</h2>
          <div className="flex flex-col gap-4">
            <Link href="/">romaingrx.com</Link>
          </div>
          <h1 className="font-wise text-5xl">Code</h1>
          <CodeBlock
            metastring="{3-5} title=Basic example in C++"
            language="cpp"
            codeString={`#include <iostream>

int add(int a, int b){
  return a + b;
}

int main(){
  std::cout << "hello world" << std::endl;
  int c = add(1, 2);
  // 3
}`}
          />
          <h1 className="font-wise text-5xl">List</h1>
          <ul className="list-inside list-disc">
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      </Layout>
    </>
  );
}
