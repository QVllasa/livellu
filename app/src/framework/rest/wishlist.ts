import axios from 'axios';

import {useMutation, useQueryClient,} from 'react-query';
import {toast} from 'react-toastify';
import client from './client';
import {API_ENDPOINTS} from './client/api-endpoints';


export function useRemoveFromWishlist() {
  
  const queryClient = useQueryClient();
  const {
    mutate: removeFromWishlist,
    isLoading,
    isSuccess,
  } = useMutation(client.wishlist.remove, {
    onSuccess: () => {
      toast.success(`${('text-removed-from-wishlist')}`);
      queryClient.refetchQueries([API_ENDPOINTS.USERS_WISHLIST]);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(`${(error.response?.data.message)}`);
      }
    },
  });

  return { removeFromWishlist, isLoading, isSuccess };
}




