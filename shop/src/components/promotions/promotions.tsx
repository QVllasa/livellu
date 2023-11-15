import PromotionSlider from '@/components/promotions/promotion-slider';
import ErrorMessage from '@/components/ui/error-message';
import { useType } from '@/framework/type';

export default function PromotionSliders({ variables }: any) {
  const { type } = useType();
  if (!type?.promotional_sliders) return null;
  return <PromotionSlider sliders={type?.promotional_sliders} />;
}
