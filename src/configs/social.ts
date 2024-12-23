export interface SocialLink {
  platform: string;
  url: string;
  label: string;
  icon: string;
}

export const socialLinks: SocialLink[] = [
  {
    platform: 'github',
    url: 'https://github.com/romaingrx',
    label: 'Follow on GitHub',
    icon: 'github',
  },
  {
    platform: 'twitter',
    url: 'https://twitter.com/romaingrx',
    label: 'Follow on Twitter',
    icon: 'twitter',
  },
  {
    platform: 'linkedin',
    url: 'https://linkedin.com/in/romaingrx',
    label: 'Connect on LinkedIn',
    icon: 'linkedin',
  },
];
