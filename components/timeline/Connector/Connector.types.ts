import { CSS } from "@/design";

interface ConnectorProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  css?: CSS;
}

export type { ConnectorProps };
