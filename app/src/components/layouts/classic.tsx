import Categories from '@/components/categories/categories';
import {Element} from 'react-scroll';
import FilterBar from './filter-bar';
import type {HomePageProps} from '@/types';

export default function ClassicLayout({ variables }: HomePageProps) {
  return (
    <>
      <FilterBar variables={variables.categories} />
      <Element
        name="grid"
        className="flex border-t border-solid border-border-200 border-opacity-70"
      >
        <Categories layout="classic" variables={variables.categories} />

      </Element>
    </>
  );
}
