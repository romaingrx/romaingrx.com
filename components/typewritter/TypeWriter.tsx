import { TypeWriterOptionsType } from './TypeWriter.types';
import { StyledTypeWriter } from './TypeWriter.styles';

function TypeWriter({ css, ...props }: TypeWriterOptionsType) {
  return (
    <>
      <StyledTypeWriter
        css={css}
        options={{ ...props, autoStart: true, loop: true }}
      />
    </>
  );
}

export default TypeWriter;