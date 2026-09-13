import { Accordion } from '@/components/ui';

import Center from './blocks/center.astro';
import BlogLink from './blog-link.astro';
import Callout from './callout.astro';
import Columns from './columns.astro';
import CommentSection from './comments.astro';
import Excalidraw from './excalidraw.astro';
import Hidden from './hidden.astro';
import img from './images/img.astro';
import NumberCard from './number-card.astro';
import TODO from './todo.astro';
import YouTube from './youtube.astro';

/**
 * Components available to blog and note MDX.
 *
 * Keep this registry in a regular module so Vite can scan it without trying
 * to treat an Astro component file as a module entry point.
 */
export const components = {
  BlogLink,
  Callout,
  Columns,
  Excalidraw,
  NumberCard,
  TODO,
  Hidden,
  CommentSection,
  img,
  Center,
  Accordion,
  YouTube,
};
