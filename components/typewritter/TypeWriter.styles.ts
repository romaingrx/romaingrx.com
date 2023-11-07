import TypeWriter from 'typewriter-effect';
import { styled } from '@/design';

export const StyledTypeWriter = styled(TypeWriter, {
    "&& .Typewriter__wrapper": {
        color: 'var(--romaingrx-colors-brand)',
    }
});
