import Label from '@/components/ui/label';
import Select from '@/components/ui/select/select';
import { useCategoriesQuery } from '@/graphql/categories.graphql';
import { useTypesQuery } from '@/graphql/type.graphql';
import {
  QueryCategoriesHasTypeColumn,
  SqlOperator,
} from '__generated__/__types__';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ActionMeta } from 'react-select';

type Props = {
  onCategoryFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onTypeFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  className?: string;
  type?: string;
};

export default function CategoryTypeFilter({
  onCategoryFilter,
  onTypeFilter,
  className,
  type,
}: Props) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { data, loading } = useTypesQuery({
    variables: {
      language: locale,
    },
    fetchPolicy: 'network-only',
  });
  const {
    data: categoryData,
    loading: categoryLoading,
    refetch: categoryRefetch,
  } = useCategoriesQuery({
    variables: {
      language: locale,
      first: 999,
      page: 1,
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    let hasTypeCondition = null;
    if (Boolean(type)) {
      hasTypeCondition = {
        column: QueryCategoriesHasTypeColumn.Slug,
        operator: SqlOperator.Eq,
        value: type,
      };
    }
    categoryRefetch({
      language: locale,
      first: 999,
      hasType: hasTypeCondition,
      page: 1,
    });
  }, [type]);

  return (
    <div
      className={cn(
        'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0',
        className
      )}
    >
      <div className="w-full">
        <Label>{t('common:filter-by-group')}</Label>
        <Select
          options={data?.types}
          isLoading={loading}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.slug}
          placeholder={t('common:filter-by-group-placeholder')}
          isClearable={true}
          onChange={onTypeFilter}
        />
      </div>
      <div className="w-full">
        <Label>{t('common:filter-by-category')}</Label>
        <Select
          options={categoryData?.categories?.data}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.slug}
          isLoading={categoryLoading}
          placeholder={t('common:filter-by-category-placeholder')}
          isClearable={true}
          onChange={onCategoryFilter}
        />
      </div>
    </div>
  );
}
