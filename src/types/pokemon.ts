// Pokemon API response types

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  results: PokemonListItem[];
}

// API response for individual Pokemon
export interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
  types: Array<{
    type: { name: string };
  }>;
  stats: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
  abilities: Array<{
    ability: { name: string };
  }>;
  height: number;
  weight: number;
  species: {
    url: string;
  };
}

// Enriched Pokemon data used in the app
export interface PokemonFullData {
  id: number;
  name: string;
  url: string;
  image: string | null;
  sprites: PokemonDetails['sprites'];
  types: PokemonDetails['types'];
  stats: PokemonDetails['stats'];
  abilities: PokemonDetails['abilities'];
  height: number;
  weight: number;
  description: string;
}
