import type { Author } from './collections';
import type { Platform } from '@/configs/platforms';
import type { SocialLink } from '@/configs/social';

export function getAuthorsWithSocialLinks({
  authors,
  platform,
}: {
  authors: Author[];
  platform: Platform;
}) {
  return authors.filter((author) => {
    const platform_link = author.data.socialLinks[platform];
    if (!platform_link || !platform_link.handle) {
      return false;
    }
    return true;
  });
}

/** An author's social profiles as a list of links, in schema order. */
export function getAuthorSocialLinks(author: Author): SocialLink[] {
  return Object.entries(author.data.socialLinks).flatMap(([platform, link]) =>
    link
      ? [
          {
            platform: platform as Platform,
            url: link.url,
            label: `${author.data.name} on ${platform}`,
          },
        ]
      : [],
  );
}
