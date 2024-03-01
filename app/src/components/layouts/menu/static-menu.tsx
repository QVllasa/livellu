import { ArrowDownIcon } from '@/components/icons/arrow-down';
import Link from '@/components/ui/link';
import { useTranslation } from 'next-i18next';
import { siteSettings } from '@/config/site';
import {Routes} from "@/config/routes";

const StaticMenu = () => {
  const { t } = useTranslation('common');
  const headerLinks = [
    {href: Routes.shops, icon: null, label: 'nav-menu-shops'},
    {href: Routes.coupons, icon: null, label: 'nav-menu-offer'},
    {href: Routes.contactUs, label: 'nav-menu-contact'},
  ];
  return (
    <>

    </>
  );
};

export default StaticMenu;
