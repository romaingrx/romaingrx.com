'use client'
import clsx from "clsx"
import { styled } from "@/design"
import { Callout } from "@/components/mdx/Callout/Callout"

const Button = styled('button', {
    'backgroundColor': 'var(--romaingrx-colors-brand)',
})

function ColorPill({ color = 'bg-romaingrx-brand', name = 'brand' }: { color?: string, name?: string }) {
    return <div className="flex gap-sm"><div className={clsx('rounded-full h-12 w-12', color)} />{name && <span className="my-auto">{name}</span>}</div>
}

export default function DesignPage() {
    return (<>
        <div className="flex flex-col gap-1">
            <ColorPill color="bg-romaingrx-brand" name="brand"/>
            <ColorPill color="bg-romaingrx-emphasis" name="emphasis"/>
            <Callout variant="info">Info</Callout>
            <Callout variant="warning">Warning</Callout>
        </div>
    </>)
}