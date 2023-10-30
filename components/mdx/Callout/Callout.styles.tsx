import { styled } from "@/design";

export const StyledCalloutIconWrapper = styled('div', {
    display: 'flex',
    top: '-24px',
    right: '-16px',
    borderRadius: '50%',
    padding: '8px',
    color: 'var(--color-bob)',
    border: '8px solid white',
    background: 'var(--icon-background, var(--color-bob))',

    variants: {
        variant: {
            info: {
                '--icon-background': 'var(--romaingrx-colors-emphasis)',
            },
            danger: {
                '--icon-background': 'var(--romaingrx-colors-danger)',
            },
        },
    },
});

const StyledCallout = styled('aside', {
    position: 'relative',
    padding: '30px 30px',
    color: 'var(--romaingrx-colors-typeface-primary)',
    border: '1px solid var(--romaingrx-colors-emphasis)',
    backgroundColor: 'var(--callout-background, var(--romaingrx-colors-emphasis))',

    variants: {
        variant: {
            info: {
                'callout-background': 'var(--romaingrx-colors-emphasis)',
            },
            warning: {
                'callout-background': 'var(--romaingrx-colors-warning-emphasis)',
            },
            danger: {
                'callout-background': 'var(--romaingrx-colors-danger-emphasis)',
            },
            success: {
                'callout-background': 'var(--romaingrx-colors-success-emphasis)',
            },
        },
    },
});

export { StyledCallout }