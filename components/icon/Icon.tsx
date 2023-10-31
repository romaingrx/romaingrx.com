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
    <path d="M12 10L12 14" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M3.44722 18.1056L10.2111 4.57771C10.9482 3.10361 13.0518 3.10362 13.7889 4.57771L20.5528 18.1056C21.2177 19.4354 20.2507 21 18.7639 21H5.23607C3.7493 21 2.78231 19.4354 3.44722 18.1056Z"
      stroke-linecap="round"
      stroke-linejoin="round"
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
