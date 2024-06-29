import Categories from '@/components/categories/categories';
import type {HomePageProps} from '@/types';

import FilterBar from './filter-bar';

export default function Standard({ variables }: HomePageProps) {
  return (
    <>
      <FilterBar variables={variables.categories} />
      <Categories layout="standard" variables={variables.categories} />
      <main className="flex-1">

      </main>
    </>
  );
}
