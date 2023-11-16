import type { Type, TypeQueryOptions } from '@/types';
import { useQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { useRouter } from 'next/router';

export function useTypes(options?: Partial<TypeQueryOptions>) {
  const data = {
    "id": 6,
    "name": "Furniture",
    "settings": {
      "isHome": true,
      "layoutType": "modern",
      "productCard": "krypton"
    },
    "slug": "furniture",
    "language": "en",
    "icon": "FurnitureIcon",
    "promotional_sliders": [
      {
        "id": 902,
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/902/offer-5.png",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/902/conversions/offer-5-thumbnail.jpg"
      },
      {
        "id": 903,
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/903/offer-4.png",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/903/conversions/offer-4-thumbnail.jpg"
      },
      {
        "id": 904,
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/904/offer-3.png",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/904/conversions/offer-3-thumbnail.jpg"
      },
      {
        "id": 905,
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/905/offer-2.png",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/905/conversions/offer-2-thumbnail.jpg"
      },
      {
        "id": 906,
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/906/offer-1.png",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/906/conversions/offer-1-thumbnail.jpg"
      }
    ],
    "created_at": "2021-03-08T07:19:49.000000Z",
    "updated_at": "2021-08-18T18:33:13.000000Z",
    "translated_languages": [
      "en"
    ],
    "banners": [
      {
        "id": 18,
        "type_id": 6,
        "title": "Exclusive furniture on cheap price",
        "description": "Make your house a home with our wide collection of beautiful furniture",
        "image": {
          "id": 922,
          "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/922/furniture-banner-1.jpg",
          "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/922/conversions/furniture-banner-1-thumbnail.jpg"
        },
        "created_at": "2021-08-18T18:45:54.000000Z",
        "updated_at": "2021-08-18T18:45:54.000000Z"
      },
      {
        "id": 19,
        "type_id": 6,
        "title": "Furniter 2",
        "description": null,
        "image": {
          "id": 923,
          "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/923/furniture-banner-2.jpg",
          "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/923/conversions/furniture-banner-2-thumbnail.jpg"
        },
        "created_at": "2021-08-18T18:45:54.000000Z",
        "updated_at": "2021-08-18T18:45:54.000000Z"
      }
    ]
  };
  return {
    type: data
  };
}

export function useType() {
  const data = {
        "id": 6,
        "name": "Furniture",
        "settings": {
          "isHome": true,
          "layoutType": "modern",
          "productCard": "krypton"
        },
        "slug": "furniture",
        "language": "en",
        "icon": "FurnitureIcon",
        "promotional_sliders": [
          {
            "id": 902,
            "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/902/offer-5.png",
            "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/902/conversions/offer-5-thumbnail.jpg"
          },
          {
            "id": 903,
            "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/903/offer-4.png",
            "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/903/conversions/offer-4-thumbnail.jpg"
          },
          {
            "id": 904,
            "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/904/offer-3.png",
            "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/904/conversions/offer-3-thumbnail.jpg"
          },
          {
            "id": 905,
            "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/905/offer-2.png",
            "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/905/conversions/offer-2-thumbnail.jpg"
          },
          {
            "id": 906,
            "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/906/offer-1.png",
            "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/906/conversions/offer-1-thumbnail.jpg"
          }
        ],
        "created_at": "2021-03-08T07:19:49.000000Z",
        "updated_at": "2021-08-18T18:33:13.000000Z",
        "translated_languages": [
          "en"
        ],
        "banners": [
          {
            "id": 18,
            "type_id": 6,
            "title": "Exclusive furniture on cheap price",
            "description": "Make your house a home with our wide collection of beautiful furniture",
            "image": {
              "id": 922,
              "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/922/furniture-banner-1.jpg",
              "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/922/conversions/furniture-banner-1-thumbnail.jpg"
            },
            "created_at": "2021-08-18T18:45:54.000000Z",
            "updated_at": "2021-08-18T18:45:54.000000Z"
          },
          {
            "id": 19,
            "type_id": 6,
            "title": "Furniter 2",
            "description": null,
            "image": {
              "id": 923,
              "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/923/furniture-banner-2.jpg",
              "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/923/conversions/furniture-banner-2-thumbnail.jpg"
            },
            "created_at": "2021-08-18T18:45:54.000000Z",
            "updated_at": "2021-08-18T18:45:54.000000Z"
          }
        ]
      };
  return {
    type: data
  };
}
