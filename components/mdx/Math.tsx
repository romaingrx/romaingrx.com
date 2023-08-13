'use client';
import { Tooltip } from '@nextui-org/react';
import clsx from 'clsx';
import { useRef, useCallback, useState } from 'react';

type MathProps = {
  children: React.ReactNode;
  className: string;
  props: any;
};

export default function Math({ children, ...props }: MathProps): JSX.Element {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [tooltipHover, setTooltipHover] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const annotation = spanRef.current?.querySelector('annotation');
    if (annotation) {
      setCopied(true);
      navigator.clipboard.writeText(annotation.textContent || '');
    } else {
      setCopied(false);
    }
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [spanRef]);

  return (
    <>
      <Tooltip
        content={copied ? 'Copied!' : 'Copy to clipboard'}
        placement="top"
        isOpen={tooltipHover}
        showArrow={false}
        size="sm"
        delay={0}
        closeDelay={0}
      >
        <button 
          {...props}
          onMouseEnter={() => setTooltipHover(true)}
          onMouseLeave={() => setTooltipHover(false)}
          onClick={handleCopy}
          disabled={copied}
        >
        <span ref={spanRef} className="relative">
          {children}
        </span>
        </button>
      </Tooltip>
    </>
  );
}
