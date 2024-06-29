import ArrowNarrowLeft from '@/components/icons/arrow-narrow-left';
import {useRouter} from 'next/router';
import cn from 'classnames';

const BackButton = () => {
  const router = useRouter();
  return (
    <button
      className="inline-flex items-center justify-center font-semibold text-accent transition-colors hover:text-accent-hover focus:text-accent-hover focus:outline-0"
      onClick={router.back}
    >
      <ArrowNarrowLeft
        className={cn('h-5 w-5 ltr:mr-2 rtl:ml-2', {
          'rotate-180 transform':
            router.locale === 'ar' || router.locale === 'he',
        })}
        strokeWidth={1.7}
      />
      {('text-back')}
    </button>
  );
};

export default BackButton;
