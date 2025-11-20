// API Configuration
export const API_BASE_URL = "https://pokeapi.co/api/v2"; //api base url
export const POKEMON_LIST_LIMIT = 1000; //limit the number of pokemon to 1000
export const RANDOM_POKEMON_COUNT = 10; //randomly select 10 pokemon from the list

// Cache Configuration
export const CACHE_STALE_TIME = 5 * 60 * 1000; // 5 minutes
export const CACHE_GC_TIME = 10 * 60 * 1000; // 10 minutes
export const QUERY_RETRY_COUNT = 2; //retry the query 2 times if it fails

// Pokemon Type Colors
export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

export const getTypeColor = (type: string): string => {
  return TYPE_COLORS[type] || '#777';
};
