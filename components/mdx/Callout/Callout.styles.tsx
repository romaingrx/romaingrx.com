import { styled } from "@/design";

export const StyledCalloutIconWrapper = styled('div', {
    position: 'absolute',
    display: 'flex',
    top: '0',
    right: '0',
    transform: 'translate(35%, -35%)',
    borderRadius: '50%',
    padding: '8px',
    width: 'fit-content',
    color: 'var(--romaingrx-colors-body)',
    border: '8px solid var(--romaingrx-colors-body)',
    background: 'var(--icon-background, var(--romaingrx-colors-brand))',

    variants: {
        variant: {
            info: {
                '--icon-background': 'var(--romaingrx-colors-brand)',
            },
            warning: {
                '--icon-background': 'var(--romaingrx-colors-warning)',
            },
            danger: {
                '--icon-background': 'var(--romaingrx-colors-danger)',
            },
            success: {
                '--icon-background': 'var(--romaingrx-colors-success)',
            },
        },
    },
});

const StyledCallout = styled('aside', {
    position: 'relative',
    margin: '15px 20px',
    padding: '30px 30px',
    color: 'var(--romaingrx-colors-typeface-primary)',
    border: '1px solid var(--romaingrx-colors-emphasis)',
    borderRadius: 'var(--space-1)',
    backgroundColor: 'var(--callout-background, var(--romaingrx-colors-emphasis))',

    variants: {
        variant: {
            info: {
                '--callout-background': 'var(--romaingrx-colors-emphasis)',
            },
            warning: {
                '--callout-background': 'var(--romaingrx-colors-warning-emphasis)',
            },
            danger: {
                '--callout-background': 'var(--romaingrx-colors-danger-emphasis)',
            },
            success: {
                '--callout-background': 'var(--romaingrx-colors-success-emphasis)',
            },
        },
    },
});

export { StyledCallout }