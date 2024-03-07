// Interface automatically generated by schemas-to-ts

import { AdminPanelRelationPropertyModification } from '../../../../common/schemas-to-ts/AdminPanelRelationPropertyModification';

export interface Category {
  id: number;
  attributes: {
    createdAt: Date;    updatedAt: Date;    publishedAt?: Date;    name: string;
    parent_categories?: { data: Category[] };
    child_categories?: { data: Category[] };
    cat1?: string;
    identifier: string;
    cat2?: string;
    cat3?: string;
    isCategory?: boolean;
  };
}
export interface Category_Plain {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  name: string;
  parent_categories?: Category_Plain[];
  child_categories?: Category_Plain[];
  cat1?: string;
  identifier: string;
  cat2?: string;
  cat3?: string;
  isCategory?: boolean;
}

export interface Category_NoRelations {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  name: string;
  parent_categories?: number[];
  child_categories?: number[];
  cat1?: string;
  identifier: string;
  cat2?: string;
  cat3?: string;
  isCategory?: boolean;
}

export interface Category_AdminPanelLifeCycle {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  name: string;
  parent_categories?: AdminPanelRelationPropertyModification<Category_Plain>;
  child_categories?: AdminPanelRelationPropertyModification<Category_Plain>;
  cat1?: string;
  identifier: string;
  cat2?: string;
  cat3?: string;
  isCategory?: boolean;
}