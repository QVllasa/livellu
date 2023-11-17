import ErrorMessage from '@/components/ui/error-message';
import dynamic from 'next/dynamic';
import { useCategories } from '@/framework/category';
import {CTEGORIES} from "@/components/categories/cats";

const StickySidebarBoxedCategories = dynamic(
  () => import('@/components/categories/sticky-sidebar-boxed-categories')
);

const MAP_CATEGORY_TO_GROUP: Record<string, any> = {

  modern: StickySidebarBoxedCategories,
  // standard: StaticSidebarVerticalRectangleCategories,
  // minimal: FilterCategoryGrid,
  // compact: SlidingCardCategories,
  // default: StickySidebarListCategories,
};
interface CategoriesProps {
  layout: string;
  variables: any;
  className?: string;
}
export default function Categories({
  layout,
  className,
  variables,
}: CategoriesProps) {
  // const { isLoading, error } = useCategories(variables);

  const categories = JSON.parse(CTEGORIES)

  // if (error) return <ErrorMessage message={error.message} />;
  const Component = MAP_CATEGORY_TO_GROUP['modern'];
  return (
    <Component
      // notFound={!Boolean(categories.length)}
      categories={categories}
      // loading={isLoading}
      className={className}
      variables={variables}
    />
  );
}
