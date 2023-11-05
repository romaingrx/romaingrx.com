'use client';
import { useScroll, useSpring, useTransform } from 'framer-motion';
import { StyledConnector, StyledConnectorHover } from './Connector.styles';
import { ConnectorProps } from './Connector.types';
import { useEffect, useRef } from 'react';

const Connector = ({ children, ...rest }: ConnectorProps) => {
  const connectorRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: connectorRef,
    offset: ['start center', 'center center'],
  });

  const scrollYSpringProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
  });
  const connectorHeight = useTransform(
    scrollYSpringProgress,
    [0, 0.75],
    ['0%', '100%'],
  );

  return (
    <StyledConnector {...rest} ref={connectorRef}>
      <StyledConnectorHover
        style={{
          height: connectorHeight,
        }}
      />
    </StyledConnector>
  );
};

export { Connector };
