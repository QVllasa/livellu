import ErrorMessage from '@/components/ui/error-message';
import dynamic from 'next/dynamic';
import { useCategories } from '@/framework/category';
import {CTEGORIES} from "@/components/categories/cats";
import StickySidebarBoxedCategories from "@/components/categories/sticky-sidebar-boxed-categories";


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

  const categories = JSON.parse(CTEGORIES)

  // if (error) return <ErrorMessage message={error.message} />;

  return (
    <StickySidebarBoxedCategories
      notFound={false}
      categories={categories}
      loading={false}
      className={className}
    />
  );
}
