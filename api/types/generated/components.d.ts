import type { Schema, Attribute } from '@strapi/strapi';

export interface ArticleArticleSection extends Schema.Component {
  collectionName: 'components_article_article_sections';
  info: {
    displayName: 'ArticleSection';
    description: '';
  };
  attributes: {
    content: Attribute.RichText & Attribute.DefaultTo<'# H1'>;
    featured_image: Attribute.Media;
    images: Attribute.Media;
    product_categories: Attribute.Relation<
      'article.article-section',
      'oneToMany',
      'api::category.category'
    >;
  };
}

export interface CategoriesCategory extends Schema.Component {
  collectionName: 'components_categories_categories';
  info: {
    displayName: 'category';
  };
  attributes: {
    name: Attribute.String;
  };
}

export interface SeoSeo extends Schema.Component {
  collectionName: 'components_seo_seos';
  info: {
    displayName: 'SEO';
  };
  attributes: {
    meta_title: Attribute.String & Attribute.Required;
    meta_description: Attribute.Text;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'article.article-section': ArticleArticleSection;
      'categories.category': CategoriesCategory;
      'seo.seo': SeoSeo;
    }
  }
}
