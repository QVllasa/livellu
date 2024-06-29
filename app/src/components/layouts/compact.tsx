import SectionBlock from '@/components/ui/section-block';
import FilterBar from './filter-bar';
import Categories from '@/components/categories/categories';
import PopularProductsGrid from '@/components/products/popular-products';
import TopManufacturersGrid from '@/components/manufacturer/top-manufacturers-grid';

import type {HomePageProps} from '@/types';
import BestSellingProductsGrid from '@/components/products/best-selling-products';

export default function CompactLayout({ variables }: HomePageProps) {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <FilterBar className="lg:hidden" variables={variables.categories} />
      <main className="mt-6 block w-full xl:overflow-hidden">
        <SectionBlock>
        </SectionBlock>
        <BestSellingProductsGrid variables={variables?.bestSellingProducts} />
        <PopularProductsGrid variables={variables.popularProducts} />
        <Categories layout="compact" variables={variables.categories} />
        <SectionBlock title={('text-new-arrival')}>

        </SectionBlock>
        <TopManufacturersGrid />
      </main>
    </div>
  );
}
