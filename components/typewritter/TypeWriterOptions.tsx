import { TypeWriterOptionsType } from "./TypeWriter.types";
import { StyledTypeWriter } from "./TypeWriter.styles";

export function TypeWriterOptions(props: TypeWriterOptionsType) {
    return (<>
        <StyledTypeWriter options={{ ...props, autoStart: true, loop: true }} />
    </>)
}
