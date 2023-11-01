'use client';
import clsx from 'clsx';
import { styled } from '@/design';
import { Callout } from '@/components/mdx/Callout/Callout';
import Layout from '@/components/layout';
import { WarningIcon } from '@/components/icon/Icon';
import { BlockQuote } from '@/components/mdx/BlockQuote/BlockQuote';

const Button = styled('button', {
  backgroundColor: 'var(--romaingrx-colors-brand)',
});

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
        <div className="my-6 flex flex-col">
          <h1 className="font-wise text-5xl">Theme colors</h1>
          <h2 className="text-lg">romaingrx-light</h2>
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
        <h1 className="my-6 font-wise text-5xl">Palettes</h1>
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
        <h1 className="my-6 font-wise text-5xl">Callouts</h1>
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
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </BlockQuote>
      </Layout>
    </>
  );
}
