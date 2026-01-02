import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taxApi } from '../api';

export const useTaxes = () => {
  return useQuery({
    queryKey: ['taxes'],
    queryFn: taxApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateTax = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => taxApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxes'] });
    },
  });
};