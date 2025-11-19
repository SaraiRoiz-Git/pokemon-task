export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  results: PokemonListItem[];
}

export interface PokemonSprites {
  front_default: string;
}

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
  };
}

export interface PokemonDetails {
  id: number;
  name: string;
  sprites: PokemonSprites;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  height: number;
  weight: number;
  species: {
    url: string;
  };
}

export interface PokemonWithImage {
  name: string;
  url: string;
  image: string;
}

export interface PokemonFullData {
  id: number;
  name: string;
  url: string;
  image: string;
  sprites: PokemonSprites;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  height: number;
  weight: number;
  description: string;
}

export interface PokemonWithDescription extends PokemonDetails {
  description: string;
}
