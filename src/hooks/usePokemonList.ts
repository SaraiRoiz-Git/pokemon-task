import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PokemonListItem, PokemonFullData } from "../types/pokemon";
import { getRandomElements } from "../utils/array";
import { RANDOM_POKEMON_COUNT } from "../config/constants";
import { useAllPokemon } from "./useAllPokemon";
import { fetchMultiplePokemonDetails } from "./usePokemonDetails";

/**
 * Fetches random Pokemon with full details
 * @param pokemonList - Full list of available Pokemon
 * @returns Array of random Pokemon with full data
 */
const fetchRandomPokemonFullData = async (
  pokemonList: PokemonListItem[]
): Promise<PokemonFullData[]> => {
  // Get random Pokemon from cached list
  const randomPokemon = getRandomElements(pokemonList, RANDOM_POKEMON_COUNT);

  // Fetch full details for random Pokemon in parallel
  return fetchMultiplePokemonDetails(randomPokemon);
};

export const usePokemonList = () => {
  const queryClient = useQueryClient();
  const { data: allPokemon } = useAllPokemon(); // get all pokemon from the API data will be cached in the query client by the useAllPokemon hook so we don't need to fetch it again

  const query = useQuery({
    queryKey: ["pokemon", "list"],
    queryFn: () => fetchRandomPokemonFullData(allPokemon!),
    enabled: !!allPokemon, // only run when allPokemon is loaded
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["pokemon", "list"] });
  };

  return {
    ...query,
    refresh,
  };
};
