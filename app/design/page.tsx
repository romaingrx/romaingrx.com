'use client'
import clsx from "clsx"
import { styled } from "@/design"
import { Callout } from "@/components/mdx/Callout/Callout"
import Layout from "@/components/layout"

const Button = styled('button', {
    'backgroundColor': 'var(--romaingrx-colors-brand)',
})

function ColorPill({ color = 'bg-romaingrx-brand', name }: { color?: string, name?: string }) {
    return <div className="flex gap-sm"><div style={{ backgroundColor: color }} className={clsx('rounded-full h-12 w-12', color)} />{name && <span className="my-auto">{name}</span>}</div>
}

function Palette({ color = 'pink' }: { color?: string }) {
    const scales = Array.from({ length: 19 }, (_, i) => ("0" + (i * 5 + 5)).slice(-2))
    const palette = scales.map(scale => `hsl(var(--palette-${color}-${scale}))`)
    return <div className="grid grid-cols-4 w-52">{palette.map(bg => <div style={{ backgroundColor: bg }} className='rounded-full h-8 w-8' />)}</div>
}

export default function DesignPage() {
    return (<>
        <Layout>
            <ColorPill color="bg-romaingrx-brand" name="brand" />
            <ColorPill color="bg-romaingrx-emphasis" name="emphasis" />
            <Callout variant="info">Info</Callout>
            <Callout variant="warning">Warning</Callout>
            <h1 className="text-5xl my-6 font-wise">Palettes</h1>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '2rem',
                width: '100%',
                justifyContent: 'center'
            }}>
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
    </>)
}