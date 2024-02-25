import { StyledSVG } from './Icon.styles';
import { IconProps } from './Icon.types';

export const InfoIcon = (props: IconProps) => (
  <StyledSVG
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    stroke="currentColor"
    strokeWidth="2"
    role="img"
    {...props}
  >
    <title>Info icon</title>
    <circle cx="11" cy="11" r="10" />
    <path d="M11 7v6M11 15h0" />
    <circle cx="11" cy="15" r="0.5" fill="currentColor" />
  </StyledSVG>
);

export const WarningIcon = (props: IconProps) => (
  <StyledSVG
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    role="img"
    {...props}
  >
    <title>Warning icon</title>
    <path d="M12 10L12 14" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M3.44722 18.1056L10.2111 4.57771C10.9482 3.10361 13.0518 3.10362 13.7889 4.57771L20.5528 18.1056C21.2177 19.4354 20.2507 21 18.7639 21H5.23607C3.7493 21 2.78231 19.4354 3.44722 18.1056Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" />
  </StyledSVG>
);

export const SuccessIcon = (props: IconProps) => (
  <StyledSVG
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="-3.6 -3.6 43.20 43.20"
    stroke="currentColor"
    strokeWidth="2"
    role="img"
    {...props}
  >
    <title>Success icon</title>
    <path
      d="M34.459 1.375a2.999 2.999 0 0 0-4.149.884L13.5 28.17l-8.198-7.58a2.999 2.999 0 1 0-4.073 4.405l10.764 9.952s.309.266.452.359a2.999 2.999 0 0 0 4.15-.884L35.343 5.524a2.999 2.999 0 0 0-.884-4.149z"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
    />
  </StyledSVG>
);

export const QuoteIcon = (props: IconProps) => (
  <StyledSVG
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 -5 34 34"
    stroke="currentColor"
    {...props}
  >
    <title>Quote icon</title>
    <path
      d="m31.2 0h-7.2l-4.8 9.6v14.4h14.4v-14.4h-7.2zm-19.2 0h-7.2l-4.8 9.6v14.4h14.4v-14.4h-7.2z"
      fill="currentColor"
    />
  </StyledSVG>
);

export const ArrowIcon = ({
  angle = 0,
  title = 'Arrow icon',
  ...props
}: IconProps & { angle?: number; title?: string }) => (
  <StyledSVG
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    role="img"
    {...props}
  >
    <title>{title}</title>
    <path d="M5 12h14M12 5l7 7-7 7" transform={`rotate(${-angle} 12 12)`} />
  </StyledSVG>
);

export const ExternalArrowIcon = (props: IconProps) =>
  ArrowIcon({ angle: 45, title: 'External arrow icon', ...props });

export const CopyIcon = (props: IconProps) => (
  <StyledSVG viewBox="0 0 24 24" {...props}>
    <path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" />
    <path d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" />
  </StyledSVG>
);

export const ImportantIcon = (props: IconProps) => (
  <StyledSVG viewBox="0 0 16 16" {...props}>
    <title>Important</title>
    <path
      fill="currentColor"
      stroke="none"
      d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
    />
  </StyledSVG>
);

export const DangerIcon = (props: IconProps) => (
  <StyledSVG viewBox="0 0 16 16" {...props}>
    <path
      fill="currentColor"
      stroke="none"
      d="M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
    />
  </StyledSVG>
);
