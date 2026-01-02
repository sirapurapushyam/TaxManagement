import { useQuery } from '@tanstack/react-query';
import { countryApi } from '../api';

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: countryApi.getAll,
    staleTime: 30 * 60 * 1000,
  });
};