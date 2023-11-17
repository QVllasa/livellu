export default [
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: "strapi::body",
    config: {
      formLimit: "4096mb", // modify form body
      jsonLimit: "4096mb", // modify JSON body
      textLimit: "4096mb", // modify text body
      formidable: {
        maxFileSize: 3500 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
      },
    },
  },
];
