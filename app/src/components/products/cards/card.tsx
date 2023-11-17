import type { Product } from '@/types';
import dynamic from 'next/dynamic';


const Krypton = dynamic(
  () => import('@/components/products/cards/krypton') // furniture extra price
);

const MAP_PRODUCT_TO_CARD: Record<string, any> = {
  krypton: Krypton
};

interface ProductCardProps {
  product: Product;
  className?: string;
  cardType?: any;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  ...props
}) => {
  const Component = MAP_PRODUCT_TO_CARD['krypton'];
  return <Component product={product} {...props} className={className} />;
};
export default ProductCard;
