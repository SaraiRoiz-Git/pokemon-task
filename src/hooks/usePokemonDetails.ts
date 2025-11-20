import { PokemonListItem, PokemonFullData, PokemonDetails } from '../types/pokemon';

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
 * @param pokemon 
 * @returns 
 */
export const fetchPokemonDetails = async (
  pokemon: PokemonListItem
): Promise<PokemonFullData> => {
  try {
    // Fetch Pokemon details
    const detailResponse = await fetch(pokemon.url);
    if (!detailResponse.ok) {
      throw new Error(`HTTP ${detailResponse.status}`);
    }
    const details: PokemonDetails = await detailResponse.json();

    // Fetch species data for description
    const speciesResponse = await fetch(details.species.url);
    if (!speciesResponse.ok) {//add check for response
      throw new Error(`Species HTTP ${speciesResponse.status}`);//add throw error for response not ok
    }
    const speciesData: SpeciesData = await speciesResponse.json();

    // Find English description or fallback
    const englishEntry = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === 'en'
    );

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
        'No description',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to fetch Pokemon ${pokemon.name}: ${message}`);
  }
};

/**
 * Fetches full data for multiple Pokemon in parallel
 * @param pokemonList - Array of basic Pokemon info
 * @returns Array of full Pokemon data
 */
export const fetchMultiplePokemonDetails = async (
  pokemonList: PokemonListItem[]
): Promise<PokemonFullData[]> => {
  return Promise.all(pokemonList.map(fetchPokemonDetails));//use promise all to fetch multiple pokemon details in parallel
};
