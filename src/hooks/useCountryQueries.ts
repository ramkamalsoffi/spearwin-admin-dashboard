import { useQuery } from "@tanstack/react-query";
import { countryService } from "../services";

export const useCountryQueries = () => {
  // Get all countries
  const useCountries = () => {
    return useQuery({
      queryKey: ['countries'],
      queryFn: () => countryService.getCountries(),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Get country by ID
  const useCountry = (id: string) => {
    return useQuery({
      queryKey: ['country', id],
      queryFn: () => countryService.getCountryById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  return {
    useCountries,
    useCountry,
  };
};


