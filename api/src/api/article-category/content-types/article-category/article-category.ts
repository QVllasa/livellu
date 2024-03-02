// Interface automatically generated by schemas-to-ts

export interface ArticleCategory {
  id: number;
  attributes: {
    createdAt: Date;    updatedAt: Date;    publishedAt?: Date;    label: string;
  };
}
export interface ArticleCategory_Plain {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  label: string;
}

export interface ArticleCategory_NoRelations {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  label: string;
}

export interface ArticleCategory_AdminPanelLifeCycle {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  label: string;
}
