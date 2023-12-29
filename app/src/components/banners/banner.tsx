import { useType } from '@/framework/type';
import dynamic from 'next/dynamic';
import BannerShort from "@/components/banners/banner-short";



const Banner: React.FC<{ layout: string; variables: any }> = ({
  layout,
  variables,
}) => {
  const { type } = useType();
  return (
    <BannerShort />
  );
};

export default Banner;
