import type { Platform } from '@/configs/platforms';
import type { Author } from './collections';

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
