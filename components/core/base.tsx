function VR() {
    return <div className="bg-zinc-600/50 dark:bg-zinc-400/50 inline-block my-auto h-4 w-[3px] rounded-full"></div>;
}

type ConditionalWrapperProps = {
    condition: boolean;
    wrapper: (children: React.ReactNode) => React.ReactNode;
    children: React.ReactNode;
}

function ConditionalWrapper({ condition, wrapper, children }: ConditionalWrapperProps): React.ReactNode {
    return condition ? wrapper(children) : children;
}

export {
    VR
}