import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Pager from "@/components/Pager";
import { getSortedPages, getTotalPages, getPagePosts } from "@/lib/pagination";
import { GetStaticProps, NextPage } from "next";
import { IndexProps } from "@/types/types";
import Bio from "@/components/Bio";
import SEO from "@/components/Seo";
import { siteConfig } from "@/site.config";

export const getStaticProps: GetStaticProps = async () => {
  // Homepage is page 1, newest first (fetchPages sorts by published desc)
  const sorted = await getSortedPages();
  const totalPages = getTotalPages(sorted);
  return {
    props: {
      pages: getPagePosts(sorted, 1),
      totalPages,
    },
  };
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { results } = await fetchPages({})
//   return {
//     props: {
//       pages: results ? results : []
//     },
//   }
// }

export const Home: NextPage<IndexProps & { totalPages: number }> = ({ pages, totalPages }) => {
  return (
    <Layout>
      <SEO title={siteConfig.title} />
      <div className="pt-5">
        {/* <h1 className='text-5xl mb-8'>{siteConfig.title}</h1> */}
        {/* Bio */}
        <Bio />
        <div className="grid md:gap-6 mt-10 md:grid-cols-2 w-full my-12">
          {/* Card */}
          {pages.map((page, index) => (
            <Card key={index} page={page} />
          ))}
        </div>
        <Pager currentPage={1} totalPages={totalPages} />
      </div>
    </Layout>
  );
};

export default Home;
