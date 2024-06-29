import SearchBox from '@/components/ui/search/search-box';
import {useTranslation} from 'next-i18next';
import {useState} from 'react';
import cn from 'classnames';
import {useRouter} from 'next/router';
import {Routes} from '@/config/routes';
import useHomepage from '@/lib/hooks/use-homepage';

interface Props {
  label: string;
  className?: string;
  variant?: 'minimal' | 'normal' | 'with-shadow';
  seeMore?: boolean;
  [key: string]: unknown;
}

const SearchWithSuggestion: React.FC<Props> = ({
  label,
  className,
  seeMore = false,
  variant,
  ...props
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTerm, updateSearchTerm] = useState('');
  const { homePage }: any = useHomepage();

  const handleOnChange = (e: any) => {
    const { value: inputValue } = e.target;
    updateSearchTerm(inputValue);
  };

  const onSearch = (e: any) => {
    e.preventDefault();
    if (!searchTerm) return;
  };

  function clearSearch() {
    updateSearchTerm('');
  }

  let redirectSearchPath = '';
  if (router.asPath === '/') {
    redirectSearchPath = homePage?.slug;
  } else {
    redirectSearchPath = router.asPath;
  }

  const onSearchMore = (e: any) => {
    e.preventDefault();
    if (!searchTerm) return;
    const { asPath, query } = router;
    const { pages, ...restQuery } = query;
    router.push(
      {
        // pathname: [group] asPath + Routes.search,
        pathname: redirectSearchPath + Routes.search,
        query: { ...restQuery, text: searchTerm },
      },
      undefined,
      {
        scroll: false,
      }
    );
  };
  return (
    <div className={cn('relative w-full', className)}>
      <SearchBox
        label={label}
        onSubmit={onSearch}
        onClearSearch={clearSearch}
        onChange={handleOnChange}
        value={searchTerm}
        name="search"
        placeholder={t('common:text-search-placeholder-minimal')}
        variant={variant}
        {...props}
      />


    </div>
  );
};

export default SearchWithSuggestion;
