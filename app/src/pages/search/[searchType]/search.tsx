import {FilterIcon} from '@/components/icons/filter-icon';
// import MobileNavigation from '@/components/layouts/mobile-navigation';
import GeneralLayout from '@/components/layouts/_general';
import SidebarFilter from '@/components/search-view/sidebar-filter';
import Sorting from '@/components/search-view/sorting';
import {drawerAtom} from '@/store/drawer-atom';
import {motion} from 'framer-motion';
import {useAtom} from 'jotai';
import {useTranslation} from 'next-i18next';
import {useRouter} from 'next/router';
import StickyBox from 'react-sticky-box';

import dynamic from 'next/dynamic';

const MobileNavigation = dynamic(
  () => import('@/components/layouts/mobile-navigation'),
  {
    ssr: false,
  }
);

export { getServerSideProps } from '@/framework/search.ssr';

export default function SearchPage() {
  const { query } = useRouter();
  const { searchType, ...restQuery }: any = query;


  // if (error) return <ErrorMessage message={error.message} />;
  return (
    <div className="w-full">
      <div className="mb-7 flex flex-col items-center justify-between md:flex-row">
        {/* //FIXME: */}

        <div className="mt-4 max-w-xs md:mt-0">
          <Sorting variant="dropdown" />
        </div>
      </div>

    </div>
  );
}

const GetLayout = (page: React.ReactElement) => {
  const { t } = useTranslation('common');
  const [_, setDrawerView] = useAtom(drawerAtom);
  return (
    <GeneralLayout>
      <>
        <div className="w-full bg-light">
          <div className="mx-auto flex min-h-screen w-full max-w-1920 px-5 py-10 rtl:space-x-reverse lg:space-x-10 xl:py-14 xl:px-16">
            <div className="hidden w-80 shrink-0 lg:block">
              <StickyBox offsetTop={140} offsetBottom={30}>
                <SidebarFilter />
              </StickyBox>
            </div>
            {page}
          </div>
        </div>
        <MobileNavigation>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() =>
              setDrawerView({
                display: true,
                view: 'SEARCH_FILTER',
              })
            }
            className="flex h-full items-center justify-center p-2 focus:text-accent focus:outline-0"
          >
            <span className="sr-only">{t('text-filter')}</span>
            <FilterIcon width="17.05" height="18" />
          </motion.button>
        </MobileNavigation>
      </>
    </GeneralLayout>
  );
};

SearchPage.getLayout = GetLayout;
