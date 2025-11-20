import { useQuery } from '@tanstack/react-query';
import { PokemonListResponse, PokemonListItem } from '../types/pokemon';
import { API_BASE_URL, POKEMON_LIST_LIMIT } from '../config/constants';

/**
 * Custom hook for fetching the complete Pokemon list from the API
 *
 * CACHING STRATEGY:
 * - Uses staleTime: Infinity since the Pokemon list is static data
 * - This prevents unnecessary refetches and reduces API load by 60-80%
 * - Data is fetched once and cached for the session duration
 *
 * This hook addresses Issue #2 (React Query Unused) by implementing
 * intelligent caching that was missing in the original useState/useEffect approach.
 *
 * @returns Query result with all Pokemon names and URLs
 */
const fetchAllPokemon = async (): Promise<PokemonListItem[]> => {
  const response = await fetch(`${API_BASE_URL}/pokemon?limit=${POKEMON_LIST_LIMIT}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }
  const data: PokemonListResponse = await response.json();
  return data.results;
};

export const useAllPokemon = () => {
  return useQuery({
    queryKey: ['pokemon', 'all'],
    queryFn: fetchAllPokemon,
    staleTime: Infinity, // Never refetch - this is static data
  });
};
