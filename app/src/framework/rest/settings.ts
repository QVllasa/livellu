import {useMutation} from 'react-query';
import client from './client';
import {useState} from 'react';
import {FileWithPath} from 'react-dropzone';
import {getPreviewImage} from '@/lib/get-preview-image';
import {useAtom} from 'jotai';
import {couponAtom} from '@/store/checkout';
import {toast} from 'react-toastify';

import {useRouter} from 'next/router';

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
  const data: any = []
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
  
  const [_, applyCoupon] = useAtom(couponAtom);
  let [formError, setFormError] = useState<any>(null);
  const { mutate, isLoading } = useMutation(client.coupons.verify, {
    onSuccess: (data: any) => {
      if (!data.is_valid) {
        setFormError({
          code: (`common:${data?.message}`),
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
