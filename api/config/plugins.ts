
export default ({ env }) => ({
  upload: {
    config: {
      sizeLimit: 3500 * 1024 * 1024,
      providerOptions: {
        localServer: {
          maxage: 300000
        },
      },
    },
  },
  "content-versioning": {
    enabled:  true,
  },
  'schemas-to-ts': {
    enabled: true,
  },
});
