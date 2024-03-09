
import Categories from '@/components/categories/categories';
import type { HomePageProps } from '@/types';

export default function MinimalLayout({ variables }: HomePageProps) {
  return (
    <>
      <Categories layout="minimal" variables={variables.categories} />
    </>
  );
}
