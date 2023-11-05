'use client';
import { useInView } from 'framer-motion';
import {
  StyledConnector,
  StyledConnectorChildren,
  StyledConnectorHover,
} from './Connector.styles';
import { ConnectorProps } from './Connector.types';
import { useRef } from 'react';

const Connector = ({ children, ...props }: ConnectorProps) => {
  const connectorRef = useRef(null);
  const inView = useInView(connectorRef, {
    once: true,
  });

  return (
    <StyledConnector {...props} ref={connectorRef}>
      <StyledConnectorHover
        initial={{
          height: '0%',
        }}
        animate={{
          height: inView ? '100%' : '0%',
        }}
        exit={{
          height: '0%',
        }}
        transition={{
          delay: 0.5,
          duration: 1.0,
        }}
      />
      <StyledConnectorChildren>{children}</StyledConnectorChildren>
    </StyledConnector>
  );
};

export { Connector };
