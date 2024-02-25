'use client';
import {
  DangerIcon,
  ImportantIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from '@/components/core/Icon/Icon';
import { CalloutProps } from './Callout.types';
import { StyledCallout } from './Callout.styles';
import { IconProps } from '../Icon';

type Variant = NonNullable<CalloutProps['variant']>;
interface DefaultVariant {
  icon: JSX.Element;
  label: string;
}

const defaultSVGprops : IconProps = {
  size: '4',
  strokeWidth: 2,
};

const defaultVariants: Record<Variant, DefaultVariant> = {
  info: {
    icon: <InfoIcon {...defaultSVGprops} />,
    label: 'Info',
  },
  important: {
    icon: <ImportantIcon {...defaultSVGprops} />,
    label: 'Important',
  },
  warning: {
    icon: <WarningIcon {...defaultSVGprops} />,
    label: 'Warning',
  },
  danger: {
    icon: <DangerIcon {...defaultSVGprops} />,
    label: 'Danger',
  },
  success: {
    icon: <SuccessIcon {...defaultSVGprops} />,
    label: 'Success',
  },
};

const CalloutHeader = (props: {
  variant: Variant;
  label: React.ReactNode | string;
  icon: React.ReactNode;
}) => {
  const { variant, label, icon } = props;
  const defaultVariant = defaultVariants[variant] || {};
  const finalIcon = icon || defaultVariant.icon;
  const finalLabel = label || defaultVariant.label;
  return (
    <>
      <div id="header">
        <span id="icon">
          {finalIcon}
        </span>
        <span id="label">{finalLabel}</span>
      </div>
    </>
  );
};

const Callout = (props: CalloutProps) => {
  const { children, variant, icon, label, css } = props;
  console.log({ variant, icon, label });

  if (variant && !defaultVariants[variant]) {
    throw new Error(`Callout: Invalid variant "${variant}"`);
  }

  return (
    <StyledCallout variant={variant} css={css} {...props}>
      <CalloutHeader variant={variant!} icon={icon} label={label} />
      {children}
    </StyledCallout>
  );
};

export default Callout;
