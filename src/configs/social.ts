import type { Platform } from './platforms';

export interface SocialLink {
  platform: Platform;
  url: string;
  label: string;
}

export const socialLinks: SocialLink[] = [
  {
    platform: 'github',
    url: 'https://go.romaingrx.com/github',
    label: 'Follow on GitHub',
  },
  {
    platform: 'twitter',
    url: 'https://go.romaingrx.com/x',
    label: 'Follow on X',
  },
  {
    platform: 'linkedin',
    url: 'https://go.romaingrx.com/linkedin',
    label: 'Connect on LinkedIn',
  },
  {
    platform: 'huggingface',
    url: 'https://go.romaingrx.com/huggingface',
    label: 'Follow on Hugging Face',
  },
];
