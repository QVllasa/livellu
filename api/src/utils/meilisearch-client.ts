import { MeiliSearch } from 'meilisearch';
import {env} from "@strapi/utils";

const client = new MeiliSearch({
  host: env('MEILISEARCH_HOST'),
  apiKey: env('MEILISEARCH_API_KEY'),
});

export default client;

