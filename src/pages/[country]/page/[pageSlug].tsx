import { ParsedBlock, processBlockData } from '@src/components/blocks';
import { Content } from '@src/components/blocks/content';
import { defaultLayout } from '@src/components/layouts/default';
import { PageSeo } from '@src/components/page-seo';
import type { NextPageWithLayout } from '@src/pages/_app';

import { ParsedUrlQuery } from 'querystring';
import { PageContextProvider } from '@src/context/page-context';

import PAGE_TEMPLATE from '@public/page.json';

import { ITSPage } from '@src/lib/typesense/types';
import { GetStaticProps, GetStaticPropsContext } from 'next/dist/types';
import { parse } from '@wordpress/block-serialization-default-parser';
import { addIds } from '@src/scripts/utils';
import { getPageBySlug } from '@src/lib/typesense/page';

interface Props {
  country: string;
  blocks: ParsedBlock[];
  page: ITSPage | null;
}

interface Params extends ParsedUrlQuery {
  country: string;
  pageSlug: string;
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context: GetStaticPropsContext<Params>
) => {
  const params = context.params;
  if (!params) {
    return {
      notFound: true,
    };
  }

  const { country, pageSlug } = params;
  const pageData = await getPageBySlug(pageSlug);

  const blocks = addIds(parse(pageData?.rawContent || '') as ParsedBlock[]);

  return {
    props: {
      blocks: await Promise.all(blocks.map((block) => processBlockData(block))),
      page: pageData,
      country,
    },
    revalidate: 43200, // Refresh the generated page every 12 hours,
  };
};

const Page: NextPageWithLayout<Props> = (props: {
  page: ITSPage | null | undefined;
  blocks: string | ParsedBlock[];
}) => {
  if (!props.page) {
    return null;
  }

  return (
    <div className={`page ${props.page.slug}`}>
      {props.page.seoFullHead && <PageSeo seoFullHead={props.page.seoFullHead} />}
      <PageContextProvider page={props.page}>
        <Content
          type="page"
          content={props.page.template ? PAGE_TEMPLATE : props.blocks}
        />
      </PageContextProvider>
    </div>
  );
};

Page.getLayout = defaultLayout;

export default Page;
