'use client';

import { Tooltip } from '@nextui-org/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { MotionCheckIcon } from '../icons/motion';
import { CopyIcon } from '../icons/core';

export default function CodeBlock({
  children,
  ...props
}: {
  children: React.ReactNode;
  props: any;
}): JSX.Element {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);
  const [tooltipHover, setTooltipHover] = useState(false);
  const [language, setLanguage] = useState('' as string);

  useEffect(() => {
    if (preRef.current) {
      setLanguage(preRef.current.getAttribute('data-language') || '');
    }
  }, [preRef]);

  const handleCopy = useCallback(() => {
    setCopied(true);
    navigator.clipboard.writeText(preRef.current?.textContent || '');
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [preRef]);
  return (
    <>
      <div
        className={'block-code relative'}
        {...props}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="flex flex-col border-b-1 bg-zinc-100 px-1 font-semibold capitalize dark:border-zinc-700 dark:bg-zinc-900">
          <div className="m-1 flex h-10 flex-row items-center justify-between">
            <span className="text-sm text-zinc-800 dark:text-zinc-100">
              {language}
            </span>
            <Tooltip
              content={copied ? 'Copied!' : 'Copy to clipboard'}
              placement="top"
              isOpen={tooltipHover}
              showArrow={false}
              size="sm"
              delay={0}
              closeDelay={0}
            >
              {hover && (
                <button
                  className={clsx(
                    'hover:border-md right-0 top-0 h-10 w-10 rounded-md p-2 text-sm  hover:shadow-md',
                    copied
                      ? 'text-bob-500'
                      : 'text-zinc-800 dark:text-zinc-100',
                  )}
                  onClick={handleCopy}
                  onMouseEnter={() => setTooltipHover(true)}
                  onMouseLeave={() => setTooltipHover(false)}
                  disabled={copied}
                >
                  {copied ? (
                    <MotionCheckIcon isVisible={copied} strokeWidth={2} />
                  ) : (
                    <CopyIcon size={'md'} strokeWidth={'sm'} />
                  )}
                </button>
              )}
            </Tooltip>
          </div>
        </div>
        <pre ref={preRef} {...props}>
          {children}
        </pre>
      </div>
    </>
  );
}
