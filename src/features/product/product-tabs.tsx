import dynamic from 'next/dynamic';
import { isArray, unset } from 'lodash';

import { cn } from '@src/lib/helpers/helper';
import { useProductContext } from '@src/context/product-context';
import { useSiteContext } from '@src/context/site-context';
import { ACCORDION_TYPE } from '@src/lib/helpers/constants';
import { ProductSettings } from '@src/models/settings/product';
import { useReviewsCount } from '@src/lib/hooks';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { useEffect } from 'react';

const Accordion = dynamic(() => import('@src/components/accordion').then((mod) => mod.Accordion));

const Tabs = dynamic(() => import('@src/components/tabs').then((mod) => mod.Tabs));

const Review = dynamic(() => import('@src/features/product/reviews'));

type TProductTabs = {
  style?: 'accordion' | 'tabs';
  className?: string;
};

export const ProductTabs = ({ style, className }: TProductTabs) => {
  const { product, additionalData } = useProductContext();
  const { settings } = useSiteContext();
  const { layout } = settings?.product as ProductSettings;

  const reviewsCount = useReviewsCount();

  if (!product) return null;

  if (layout?.descriptionTabLocation !== '1') return null;

  const [description, ...otherTabs] = [...(product?.tabs || [])];

  const defaultTabItems = otherTabs.filter(
    (item) => item.location === 'default' || item.location === ''
  );

  const reviewsTab = {
    title: 'Customer Reviews',
    content: (
      <Review
        product={product}
        sku={product?.sku as string}
      />
    ),
    isOpen: reviewsCount > 0 ? true : false,
  };

  if (settings?.product?.descriptionAfterContent) {
    description.content = (
      <>
        {description.content}
        <p className="block h-10"></p>
        <ReactHTMLParser html={settings?.product?.descriptionAfterContent as string} />
      </>
    );
  }

  let tabData = [];

  if (layout?.descriptionTabLocation === '1') {
    tabData.push(description);
  }

  // implement additionalTabs from product
  if (isArray(product.additionalTabs) && product.additionalTabs?.length > 0) {
    tabData.push(
      ...product.additionalTabs.map((tab) => {
        return {
          title: tab.title,
          content: (
            <>
              <ReactHTMLParser html={tab.content as string} />
              {product?.metaData?.acf?.button_link && product?.metaData?.acf?.button_text && (
                <a
                  href={product?.metaData?.acf?.button_link}
                  className="mt-4 inline-block !text-foreground border border-foreground py-2 px-4 font-semibold text-lg leading-7 uppercase hover:!text-primary hover:border-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  {product?.metaData?.acf?.button_text}
                </a>
              )}
            </>
          ),
          isOpen: false,
        };
      })
    );
  }

  if (additionalData?.review?.hideReviewTab === false) {
    if (reviewsCount > 0) {
      tabData.push(reviewsTab);
    } else if (settings?.store?.reviewService === 'woocommerce_native_reviews') {
      tabData.push(reviewsTab);
    }
  }

  // remove tabs if the tab title is Reviews
  if (tabData.length > 0) {
    tabData = tabData.filter((tab) => !tab.title.startsWith('Reviews'));
  }

  switch (style) {
    case ACCORDION_TYPE:
      return (
        <div className={cn(className, 'product-accordion-information')}>
          <Accordion
            data={tabData.map((tab) => {
              return {
                ...tab,
                isOpen: false,
              };
            })}
            tabTitleStyle={{
              fontWeight: settings?.product?.font?.tabs?.weight,
              fontSize: settings?.product?.font?.tabs?.size,
            }}
            titleClassname="text-lg md:text-2xl"
            contentClassname="text-base md:text-lg leading-6"
            tabsCase={settings?.product?.layout?.tabsCase}
          />
        </div>
      );

    default:
      return (
        <div className={cn(className, 'product-tab-accordion')}>
          <Tabs data={tabData} />
        </div>
      );
  }
};

ProductTabs.defaultProps = {
  style: 'accordion',
};
