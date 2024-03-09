// Interface automatically generated by schemas-to-ts

import { Feed } from '../../../feed/content-types/feed/feed';
import { Product } from '../../../product/content-types/product/product';
import { Media } from '../../../../common/schemas-to-ts/Media';
import { Feed_Plain } from '../../../feed/content-types/feed/feed';
import { Product_Plain } from '../../../product/content-types/product/product';
import { AdminPanelRelationPropertyModification } from '../../../../common/schemas-to-ts/AdminPanelRelationPropertyModification';

export interface Merchant {
  id: number;
  attributes: {
    createdAt: Date;    updatedAt: Date;    publishedAt?: Date;    merchantId?: string;
    name?: string;
    feeds: { data: Feed[] };
    products?: { data: Product[] };
    logo_image?: { data: Media };
  };
}
export interface Merchant_Plain {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  merchantId?: string;
  name?: string;
  feeds: Feed_Plain[];
  products?: Product_Plain[];
  logo_image?: Media;
}

export interface Merchant_NoRelations {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  merchantId?: string;
  name?: string;
  feeds: number[];
  products?: number[];
  logo_image?: number;
}

export interface Merchant_AdminPanelLifeCycle {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  merchantId?: string;
  name?: string;
  feeds: AdminPanelRelationPropertyModification<Feed_Plain>;
  products?: AdminPanelRelationPropertyModification<Product_Plain>;
  logo_image?: AdminPanelRelationPropertyModification<Media>;
}
