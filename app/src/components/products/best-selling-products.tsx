import ProductLoader from '@/components/ui/loaders/product-loader';
import NotFound from '@/components/ui/not-found';
import rangeMap from '@/lib/range-map';
import ProductCard from '@/components/products/cards/product-card';
import ErrorMessage from '@/components/ui/error-message';
import SectionBlock from '@/components/ui/section-block';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';

interface Props {
  className?: string;
  limit?: number;
  variables: any;
}

export default function BestSellingProductsGrid({
  className,
  limit = 10,
  variables,
}: Props) {
  const { t } = useTranslation('common');

  // if (error) return <ErrorMessage message={error.message} />;
  // if (!isLoading && !products.length) {
  //   return (
  //     <SectionBlock title={t('text-best-selling')}>
  //       <NotFound text="text-not-found" className="mx-auto w-7/12" />
  //     </SectionBlock>
  //   );
  // }

  return (
    <SectionBlock title={t('text-best-selling')}>
      <div className={classNames(className, 'w-full')}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6 gap-y-10 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] xl:gap-8 xl:gap-y-12 2xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] 3xl:grid-cols-[repeat(auto-fill,minmax(360px,1fr))]">
          {/*{isLoading && !products.length*/}
          {/*  ? rangeMap(limit, (i) => (*/}
          {/*      <ProductLoader key={i} uniqueKey={`product-${i}`} />*/}
          {/*    ))*/}
          {/*  : products.map((product: any) => (*/}
          {/*      <ProductCard product={product} key={product?.id} />*/}
          {/*    ))}*/}
        </div>
      </div>
    </SectionBlock>
  );
}
