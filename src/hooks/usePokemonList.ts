import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PokemonListItem,
  PokemonFullData,
  PokemonDetails,
} from "../types/pokemon";
import { getRandomElements } from "../utils/array";
import { RANDOM_POKEMON_COUNT } from "../config/constants";
import { useAllPokemon } from "./useAllPokemon";

/**
 * @returns Query result with Pokemon data, loading state, error state, and refresh function
 */

interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
  };
}

interface SpeciesData {
  flavor_text_entries: FlavorTextEntry[];
}

/**
 *
 * @param pokemonList - Array of Pokemon to fetch details for
 * @returns Array of Pokemon with full data including descriptions
 */
const fetchPokemonFullData = async (
  pokemonList: PokemonListItem[]
): Promise<PokemonFullData[]> => {
  // Get random Pokemon from cached list (uses extracted utility function - Issue #5)
  const randomPokemon = getRandomElements(pokemonList, RANDOM_POKEMON_COUNT);

  // Parallel fetching with Promise.all - 10x faster than sequential for-loop (Issue #1)
  const pokemonFullData = await Promise.all(
    randomPokemon.map(async (pokemon) => {
      // Fetch Pokemon details
      const detailResponse = await fetch(pokemon.url);
      if (!detailResponse.ok) {
        throw new Error(`Failed to fetch details for ${pokemon.name}`);
      }
      const details: PokemonDetails = await detailResponse.json();

      // Fetch species data for description
      const speciesResponse = await fetch(details.species.url);
      if (!speciesResponse.ok) {
        //if the species response is not ok, throw an error
        throw new Error(`Failed to fetch species for ${pokemon.name}`); //throw an error with the pokemon name
      }
      const speciesData: SpeciesData = await speciesResponse.json();

      // Find English description or fallback
      const englishEntry = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      );
      //return the pokemon data with the id, name, url, image, sprites, types, stats, abilities, height, weight, and description
      return {
        id: details.id,
        name: pokemon.name,
        url: pokemon.url,
        image: details.sprites.front_default,
        sprites: details.sprites,
        types: details.types,
        stats: details.stats,
        abilities: details.abilities,
        height: details.height,
        weight: details.weight,
        description:
          englishEntry?.flavor_text ||
          speciesData.flavor_text_entries[0]?.flavor_text ||
          "No description",
      };
    })
  );

  return pokemonFullData;
};

export const usePokemonList = () => {
  const queryClient = useQueryClient();
  const { data: allPokemon } = useAllPokemon(); // get all pokemon from the API data will be cached in the query client by the useAllPokemon hook so we don't need to fetch it again

  const query = useQuery({
    queryKey: ["pokemon", "list"],
    queryFn: () => fetchPokemonFullData(allPokemon!),
    enabled: !!allPokemon, // Only run when allPokemon is loaded
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["pokemon", "list"] });
  };

  return {
    ...query,
    refresh,
  };
};
