import Link from 'next/link';
import React, { FC } from 'react';

function pageHref(page: number, base: string): string {
  if (page === 1) return base || '/';
  return `${base}/page/${page}`;
}

// Numbered pager: Previous | 1 | 2 | … | N | Next.
function pageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | string)[] = [1];
  if (current > 3) pages.push('…');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p += 1) {
    pages.push(p);
  }
  if (current < total - 2) pages.push('…');
  pages.push(total);
  return pages;
}

type PagerProps = {
  currentPage: number;
  totalPages: number;
  // Listing root: '' for the homepage, '/articles' for the articles list.
  base?: string;
};

// Hidden when there is a single page.
const Pager: FC<PagerProps> = ({ currentPage, totalPages, base = '' }) => {
  if (totalPages <= 1) return null;
  const numbers = pageNumbers(currentPage, totalPages);
  const linkCls = 'text-gray-500 hover:text-gray-700 dark:text-slate-300 dark:hover:text-white';
  const disabledCls = 'text-gray-300 dark:text-slate-600';
  return (
    <nav className="flex gap-3 justify-center items-center my-8" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link href={pageHref(currentPage - 1, base)} className={linkCls}>
          ← Previous
        </Link>
      ) : (
        <span className={disabledCls}>← Previous</span>
      )}
      {numbers.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="text-gray-400">…</span>
        ) : p === currentPage ? (
          <span key={p} className="font-bold text-black dark:text-white">{p}</span>
        ) : (
          <Link key={p} href={pageHref(p as number, base)} className={linkCls}>
            {p}
          </Link>
        ),
      )}
      {currentPage < totalPages ? (
        <Link href={pageHref(currentPage + 1, base)} className={linkCls}>
          Next →
        </Link>
      ) : (
        <span className={disabledCls}>Next →</span>
      )}
    </nav>
  );
};

export default Pager;
