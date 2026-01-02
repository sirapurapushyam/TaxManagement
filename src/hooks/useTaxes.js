import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taxApi } from '../api';

export const useTaxes = () => {
  return useQuery({
    queryKey: ['taxes'],
    queryFn: taxApi.getAll,
  });
};

export const useUpdateTax = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => taxApi.update(id, data),
    
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['taxes'] });
      
      const previousTaxes = queryClient.getQueryData(['taxes']);
      
      queryClient.setQueryData(['taxes'], (old) => {
        if (!old) return old;
        return old.map((tax) =>
          tax.id === id ? { ...tax, ...data } : tax
        );
      });
      
      return { previousTaxes };
    },
    
    onError: (err, variables, context) => {
      if (context?.previousTaxes) {
        queryClient.setQueryData(['taxes'], context.previousTaxes);
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taxes'] });
    },
  });
};