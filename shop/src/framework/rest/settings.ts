import type { Settings } from '@/types';
import { useMutation, useQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { useState } from 'react';
import { FileWithPath } from 'react-dropzone';
import { getPreviewImage } from '@/lib/get-preview-image';
import { useAtom } from 'jotai';
import { couponAtom } from '@/store/checkout';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export function useSettings() {
  const { locale } = useRouter();

  const formattedOptions = {
    language: locale,
  };

  // const { data, isLoading, error, isFetching } = useQuery<Settings, Error>(
  //   [API_ENDPOINTS.SETTINGS, formattedOptions],
  //   ({ queryKey, pageParam }) =>
  //     client.settings.all(Object.assign({}, queryKey[1], pageParam))
  // );
  //
  const data = JSON.parse(JSON.stringify({
        "id": 1,
        "options": {
          "siteTitle": "Pickbazar",
          "siteSubtitle": "Your next ecommerce",
          "minimumOrderAmount": 0,
          "currencyToWalletRatio": 3,
          "signupPoints": 100,
          "maximumQuestionLimit": 5,
          "seo": {
            "ogImage": null,
            "ogTitle": null,
            "metaTags": null,
            "metaTitle": null,
            "canonicalUrl": null,
            "ogDescription": null,
            "twitterHandle": null,
            "metaDescription": null,
            "twitterCardType": null
          },
          "logo": {
            "id": "862",
            "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/860/PickBazar.png",
            "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/860/conversions/PickBazar-thumbnail.jpg"
          },
          "useAi": true,
          "useOtp": false,
          "currency": "USD",
          "smsEvent": {
            "admin": {
              "refundOrder": true,
              "paymentOrder": true,
              "statusChangeOrder": true
            },
            "vendor": {
              "refundOrder": true,
              "paymentOrder": true,
              "statusChangeOrder": true
            },
            "customer": {
              "refundOrder": true,
              "paymentOrder": true,
              "statusChangeOrder": true
            }
          },
          "taxClass": 1,
          "defaultAi": "openai",
          "emailEvent": {
            "admin": {
              "refundOrder": true,
              "paymentOrder": true,
              "statusChangeOrder": true
            },
            "vendor": {
              "refundOrder": true,
              "createReview": true,
              "paymentOrder": true,
              "createQuestion": true,
              "statusChangeOrder": true
            },
            "customer": {
              "refundOrder": true,
              "paymentOrder": true,
              "answerQuestion": true,
              "statusChangeOrder": true
            }
          },
          "server_info": {
            "memory_limit": "128M",
            "post_max_size": 8192,
            "max_input_time": "60",
            "max_execution_time": "30",
            "upload_max_filesize": 2048
          },
          "deliveryTime": [
            {
              "title": "Express Delivery",
              "description": "90 min express delivery"
            },
            {
              "title": "Morning",
              "description": "8.00 AM - 11.00 AM"
            },
            {
              "title": "Noon",
              "description": "11.00 AM - 2.00 PM"
            },
            {
              "title": "Afternoon",
              "description": "2.00 PM - 5.00 PM"
            },
            {
              "title": "Evening",
              "description": "5.00 PM - 8.00 PM"
            }
          ],
          "freeShipping": false,
          "useGoogleMap": true,
          "guestCheckout": true,
          "shippingClass": 1,
          "StripeCardOnly": false,
          "contactDetails": {
            "contact": "+129290122122",
            "socials": [
              {
                "url": "https://www.facebook.com/",
                "icon": "FacebookIcon"
              },
              {
                "url": "https://twitter.com/home",
                "icon": "TwitterIcon"
              }
            ],
            "website": "https://redq.io",
            "location": {
              "lat": 42.9585979,
              "lng": -76.9087202,
              "zip": null,
              "city": null,
              "state": "NY",
              "country": "United States",
              "formattedAddress": "NY State Thruway, New York, USA"
            }
          },
          "paymentGateway": [
            {
              "name": "stripe",
              "title": "Stripe"
            },
            {
              "name": "paypal",
              "title": "Paypal"
            }
          ],
          "currencyOptions": {
            "formation": "en-US",
            "fractions": 2
          },
          "isProductReview": false,
          "maxShopDistance": 2000,
          "useEnableGateway": true,
          "useCashOnDelivery": true,
          "freeShippingAmount": null,
          "useMustVerifyEmail": false,
          "defaultPaymentGateway": "stripe"
        },
        "language": "en",
        "created_at": "2023-07-20T15:33:11.000000Z",
        "updated_at": "2023-07-26T13:22:42.000000Z"
      }))
  const isLoading = false;
  const error = null;
  const isFetching = false;

  return {
    settings: data?.options ?? {},
    isLoading,
    error,
    isFetching,
  };
}

export const useUploads = ({ onChange, defaultFiles }: any) => {
  const [files, setFiles] = useState<FileWithPath[]>(
    getPreviewImage(defaultFiles)
  );

  const { mutate: upload, isLoading } = useMutation(client.settings.upload, {
    onSuccess: (data) => {
      if (onChange) {
        const dataAfterRemoveTypename = data?.map(
          ({ __typename, ...rest }: any) => rest
        );
        onChange(dataAfterRemoveTypename);
        setFiles(getPreviewImage(dataAfterRemoveTypename));
      }
    },
  });

  function handleSubmit(data: File[]) {
    upload(data);
  }

  return { mutate: handleSubmit, isLoading, files };
};

export function useSubscription() {
  let [isSubscribed, setIsSubscribed] = useState(false);

  const subscription = useMutation(client.users.subscribe, {
    onSuccess: () => {
      setIsSubscribed(true);
    },
    onError: () => {
      setIsSubscribed(false);
    },
  });

  return {
    ...subscription,
    isSubscribed,
  };
}

export function useVerifyCoupon() {
  const { t } = useTranslation();
  const [_, applyCoupon] = useAtom(couponAtom);
  let [formError, setFormError] = useState<any>(null);
  const { mutate, isLoading } = useMutation(client.coupons.verify, {
    onSuccess: (data: any) => {
      if (!data.is_valid) {
        setFormError({
          code: t(`common:${data?.message}`),
        });
      }
      applyCoupon(data?.coupon);
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(data?.message);
    },
  });

  return { mutate, isLoading, formError, setFormError };
}
