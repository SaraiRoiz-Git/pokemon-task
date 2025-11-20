import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  SPECIES_URL,
  createMockPokemon,
  createMockPokemonDetails,
  createMockSpeciesData,
  mockFetch,
  mockAllPokemonReady,
  renderUsePokemonList,
  waitForLoadingComplete,
} from './helpers/pokemonTestUtils';

vi.mock('../useAllPokemon', () => ({
  useAllPokemon: vi.fn(),
}));

describe('usePokemonList - Data Transformation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should correctly transform Pokemon data with all fields', async () => {
    mockAllPokemonReady([createMockPokemon(25, 'pikachu')]);

    const mockDetails = {
      id: 25,
      name: 'pikachu',
      sprites: { front_default: 'pikachu-sprite.png' },
      types: [{ type: { name: 'electric' } }],
      stats: [
        { base_stat: 35, stat: { name: 'hp' } },
        { base_stat: 55, stat: { name: 'attack' } },
      ],
      abilities: [
        { ability: { name: 'static' } },
        { ability: { name: 'lightning-rod' } },
      ],
      height: 4,
      weight: 60,
      species: { url: SPECIES_URL(25) },
    };

    const mockSpecies = {
      flavor_text_entries: [
        { flavor_text: 'Electric Pokemon description', language: { name: 'en' } },
      ],
    };

    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/pokemon/25')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockDetails) });
      }
      if (url.includes('/pokemon-species/25')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSpecies) });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    const { result } = renderUsePokemonList();
    await waitForLoadingComplete(result);

    const pokemon = result.current.data![0];
    expect(pokemon).toMatchObject({
      id: 25,
      name: 'pikachu',
      image: 'pikachu-sprite.png',
      height: 4,
      weight: 60,
    });
    expect(pokemon.types).toHaveLength(1);
    expect(pokemon.stats).toHaveLength(2);
    expect(pokemon.abilities).toHaveLength(2);
    expect(pokemon.description).toContain('Electric');
  });

  describe('Description Fallback', () => {
    it('should use English description when available', async () => {
      mockAllPokemonReady([createMockPokemon(1, 'bulbasaur')]);

      mockFetch.mockImplementation((url: string) => {
        if (url.includes('/pokemon/1')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(createMockPokemonDetails(1, 'bulbasaur', 'grass')),
          });
        }
        if (url.includes('/pokemon-species/')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              flavor_text_entries: [
                { flavor_text: 'Japanese text', language: { name: 'ja' } },
                { flavor_text: 'English description', language: { name: 'en' } },
                { flavor_text: 'French text', language: { name: 'fr' } },
              ],
            }),
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const { result } = renderUsePokemonList();
      await waitForLoadingComplete(result);

      expect(result.current.data![0].description).toBe('English description');
    });

    it('should fallback to first entry when no English description', async () => {
      mockAllPokemonReady([createMockPokemon(1, 'bulbasaur')]);

      mockFetch.mockImplementation((url: string) => {
        if (url.includes('/pokemon/1')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(createMockPokemonDetails(1, 'bulbasaur', 'grass')),
          });
        }
        if (url.includes('/pokemon-species/')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              flavor_text_entries: [
                { flavor_text: 'Japanese text first', language: { name: 'ja' } },
                { flavor_text: 'French text', language: { name: 'fr' } },
              ],
            }),
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const { result } = renderUsePokemonList();
      await waitForLoadingComplete(result);

      expect(result.current.data![0].description).toBe('Japanese text first');
    });

    it('should use "No description" when no entries available', async () => {
      mockAllPokemonReady([createMockPokemon(1, 'bulbasaur')]);

      mockFetch.mockImplementation((url: string) => {
        if (url.includes('/pokemon/1')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(createMockPokemonDetails(1, 'bulbasaur', 'grass')),
          });
        }
        if (url.includes('/pokemon-species/')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ flavor_text_entries: [] }),
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const { result } = renderUsePokemonList();
      await waitForLoadingComplete(result);

      expect(result.current.data![0].description).toBe('No description');
    });
  });

  describe('Edge Cases', () => {
    it('should handle Pokemon with multiple types', async () => {
      mockAllPokemonReady([createMockPokemon(6, 'charizard')]);

      const multiTypeDetails = {
        id: 6,
        name: 'charizard',
        sprites: { front_default: 'charizard.png' },
        types: [
          { type: { name: 'fire' } },
          { type: { name: 'flying' } },
        ],
        stats: [{ base_stat: 78, stat: { name: 'hp' } }],
        abilities: [{ ability: { name: 'blaze' } }],
        height: 17,
        weight: 905,
        species: { url: SPECIES_URL(6) },
      };

      mockFetch.mockImplementation((url: string) => {
        if (url.includes('/pokemon/6')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(multiTypeDetails) });
        }
        if (url.includes('/pokemon-species/')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(createMockSpeciesData()) });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const { result } = renderUsePokemonList();
      await waitForLoadingComplete(result);

      expect(result.current.data![0].types).toHaveLength(2);
      expect(result.current.data![0].types[0].type.name).toBe('fire');
      expect(result.current.data![0].types[1].type.name).toBe('flying');
    });

    it('should handle Pokemon with null sprite', async () => {
      mockAllPokemonReady([createMockPokemon(1, 'bulbasaur')]);

      const noSpriteDetails = {
        ...createMockPokemonDetails(1, 'bulbasaur', 'grass'),
        sprites: { front_default: null },
      };

      mockFetch.mockImplementation((url: string) => {
        if (url.includes('/pokemon/1')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(noSpriteDetails) });
        }
        if (url.includes('/pokemon-species/')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(createMockSpeciesData()) });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const { result } = renderUsePokemonList();
      await waitForLoadingComplete(result);

      expect(result.current.data![0].image).toBeNull();
    });
  });
});
