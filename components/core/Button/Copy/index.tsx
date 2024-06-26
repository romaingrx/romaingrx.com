'use client';
import { IconProps } from '@/components/core/Icon/Icon.types';
import { ButtonProps } from '../Button.types';
import Button from '../Button';
import { useCallback, useState } from 'react';
import { CopyIcon } from '@/components/core/Icon/Icon';
import { MotionCheckIcon } from '@/components/core/Icon/motion';

interface CopyButtonProps extends ButtonProps {
  value: string;
  delay?: number;
  iconProps?: IconProps;
}

function CopyButton({
  value,
  iconProps,
  delay = 2000,
  ...props
}: CopyButtonProps): JSX.Element {
  const [isCopied, setCopied] = useState<boolean>(false);
  const handleCopy = useCallback(() => {
    setCopied(true);
    navigator.clipboard.writeText(value || '');
    setTimeout(() => {
      setCopied(false);
    }, delay);
  }, [delay, value]);

  return (
    <Button
      {...props}
      onClick={handleCopy}
      contentType="icon"
      disabled={isCopied}
      aria-checked={isCopied}
      aria-label={isCopied ? 'Text copied' : 'Copy text to clipboard'}
    >
      {isCopied ? <MotionCheckIcon isVisible={true} /> : <CopyIcon />}
    </Button>
  );
}

export default CopyButton;
