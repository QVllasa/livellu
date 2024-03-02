// Interface automatically generated by schemas-to-ts

import { Category } from '../../../category/content-types/category/category';
import { Merchant } from '../../../merchant/content-types/merchant/merchant';
import { Category_Plain } from '../../../category/content-types/category/category';
import { Merchant_Plain } from '../../../merchant/content-types/merchant/merchant';
import { AdminPanelRelationPropertyModification } from '../../../../common/schemas-to-ts/AdminPanelRelationPropertyModification';

export interface Product {
  id: number;
  attributes: {
    createdAt: Date;    updatedAt: Date;    publishedAt?: Date;    productId?: string;
    merchantProductId?: string;
    ean: string;
    deliveryTime?: string;
    category?: { data: Category };
    merchants?: { data: Merchant[] };
    brandName?: string;
    currency?: string;
    price?: string;
    tracking?: string;
    thumbnail?: string;
    image_url?: string;
    merchantLink?: string;
    merchantImage?: string;
    productName?: string;
    description?: string;
    promotion?: string;
    dimensions?: string;
    colour?: string;
    material?: string;
    categoryIdentifier?: string;
    slug?: string;
    merchantId?: string;
    shortDescription?: string;
    priceOld?: string;
    deliveryCost?: string;
    averageRating?: string;
    brandId?: string;
    dataFeedId?: string;
    isForSale?: boolean;
    keywords?: string;
    language?: string;
    large_image?: string;
    reviews?: string;
    rating?: string;
    altImageUrl?: string;
  };
}
export interface Product_Plain {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  productId?: string;
  merchantProductId?: string;
  ean: string;
  deliveryTime?: string;
  category?: Category_Plain;
  merchants?: Merchant_Plain[];
  brandName?: string;
  currency?: string;
  price?: string;
  tracking?: string;
  thumbnail?: string;
  image_url?: string;
  merchantLink?: string;
  merchantImage?: string;
  productName?: string;
  description?: string;
  promotion?: string;
  dimensions?: string;
  colour?: string;
  material?: string;
  categoryIdentifier?: string;
  slug?: string;
  merchantId?: string;
  shortDescription?: string;
  priceOld?: string;
  deliveryCost?: string;
  averageRating?: string;
  brandId?: string;
  dataFeedId?: string;
  isForSale?: boolean;
  keywords?: string;
  language?: string;
  large_image?: string;
  reviews?: string;
  rating?: string;
  altImageUrl?: string;
}

export interface Product_NoRelations {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  productId?: string;
  merchantProductId?: string;
  ean: string;
  deliveryTime?: string;
  category?: number;
  merchants?: number[];
  brandName?: string;
  currency?: string;
  price?: string;
  tracking?: string;
  thumbnail?: string;
  image_url?: string;
  merchantLink?: string;
  merchantImage?: string;
  productName?: string;
  description?: string;
  promotion?: string;
  dimensions?: string;
  colour?: string;
  material?: string;
  categoryIdentifier?: string;
  slug?: string;
  merchantId?: string;
  shortDescription?: string;
  priceOld?: string;
  deliveryCost?: string;
  averageRating?: string;
  brandId?: string;
  dataFeedId?: string;
  isForSale?: boolean;
  keywords?: string;
  language?: string;
  large_image?: string;
  reviews?: string;
  rating?: string;
  altImageUrl?: string;
}

export interface Product_AdminPanelLifeCycle {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  productId?: string;
  merchantProductId?: string;
  ean: string;
  deliveryTime?: string;
  category?: AdminPanelRelationPropertyModification<Category_Plain>;
  merchants?: AdminPanelRelationPropertyModification<Merchant_Plain>;
  brandName?: string;
  currency?: string;
  price?: string;
  tracking?: string;
  thumbnail?: string;
  image_url?: string;
  merchantLink?: string;
  merchantImage?: string;
  productName?: string;
  description?: string;
  promotion?: string;
  dimensions?: string;
  colour?: string;
  material?: string;
  categoryIdentifier?: string;
  slug?: string;
  merchantId?: string;
  shortDescription?: string;
  priceOld?: string;
  deliveryCost?: string;
  averageRating?: string;
  brandId?: string;
  dataFeedId?: string;
  isForSale?: boolean;
  keywords?: string;
  language?: string;
  large_image?: string;
  reviews?: string;
  rating?: string;
  altImageUrl?: string;
}
