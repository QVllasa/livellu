
import GeneralLayout from '@/components/layouts/_general';
import classNames from 'classnames';

type Props = {
  layout?: string;
  className?: string;
};

export default function DashboardLayout({
  children,
  layout,
  className,
}: React.PropsWithChildren<Props>) {
  return (
    <GeneralLayout layout="general">
      <div
        className={classNames(
          '_dashboard mx-auto flex w-full max-w-1920 flex-col items-start bg-gray-100 px-5 py-10 lg:flex-row xl:py-14 xl:px-8 2xl:px-14',
          className
        )}
      >
        {children}
      </div>
    </GeneralLayout>
  );
}
