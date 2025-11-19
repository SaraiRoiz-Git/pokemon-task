import { useQuery } from '@tanstack/react-query';
import { PokemonListResponse, PokemonListItem } from '../types/pokemon';
import { API_BASE_URL, POKEMON_LIST_LIMIT } from '../config/constants';

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
