import { useQuery } from "@tanstack/react-query";
import { PokemonListResponse, PokemonListItem } from "../types/pokemon";
import { API_BASE_URL, POKEMON_LIST_LIMIT } from "../config/constants";

/**
 * @returns Query result with all Pokemon names and URLs
 */
const fetchAllPokemon = async (): Promise<PokemonListItem[]> => {
  const response = await fetch(
    `${API_BASE_URL}/pokemon?limit=${POKEMON_LIST_LIMIT}`
  ); //create vars to aviod hardcoding the url
  if (!response.ok) {
    //add chek for response
    throw new Error("Failed to fetch Pokemon list"); //add throw error for response not ok
  }
  const data: PokemonListResponse = await response.json();
  return data.results;
};

export const useAllPokemon = () => {
  return useQuery({
    queryKey: ["pokemon", "all"], //query key to identify the query
    queryFn: fetchAllPokemon,
    staleTime: Infinity, // never refetch - this is static data
  });
};
