import { InfoIcon, WarningIcon } from "@/components/icon/Icon";
import { CalloutProps } from "./Callout.types";
import { StyledCallout, StyledCalloutIconWrapper } from "./Callout.styles";

const getVariantIcon = (icon: CalloutProps["variant"]) => {
    switch (icon) {
        case "info":
            return <InfoIcon />;
        case "warning":
            return <WarningIcon />;
        default:
            return null;
    }
}

const Callout = (props: CalloutProps) => {
    const { children, label, variant, css } = props;

    const icon = label || getVariantIcon(variant);

    return (
        <StyledCallout variant={variant} css={css}>
            {icon && <StyledCalloutIconWrapper variant={variant}>{icon}</StyledCalloutIconWrapper>}
            {children}
        </StyledCallout>
    );
}

export { Callout };