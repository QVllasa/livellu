export default ({env}) => ({
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('SMTP_HOST'),
          port: env('SMTP_PORT'),
          auth: {
            user: env('SMTP_USERNAME'),
            pass: env('SMTP_PASSWORD'),
          },
          // ... any custom nodemailer options
        },
        settings: {
          defaultFrom: 'hello@example.com',
          defaultReplyTo: 'hello@example.com',
        },
      },
    },
    'prev-next-button': true,
    // upload: {
    //   config: {
    //     provider: 'cloudinary',
    //     providerOptions: {
    //       cloud_name: env('CLOUDINARY_NAME'),
    //       api_key: env('CLOUDINARY_KEY'),
    //       api_secret: env('CLOUDINARY_SECRET'),
    //     },
    //     actionOptions: {
    //       upload: {},
    //       uploadStream: {},
    //       delete: {},
    //     },
    //   },
    // },
    upload: {
      config: {
        providerOptions: {
          localServer: {
            maxage: 300000
          },
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
              'id',
              'variants.slug',
              'variants.price',
              'variants.discount',
              'variants.averageRating',
              'variants.description',
              'brandName',
              'variants.originalColor',
              'variants.originalMaterial',
              'variants.productName',
              'variants.style',
              'variants.height',
              'variants.merchantId',
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
          async transformEntry({entry}) {

            const child = await strapi.db.query('api::category.category').findOne({
              where: {slug: entry.slug},
              populate: {
                child_categories: {
                  populate: {
                    child_categories:
                      {
                        populate:
                          {
                            child_categories: {populate: {child_categories: '*', parent_categories: '*', image: '*'}},
                            parent_categories: '*',
                            image: '*'
                          }
                      },
                    parent_categories: '*',
                    image: '*'

                  }
                },
                parent_categories: '*',
                image: '*'


              }
            });

            const removeEmbeddingRecursively = (category: any) => {
              const { embedding, ...rest } = category;
              if (rest.child_categories) {
                rest.child_categories = rest.child_categories.map(removeEmbeddingRecursively);
              }
              if (rest.parent_categories) {
                rest.parent_categories = rest.parent_categories.map(removeEmbeddingRecursively);
              }
              return rest;
            };

            const cleanedEntry = removeEmbeddingRecursively(child);

            return {
              ...cleanedEntry,
              _vectors: entry.embedding ? entry.embedding : { vector: [] },

            };
          },
          settings: {
            embedders: {
              //vector is the name of the embedding
              vector: {
                source: "userProvided",
                dimensions: 1024
              }
            },
            filterableAttributes: ['slug', 'level', 'child_categories.slug', 'parent_categories.slug', 'name'],
            pagination: {
              maxTotalHits: 1000
            },
            // searchableAttributes: ['name', 'slug', 'level', 'child_categories.slug', 'parent_categories.slug', 'description'],
          }
        },
        brand: {
          settings: {
            filterableAttributes: ['slug'],
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
