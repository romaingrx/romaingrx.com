import clsx from "clsx"

function ColorPill({ color = 'bg-romaingrx-brand', name = 'brand' }: { color?: string, name?: string }) {
    return <div className="flex gap-sm"><div className={clsx('rounded-full h-12 w-12', color)} />{name && <span className="my-auto text-romaingrx-danger-default">{name}</span>}</div>
}

export default function DesignPage() {
    return (<>
        <div className="flex flex-col gap-1">
            <ColorPill color="bg-romaingrx-brand" />
            <ColorPill color="bg-romaingrx-emphasis" />
        </div>
    </>)
}