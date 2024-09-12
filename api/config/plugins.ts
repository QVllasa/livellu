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
            },
            embedders: {
              default: {
                source: "ollama",
                url: "http://192.168.188.118:8001/api/embeddings",
                apiKey: "OLLAMA_API_KEY",
                model: "gemma2:27b",
                documentTemplate: "Product Name: {{ doc.brandName }} {{ doc.variants[0].productName }}. Description: {{ doc.variants[0].description }}\n\ \
                Brand: {{ doc.brandName }}\n\
                Category: {{ doc.categoryIdentifier }}\n\
                Price: {{ doc.variants[0].price }} {{ doc.currency }}\n\
                Material: {{ doc.variants[0].originalMaterial }}\n\
                Original Color: {{ doc.variants[0].originalColor }}\n\
                Delivery Time: {{ doc.variants[0].deliveryTime }}\n\
                Product Link: {{ doc.variants[0].merchantLink }}\n\
                Images: {% for image in doc.variants[0].images %}{{ image }}{% if forloop.last == false %}, {% endif %}{% endfor %}\n\n\
                Variants Information:\n\
                {% for variant in doc.variants %}\n\
                              Variant ID: {{ variant.variantId }}\n\
                  Variant Description: {{ variant.description }}\n\
                  Variant Price: {{ variant.price }} {{ currency }}\n\
                  Variant Material: {{ variant.originalMaterial }}\n\
                  Variant Original Color: {{ variant.originalColor }}\n\
                  Variant Dimensions: {{ variant.dimension }}\n\
                  Variant Delivery Time: {{ variant.deliveryTime }}\n\
                  Variant Delivery Cost: {{ variant.deliveryCost }} EUR\n\
                  Variant EAN: {{ variant.ean }}\n\
                  Variant Merchant Product ID: {{ variant.merchantProductId }}\n\
                  Variant Tracking Link: {{ variant.tracking }}\n\
                  Variant Images: {% for image in variant.images %}{{ image }}{% if forloop.last == false %}, {% endif %}{% endfor %}\n\
                  Width: {{ variant.width }}\n\
                  Height: {{ variant.height }}\n\
                  Depth: {{ variant.depth }}\n\
                  Style: {{ variant.style }}\n\
                  Shape: {{ variant.shape }}\n\
                  Discount: {{ variant.discount }}%\n\n\
                {% endfor %}"
              }
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
                            child_categories: {populate: {child_categories: '*', parent_categories: '*'}},
                            parent_categories: '*'
                          }
                      },
                    parent_categories: '*'
                  }
                },
                parent_categories: '*'
              }
            });


            return {
              ...entry,
              ...child,
            }
          },
          settings: {
            filterableAttributes: ['slug', 'level', 'child_categories.slug', 'parent_categories.slug'],
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
