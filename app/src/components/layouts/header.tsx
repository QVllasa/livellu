import Logo from '@/components/ui/logo';
import cn from 'classnames';
import { useAtom } from 'jotai';
import { displayMobileHeaderSearchAtom } from '@/store/display-mobile-header-search-atom';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { authorizationAtom } from '@/store/authorization-atom';
import { useIsHomePage } from '@/lib/use-is-homepage';
import { useMemo, useState } from 'react';
import GroupsDropdownMenu from '@/components/layouts/menu/groups-menu';
import { useHeaderSearch } from '@/layouts/headers/header-search-atom';
import LanguageSwitcher from '@/components/ui/language-switcher';
import { locationAtom } from '@/lib/use-location';
import { useSettings } from '@/framework/settings';
import Navigation from "@/components/layouts/menu/navigation";

const Search = dynamic(() => import('@/components/ui/search/search'));



const Header = ({ layout }: { layout?: string }) => {
  const { t } = useTranslation('common');
  const { show, hideHeaderSearch } = useHeaderSearch();
  const [displayMobileHeaderSearch] = useAtom(displayMobileHeaderSearchAtom);
  const [isAuthorize] = useAtom(authorizationAtom);
  const [openDropdown, setOpenDropdown] = useState(false);
  const isHomePage = useIsHomePage();



  const isMultilangEnable =
    process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG === 'true' &&
    !!process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES;

  // useEffect(() => {
  //   if (!isHomePage) {
  //     hideHeaderSearch();
  //   }
  // }, [isHomePage]);
  const isFlattenHeader = useMemo(
    () => !show && isHomePage && layout !== 'modern',
    [show, isHomePage, layout]
  );

  const [location] = useAtom(locationAtom);
  const getLocation = location?.street_address
    ? location?.street_address
    : location?.formattedAddress;
  const closeLocation = () => setOpenDropdown(false);
  const { settings } = useSettings();

  return (
    <header
      className={cn('site-header-with-search top-0 z-50 w-full lg:h-22', {
        '': isFlattenHeader,
        'sticky lg:fixed': isHomePage,
        'sticky border-b border-border-200 shadow-sm': !isHomePage,
      })}
    >
      <div
        className={cn(
          'fixed inset-0 -z-10 h-[100vh] w-full bg-black/50',
          openDropdown === true ? '' : 'hidden'
        )}
        onClick={closeLocation}
      ></div>
      <div>
        <div
          className={cn(
            ' flex w-full transform-gpu items-center justify-between bg-light transition-transform duration-300 lg:h-22 lg:px-4 xl:px-8',
            {
              'lg:absolute lg:border-0 lg:bg-transparent lg:shadow-none':
                isFlattenHeader,
              'lg:!bg-light': openDropdown,
            }
          )}
        >
          <div className="flex w-full shrink-0 grow-0 basis-auto flex-col items-center lg:w-auto lg:flex-row">
            <Logo
              className={cn(
                'pt-2 pb-3',
                !isMultilangEnable ? 'lg:mx-0' : 'ltr:ml-0 rtl:mr-0'
              )}
            />

            {isMultilangEnable ? (
              <div className="ltr:ml-auto rtl:mr-auto lg:hidden">
                <LanguageSwitcher />
              </div>
            ) : (
              ''
            )}

          </div>

          {isHomePage ? (
            <>
              {(show || layout === 'modern') && (
                <div className="mx-auto hidden w-full overflow-hidden px-10 lg:block xl:w-11/12 2xl:w-10/12">
                  <Search label={t('text-search-label')} variant="minimal" />
                </div>
              )}

              {displayMobileHeaderSearch && (
                <div className="absolute top-0 block h-full w-full bg-light px-5 pt-1.5 ltr:left-0 rtl:right-0 md:pt-2 lg:hidden">
                  <Search label={t('text-search-label')} variant="minimal" />
                </div>
              )}
            </>
          ) : null}

          <ul className="hidden shrink-0 items-center space-x-7 rtl:space-x-reverse lg:flex 2xl:space-x-10">
            <Navigation />
          </ul>
        </div>
        <div
          className={cn(
            'w-full border-b border-t border-border-200 bg-light shadow-sm',
            isHomePage ? 'hidden lg:block' : 'hidden'
          )}
        >

        </div>
      </div>
    </header>
  );
};

export default Header;
