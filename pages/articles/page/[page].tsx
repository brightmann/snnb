import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import Pager from '@/components/Pager'
import { getSortedPages, getTotalPages, getPagePosts } from '@/lib/pagination'
import { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import { IndexProps } from '@/types/types'
import Bio from '@/components/Bio'
import SEO from '@/components/Seo'
import { siteConfig } from '@/site.config'
import { ParsedUrlQuery } from 'querystring'
import Head from 'next/head'
import Link from 'next/link'

interface IParams extends ParsedUrlQuery {
  page: string
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { page } = ctx.params as IParams;
  const pageNum = Number(page);
  const sorted = await getSortedPages();
  const totalPages = getTotalPages(sorted);
  if (!Number.isInteger(pageNum) || pageNum < 1 || pageNum > totalPages) {
    return { notFound: true };
  }
  return {
    props: {
      pages: getPagePosts(sorted, pageNum),
      currentPage: pageNum,
      totalPages,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const sorted = await getSortedPages();
  const totalPages = getTotalPages(sorted);
  const paths = [];
  for (let p = 1; p <= totalPages; p += 1) {
    paths.push({ params: { page: String(p) } });
  }
  return {
    paths,
    fallback: false,
  };
};

const Page: NextPage<IndexProps & { currentPage: number; totalPages: number }> = ({ pages, currentPage, totalPages }) => {
  const router = useRouter();
  // Page 1 lives at /articles — send visitors there (static export
  // cannot return a redirect from getStaticProps, so redirect
  // client-side). router.replace and router.basePath are basePath-aware.
  useEffect(() => {
    if (currentPage === 1) {
      router.replace('/articles');
    }
  }, [currentPage, router]);
  if (currentPage === 1) {
    const home = router.basePath ? `${router.basePath}/articles` : '/articles';
    return (
      <Layout>
        <Head>
          <meta httpEquiv="refresh" content={`0; url=${home}`} />
        </Head>
        <div className='pt-5'>
          <p>Redirecting to <Link href='/articles'><a>Articles</a></Link>…</p>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <SEO title={siteConfig.title} />
      <div className='pt-5'>
        <div className=' grid gap-6 mt-10 w-full my-12'>
          {pages.map((page, index) => (
            <Card key={index} page={page} />
          ))}
        </div>
        <Pager currentPage={currentPage} totalPages={totalPages} base='/articles' />
      </div>
    </Layout>
  )
}

export default Page
