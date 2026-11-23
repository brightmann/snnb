import { fetchPages } from '../utils/notion';

export const POSTS_PER_PAGE = 5;

// fetchPages already sorts by `published` descending server-side.
export async function getSortedPages(): Promise<any[]> {
  const { results } = await fetchPages({});
  return results || [];
}

export function getTotalPages(pages: any[]): number {
  return Math.max(1, Math.ceil(pages.length / POSTS_PER_PAGE));
}

export function getPagePosts(pages: any[], page: number): any[] {
  const start = (page - 1) * POSTS_PER_PAGE;
  return pages.slice(start, start + POSTS_PER_PAGE);
}
