/**
 * Routes configuration for the application
 * This file centralizes all route definitions to avoid hardcoding routes in components
 */

/**
 * Type for a blog post or note slug
 */
export interface SlugParams {
  slug: string;
}

/**
 * Application routes
 */
export const routes = {
  // Main pages
  home: '/',
  about: '/about',
  contact: '/contact',

  // Collection pages
  blogs: '/blog',
  notes: '/notes',

  // Dynamic routes with params
  blog: (params: SlugParams) => `/blog/${params.slug}`,

  note: (params: SlugParams) => `/notes/${params.slug}`,
} as const;

/**
 * Type for the routes object
 * This allows for type checking when using routes in components
 */
export type Routes = typeof routes;
