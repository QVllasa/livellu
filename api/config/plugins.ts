export default ({env}) => ({
    'prev-next-button': true,
    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: env('CLOUDINARY_NAME'),
          api_key: env('CLOUDINARY_KEY'),
          api_secret: env('CLOUDINARY_SECRET'),
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
      },
    },
    "content-versioning": {
      enabled: false,
    },
    meilisearch: {
      config: {
        // Your meili host
        host: env('MEILISEARCH_HOST'),
        // Your master key or private key
        apiKey: env('MEILISEARCH_API_KEY'),
        item: {
          settings: {
            filterableAttributes: ['categoryIdentifier',
              'variants.price',
              'variants.averageRating',
              'variants.description',
              'brandName',
              'variants.originalColor',
              'variants.originalMaterial',
              'variants.productName',
              'variants.style',
              'variants.height',
              'variants.width',
              'variants.depth',
              'variants.colors',
              'variants.materials',
              'variants.deliveryTimes',
              'variants.shape'],
            sortableAttributes: ['variants.price', 'variants.averageRating'],
            pagination: {
              maxTotalHits: 10000
            },
            faceting: {
              maxValuesPerFacet: 5000
            }
          }
        },
        category: {
          settings: {
            filterableAttributes: ['identifier', 'slug', 'level', 'child_categories.identifier', 'parent_categories.identifier'],
            pagination: {
              maxTotalHits: 1000
            },
          }
        },
        color: {
          settings: {
            filterableAttributes: ['isColor', 'slug'],
            pagination: {
              maxTotalHits: 1000
            },
          }
        },
        brand: {
          settings: {
            filterableAttributes: ['slug'],
            pagination: {
              maxTotalHits: 10000
            },
          }
        },
        material: {
          settings: {
            filterableAttributes: ['isMaterial','slug'],
            pagination: {
              maxTotalHits: 10000
            },
          }
        }
      }
    },
    'schemas-to-ts': {
      enabled: false,
      config: {
        // acceptedNodeEnvs: ["development"],
        // commonInterfacesFolderName: 'schemas-to-ts',
        // alwaysAddEnumSuffix: false,
        // alwaysAddComponentSuffix: false,
        // usePrettierIfAvailable: true,
        logLevel: 4,
        // destinationFolder: undefined,
      }
    },
  }
);
