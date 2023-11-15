
export default ({ env }) => ({
  upload: {
    config: {
      providerOptions: {
        sizeLimit: 3500 * 1024 * 1024,
        localServer: {
          maxage: 300000
        },
      },
    },
  },
  "content-versioning": {
    enabled:  true,
  },
});
