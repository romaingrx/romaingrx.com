import React from 'react';
import { CSS } from '@/design';

export type CalloutVariant = 'info' | 'warning' | 'danger' | 'success';

export interface CalloutProps {
    children: React.ReactNode;
    label?: React.ReactNode | string;
    variant?: CalloutVariant;
    css?: CSS;
}
