'use client';
import clsx from 'clsx';
import { styled } from '@/design';
import { Callout } from '@/components/mdx/Callout/Callout';
import Layout from '@/components/layout';

const Button = styled('button', {
  backgroundColor: 'var(--romaingrx-colors-brand)',
});

function ColorPill({
  color = 'bg-romaingrx-brand',
  name,
}: {
  color?: string;
  name?: string;
}) {
  return (
    <div className="flex gap-sm">
      <div
        style={{ backgroundColor: color }}
        className={clsx('h-12 w-12 rounded-full', color)}
      />
      {name && <span className="my-auto">{name}</span>}
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
          >
            <div className='w-full h-full flex flex-col text-center justify-center text-white' style={{mixBlendMode: "difference"}}>{scale}</div>
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
        <ColorPill color="bg-romaingrx-brand" name="brand" />
        <ColorPill color="bg-romaingrx-emphasis" name="emphasis" />
        <h1 className="my-6 font-wise text-5xl">Callouts</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <Callout variant="info">Info</Callout>
          <Callout variant="warning">Warning</Callout>
          <Callout variant="danger">Danger</Callout>
          <Callout variant="success">Success</Callout>
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
      </Layout>
    </>
  );
}
