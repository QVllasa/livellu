import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import { useTranslation } from 'next-i18next';
import useNavigation from "@/lib/hooks/use-navigation";

const headerLinks = [
  { href: Routes.shops, icon: null, label: 'nav-menu-shops' },
  { href: Routes.coupons, icon: null, label: 'nav-menu-offer' },
  { href: Routes.help, label: 'nav-menu-faq' },
  { href: Routes.contactUs, label: 'nav-menu-contact' },
];

const Navigation = () => {
  const { t } = useTranslation('common');

  const {navigationData, loading, error} = useNavigation();

console.log(navigationData)

  return (
    <>
      {navigationData.map(({ url, title, icon }) => (
        <li key={`${url}`}>
          <Link
            href={url}
            className="flex items-center font-normal text-heading no-underline transition duration-200 hover:text-accent focus:text-accent"
          >
            {icon && <span className="ltr:mr-2 rtl:ml-2 h-4 w-4 "  dangerouslySetInnerHTML={{ __html: JSON.parse(icon).component }} ></span>}
            {t(title)}
          </Link>
        </li>
      ))}
    </>
  );
};

export default Navigation;
