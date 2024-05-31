import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    singularName: 'release';
    pluralName: 'releases';
    displayName: 'Release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    timezone: Attribute.String;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    singularName: 'release-action';
    pluralName: 'release-actions';
    displayName: 'Release Action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    contentType: Attribute.String & Attribute.Required;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    isEntryValid: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 50;
        },
        number
      >;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiArticleCategoryArticleCategory
  extends Schema.CollectionType {
  collectionName: 'article_categories';
  info: {
    singularName: 'article-category';
    pluralName: 'article-categories';
    displayName: 'ArticleCategory';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    description: Attribute.Text;
    slug: Attribute.String;
    featured_image: Attribute.Media;
    content: Attribute.RichText & Attribute.DefaultTo<'no content'>;
    is_featured: Attribute.Boolean & Attribute.DefaultTo<false>;
    category: Attribute.Relation<
      'api::article-category.article-category',
      'manyToOne',
      'api::category.category'
    >;
    context: Attribute.String;
    posts: Attribute.Relation<
      'api::article-category.article-category',
      'manyToMany',
      'api::post.post'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::article-category.article-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::article-category.article-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiArticleTagArticleTag extends Schema.CollectionType {
  collectionName: 'article_tags';
  info: {
    singularName: 'article-tag';
    pluralName: 'article-tags';
    displayName: 'ArticleTag';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    label: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    posts: Attribute.Relation<
      'api::article-tag.article-tag',
      'manyToMany',
      'api::post.post'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::article-tag.article-tag',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::article-tag.article-tag',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    localizations: Attribute.Relation<
      'api::article-tag.article-tag',
      'oneToMany',
      'api::article-tag.article-tag'
    >;
    locale: Attribute.String;
  };
}

export interface ApiBrandBrand extends Schema.CollectionType {
  collectionName: 'brands';
  info: {
    singularName: 'brand';
    pluralName: 'brands';
    displayName: 'Brand';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    label: Attribute.Text & Attribute.Required & Attribute.Unique;
    slug: Attribute.Text & Attribute.Required & Attribute.Unique;
    brandId: Attribute.Text & Attribute.Required & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::brand.brand',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::brand.brand',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCategoryCategory extends Schema.CollectionType {
  collectionName: 'categories';
  info: {
    singularName: 'category';
    pluralName: 'categories';
    displayName: 'Category';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    parent_categories: Attribute.Relation<
      'api::category.category',
      'manyToMany',
      'api::category.category'
    >;
    child_categories: Attribute.Relation<
      'api::category.category',
      'manyToMany',
      'api::category.category'
    >;
    cat1: Attribute.Text;
    identifier: Attribute.Text & Attribute.Required & Attribute.Unique;
    cat2: Attribute.String;
    cat3: Attribute.String;
    isCategory: Attribute.Boolean & Attribute.DefaultTo<false>;
    ignored: Attribute.Boolean & Attribute.DefaultTo<false>;
    article_categories: Attribute.Relation<
      'api::category.category',
      'oneToMany',
      'api::article-category.article-category'
    >;
    image: Attribute.Media;
    content: Attribute.RichText;
    navigation_item: Attribute.Relation<
      'api::category.category',
      'oneToOne',
      'api::navigation.navigation'
    >;
    summary: Attribute.Text;
    slug: Attribute.Text;
    mapped_categories: Attribute.Relation<
      'api::category.category',
      'oneToMany',
      'api::original-category.original-category'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::category.category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::category.category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiColorColor extends Schema.CollectionType {
  collectionName: 'colors';
  info: {
    singularName: 'color';
    pluralName: 'colors';
    displayName: 'Color';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    label: Attribute.Text & Attribute.Unique;
    parent_colors: Attribute.Relation<
      'api::color.color',
      'manyToMany',
      'api::color.color'
    >;
    child_colors: Attribute.Relation<
      'api::color.color',
      'manyToMany',
      'api::color.color'
    >;
    isColor: Attribute.Boolean & Attribute.DefaultTo<false>;
    code: Attribute.String;
    slug: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::color.color',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::color.color',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFeedFeed extends Schema.CollectionType {
  collectionName: 'feeds';
  info: {
    singularName: 'feed';
    pluralName: 'feeds';
    displayName: 'Feed';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    advertiser_id: Attribute.String;
    advertiser_name: Attribute.String;
    primary_region: Attribute.String;
    membership_status: Attribute.String;
    feed_id: Attribute.String & Attribute.Required & Attribute.Unique;
    feed_name: Attribute.String;
    language: Attribute.String;
    vertical: Attribute.String;
    last_imported: Attribute.String;
    last_checked: Attribute.String;
    no_of_products: Attribute.String;
    url: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::feed.feed', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::feed.feed', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiMaterialMaterial extends Schema.CollectionType {
  collectionName: 'materials';
  info: {
    singularName: 'material';
    pluralName: 'materials';
    displayName: 'Material';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    label: Attribute.Text & Attribute.Unique;
    isMaterial: Attribute.Boolean & Attribute.DefaultTo<false>;
    parent_materials: Attribute.Relation<
      'api::material.material',
      'manyToMany',
      'api::material.material'
    >;
    child_materials: Attribute.Relation<
      'api::material.material',
      'manyToMany',
      'api::material.material'
    >;
    slug: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::material.material',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::material.material',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMerchantMerchant extends Schema.CollectionType {
  collectionName: 'merchants';
  info: {
    singularName: 'merchant';
    pluralName: 'merchants';
    displayName: 'Merchant';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    merchantId: Attribute.String & Attribute.Unique;
    name: Attribute.String;
    feeds: Attribute.Relation<
      'api::merchant.merchant',
      'oneToMany',
      'api::feed.feed'
    >;
    products: Attribute.Relation<
      'api::merchant.merchant',
      'manyToMany',
      'api::product.product'
    >;
    logo_image: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::merchant.merchant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::merchant.merchant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNavigationNavigation extends Schema.CollectionType {
  collectionName: 'navigations';
  info: {
    singularName: 'navigation';
    pluralName: 'navigations';
    displayName: 'NavigationItem';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    title: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    url: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    children: Attribute.Relation<
      'api::navigation.navigation',
      'oneToMany',
      'api::navigation.navigation'
    >;
    parent: Attribute.Relation<
      'api::navigation.navigation',
      'manyToOne',
      'api::navigation.navigation'
    >;
    icon: Attribute.Text &
      Attribute.CustomField<'plugin::heroicons-field.icon-picker'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    order: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    subtitle: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    page: Attribute.Relation<
      'api::navigation.navigation',
      'oneToOne',
      'api::page.page'
    >;
    category: Attribute.Relation<
      'api::navigation.navigation',
      'oneToOne',
      'api::category.category'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::navigation.navigation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::navigation.navigation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    localizations: Attribute.Relation<
      'api::navigation.navigation',
      'oneToMany',
      'api::navigation.navigation'
    >;
    locale: Attribute.String;
  };
}

export interface ApiOriginalCategoryOriginalCategory
  extends Schema.CollectionType {
  collectionName: 'original_categories';
  info: {
    singularName: 'original-category';
    pluralName: 'original-categories';
    displayName: 'Original Category';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    cat1: Attribute.Text;
    cat2: Attribute.Text;
    identifier: Attribute.Text;
    cat3: Attribute.Text;
    slug: Attribute.Text & Attribute.Unique;
    parent_category: Attribute.Relation<
      'api::original-category.original-category',
      'manyToOne',
      'api::category.category'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::original-category.original-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::original-category.original-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPagePage extends Schema.CollectionType {
  collectionName: 'pages';
  info: {
    singularName: 'page';
    pluralName: 'pages';
    displayName: 'Page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    navigation_item: Attribute.Relation<
      'api::page.page',
      'oneToOne',
      'api::navigation.navigation'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::page.page', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::page.page', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiPathPath extends Schema.CollectionType {
  collectionName: 'paths';
  info: {
    singularName: 'path';
    pluralName: 'paths';
    displayName: 'Path';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.Text;
    content: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::path.path', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::path.path', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiPostPost extends Schema.CollectionType {
  collectionName: 'posts';
  info: {
    singularName: 'post';
    pluralName: 'posts';
    displayName: 'Post';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    text: Attribute.Text & Attribute.Required;
    slug: Attribute.Text & Attribute.Required;
    summary: Attribute.Text & Attribute.Required;
    author: Attribute.Relation<'api::post.post', 'oneToOne', 'admin::user'>;
    article_categories: Attribute.Relation<
      'api::post.post',
      'manyToMany',
      'api::article-category.article-category'
    >;
    article_tags: Attribute.Relation<
      'api::post.post',
      'manyToMany',
      'api::article-tag.article-tag'
    >;
    seo: Attribute.Component<'seo.seo'>;
    related_posts: Attribute.Relation<
      'api::post.post',
      'oneToMany',
      'api::post.post'
    >;
    sections: Attribute.Component<'article.article-section', true>;
    featured_image: Attribute.Media;
    context: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::post.post', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::post.post', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiProductProduct extends Schema.CollectionType {
  collectionName: 'products';
  info: {
    singularName: 'product';
    pluralName: 'products';
    displayName: 'Product';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    productId: Attribute.Text & Attribute.Unique;
    merchantProductId: Attribute.Text;
    ean: Attribute.Text & Attribute.Required & Attribute.Unique;
    deliveryTime: Attribute.Text;
    category: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'api::original-category.original-category'
    >;
    merchants: Attribute.Relation<
      'api::product.product',
      'manyToMany',
      'api::merchant.merchant'
    >;
    brandName: Attribute.Text;
    currency: Attribute.Text;
    price: Attribute.Decimal;
    tracking: Attribute.Text;
    thumbnail: Attribute.Text;
    image_url: Attribute.Text;
    merchantLink: Attribute.Text;
    merchantImage: Attribute.Text;
    productName: Attribute.Text;
    description: Attribute.Text;
    promotion: Attribute.Text;
    dimensions: Attribute.Text;
    categoryIdentifier: Attribute.Text;
    slug: Attribute.Text;
    merchantId: Attribute.String;
    shortDescription: Attribute.Text;
    priceOld: Attribute.String;
    deliveryCost: Attribute.String;
    averageRating: Attribute.Text;
    brandId: Attribute.Text;
    dataFeedId: Attribute.String;
    isForSale: Attribute.Boolean;
    keywords: Attribute.Text;
    language: Attribute.Text;
    large_image: Attribute.Text;
    reviews: Attribute.Text;
    rating: Attribute.Text;
    altImageUrl: Attribute.Text;
    color: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'api::color.color'
    >;
    material: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'api::material.material'
    >;
    original_color: Attribute.Text;
    original_material: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRouteRoute extends Schema.CollectionType {
  collectionName: 'routes';
  info: {
    singularName: 'route';
    pluralName: 'routes';
    displayName: 'Route';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::route.route',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::route.route',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::article-category.article-category': ApiArticleCategoryArticleCategory;
      'api::article-tag.article-tag': ApiArticleTagArticleTag;
      'api::brand.brand': ApiBrandBrand;
      'api::category.category': ApiCategoryCategory;
      'api::color.color': ApiColorColor;
      'api::feed.feed': ApiFeedFeed;
      'api::material.material': ApiMaterialMaterial;
      'api::merchant.merchant': ApiMerchantMerchant;
      'api::navigation.navigation': ApiNavigationNavigation;
      'api::original-category.original-category': ApiOriginalCategoryOriginalCategory;
      'api::page.page': ApiPagePage;
      'api::path.path': ApiPathPath;
      'api::post.post': ApiPostPost;
      'api::product.product': ApiProductProduct;
      'api::route.route': ApiRouteRoute;
    }
  }
}
